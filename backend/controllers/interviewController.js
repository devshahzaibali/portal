const Interview = require('../models/Interview');
const Application = require('../models/Application');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

exports.scheduleInterview = catchAsync(async (req, res, next) => {
  const application = await Application.findById(req.params.applicationId).populate('job');
  if (!application) {
    return next(new AppError('Application not found.', 404));
  }

  if (application.job.recruiter.toString() !== req.user._id.toString()) {
    return next(new AppError('You can only schedule interviews for your own job listings.', 403));
  }

  const { scheduledAt, mode, meetingDetails, notes } = req.body;

  const interview = await Interview.create({
    application: application._id,
    scheduledAt,
    mode,
    meetingDetails,
    notes,
  });

  // Move the application into the "interview" stage automatically, unless it's
  // already past that point in the pipeline.
  if (!['offered', 'hired', 'rejected'].includes(application.status)) {
    application.status = 'interview';
    await application.save();
  }

  res.status(201).json({
    success: true,
    message: 'Interview scheduled',
    data: interview,
  });
});

exports.getInterviewForApplication = catchAsync(async (req, res, next) => {
  const application = await Application.findById(req.params.applicationId).populate('job');
  if (!application) {
    return next(new AppError('Application not found.', 404));
  }

  const isCandidate = application.candidate.toString() === req.user._id.toString();
  const isOwningRecruiter = application.job.recruiter.toString() === req.user._id.toString();
  const isAdmin = req.user.role === 'admin';

  if (!isCandidate && !isOwningRecruiter && !isAdmin) {
    return next(new AppError('You do not have access to this interview.', 403));
  }

  const interview = await Interview.findOne({ application: application._id });
  if (!interview) {
    return next(new AppError('No interview scheduled for this application yet.', 404));
  }

  res.status(200).json({
    success: true,
    message: 'Interview fetched',
    data: interview,
  });
});

exports.updateInterview = catchAsync(async (req, res, next) => {
  const interview = await Interview.findById(req.params.id).populate({
    path: 'application',
    populate: { path: 'job' },
  });
  if (!interview) {
    return next(new AppError('Interview not found.', 404));
  }

  if (interview.application.job.recruiter.toString() !== req.user._id.toString()) {
    return next(new AppError('You can only update interviews for your own job listings.', 403));
  }

  const allowedFields = ['scheduledAt', 'mode', 'meetingDetails', 'notes'];
  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) interview[field] = req.body[field];
  });

  await interview.save();

  res.status(200).json({
    success: true,
    message: 'Interview updated',
    data: interview,
  });
});
