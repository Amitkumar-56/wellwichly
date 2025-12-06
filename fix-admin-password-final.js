// Final Fix for Admin Password - Bypass Pre-save Hook
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./server/models/User');
const bcrypt = require('bcryptjs');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/sandwich-website';

console.log('\n🔧 Final Fix: Admin Password (Bypassing Pre-save Hook)...\n');

mongoose.connect(MONGODB_URI)
.then(async () => {
  console.log('✅ Connected to MongoDB');
  console.log('📊 Database:', mongoose.connection.name);
  console.log('\n');
  
  // Delete existing admin user
  console.log('🗑️  Deleting existing admin user...');
  await User.deleteOne({ username: 'admin' });
  console.log('✅ Deleted\n');
  
  // Create password hash
  console.log('🔐 Creating password hash...');
  const password = 'admin123';
  const hashedPassword = await bcrypt.hash(password, 10);
  console.log('✅ Hash created:', hashedPassword.substring(0, 30) + '...\n');
  
  // Create admin user using updateOne to bypass pre-save hook
  console.log('💡 Creating admin user (bypassing pre-save hook)...');
  
  // Use updateOne with upsert to avoid pre-save hook
  await User.updateOne(
    { username: 'admin' },
    {
      $set: {
        username: 'admin',
        email: 'Wellwichly@gmail.com',
        password: hashedPassword, // Already hashed, won't trigger pre-save
        role: 'admin'
      }
    },
    { upsert: true, setDefaultsOnInsert: true }
  );
  
  console.log('✅ Admin user created/updated!\n');
  
  // Verify
  const admin = await User.findOne({ username: 'admin' });
  console.log('📝 Admin User Details:');
  console.log('   Username:', admin.username);
  console.log('   Email:', admin.email);
  console.log('   Password Hash:', admin.password.substring(0, 30) + '...');
  console.log('   Hash Length:', admin.password.length);
  console.log('\n');
  
  // Test password
  console.log('🔐 Testing password "admin123"...');
  const test1 = await bcrypt.compare('admin123', admin.password);
  console.log('   Direct bcrypt.compare():', test1 ? '✅ MATCH' : '❌ NO MATCH');
  
  const test2 = await admin.comparePassword('admin123');
  console.log('   comparePassword() method:', test2 ? '✅ MATCH' : '❌ NO MATCH');
  console.log('\n');
  
  if (test1 && test2) {
    console.log('✅✅✅ SUCCESS! Password is working correctly!');
    console.log('\n💡 Login Credentials:');
    console.log('   Username: admin');
    console.log('   Email: Wellwichly@gmail.com');
    console.log('   Password: admin123');
    console.log('\n✅ You can now login successfully!\n');
  } else {
    console.log('❌ Still having issues. Trying alternative method...\n');
    
    // Alternative: Use mongoose direct collection access
    await mongoose.connection.collection('users').deleteOne({ username: 'admin' });
    
    await mongoose.connection.collection('users').insertOne({
      username: 'admin',
      email: 'Wellwichly@gmail.com',
      password: hashedPassword,
      role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    console.log('✅ Admin user created via direct collection access');
    
    // Test again
    const admin2 = await User.findOne({ username: 'admin' });
    const finalTest = await bcrypt.compare('admin123', admin2.password);
    console.log('   Final test:', finalTest ? '✅ SUCCESS' : '❌ FAILED');
    
    if (finalTest) {
      console.log('\n✅✅✅ SUCCESS! Password is working!\n');
    }
  }
  
  mongoose.disconnect();
  process.exit(0);
})
.catch((error) => {
  console.error('❌ Error:', error.message);
  console.error(error.stack);
  process.exit(1);
});

