# 🌪️ Disaster Preparedness & Response Education System - Backend

A comprehensive Node.js + Express + MongoDB backend for disaster preparedness education with gamification features.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Server runs on http://localhost:5002
```

## 📁 Project Structure

```
disaster-prep-backend/
├── server.js                 # Main server file
├── src/
│   ├── config/
│   │   └── db.js             # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js # Authentication logic
│   │   ├── courseController.js # Course management
│   │   └── gameController.js # Game APIs
│   ├── middleware/
│   │   ├── auth.js          # JWT authentication
│   │   └── errorMiddleware.js # Error handling
│   ├── models/
│   │   ├── User.js          # User schema
│   │   ├── School.js        # School schema
│   │   ├── Course.js        # Course schema
│   │   ├── Module.js        # Module schema
│   │   ├── QuizQuestion.js  # Quiz question schema
│   │   └── Attempt.js       # Quiz attempt schema
│   └── routes/
│       ├── authRoutes.js    # Auth endpoints
│       ├── courseRoutes.js  # Course endpoints
│       └── gameRoutes.js    # Game endpoints
├── .env                     # Environment variables
├── API_TEST_DATA.md         # Comprehensive API documentation
├── postman_collection.json  # Postman collection
├── test_data.json          # Sample test data
└── test_examples.js        # API usage examples
```

## 🔧 Environment Setup

Create a `.env` file:

```env
MONGO_URI=mongodb://localhost:27017/disaster-prep
PORT=5002
JWT_SECRET=your-super-secret-jwt-key
CLIENT_URL=http://localhost:3000
NODE_ENV=development
```

## 📋 API Endpoints

### 🔐 Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile
- `PUT /api/auth/password` - Change password

### 📚 Courses
- `GET /api/courses` - List all courses
- `POST /api/courses` - Create course (teacher only)
- `GET /api/courses/:id` - Get course details
- `PUT /api/courses/:id` - Update course
- `DELETE /api/courses/:id` - Delete course
- `POST /api/courses/:id/enroll` - Enroll in course
- `GET /api/courses/:id/progress` - Get progress
- `POST /api/courses/modules/:id/submit` - Submit quiz

### 🎮 Games
- `POST /api/games/story` - Interactive story scenarios
- `POST /api/games/story/choice` - Process story choice
- `POST /api/games/scenario` - Drag-drop scenarios
- `POST /api/games/scenario/submit` - Submit scenario response
- `POST /api/games/kit` - Emergency kit building
- `POST /api/games/kit/evaluate` - Evaluate kit choices
- `GET /api/games/stats` - Game statistics

## 🎯 Testing the APIs

### Option 1: Use Test Examples
```bash
node test_examples.js
```

### Option 2: Use cURL
```bash
# Register a student
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

# Login
curl -X POST http://localhost:5002/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'

# Get courses
curl -X GET http://localhost:5002/api/courses
```

### Option 3: Use Postman
Import `postman_collection.json` into Postman for GUI testing.

### Option 4: Run Test Script
```bash
chmod +x test_apis.sh
./test_apis.sh
```

## 📊 Database Models

### User Model
- Basic info (name, email, password)
- Role-based fields (student/teacher/admin)
- Progress tracking
- Game statistics

### Course Model
- Course metadata
- Module relationships
- Enrollment tracking
- Rating system

### Game Models
- Story scenarios with choices
- Drag-drop challenges
- Emergency kit building
- Progress and scoring

## 🛡️ Security Features

- JWT authentication with 30-day expiry
- Password hashing with bcryptjs
- Role-based access control
- Input validation
- CORS configuration
- Error handling middleware

## 🎮 Game Features

### Story Games
- Interactive disaster scenarios
- Multiple choice decisions
- Point-based scoring
- Educational feedback

### Scenario Games
- Drag-and-drop challenges
- Emergency preparedness tasks
- Time-based scoring
- Skill assessment

### Kit Building
- Budget-constrained shopping
- Emergency supply selection
- Survival day calculation
- Cost-effectiveness analysis

## 📈 Key Features

- **User Management**: Role-based authentication for students, teachers, and admins
- **Course System**: Complete course creation, enrollment, and progress tracking
- **Quiz Engine**: Flexible quiz system with auto-grading
- **Gamification**: Three different disaster preparedness games
- **Real-time**: Socket.io integration for live updates
- **Progress Tracking**: Comprehensive learning analytics
- **Responsive**: RESTful API design for easy frontend integration

## 🔍 Sample Data

Check `test_data.json` for:
- Sample user accounts
- Test course data
- Quiz questions
- Game scenarios
- API request examples

## 📚 Documentation

- **`API_TEST_DATA.md`** - Complete API documentation with examples
- **`test_data.json`** - Sample data for testing
- **`postman_collection.json`** - Postman collection for API testing
- **`test_examples.js`** - Node.js examples for API usage

## 🚦 Development Workflow

1. **Setup**: Install dependencies and configure environment
2. **Development**: Use `npm run dev` for hot-reload development
3. **Testing**: Use provided test files and Postman collection
4. **API Testing**: Follow examples in documentation
5. **Frontend Integration**: Use JWT tokens for authentication

## 💡 Usage Examples

### Complete User Journey
1. Register as student → Get JWT token
2. Browse and enroll in courses
3. Take quizzes and track progress
4. Play disaster preparedness games
5. View statistics and achievements

### Teacher Workflow
1. Register as teacher → Authenticate
2. Create courses with modules
3. Add quiz questions
4. Monitor student progress
5. Manage course content

## 🔧 Technologies Used

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT, bcryptjs
- **Real-time**: Socket.io
- **Development**: Nodemon for hot-reload
- **Testing**: Custom test scripts and Postman

## 📞 API Support

All endpoints return consistent JSON responses:

```json
{
  "success": true,
  "data": { ... },
  "message": "Optional message"
}
```

Error responses:
```json
{
  "success": false,
  "error": "Error message"
}
```

## 🎯 Ready for Production

The backend includes:
- Environment-based configuration
- Error handling middleware
- Security best practices
- Scalable architecture
- Comprehensive logging
- Real-time capabilities

Start building your disaster preparedness education platform! 🌟