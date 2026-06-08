# Frontend and Backend Integration Guide

## Overview
This project is now fully integrated with the frontend communicating with the Django REST backend.

## Architecture

### Frontend (React/TypeScript)
- Located in `src/` directory
- Uses Vite as build tool
- Components communicate with backend via REST API
- API calls are centralized in `src/services/api.ts`

### Backend (Django/DRF)
- Located in `Backend/` directory
- Uses Django REST Framework
- SQLite database (local development)
- CORS enabled for frontend requests

## Setup Instructions

### Backend Setup

1. Navigate to Backend folder:
   ```bash
   cd Backend
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Run migrations (if not already done):
   ```bash
   python manage.py migrate
   ```

4. Start the backend server:
   ```bash
   python manage.py runserver
   ```
   The backend will run on: `http://localhost:8000`

### Frontend Setup

1. Navigate to project root:
   ```bash
   cd ..
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Update the API URL if needed (Optional):
   - Edit `.env.local` if your backend is running on a different URL
   - Default: `VITE_API_BASE_URL=http://localhost:8000/api`

4. Start the development server:
   ```bash
   npm run dev
   ```
   The frontend will run on: `http://localhost:5173` (or another port shown in terminal)

## API Integration

### Available Endpoints

**Create Lead** (Form Submission)
- Method: `POST`
- URL: `/api/leads`
- Request body:
  ```json
  {
    "name": "string",
    "phone": "string (10 digits)",
    "email": "string",
    "platform": "string",
    "message": "string"
  }
  ```
- Response: `201 Created` with created lead data

**Get All Leads**
- Method: `GET`
- URL: `/api/leads/`
- Query params: `platform` (optional filter)
- Response: Array of leads

**Update Lead Status**
- Method: `PATCH`
- URL: `/api/leads/{id}/status`
- Request body:
  ```json
  {
    "status": "New|Contacted|Converted|Rejected"
  }
  ```

**Delete Lead**
- Method: `DELETE`
- URL: `/api/leads/{id}`
- Response: `204 No Content`

## Frontend Components

### LeadForm Component
- Located in `src/app/components/LeadForm.tsx`
- Validates form inputs client-side
- Calls `createLead()` API function on submit
- Shows loading state while submitting
- Displays success/error notifications using toast

### API Service
- Located in `src/services/api.ts`
- Exports functions: `createLead()`, `getLeads()`, `updateLeadStatus()`, `deleteLead()`
- Handles API errors and converts them to readable messages
- Uses environment variable for API base URL

## Database Models

### Lead Model
```python
{
  "id": "integer (auto-generated)",
  "name": "string (max 100)",
  "phone": "string (max 15)",
  "email": "email",
  "platform": "string (max 50)",
  "message": "text",
  "status": "string (New|Contacted|Converted|Rejected)",
  "created_at": "datetime (auto-generated)"
}
```

## CORS Configuration

- **Backend**: CORS is enabled for all origins (`CORS_ALLOW_ALL_ORIGINS = True`)
- This allows the frontend on `localhost:5173` to communicate with backend on `localhost:8000`
- For production, update this in `Backend/config/settings.py`

## Development Notes

1. **Hot Reload**: Both frontend and backend support auto-reload
2. **Database**: Uses SQLite for local development
3. **Admin Panel**: Access at `http://localhost:8000/admin` (create superuser with: `python manage.py createsuperuser`)
4. **API Documentation**: Available at `http://localhost:8000/api/`

## Troubleshooting

### CORS Error
If you see CORS errors, ensure:
- Backend is running on `http://localhost:8000`
- Frontend `.env.local` has correct `VITE_API_BASE_URL`
- Both services are running

### API Call Fails
- Check browser console for error details
- Verify backend is running: `http://localhost:8000/admin`
- Check if backend returned meaningful error message

### Form Not Submitting
- Check console for validation errors
- Verify phone is exactly 10 digits
- Verify email format is valid

## Next Steps

1. Test the form submission end-to-end
2. View submitted leads in Django admin: `http://localhost:8000/admin`
3. Customize platforms in LeadForm.tsx (currently: Amazon, Flipkart, Shopify, WordPress)
4. Add more features as needed (admin dashboard, lead management, etc.)
