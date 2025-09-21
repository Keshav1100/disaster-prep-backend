import express from "express";
import {
  createCourse,
  getCourses,
  getCourse,
  enrollInCourse,
  getCourseProgress,
  updateCourse,
  deleteCourse,
  getCourseQuiz,
  submitQuiz,
  markCourseComplete,
  addQuizQuestions
} from "../controllers/courseController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

// Public routes
router.get("/", getCourses);
router.get("/:id", getCourse);

// Protected routes - Teacher/Admin only
router.post("/", protect, authorize("teacher", "admin"), createCourse);
router.put("/:id", protect, authorize("teacher", "admin"), updateCourse);
router.delete("/:id", protect, authorize("teacher", "admin"), deleteCourse);

// Quiz management - Teacher/Admin only
router.post("/:id/quiz", protect, authorize("teacher", "admin"), addQuizQuestions);

// Student routes
router.post("/:id/enroll", protect, authorize("student"), enrollInCourse);
router.get("/:id/progress", protect, getCourseProgress);

// Quiz routes - All authenticated users
router.get("/:id/quiz", protect, getCourseQuiz);
router.post("/:id/quiz/submit", protect, authorize("student"), submitQuiz);

// Course completion
router.post("/:id/complete", protect, authorize("student"), markCourseComplete);

export default router;