# Database Collection Fix - Admin User Not Found

## 🔍 Problem:

MongoDB Compass me `company_db.admin` collection dikh rahi hai, lekin:
- Total Documents: 0
- Admin user nahi mil raha

## ✅ Solution:

### Issue 1: Collection Name

**MongoDB me collection name `users` honi chahiye, `admin` nahi!**

- ❌ Wrong: `company_db.admin`
- ✅ Correct: `company_db.users`

### Issue 2: Database Name

**Check karein ki `.env` file me sahi database name hai:**

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/sandwich-website
```

Ya agar `company_db` use kar rahe hain:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/company_db
```

## 🔧 Fix Steps:

### Step 1: Check Database

**Ye command run karein:**
```bash
node check-database.js
```

**Ye dikhayega:**
- Database name
- Collections list
- Admin user status
- Create admin if not exists

### Step 2: Verify Collection Name

**MongoDB Compass me:**
1. `company_db` database me jayein
2. `users` collection check karein (not `admin`)
3. Agar `users` collection nahi hai, to server start karein - automatically ban jayegi

### Step 3: Create Admin User

**Option 1: Auto-create (Recommended)**
```bash
npm run dev:server
```

Server start hote hi automatically admin user create ho jayega.

**Option 2: Manual create**
```bash
node setup-admin.js
```

Ya:
```bash
node check-database.js
```

## 📊 Expected MongoDB Structure:

```
company_db (or sandwich-website)
  └── users (collection)
      └── { _id, username: "admin", password: "hashed", role: "admin" }
```

## 🎯 Quick Fix:

1. **Check .env file:**
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/company_db
   ```

2. **Run check script:**
   ```bash
   node check-database.js
   ```

3. **Start server:**
   ```bash
   npm run dev:server
   ```

4. **Verify in MongoDB Compass:**
   - Database: `company_db`
   - Collection: `users` (not `admin`)
   - Documents: 1 (admin user)

## ⚠️ Important:

- **Collection name:** `users` (not `admin`)
- **Model name:** `User` (Mongoose automatically creates `users` collection)
- **Database name:** Check `.env` file me kya hai

## ✅ After Fix:

MongoDB Compass me ye dikhna chahiye:
```
company_db
  └── users
      └── Document: { username: "admin", role: "admin", ... }
```

**Ab admin user database me save ho jayega! 🎉**

