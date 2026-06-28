const Task = require('../models/Task');




const getTasks = async (req, res, next) => {
  try {
    const { search, status, priority, tag, overdue, sortBy, order } = req.query;
    
    
    const matchQuery = {};

    
    if (search) {
      matchQuery.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    
    if (status) {
      matchQuery.status = status;
    }

    
    if (priority) {
      matchQuery.priority = priority;
    }

    
    if (tag) {
      matchQuery.tags = tag;
    }

    
    if (overdue === 'true') {
      matchQuery.status = { $ne: 'completed' };
      matchQuery.dueDate = { $lt: new Date() };
    }

    
    const sortOrder = order === 'asc' ? 1 : -1;
    let sortStage = {};

    if (sortBy === 'priority') {
      sortStage = { priorityWeight: sortOrder, createdAt: -1 };
    } else if (sortBy === 'dueDate') {
      
      sortStage = { hasDueDate: -1, dueDate: sortOrder, createdAt: -1 };
    } else {
      
      sortStage = { createdAt: sortOrder };
    }

    
    const pipeline = [
      { $match: matchQuery },
      {
        $addFields: {
          
          priorityWeight: {
            $switch: {
              branches: [
                { case: { $eq: ['$priority', 'high'] }, then: 3 },
                { case: { $eq: ['$priority', 'medium'] }, then: 2 },
                { case: { $eq: ['$priority', 'low'] }, then: 1 }
              ],
              default: 0
            }
          },
          
          hasDueDate: {
            $cond: { if: { $gt: ['$dueDate', null] }, then: 1, else: 0 }
          }
        }
      },
      { $sort: sortStage }
    ];

    const tasks = await Task.aggregate(pipeline);

    
    const tasksWithVirtuals = tasks.map(t => {
      const taskDoc = Task.hydrate(t);
      return taskDoc.toJSON();
    });

    res.status(200).json({
      success: true,
      count: tasksWithVirtuals.length,
      data: tasksWithVirtuals
    });
  } catch (error) {
    next(error);
  }
};




const getTaskById = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    
    if (!task) {
      res.status(404);
      throw new Error(`Task not found with id of ${req.params.id}`);
    }

    res.status(200).json({
      success: true,
      data: task
    });
  } catch (error) {
    next(error);
  }
};




const createTask = async (req, res, next) => {
  try {
    const { title, description, status, priority, dueDate, tags, subtasks } = req.body;

    const task = await Task.create({
      title,
      description,
      status,
      priority,
      dueDate,
      tags,
      subtasks
    });

    res.status(201).json({
      success: true,
      data: task
    });
  } catch (error) {
    next(error);
  }
};




const updateTask = async (req, res, next) => {
  try {
    let task = await Task.findById(req.params.id);

    if (!task) {
      res.status(404);
      throw new Error(`Task not found with id of ${req.params.id}`);
    }

    
    
    task = await Task.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { returnDocument: 'after', runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: task
    });
  } catch (error) {
    next(error);
  }
};




const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      res.status(404);
      throw new Error(`Task not found with id of ${req.params.id}`);
    }

    await task.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
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
  deleteTask
};
