const jwt = require('jsonwebtoken');
const User = require('../models/User');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const sanitizeUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  isActive: user.isActive,
  createdAt: user.createdAt,
});

exports.register = catchAsync(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  // Never allow public self-registration as admin.
  if (role === 'admin') {
    return next(new AppError('You cannot register as an admin.', 403));
  }

  const existing = await User.findOne({ email });
  if (existing) {
    return next(new AppError('An account with this email already exists.', 400));
  }

  const user = await User.create({ name, email, password, role });
  const token = signToken(user._id);

  res.status(201).json({
    success: true,
    message: 'Registration successful',
    data: { token, user: sanitizeUser(user) },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Please provide email and password.', 400));
  }

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    return next(new AppError('Incorrect email or password.', 401));
  }

  if (!user.isActive) {
    return next(new AppError('This account has been deactivated.', 401));
  }

  const token = signToken(user._id);

  res.status(200).json({
    success: true,
    message: 'Login successful',
    data: { token, user: sanitizeUser(user) },
  });
});

exports.getMe = catchAsync(async (req, res, next) => {
  res.status(200).json({
    success: true,
    message: 'Current user fetched',
    data: sanitizeUser(req.user),
  });
});
