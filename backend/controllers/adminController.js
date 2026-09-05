const Company = require('../models/Company');
const User = require('../models/User');
const Job = require('../models/Job');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

exports.getCompanies = catchAsync(async (req, res, next) => {
  const filter = {};
  if (req.query.status) filter.approvalStatus = req.query.status;

  const companies = await Company.find(filter).populate('owner', 'name email').sort('-createdAt');

  res.status(200).json({
    success: true,
    message: 'Companies fetched',
    data: companies,
  });
});

exports.approveCompany = catchAsync(async (req, res, next) => {
  const { approvalStatus } = req.body;
  if (!['approved', 'rejected'].includes(approvalStatus)) {
    return next(new AppError('approvalStatus must be either approved or rejected.', 400));
  }

  const company = await Company.findByIdAndUpdate(
    req.params.id,
    { approvalStatus },
    { new: true, runValidators: true }
  );
  if (!company) {
    return next(new AppError('Company not found.', 404));
  }

  res.status(200).json({
    success: true,
    message: `Company ${approvalStatus}`,
    data: company,
  });
});

exports.getUsers = catchAsync(async (req, res, next) => {
  const filter = {};
  if (req.query.role) filter.role = req.query.role;

  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  const [results, total] = await Promise.all([
    User.find(filter).sort('-createdAt').skip(skip).limit(limit),
    User.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    message: 'Users fetched',
    data: {
      results,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    },
  });
});

exports.deactivateUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new AppError('User not found.', 404));
  }

  user.isActive = false;
  await user.save();

  res.status(200).json({
    success: true,
    message: 'User deactivated',
    data: { _id: user._id, isActive: user.isActive },
  });
});

exports.getJobsForModeration = catchAsync(async (req, res, next) => {
  const filter = {};
  if (req.query.status) filter.status = req.query.status;

  const jobs = await Job.find(filter).populate('company', 'name').populate('recruiter', 'name email').sort('-createdAt');

  res.status(200).json({
    success: true,
    message: 'Jobs fetched',
    data: jobs,
  });
});
