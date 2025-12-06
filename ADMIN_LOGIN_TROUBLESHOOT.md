# Admin Login Troubleshooting Guide

## Problem: Admin Login Not Working

### Step 1: Check Backend Server

**Terminal me ye command run karein:**
```bash
npm run dev:server
```

**Expected Output:**
```
✅ MongoDB Connected Successfully
📊 Database: sandwich-website
✅ Server running on port 5000
🌐 Health check: http://localhost:5000/api/health
```

**Agar MongoDB error aaye:**
- `.env` file check karein
- `MONGODB_URI` sahi hai ya nahi
- Password URL encoded hai ya nahi

### Step 2: Check Server is Running

**Browser me ye URL open karein:**
```
http://localhost:5000/api/health
```

**Expected Response:**
```json
{
  "status": "ok",
  "message": "Server is running",
  "timestamp": "..."
}
```

**Agar error aaye:**
- Backend server start karein: `npm run dev:server`
- Port 5000 available hai ya nahi check karein

### Step 3: Create Admin User

**Agar admin user nahi hai, to:**
```bash
node create-admin.js
```

**Expected Output:**
```
✅ Admin user created successfully!
Username: admin
Password: admin123
```

### Step 4: Test Login

**Credentials:**
- Username: `admin`
- Password: `admin123`

**Agar "Invalid credentials" aaye:**
- Admin user create karein: `node create-admin.js`
- Username aur password sahi type karein (case sensitive)

### Step 5: Check Browser Console

**F12 press karein → Console tab:**
- Network errors dikhenge
- API call success/failure dikhega
- Error details milenge

### Step 6: Common Issues

**Issue 1: "Cannot connect to server"**
- ✅ Backend server start karein: `npm run dev:server`
- ✅ Port 5000 check karein
- ✅ `.env` me `NEXT_PUBLIC_API_URL` sahi hai ya nahi

**Issue 2: "Invalid credentials"**
- ✅ Admin user create karein: `node create-admin.js`
- ✅ Username: `admin` (exact)
- ✅ Password: `admin123` (exact)

**Issue 3: MongoDB connection error**
- ✅ `.env` file me `MONGODB_URI` sahi hai
- ✅ Password URL encoded hai
- ✅ MongoDB Atlas IP whitelist me `0.0.0.0/0` add kiya

**Issue 4: Server crashes on start**
- ✅ MongoDB connection check karein
- ✅ `.env` file format sahi hai
- ✅ Dependencies install karein: `npm install`

## Quick Fix Checklist

- [ ] Backend server running (`npm run dev:server`)
- [ ] MongoDB connected (check terminal)
- [ ] Admin user created (`node create-admin.js`)
- [ ] Health check working (`http://localhost:5000/api/health`)
- [ ] Browser console me errors check karein
- [ ] Credentials sahi type karein (admin/admin123)

## Still Not Working?

1. **Clear browser cache:**
   - Ctrl+Shift+Delete
   - Clear cache and cookies

2. **Restart both servers:**
   - Stop frontend (Ctrl+C)
   - Stop backend (Ctrl+C)
   - Start backend: `npm run dev:server`
   - Start frontend: `npm run dev`

3. **Check terminal errors:**
   - Backend terminal me errors dikhenge
   - Frontend terminal me errors dikhenge

4. **Verify MongoDB:**
   - MongoDB Atlas me connection test karein
   - Database me users collection check karein

