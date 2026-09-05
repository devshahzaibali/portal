const mongoose = require('mongoose');
const Application = require('../models/Application');
const Job = require('../models/Job');
const Company = require('../models/Company');
const User = require('../models/User');
const catchAsync = require('../utils/catchAsync');

// Turns an aggregation's [{ _id: 'applied', count: 3 }, ...] into
// { applied: 3, shortlisted: 0, ... } with every known status present,
// so the frontend never has to guess which keys exist.
const fillStatusCounts = (grouped, allStatuses) => {
  const counts = {};
  allStatuses.forEach((s) => (counts[s] = 0));
  grouped.forEach((g) => {
    counts[g._id] = g.count;
  });
  return counts;
};

exports.candidateDashboard = catchAsync(async (req, res, next) => {
  const candidateId = req.user._id;

  const [totalApplications, groupedByStatus, recentApplications] = await Promise.all([
    Application.countDocuments({ candidate: candidateId }),
    Application.aggregate([
      { $match: { candidate: candidateId } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]),
    Application.find({ candidate: candidateId })
      .populate({ path: 'job', select: 'title company', populate: { path: 'company', select: 'name' } })
      .sort('-createdAt')
      .limit(5),
  ]);

  const statusCounts = fillStatusCounts(groupedByStatus, [
    'applied', 'shortlisted', 'interview', 'offered', 'hired', 'rejected',
  ]);

  res.status(200).json({
    success: true,
    message: 'Candidate dashboard fetched',
    data: {
      summaryCards: {
        totalApplications,
        shortlisted: statusCounts.shortlisted,
        interviewsScheduled: statusCounts.interview,
        offersReceived: statusCounts.offered + statusCounts.hired,
      },
      applicationsByStatus: statusCounts,
      recentApplications,
    },
  });
});

exports.recruiterDashboard = catchAsync(async (req, res, next) => {
  const recruiterId = req.user._id;

  const jobs = await Job.find({ recruiter: recruiterId }).select('_id');
  const jobIds = jobs.map((j) => j._id);

  const [totalJobs, totalApplicants, groupedByStatus, recentApplicants] = await Promise.all([
    Job.countDocuments({ recruiter: recruiterId }),
    Application.countDocuments({ job: { $in: jobIds } }),
    Application.aggregate([
      { $match: { job: { $in: jobIds } } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]),
    Application.find({ job: { $in: jobIds } })
      .populate('candidate', 'name email')
      .populate('job', 'title')
      .sort('-createdAt')
      .limit(5),
  ]);

  const statusCounts = fillStatusCounts(groupedByStatus, [
    'applied', 'shortlisted', 'interview', 'offered', 'hired', 'rejected',
  ]);

  res.status(200).json({
    success: true,
    message: 'Recruiter dashboard fetched',
    data: {
      summaryCards: {
        totalJobs,
        totalApplicants,
        activeShortlisted: statusCounts.shortlisted + statusCounts.interview,
        hired: statusCounts.hired,
      },
      applicantsByStatus: statusCounts,
      recentApplicants,
    },
  });
});

exports.adminDashboard = catchAsync(async (req, res, next) => {
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const [usersByRole, pendingCompanies, pendingJobs, jobsThisMonth, totalUsers] = await Promise.all([
    User.aggregate([{ $group: { _id: '$role', count: { $sum: 1 } } }]),
    Company.countDocuments({ approvalStatus: 'pending' }),
    Job.countDocuments({ status: 'pending' }),
    Job.countDocuments({ createdAt: { $gte: startOfMonth } }),
    User.countDocuments(),
  ]);

  const roleCounts = fillStatusCounts(usersByRole, ['candidate', 'recruiter', 'admin']);

  res.status(200).json({
    success: true,
    message: 'Admin dashboard fetched',
    data: {
      summaryCards: {
        totalUsers,
        pendingCompanyApprovals: pendingCompanies,
        pendingJobApprovals: pendingJobs,
        jobsPostedThisMonth: jobsThisMonth,
      },
      usersByRole: roleCounts,
    },
  });
});
