// Simple API test examples for Disaster Preparedness Backend
// Run this with: node test_examples.js

const API_BASE = 'http://localhost:5002';

console.log('🚀 Disaster Preparedness API Test Examples');
console.log('=========================================');
console.log(`Base URL: ${API_BASE}`);
console.log('');

// Sample test requests
const testRequests = {
  
  // 1. AUTHENTICATION TESTS
  auth: {
    register_student: {
      method: 'POST',
      url: `${API_BASE}/api/auth/register`,
      headers: { 'Content-Type': 'application/json' },
      body: {
        name: "Alex Johnson",
        email: "alex.student@example.com",
        password: "password123",
        role: "student",
        dob: "2010-05-15",
        classStandard: "Class 8"
      }
    },
    
    register_teacher: {
      method: 'POST',
      url: `${API_BASE}/api/auth/register`,
      headers: { 'Content-Type': 'application/json' },
      body: {
        name: "Dr. Sarah Smith",
        email: "sarah.teacher@example.com",
        password: "password123",
        role: "teacher"
      }
    },
    
    login: {
      method: 'POST',
      url: `${API_BASE}/api/auth/login`,
      headers: { 'Content-Type': 'application/json' },
      body: {
        email: "alex.student@example.com",
        password: "password123"
      }
    },
    
    get_profile: {
      method: 'GET',
      url: `${API_BASE}/api/auth/me`,
      headers: { 'Authorization': 'Bearer YOUR_JWT_TOKEN' }
    }
  },

  // 2. COURSE TESTS
  courses: {
    create_course: {
      method: 'POST',
      url: `${API_BASE}/api/courses`,
      headers: { 
        'Authorization': 'Bearer TEACHER_JWT_TOKEN',
        'Content-Type': 'application/json'
      },
      body: {
        title: "Earthquake Safety Fundamentals",
        description: "Learn essential earthquake preparedness and response techniques.",
        category: "earthquake",
        difficulty: "beginner",
        targetAge: { min: 10, max: 16 },
        estimatedDuration: 120,
        tags: ["earthquake", "safety", "preparedness"]
      }
    },
    
    get_all_courses: {
      method: 'GET',
      url: `${API_BASE}/api/courses`
    },
    
    get_course_with_filters: {
      method: 'GET',
      url: `${API_BASE}/api/courses?category=earthquake&difficulty=beginner&page=1&limit=5`
    },
    
    enroll_in_course: {
      method: 'POST',
      url: `${API_BASE}/api/courses/COURSE_ID/enroll`,
      headers: { 'Authorization': 'Bearer STUDENT_JWT_TOKEN' }
    },
    
    submit_quiz: {
      method: 'POST',
      url: `${API_BASE}/api/courses/modules/MODULE_ID/submit`,
      headers: { 
        'Authorization': 'Bearer STUDENT_JWT_TOKEN',
        'Content-Type': 'application/json'
      },
      body: {
        answers: [
          {
            questionId: "QUESTION_ID_1",
            selectedOption: "Duck under your desk immediately",
            timeSpent: 30
          },
          {
            questionId: "QUESTION_ID_2",
            userAnswer: "911",
            timeSpent: 25
          }
        ],
        timeTaken: 120,
        status: "completed"
      }
    }
  },

  // 3. GAME TESTS
  games: {
    story_game: {
      method: 'POST',
      url: `${API_BASE}/api/games/story`,
      headers: { 
        'Authorization': 'Bearer YOUR_JWT_TOKEN',
        'Content-Type': 'application/json'
      },
      body: {
        disasterType: "earthquake",
        userAge: 12
      }
    },
    
    process_story_choice: {
      method: 'POST',
      url: `${API_BASE}/api/games/story/choice`,
      headers: { 
        'Authorization': 'Bearer YOUR_JWT_TOKEN',
        'Content-Type': 'application/json'
      },
      body: {
        gameId: "story_earthquake_1634567890123",
        choiceId: 1,
        disasterType: "earthquake"
      }
    },
    
    scenario_game: {
      method: 'POST',
      url: `${API_BASE}/api/games/scenario`,
      headers: { 
        'Authorization': 'Bearer YOUR_JWT_TOKEN',
        'Content-Type': 'application/json'
      },
      body: {
        disasterType: "flood"
      }
    },
    
    submit_scenario: {
      method: 'POST',
      url: `${API_BASE}/api/games/scenario/submit`,
      headers: { 
        'Authorization': 'Bearer YOUR_JWT_TOKEN',
        'Content-Type': 'application/json'
      },
      body: {
        gameId: "scenario_flood_1634567890456",
        selectedItems: [
          { id: 1, name: "Move to higher ground", category: "essential", points: 10 },
          { id: 2, name: "Fill bathtub with water", category: "essential", points: 8 }
        ],
        timeTaken: 180
      }
    },
    
    kit_building: {
      method: 'POST',
      url: `${API_BASE}/api/games/kit`,
      headers: { 
        'Authorization': 'Bearer YOUR_JWT_TOKEN',
        'Content-Type': 'application/json'
      },
      body: {
        budget: 100,
        familySize: 4
      }
    },
    
    evaluate_kit: {
      method: 'POST',
      url: `${API_BASE}/api/games/kit/evaluate`,
      headers: { 
        'Authorization': 'Bearer YOUR_JWT_TOKEN',
        'Content-Type': 'application/json'
      },
      body: {
        gameId: "kit_1634567890789",
        selectedItems: [
          { id: 1, name: "Water bottles", cost: 15, days: 3, essential: true },
          { id: 4, name: "Canned food", cost: 20, days: 7, essential: true },
          { id: 8, name: "Flashlight", cost: 15, essential: true }
        ],
        totalCost: 50,
        familySize: 4
      }
    },
    
    get_stats: {
      method: 'GET',
      url: `${API_BASE}/api/games/stats`,
      headers: { 'Authorization': 'Bearer YOUR_JWT_TOKEN' }
    }
  }
};

// Sample curl commands
const curlExamples = {
  register: `curl -X POST ${API_BASE}/api/auth/register \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "Test Student",
    "email": "test@example.com",
    "password": "password123",
    "role": "student",
    "dob": "2010-01-01",
    "classStandard": "Class 8"
  }'`,
  
  login: `curl -X POST ${API_BASE}/api/auth/login \\
  -H "Content-Type: application/json" \\
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'`,
  
  get_courses: `curl -X GET ${API_BASE}/api/courses`,
  
  story_game: `curl -X POST ${API_BASE}/api/games/story \\
  -H "Authorization: Bearer YOUR_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{
    "disasterType": "earthquake",
    "userAge": 12
  }'`
};

// Print formatted examples
console.log('📚 SAMPLE REQUESTS:');
console.log('==================');
console.log('');

console.log('🔐 1. AUTHENTICATION');
console.log('--------------------');
console.log('Register Student:');
console.log(JSON.stringify(testRequests.auth.register_student, null, 2));
console.log('');

console.log('Login:');
console.log(JSON.stringify(testRequests.auth.login, null, 2));
console.log('');

console.log('📖 2. COURSES');
console.log('-------------');
console.log('Create Course:');
console.log(JSON.stringify(testRequests.courses.create_course, null, 2));
console.log('');

console.log('Get All Courses:');
console.log(JSON.stringify(testRequests.courses.get_all_courses, null, 2));
console.log('');

console.log('🎮 3. GAMES');
console.log('-----------');
console.log('Story Game:');
console.log(JSON.stringify(testRequests.games.story_game, null, 2));
console.log('');

console.log('Kit Building:');
console.log(JSON.stringify(testRequests.games.kit_building, null, 2));
console.log('');

console.log('🔧 CURL EXAMPLES:');
console.log('=================');
console.log('');
console.log('Register User:');
console.log(curlExamples.register);
console.log('');
console.log('Login:');
console.log(curlExamples.login);
console.log('');
console.log('Get Courses:');
console.log(curlExamples.get_courses);
console.log('');
console.log('Story Game:');
console.log(curlExamples.story_game);
console.log('');

console.log('💡 TESTING WORKFLOW:');
console.log('====================');
console.log('1. Register a user (student/teacher)');
console.log('2. Login and save the JWT token');
console.log('3. Use the token in Authorization header for protected routes');
console.log('4. Test course creation (teacher) and enrollment (student)');
console.log('5. Test all three game types');
console.log('6. Check game statistics');
console.log('');
console.log('📋 Available endpoints:');
console.log('- Auth: /api/auth/register, /api/auth/login, /api/auth/me');
console.log('- Courses: /api/courses (GET/POST), /api/courses/:id/enroll');
console.log('- Games: /api/games/story, /api/games/scenario, /api/games/kit');
console.log('- Stats: /api/games/stats');
console.log('');
console.log('🌐 Server should be running on: http://localhost:5002');
console.log('📖 Check API_TEST_DATA.md for detailed documentation');
console.log('📮 Import postman_collection.json into Postman for GUI testing');