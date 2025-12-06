# MongoDB Connection Fix - Complete Guide

## ⚠️ Problem: "MongoDB is not connected"

**Error Message:**
```
⚠️  Server will continue but MongoDB is not connected
⚠️  Admin login and database features will not work
```

## 🔧 Quick Fix (3 Steps)

### Step 1: Run Fix Script

```bash
node fix-mongodb-now.js
```

**Ye script:**
- ✅ .env file check karega
- ✅ Connection string verify karega
- ✅ Password encoding check karega
- ✅ Connection test karega
- ✅ Detailed error messages dega

### Step 2: Fix Based on Error

**Agar "Authentication Error" aaye:**

**Option A: Change Password (Easiest)**
1. Go to: https://cloud.mongodb.com/
2. Database Access → Your user → Edit
3. Edit Password → Simple password (no special chars)
   - Example: `Wellwichly123`
4. Update User
5. Update `.env` file:
   ```env
   MONGODB_URI=mongodb+srv://amitk73262_db_user:Wellwichly123@cluster0.2wvruvf.mongodb.net/sandwich-website?retryWrites=true&w=majority
   ```

**Option B: URL Encode Password**
1. Go to: https://www.urlencoder.org/
2. Paste your password
3. Copy encoded version
4. Update `.env` file

**Agar "IP Whitelist Error" aaye:**
1. MongoDB Atlas → Network Access
2. Add IP Address → `0.0.0.0/0`
3. Confirm
4. Wait 1-2 minutes

### Step 3: Restart Server

```bash
npm run dev:server
```

**Ye dikhna chahiye:**
```
✅ MongoDB Connected Successfully
📊 Database: sandwich-website
✅ Server running on port 5000
```

## 📝 .env File Format

**Correct Format:**
```env
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/sandwich-website?retryWrites=true&w=majority
JWT_SECRET=your-secret-key-change-in-production
PORT=5000
NEXT_PUBLIC_API_URL=http://localhost:5000
```

**Important:**
- ✅ Password simple ho (no special chars) ya URL encoded ho
- ✅ Database name include ho: `/sandwich-website`
- ✅ Options include ho: `?retryWrites=true&w=majority`

## 🔍 Common Issues & Solutions

### Issue 1: Authentication Failed
**Solution:** Password URL encode karein ya simple password use karein

### Issue 2: IP Not Whitelisted
**Solution:** MongoDB Atlas → Network Access → Add `0.0.0.0/0`

### Issue 3: Wrong Username
**Solution:** MongoDB Atlas → Database Access → Verify username

### Issue 4: Wrong Cluster Name
**Solution:** MongoDB Atlas → Connect → Verify cluster name in connection string

### Issue 5: .env File Missing
**Solution:** Run `node fix-mongodb-now.js` - automatically create karega

## ✅ Verification

**After fixing, you should see:**
```
✅ MongoDB Connected Successfully
📊 Database: sandwich-website
✅ Admin user exists in database
✅ Server running on port 5000
```

**Test:**
1. Place an order → Should save to database
2. Admin login → Should work
3. Check MongoDB Compass → Data should be visible

## 🎯 Quick Checklist

- [ ] `.env` file exists
- [ ] `MONGODB_URI` is set
- [ ] Password is correct (simple or URL encoded)
- [ ] Username is correct
- [ ] Database name is included
- [ ] IP whitelist configured (`0.0.0.0/0`)
- [ ] Connection test successful
- [ ] Server shows "✅ MongoDB Connected Successfully"

## 📖 Additional Resources

- `FIX_MONGODB_AUTH.md` - Detailed authentication fix
- `QUICK_FIX_MONGODB.md` - Quick password fix
- `DATABASE_FIX.md` - Database saving fix
- `fix-mongodb-connection.js` - Connection test script

## 🚀 After Fixing

**Everything will work:**
- ✅ Admin login
- ✅ Order placement
- ✅ Contact forms
- ✅ Menu management
- ✅ Data saving to database

**Ab sab kuch database me save hoga! 🎉**

