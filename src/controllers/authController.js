import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Generate Access Token
const generateAccessToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { 
    expiresIn: process.env.JWT_EXPIRE || "15m" 
  });
};

// Generate Refresh Token
const generateRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, { 
    expiresIn: process.env.JWT_REFRESH_EXPIRE || "7d" 
  });
};

// Generate both tokens
const generateTokens = (id) => {
  return {
    accessToken: generateAccessToken(id),
    refreshToken: generateRefreshToken(id)
  };
};

// @desc Register user
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, dob, classStandard } = req.body;

    // Restrict student registration - students can only login, not register
    if (role === "student") {
      return res.status(403).json({ 
        message: "Student registration is disabled. Please contact your teacher for login credentials." 
      });
    }

    // Validation: if student, must have dob & classStandard (for future teacher-created accounts)
    if (role === "student" && (!dob || !classStandard)) {
      return res.status(400).json({ 
        message: "Students must provide date of birth and class standard" 
      });
    }

    // check user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      passwordHash,
      role,
      dob: role === "student" ? dob : null,
      classStandard: role === "student" ? classStandard : null
    });

    const tokens = generateTokens(user._id);

    res.status(201).json({
      success: true,
      data: {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          dob: user.dob,
          classStandard: user.classStandard
        },
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Login user
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for email and password
    if (!email || !password) {
      return res.status(400).json({ message: "Please provide email and password" });
    }

    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.passwordHash))) {
      const tokens = generateTokens(user._id);
      
      res.json({
        success: true,
        data: {
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            dob: user.dob,
            classStandard: user.classStandard
          },
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken
        }
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Get current user
// @route GET /api/auth/me
// @access Private
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-passwordHash')
      .populate('school', 'name')
      .populate('enrolledCourses', 'title');

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Update user profile
// @route PUT /api/auth/profile
// @access Private
export const updateProfile = async (req, res) => {
  try {
    const { name, region, school } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, region, school },
      { new: true, runValidators: true }
    ).select('-passwordHash');

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Change password
// @route PUT /api/auth/password
// @access Private
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id);

    // Check current password
    if (!(await bcrypt.compare(currentPassword, user.passwordHash))) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.passwordHash = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({
      success: true,
      message: "Password updated successfully"
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Refresh access token
// @route POST /api/auth/refresh
// @access Public
export const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh token required" });
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    
    // Get user
    const user = await User.findById(decoded.id).select('-passwordHash');
    
    if (!user) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    // Generate new tokens
    const tokens = generateTokens(user._id);

    res.json({
      success: true,
      data: {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken
      }
    });
  } catch (error) {
    res.status(401).json({ message: "Invalid refresh token" });
  }
};
