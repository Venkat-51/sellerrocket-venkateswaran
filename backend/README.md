# Backend API - Lead Management

A backend API for managing leads from your landing page. Built with Express.js and SQLite.

## Features

- ✅ **Create Leads** - Accept and validate form data
- ✅ **List Leads** - Retrieve all leads with optional platform filtering
- ✅ **Get Lead Details** - Fetch a specific lead
- ✅ **Update Status** - Change lead status (New, Contacted, Converted, Rejected)
- ✅ **Delete Leads** - Remove leads from database
- ✅ **Validation** - Email, phone, and data validation on backend
- ✅ **CORS** - Configured for frontend communication
- ✅ **Error Handling** - Proper HTTP status codes and error messages

## Setup

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment

Copy `.env.example` to `.env` and adjust if needed:

```bash
cp .env.example .env
```

Default `.env`:
```
DB_PATH=./data/leads.db
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### 3. Run Development Server

```bash
npm run dev
```

Server will start on `http://localhost:3001`

### 4. Build for Production

```bash
npm run build
npm start
```

## API Endpoints

### POST `/api/leads`
Create a new lead.

**Request:**
```json
{
  "name": "John Doe",
  "phone": "+1 (555) 123-4567",
  "email": "john@example.com",
  "platform": "Shopify",
  "message": "I'm interested in your services"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Lead created successfully",
  "lead": {
    "id": 1,
    "name": "John Doe",
    "phone": "+1 (555) 123-4567",
    "email": "john@example.com",
    "platform": "Shopify",
    "message": "I'm interested in your services",
    "status": "New",
    "created_at": "2024-01-15T10:30:00.000Z"
  }
}
```

### GET `/api/leads`
Get all leads with optional filtering.

**Query Parameters:**
- `platform` (optional) - Filter by platform (e.g., ?platform=Shopify)

**Response (200):**
```json
{
  "success": true,
  "count": 5,
  "leads": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+1 (555) 123-4567",
      "platform": "Shopify",
      "message": "...",
      "status": "New",
      "created_at": "2024-01-15T10:30:00.000Z",
      "updated_at": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

### GET `/api/leads/:id`
Get a specific lead by ID.

**Response (200):**
```json
{
  "success": true,
  "lead": { /* lead object */ }
}
```

### PATCH `/api/leads/:id/status`
Update a lead's status.

**Request:**
```json
{
  "status": "Contacted"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Lead status updated successfully",
  "lead": { /* updated lead object */ }
}
```

### DELETE `/api/leads/:id`
Delete a lead.

**Response (200):**
```json
{
  "success": true,
  "message": "Lead deleted successfully"
}
```

## Database Schema

```sql
CREATE TABLE leads (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  platform TEXT NOT NULL,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'New' 
    CHECK (status IN ('New', 'Contacted', 'Converted', 'Rejected')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## Validation Rules

### Email
- Must be valid email format
- Must be unique in database

### Phone
- Accepts formats: `+1 (555) 123-4567`, `555-123-4567`, `5551234567`
- Minimum 10 digits

### Name
- Required, non-empty string
- Maximum 255 characters

### Platform
- Required, one of: `Shopify`, `WooCommerce`, `BigCommerce`, `Custom`, `Other`

### Message
- Optional
- Maximum 5000 characters

## HTTP Status Codes

- `200` - Success (GET, PATCH, DELETE)
- `201` - Created (POST)
- `400` - Bad Request (validation errors)
- `404` - Not Found
- `500` - Server Error

## Frontend Integration

Update your frontend API calls to point to the backend:

```typescript
const API_BASE = 'http://localhost:3001/api';

// Create lead
const response = await fetch(`${API_BASE}/leads`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(leadData)
});

// Get all leads
const leads = await fetch(`${API_BASE}/leads`);

// Get filtered leads
const shopifyLeads = await fetch(`${API_BASE}/leads?platform=Shopify`);

// Update status
await fetch(`${API_BASE}/leads/1/status`, {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ status: 'Contacted' })
});

// Delete lead
await fetch(`${API_BASE}/leads/1`, { method: 'DELETE' });
```

## Security Notes

- 🔒 All inputs are validated on the backend
- 🔒 Database credentials stored in `.env` (never commit to git)
- 🔒 CORS configured to only accept requests from frontend URL
- 🔒 Email uniqueness prevents duplicate leads
- 🔒 Phone and email validated with regex patterns

## Project Structure

```
backend/
├── server.ts              # Express server setup
├── database.ts            # Database initialization
├── package.json          # Dependencies
├── tsconfig.json         # TypeScript config
├── .env                  # Environment variables (add to .gitignore)
├── .env.example          # Example environment file
├── middleware/
│   └── validation.ts     # Request validation logic
├── routes/
│   └── leads.ts          # Lead API endpoints
└── data/
    └── leads.db          # SQLite database (auto-created)
```

## Troubleshooting

**Database locked error:**
- Ensure only one instance of the server is running
- Delete `data/leads.db` if corrupted and restart

**CORS errors:**
- Check `FRONTEND_URL` matches your frontend domain
- Ensure backend is running on `PORT` 3001

**Port already in use:**
- Change `PORT` in `.env` or kill process using port 3001

## License

This project is part of the Landing Page Design project.
