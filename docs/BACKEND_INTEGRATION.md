# Backend API Integration Guide

This guide shows how to integrate your landing page with the new backend API.

## Quick Start

### 1. Install Backend Dependencies
```bash
cd backend
npm install
```

### 2. Start Backend Server
```bash
cd backend
npm run dev
```
The API will run on `http://localhost:3001`

### 3. Configure Frontend Environment
Add to your `.env.local` file (frontend root):
```
VITE_API_URL=http://localhost:3001/api
```

## Using the API Service

The `src/services/leadsApi.ts` file provides a client for the backend API:

### Example 1: Create a Lead

```typescript
import { apiService } from '@/services/leadsApi';

// In your component
const handleSubmit = async (formData) => {
  try {
    const lead = await apiService.createLead({
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      platform: formData.platform,
      message: formData.message,
    });
    console.log('Lead created:', lead);
    // Show success message
  } catch (error) {
    console.error('Failed to create lead:', error);
    // Show error message
  }
};
```

### Example 2: Fetch All Leads (Admin Panel)

```typescript
import { apiService } from '@/services/leadsApi';

// In your component
useEffect(() => {
  const fetchLeads = async () => {
    try {
      const leads = await apiService.getAllLeads();
      setLeads(leads);
    } catch (error) {
      console.error('Failed to fetch leads:', error);
    }
  };
  fetchLeads();
}, []);
```

### Example 3: Filter Leads by Platform

```typescript
const shopifyLeads = await apiService.getAllLeads('Shopify');
```

### Example 4: Update Lead Status

```typescript
await apiService.updateLeadStatus(leadId, 'Contacted');
```

### Example 5: Delete Lead

```typescript
await apiService.deleteLead(leadId);
```

## LeadForm Component Integration

Update your `LeadForm.tsx` component:

```typescript
import { apiService } from '@/services/leadsApi';
import { useState } from 'react';

export function LeadForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const formData = new FormData(e.currentTarget);
      const lead = await apiService.createLead({
        name: formData.get('name') as string,
        phone: formData.get('phone') as string,
        email: formData.get('email') as string,
        platform: formData.get('platform') as string,
        message: formData.get('message') as string,
      });

      setSuccess(true);
      e.currentTarget.reset();
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit form');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="error">{error}</div>}
      {success && <div className="success">Lead submitted successfully!</div>}
      
      {/* Your form fields */}
      
      <button type="submit" disabled={loading}>
        {loading ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  );
}
```

## Environment Variables

### Frontend (.env.local)
```
VITE_API_URL=http://localhost:3001/api
```

### Backend (backend/.env)
```
DB_PATH=./data/leads.db
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

## API Validation

The backend validates all inputs. Common validation errors:

| Error | Fix |
|-------|-----|
| "Invalid email format" | Enter a valid email (name@domain.com) |
| "Invalid phone format" | Enter 10+ digit phone with standard formatting |
| "Missing required fields" | Fill all required fields (name, phone, email, platform) |
| "A lead with this email already exists" | Use a unique email address |

## Production Deployment

### Backend Deployment (e.g., Heroku, Railway, Render)

1. **Set environment variables:**
   ```
   PORT=3001
   NODE_ENV=production
   DB_PATH=./data/leads.db
   FRONTEND_URL=https://yourdomain.com
   ```

2. **Build and start:**
   ```bash
   npm run build
   npm start
   ```

3. **Update frontend VITE_API_URL:**
   ```
   VITE_API_URL=https://your-backend-domain/api
   ```

### Database Backup

For production, consider:
- Regular backups of `data/leads.db`
- Migrating to PostgreSQL for better scalability
- Implementing access logs and monitoring

## Troubleshooting

### CORS Errors
**Error:** "Access to XMLHttpRequest blocked by CORS"

**Solution:**
1. Ensure backend is running
2. Check `FRONTEND_URL` in `backend/.env` matches your frontend domain
3. Restart backend server

### Connection Refused
**Error:** "Failed to fetch" or "Connection refused"

**Solution:**
1. Ensure backend server is running: `cd backend && npm run dev`
2. Check PORT 3001 is not in use: `netstat -ano | findstr :3001`
3. Verify `VITE_API_URL` is correct

### Database Errors
**Error:** "Database locked" or SQL errors

**Solution:**
1. Close all backend instances
2. Delete `backend/data/leads.db`
3. Restart backend server

## API Documentation

See [backend/README.md](../backend/README.md) for complete API documentation.
