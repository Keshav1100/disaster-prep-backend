import mongoose from "mongoose";

const schoolSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: { type: String, default: "India" }
  },
  region: {
    state: { type: String, required: true },
    district: { type: String, required: true },
    lat: Number,
    lng: Number
  },
  contact: {
    phone: String,
    email: String,
    website: String
  },
  principal: {
    name: String,
    email: String,
    phone: String
  },
  teachers: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User" 
  }],
  students: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User" 
  }],
  establishedYear: Number,
  schoolType: {
    type: String,
    enum: ["government", "private", "aided"],
    default: "government"
  },
  classes: [{
    standard: String, // "Class 1", "Class 2", etc.
    sections: [String] // ["A", "B", "C"]
  }],
  isActive: { 
    type: Boolean, 
    default: true 
  }
}, { timestamps: true });

// Index for geographic queries
schoolSchema.index({ "region.lat": 1, "region.lng": 1 });

export default mongoose.model("School", schoolSchema);