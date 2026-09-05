const Company = require('../models/Company');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

exports.createCompany = catchAsync(async (req, res, next) => {
  const existing = await Company.findOne({ owner: req.user._id });
  if (existing) {
    return next(new AppError('You already have a company profile. Update it instead.', 400));
  }

  const { name, website, location, description } = req.body;
  const company = await Company.create({
    owner: req.user._id,
    name,
    website,
    location,
    description,
  });

  res.status(201).json({
    success: true,
    message: 'Company created. Awaiting admin approval.',
    data: company,
  });
});

exports.getMyCompany = catchAsync(async (req, res, next) => {
  const company = await Company.findOne({ owner: req.user._id });
  if (!company) {
    return next(new AppError('You have not created a company profile yet.', 404));
  }

  res.status(200).json({
    success: true,
    message: 'Company fetched',
    data: company,
  });
});

exports.updateCompany = catchAsync(async (req, res, next) => {
  const company = await Company.findById(req.params.id);
  if (!company) {
    return next(new AppError('Company not found.', 404));
  }

  if (company.owner.toString() !== req.user._id.toString()) {
    return next(new AppError('You can only update your own company.', 403));
  }

  const allowedFields = ['name', 'website', 'location', 'description'];
  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) company[field] = req.body[field];
  });

  // Editing a company profile resets it back to pending review, since the
  // admin approved the previous version, not this one.
  if (allowedFields.some((f) => req.body[f] !== undefined)) {
    company.approvalStatus = 'pending';
  }

  await company.save();

  res.status(200).json({
    success: true,
    message: 'Company updated. Awaiting re-approval.',
    data: company,
  });
});
