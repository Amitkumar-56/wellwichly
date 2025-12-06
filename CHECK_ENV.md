# MongoDB Connection Fix

## Problem
Aapko error aa raha hai: `MongoDB connection error: connect ECONNREFUSED`

Ye isliye aa raha hai kyunki `.env` file me MongoDB Atlas connection string nahi hai.

## Solution

### Step 1: `.env` File Create Karein

Project root directory me (jahan `package.json` hai) `.env` file create karein.

### Step 2: `.env` File Me Ye Add Karein

```env
MONGODB_URI=mongodb+srv://amitk73262_db_user:YOUR_PASSWORD_HERE@cluster0.2wvruvf.mongodb.net/sandwich-website?retryWrites=true&w=majority
JWT_SECRET=your-secret-key-change-in-production-make-it-long-and-random-12345
PORT=5000
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### Step 3: Password Replace Karein

`YOUR_PASSWORD_HERE` ko apne actual MongoDB Atlas password se replace karein.

**Important:** Agar password me special characters hain, to unhe URL encode karein:
- `@` → `%40`
- `#` → `%23`
- `%` → `%25`
- `&` → `%26`
- `+` → `%2B`
- `=` → `%3D`
- `?` → `%3F`
- `/` → `%2F`
- Space → `%20`

**Example:**
Agar password `MyPass@123` hai, to connection string me `MyPass%40123` likhein.

### Step 4: MongoDB Atlas IP Whitelist

1. MongoDB Atlas dashboard me jayein
2. **Network Access** section me jayein
3. **Add IP Address** button click karein
4. Development ke liye `0.0.0.0/0` add karein (sab IPs allow)
   - Ya apna specific IP add karein

### Step 5: Server Restart Karein

```bash
# Server stop karein (Ctrl+C)
# Phir dobara start karein
npm run dev:server
```

## Check Karein Connection

Agar sab sahi hai, to console me dikhega:
```
✅ MongoDB Connected Successfully
📊 Database: sandwich-website
```

## Example `.env` File

```env
# MongoDB Atlas Connection
MONGODB_URI=mongodb+srv://amitk73262_db_user:MyPassword123@cluster0.2wvruvf.mongodb.net/sandwich-website?retryWrites=true&w=majority

# JWT Secret (Production me strong random string use karein)
JWT_SECRET=my-super-secret-jwt-key-change-in-production-12345

# Server Port
PORT=5000

# Frontend API URL
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## Troubleshooting

### Error: "MONGODB_URI not found"
- `.env` file project root me hai ya nahi check karein
- File name exactly `.env` hona chahiye (`.env.txt` nahi)

### Error: "Authentication failed"
- Password sahi hai ya nahi check karein
- Special characters properly encoded hain ya nahi

### Error: "IP not whitelisted"
- MongoDB Atlas me Network Access check karein
- `0.0.0.0/0` add karein (development ke liye)

### Error: "Connection timeout"
- Internet connection check karein
- MongoDB Atlas cluster running hai ya nahi check karein

