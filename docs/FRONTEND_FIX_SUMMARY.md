# Frontend "Failed to Fetch" Error - FIXED

## Issues Fixed

### 1. ✅ Incorrect API URL
**Problem:** Frontend was pointing to `http://localhost:8000/api` but backend runs on `http://localhost:3001`

**Fixed in:**
- `.env.local` - Changed `VITE_API_BASE_URL` to `http://localhost:3001/api`
- `src/services/api.ts` - Updated default API URL to `http://localhost:3001/api`

### 2. ✅ Phone Validation Mismatch
**Problem:** Frontend only accepted exactly 10 digits, but backend accepts international formats

**Fixed in:**
- `src/app/components/LeadForm.tsx`
- Now accepts: `+1 (555) 123-4567`, `555-123-4567`, `5551234567`, etc.
- Minimum 10 digits with optional formatting characters

### 3. ✅ Message Field Handling
**Problem:** Frontend required message field, but backend has it as optional

**Fixed in:**
- `src/app/components/LeadForm.tsx` - Made message optional
- Removed asterisk and made it "(Optional)"
- Validation no longer enforces it

### 4. ✅ API Response Parsing
**Problem:** Backend returns `{ success: true, message: "...", lead: {...} }` but frontend expected different structure

**Fixed in:**
- `src/services/api.ts`
- Updated `createLead()` to properly extract lead from response
- Better error handling with fallback message parsing
- Made `message` field optional in interfaces

## How to Test

### 1. Ensure Backend is Running
```bash
cd backend
npm run dev
```
Expected output:
```
✓ Database initialized
✓ Server running on http://localhost:3001
✓ CORS enabled for http://localhost:5173
```

### 2. Start Frontend (if not running)
```bash
npm run dev
```

### 3. Fill Out the Form
- **Name:** Any text
- **Phone:** Try `+1 (555) 123-4567` or `5551234567`
- **Email:** Your email
- **Platform:** Select one (Shopify, WooCommerce, BigCommerce, Custom, Other)
- **Message:** Optional - leave blank or add text

### 4. Submit
Click "Submit" button - you should see:
- ✅ "Thank you! We'll get back to you soon." message
- Form fields clear
- No console errors

### 5. Check Database
Data is saved in `backend/data/leads.db`

## Environment Variables

### Frontend (.env.local)
```
VITE_API_BASE_URL=http://localhost:3001/api
```

### Backend (backend/.env)
```
DB_PATH=./data/leads.db
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

## API Endpoints Working

- ✅ `POST /api/leads` - Create lead
- ✅ `GET /api/leads` - Get all leads
- ✅ `GET /api/leads/:id` - Get single lead
- ✅ `PATCH /api/leads/:id/status` - Update status
- ✅ `DELETE /api/leads/:id` - Delete lead

## Browser Console

When submitting, you should see in DevTools:
- Network tab shows `POST /api/leads` with 201 status
- No CORS errors
- No 404 errors

## Common Issues & Solutions

### Still Getting "Failed to Fetch"?

1. **Backend not running?**
   ```bash
   cd backend && npm run dev
   ```

2. **Port 3001 already in use?**
   ```bash
   # Find and kill process on port 3001
   netstat -ano | findstr :3001
   taskkill /PID <PID> /F
   ```

3. **Frontend not reloaded?**
   - Hard refresh browser: `Ctrl + Shift + R` or `Cmd + Shift + R`
   - Clear browser cache for localhost

4. **Check network in DevTools**
   - Open Developer Tools (F12)
   - Go to Network tab
   - Submit form
   - Look at the request URL - should be `http://localhost:3001/api/leads`
   - Look at response - should show the created lead

## Files Modified

1. `.env.local` - API URL updated
2. `src/services/api.ts` - Response parsing fixed, optional message
3. `src/app/components/LeadForm.tsx` - Phone validation, optional message

## Next Steps

- ✅ Frontend now properly submits to backend
- ✅ Data is saved to SQLite database
- ✅ All validation working on both frontend and backend

To view submitted leads, use:
```bash
cd backend
npm run dev
# In another terminal:
curl http://localhost:3001/api/leads
```
