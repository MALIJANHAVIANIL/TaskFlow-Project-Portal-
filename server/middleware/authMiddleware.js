const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Authentication middleware.
 * Verifies the JWT from cookies or Authorization header and attaches
 * the authenticated user to req.user (password excluded).
 */
const protect = async (req, res, next) => {
  let token;

  // 1. Check for token in cookies
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }
  // 2. Fallback: check Authorization header (Bearer <token>)
  else if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  // No token found — reject the request
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, no token provided',
    });
  }

  try {
    // Verify the token and extract the payload
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the user document (excluding password) to the request
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized, user not found',
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error.message);
    return res.status(401).json({
      success: false,
      message: 'Not authorized, token is invalid or expired',
    });
  }
};

module.exports = { protect };
