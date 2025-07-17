# 🎓 E-Learning Platform Demo

A comprehensive e-learning platform featuring **RAG-powered quiz generation**, personalized learning, and AI-driven features.

## 🚀 Quick Start

### 1. Start the Backend
```bash
cd lore-backend
# Activate your virtual environment
.\venv\Scripts\Activate  # Windows
source venv/bin/activate  # Linux/Mac

# Install dependencies (if not already done)
pip install fastapi uvicorn sqlalchemy passlib[bcrypt] python-jose[cryptography] python-multipart httpx

# Start the server
uvicorn app.main:app --host localhost --port 8000 --reload
```

### 2. Start the Frontend
```bash
cd lore-frontend
npm install
npm run dev
```

### 3. Access the Platform
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:8000
- **API Documentation:** http://localhost:8000/docs
- **RAG API:** https://cb5c7cf4995c.ngrok-free.app

## 🎯 Demo Features

### ✅ **RAG-Powered Quiz Generation**
- **AI-Generated Questions:** Uses your NCERT biology dataset
- **Smart Question Types:** MCQ, True/False, Short Answer
- **Difficulty Levels:** Easy, Medium, Hard
- **Chapter-Specific:** Questions based on specific chapters

### ✅ **User Authentication & Profiles**
- Secure JWT-based authentication
- User registration and login
- Personalized user profiles
- Progress tracking

### ✅ **Personalized Dashboard**
- Learning progress visualization
- Recent activities
- Achievement badges
- Course recommendations

### ✅ **Video Learning System**
- Video progress tracking
- Watch history
- Bookmarking system
- Completion certificates

### ✅ **Reminders & Calendar**
- Smart reminder system
- Calendar integration
- Study schedule management
- Notification system

### ✅ **AI Chatbot Q&A**
- Context-aware responses
- Learning assistance
- Doubt resolution
- Interactive learning

### ✅ **Badge & Achievement System**
- Gamified learning experience
- Progress-based rewards
- Achievement tracking
- Motivation system

## 🔧 Technical Architecture

### Backend (FastAPI)
- **Framework:** FastAPI with SQLAlchemy
- **Database:** SQLite (can be upgraded to PostgreSQL)
- **Authentication:** JWT with bcrypt
- **RAG Integration:** HTTP client to ngrok-exposed RAG API

### Frontend (React + TypeScript)
- **Framework:** React 18 with TypeScript
- **Styling:** Tailwind CSS
- **State Management:** React hooks
- **HTTP Client:** Axios

### RAG Model
- **Model:** Custom RAG implementation
- **Dataset:** NCERT Biology XII
- **Deployment:** FastAPI server via ngrok
- **Features:** Question generation, answer validation

## 📊 API Endpoints

### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `GET /auth/me` - Get current user

### Quiz System
- `POST /quizzes/generate` - Generate AI-powered questions
- `POST /quizzes/submit` - Submit quiz answers
- `GET /quizzes/` - Get quiz history

### Video System
- `GET /videos/` - Get available videos
- `POST /progress/` - Update video progress
- `GET /progress/` - Get learning progress

### Reminders
- `GET /reminders/` - Get user reminders
- `POST /reminders/` - Create new reminder
- `PUT /reminders/{id}` - Update reminder
- `DELETE /reminders/{id}` - Delete reminder

## 🧪 Testing the Integration

### Test RAG API Connection
```bash
cd lore-backend
python demo_setup.py
```

### Manual API Testing
```bash
# Test quiz generation
curl -X POST "http://localhost:8000/quizzes/generate" \
  -H "Content-Type: application/json" \
  -d '{
    "num_questions": 5,
    "chapter": "Chapter 1: Reproduction in Organisms",
    "question_type": "mcq",
    "difficulty": "medium"
  }'
```

## 🎨 Demo Scenarios

### 1. **New User Onboarding**
1. Register a new account
2. Complete profile setup
3. Explore the dashboard
4. Take a sample quiz

### 2. **RAG Quiz Generation**
1. Navigate to Quiz section
2. Select chapter and parameters
3. Generate AI-powered questions
4. Complete the quiz
5. View results and explanations

### 3. **Learning Progress**
1. Watch educational videos
2. Track progress completion
3. Earn badges and achievements
4. Set study reminders

### 4. **AI Chatbot**
1. Ask questions about biology
2. Get contextual responses
3. Explore learning resources
4. Interactive Q&A session

## 🔍 Troubleshooting

### Common Issues

**1. RAG API Connection Failed**
- Check if ngrok tunnel is active
- Verify the ngrok URL is correct
- Test direct connection to RAG API

**2. Backend Won't Start**
- Ensure virtual environment is activated
- Install all dependencies: `pip install -r requirements.txt`
- Check port 8000 is available

**3. Frontend Build Issues**
- Clear node_modules: `rm -rf node_modules && npm install`
- Check Node.js version (recommend 16+)
- Clear browser cache

**4. Database Issues**
- Delete `test.db` and restart (will recreate)
- Check SQLite permissions
- Verify database path

## 📈 Performance Notes

- **RAG API:** First request may take 10-15 seconds (model loading)
- **Subsequent requests:** 2-5 seconds
- **Fallback system:** Works even if RAG API is down
- **Caching:** Implemented for better performance

## 🚀 Production Deployment

### Backend Deployment
```bash
# Install production dependencies
pip install gunicorn

# Run with gunicorn
gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker
```

### Frontend Deployment
```bash
# Build for production
npm run build

# Serve with nginx or similar
```

## 📞 Support

For demo issues or questions:
1. Check the troubleshooting section
2. Run `python demo_setup.py` for diagnostics
3. Check API documentation at `/docs`
4. Review server logs for errors

---

**🎉 Your E-Learning Platform is Ready for Demo!** 