const serverless = require('serverless-http');
const app = require('../../app');
const connectDB = require('../../config/db');


let isConnected = false;

const handler = async (event, context) => {
  
  context.callbackWaitsForEmptyEventLoop = false;

  if (!isConnected) {
    
    if (!process.env.MONGO_URI) {
      require('dotenv').config();
    }
    await connectDB();
    isConnected = true;
  }

  const serverlessHandler = serverless(app);
  return await serverlessHandler(event, context);
};

module.exports = { handler };
