# Environment Variables Setup

## MongoDB Atlas Connection

Aapko `.env` file create karni hogi project root me. Isme MongoDB Atlas connection string add karein.

### Steps:

1. **Create `.env` file** in project root directory (same level as `package.json`)

2. **Add these variables:**

```env
MONGODB_URI=mongodb+srv://amitk73262_db_user:YOUR_PASSWORD_HERE@cluster0.2wvruvf.mongodb.net/sandwich-website?retryWrites=true&w=majority
JWT_SECRET=your-secret-key-change-in-production-make-it-long-and-random-12345
PORT=5000
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### Important Notes:

1. **Replace `YOUR_PASSWORD_HERE`** with your actual MongoDB Atlas password
   - Agar password me special characters hain (like `@`, `#`, `%`), to unhe URL encode karna hoga
   - Example: `@` becomes `%40`, `#` becomes `%23`

2. **Database Name:** Main ne `sandwich-website` add kiya hai connection string me. Agar aap different name chahte hain, to change kar sakte hain.

3. **JWT_SECRET:** Production me strong random string use karein (minimum 32 characters)

### Example with Password:

Agar aapka password `MyPass@123` hai, to connection string hoga:
```env
MONGODB_URI=mongodb+srv://amitk73262_db_user:MyPass%40123@cluster0.2wvruvf.mongodb.net/sandwich-website?retryWrites=true&w=majority
```

### URL Encoding Reference:
- `@` → `%40`
- `#` → `%23`
- `%` → `%25`
- `&` → `%26`
- `+` → `%2B`
- `=` → `%3D`
- `?` → `%3F`
- `/` → `%2F`
- ` ` (space) → `%20`

### Testing Connection:

Jab aap server start karein (`npm run dev:server`), to console me "MongoDB Connected" message dikhna chahiye.

Agar error aaye, to check karein:
- Password sahi hai ya nahi
- Special characters properly encoded hain ya nahi
- MongoDB Atlas me IP whitelist me `0.0.0.0/0` add kiya hai (development ke liye)

