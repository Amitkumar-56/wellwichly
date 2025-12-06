# Fix MongoDB Authentication Error

## Error: "bad auth : authentication failed"

This means your MongoDB password is incorrect or not properly URL encoded.

## Solution

### Step 1: Get Your MongoDB Atlas Connection String

1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Click on **"Connect"** button for your cluster
3. Select **"Connect your application"**
4. Copy the connection string (it looks like):
   ```
   mongodb+srv://username:<password>@cluster0.xxxxx.mongodb.net/
   ```

### Step 2: URL Encode Your Password

If your password has special characters, you MUST encode them:

**Special Characters to Encode:**
- `@` → `%40`
- `#` → `%23`
- `$` → `%24`
- `%` → `%25`
- `&` → `%26`
- `+` → `%2B`
- `=` → `%3D`
- `?` → `%3F`
- `/` → `%2F`
- ` ` (space) → `%20`

**Example:**
- Password: `MyP@ss#123`
- Encoded: `MyP%40ss%23123`

### Step 3: Update .env File

Open `.env` file and update `MONGODB_URI`:

**Wrong (will cause auth error):**
```
MONGODB_URI=mongodb+srv://username:MyP@ss#123@cluster0.xxxxx.mongodb.net/sandwich-website
```

**Correct (URL encoded password):**
```
MONGODB_URI=mongodb+srv://username:MyP%40ss%23123@cluster0.xxxxx.mongodb.net/sandwich-website?retryWrites=true&w=majority
```

### Step 4: Quick Password Encoding

**Option A: Use Online Tool**
- Go to: https://www.urlencoder.org/
- Paste your password
- Copy encoded version
- Replace `<password>` in connection string

**Option B: Use PowerShell (Windows)**
```powershell
[System.Web.HttpUtility]::UrlEncode("YourPasswordHere")
```

**Option C: Change Password in MongoDB Atlas**
1. Go to MongoDB Atlas → Database Access
2. Click on your user
3. Click "Edit" → Change password
4. Use a simple password without special characters (e.g., `MyPassword123`)
5. Update connection string with new password

### Step 5: Verify Connection String Format

Your `.env` file should look like:
```
MONGODB_URI=mongodb+srv://amitk73262_db_user:YOUR_ENCODED_PASSWORD@cluster0.2wvruvf.mongodb.net/sandwich-website?retryWrites=true&w=majority
JWT_SECRET=your-secret-key-change-in-production-make-it-long-and-random
PORT=5000
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### Step 6: Check MongoDB Atlas Settings

1. **Database Access:**
   - Go to MongoDB Atlas → Database Access
   - Make sure your user exists
   - User should have "Atlas admin" or "Read and write" permissions

2. **Network Access (IP Whitelist):**
   - Go to MongoDB Atlas → Network Access
   - Click "Add IP Address"
   - For testing: Add `0.0.0.0/0` (allows all IPs)
   - Or add your current IP address

### Step 7: Test Connection

After updating `.env`, restart server:
```bash
npm run dev:server
```

You should see:
```
✅ MongoDB Connected Successfully
📊 Database: sandwich-website
✅ Server running on port 5000
```

## Common Mistakes

1. ❌ **Not encoding special characters** in password
2. ❌ **Using wrong username** (check Database Access in Atlas)
3. ❌ **Missing database name** in connection string
4. ❌ **IP not whitelisted** in Network Access
5. ❌ **Wrong cluster name** in connection string

## Still Having Issues?

1. **Reset MongoDB Password:**
   - MongoDB Atlas → Database Access
   - Edit user → Reset password
   - Use simple password (no special chars)
   - Update `.env` file

2. **Create New Database User:**
   - MongoDB Atlas → Database Access
   - Add New Database User
   - Username: `wellwichly_admin`
   - Password: `Wellwichly123` (simple, no special chars)
   - Role: `Atlas admin`
   - Update connection string

3. **Check Connection String:**
   - Make sure it starts with `mongodb+srv://`
   - Make sure database name is included: `/sandwich-website`
   - Make sure options are included: `?retryWrites=true&w=majority`

