const mongoose = require('mongoose');

/**
 * Task Schema
 * Represents an individual task within a project, assigned to a user.
 */
const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true,
      minlength: [3, 'Title must be at least 3 characters'],
      maxlength: [100, 'Title must not exceed 100 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, 'Description must not exceed 1000 characters'],
      default: '',
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: [true, 'Project reference is required'],
    },
    assignee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Task creator is required'],
    },
    priority: {
      type: String,
      enum: {
        values: ['low', 'medium', 'high'],
        message: 'Priority must be low, medium, or high',
      },
      default: 'medium',
    },
    status: {
      type: String,
      enum: {
        values: ['todo', 'in-progress', 'completed'],
        message: 'Status must be todo, in-progress, or completed',
      },
      default: 'todo',
    },
    dueDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for common query and filter patterns
taskSchema.index({ project: 1 });
taskSchema.index({ assignee: 1 });
taskSchema.index({ status: 1 });
taskSchema.index({ priority: 1 });
taskSchema.index({ project: 1, status: 1 });
taskSchema.index({ assignee: 1, status: 1 });

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
