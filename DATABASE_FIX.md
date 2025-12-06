# Database Data Storage Fix

## Problem: Data Not Saving to Database

**Error:** Data is not being stored in MongoDB database.

## Root Cause

MongoDB connection is not established. Server is running but database is not connected.

## Solution

### Step 1: Fix MongoDB Connection

**Check if MongoDB is connected:**
```bash
npm run dev:server
```

**Look for:**
```
✅ MongoDB Connected Successfully
📊 Database: sandwich-website
```

**If you see:**
```
❌ MongoDB connection error: bad auth : authentication failed
⚠️  Server will continue but MongoDB is not connected
```

**Then fix the connection (see below).**

### Step 2: Fix Authentication Error

**Option A: Change Password in MongoDB Atlas (Easiest)**

1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Click **"Database Access"** → Find your user → Click **"Edit"**
3. Click **"Edit Password"** → Enter new simple password (no special characters)
   - Example: `Wellwichly123`
4. Click **"Update User"**
5. Update `.env` file:
   ```env
   MONGODB_URI=mongodb+srv://amitk73262_db_user:Wellwichly123@cluster0.2wvruvf.mongodb.net/sandwich-website?retryWrites=true&w=majority
   ```

**Option B: URL Encode Password**

1. Go to: https://www.urlencoder.org/
2. Paste your password
3. Copy encoded version
4. Update `.env` file with encoded password

### Step 3: Check IP Whitelist

1. MongoDB Atlas → **"Network Access"**
2. Click **"Add IP Address"**
3. Add: `0.0.0.0/0` (allows all IPs for testing)
4. Click **"Confirm"**

### Step 4: Restart Server

```bash
npm run dev:server
```

**You should see:**
```
✅ MongoDB Connected Successfully
📊 Database: sandwich-website
✅ Server running on port 5000
```

### Step 5: Test Data Saving

1. **Place an order** from website
2. **Check terminal** - you should see:
   ```
   ✅ MongoDB connected - Saving order...
   ✅ Order saved successfully to database!
   📦 Order ID: ...
   ```

3. **Login to admin panel** - you should see the order

## What Data Gets Saved

Once MongoDB is connected, these will be saved:

1. **Orders** - All customer orders
2. **Contacts** - Contact form submissions
3. **Franchise Enquiries** - Franchise form submissions
4. **Services/Menu Items** - Menu items added by admin
5. **Admin Users** - Admin login credentials

## Verify Data is Saving

**Check terminal logs:**
- When order is placed: `✅ Order saved successfully to database!`
- When contact is submitted: `✅ Contact saved successfully to database!`

**Check admin panel:**
- Login to `/admin/dashboard`
- You should see all orders and contacts

## Still Not Working?

1. **Run connection test:**
   ```bash
   node fix-mongodb-connection.js
   ```

2. **Check .env file:**
   - Make sure `MONGODB_URI` is correct
   - Password is URL encoded or simple (no special chars)

3. **Check MongoDB Atlas:**
   - Cluster is running
   - IP whitelist includes `0.0.0.0/0`
   - Database user has proper permissions

4. **Restart everything:**
   - Stop server (Ctrl+C)
   - Start again: `npm run dev:server`
   - Check for "✅ MongoDB Connected Successfully"

## Quick Checklist

- [ ] MongoDB connection successful (check terminal)
- [ ] `.env` file has correct `MONGODB_URI`
- [ ] Password is correct (or URL encoded)
- [ ] IP whitelist includes `0.0.0.0/0`
- [ ] Server restarted after fixing `.env`
- [ ] Terminal shows "✅ MongoDB Connected Successfully"

