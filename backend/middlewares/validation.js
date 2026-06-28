const validateTaskInput = (req, res, next) => {
  const { title, status, priority, dueDate, tags, subtasks } = req.body;
  const errors = {};

  
  
  const isPost = req.method === 'POST';

  if (isPost && (!title || typeof title !== 'string' || title.trim() === '')) {
    errors.title = 'Task title is required and must be a string';
  } else if (title !== undefined) {
    if (typeof title !== 'string' || title.trim().length < 3) {
      errors.title = 'Task title must be at least 3 characters long';
    }
  }

  
  if (status !== undefined) {
    const validStatuses = ['pending', 'in-progress', 'completed'];
    if (!validStatuses.includes(status)) {
      errors.status = `Status must be one of: ${validStatuses.join(', ')}`;
    }
  }

  
  if (priority !== undefined) {
    const validPriorities = ['low', 'medium', 'high'];
    if (!validPriorities.includes(priority)) {
      errors.priority = `Priority must be one of: ${validPriorities.join(', ')}`;
    }
  }

  
  if (dueDate !== undefined && dueDate !== null && dueDate !== '') {
    const parsedDate = Date.parse(dueDate);
    if (isNaN(parsedDate)) {
      errors.dueDate = 'Due date must be a valid ISO date string';
    }
  }

  
  if (tags !== undefined) {
    if (!Array.isArray(tags) || !tags.every(tag => typeof tag === 'string')) {
      errors.tags = 'Tags must be an array of strings';
    }
  }

  
  if (subtasks !== undefined) {
    if (!Array.isArray(subtasks)) {
      errors.subtasks = 'Subtasks must be an array';
    } else {
      const subtaskErrors = [];
      subtasks.forEach((subtask, idx) => {
        if (!subtask || typeof subtask !== 'object') {
          subtaskErrors.push(`Subtask at index ${idx} must be an object`);
        } else {
          if (!subtask.title || typeof subtask.title !== 'string' || subtask.title.trim() === '') {
            subtaskErrors.push(`Subtask at index ${idx} must have a valid title`);
          }
          if (subtask.isCompleted !== undefined && typeof subtask.isCompleted !== 'boolean') {
            subtaskErrors.push(`Subtask at index ${idx} 'isCompleted' must be a boolean`);
          }
        }
      });
      if (subtaskErrors.length > 0) {
        errors.subtasks = subtaskErrors;
      }
    }
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }

  next();
};

module.exports = {
  validateTaskInput
};
