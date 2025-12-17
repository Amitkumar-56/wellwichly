// server/index.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load .env file from root folder only
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// MongoDB Connection
// Use local MongoDB by default (no IP whitelist needed)
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/sandwich-website';

if (!process.env.MONGODB_URI) {
  console.log('ℹ️  Using LOCAL MongoDB: mongodb://localhost:27017/sandwich-website');
  console.log('ℹ️  Make sure MongoDB is installed and running');
  console.log('ℹ️  Download: https://www.mongodb.com/try/download/community');
  console.log('ℹ️  To use MongoDB Atlas, create server/.env file with MONGODB_URI\n');
}

// MongoDB connection options
const mongooseOptions = {
  serverSelectionTimeoutMS: 30000, // Timeout after 30s (gives time for Atlas IP whitelist to propagate)
  socketTimeoutMS: 45000, // Socket timeout
  connectTimeoutMS: 30000, // Connection timeout
};

mongoose.connect(MONGODB_URI, mongooseOptions)
.then(async () => {
  console.log('✅ MongoDB Connected Successfully');
  console.log('📊 Database:', mongoose.connection.name);
  
  // Auto-create admin user if doesn't exist
  try {
    const User = require('./models/User');
    const bcrypt = require('bcryptjs');
    const existingAdmin = await User.findOne({ username: 'admin' });
    
    if (!existingAdmin) {
      console.log('\n💡 Admin user not found. Creating admin user...');
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await User.create({
        username: 'admin',
        email: 'Wellwichly@gmail.com',
        password: hashedPassword,
        role: 'admin'
      });
      console.log('✅ Admin user created automatically!');
      console.log('📝 Username: admin');
      console.log('📧 Email: Wellwichly@gmail.com');
      console.log('🔐 Password: admin123');
      console.log('⚠️  Please change password after first login!\n');
    } else {
      console.log('✅ Admin user exists in database');
    }
  } catch (error) {
    console.error('⚠️  Could not auto-create admin user:', error.message);
  }
})
.catch(err => {
  console.error('❌ MongoDB connection error:', err.message);
  
  // Check if it's local MongoDB connection error
  if (err.message.includes('ECONNREFUSED') || err.message.includes('connect ECONNREFUSED') || 
      err.message.includes('Could not connect') && MONGODB_URI.includes('localhost')) {
    console.error('\n🔧 LOCAL MONGODB NOT INSTALLED OR NOT RUNNING');
    console.error('💡 Quick Fix - Install MongoDB:');
    console.error('   1. Download MongoDB: https://www.mongodb.com/try/download/community');
    console.error('   2. Run installer → Choose "Complete" → Check "Install as Service"');
    console.error('   3. After installation, restart server');
    console.error('\n   OR Start MongoDB if already installed:');
    console.error('      Windows PowerShell: net start MongoDB');
    console.error('\n   OR Use Docker (if installed):');
    console.error('      docker run -d -p 27017:27017 --name mongodb mongo:latest');
    console.error('\n📖 See INSTALL_MONGODB_WINDOWS.md for detailed guide');
  } else if (err.message.includes('authentication failed') || err.message.includes('bad auth')) {
    console.error('\n🔐 AUTHENTICATION ERROR - Password issue detected!');
    console.error('💡 Solutions:');
    console.error('   1. Check if password has special characters (@, #, $, etc.)');
    console.error('   2. URL encode your password (use https://www.urlencoder.org/)');
    console.error('   3. Or use local MongoDB (no password needed)');
  } else if (err.message.includes('IP') || err.message.includes('whitelist')) {
    console.error('\n🌐 MONGODB ATLAS IP WHITELIST ERROR');
    console.error('💡 If you just whitelisted your IP, wait 1-2 minutes for changes to propagate.');
    console.error('💡 Then restart the server: npm run dev:server');
    console.error('\n   Solutions:');
    console.error('   1. Wait 1-2 minutes after whitelisting IP, then restart server');
    console.error('   2. OR Use "Allow Access from Anywhere" (0.0.0.0/0) in MongoDB Atlas');
    console.error('   3. OR Use LOCAL MongoDB (No IP whitelist needed):');
    console.error('      Install MongoDB: https://www.mongodb.com/try/download/community');
    console.error('      Server will use: mongodb://localhost:27017/sandwich-website');
  } else {
    console.error('💡 Please check:');
    console.error('   1. MongoDB is installed and running');
    console.error('   2. Port 27017 is available');
    console.error('   3. For local MongoDB: Install from https://www.mongodb.com/try/download/community');
    console.error('   4. For Atlas: Check IP whitelist and connection string');
  }
  
  // Don't exit on error - let server start but show warning
  console.error('\n⚠️  Server will continue but MongoDB is not connected');
  console.error('⚠️  Admin login and database features will not work');
  console.error('💡 Install local MongoDB to fix this immediately!\n');
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/contacts', require('./routes/contacts'));
app.use('/api/services', require('./routes/services'));
app.use('/api/content', require('./routes/content'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`🔐 Admin login: http://localhost:${PORT}/admin`);
});

