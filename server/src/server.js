require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

// Connect Database and Start Server
connectDB().then(() => {
  const startServer = (portToUse) => {
    const server = app.listen(portToUse, () => {
      console.log(`==================================================`);
      console.log(`🚀 ShopSphere Server running on port ${portToUse}`);
      console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔗 API Base URL: http://localhost:${portToUse}/api`);
      console.log(`==================================================`);
    });

    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.log(`⚠️ Port ${portToUse} in use, trying port ${Number(portToUse) + 1}...`);
        startServer(Number(portToUse) + 1);
      } else {
        console.error(err);
      }
    });
  };

  startServer(PORT);
});
