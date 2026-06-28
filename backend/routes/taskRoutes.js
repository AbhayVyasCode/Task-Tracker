const express = require('express');
const router = express.Router();
const {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask
} = require('../controllers/taskController');
const { validateTaskInput } = require('../middlewares/validation');

router.route('/')
  .get(getTasks)
  .post(validateTaskInput, createTask);

router.route('/:id')
  .get(getTaskById)
  .put(validateTaskInput, updateTask)
  .delete(deleteTask);

module.exports = router;
