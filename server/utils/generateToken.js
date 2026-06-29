const jwt = require('jsonwebtoken');

/**
 * Generate a JWT for the given user and set it as an httpOnly cookie.
 *
 * @param {string} userId - The MongoDB ObjectId of the user.
 * @param {object} res - Express response object to attach the cookie to.
 * @returns {string} The generated JWT string.
 */
const generateToken = (userId, res) => {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });

  // Set the JWT as an httpOnly cookie for secure, automatic transmission
  res.cookie('token', token, {
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days in milliseconds
    httpOnly: true, // Prevent XSS — cookie not accessible via JavaScript
    secure: process.env.NODE_ENV === 'production', // HTTPS only in production
    sameSite: 'strict', // Prevent CSRF
  });

  return token;
};

module.exports = generateToken;
