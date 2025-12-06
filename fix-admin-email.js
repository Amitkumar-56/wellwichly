// Fix Admin User Email and Password
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./server/models/User');
const bcrypt = require('bcryptjs');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/sandwich-website';

console.log('\n🔧 Fixing Admin User Email and Password...\n');

mongoose.connect(MONGODB_URI)
.then(async () => {
  console.log('✅ Connected to MongoDB');
  console.log('📊 Database:', mongoose.connection.name);
  console.log('\n');
  
  // Find admin user
  let admin = await User.findOne({ username: 'admin' });
  
  if (!admin) {
    console.log('❌ Admin user not found!');
    console.log('💡 Creating admin user...\n');
    
    const hashedPassword = await bcrypt.hash('admin123', 10);
    admin = await User.create({
      username: 'admin',
      email: 'Wellwichly@gmail.com',
      password: hashedPassword,
      role: 'admin'
    });
    
    console.log('✅ Admin user created!');
  } else {
    console.log('✅ Admin user found');
    console.log('📝 Current details:');
    console.log('   Username:', admin.username);
    console.log('   Email:', admin.email || 'NOT SET');
    console.log('\n💡 Updating admin user...');
    
    // Update email if not set or different
    if (!admin.email || admin.email !== 'Wellwichly@gmail.com') {
      admin.email = 'Wellwichly@gmail.com';
      console.log('   ✅ Email updated to: Wellwichly@gmail.com');
    }
    
    // Reset password to ensure it's correct
    const hashedPassword = await bcrypt.hash('admin123', 10);
    admin.password = hashedPassword;
    console.log('   ✅ Password reset to: admin123');
    
    await admin.save();
    console.log('   ✅ Admin user updated!\n');
  }
  
  // Verify password
  console.log('🔐 Verifying password...');
  const isMatch = await admin.comparePassword('admin123');
  if (isMatch) {
    console.log('✅ Password verification successful!');
  } else {
    console.log('❌ Password verification failed!');
    console.log('💡 Resetting password...');
    const hashedPassword = await bcrypt.hash('admin123', 10);
    admin.password = hashedPassword;
    await admin.save();
    console.log('✅ Password reset complete!');
  }
  
  console.log('\n📋 Final Admin User Details:');
  console.log('   Username: admin');
  console.log('   Email: Wellwichly@gmail.com');
  console.log('   Password: admin123');
  console.log('   Role: admin');
  console.log('   ID:', admin._id);
  
  console.log('\n✅ Admin user is ready!');
  console.log('\n💡 Login Credentials:');
  console.log('   Username: admin');
  console.log('   Email: Wellwichly@gmail.com');
  console.log('   Password: admin123');
  console.log('\n✅ You can now login with email or username!\n');
  
  mongoose.disconnect();
  process.exit(0);
})
.catch((error) => {
  console.error('❌ Error:', error.message);
  if (error.message.includes('authentication failed')) {
    console.error('\n🔐 MongoDB Authentication Error!');
    console.error('💡 Fix MongoDB connection first:');
    console.error('   1. Check .env file - MONGODB_URI');
    console.error('   2. URL encode password if needed');
    console.error('   3. Run: node fix-mongodb-now.js\n');
  }
  process.exit(1);
});

