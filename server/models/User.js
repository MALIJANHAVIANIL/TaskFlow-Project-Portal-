const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/**
 * User Schema
 * Stores user credentials, profile information, and role.
 */
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [50, 'Name must not exceed 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        'Please provide a valid email address',
      ],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // Do not return password by default in queries
    },
    avatar: {
      type: String,
      default: '',
    },
    role: {
      type: String,
      enum: {
        values: ['admin', 'member'],
        message: 'Role must be either admin or member',
      },
      default: 'member',
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Pre-save hook: Generate avatar URL from name using ui-avatars.com.
 * Only generates if avatar is not already set or name has changed.
 */
userSchema.pre('save', function (next) {
  if (this.isModified('name') || !this.avatar) {
    const encodedName = encodeURIComponent(this.name);
    this.avatar = `https://ui-avatars.com/api/?name=${encodedName}&background=random&color=fff&size=128`;
  }
  next();
});

/**
 * Pre-save hook: Hash the password with bcryptjs (12 rounds).
 * Only hashes if the password field has been modified.
 */
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

/**
 * Instance method: Compare a candidate password with the stored hashed password.
 * @param {string} candidatePassword - The plain-text password to compare.
 * @returns {Promise<boolean>} True if passwords match, false otherwise.
 */
userSchema.methods.matchPassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
