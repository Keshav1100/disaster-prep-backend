import express from "express";
import {
  createCourse,
  getCourses,
  getCourse,
  enrollInCourse,
  submitQuizAttempt,
  getCourseProgress,
  updateCourse,
  deleteCourse
} from "../controllers/courseController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

// Public routes
router.get("/", getCourses);
router.get("/:id", getCourse);

// Protected routes
router.post("/", protect, authorize("teacher", "admin"), createCourse);
router.put("/:id", protect, authorize("teacher", "admin"), updateCourse);
router.delete("/:id", protect, authorize("teacher", "admin"), deleteCourse);

// Student routes
router.post("/:id/enroll", protect, authorize("student"), enrollInCourse);
router.get("/:id/progress", protect, getCourseProgress);

// Quiz submission
router.post("/modules/:id/submit", protect, submitQuizAttempt);

export default router;