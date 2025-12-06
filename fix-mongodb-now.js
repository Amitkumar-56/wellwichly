// Complete MongoDB Connection Fix Script
// This script will help you fix MongoDB connection step by step

require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

console.log('\n🔧 MongoDB Connection Fix Tool\n');
console.log('='.repeat(50));
console.log('');

// Step 1: Check .env file
console.log('📋 Step 1: Checking .env file...');
const envPath = path.join(process.cwd(), '.env');

if (!fs.existsSync(envPath)) {
  console.log('❌ .env file NOT found!');
  console.log('\n💡 Creating .env file...');
  
  const defaultEnv = `MONGODB_URI=mongodb+srv://amitk73262_db_user:YOUR_PASSWORD@cluster0.2wvruvf.mongodb.net/sandwich-website?retryWrites=true&w=majority
JWT_SECRET=your-secret-key-change-in-production-make-it-long-and-random
PORT=5000
NEXT_PUBLIC_API_URL=http://localhost:5000
`;
  
  fs.writeFileSync(envPath, defaultEnv);
  console.log('✅ .env file created!');
  console.log('\n⚠️  IMPORTANT: Please update MONGODB_URI with your actual password!');
  console.log('   1. Go to MongoDB Atlas → Database Access');
  console.log('   2. Get your connection string');
  console.log('   3. Replace YOUR_PASSWORD with your actual password');
  console.log('   4. If password has special characters, URL encode them\n');
  process.exit(1);
}

console.log('✅ .env file exists');

// Step 2: Check MONGODB_URI
console.log('\n📋 Step 2: Checking MONGODB_URI...');
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.log('❌ MONGODB_URI not found in .env file!');
  console.log('\n💡 Add this line to .env file:');
  console.log('   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database');
  process.exit(1);
}

console.log('✅ MONGODB_URI found');

// Check for placeholders
if (MONGODB_URI.includes('<password>') || MONGODB_URI.includes('YOUR_PASSWORD') || MONGODB_URI.includes('<db_password>')) {
  console.log('❌ ERROR: Placeholder password found in connection string!');
  console.log('\n💡 Replace placeholder with your actual password:');
  console.log('   - <password> → Your actual password');
  console.log('   - YOUR_PASSWORD → Your actual password');
  console.log('   - <db_password> → Your actual password');
  console.log('\n📝 Example:');
  console.log('   mongodb+srv://username:MyPassword123@cluster.mongodb.net/database');
  process.exit(1);
}

// Step 3: Check password encoding
console.log('\n📋 Step 3: Checking password encoding...');
const passwordMatch = MONGODB_URI.match(/mongodb\+srv:\/\/[^:]+:([^@]+)@/);
if (passwordMatch) {
  const password = passwordMatch[1];
  const specialChars = ['@', '#', '$', '%', '&', '+', '=', '?', '/', ' '];
  const hasSpecialChars = specialChars.some(char => password.includes(char));
  
  if (hasSpecialChars && !password.includes('%')) {
    console.log('⚠️  WARNING: Password contains special characters that need URL encoding!');
    console.log('\n💡 Special characters found that need encoding:');
    specialChars.forEach(char => {
      if (password.includes(char)) {
        const encoded = encodeURIComponent(char);
        console.log(`   ${char} → ${encoded}`);
      }
    });
    console.log('\n💡 Solutions:');
    console.log('   Option 1: URL encode your password');
    console.log('      - Go to: https://www.urlencoder.org/');
    console.log('      - Paste your password');
    console.log('      - Copy encoded version');
    console.log('      - Update .env file');
    console.log('\n   Option 2: Change password in MongoDB Atlas (Easier)');
    console.log('      - MongoDB Atlas → Database Access');
    console.log('      - Edit user → Change password');
    console.log('      - Use simple password (no special chars)');
    console.log('      - Example: Wellwichly123');
    console.log('      - Update .env file with new password');
  } else {
    console.log('✅ Password looks good (no special chars or already encoded)');
  }
}

// Step 4: Check connection string format
console.log('\n📋 Step 4: Checking connection string format...');
if (!MONGODB_URI.startsWith('mongodb+srv://') && !MONGODB_URI.startsWith('mongodb://')) {
  console.log('❌ ERROR: Invalid connection string format!');
  console.log('💡 Connection string should start with:');
  console.log('   mongodb+srv:// (for Atlas)');
  console.log('   mongodb:// (for local)');
  process.exit(1);
}

if (!MONGODB_URI.includes('@')) {
  console.log('❌ ERROR: Missing username/password in connection string!');
  console.log('💡 Format should be: mongodb+srv://username:password@cluster...');
  process.exit(1);
}

if (!MONGODB_URI.includes('.mongodb.net')) {
  console.log('⚠️  WARNING: Connection string might be incorrect');
  console.log('💡 For MongoDB Atlas, it should contain: .mongodb.net');
}

console.log('✅ Connection string format looks correct');

// Step 5: Try to connect
console.log('\n📋 Step 5: Testing MongoDB connection...');
console.log('🔄 Attempting to connect...\n');

mongoose.connect(MONGODB_URI, {
  serverSelectionTimeoutMS: 10000,
  socketTimeoutMS: 45000,
})
.then(async () => {
  console.log('✅ SUCCESS! MongoDB Connected Successfully!');
  console.log('📊 Database:', mongoose.connection.name);
  console.log('🌐 Host:', mongoose.connection.host);
  console.log('🔌 Port:', mongoose.connection.port || 'N/A (Atlas)');
  console.log('\n✅ Your MongoDB connection is working correctly!');
  console.log('✅ Server can now save data to database');
  console.log('✅ Admin login will work');
  console.log('\n🎉 All set! You can now start your server:\n');
  console.log('   npm run dev:server\n');
  
  // Check if admin user exists
  try {
    const User = require('./server/models/User');
    const admin = await User.findOne({ username: 'admin' });
    if (admin) {
      console.log('✅ Admin user exists in database');
    } else {
      console.log('💡 Admin user will be created automatically on server start');
    }
  } catch (error) {
    // Model might not be available, that's okay
  }
  
  mongoose.disconnect();
  process.exit(0);
})
.catch((error) => {
  console.log('❌ CONNECTION FAILED\n');
  console.log('Error:', error.message);
  console.log('\n' + '='.repeat(50));
  
  if (error.message.includes('authentication failed') || error.message.includes('bad auth')) {
    console.log('\n🔐 AUTHENTICATION ERROR');
    console.log('\n💡 Most Common Solutions:\n');
    console.log('   Solution 1: Change Password in MongoDB Atlas (EASIEST)');
    console.log('   1. Go to: https://cloud.mongodb.com/');
    console.log('   2. Click "Database Access" → Find your user → "Edit"');
    console.log('   3. Click "Edit Password" → Enter simple password (no special chars)');
    console.log('      Example: Wellwichly123');
    console.log('   4. Click "Update User"');
    console.log('   5. Update .env file with new password');
    console.log('   6. Restart server\n');
    
    console.log('   Solution 2: URL Encode Password');
    console.log('   1. Go to: https://www.urlencoder.org/');
    console.log('   2. Paste your password');
    console.log('   3. Copy encoded version');
    console.log('   4. Update .env file\n');
    
    console.log('   Solution 3: Check Username');
    console.log('   1. MongoDB Atlas → Database Access');
    console.log('   2. Verify username is correct in connection string\n');
    
  } else if (error.message.includes('ENOTFOUND') || error.message.includes('getaddrinfo')) {
    console.log('\n🌐 NETWORK ERROR');
    console.log('\n💡 Check:');
    console.log('   1. Internet connection is working');
    console.log('   2. MongoDB Atlas cluster is running');
    console.log('   3. Connection string cluster name is correct\n');
    
  } else if (error.message.includes('IP') || error.message.includes('whitelist')) {
    console.log('\n🚫 IP WHITELIST ERROR');
    console.log('\n💡 Solution:');
    console.log('   1. Go to: https://cloud.mongodb.com/');
    console.log('   2. Click "Network Access"');
    console.log('   3. Click "Add IP Address"');
    console.log('   4. Add: 0.0.0.0/0 (allows all IPs for testing)');
    console.log('   5. Click "Confirm"');
    console.log('   6. Wait 1-2 minutes');
    console.log('   7. Try again\n');
    
  } else {
    console.log('\n❓ UNKNOWN ERROR');
    console.log('\n💡 Check:');
    console.log('   1. MongoDB Atlas cluster is running');
    console.log('   2. Connection string format is correct');
    console.log('   3. Database user has proper permissions');
    console.log('   4. Network access is configured\n');
  }
  
  console.log('📖 For detailed instructions, see:');
  console.log('   - FIX_MONGODB_AUTH.md');
  console.log('   - QUICK_FIX_MONGODB.md');
  console.log('   - DATABASE_FIX.md\n');
  
  process.exit(1);
});

