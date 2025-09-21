import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  videoUrl: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return /^(https?\:\/\/)?(www\.)?(youtube\.com|youtu\.be)/.test(v);
      },
      message: 'Please provide a valid YouTube URL'
    }
  },
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  category: {
    type: String,
    enum: ["earthquake", "flood", "fire", "cyclone", "tornado", "tsunami", "general"],
    default: "general"
  },
  difficulty: {
    type: String,
    enum: ["beginner", "intermediate", "advanced"],
    default: "beginner"
  },
  estimatedDuration: { // in minutes
    type: Number,
    default: 30
  },
  enrolledStudents: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User" 
  }],
  completedStudents: [{
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    completedAt: { type: Date, default: Date.now },
    quizScore: { type: Number, default: 0 },
    totalQuestions: { type: Number, default: 0 }
  }],
  isPublished: { 
    type: Boolean, 
    default: true 
  },
  thumbnailUrl: String
}, { timestamps: true });

// Virtual for enrolled count
courseSchema.virtual('enrolledCount').get(function() {
  return this.enrolledStudents.length;
});

// Index for search
courseSchema.index({ title: 'text', description: 'text' });

export default mongoose.model("Course", courseSchema);