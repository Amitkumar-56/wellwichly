# Fix Admin Login Error

## Problem
"Error connecting to server. Please try again."

## Solution

### Step 1: Check if Backend Server is Running

Open a **new terminal** and run:
```bash
npm run dev:server
```

You should see:
```
✅ MongoDB Connected Successfully
Server running on port 5000
```

### Step 2: If MongoDB Error

If you see MongoDB connection error:

1. **Check `.env` file exists** in project root
2. **Verify MONGODB_URI** is correct:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/sandwich-website
   ```
3. **Check MongoDB Atlas IP Whitelist** - Add `0.0.0.0/0` (all IPs) for testing

### Step 3: Create Admin User

If admin user doesn't exist, run:
```bash
node create-admin.js
```

This will create:
- Username: `admin`
- Password: `admin123`

### Step 4: Verify Server is Running

1. Open browser: `http://localhost:5000/api/services`
2. You should see JSON response (even if empty array `[]`)
3. If you see error, server is not running

### Step 5: Check Port 5000

Make sure port 5000 is not used by another application:
```bash
# Windows PowerShell
netstat -ano | findstr :5000
```

If port is busy, change PORT in `.env`:
```
PORT=5001
```

And update `NEXT_PUBLIC_API_URL`:
```
NEXT_PUBLIC_API_URL=http://localhost:5001
```

## Quick Checklist

- [ ] Backend server running (`npm run dev:server`)
- [ ] MongoDB connected (check terminal output)
- [ ] Admin user created (`node create-admin.js`)
- [ ] `.env` file has correct `MONGODB_URI`
- [ ] Port 5000 is available
- [ ] Frontend running (`npm run dev`)

## Still Having Issues?

1. **Restart both servers:**
   - Stop frontend (Ctrl+C)
   - Stop backend (Ctrl+C)
   - Start backend: `npm run dev:server`
   - Start frontend: `npm run dev`

2. **Clear browser cache:**
   - Open DevTools (F12)
   - Right-click refresh button
   - Select "Empty Cache and Hard Reload"

3. **Check browser console** for detailed error messages

