import express from "express";
import {
  createStudentAccount,
  getMyStudents,
  getAllStudents,
  updateStudent,
  deleteStudent,
  resetStudentPassword
} from "../controllers/userController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

// Teacher routes for managing students
router.post("/students", protect, authorize("teacher", "admin"), createStudentAccount);
router.get("/my-students", protect, authorize("teacher"), getMyStudents);
router.put("/students/:id", protect, authorize("teacher", "admin"), updateStudent);
router.delete("/students/:id", protect, authorize("teacher", "admin"), deleteStudent);
router.put("/students/:id/reset-password", protect, authorize("teacher", "admin"), resetStudentPassword);

// Admin routes
router.get("/students", protect, authorize("admin"), getAllStudents);

export default router;