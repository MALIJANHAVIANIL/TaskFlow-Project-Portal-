/**
 * 404 Not Found middleware.
 * Catches requests to undefined routes and forwards a descriptive error.
 */
const notFound = (req, res, next) => {
  const error = new Error(`Not Found — ${req.method} ${req.originalUrl}`);
  res.status(404);
  next(error);
};

/**
 * Global error handler middleware.
 * Returns a consistent JSON error response. Includes the stack trace
 * only in development mode for debugging.
 */
const errorHandler = (err, req, res, next) => {
  // If status is still 200, default to 500 (internal server error)
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
  });
};

module.exports = { notFound, errorHandler };
