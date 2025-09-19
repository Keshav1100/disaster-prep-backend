# Disaster Preparedness API Test Data

This file contains test API requests and sample data for testing all endpoints in the Disaster Preparedness backend.

**Base URL:** `http://localhost:5002`

## 🔐 Authentication APIs

### 1. Register User (Student)
```bash
POST /api/auth/register
Content-Type: application/json

{
  "name": "Alex Johnson",
  "email": "alex.student@example.com",
  "password": "password123",
  "role": "student",
  "dob": "2010-05-15",
  "classStandard": "Class 8"
}
```

### 2. Register User (Teacher)
```bash
POST /api/auth/register
Content-Type: application/json

{
  "name": "Dr. Sarah Smith",
  "email": "sarah.teacher@example.com",
  "password": "password123",
  "role": "teacher"
}
```

### 3. Login User
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "alex.student@example.com",
  "password": "password123"
}
```

### 4. Get Current User
```bash
GET /api/auth/me
Authorization: Bearer YOUR_JWT_TOKEN
```

### 5. Update Profile
```bash
PUT /api/auth/profile
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "name": "Alex Johnson Updated",
  "region": {
    "state": "California",
    "district": "Los Angeles",
    "lat": 34.0522,
    "lng": -118.2437
  }
}
```

### 6. Change Password
```bash
PUT /api/auth/password
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "currentPassword": "password123",
  "newPassword": "newpassword456"
}
```

## 📚 Course Management APIs

### 1. Create Course (Teacher Only)
```bash
POST /api/courses
Authorization: Bearer TEACHER_JWT_TOKEN
Content-Type: application/json

{
  "title": "Earthquake Safety Fundamentals",
  "description": "Learn essential earthquake preparedness and response techniques for students and families.",
  "category": "earthquake",
  "difficulty": "beginner",
  "targetAge": {
    "min": 10,
    "max": 16
  },
  "estimatedDuration": 120,
  "tags": ["earthquake", "safety", "preparedness", "emergency"]
}
```

### 2. Get All Courses
```bash
GET /api/courses
# With filters:
GET /api/courses?category=earthquake&difficulty=beginner&page=1&limit=5
GET /api/courses?search=earthquake
```

### 3. Get Single Course
```bash
GET /api/courses/COURSE_ID
```

### 4. Enroll in Course (Student Only)
```bash
POST /api/courses/COURSE_ID/enroll
Authorization: Bearer STUDENT_JWT_TOKEN
```

### 5. Submit Quiz Attempt
```bash
POST /api/courses/modules/MODULE_ID/submit
Authorization: Bearer STUDENT_JWT_TOKEN
Content-Type: application/json

{
  "answers": [
    {
      "questionId": "QUESTION_ID_1",
      "selectedOption": "Duck under your desk immediately",
      "timeSpent": 30
    },
    {
      "questionId": "QUESTION_ID_2",
      "selectedOption": "True",
      "timeSpent": 25
    },
    {
      "questionId": "QUESTION_ID_3",
      "userAnswer": "Drop, Cover, Hold On",
      "timeSpent": 45
    }
  ],
  "timeTaken": 300,
  "status": "completed"
}
```

### 6. Get Course Progress
```bash
GET /api/courses/COURSE_ID/progress
Authorization: Bearer STUDENT_JWT_TOKEN
```

### 7. Update Course (Teacher/Admin Only)
```bash
PUT /api/courses/COURSE_ID
Authorization: Bearer TEACHER_JWT_TOKEN
Content-Type: application/json

{
  "title": "Advanced Earthquake Safety",
  "description": "Updated description",
  "isPublished": true
}
```

### 8. Delete Course (Teacher/Admin Only)
```bash
DELETE /api/courses/COURSE_ID
Authorization: Bearer TEACHER_JWT_TOKEN
```

## 🎮 Game APIs

### 1. Story Game - Get Scenario
```bash
POST /api/games/story
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "disasterType": "earthquake",
  "userAge": 12
}
```

### 2. Story Game - Process Choice
```bash
POST /api/games/story/choice
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "gameId": "story_earthquake_1634567890123",
  "choiceId": 1,
  "disasterType": "earthquake"
}
```

### 3. Scenario Game - Get Drag-Drop Challenge
```bash
POST /api/games/scenario
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "disasterType": "flood"
}
```

### 4. Scenario Game - Submit Response
```bash
POST /api/games/scenario/submit
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "gameId": "scenario_flood_1634567890456",
  "selectedItems": [
    { "id": 1, "name": "Move to higher ground", "category": "essential", "points": 10 },
    { "id": 2, "name": "Fill bathtub with water", "category": "essential", "points": 8 },
    { "id": 5, "name": "Turn off utilities", "category": "essential", "points": 9 }
  ],
  "timeTaken": 180
}
```

### 5. Kit Building Game - Get Items
```bash
POST /api/games/kit
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "budget": 100,
  "familySize": 4
}
```

### 6. Kit Building Game - Evaluate Choices
```bash
POST /api/games/kit/evaluate
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "gameId": "kit_1634567890789",
  "selectedItems": [
    { "id": 1, "name": "Water bottles (24-pack)", "cost": 15, "days": 3, "essential": true },
    { "id": 4, "name": "Canned food (variety pack)", "cost": 20, "days": 7, "essential": true },
    { "id": 8, "name": "Flashlight", "cost": 15, "essential": true },
    { "id": 10, "name": "First aid kit", "cost": 25, "essential": true }
  ],
  "totalCost": 75,
  "familySize": 4
}
```

### 7. Get Game Statistics
```bash
GET /api/games/stats
Authorization: Bearer YOUR_JWT_TOKEN
```

## 📊 Sample Data for Testing

### Sample User Accounts
```json
// Student Account
{
  "name": "Emma Davis",
  "email": "emma.student@test.com",
  "password": "student123",
  "role": "student",
  "dob": "2009-03-20",
  "classStandard": "Class 9"
}

// Teacher Account
{
  "name": "Mr. John Wilson",
  "email": "john.teacher@test.com",
  "password": "teacher123",
  "role": "teacher"
}

// Admin Account
{
  "name": "Admin User",
  "email": "admin@test.com",
  "password": "admin123",
  "role": "admin"
}
```

### Sample Course Data
```json
{
  "title": "Flood Safety and Response",
  "description": "Comprehensive guide to flood preparedness, during-flood actions, and post-flood recovery for students and families.",
  "category": "flood",
  "difficulty": "intermediate",
  "targetAge": { "min": 12, "max": 18 },
  "estimatedDuration": 90,
  "tags": ["flood", "water safety", "evacuation", "emergency kit"]
}
```

### Sample Quiz Questions Data
```json
[
  {
    "questionText": "What should you do immediately when you feel an earthquake?",
    "questionType": "multiple-choice",
    "options": [
      { "text": "Duck under your desk immediately", "isCorrect": true },
      { "text": "Run outside quickly", "isCorrect": false },
      { "text": "Stand in the doorway", "isCorrect": false },
      { "text": "Call for help", "isCorrect": false }
    ],
    "explanation": "Drop, Cover, and Hold On is the safest immediate response to an earthquake.",
    "marks": 2,
    "difficulty": "easy"
  },
  {
    "questionText": "True or False: You should drive through flood water if it's less than 6 inches deep.",
    "questionType": "true-false",
    "options": [
      { "text": "True", "isCorrect": false },
      { "text": "False", "isCorrect": true }
    ],
    "explanation": "Never drive through flood water - just 6 inches can carry away a vehicle.",
    "marks": 1,
    "difficulty": "easy"
  }
]
```

## 🧪 Test Scenarios

### Complete User Journey Test
1. Register as student → Login → Get profile
2. Teacher creates course → Student enrolls → Student takes quiz
3. Student plays story game → Plays scenario game → Builds emergency kit
4. Check game statistics and progress

### Error Testing
```bash
# Test unauthorized access
GET /api/courses
# Should work (public)

GET /api/auth/me
# Should return 401 (no token)

# Test invalid data
POST /api/auth/register
{
  "name": "Test",
  "email": "invalid-email",
  "password": "123"
}
# Should return validation errors
```

## 📱 cURL Examples

### Register and Login Flow
```bash
# Register
curl -X POST http://localhost:5002/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Student",
    "email": "test@example.com",
    "password": "password123",
    "role": "student",
    "dob": "2010-01-01",
    "classStandard": "Class 8"
  }'

# Login (save the token from response)
curl -X POST http://localhost:5002/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'

# Use token for authenticated requests
curl -X GET http://localhost:5002/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Game Testing
```bash
# Start story game
curl -X POST http://localhost:5002/api/games/story \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"disasterType": "earthquake", "userAge": 12}'

# Get game stats
curl -X GET http://localhost:5002/api/games/stats \
  -H "Authorization: Bearer YOUR_TOKEN"
```

This test data covers all your API endpoints with realistic examples you can use for testing!