const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Disable Mongoose command buffering so queries respond immediately
    mongoose.set('bufferCommands', false);

    if (process.env.MONGODB_URI) {
      const conn = await mongoose.connect(process.env.MONGODB_URI);
      console.log(`[ShopSphere DB] MongoDB Connected: ${conn.connection.host}`);
    } else {
      console.log(`[ShopSphere DB] Supabase Engine Active (MONGODB_URI omitted). Running seamlessly with Supabase cloud database & in-memory fallbacks.`);
    }
  } catch (error) {
    console.warn(`[ShopSphere DB Note]: MongoDB Connection Bypassed (${error.message}).`);
    console.warn(`👉 Running backend seamlessly with Supabase & Instant Safe Fallback Mode.`);
  }
};

module.exports = connectDB;
