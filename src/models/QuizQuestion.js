import mongoose from "mongoose";

const quizQuestionSchema = new mongoose.Schema({
  questionText: { 
    type: String, 
    required: true 
  },
  questionType: {
    type: String,
    enum: ["multiple-choice", "true-false", "fill-blank", "drag-drop"],
    default: "multiple-choice"
  },
  options: [{
    text: { type: String, required: true },
    isCorrect: { type: Boolean, default: false }
  }],
  correctAnswer: String, // for fill-blank type questions
  explanation: String, // explanation for the correct answer
  marks: { 
    type: Number, 
    default: 1 
  },
  difficulty: {
    type: String,
    enum: ["easy", "medium", "hard"],
    default: "easy"
  },
  moduleId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Module", 
    required: true 
  },
  order: { 
    type: Number, 
    required: true 
  },
  imageUrl: String, // optional image for the question
  timeLimit: { // in seconds
    type: Number,
    default: 60
  },
  tags: [String],
  isActive: { 
    type: Boolean, 
    default: true 
  }
}, { timestamps: true });

// Validation: at least one correct option for multiple choice
quizQuestionSchema.pre('save', function(next) {
  if (this.questionType === 'multiple-choice' || this.questionType === 'true-false') {
    const hasCorrectOption = this.options.some(option => option.isCorrect);
    if (!hasCorrectOption) {
      return next(new Error('At least one option must be marked as correct'));
    }
  }
  next();
});

// Index for ordering within module
quizQuestionSchema.index({ moduleId: 1, order: 1 });

export default mongoose.model("QuizQuestion", quizQuestionSchema);