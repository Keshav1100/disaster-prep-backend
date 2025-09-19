import Course from "../models/Course.js";
import Module from "../models/Module.js";
import QuizQuestion from "../models/QuizQuestion.js";
import Attempt from "../models/Attempt.js";
import User from "../models/User.js";

// @desc    Create a new course
// @route   POST /api/courses
// @access  Private (teacher only)
export const createCourse = async (req, res) => {
  try {
    const { title, description, category, difficulty, targetAge, estimatedDuration, tags } = req.body;

    // Check if user is a teacher
    if (req.user.role !== 'teacher' && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only teachers can create courses' });
    }

    const course = await Course.create({
      title,
      description,
      createdBy: req.user._id,
      category,
      difficulty,
      targetAge,
      estimatedDuration,
      tags
    });

    await course.populate('createdBy', 'name email');

    res.status(201).json({
      success: true,
      data: course
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all courses
// @route   GET /api/courses
// @access  Public
export const getCourses = async (req, res) => {
  try {
    const { category, difficulty, search, page = 1, limit = 10 } = req.query;
    
    let filter = { isPublished: true };
    
    if (category) filter.category = category;
    if (difficulty) filter.difficulty = difficulty;
    if (search) {
      filter.$text = { $search: search };
    }

    const courses = await Course.find(filter)
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Course.countDocuments(filter);

    res.json({
      success: true,
      count: courses.length,
      total,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit)
      },
      data: courses
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single course
// @route   GET /api/courses/:id
// @access  Public
export const getCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate({
        path: 'modules',
        populate: {
          path: 'quiz',
          select: 'questionText questionType marks difficulty'
        }
      });

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.json({
      success: true,
      data: course
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Enroll in a course
// @route   POST /api/courses/:id/enroll
// @access  Private (student only)
export const enrollInCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if already enrolled
    if (course.enrolledStudents.includes(req.user._id)) {
      return res.status(400).json({ message: 'Already enrolled in this course' });
    }

    // Add student to course
    course.enrolledStudents.push(req.user._id);
    await course.save();

    // Add course to user's enrolled courses
    const user = await User.findById(req.user._id);
    user.enrolledCourses.push(course._id);
    
    // Initialize course progress
    user.courseProgress.push({
      courseId: course._id,
      completedModules: [],
      currentModule: course.modules[0] || null,
      progressPercentage: 0
    });
    
    await user.save();

    res.json({
      success: true,
      message: 'Successfully enrolled in course',
      data: course
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Submit quiz attempt
// @route   POST /api/modules/:id/submit
// @access  Private
export const submitQuizAttempt = async (req, res) => {
  try {
    const { answers, timeTaken, status = 'completed' } = req.body;
    const moduleId = req.params.id;

    const module = await Module.findById(moduleId).populate('quiz');
    if (!module) {
      return res.status(404).json({ message: 'Module not found' });
    }

    const course = await Course.findById(module.courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Calculate score
    let totalMarks = 0;
    let obtainedMarks = 0;
    const processedAnswers = [];

    for (const answer of answers) {
      const question = await QuizQuestion.findById(answer.questionId);
      if (!question) continue;

      totalMarks += question.marks;
      let isCorrect = false;
      let marksObtained = 0;

      if (question.questionType === 'multiple-choice' || question.questionType === 'true-false') {
        const correctOption = question.options.find(opt => opt.isCorrect);
        isCorrect = correctOption && correctOption.text === answer.selectedOption;
      } else if (question.questionType === 'fill-blank') {
        isCorrect = question.correctAnswer.toLowerCase().trim() === answer.userAnswer.toLowerCase().trim();
      }

      if (isCorrect) {
        marksObtained = question.marks;
        obtainedMarks += marksObtained;
      }

      processedAnswers.push({
        questionId: answer.questionId,
        selectedOption: answer.selectedOption || '',
        userAnswer: answer.userAnswer || '',
        isCorrect,
        marksObtained,
        timeSpent: answer.timeSpent || 0
      });
    }

    const percentage = totalMarks > 0 ? (obtainedMarks / totalMarks) * 100 : 0;
    const isPassed = percentage >= (module.passingScore || 70);

    // Count previous attempts
    const previousAttempts = await Attempt.countDocuments({
      userId: req.user._id,
      moduleId
    });

    const attempt = await Attempt.create({
      userId: req.user._id,
      moduleId,
      courseId: module.courseId,
      answers: processedAnswers,
      score: obtainedMarks,
      totalMarks,
      percentage,
      timeTaken,
      startedAt: new Date(Date.now() - timeTaken * 1000),
      status,
      isPassed,
      attemptNumber: previousAttempts + 1
    });

    // Update user progress if passed
    if (isPassed) {
      const user = await User.findById(req.user._id);
      const courseProgress = user.courseProgress.find(cp => cp.courseId.toString() === module.courseId.toString());
      
      if (courseProgress && !courseProgress.completedModules.includes(moduleId)) {
        courseProgress.completedModules.push(moduleId);
        
        // Update progress percentage
        const totalModules = await Module.countDocuments({ courseId: module.courseId });
        courseProgress.progressPercentage = (courseProgress.completedModules.length / totalModules) * 100;
        
        // Update total score
        user.totalScore += obtainedMarks;
        
        await user.save();
      }
    }

    await attempt.populate([
      { path: 'moduleId', select: 'title' },
      { path: 'courseId', select: 'title' }
    ]);

    res.json({
      success: true,
      data: attempt
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user's course progress
// @route   GET /api/courses/:id/progress
// @access  Private
export const getCourseProgress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate({
        path: 'courseProgress.courseId',
        select: 'title totalModules'
      })
      .populate({
        path: 'courseProgress.completedModules',
        select: 'title order'
      });

    const courseProgress = user.courseProgress.find(
      cp => cp.courseId._id.toString() === req.params.id
    );

    if (!courseProgress) {
      return res.status(404).json({ message: 'Course progress not found' });
    }

    res.json({
      success: true,
      data: courseProgress
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update course (teacher only)
// @route   PUT /api/courses/:id
// @access  Private (teacher/admin)
export const updateCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if user is the creator or admin
    if (course.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this course' });
    }

    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('createdBy', 'name email');

    res.json({
      success: true,
      data: updatedCourse
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete course
// @route   DELETE /api/courses/:id
// @access  Private (teacher/admin)
export const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if user is the creator or admin
    if (course.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this course' });
    }

    await Course.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Course deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};