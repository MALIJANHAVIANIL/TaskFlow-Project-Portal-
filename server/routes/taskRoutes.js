const express = require('express');
const router = express.Router();
const {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  getTaskStats,
} = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');

// All task routes require authentication
router.use(protect);

// Stats route MUST be defined before /:id to avoid "stats" being parsed as an id
router.get('/stats', getTaskStats);

router.route('/').get(getTasks).post(createTask);

router.route('/:id').get(getTaskById).put(updateTask).delete(deleteTask);

module.exports = router;
