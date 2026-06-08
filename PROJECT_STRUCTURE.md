# Project Structure

This is a full-stack e-commerce landing page with lead generation system.

```
landingpagedesign/
├── frontend/                      # React + Vite frontend
│   ├── src/
│   │   ├── main.tsx               # Entry point
│   │   ├── app/
│   │   │   ├── App.tsx            # Main App component
│   │   │   └── components/
│   │   │       ├── Footer.tsx
│   │   │       ├── Header.tsx
│   │   │       ├── Hero.tsx
│   │   │       ├── LeadForm.tsx    # ⭐ Lead submission form
│   │   │       ├── Services.tsx
│   │   │       ├── figma/
│   │   │       └── ui/             # shadcn/ui components
│   │   ├── services/
│   │   │   ├── api.ts             # ⭐ API client
│   │   │   └── leadsApi.ts        # Lead API service
│   │   ├── styles/
│   │   │   ├── index.css
│   │   │   ├── tailwind.css
│   │   │   ├── theme.css
│   │   │   └── fonts.css
│   │   └── assets/                # Images, SVGs, etc
│   ├── index.html                 # HTML entry
│   ├── vite.config.ts            # Vite configuration
│   ├── tsconfig.json             # TypeScript config
│   ├── postcss.config.mjs         # PostCSS config
│   ├── .env.local                 # Frontend env variables
│   ├── package.json               # Dependencies (move here)
│   └── package-lock.json          # Lock file (move here)
│
├── backend/                       # Express.js + SQLite backend
│   ├── server.ts                  # ⭐ Main server entry
│   ├── database.ts                # ⭐ Database setup & helpers
│   ├── routes/
│   │   └── leads.ts               # ⭐ Lead CRUD endpoints
│   ├── middleware/
│   │   └── validation.ts          # ⭐ Input validation
│   ├── .env                       # Backend env variables
│   ├── .env.example               # Example env file
│   ├── .gitignore
│   ├── package.json               # Backend dependencies
│   ├── tsconfig.json
│   ├── data/
│   │   └── leads.db              # SQLite database (auto-created)
│   └── README.md                  # Backend API docs
│
├── docs/                          # Documentation
│   ├── BACKEND_INTEGRATION.md     # How to use backend API
│   ├── FRONTEND_FIX_SUMMARY.md    # Frontend fixes applied
│   ├── PRODUCTION_SERVER_SETUP.md # Deployment guide
│   ├── INTEGRATION_GUIDE.md       # Integration instructions
│   ├── INTEGRATION_COMPLETE.md    # Completion checklist
│   └── ATTRIBUTIONS.md            # Credits
│
├── scripts/                       # Utility scripts
│   ├── QUICKSTART.bat             # Quick start script
│   └── SETUP_BACKEND.bat          # Backend setup script
│
├── .gitignore                     # Git ignore rules
├── README.md                      # Project overview
└── package.json                   # Root package.json (workspace)
```

## Directory Purposes

| Folder | Purpose |
|--------|---------|
| `frontend/` | React + Vite application, UI components, styling |
| `backend/` | Express.js API server, database, business logic |
| `docs/` | Documentation, guides, setup instructions |
| `scripts/` | Setup and utility batch files |

## Key Files by Feature

### Lead Form Submission
- Frontend: [frontend/src/app/components/LeadForm.tsx](../frontend/src/app/components/LeadForm.tsx)
- Frontend API: [frontend/src/services/api.ts](../frontend/src/services/api.ts)
- Backend: [backend/routes/leads.ts](../backend/routes/leads.ts)
- Validation: [backend/middleware/validation.ts](../backend/middleware/validation.ts)

### Database
- Setup: [backend/database.ts](../backend/database.ts)
- Location: [backend/data/leads.db](../backend/data/leads.db)

### Configuration
- Frontend: [frontend/.env.local](../frontend/.env.local)
- Backend: [backend/.env](../backend/.env)

## Environment Variables

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

## Getting Started

### Setup Backend
```bash
cd backend
npm install
npm run dev
```
Runs on: http://localhost:3001

### Setup Frontend
```bash
cd frontend
npm install
npm run dev
```
Runs on: http://localhost:5173

### Or Use Quick Start Scripts
```bash
# Windows
scripts/SETUP_BACKEND.bat
```

## API Endpoints

All endpoints are documented in [backend/README.md](../backend/README.md)

### Lead Endpoints
- `POST /api/leads` - Create lead
- `GET /api/leads` - Get all leads
- `GET /api/leads/:id` - Get single lead
- `PATCH /api/leads/:id/status` - Update status
- `DELETE /api/leads/:id` - Delete lead

## Build & Deployment

### Frontend
```bash
cd frontend
npm run build
# Output in frontend/dist/
```

### Backend
```bash
cd backend
npm run build
npm start
```

## File Sizes & Organization

- ✅ Frontend code: ~src/ folder
- ✅ Backend code: ~backend/ folder  
- ✅ Documentation: ~docs/ folder
- ✅ Configuration: Root & folder-level .env files
- ✅ Dependencies: Separate package.json per project

## Next Steps

1. ✅ Backend running on 3001
2. ✅ Frontend running on 5173
3. ✅ Form submission working
4. ⚠️ Move frontend files to frontend/ folder (frontend running prevents this)
5. ⚠️ Update import paths in frontend
6. ⚠️ Update root README.md

## Notes

- The `src/` folder is currently locked by the frontend dev server
- After stopping the dev server, frontend files can be moved to `frontend/`
- All import paths will need updating after reorganization
- Backend is already properly organized
