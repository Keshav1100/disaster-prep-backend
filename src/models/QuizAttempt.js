import mongoose from "mongoose";

const quizAttemptSchema = new mongoose.Schema({
  studentId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  courseId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Course", 
    required: true 
  },
  answers: [{
    questionId: { type: mongoose.Schema.Types.ObjectId, ref: "QuizQuestion" },
    selectedOption: Number, // Index of selected option
    isCorrect: Boolean,
    marks: Number
  }],
  totalMarks: { 
    type: Number, 
    default: 0 
  },
  maxMarks: { 
    type: Number, 
    default: 0 
  },
  percentage: { 
    type: Number, 
    default: 0 
  },
  passed: { 
    type: Boolean, 
    default: false 
  },
  completedAt: { 
    type: Date, 
    default: Date.now 
  }
}, { timestamps: true });

// Calculate percentage and pass status before saving
quizAttemptSchema.pre('save', function(next) {
  if (this.maxMarks > 0) {
    this.percentage = Math.round((this.totalMarks / this.maxMarks) * 100);
    this.passed = this.percentage >= 60; // 60% passing grade
  }
  next();
});

export default mongoose.model("QuizAttempt", quizAttemptSchema);