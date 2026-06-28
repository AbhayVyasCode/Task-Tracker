require('dotenv').config();
const mongoose = require('mongoose');
const Task = require('./models/Task');
const connectDB = require('./config/db');

const sampleTasks = [
  {
    title: 'Design Premium Glassmorphic UI/UX',
    description: 'Create high-fidelity mockups of the dark mode glassmorphism UI using CSS backdrop filters, custom typography, neon accents, and interactive layouts.',
    status: 'completed',
    priority: 'high',
    dueDate: new Date(Date.now() - 24 * 60 * 60 * 1000 * 2), 
    tags: ['Design', 'UX', 'CSS'],
    subtasks: [
      { title: 'Define Nebula theme color variables', isCompleted: true },
      { title: 'Design SVG metrics indicator', isCompleted: true },
      { title: 'Establish glassmorphism CSS helper classes', isCompleted: true }
    ]
  },
  {
    title: 'Develop Node.js + Express.js REST API',
    description: 'Implement secure, validated REST API endpoints with robust error handling, Mongoose query configurations, and CORS protection. Structure the API to run serverless on Netlify.',
    status: 'in-progress',
    priority: 'high',
    dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000), 
    tags: ['Backend', 'Express', 'MongoDB'],
    subtasks: [
      { title: 'Create Mongoose Task schema and model', isCompleted: true },
      { title: 'Write request validator middleware', isCompleted: true },
      { title: 'Add aggregation pipeline for priority sorting', isCompleted: false },
      { title: 'Write serverless wrapper for Netlify functions', isCompleted: false }
    ]
  },
  {
    title: 'Implement React Frontend Features',
    description: 'Build components for task lists, search bar, status toggle, tag additions, and due date filters. Wire frontend state to the backend APIs.',
    status: 'pending',
    priority: 'medium',
    dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000 * 4), 
    tags: ['Frontend', 'React', 'State'],
    subtasks: [
      { title: 'Create layout dashboard with sidebar navigation', isCompleted: false },
      { title: 'Integrate API Client with Axios', isCompleted: false },
      { title: 'Design custom visual toast notifications', isCompleted: false }
    ]
  },
  {
    title: 'Write Jest API Verification Tests',
    description: 'Verify endpoint functionality, database constraints, input validators, and error responses with robust test suites.',
    status: 'pending',
    priority: 'low',
    dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000 * 8), 
    tags: ['Testing', 'QA'],
    subtasks: [
      { title: 'Test validation constraints for task creations', isCompleted: false },
      { title: 'Test due date overdue calculations', isCompleted: false }
    ]
  }
];

const seedDatabase = async () => {
  try {
    await connectDB();

    
    await Task.deleteMany();
    console.log('Existing tasks cleared.');

    
    await Task.insertMany(sampleTasks);
    console.log('Sample tasks seeded successfully!');

    
    mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error(`Error seeding database: ${error.message}`);
    process.exit(1);
  }
};

seedDatabase();
