# Quick Fix: MongoDB Authentication Error

## Problem
```
❌ MongoDB connection error: bad auth : authentication failed
```

## Solution (Choose One)

### Option 1: URL Encode Your Password (Recommended)

**Step 1:** Run this command with your password:
```bash
node encode-password.js "YourPasswordHere"
```

**Step 2:** Copy the encoded password

**Step 3:** Update `.env` file:
```env
MONGODB_URI=mongodb+srv://amitk73262_db_user:ENCODED_PASSWORD_HERE@cluster0.2wvruvf.mongodb.net/sandwich-website?retryWrites=true&w=majority
```

### Option 2: Change Password in MongoDB Atlas (Easier)

**Step 1:** Go to [MongoDB Atlas](https://cloud.mongodb.com/)

**Step 2:** Click **"Database Access"** → Find your user → Click **"Edit"**

**Step 3:** Click **"Edit Password"** → Enter new simple password (no special characters)
- Example: `Wellwichly123` or `MyPassword2024`

**Step 4:** Click **"Update User"**

**Step 5:** Update `.env` file with new password:
```env
MONGODB_URI=mongodb+srv://amitk73262_db_user:Wellwichly123@cluster0.2wvruvf.mongodb.net/sandwich-website?retryWrites=true&w=majority
```

### Option 3: Manual URL Encoding

If your password is `MyP@ss#123`, encode it:

1. Go to: https://www.urlencoder.org/
2. Paste your password: `MyP@ss#123`
3. Click "Encode"
4. Copy result: `MyP%40ss%23123`
5. Use in connection string

**Special Characters:**
- `@` → `%40`
- `#` → `%23`
- `$` → `%24`
- `%` → `%25`
- `&` → `%26`
- `+` → `%2B`
- `=` → `%3D`
- `?` → `%3F`
- `/` → `%2F`
- Space → `%20`

## After Fixing

1. Save `.env` file
2. Restart server: `npm run dev:server`
3. You should see: `✅ MongoDB Connected Successfully`

## Still Not Working?

1. **Check IP Whitelist:**
   - MongoDB Atlas → Network Access
   - Add IP: `0.0.0.0/0` (allows all IPs for testing)

2. **Verify Username:**
   - MongoDB Atlas → Database Access
   - Check username is: `amitk73262_db_user`

3. **Check Database Name:**
   - Connection string should end with: `/sandwich-website`

