#!/bin/bash

# Test the enhanced disaster management backend APIs

BASE_URL="http://localhost:5000/api"

echo "🧪 Testing Enhanced Disaster Management Backend APIs"
echo "=============================================="

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test 1: Health Check
echo -e "\n${BLUE}1. Testing Health Check${NC}"
curl -s -X GET http://localhost:5000/ | jq '.'

# Test 2: Login as teacher
echo -e "\n${BLUE}2. Login as Teacher${NC}"
TEACHER_RESPONSE=$(curl -s -X POST $BASE_URL/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "sarah.teacher@disastered.com",
    "password": "teacher123"
  }')

TEACHER_TOKEN=$(echo $TEACHER_RESPONSE | jq -r '.data.accessToken')
echo "Teacher Token: ${TEACHER_TOKEN:0:20}..."

if [ "$TEACHER_TOKEN" = "null" ]; then
  echo -e "${RED}❌ Teacher login failed${NC}"
  exit 1
fi

# Test 3: Create Student Account
echo -e "\n${BLUE}3. Teacher Creates Student Account${NC}"
curl -s -X POST $BASE_URL/users/students \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TEACHER_TOKEN" \
  -d '{
    "name": "Test Student",
    "email": "test.student@disastered.com",
    "password": "student123",
    "dob": "2008-05-15",
    "classStandard": "Class 10"
  }' | jq '.'

# Test 4: Login as new student
echo -e "\n${BLUE}4. Login as New Student${NC}"
STUDENT_RESPONSE=$(curl -s -X POST $BASE_URL/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test.student@disastered.com",
    "password": "student123"
  }')

STUDENT_TOKEN=$(echo $STUDENT_RESPONSE | jq -r '.data.accessToken')
echo "Student Token: ${STUDENT_TOKEN:0:20}..."

# Test 5: Create Course with YouTube Video
echo -e "\n${BLUE}5. Teacher Creates Course with Video${NC}"
COURSE_RESPONSE=$(curl -s -X POST $BASE_URL/courses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TEACHER_TOKEN" \
  -d '{
    "title": "Fire Safety Basics",
    "description": "Learn essential fire safety techniques and prevention methods.",
    "videoUrl": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    "questions": [
      {
        "question": "What should you do first when you discover a fire?",
        "options": [
          {"text": "Try to put it out yourself", "isCorrect": false},
          {"text": "Alert others and call emergency services", "isCorrect": true},
          {"text": "Run away immediately", "isCorrect": false},
          {"text": "Take photos for social media", "isCorrect": false}
        ],
        "marks": 5
      },
      {
        "question": "Which of these is NOT a fire prevention method?",
        "options": [
          {"text": "Regular electrical inspections", "isCorrect": false},
          {"text": "Proper storage of flammable materials", "isCorrect": false},
          {"text": "Leaving candles unattended", "isCorrect": true},
          {"text": "Installing smoke detectors", "isCorrect": false}
        ],
        "marks": 5
      }
    ]
  }')

COURSE_ID=$(echo $COURSE_RESPONSE | jq -r '.data._id')
echo "Created Course ID: $COURSE_ID"

# Test 6: Student Enrolls in Course
echo -e "\n${BLUE}6. Student Enrolls in Course${NC}"
curl -s -X POST $BASE_URL/courses/$COURSE_ID/enroll \
  -H "Authorization: Bearer $STUDENT_TOKEN" | jq '.'

# Test 7: Get Course Quiz (Student)
echo -e "\n${BLUE}7. Student Gets Quiz Questions${NC}"
curl -s -X GET $BASE_URL/courses/$COURSE_ID/quiz \
  -H "Authorization: Bearer $STUDENT_TOKEN" | jq '.'

# Test 8: Submit Quiz (Student)
echo -e "\n${BLUE}8. Student Submits Quiz${NC}"
curl -s -X POST $BASE_URL/courses/$COURSE_ID/quiz/submit \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $STUDENT_TOKEN" \
  -d '{
    "answers": [1, 2]
  }' | jq '.'

# Test 9: Get Course Progress
echo -e "\n${BLUE}9. Check Course Progress${NC}"
curl -s -X GET $BASE_URL/courses/$COURSE_ID \
  -H "Authorization: Bearer $STUDENT_TOKEN" | jq '.'

# Test 10: Teacher Gets Their Students
echo -e "\n${BLUE}10. Teacher Gets Their Students${NC}"
curl -s -X GET $BASE_URL/users/my-students \
  -H "Authorization: Bearer $TEACHER_TOKEN" | jq '.'

# Test 11: Try Student Registration (Should Fail)
echo -e "\n${BLUE}11. Test Student Registration Restriction${NC}"
curl -s -X POST $BASE_URL/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Unauthorized Student",
    "email": "unauthorized@test.com",
    "password": "password123",
    "role": "student",
    "dob": "2009-01-01",
    "classStandard": "Class 9"
  }' | jq '.'

echo -e "\n${GREEN}✅ All tests completed!${NC}"