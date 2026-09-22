const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Disable Mongoose command buffering so queries fail/respond immediately if DB is offline
    mongoose.set('bufferCommands', false);
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/shopsphere');
    console.log(`[ShopSphere DB] MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`[ShopSphere DB Warning]: MongoDB Connection Failed (${error.message}).`);
    console.warn(`👉 Running backend with Instant Safe Fallback Mode.`);
  }
};

module.exports = connectDB;
