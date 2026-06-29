const Task = require('../models/Task');
const Project = require('../models/Project');

/**
 * @desc    Get tasks for the current user (as creator or assignee)
 * @route   GET /api/tasks
 * @access  Private
 */
const getTasks = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    // Base filter: user is creator or assignee
    const filter = {
      $or: [{ creator: req.user._id }, { assignee: req.user._id }],
    };

    // Optional: search by title (case-insensitive regex)
    if (req.query.search) {
      filter.title = { $regex: req.query.search, $options: 'i' };
    }

    // Optional: filter by status
    if (
      req.query.status &&
      ['todo', 'in-progress', 'completed'].includes(req.query.status)
    ) {
      filter.status = req.query.status;
    }

    // Optional: filter by priority
    if (
      req.query.priority &&
      ['low', 'medium', 'high'].includes(req.query.priority)
    ) {
      filter.priority = req.query.priority;
    }

    // Optional: filter by project
    if (req.query.project) {
      filter.project = req.query.project;
    }

    // Execute count + query in parallel
    const [total, tasks] = await Promise.all([
      Task.countDocuments(filter),
      Task.find(filter)
        .populate('project', 'title')
        .populate('assignee', 'name email avatar')
        .populate('creator', 'name email avatar')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
    ]);

    const pages = Math.ceil(total / limit);

    res.status(200).json({
      success: true,
      tasks,
      page,
      pages,
      total,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get a single task by ID
 * @route   GET /api/tasks/:id
 * @access  Private
 */
const getTaskById = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('project', 'title')
      .populate('assignee', 'name email avatar')
      .populate('creator', 'name email avatar');

    if (!task) {
      res.status(404);
      throw new Error('Task not found');
    }

    res.status(200).json({
      success: true,
      task,
    });
  } catch (error) {
    if (error.kind === 'ObjectId' || error.name === 'CastError') {
      res.status(404);
      error.message = 'Task not found';
    }
    next(error);
  }
};

/**
 * @desc    Create a new task
 * @route   POST /api/tasks
 * @access  Private
 */
const createTask = async (req, res, next) => {
  try {
    const { title, description, project, assignee, priority, status, dueDate } =
      req.body;

    if (!title) {
      res.status(400);
      throw new Error('Task title is required');
    }

    if (!project) {
      res.status(400);
      throw new Error('Project reference is required');
    }

    // Validate that the project exists
    const existingProject = await Project.findById(project);
    if (!existingProject) {
      res.status(404);
      throw new Error('Project not found');
    }

    const task = await Task.create({
      title,
      description,
      project,
      assignee: assignee || undefined,
      creator: req.user._id,
      priority,
      status,
      dueDate,
    });

    // Return fully populated task
    const populatedTask = await Task.findById(task._id)
      .populate('project', 'title')
      .populate('assignee', 'name email avatar')
      .populate('creator', 'name email avatar');

    res.status(201).json({
      success: true,
      task: populatedTask,
    });
  } catch (error) {
    if (error.kind === 'ObjectId' || error.name === 'CastError') {
      res.status(400);
      error.message = 'Invalid project or assignee ID';
    }
    next(error);
  }
};

/**
 * @desc    Update an existing task
 * @route   PUT /api/tasks/:id
 * @access  Private
 */
const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      res.status(404);
      throw new Error('Task not found');
    }

    const { title, description, assignee, priority, status, dueDate, project } =
      req.body;

    // Update fields if provided
    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (assignee !== undefined) task.assignee = assignee || null;
    if (priority !== undefined) task.priority = priority;
    if (status !== undefined) task.status = status;
    if (dueDate !== undefined) task.dueDate = dueDate;
    if (project !== undefined) {
      // Validate new project reference
      const existingProject = await Project.findById(project);
      if (!existingProject) {
        res.status(404);
        throw new Error('Project not found');
      }
      task.project = project;
    }

    const updatedTask = await task.save();

    // Return fully populated task
    const populatedTask = await Task.findById(updatedTask._id)
      .populate('project', 'title')
      .populate('assignee', 'name email avatar')
      .populate('creator', 'name email avatar');

    res.status(200).json({
      success: true,
      task: populatedTask,
    });
  } catch (error) {
    if (error.kind === 'ObjectId' || error.name === 'CastError') {
      res.status(404);
      error.message = 'Task not found';
    }
    next(error);
  }
};

/**
 * @desc    Delete a task
 * @route   DELETE /api/tasks/:id
 * @access  Private
 */
const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      res.status(404);
      throw new Error('Task not found');
    }

    await Task.findByIdAndDelete(task._id);

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully',
    });
  } catch (error) {
    if (error.kind === 'ObjectId' || error.name === 'CastError') {
      res.status(404);
      error.message = 'Task not found';
    }
    next(error);
  }
};

/**
 * @desc    Get task statistics for the current user
 * @route   GET /api/tasks/stats
 * @access  Private
 */
const getTaskStats = async (req, res, next) => {
  try {
    // Base filter: tasks where user is creator or assignee
    const userFilter = {
      $or: [{ creator: req.user._id }, { assignee: req.user._id }],
    };

    // Run all aggregations in parallel
    const [
      total,
      todoCount,
      inProgressCount,
      completedCount,
      lowCount,
      mediumCount,
      highCount,
      overdueCount,
    ] = await Promise.all([
      Task.countDocuments(userFilter),
      Task.countDocuments({ ...userFilter, status: 'todo' }),
      Task.countDocuments({ ...userFilter, status: 'in-progress' }),
      Task.countDocuments({ ...userFilter, status: 'completed' }),
      Task.countDocuments({ ...userFilter, priority: 'low' }),
      Task.countDocuments({ ...userFilter, priority: 'medium' }),
      Task.countDocuments({ ...userFilter, priority: 'high' }),
      Task.countDocuments({
        ...userFilter,
        status: { $ne: 'completed' },
        dueDate: { $lt: new Date() },
      }),
    ]);

    res.status(200).json({
      success: true,
      stats: {
        total,
        byStatus: {
          todo: todoCount,
          'in-progress': inProgressCount,
          completed: completedCount,
        },
        byPriority: {
          low: lowCount,
          medium: mediumCount,
          high: highCount,
        },
        overdue: overdueCount,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  getTaskStats,
};
