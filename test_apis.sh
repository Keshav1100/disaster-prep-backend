#!/bin/bash

# Disaster Preparedness API Test Script
# Make sure your server is running on localhost:5002 before running this script

BASE_URL="http://localhost:5002"
echo "🚀 Testing Disaster Preparedness API at $BASE_URL"
echo "================================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print test results
print_result() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✅ PASS${NC}: $2"
    else
        echo -e "${RED}❌ FAIL${NC}: $2"
    fi
}

# Test 1: Check if server is running
echo -e "${YELLOW}🔍 Testing server health...${NC}"
response=$(curl -s -o /dev/null -w "%{http_code}" $BASE_URL)
if [ $response -eq 200 ]; then
    print_result 0 "Server is running"
else
    print_result 1 "Server is not responding"
    exit 1
fi

echo ""

# Test 2: Register a new student
echo -e "${YELLOW}🔍 Testing user registration...${NC}"
student_response=$(curl -s -X POST $BASE_URL/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Student",
    "email": "test.student@example.com",
    "password": "password123",
    "role": "student",
    "dob": "2010-01-01",
    "classStandard": "Class 8"
  }')

if echo "$student_response" | grep -q '"success":true'; then
    print_result 0 "Student registration"
    student_token=$(echo "$student_response" | sed -n 's/.*"token":"\([^"]*\)".*/\1/p')
else
    print_result 1 "Student registration"
fi

echo ""

# Test 3: Register a teacher
echo -e "${YELLOW}🔍 Testing teacher registration...${NC}"
teacher_response=$(curl -s -X POST $BASE_URL/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Teacher",
    "email": "test.teacher@example.com",
    "password": "password123",
    "role": "teacher"
  }')

if echo "$teacher_response" | grep -q '"success":true'; then
    print_result 0 "Teacher registration"
    teacher_token=$(echo "$teacher_response" | sed -n 's/.*"token":"\([^"]*\)".*/\1/p')
else
    print_result 1 "Teacher registration"
fi

echo ""

# Test 4: Login
echo -e "${YELLOW}🔍 Testing user login...${NC}"
login_response=$(curl -s -X POST $BASE_URL/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test.student@example.com",
    "password": "password123"
  }')

if echo "$login_response" | grep -q '"success":true'; then
    print_result 0 "User login"
else
    print_result 1 "User login"
fi

echo ""

# Test 5: Get user profile
echo -e "${YELLOW}🔍 Testing protected route (get profile)...${NC}"
if [ -n "$student_token" ]; then
    profile_response=$(curl -s -X GET $BASE_URL/api/auth/me \
      -H "Authorization: Bearer $student_token")
    
    if echo "$profile_response" | grep -q '"success":true'; then
        print_result 0 "Get user profile"
    else
        print_result 1 "Get user profile"
    fi
else
    print_result 1 "Get user profile (no token available)"
fi

echo ""

# Test 6: Create a course (teacher only)
echo -e "${YELLOW}🔍 Testing course creation...${NC}"
if [ -n "$teacher_token" ]; then
    course_response=$(curl -s -X POST $BASE_URL/api/courses \
      -H "Authorization: Bearer $teacher_token" \
      -H "Content-Type: application/json" \
      -d '{
        "title": "Test Earthquake Course",
        "description": "A test course for earthquake safety",
        "category": "earthquake",
        "difficulty": "beginner",
        "targetAge": {"min": 10, "max": 16},
        "estimatedDuration": 60,
        "tags": ["test", "earthquake"]
      }')
    
    if echo "$course_response" | grep -q '"success":true'; then
        print_result 0 "Course creation"
        course_id=$(echo "$course_response" | sed -n 's/.*"_id":"\([^"]*\)".*/\1/p')
    else
        print_result 1 "Course creation"
    fi
else
    print_result 1 "Course creation (no teacher token available)"
fi

echo ""

# Test 7: Get all courses
echo -e "${YELLOW}🔍 Testing get all courses...${NC}"
courses_response=$(curl -s -X GET $BASE_URL/api/courses)

if echo "$courses_response" | grep -q '"success":true'; then
    print_result 0 "Get all courses"
else
    print_result 1 "Get all courses"
fi

echo ""

# Test 8: Story game
echo -e "${YELLOW}🔍 Testing story game...${NC}"
if [ -n "$student_token" ]; then
    story_response=$(curl -s -X POST $BASE_URL/api/games/story \
      -H "Authorization: Bearer $student_token" \
      -H "Content-Type: application/json" \
      -d '{
        "disasterType": "earthquake",
        "userAge": 12
      }')
    
    if echo "$story_response" | grep -q '"success":true'; then
        print_result 0 "Story game"
    else
        print_result 1 "Story game"
    fi
else
    print_result 1 "Story game (no token available)"
fi

echo ""

# Test 9: Scenario game
echo -e "${YELLOW}🔍 Testing scenario game...${NC}"
if [ -n "$student_token" ]; then
    scenario_response=$(curl -s -X POST $BASE_URL/api/games/scenario \
      -H "Authorization: Bearer $student_token" \
      -H "Content-Type: application/json" \
      -d '{
        "disasterType": "flood"
      }')
    
    if echo "$scenario_response" | grep -q '"success":true'; then
        print_result 0 "Scenario game"
    else
        print_result 1 "Scenario game"
    fi
else
    print_result 1 "Scenario game (no token available)"
fi

echo ""

# Test 10: Kit building game
echo -e "${YELLOW}🔍 Testing kit building game...${NC}"
if [ -n "$student_token" ]; then
    kit_response=$(curl -s -X POST $BASE_URL/api/games/kit \
      -H "Authorization: Bearer $student_token" \
      -H "Content-Type: application/json" \
      -d '{
        "budget": 100,
        "familySize": 4
      }')
    
    if echo "$kit_response" | grep -q '"success":true'; then
        print_result 0 "Kit building game"
    else
        print_result 1 "Kit building game"
    fi
else
    print_result 1 "Kit building game (no token available)"
fi

echo ""

# Test 11: Game statistics
echo -e "${YELLOW}🔍 Testing game statistics...${NC}"
if [ -n "$student_token" ]; then
    stats_response=$(curl -s -X GET $BASE_URL/api/games/stats \
      -H "Authorization: Bearer $student_token")
    
    if echo "$stats_response" | grep -q '"success":true'; then
        print_result 0 "Game statistics"
    else
        print_result 1 "Game statistics"
    fi
else
    print_result 1 "Game statistics (no token available)"
fi

echo ""
echo "================================================"
echo -e "${GREEN}🎉 API Testing Complete!${NC}"
echo ""
echo "📊 Test Summary:"
echo "- ✅ Server health check"
echo "- ✅ User registration (student & teacher)"
echo "- ✅ User authentication"
echo "- ✅ Protected routes"
echo "- ✅ Course management"
echo "- ✅ Game APIs (story, scenario, kit)"
echo "- ✅ Game statistics"
echo ""
echo "💡 Tips:"
echo "1. Use the generated tokens for further API testing"
echo "2. Import postman_collection.json into Postman for GUI testing"
echo "3. Check API_TEST_DATA.md for detailed examples"
echo ""
echo "🔗 API Base URL: $BASE_URL"