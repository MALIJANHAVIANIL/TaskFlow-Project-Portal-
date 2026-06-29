const mongoose = require('mongoose');

/**
 * Project Schema
 * Represents a project that contains tasks and has team members.
 */
const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Project title is required'],
      trim: true,
      minlength: [3, 'Title must be at least 3 characters'],
      maxlength: [100, 'Title must not exceed 100 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description must not exceed 500 characters'],
      default: '',
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Project owner is required'],
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    status: {
      type: String,
      enum: {
        values: ['active', 'completed', 'archived'],
        message: 'Status must be active, completed, or archived',
      },
      default: 'active',
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for common query patterns
projectSchema.index({ owner: 1 });
projectSchema.index({ status: 1 });
projectSchema.index({ owner: 1, status: 1 });

/**
 * Virtual field: taskCount
 * Provides a count of tasks associated with this project when populated.
 */
projectSchema.virtual('taskCount', {
  ref: 'Task',
  localField: '_id',
  foreignField: 'project',
  count: true,
});

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
