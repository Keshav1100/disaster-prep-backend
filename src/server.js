import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import gameRoutes from "./routes/gameRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || "*",
  credentials: true
}));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Connect to Database
connectDB();

// Routes
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "🚀 Disaster Preparedness API is running!",
    version: "1.0.0",
    endpoints: {
      auth: "/api/auth",
      courses: "/api/courses", 
      games: "/api/games",
      users: "/api/users"
    }
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/games", gameRoutes);
app.use("/api/users", userRoutes);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Create HTTP server
const server = http.createServer(app);

// Socket.io setup for real-time features
const io = new Server(server, { 
  cors: { 
    origin: process.env.CLIENT_URL || "*",
    methods: ["GET", "POST"]
  } 
});

io.on("connection", (socket) => {
  console.log(`🔌 New client connected: ${socket.id}`);

  // Join user to their personal room
  socket.on("join-user", (userId) => {
    socket.join(`user-${userId}`);
    console.log(`User ${userId} joined their room`);
  });

  // Handle course enrollment notifications
  socket.on("course-enrolled", (data) => {
    socket.to(`user-${data.teacherId}`).emit("student-enrolled", {
      studentName: data.studentName,
      courseName: data.courseName,
      timestamp: new Date()
    });
  });

  // Handle quiz completion notifications
  socket.on("quiz-completed", (data) => {
    socket.to(`user-${data.teacherId}`).emit("quiz-completed", {
      studentName: data.studentName,
      courseName: data.courseName,
      score: data.score,
      timestamp: new Date()
    });
  });

  // Handle game achievements
  socket.on("achievement-unlocked", (data) => {
    socket.emit("achievement-notification", {
      achievement: data.achievement,
      points: data.points,
      timestamp: new Date()
    });
  });

  socket.on("disconnect", () => {
    console.log(`❌ Client disconnected: ${socket.id}`);
  });
});

// Start server
const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📚 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 API Base URL: http://localhost:${PORT}`);
});
