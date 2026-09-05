const Application = require('../models/Application');
const Job = require('../models/Job');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

const TERMINAL_STATUSES = ['hired', 'rejected'];

exports.applyToJob = catchAsync(async (req, res, next) => {
  const job = await Job.findById(req.params.jobId);
  if (!job) {
    return next(new AppError('Job not found.', 404));
  }

  if (job.status !== 'approved') {
    return next(new AppError('This job is not open for applications.', 400));
  }

  if (job.deadline && new Date(job.deadline) < new Date()) {
    return next(new AppError('The application deadline for this job has passed.', 400));
  }

  const {
    fullName,
    email,
    phone,
    linkedIn,
    portfolioUrl,
    currentRole,
    yearsOfExperience,
    coverNote,
    resumeUrl,
  } = req.body;

  if (!fullName?.trim()) {
    return next(new AppError('Full name is required.', 400));
  }
  if (!email?.trim()) {
    return next(new AppError('Email is required.', 400));
  }
  if (!phone?.trim()) {
    return next(new AppError('Phone number is required.', 400));
  }

  let finalResumeUrl = resumeUrl?.trim() || '';
  let resumeFileName = '';
  let resumeSource = 'url';

  if (req.file) {
    finalResumeUrl = `/uploads/resumes/${req.file.filename}`;
    resumeFileName = req.file.originalname;
    resumeSource = 'file';
  } else if (!finalResumeUrl) {
    return next(new AppError('Please provide a resume file or resume URL.', 400));
  }

  try {
    const application = await Application.create({
      job: job._id,
      candidate: req.user._id,
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      linkedIn: linkedIn?.trim(),
      portfolioUrl: portfolioUrl?.trim(),
      currentRole: currentRole?.trim(),
      yearsOfExperience: yearsOfExperience ? Number(yearsOfExperience) : undefined,
      coverNote: coverNote?.trim(),
      resumeUrl: finalResumeUrl,
      resumeFileName,
      resumeSource,
    });

    res.status(201).json({
      success: true,
      message: 'Application submitted',
      data: application,
    });
  } catch (err) {
    if (err.code === 11000) {
      return next(new AppError('You have already applied to this job.', 409));
    }
    throw err;
  }
});

exports.getMyApplications = catchAsync(async (req, res, next) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  const [results, total] = await Promise.all([
    Application.find({ candidate: req.user._id })
      .populate({ path: 'job', select: 'title type workMode location deadline status company', populate: { path: 'company', select: 'name' } })
      .sort('-createdAt')
      .skip(skip)
      .limit(limit),
    Application.countDocuments({ candidate: req.user._id }),
  ]);

  res.status(200).json({
    success: true,
    message: 'Applications fetched',
    data: {
      results,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    },
  });
});

exports.getApplicationById = catchAsync(async (req, res, next) => {
  const application = await Application.findById(req.params.id)
    .populate('job')
    .populate('candidate', 'name email');

  if (!application) {
    return next(new AppError('Application not found.', 404));
  }

  const isCandidate = application.candidate._id.toString() === req.user._id.toString();
  const isOwningRecruiter =
    req.user.role === 'recruiter' && application.job.recruiter.toString() === req.user._id.toString();
  const isAdmin = req.user.role === 'admin';

  if (!isCandidate && !isOwningRecruiter && !isAdmin) {
    return next(new AppError('You do not have access to this application.', 403));
  }

  res.status(200).json({
    success: true,
    message: 'Application fetched',
    data: application,
  });
});

exports.updateApplicationStatus = catchAsync(async (req, res, next) => {
  const { status } = req.body;
  const validStatuses = ['applied', 'shortlisted', 'interview', 'offered', 'hired', 'rejected'];
  if (!validStatuses.includes(status)) {
    return next(new AppError('Invalid application status.', 400));
  }

  const application = await Application.findById(req.params.id).populate('job');
  if (!application) {
    return next(new AppError('Application not found.', 404));
  }

  const isOwningRecruiter = application.job.recruiter.toString() === req.user._id.toString();
  const isAdmin = req.user.role === 'admin';

  if (!isOwningRecruiter && !isAdmin) {
    return next(new AppError('You can only manage applications for your own job listings.', 403));
  }

  if (TERMINAL_STATUSES.includes(application.status) && !isAdmin) {
    return next(
      new AppError(`This application is already ${application.status}, which is final. Contact an admin to correct it.`, 400)
    );
  }

  if (isAdmin && TERMINAL_STATUSES.includes(application.status)) {
    console.log(
      `[ADMIN OVERRIDE] Admin ${req.user._id} changed application ${application._id} from terminal status "${application.status}" to "${status}"`
    );
  }

  application.status = status;
  await application.save();

  res.status(200).json({
    success: true,
    message: 'Application status updated',
    data: application,
  });
});
