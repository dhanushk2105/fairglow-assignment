# Task Tracker - Senior Full-Stack Take-Home

A production-minded implementation of a simple task management application, built with React/TypeScript frontend and Flask/Python backend.

## 🏗️ Architecture Overview

- **Frontend**: Layered architecture with clear separation between presentation (components), state (hooks), business logic (services), and transport (API)
- **Backend**: Service-oriented architecture with separated concerns (controllers, services, repositories, models)
- **Security**: Input validation, rate limiting, CORS restrictions, server-generated UUIDs
- **Scalability**: Designed for team collaboration with clearly defined boundaries

## 🚀 Quick Start

### Prerequisites
- Python 3.9+
- Node.js 18+
- npm or yarn

### Backend Setup
```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run Flask server
flask run
# Or: python app.py

# Server runs on http://localhost:5000
```

### Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev

# App runs on http://localhost:5173
```

## 📁 Project Structure
```
├── backend/
│   ├── app.py              # Flask routes (controllers)
│   ├── models.py           # Task data model
│   ├── repository.py       # Persistence layer
│   ├── services.py         # Business logic
│   ├── schemas.py          # JSON serialization
│   ├── security.py         # Rate limiting, validation
│   └── requirements.txt    # Python dependencies
│
└── frontend/
    └── src/
        ├── api/            # HTTP client & API calls
        ├── components/     # Dumb presentational components
        ├── hooks/          # React state management hooks
        ├── pages/          # Page-level orchestrators
        ├── services/       # Frontend business logic
        ├── types/          # TypeScript interfaces
        └── utils/          # Pure utility functions
```

## 🔐 Security Considerations

### Implemented
- ✅ **Input Validation**: Server-side validation of all inputs (non-empty titles, length limits)
- ✅ **Rate Limiting**: Write operations limited to 20 requests/minute per IP
- ✅ **CORS Restrictions**: Only `localhost:5173` allowed (not `*`)
- ✅ **Server-Generated IDs**: UUIDs created server-side, never trust client IDs
- ✅ **Safe Error Handling**: Never leak stack traces in API responses
- ✅ **Idempotent Deletes**: Delete operations safe to retry

### Production Enhancements Needed
- 🔲 Authentication & authorization (JWT tokens)
- 🔲 Redis-backed rate limiting for distributed systems
- 🔲 HTTPS enforcement
- 🔲 Request signing/CSRF protection
- 🔲 SQL injection prevention (when using real DB)
- 🔲 API versioning
- 🔲 Audit logging

## 🎯 Assumptions Made

1. **No Authentication**: Tasks are global, not per-user (MVP scope)
2. **In-Memory Storage**: Using Python list instead of database for 2-hour constraint
3. **Single Instance**: Rate limiter uses local memory (not distributed)
4. **No Pagination**: Suitable for MVP with limited tasks
5. **Minimal Styling**: Focus on architecture over UI polish


## 💡 Key Design Decisions

### 1. Layered Frontend Architecture
- **Why**: Components are dumb → easy to test, easy to delegate
- **Result**: Business logic in `services/` is framework-agnostic

### 2. Repository Pattern on Backend
- **Why**: Database swap requires changing only `repository.py`
- **Result**: Business logic (`services.py`) has zero DB coupling

### 3. Optimistic Updates
- **Why**: Instant UI feedback, better UX
- **Result**: Rollback mechanism on API errors

### 4. Rate Limiting Early
- **Why**: Prevents abuse even in MVP
- **Result**: Placeholder ready for production middleware


## 📚 Technologies Used

- **Frontend**: React 18, TypeScript, Vite
- **Backend**: Flask 3.0, Python 3.9+
- **Storage**: In-memory (production: PostgreSQL)
- **Rate Limiting**: Flask-Limiter
- **CORS**: flask-cors

## 🤝 Contributing

For production development:

1. Components live in `components/` - no API calls, no hooks
2. Business logic lives in `services/` - no React, no Flask
3. All HTTP goes through `api/` layer
4. Backend services have zero Flask imports
5. Write tests for `services/` first (easiest to test)

---

**Time Investment**: ~2 hours  
**Last Updated**: October 2025  
**Author**: Dhanush Kumar Suresh (Senior Full-Stack Engineer Candidate)