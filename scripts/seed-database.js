import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from '../src/models/User.js';
import Course from '../src/models/Course.js';
import QuizQuestion from '../src/models/QuizQuestion.js';

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected for seeding');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  }
};

const clearDatabase = async () => {
  try {
    console.log('🧹 Clearing existing data...');
    await User.deleteMany({});
    await Course.deleteMany({});
    await QuizQuestion.deleteMany({});
    console.log('✅ Database cleared');
  } catch (error) {
    console.error('❌ Error clearing database:', error);
  }
};

const createTestUsers = async () => {
  const salt = await bcrypt.genSalt(10);
  
  const testUsers = [
    // Admin User
    {
      name: 'Admin User',
      email: 'admin@disastered.com',
      passwordHash: await bcrypt.hash('admin123', salt),
      role: 'admin'
    },
    // Teachers
    {
      name: 'Sarah Wilson',
      email: 'sarah.teacher@disastered.com',
      passwordHash: await bcrypt.hash('teacher123', salt),
      role: 'teacher'
    },
    {
      name: 'Michael Brown',
      email: 'michael.teacher@disastered.com',
      passwordHash: await bcrypt.hash('teacher123', salt),
      role: 'teacher'
    },
    // Students - These will be created by teachers
    {
      name: 'Alice Johnson',
      email: 'alice.student@disastered.com',
      passwordHash: await bcrypt.hash('student123', salt),
      role: 'student',
      dob: new Date('2008-05-15'),
      classStandard: '10'
    },
    {
      name: 'Bob Smith',
      email: 'bob.student@disastered.com',
      passwordHash: await bcrypt.hash('student123', salt),
      role: 'student',
      dob: new Date('2009-03-22'),
      classStandard: '9'
    },
    {
      name: 'Charlie Davis',
      email: 'charlie.student@disastered.com',
      passwordHash: await bcrypt.hash('student123', salt),
      role: 'student',
      dob: new Date('2007-11-08'),
      classStandard: '11'
    },
    {
      name: 'Diana Martinez',
      email: 'diana.student@disastered.com',
      passwordHash: await bcrypt.hash('student123', salt),
      role: 'student',
      dob: new Date('2008-09-12'),
      classStandard: '10'
    },
    {
      name: 'Ethan Wilson',
      email: 'ethan.student@disastered.com',
      passwordHash: await bcrypt.hash('student123', salt),
      role: 'student',
      dob: new Date('2009-01-30'),
      classStandard: '9'
    }
  ];

  try {
    console.log('👥 Creating test users...');
    const createdUsers = await User.insertMany(testUsers);
    console.log('✅ Test users created successfully');
    return createdUsers;
  } catch (error) {
    console.error('❌ Error creating test users:', error);
    throw error;
  }
};

const createSampleCourse = async (users) => {
  const teacher = users.find(user => user.role === 'teacher');
  
  try {
    console.log('📚 Creating sample earthquake course...');
    
    // Create the course
    const course = await Course.create({
      title: 'Earthquake Safety and Preparedness',
      description: 'Learn essential earthquake safety measures, preparedness strategies, and emergency response techniques to protect yourself and your community.',
      videoUrl: 'https://www.youtube.com/watch?v=BLEPakj1YTY', // Sample earthquake safety video
      createdBy: teacher._id,
      category: 'earthquake',
      difficulty: 'beginner',
      estimatedDuration: 45,
      isPublished: true,
      thumbnailUrl: 'https://example.com/earthquake-thumbnail.jpg'
    });

    // Create quiz questions for the course
    const quizQuestions = [
      {
        questionText: 'What is the safest action to take during an earthquake if you are indoors?',
        questionType: 'multiple-choice',
        options: [
          { text: 'Run outside immediately', isCorrect: false },
          { text: 'Drop, Cover, and Hold On under a sturdy desk or table', isCorrect: true },
          { text: 'Stand in a doorway', isCorrect: false },
          { text: 'Hide under a bed', isCorrect: false }
        ],
        explanation: 'Drop, Cover, and Hold On is the recommended safety action. Get under a sturdy desk or table if available.',
        marks: 10,
        courseId: course._id,
        order: 1
      },
      {
        questionText: 'How long should you stay in your protective position during an earthquake?',
        questionType: 'multiple-choice',
        options: [
          { text: 'Until the shaking stops completely', isCorrect: true },
          { text: 'For exactly 30 seconds', isCorrect: false },
          { text: 'Until you count to 10', isCorrect: false },
          { text: 'Until someone tells you to move', isCorrect: false }
        ],
        explanation: 'You should maintain your protective position until the shaking stops completely.',
        marks: 10,
        courseId: course._id,
        order: 2
      },
      {
        questionText: 'What should you avoid doing during an earthquake?',
        questionType: 'multiple-choice',
        options: [
          { text: 'Staying calm', isCorrect: false },
          { text: 'Protecting your head and neck', isCorrect: false },
          { text: 'Running to exits or doorways', isCorrect: true },
          { text: 'Getting under sturdy furniture', isCorrect: false }
        ],
        explanation: 'Running to exits during shaking can be dangerous due to falling objects and potential stampedes.',
        marks: 10,
        courseId: course._id,
        order: 3
      },
      {
        questionText: 'What items should be in an earthquake emergency kit?',
        questionType: 'multiple-choice',
        options: [
          { text: 'Water, food, flashlight, first aid kit', isCorrect: true },
          { text: 'Only water and food', isCorrect: false },
          { text: 'Just a flashlight', isCorrect: false },
          { text: 'Only important documents', isCorrect: false }
        ],
        explanation: 'A complete emergency kit should include water, non-perishable food, flashlight, first aid supplies, and other essentials.',
        marks: 10,
        courseId: course._id,
        order: 4
      },
      {
        questionText: 'After an earthquake stops, what should you do first?',
        questionType: 'multiple-choice',
        options: [
          { text: 'Immediately go outside', isCorrect: false },
          { text: 'Check for injuries and hazards before moving', isCorrect: true },
          { text: 'Turn on all electrical appliances', isCorrect: false },
          { text: 'Call everyone you know', isCorrect: false }
        ],
        explanation: 'First check yourself and others for injuries, and look for hazards like gas leaks or structural damage.',
        marks: 10,
        courseId: course._id,
        order: 5
      }
    ];

    await QuizQuestion.insertMany(quizQuestions);

    console.log('✅ Sample earthquake course created successfully');
    return course;
  } catch (error) {
    console.error('❌ Error creating sample course:', error);
    throw error;
  }
};

const seedDatabase = async () => {
  try {
    await connectDB();
    await clearDatabase();
    const users = await createTestUsers();
    await createSampleCourse(users);
    
    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n📋 Test User Credentials:');
    console.log('================================');
    console.log('👨‍💼 Admin:');
    console.log('  Email: admin@disastered.com');
    console.log('  Password: admin123');
    console.log('\n👩‍🏫 Teachers:');
    console.log('  Email: sarah.teacher@disastered.com');
    console.log('  Password: teacher123');
    console.log('  Email: michael.teacher@disastered.com');
    console.log('  Password: teacher123');
    console.log('\n👩‍🎓 Students:');
    console.log('  Email: alice.student@disastered.com');
    console.log('  Password: student123');
    console.log('  Email: bob.student@disastered.com');
    console.log('  Password: student123');
    console.log('  Email: charlie.student@disastered.com');
    console.log('  Password: student123');
    console.log('  Email: diana.student@disastered.com');
    console.log('  Password: student123');
    console.log('  Email: ethan.student@disastered.com');
    console.log('  Password: student123');
    console.log('\n================================');
    
  } catch (error) {
    console.error('❌ Seeding failed:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
    process.exit(0);
  }
};

seedDatabase();