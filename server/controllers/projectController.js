const Project = require('../models/Project');
const Task = require('../models/Task');

/**
 * @desc    Get all projects for the authenticated user (as owner or member)
 * @route   GET /api/projects
 * @access  Private
 */
const getProjects = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    // Build the base filter: user must be owner OR member
    const filter = {
      $or: [{ owner: req.user._id }, { members: req.user._id }],
    };

    // Optional: search by title (case-insensitive regex)
    if (req.query.search) {
      filter.title = { $regex: req.query.search, $options: 'i' };
    }

    // Optional: filter by status
    if (req.query.status && ['active', 'completed', 'archived'].includes(req.query.status)) {
      filter.status = req.query.status;
    }

    // Execute count + query in parallel for efficiency
    const [total, projects] = await Promise.all([
      Project.countDocuments(filter),
      Project.find(filter)
        .populate('owner', 'name email avatar')
        .populate('members', 'name email avatar')
        .populate('taskCount')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
    ]);

    const pages = Math.ceil(total / limit);

    res.status(200).json({
      success: true,
      projects,
      page,
      pages,
      total,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get a single project by ID (with its tasks)
 * @route   GET /api/projects/:id
 * @access  Private
 */
const getProjectById = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('owner', 'name email avatar')
      .populate('members', 'name email avatar')
      .populate('taskCount');

    if (!project) {
      res.status(404);
      throw new Error('Project not found');
    }

    // Verify the user is the owner or a member
    const isOwner = project.owner._id.toString() === req.user._id.toString();
    const isMember = project.members.some(
      (m) => m._id.toString() === req.user._id.toString()
    );

    if (!isOwner && !isMember) {
      res.status(403);
      throw new Error('Not authorized to access this project');
    }

    // Fetch all tasks belonging to this project
    const tasks = await Task.find({ project: project._id })
      .populate('assignee', 'name email avatar')
      .populate('creator', 'name email avatar')
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      project,
      tasks,
    });
  } catch (error) {
    // Handle invalid ObjectId format
    if (error.kind === 'ObjectId' || error.name === 'CastError') {
      res.status(404);
      error.message = 'Project not found';
    }
    next(error);
  }
};

/**
 * @desc    Create a new project
 * @route   POST /api/projects
 * @access  Private
 */
const createProject = async (req, res, next) => {
  try {
    const { title, description, status, startDate, endDate, members } = req.body;

    if (!title) {
      res.status(400);
      throw new Error('Project title is required');
    }

    // Ensure owner is always included in the members array
    const membersList = members && Array.isArray(members) ? [...members] : [];
    if (!membersList.includes(req.user._id.toString())) {
      membersList.push(req.user._id);
    }

    const project = await Project.create({
      title,
      description,
      owner: req.user._id,
      members: membersList,
      status,
      startDate,
      endDate,
    });

    // Return fully populated project
    const populatedProject = await Project.findById(project._id)
      .populate('owner', 'name email avatar')
      .populate('members', 'name email avatar');

    res.status(201).json({
      success: true,
      project: populatedProject,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update an existing project
 * @route   PUT /api/projects/:id
 * @access  Private (owner only)
 */
const updateProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      res.status(404);
      throw new Error('Project not found');
    }

    // Only the owner can update the project
    if (project.owner.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to update this project');
    }

    const { title, description, status, startDate, endDate, members } = req.body;

    // Update fields if provided
    if (title !== undefined) project.title = title;
    if (description !== undefined) project.description = description;
    if (status !== undefined) project.status = status;
    if (startDate !== undefined) project.startDate = startDate;
    if (endDate !== undefined) project.endDate = endDate;
    if (members !== undefined) {
      // Ensure owner is always in the members list
      const membersList = Array.isArray(members) ? [...members] : [];
      if (!membersList.includes(req.user._id.toString())) {
        membersList.push(req.user._id);
      }
      project.members = membersList;
    }

    const updatedProject = await project.save();

    // Return fully populated project
    const populatedProject = await Project.findById(updatedProject._id)
      .populate('owner', 'name email avatar')
      .populate('members', 'name email avatar')
      .populate('taskCount');

    res.status(200).json({
      success: true,
      project: populatedProject,
    });
  } catch (error) {
    if (error.kind === 'ObjectId' || error.name === 'CastError') {
      res.status(404);
      error.message = 'Project not found';
    }
    next(error);
  }
};

/**
 * @desc    Delete a project and all associated tasks
 * @route   DELETE /api/projects/:id
 * @access  Private (owner only)
 */
const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      res.status(404);
      throw new Error('Project not found');
    }

    // Only the owner can delete the project
    if (project.owner.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to delete this project');
    }

    // Delete all tasks belonging to this project, then the project itself
    await Task.deleteMany({ project: project._id });
    await Project.findByIdAndDelete(project._id);

    res.status(200).json({
      success: true,
      message: 'Project and all associated tasks deleted successfully',
    });
  } catch (error) {
    if (error.kind === 'ObjectId' || error.name === 'CastError') {
      res.status(404);
      error.message = 'Project not found';
    }
    next(error);
  }
};

module.exports = {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
};
