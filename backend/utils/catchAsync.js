// Wraps async controller functions so any thrown/rejected error
// is forwarded to Express's error handler instead of crashing the process.
module.exports = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
