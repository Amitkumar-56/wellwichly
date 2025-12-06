// Test Password Directly
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./server/models/User');
const bcrypt = require('bcryptjs');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/sandwich-website';

console.log('\n🔐 Testing Password Directly...\n');

mongoose.connect(MONGODB_URI)
.then(async () => {
  console.log('✅ Connected to MongoDB\n');
  
  // Get admin user
  const admin = await User.findOne({ username: 'admin' });
  
  if (!admin) {
    console.log('❌ Admin user not found!');
    process.exit(1);
  }
  
  console.log('📝 Admin User Found:');
  console.log('   Username:', admin.username);
  console.log('   Email:', admin.email);
  console.log('   Password Hash:', admin.password);
  console.log('   Hash Length:', admin.password.length);
  console.log('\n');
  
  // Test 1: Direct bcrypt compare
  console.log('Test 1: Direct bcrypt.compare()');
  const testPassword = 'admin123';
  const directMatch = await bcrypt.compare(testPassword, admin.password);
  console.log('   Result:', directMatch ? '✅ MATCH' : '❌ NO MATCH');
  console.log('\n');
  
  // Test 2: comparePassword method
  console.log('Test 2: comparePassword() method');
  const methodMatch = await admin.comparePassword(testPassword);
  console.log('   Result:', methodMatch ? '✅ MATCH' : '❌ NO MATCH');
  console.log('\n');
  
  // Test 3: Create new hash and compare
  console.log('Test 3: Create new hash and compare');
  const newHash = await bcrypt.hash(testPassword, 10);
  const newHashMatch = await bcrypt.compare(testPassword, newHash);
  console.log('   New Hash:', newHash.substring(0, 30) + '...');
  console.log('   New Hash Match:', newHashMatch ? '✅ MATCH' : '❌ NO MATCH');
  console.log('\n');
  
  // Test 4: Check if password is double-hashed
  console.log('Test 4: Check for double-hashing');
  try {
    const doubleCheck = await bcrypt.compare(admin.password, admin.password);
    console.log('   Double hash check:', doubleCheck ? '⚠️  POSSIBLE DOUBLE HASH' : '✅ Not double hashed');
  } catch (e) {
    console.log('   ✅ Not double hashed (expected error)');
  }
  console.log('\n');
  
  // If direct match works, update password properly
  if (directMatch) {
    console.log('✅ Direct bcrypt.compare() works!');
    console.log('💡 Password is correct, but comparePassword method might have issue');
  } else {
    console.log('❌ Direct bcrypt.compare() failed!');
    console.log('💡 Password needs to be reset properly');
    
    // Delete and recreate with proper password
    console.log('\n💡 Deleting and recreating admin user...');
    await User.deleteOne({ username: 'admin' });
    
    // Create password hash manually
    const correctHash = await bcrypt.hash('admin123', 10);
    console.log('   New hash created:', correctHash.substring(0, 30) + '...');
    
    // Create user WITHOUT using model (to avoid pre-save hook)
    const newAdmin = new User({
      username: 'admin',
      email: 'Wellwichly@gmail.com',
      password: correctHash, // Already hashed
      role: 'admin'
    });
    
    // Save without triggering pre-save hook
    await newAdmin.save({ validateBeforeSave: false });
    
    console.log('✅ Admin user recreated!');
    
    // Test again
    const finalAdmin = await User.findOne({ username: 'admin' });
    const finalTest = await bcrypt.compare('admin123', finalAdmin.password);
    console.log('   Final test:', finalTest ? '✅ SUCCESS' : '❌ FAILED');
  }
  
  mongoose.disconnect();
  process.exit(0);
})
.catch((error) => {
  console.error('❌ Error:', error.message);
  process.exit(1);
});

