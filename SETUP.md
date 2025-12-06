# Quick Setup Guide

## Prerequisites
- Node.js (v18 or higher)
- MongoDB (running locally or MongoDB Atlas connection string)

## Step-by-Step Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the root directory:

**For MongoDB Atlas (Cloud):**
```
MONGODB_URI=mongodb+srv://amitk73262_db_user:YOUR_PASSWORD_HERE@cluster0.2wvruvf.mongodb.net/sandwich-website?retryWrites=true&w=majority
JWT_SECRET=your-secret-key-change-in-production-make-it-long-and-random
PORT=5000
NEXT_PUBLIC_API_URL=http://localhost:5000
```

**Important:** 
- Replace `YOUR_PASSWORD_HERE` with your actual MongoDB Atlas password
- If password has special characters, URL encode them (e.g., `@` → `%40`)
- See `ENV_SETUP.md` for detailed instructions

**For Local MongoDB:**
```
MONGODB_URI=mongodb://localhost:27017/sandwich-website
JWT_SECRET=your-secret-key-change-in-production
PORT=5000
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### 3. Create Admin User
Run the admin creation script:
```bash
node create-admin.js
```

Default credentials:
- Username: `admin`
- Password: `admin123`

**⚠️ Important:** Change the password after first login!

### 4. Start the Application

**Option A: Development Mode (Recommended)**
```bash
# Terminal 1 - Frontend (Next.js)
npm run dev

# Terminal 2 - Backend (Express)
npm run dev:server
```

**Option B: Production Mode**
```bash
# Build Next.js
npm run build

# Start both servers
npm start      # Frontend on http://localhost:3000
npm run server # Backend on http://localhost:5000
```

### 5. Access the Website
- **Frontend:** http://localhost:3000
- **Admin Panel:** http://localhost:3000/admin
- **Backend API:** http://localhost:5000

## Testing the Application

1. **Browse Menu:** Go to `/services` page
2. **Add Items:** Click "Add to Cart" on any sandwich
3. **Place Order:** Click "Proceed to Checkout" and fill the form
4. **Admin Login:** Go to `/admin` and login
5. **View Orders:** Check the dashboard to see all orders
6. **Contact Form:** Submit a message via `/contact` page

## Troubleshooting

### MongoDB Connection Error
- Make sure MongoDB is running
- Check your `MONGODB_URI` in `.env` file
- For MongoDB Atlas, use the connection string provided

### Port Already in Use
- Change `PORT` in `.env` file
- Or kill the process using the port

### Admin Login Not Working
- Make sure you ran `node create-admin.js`
- Check MongoDB connection
- Verify username/password

## Next Steps

1. Update business information in Footer and Contact pages
2. Add your Google Maps embed code in Contact page
3. Customize colors in `tailwind.config.js`
4. Add more menu items via Admin panel or directly in MongoDB
5. Configure email notifications (optional)

## Production Deployment

1. Set strong `JWT_SECRET` in production
2. Use MongoDB Atlas or secure MongoDB instance
3. Update `NEXT_PUBLIC_API_URL` to your production API URL
4. Build and deploy Next.js app
5. Deploy Express server separately or as API routes

