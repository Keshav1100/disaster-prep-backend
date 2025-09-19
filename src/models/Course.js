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
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  modules: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Module" 
  }],
  category: {
    type: String,
    enum: ["earthquake", "flood", "fire", "cyclone", "general"],
    default: "general"
  },
  difficulty: {
    type: String,
    enum: ["beginner", "intermediate", "advanced"],
    default: "beginner"
  },
  targetAge: {
    min: { type: Number, default: 8 },
    max: { type: Number, default: 18 }
  },
  estimatedDuration: { // in minutes
    type: Number,
    default: 60
  },
  enrolledStudents: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User" 
  }],
  tags: [String],
  isPublished: { 
    type: Boolean, 
    default: false 
  },
  thumbnailUrl: String,
  totalModules: { 
    type: Number, 
    default: 0 
  },
  averageRating: { 
    type: Number, 
    default: 0 
  },
  ratingsCount: { 
    type: Number, 
    default: 0 
  }
}, { timestamps: true });

// Virtual for enrolled count
courseSchema.virtual('enrolledCount').get(function() {
  return this.enrolledStudents.length;
});

// Index for search
courseSchema.index({ title: 'text', description: 'text', tags: 'text' });

export default mongoose.model("Course", courseSchema);