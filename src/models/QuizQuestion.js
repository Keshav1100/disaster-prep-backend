import mongoose from "mongoose";

const quizQuestionSchema = new mongoose.Schema({
  questionText: { 
    type: String, 
    required: true 
  },
  questionType: {
    type: String,
    enum: ["multiple-choice", "true-false"],
    default: "multiple-choice"
  },
  options: [{
    text: { type: String, required: true },
    isCorrect: { type: Boolean, default: false }
  }],
  explanation: String, // explanation for the correct answer
  marks: { 
    type: Number, 
    default: 1 
  },
  courseId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Course", 
    required: true 
  },
  order: { 
    type: Number, 
    required: true 
  },
  isActive: { 
    type: Boolean, 
    default: true 
  }
}, { timestamps: true });

// Validation: at least one correct option for multiple choice
quizQuestionSchema.pre('save', function(next) {
  if (this.questionType === 'multiple-choice') {
    const hasCorrectAnswer = this.options.some(option => option.isCorrect);
    if (!hasCorrectAnswer) {
      return next(new Error('At least one option must be marked as correct'));
    }
  }
  next();
});

export default mongoose.model("QuizQuestion", quizQuestionSchema);