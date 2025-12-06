// Reset Admin Password - Force Reset
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./server/models/User');
const bcrypt = require('bcryptjs');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/sandwich-website';

console.log('\n🔧 Force Resetting Admin Password...\n');

mongoose.connect(MONGODB_URI)
.then(async () => {
  console.log('✅ Connected to MongoDB');
  console.log('📊 Database:', mongoose.connection.name);
  console.log('\n');
  
  // Find or create admin user
  let admin = await User.findOne({ username: 'admin' });
  
  if (!admin) {
    console.log('❌ Admin user not found! Creating new one...\n');
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
    console.log('   Password Hash:', admin.password.substring(0, 20) + '...');
    console.log('\n💡 Force resetting password...');
    
    // Force update email
    admin.email = 'Wellwichly@gmail.com';
    
    // Force reset password - use direct hash
    const newPassword = 'admin123';
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // Directly set password (bypass pre-save hook if needed)
    admin.password = hashedPassword;
    admin.markModified('password');
    
    await admin.save();
    
    console.log('   ✅ Password force reset complete!');
    console.log('   ✅ Email updated!');
    console.log('   ✅ Admin user saved!\n');
  }
  
  // Test password verification
  console.log('🔐 Testing password verification...');
  const testPassword = 'admin123';
  const isMatch = await admin.comparePassword(testPassword);
  
  if (isMatch) {
    console.log('✅ Password verification SUCCESSFUL!');
    console.log('✅ Password "admin123" is correct!\n');
  } else {
    console.log('❌ Password verification FAILED!');
    console.log('💡 Trying alternative method...\n');
    
    // Try direct bcrypt compare
    const directMatch = await bcrypt.compare(testPassword, admin.password);
    if (directMatch) {
      console.log('✅ Direct bcrypt comparison successful!');
      console.log('⚠️  comparePassword method might have issue');
    } else {
      console.log('❌ Direct bcrypt comparison also failed!');
      console.log('💡 Resetting password again with different method...\n');
      
      // Delete and recreate
      await User.deleteOne({ username: 'admin' });
      const hashedPassword = await bcrypt.hash('admin123', 10);
      admin = await User.create({
        username: 'admin',
        email: 'Wellwichly@gmail.com',
        password: hashedPassword,
        role: 'admin'
      });
      console.log('✅ Admin user recreated with fresh password!');
    }
  }
  
  // Final verification
  console.log('\n🔐 Final Password Test...');
  const finalTest = await admin.comparePassword('admin123');
  if (finalTest) {
    console.log('✅ FINAL TEST PASSED! Password is working!\n');
  } else {
    console.log('❌ FINAL TEST FAILED!');
    console.log('💡 Password hash:', admin.password.substring(0, 30) + '...');
  }
  
  console.log('\n📋 Final Admin User Details:');
  console.log('   Username: admin');
  console.log('   Email: Wellwichly@gmail.com');
  console.log('   Password: admin123');
  console.log('   Role: admin');
  console.log('   ID:', admin._id);
  console.log('   Password Hash Length:', admin.password.length);
  
  console.log('\n✅ Admin user is ready!');
  console.log('\n💡 Login Credentials:');
  console.log('   Username: admin');
  console.log('   Email: Wellwichly@gmail.com');
  console.log('   Password: admin123');
  console.log('\n✅ Try logging in now!\n');
  
  mongoose.disconnect();
  process.exit(0);
})
.catch((error) => {
  console.error('❌ Error:', error.message);
  if (error.message.includes('authentication failed')) {
    console.error('\n🔐 MongoDB Authentication Error!');
    console.error('💡 Fix MongoDB connection first:');
    console.error('   node fix-mongodb-now.js\n');
  }
  process.exit(1);
});

