// Check Database and Admin User
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./server/models/User');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/sandwich-website';

console.log('\n🔍 Checking Database and Admin User...\n');
console.log('📝 Connection String:', MONGODB_URI.replace(/\/\/.*:.*@/, '//***:***@')); // Hide password

mongoose.connect(MONGODB_URI)
.then(async () => {
  console.log('✅ Connected to MongoDB');
  console.log('📊 Database Name:', mongoose.connection.name);
  console.log('📁 Collections:', (await mongoose.connection.db.listCollections().toArray()).map(c => c.name).join(', ') || 'None');
  console.log('\n');
  
  // Check admin user
  const admin = await User.findOne({ username: 'admin' });
  
  if (admin) {
    console.log('✅ Admin user found in database!');
    console.log('📝 Username: admin');
    console.log('🆔 User ID:', admin._id);
    console.log('📅 Created:', admin.createdAt);
    console.log('🔐 Password: (hashed)');
    console.log('\n💡 To login:');
    console.log('   Username: admin');
    console.log('   Password: admin123');
  } else {
    console.log('❌ Admin user NOT found in database!');
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
  
  // Show all users
  const allUsers = await User.find({});
  console.log('\n📋 All Users in Database:');
  if (allUsers.length === 0) {
    console.log('   No users found');
  } else {
    allUsers.forEach(user => {
      console.log(`   - ${user.username} (${user.role}) - Created: ${user.createdAt}`);
    });
  }
  
  console.log('\n✅ Check complete!\n');
  process.exit(0);
})
.catch((error) => {
  console.error('❌ Error:', error.message);
  
  if (error.message.includes('authentication failed') || error.message.includes('bad auth')) {
    console.error('\n🔐 MongoDB Authentication Error!');
    console.error('💡 Fix your MongoDB connection:');
    console.error('   1. Check .env file - MONGODB_URI');
    console.error('   2. URL encode password if it has special characters');
    console.error('   3. Or change password in MongoDB Atlas to simple one');
  } else if (error.message.includes('ENOTFOUND')) {
    console.error('\n🌐 Network Error!');
    console.error('💡 Check:');
    console.error('   1. Internet connection');
    console.error('   2. MongoDB Atlas cluster is running');
    console.error('   3. Connection string is correct');
  }
  
  process.exit(1);
});

