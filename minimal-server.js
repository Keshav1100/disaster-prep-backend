import express from "express";
import dotenv from "dotenv";
import cors from "cors";

// Load environment variables
dotenv.config();

console.log("🚀 Starting minimal server test...");

// Initialize Express app
const app = express();

// Basic middleware
app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "🚀 Minimal server is running!",
    port: process.env.PORT || 5002
  });
});

// Start server
const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
  console.log(`✅ Minimal server running on port ${PORT}`);
  console.log(`🔗 Test URL: http://localhost:${PORT}`);
});