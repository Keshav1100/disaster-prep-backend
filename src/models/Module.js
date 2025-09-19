import mongoose from "mongoose";

const moduleSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true 
  },
  content: {
    text: String,
    videoUrl: String,
    imageUrls: [String],
    documents: [{
      name: String,
      url: String,
      type: String // pdf, doc, etc.
    }]
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
  quiz: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "QuizQuestion" 
  }],
  type: {
    type: String,
    enum: ["lesson", "video", "interactive", "quiz"],
    default: "lesson"
  },
  duration: { // in minutes
    type: Number,
    default: 15
  },
  learningObjectives: [String],
  prerequisites: [String],
  isPublished: { 
    type: Boolean, 
    default: false 
  },
  passingScore: { // percentage needed to pass quiz
    type: Number,
    default: 70
  }
}, { timestamps: true });

// Index for ordering within course
moduleSchema.index({ courseId: 1, order: 1 });

export default mongoose.model("Module", moduleSchema);