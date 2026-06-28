const express = require('express');
const cors = require('cors');
const taskRoutes = require('./routes/taskRoutes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();


app.use(cors({
  origin: '*', 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));


app.use(express.json());


app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Task Tracker MERN Backend API is active.'
  });
});


app.use('/api/tasks', taskRoutes);


app.use((req, res, next) => {
  res.status(404);
  const error = new Error(`Not Found - ${req.originalUrl}`);
  next(error);
});


app.use(errorHandler);

module.exports = app;
