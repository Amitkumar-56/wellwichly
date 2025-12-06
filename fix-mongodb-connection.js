// Quick MongoDB Connection Fix Script
// This script helps you test and fix MongoDB connection

require('dotenv').config();
const mongoose = require('mongoose');

console.log('\n🔧 MongoDB Connection Fix Tool\n');
console.log('Checking your configuration...\n');

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.log('❌ MONGODB_URI not found in .env file');
  console.log('\n💡 Solution:');
  console.log('1. Create .env file in project root');
  console.log('2. Add: MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database');
  console.log('3. Make sure password is URL encoded if it has special characters\n');
  process.exit(1);
}

console.log('✅ MONGODB_URI found');
console.log('📝 Connection string (password hidden):');
const hiddenUri = MONGODB_URI.replace(/:[^:@]+@/, ':****@');
console.log(hiddenUri);
console.log('\n');

// Check for common issues
if (MONGODB_URI.includes('<password>') || MONGODB_URI.includes('YOUR_PASSWORD')) {
  console.log('❌ ERROR: Placeholder password found!');
  console.log('💡 Replace <password> or YOUR_PASSWORD with your actual password\n');
  process.exit(1);
}

// Check if password might need encoding
const passwordMatch = MONGODB_URI.match(/mongodb\+srv:\/\/[^:]+:([^@]+)@/);
if (passwordMatch) {
  const password = passwordMatch[1];
  if (password.includes('@') || password.includes('#') || password.includes('$') || password.includes('%')) {
    console.log('⚠️  WARNING: Password contains special characters that might need URL encoding');
    console.log('💡 Special characters to encode:');
    console.log('   @ → %40');
    console.log('   # → %23');
    console.log('   $ → %24');
    console.log('   % → %25');
    console.log('   & → %26');
    console.log('\n💡 Quick fix: Use online tool https://www.urlencoder.org/');
    console.log('   Or change password in MongoDB Atlas to simple one (no special chars)\n');
  }
}

// Try to connect
console.log('🔄 Attempting to connect to MongoDB...\n');

mongoose.connect(MONGODB_URI, {
  serverSelectionTimeoutMS: 5000,
})
.then(() => {
  console.log('✅ SUCCESS! MongoDB Connected Successfully');
  console.log('📊 Database:', mongoose.connection.name);
  console.log('🌐 Host:', mongoose.connection.host);
  console.log('\n✅ Your MongoDB connection is working correctly!\n');
  process.exit(0);
})
.catch((error) => {
  console.log('❌ CONNECTION FAILED\n');
  
  if (error.message.includes('authentication failed') || error.message.includes('bad auth')) {
    console.log('🔐 AUTHENTICATION ERROR');
    console.log('💡 Solutions:');
    console.log('   1. Check if password is correct');
    console.log('   2. URL encode special characters in password');
    console.log('   3. Or change password in MongoDB Atlas to simple one');
    console.log('\n📖 See FIX_MONGODB_AUTH.md for detailed instructions\n');
  } else if (error.message.includes('ENOTFOUND') || error.message.includes('getaddrinfo')) {
    console.log('🌐 NETWORK ERROR');
    console.log('💡 Check:');
    console.log('   1. Internet connection');
    console.log('   2. MongoDB Atlas cluster is running');
    console.log('   3. Connection string is correct\n');
  } else if (error.message.includes('IP')) {
    console.log('🚫 IP WHITELIST ERROR');
    console.log('💡 Solution:');
    console.log('   1. Go to MongoDB Atlas → Network Access');
    console.log('   2. Add IP Address: 0.0.0.0/0 (allows all IPs)');
    console.log('   3. Or add your current IP address\n');
  } else {
    console.log('❌ Error:', error.message);
    console.log('\n💡 Check:');
    console.log('   1. MongoDB Atlas cluster is running');
    console.log('   2. Connection string format is correct');
    console.log('   3. Database user has proper permissions\n');
  }
  
  process.exit(1);
});

