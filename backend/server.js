require('dotenv').config();
const app = require('./app');
const connectDB = async () => {
  
  const db = require('./config/db');
  await db();
};

const startServer = async () => {
  try {
    
    await connectDB();

    const PORT = process.env.PORT || 5000;
    const server = app.listen(PORT, () => {
      console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    });

    
    process.on('unhandledRejection', (err, promise) => {
      console.error(`Unhandled Rejection Error: ${err.message}`);
      
      server.close(() => process.exit(1));
    });
  } catch (error) {
    console.error(`Failed to start server: ${error.message}`);
    process.exit(1);
  }
};

startServer();
