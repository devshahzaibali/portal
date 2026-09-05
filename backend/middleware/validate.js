const { validationResult } = require('express-validator');

// Run after express-validator check(...) chains in a route.
// If any validation failed, respond with a clean 400 instead of letting
// the controller run with bad data.
module.exports = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: errors.array()[0].msg,
      errors: errors.array(),
    });
  }
  next();
};
