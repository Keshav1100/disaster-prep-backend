import mongoose from "mongoose";

const attemptSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  moduleId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Module", 
    required: true 
  },
  courseId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Course", 
    required: true 
  },
  answers: [{
    questionId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "QuizQuestion" 
    },
    selectedOption: String, // for multiple choice
    userAnswer: String, // for fill-blank
    isCorrect: Boolean,
    marksObtained: { type: Number, default: 0 },
    timeSpent: { type: Number, default: 0 } // in seconds
  }],
  score: { 
    type: Number, 
    required: true 
  },
  totalMarks: { 
    type: Number, 
    required: true 
  },
  percentage: { 
    type: Number, 
    required: true 
  },
  timeTaken: { 
    type: Number, 
    required: true 
  }, // in seconds
  startedAt: { 
    type: Date, 
    required: true 
  },
  submittedAt: { 
    type: Date, 
    default: Date.now 
  },
  status: {
    type: String,
    enum: ["completed", "submitted", "auto-submitted", "abandoned"],
    default: "completed"
  },
  isPassed: { 
    type: Boolean, 
    required: true 
  },
  attemptNumber: { 
    type: Number, 
    default: 1 
  },
  feedback: String,
  ipAddress: String,
  userAgent: String
}, { timestamps: true });

// Index for user's attempts
attemptSchema.index({ userId: 1, moduleId: 1, createdAt: -1 });

// Virtual for pass/fail status
attemptSchema.virtual('result').get(function() {
  return this.isPassed ? 'Pass' : 'Fail';
});

// Static method to get user's best attempt for a module
attemptSchema.statics.getBestAttempt = function(userId, moduleId) {
  return this.findOne({ userId, moduleId }).sort({ score: -1, createdAt: -1 });
};

export default mongoose.model("Attempt", attemptSchema);