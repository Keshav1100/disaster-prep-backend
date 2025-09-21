import Course from "../models/Course.js";
import QuizQuestion from "../models/QuizQuestion.js";
import QuizAttempt from "../models/QuizAttempt.js";
import User from "../models/User.js";

// @desc    Create a new course with quiz questions
// @route   POST /api/courses
// @access  Private (teacher only)
export const createCourse = async (req, res) => {
  try {
    const { title, description, videoUrl, category, difficulty, estimatedDuration, quizQuestions } = req.body;

    // Check if user is a teacher
    if (req.user.role !== 'teacher' && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only teachers can create courses' });
    }

    // Validate YouTube URL
    const youtubeRegex = /^(https?\:\/\/)?(www\.)?(youtube\.com|youtu\.be)/;
    if (!youtubeRegex.test(videoUrl)) {
      return res.status(400).json({ message: 'Please provide a valid YouTube URL' });
    }

    // Create the course
    const course = await Course.create({
      title,
      description,
      videoUrl,
      createdBy: req.user._id,
      category,
      difficulty,
      estimatedDuration
    });

    // Create quiz questions if provided
    if (quizQuestions && quizQuestions.length > 0) {
      const questionsWithCourseId = quizQuestions.map((question, index) => ({
        ...question,
        courseId: course._id,
        order: index + 1
      }));
      
      await QuizQuestion.insertMany(questionsWithCourseId);
    }

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

// @desc    Get course quiz questions
// @route   GET /api/courses/:id/quiz
// @access  Private (enrolled students and course creator)
export const getCourseQuiz = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if user is enrolled or is the course creator
    const isEnrolled = course.enrolledStudents.includes(req.user._id);
    const isCreator = course.createdBy.toString() === req.user._id.toString();
    
    if (!isEnrolled && !isCreator && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'You must be enrolled in this course to access the quiz' });
    }

    const questions = await QuizQuestion.find({ courseId: req.params.id })
      .select('-options.isCorrect') // Don't send correct answers to students
      .sort({ order: 1 });

    res.json({
      success: true,
      data: questions
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Submit quiz attempt
// @route   POST /api/courses/:id/quiz/submit
// @access  Private (enrolled students)
export const submitQuiz = async (req, res) => {
  try {
    const { answers } = req.body;
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if user is enrolled
    if (!course.enrolledStudents.includes(req.user._id)) {
      return res.status(403).json({ message: 'You must be enrolled in this course to submit quiz' });
    }

    // Get all quiz questions for this course
    const questions = await QuizQuestion.find({ courseId: req.params.id }).sort({ order: 1 });
    
    let totalMarks = 0;
    let maxMarks = 0;
    const processedAnswers = [];

    // Calculate scores
    for (let i = 0; i < questions.length; i++) {
      const question = questions[i];
      const userAnswer = answers[i];
      maxMarks += question.marks;

      if (userAnswer !== undefined) {
        const selectedOption = question.options[userAnswer];
        const isCorrect = selectedOption && selectedOption.isCorrect;
        const marks = isCorrect ? question.marks : 0;
        totalMarks += marks;

        processedAnswers.push({
          questionId: question._id,
          selectedOption: userAnswer,
          isCorrect,
          marks
        });
      }
    }

    // Create quiz attempt
    const quizAttempt = await QuizAttempt.create({
      studentId: req.user._id,
      courseId: req.params.id,
      answers: processedAnswers,
      totalMarks,
      maxMarks
    });

    // If quiz passed, mark course as completed
    if (quizAttempt.passed) {
      const completionRecord = {
        studentId: req.user._id,
        completedAt: new Date(),
        quizScore: totalMarks,
        totalQuestions: questions.length
      };

      // Check if already completed
      const alreadyCompleted = course.completedStudents.some(
        comp => comp.studentId.toString() === req.user._id.toString()
      );

      if (!alreadyCompleted) {
        course.completedStudents.push(completionRecord);
        await course.save();
      }
    }

    res.json({
      success: true,
      data: {
        totalMarks,
        maxMarks,
        percentage: quizAttempt.percentage,
        passed: quizAttempt.passed,
        courseCompleted: quizAttempt.passed
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Mark course as completed (for courses without quiz)
// @route   POST /api/courses/:id/complete
// @access  Private (enrolled students)
export const markCourseComplete = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if user is enrolled
    if (!course.enrolledStudents.includes(req.user._id)) {
      return res.status(403).json({ message: 'You must be enrolled in this course' });
    }

    // Check if already completed
    const alreadyCompleted = course.completedStudents.some(
      comp => comp.studentId.toString() === req.user._id.toString()
    );

    if (alreadyCompleted) {
      return res.status(400).json({ message: 'Course already completed' });
    }

    // Add to completed students
    course.completedStudents.push({
      studentId: req.user._id,
      completedAt: new Date(),
      quizScore: 0,
      totalQuestions: 0
    });

    await course.save();

    res.json({
      success: true,
      message: 'Course marked as completed'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add quiz questions to existing course
// @route   POST /api/courses/:id/quiz
// @access  Private (course creator only)
export const addQuizQuestions = async (req, res) => {
  try {
    const { questions } = req.body;
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if user is the course creator
    if (course.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only course creator can add quiz questions' });
    }

    // Get current max order
    const existingQuestions = await QuizQuestion.find({ courseId: req.params.id });
    const maxOrder = existingQuestions.length > 0 ? Math.max(...existingQuestions.map(q => q.order)) : 0;

    // Add course ID and order to questions
    const questionsWithMeta = questions.map((question, index) => ({
      ...question,
      courseId: req.params.id,
      order: maxOrder + index + 1
    }));

    const newQuestions = await QuizQuestion.insertMany(questionsWithMeta);

    res.status(201).json({
      success: true,
      data: newQuestions
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};