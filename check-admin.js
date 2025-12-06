// Check if admin user exists in database
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./server/models/User');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/sandwich-website';

mongoose.connect(MONGODB_URI)
.then(async () => {
  console.log('✅ Connected to MongoDB');
  
  const admin = await User.findOne({ username: 'admin' });
  
  if (admin) {
    console.log('\n✅ Admin user exists in database!');
    console.log('📝 Username: admin');
    console.log('🔐 Password: admin123 (default)');
    console.log('🆔 User ID:', admin._id);
    console.log('\n💡 If login is not working, check:');
    console.log('   1. Backend server is running (npm run dev:server)');
    console.log('   2. MongoDB is connected');
    console.log('   3. Credentials are correct (admin/admin123)');
  } else {
    console.log('\n❌ Admin user NOT found in database!');
    console.log('\n💡 Creating admin user...');
    
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const newAdmin = await User.create({
      username: 'admin',
      email: 'Wellwichly@gmail.com',
      password: hashedPassword,
      role: 'admin'
    });
    
    console.log('✅ Admin user created successfully!');
    console.log('📝 Username: admin');
    console.log('📧 Email: Wellwichly@gmail.com');
    console.log('🔐 Password: admin123');
    console.log('🆔 User ID:', newAdmin._id);
  }
  
  process.exit(0);
})
.catch((error) => {
  console.error('❌ Error:', error.message);
  if (error.message.includes('authentication failed')) {
    console.error('\n🔐 MongoDB Authentication Error!');
    console.error('💡 Fix your MongoDB connection first:');
    console.error('   1. Check .env file - MONGODB_URI');
    console.error('   2. URL encode password if it has special characters');
    console.error('   3. Or change password in MongoDB Atlas to simple one');
  }
  process.exit(1);
});

