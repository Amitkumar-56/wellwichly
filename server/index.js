const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

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
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/sandwich-website';

if (!process.env.MONGODB_URI) {
  console.warn('⚠️  WARNING: MONGODB_URI not found in .env file');
  console.warn('⚠️  Using default local MongoDB connection');
  console.warn('⚠️  Please create .env file with your MongoDB Atlas connection string');
}

mongoose.connect(MONGODB_URI)
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
  
  if (err.message.includes('authentication failed') || err.message.includes('bad auth')) {
    console.error('\n🔐 AUTHENTICATION ERROR - Password issue detected!');
    console.error('💡 Solutions:');
    console.error('   1. Check if password has special characters (@, #, $, etc.)');
    console.error('   2. URL encode your password (use https://www.urlencoder.org/)');
    console.error('      Example: @ → %40, # → %23, $ → %24');
    console.error('   3. Or change password in MongoDB Atlas to simple one (no special chars)');
    console.error('   4. Verify username is correct in MONGODB_URI');
    console.error('\n📝 Current MONGODB_URI format should be:');
    console.error('   mongodb+srv://username:ENCODED_PASSWORD@cluster.mongodb.net/database');
    console.error('\n📖 See FIX_MONGODB_AUTH.md for detailed instructions');
  } else {
    console.error('💡 Please check:');
    console.error('   1. .env file exists in project root');
    console.error('   2. MONGODB_URI is set in .env file');
    console.error('   3. MongoDB Atlas IP whitelist includes your IP (or use 0.0.0.0/0)');
    console.error('   4. MongoDB password is correct and URL encoded');
  }
  
  // Don't exit on error - let server start but show warning
  console.error('\n⚠️  Server will continue but MongoDB is not connected');
  console.error('⚠️  Admin login and database features will not work\n');
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.json({ 
    status: 'ok', 
    message: 'Server is running',
    database: dbStatus,
    timestamp: new Date().toISOString()
  });
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
  console.log(`🌐 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔐 Admin login: http://localhost:5000/admin`);
});

