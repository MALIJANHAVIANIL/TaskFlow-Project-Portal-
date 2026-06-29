const rateLimit = require('express-rate-limit');

/**
 * General rate limiter — applied globally to all routes.
 * Allows 100 requests per 15-minute window per IP.
 */
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
  message: {
    success: false,
    message: 'Too many requests, please try again after 15 minutes',
  },
});

/**
 * Auth rate limiter — applied to login and register routes.
 * Allows 20 requests per 15-minute window per IP to prevent brute-force attacks.
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again after 15 minutes',
  },
});

module.exports = { generalLimiter, authLimiter };
