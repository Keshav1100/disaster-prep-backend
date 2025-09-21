import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import connectDB from "./src/config/db.js";
import authRoutes from "./src/routes/authRoutes.js";
import courseRoutes from "./src/routes/courseRoutes.js";
import gameRoutes from "./src/routes/gameRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";
import { errorHandler, notFound } from "./src/middleware/errorMiddleware.js";
import seedFileDatabase from "./src/utils/seedFileData.js";

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, postman, etc.)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:3000',
      'http://127.0.0.1:3000',
      process.env.CLIENT_URL,
      // Add your production frontend URL here
      // 'https://your-disaster-ed-domain.com'
    ].filter(Boolean);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Connect to Database
let dbConnection = null;
connectDB().then((connection) => {
  dbConnection = connection;
  console.log(`📊 Database type: ${connection.type}`);
  
  // Seed file database if needed
  if (connection.type === 'file') {
    try {
      const seeded = seedFileDatabase();
      console.log(`🌱 Seeded ${seeded.users} users and ${seeded.courses} courses`);
    } catch (error) {
      console.error("Error seeding file database:", error);
    }
  }
});

// Middleware to check database connection for certain routes
const requireDB = (req, res, next) => {
  if (!dbConnection) {
    return res.status(503).json({
      success: false,
      message: "Database connection required for this operation",
      error: "Service temporarily unavailable"
    });
  }
  next();
};

// Routes
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "🚀 Disaster Preparedness API is running!",
    version: "1.0.0",
    database: dbConnection ? `Connected (${dbConnection.type})` : "Initializing...",
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
