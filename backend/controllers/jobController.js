const Job = require('../models/Job');
const Company = require('../models/Company');
const Application = require('../models/Application');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const APIFeatures = require('../utils/apiFeatures');

exports.createJob = catchAsync(async (req, res, next) => {
  const company = await Company.findOne({ owner: req.user._id });
  if (!company) {
    return next(new AppError('You must create a company profile before posting jobs.', 400));
  }
  if (company.approvalStatus !== 'approved') {
    return next(new AppError('Your company must be approved by an admin before you can post jobs.', 403));
  }

  const { title, description, skills, type, workMode, location, salaryMin, salaryMax, deadline } = req.body;

  const job = await Job.create({
    company: company._id,
    recruiter: req.user._id,
    title,
    description,
    skills,
    type,
    workMode,
    location,
    salaryMin,
    salaryMax,
    deadline,
    status: 'pending',
  });

  res.status(201).json({
    success: true,
    message: 'Job created. Awaiting admin approval.',
    data: job,
  });
});

exports.getMyJobs = catchAsync(async (req, res, next) => {
  const jobs = await Job.find({ recruiter: req.user._id })
    .populate('company', 'name location')
    .sort('-createdAt');

  res.status(200).json({
    success: true,
    message: 'Recruiter jobs fetched',
    data: jobs,
  });
});

exports.getJobs = catchAsync(async (req, res, next) => {
  // Public listing — approved jobs only, no matter what filters are passed.
  const baseQuery = Job.find({ status: 'approved' }).populate('company', 'name location');

  const features = new APIFeatures(baseQuery, req.query).filter().sort();
  await features.paginate();

  const [results, total] = await Promise.all([
    features.query,
    Job.countDocuments({ status: 'approved', ...buildCountFilter(req.query) }),
  ]);

  res.status(200).json({
    success: true,
    message: 'Jobs fetched',
    data: {
      results,
      total,
      page: features.page,
      totalPages: Math.ceil(total / features.limit),
    },
  });
});

// Rebuilds the same filter used in APIFeatures.filter() so countDocuments()
// matches the same conditions as the paginated find().
function buildCountFilter(queryString) {
  const { keyword, location, workMode, type, skills } = queryString;
  const filters = {};
  if (keyword) {
    filters.$or = [
      { title: { $regex: keyword, $options: 'i' } },
      { description: { $regex: keyword, $options: 'i' } },
    ];
  }
  if (location) filters.location = { $regex: location, $options: 'i' };
  if (workMode) filters.workMode = workMode;
  if (type) filters.type = type;
  if (skills) filters.skills = { $in: skills.split(',').map((s) => s.trim()) };
  return filters;
}

exports.getJobById = catchAsync(async (req, res, next) => {
  const job = await Job.findById(req.params.id).populate('company', 'name location website');
  if (!job) {
    return next(new AppError('Job not found.', 404));
  }

  const isOwnerOrAdmin =
    req.user && (req.user.role === 'admin' || job.recruiter.toString() === req.user._id.toString());

  if (job.status !== 'approved' && !isOwnerOrAdmin) {
    return next(new AppError('Job not found.', 404));
  }

  res.status(200).json({
    success: true,
    message: 'Job fetched',
    data: job,
  });
});

exports.updateJob = catchAsync(async (req, res, next) => {
  const job = await Job.findById(req.params.id);
  if (!job) {
    return next(new AppError('Job not found.', 404));
  }

  if (job.recruiter.toString() !== req.user._id.toString()) {
    return next(new AppError('You can only update your own job listings.', 403));
  }

  if (req.body.status !== undefined) {
    return next(new AppError('Only an admin can change job approval status.', 403));
  }

  const allowedFields = ['title', 'description', 'skills', 'type', 'workMode', 'location', 'salaryMin', 'salaryMax', 'deadline'];
  const hasEdit = allowedFields.some((f) => req.body[f] !== undefined);
  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) job[field] = req.body[field];
  });

  // Recruiters cannot self-approve. Any content edit sends it back to pending
  // review so an admin has to look at it again.
  if (hasEdit) {
    job.status = 'pending';
  }

  await job.save();

  res.status(200).json({
    success: true,
    message: 'Job updated. Awaiting re-approval.',
    data: job,
  });
});

exports.deleteJob = catchAsync(async (req, res, next) => {
  const job = await Job.findById(req.params.id);
  if (!job) {
    return next(new AppError('Job not found.', 404));
  }

  if (job.recruiter.toString() !== req.user._id.toString()) {
    return next(new AppError('You can only delete your own job listings.', 403));
  }

  await job.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Job deleted',
    data: null,
  });
});

exports.approveJob = catchAsync(async (req, res, next) => {
  const { status } = req.body;
  if (!['approved', 'rejected'].includes(status)) {
    return next(new AppError('Status must be either approved or rejected.', 400));
  }

  const job = await Job.findByIdAndUpdate(req.params.id, { status }, { new: true, runValidators: true });
  if (!job) {
    return next(new AppError('Job not found.', 404));
  }

  res.status(200).json({
    success: true,
    message: `Job ${status}`,
    data: job,
  });
});

exports.getJobApplications = catchAsync(async (req, res, next) => {
  const job = await Job.findById(req.params.id);
  if (!job) {
    return next(new AppError('Job not found.', 404));
  }

  if (job.recruiter.toString() !== req.user._id.toString()) {
    return next(new AppError('You can only view applicants for your own jobs.', 403));
  }

  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  const [results, total] = await Promise.all([
    Application.find({ job: job._id })
      .populate('candidate', 'name email')
      .sort('-createdAt')
      .skip(skip)
      .limit(limit),
    Application.countDocuments({ job: job._id }),
  ]);

  res.status(200).json({
    success: true,
    message: 'Applicants fetched',
    data: {
      results,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    },
  });
});
