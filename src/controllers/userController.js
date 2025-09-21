import User from "../models/User.js";
import bcrypt from "bcryptjs";

// @desc    Create student account (Teacher/Admin only)
// @route   POST /api/users/students
// @access  Private (Teacher/Admin)
export const createStudentAccount = async (req, res) => {
  try {
    const { name, email, password, dob, classStandard } = req.body;

    // Validation
    if (!name || !email || !password || !dob || !classStandard) {
      return res.status(400).json({ 
        message: "Please provide all required fields: name, email, password, dob, classStandard" 
      });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists with this email" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create student account
    const student = await User.create({
      name,
      email,
      passwordHash,
      role: "student",
      dob,
      classStandard,
      createdBy: req.user._id // Track which teacher created this student
    });

    res.status(201).json({
      success: true,
      data: {
        student: {
          _id: student._id,
          name: student.name,
          email: student.email,
          role: student.role,
          dob: student.dob,
          classStandard: student.classStandard,
          createdBy: student.createdBy
        }
      },
      message: "Student account created successfully"
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get students created by teacher
// @route   GET /api/users/my-students
// @access  Private (Teacher only)
export const getMyStudents = async (req, res) => {
  try {
    const students = await User.find({ 
      role: "student", 
      createdBy: req.user._id 
    }).select("-passwordHash");

    res.json({
      success: true,
      data: students
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all students (Admin only)
// @route   GET /api/users/students
// @access  Private (Admin only)
export const getAllStudents = async (req, res) => {
  try {
    const students = await User.find({ role: "student" })
      .select("-passwordHash")
      .populate("createdBy", "name email");

    res.json({
      success: true,
      data: students
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update student account
// @route   PUT /api/users/students/:id
// @access  Private (Teacher who created the student or Admin)
export const updateStudent = async (req, res) => {
  try {
    const { name, email, dob, classStandard } = req.body;
    
    const student = await User.findById(req.params.id);
    
    if (!student || student.role !== "student") {
      return res.status(404).json({ message: "Student not found" });
    }

    // Check permissions
    const isCreator = student.createdBy && student.createdBy.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";
    
    if (!isCreator && !isAdmin) {
      return res.status(403).json({ message: "Not authorized to update this student" });
    }

    // Update fields
    if (name) student.name = name;
    if (email) student.email = email;
    if (dob) student.dob = dob;
    if (classStandard) student.classStandard = classStandard;

    await student.save();

    res.json({
      success: true,
      data: {
        student: {
          _id: student._id,
          name: student.name,
          email: student.email,
          role: student.role,
          dob: student.dob,
          classStandard: student.classStandard,
          createdBy: student.createdBy
        }
      },
      message: "Student updated successfully"
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete student account
// @route   DELETE /api/users/students/:id
// @access  Private (Teacher who created the student or Admin)
export const deleteStudent = async (req, res) => {
  try {
    const student = await User.findById(req.params.id);
    
    if (!student || student.role !== "student") {
      return res.status(404).json({ message: "Student not found" });
    }

    // Check permissions
    const isCreator = student.createdBy && student.createdBy.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";
    
    if (!isCreator && !isAdmin) {
      return res.status(403).json({ message: "Not authorized to delete this student" });
    }

    await User.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Student account deleted successfully"
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Reset student password
// @route   PUT /api/users/students/:id/reset-password
// @access  Private (Teacher who created the student or Admin)
export const resetStudentPassword = async (req, res) => {
  try {
    const { newPassword } = req.body;
    
    if (!newPassword) {
      return res.status(400).json({ message: "Please provide new password" });
    }

    const student = await User.findById(req.params.id);
    
    if (!student || student.role !== "student") {
      return res.status(404).json({ message: "Student not found" });
    }

    // Check permissions
    const isCreator = student.createdBy && student.createdBy.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";
    
    if (!isCreator && !isAdmin) {
      return res.status(403).json({ message: "Not authorized to reset this student's password" });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    student.passwordHash = await bcrypt.hash(newPassword, salt);
    await student.save();

    res.json({
      success: true,
      message: "Password reset successfully"
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};