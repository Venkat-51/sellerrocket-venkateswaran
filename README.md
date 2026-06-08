
  # Landing Page Design - Full Stack E-commerce Solution

A modern, responsive landing page with integrated lead generation system. Built with React + Vite (frontend) and Express.js + SQLite (backend).

## 🎯 Features

- ✅ **Beautiful Landing Page** - Responsive design with hero, services, testimonials
- ✅ **Lead Generation Form** - Capture customer information
- ✅ **Backend API** - Full REST API with validation
- ✅ **Database** - SQLite for lead storage and management
- ✅ **Form Validation** - Frontend and backend validation
- ✅ **Cross-origin Support** - CORS enabled for frontend-backend communication

## 📁 Project Structure

```
landingpagedesign/
├── frontend/              # React + Vite application
├── backend/               # Express.js API server
├── docs/                  # Documentation & guides
├── scripts/               # Setup scripts
└── README.md             # This file
```

See [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) for detailed folder structure.

## 🚀 Quick Start

### Option 1: Using Setup Scripts (Windows)
```bash
# Setup Backend
scripts/SETUP_BACKEND.bat

# Setup Frontend (in new terminal)
cd frontend
npm install
npm run dev
```

### Option 2: Manual Setup

**Backend:**
```bash
cd backend
npm install
npm run dev
```
Runs on: http://localhost:3001

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```
Runs on: http://localhost:5173

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Windows (for batch scripts) or any OS (for manual commands)

## 🔧 Environment Setup

### Frontend (.env.local)
```
VITE_API_BASE_URL=http://localhost:3001/api
```

### Backend (.env)
```
DB_PATH=./data/leads.db
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

## 📚 Documentation

- **[Backend API](backend/README.md)** - Complete API documentation
- **[Backend Integration Guide](docs/BACKEND_INTEGRATION.md)** - How to use the API
- **[Frontend Fixes Summary](docs/FRONTEND_FIX_SUMMARY.md)** - Frontend setup details
- **[Production Setup](docs/PRODUCTION_SERVER_SETUP.md)** - Deployment guide
- **[Project Structure](PROJECT_STRUCTURE.md)** - Detailed folder organization

## 🎨 Tech Stack

### Frontend
- React 18
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui Components
- Sonner (Toast Notifications)

### Backend
- Express.js
- TypeScript
- SQLite3
- CORS
- Input Validation

## 📝 Lead Form Fields

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| Name | Text | Yes | Max 255 chars |
| Email | Email | Yes | Must be unique |
| Phone | Tel | Yes | International format accepted |
| Platform | Select | Yes | Shopify, WooCommerce, BigCommerce, Custom, Other |
| Message | Text Area | No | Max 5000 chars |

## 🔌 API Endpoints

### Create Lead
```bash
POST /api/leads
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1 (555) 123-4567",
  "platform": "Shopify",
  "message": "Optional message"
}
```

### Get All Leads
```bash
GET /api/leads
GET /api/leads?platform=Shopify
```

### Get Single Lead
```bash
GET /api/leads/:id
```

### Update Lead Status
```bash
PATCH /api/leads/:id/status
{
  "status": "Contacted" | "Converted" | "Rejected"
}
```

### Delete Lead
```bash
DELETE /api/leads/:id
```

## 🗄️ Database Schema

Leads table with fields: id, name, email, phone, platform, message, status, created_at, updated_at.

## ✅ Validation Rules

- **Email:** Valid format, unique in database
- **Phone:** Minimum 10 digits, international formats supported
- **Name:** Required, max 255 characters
- **Platform:** Must be one of: Shopify, WooCommerce, BigCommerce, Custom, Other

## 🔒 Security Features

- ✅ Backend validation (never trust frontend only)
- ✅ Email uniqueness constraint
- ✅ Input sanitization
- ✅ CORS protection
- ✅ Environment variables for sensitive data

## 🛠️ Development

### Frontend Commands
```bash
cd frontend
npm run dev          # Start dev server
npm run build        # Build for production
```

### Backend Commands
```bash
cd backend
npm run dev          # Start dev server (with auto-reload)
npm run build        # Build TypeScript
npm start            # Run production build
```

## 📦 Building for Production

### Frontend Build
```bash
cd frontend
npm run build
# Output: frontend/dist/
```

### Backend Build
```bash
cd backend
npm run build
npm start
```

## 🌐 Deployment

See [docs/PRODUCTION_SERVER_SETUP.md](docs/PRODUCTION_SERVER_SETUP.md) for complete deployment instructions.

## 🐛 Troubleshooting

### "Failed to Fetch" Error
1. Ensure backend is running: `cd backend && npm run dev`
2. Check `.env.local` API URL: `http://localhost:3001/api`
3. Hard refresh browser: `Ctrl+Shift+R`

### Port Already in Use
```bash
netstat -ano | findstr :3001
taskkill /PID <PID> /F
```

## 📞 Support & Documentation

- See [docs/](docs/) folder for detailed guides
- See [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) for file organization
- Backend API docs: [backend/README.md](backend/README.md)

---

**Status:** ✅ Production Ready
  