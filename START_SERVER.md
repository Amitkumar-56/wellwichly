# Server Start Karne Ka Tarika

## Prerequisites
1. Pehle `.env` file create karein (MongoDB connection string ke saath)
2. Dependencies install karein: `npm install`
3. Admin user create karein: `node create-admin.js`

## Server Start Karne Ke Do Tarike:

### Method 1: Development Mode (Recommended) - Do Terminals Me

**Terminal 1 - Frontend (Next.js) Start Karein:**
```bash
npm run dev
```
Ye `http://localhost:3000` par frontend start karega.

**Terminal 2 - Backend (Express) Start Karein:**
```bash
npm run dev:server
```
Ye `http://localhost:5000` par backend API start karega.

---

### Method 2: Production Mode

**Pehle build karein:**
```bash
npm run build
```

**Phir dono servers start karein:**

**Terminal 1:**
```bash
npm start
```

**Terminal 2:**
```bash
npm run server
```

---

## Quick Start (Ek Line Me)

Agar aap chahte hain ki ek hi terminal me dono start ho, to:

**Windows PowerShell me:**
```powershell
Start-Process powershell -ArgumentList "npm run dev"
npm run dev:server
```

**Ya manually:**
1. Pehle ek terminal me `npm run dev` run karein
2. Phir nayi terminal khol kar `npm run dev:server` run karein

---

## Check Karein Server Chal Raha Hai:

1. **Frontend:** Browser me jayein `http://localhost:3000`
2. **Backend:** Browser me jayein `http://localhost:5000/api/services` (JSON response aana chahiye)

---

## Common Issues:

### Port Already in Use
Agar port 3000 ya 5000 already use ho raha hai:
- `.env` file me `PORT=5001` (ya koi aur port) set karein
- Ya jo process port use kar raha hai usko close karein

### MongoDB Connection Error
- `.env` file me `MONGODB_URI` sahi hai ya nahi check karein
- MongoDB Atlas me IP whitelist check karein

### Module Not Found
- `npm install` run karein
- `node_modules` folder delete karke phir se `npm install` karein

---

## Server Stop Karne Ke Liye:

Terminal me `Ctrl + C` press karein.

