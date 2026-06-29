const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
const register = [
  // --- Input validation rules ---
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),

  // --- Handler ---
  async (req, res, next) => {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400);
        throw new Error(
          errors
            .array()
            .map((e) => e.msg)
            .join(', ')
        );
      }

      const { name, email, password } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        res.status(400);
        throw new Error('A user with this email already exists');
      }

      // Create the user (password hashing handled by pre-save hook)
      const user = await User.create({ name, email, password });

      // Generate JWT and set cookie
      const token = generateToken(user._id, res);

      res.status(201).json({
        success: true,
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          role: user.role,
          createdAt: user.createdAt,
        },
      });
    } catch (error) {
      next(error);
    }
  },
];

/**
 * @desc    Login an existing user
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = [
  // --- Input validation rules ---
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),

  // --- Handler ---
  async (req, res, next) => {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400);
        throw new Error(
          errors
            .array()
            .map((e) => e.msg)
            .join(', ')
        );
      }

      const { email, password } = req.body;

      // Find user and explicitly select the password field
      const user = await User.findOne({ email }).select('+password');
      if (!user) {
        res.status(401);
        throw new Error('Invalid email or password');
      }

      // Compare candidate password with stored hash
      const isMatch = await user.matchPassword(password);
      if (!isMatch) {
        res.status(401);
        throw new Error('Invalid email or password');
      }

      // Generate JWT and set cookie
      const token = generateToken(user._id, res);

      res.status(200).json({
        success: true,
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          role: user.role,
          createdAt: user.createdAt,
        },
      });
    } catch (error) {
      next(error);
    }
  },
];

/**
 * @desc    Logout the current user (clear cookie)
 * @route   POST /api/auth/logout
 * @access  Private
 */
const logout = async (req, res, next) => {
  try {
    // Clear the token cookie by setting it to empty with immediate expiry
    res.cookie('token', '', {
      httpOnly: true,
      expires: new Date(0),
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get the current user's profile
 * @route   GET /api/auth/profile
 * @access  Private
 */
const getProfile = async (req, res, next) => {
  try {
    // req.user is set by the protect middleware (password already excluded)
    res.status(200).json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update the current user's profile
 * @route   PUT /api/auth/profile
 * @access  Private
 */
const updateProfile = async (req, res, next) => {
  try {
    // Fetch full user document (need password field for potential update)
    const user = await User.findById(req.user._id).select('+password');

    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    // Update basic fields if provided
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    if (req.body.avatar !== undefined) {
      user.avatar = req.body.avatar;
    }

    // Update password if provided (pre-save hook will hash it)
    if (req.body.password) {
      if (req.body.password.length < 6) {
        res.status(400);
        throw new Error('Password must be at least 6 characters');
      }
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        avatar: updatedUser.avatar,
        role: updatedUser.role,
        createdAt: updatedUser.createdAt,
        updatedAt: updatedUser.updatedAt,
      },
    });
  } catch (error) {
    // Handle Mongoose duplicate key error for email
    if (error.code === 11000) {
      res.status(400);
      error.message = 'A user with this email already exists';
    }
    next(error);
  }
};

module.exports = {
  register,
  login,
  logout,
  getProfile,
  updateProfile,
};
