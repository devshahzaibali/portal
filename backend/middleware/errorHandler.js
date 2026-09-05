const AppError = require('../utils/AppError');

// Converts common Mongoose/Mongo errors into clean AppError instances
// so the client never sees a raw driver error message.
const handleCastErrorDB = (err) => {
  return new AppError(`Invalid ${err.path}: ${err.value}`, 400);
};

const handleDuplicateFieldsDB = (err) => {
  // Special-case the Application unique index so the message is meaningful
  // instead of a raw Mongo duplicate-key dump.
  if (err.keyPattern && err.keyPattern.job && err.keyPattern.candidate) {
    return new AppError('You have already applied to this job.', 400);
  }
  const field = Object.keys(err.keyValue || {})[0];
  return new AppError(`Duplicate value for field: ${field}. Please use another value.`, 400);
};

const handleValidationErrorDB = (err) => {
  const messages = Object.values(err.errors).map((el) => el.message);
  return new AppError(messages.join('. '), 400);
};

const handleJWTError = () => new AppError('Invalid token. Please log in again.', 401);
const handleJWTExpiredError = () => new AppError('Your session has expired. Please log in again.', 401);

module.exports = (err, req, res, next) => {
  let error = { ...err, message: err.message };
  error.statusCode = err.statusCode || 500;

  if (err.name === 'CastError') error = handleCastErrorDB(err);
  if (err.code === 11000) error = handleDuplicateFieldsDB(err);
  if (err.name === 'ValidationError') error = handleValidationErrorDB(err);
  if (err.name === 'JsonWebTokenError') error = handleJWTError();
  if (err.name === 'TokenExpiredError') error = handleJWTExpiredError();
  if (err.name === 'MulterError') {
    error = new AppError(err.code === 'LIMIT_FILE_SIZE' ? 'Resume file must be under 5 MB.' : err.message, 400);
    error.statusCode = 400;
    error.isOperational = true;
  }

  const statusCode = error.statusCode || 500;
  const message = error.isOperational ? error.message : (statusCode === 500 ? 'Something went wrong on the server.' : error.message);

  const response = {
    success: false,
    message,
  };

  if (process.env.NODE_ENV === 'development' && statusCode === 500) {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};
