import FileDB from '../config/filedb.js';
import bcrypt from 'bcryptjs';

const seedFileDatabase = () => {
  const fileDB = new FileDB();

  // Create demo users
  const demoUsers = [
    {
      name: "Sarah Johnson",
      email: "sarah.teacher@disastered.com",
      password: bcrypt.hashSync("teacher123", 10),
      role: "teacher",
      isActive: true
    },
    {
      name: "Alex Student",
      email: "alex.student@disastered.com",
      password: bcrypt.hashSync("student123", 10),
      role: "student",
      isActive: true,
      teacherId: null // Will be set after teacher is created
    }
  ];

  // Clear existing data
  fileDB.writeCollection('users', []);
  fileDB.writeCollection('courses', []);

  // Insert users
  const insertedUsers = [];
  demoUsers.forEach(user => {
    const inserted = fileDB.insert('users', user);
    insertedUsers.push(inserted);
  });

  // Update student with teacher ID
  const teacher = insertedUsers.find(u => u.role === 'teacher');
  const student = insertedUsers.find(u => u.role === 'student');
  if (teacher && student) {
    fileDB.update('users', { _id: student._id }, { teacherId: teacher._id });
  }

  // Create demo courses
  const demoCourses = [
    {
      title: "Earthquake Preparedness Basics",
      description: "Learn the fundamentals of earthquake preparedness and safety protocols",
      content: `# Earthquake Preparedness Basics

## Introduction
Earthquakes can strike without warning, making preparedness essential for your safety and that of your loved ones.

## Before an Earthquake
- **Secure Your Home**: Bolt heavy furniture to walls, secure water heaters, and install latches on cabinets
- **Create an Emergency Kit**: Include water (1 gallon per person per day), non-perishable food, first aid supplies, flashlights, and batteries
- **Develop a Family Plan**: Establish meeting points and communication plans
- **Practice Drop, Cover, and Hold On**: Regular drills help build muscle memory

## During an Earthquake
- **Drop**: Get down on hands and knees
- **Cover**: Take cover under a sturdy desk or table, or cover your head and neck with your arms
- **Hold On**: Hold onto your shelter and be prepared to move with it

## After an Earthquake
- **Check for Injuries**: Provide first aid if needed
- **Inspect for Damage**: Look for structural damage, gas leaks, and electrical hazards
- **Stay Informed**: Listen to emergency broadcasts for updates and instructions
- **Be Prepared for Aftershocks**: They can be as dangerous as the main earthquake

## Emergency Kit Essentials
- Water and water purification tablets
- Non-perishable food for at least 3 days
- Battery-powered or hand-crank radio
- Flashlights and extra batteries
- First aid kit and medications
- Whistle for signaling help
- Dust masks and plastic sheeting
- Cash in small bills
- Emergency contact information`,
      videoUrl: "https://www.youtube.com/watch?v=BLEPakj1YTY",
      difficulty: "Beginner",
      estimatedTime: 2,
      createdBy: teacher ? teacher._id : "demo-teacher",
      hasQuiz: true
    },
    {
      title: "Fire Safety and Evacuation",
      description: "Comprehensive guide to fire prevention, safety measures, and evacuation procedures",
      content: `# Fire Safety and Evacuation

## Fire Prevention
Fire prevention is the first line of defense against fire-related disasters.

### Home Fire Safety
- **Install Smoke Alarms**: Place them on every level of your home and in every bedroom
- **Test Monthly**: Replace batteries annually or use long-life batteries
- **Maintain Heating Equipment**: Have furnaces, fireplaces, and space heaters inspected annually
- **Safe Cooking Practices**: Never leave cooking unattended, keep flammable items away from stove
- **Electrical Safety**: Don't overload outlets, replace damaged cords

### Fire Escape Planning
- **Two Ways Out**: Every room should have two escape routes
- **Meeting Point**: Establish a safe meeting place outside your home
- **Practice Regularly**: Conduct fire drills at least twice a year
- **Special Considerations**: Plan for elderly, disabled, or young family members

## During a Fire Emergency
- **Get Out Fast**: Don't stop to gather belongings
- **Stay Low**: Crawl under smoke to avoid toxic gases
- **Feel Doors**: Check if doors are hot before opening
- **Close Doors**: Close doors behind you to slow fire spread
- **Call 911**: Once you're safely outside

## Fire Extinguisher Use (PASS Method)
- **Pull**: Pull the pin to break the tamper seal
- **Aim**: Aim at the base of the fire
- **Squeeze**: Squeeze the handle to release the agent
- **Sweep**: Sweep from side to side at the base of the fire`,
      videoUrl: "https://www.youtube.com/watch?v=7tUsqSaf1QQ",
      difficulty: "Beginner",
      estimatedTime: 1.5,
      createdBy: teacher ? teacher._id : "demo-teacher",
      hasQuiz: true
    }
  ];

  demoCourses.forEach(course => {
    fileDB.insert('courses', course);
  });

  console.log("📊 Demo data seeded successfully");
  return {
    users: insertedUsers.length,
    courses: demoCourses.length
  };
};

export default seedFileDatabase;