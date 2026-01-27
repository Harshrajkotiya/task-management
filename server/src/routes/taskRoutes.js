const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const { authMiddleware, roleMiddleware } = require('../middleware/authMiddleware');

// All task routes require authentication
router.use(authMiddleware);

// @route   GET api/tasks
// @desc    Get all tasks (filtered by role)
// @access  Private
router.get('/', taskController.getAllTasks);

// @route   GET api/tasks/:id
// @desc    Get task by ID
// @access  Private
router.get('/:id', taskController.getTaskById);

// @route   POST api/tasks
// @desc    Create a new task
// @access  Private
router.post('/', taskController.createTask);

// @route   PUT api/tasks/:id
// @desc    Update task
// @access  Private
router.put('/:id', taskController.updateTask);

// @route   DELETE api/tasks/:id
// @desc    Delete task
// @access  Private
router.delete('/:id', taskController.deleteTask);

// @route   GET api/tasks/users/all
// @desc    Get all users (for display/assignment)
// @access  Private
router.get('/users/all', taskController.getAllUsers);

module.exports = router;
