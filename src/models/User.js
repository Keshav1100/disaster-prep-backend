import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ["student", "teacher", "admin"], default: "student" },

  // Student-specific
  dob: { type: Date },
  classStandard: { type: String }, // "Class 8" or "Grade 10"

  // Track who created student accounts
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

  school: { type: mongoose.Schema.Types.ObjectId, ref: "School" },

  region: {
    state: String,
    district: String,
    lat: Number,
    lng: Number
  },

  enrolledCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
  courseProgress: [{
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
    completedModules: [{ type: mongoose.Schema.Types.ObjectId, ref: "Module" }],
    currentModule: { type: mongoose.Schema.Types.ObjectId, ref: "Module" },
    progressPercentage: { type: Number, default: 0 }
  }],
  gameProgress: [{
    gameType: { type: String, enum: ["story", "scenario", "kit"] },
    level: { type: Number, default: 1 },
    score: { type: Number, default: 0 },
    completedAt: { type: Date }
  }],
  totalScore: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model("User", userSchema);