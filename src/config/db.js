import mongoose from "mongoose";
import FileDB from "./filedb.js";

let fileDB = null;

const connectDB = async () => {
  // If USE_FILE_DB is set, use file database
  if (process.env.USE_FILE_DB === 'true') {
    console.log("📁 Using file-based database (demo mode)");
    fileDB = new FileDB();
    return { type: 'file', db: fileDB };
  }

  try {
    // Try to connect to MongoDB
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      serverSelectionTimeoutMS: 5000, // 5 second timeout
    });
    console.log("✅ MongoDB connected");
    console.log(`📍 Database: ${conn.connection.name}`);
    return { type: 'mongodb', db: conn };
  } catch (err) {
    console.error("❌ DB connection failed:", err.message);
    console.log("🔄 Falling back to file-based database");
    console.log("📝 Please ensure MongoDB is running on:", process.env.MONGO_URI);
    
    // Fallback to file database
    fileDB = new FileDB();
    return { type: 'file', db: fileDB };
  }
};

export default connectDB;
export { fileDB };
