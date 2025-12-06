// Setup Admin User in Database
// This script will create admin user if it doesn't exist

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['admin'],
    default: 'admin',
  },
}, {
  timestamps: true,
});

userSchema.methods.comparePassword = async function(password) {
  return bcrypt.compare(password, this.password);
};

const User = mongoose.model('User', userSchema);

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/sandwich-website';

console.log('\n🔧 Admin User Setup Tool\n');
console.log('Connecting to MongoDB...\n');

mongoose.connect(MONGODB_URI)
.then(async () => {
  console.log('✅ Connected to MongoDB');
  console.log('📊 Database:', mongoose.connection.name);
  console.log('\n');
  
  // Check if admin already exists
  const existingAdmin = await User.findOne({ username: 'admin' });
  
  if (existingAdmin) {
    console.log('✅ Admin user already exists in database!');
    console.log('📝 Username: admin');
    console.log('🆔 User ID:', existingAdmin._id);
    console.log('📅 Created:', existingAdmin.createdAt);
    console.log('\n💡 To login:');
    console.log('   Username: admin');
    console.log('   Password: admin123');
    console.log('\n⚠️  If login is not working:');
    console.log('   1. Make sure backend server is running: npm run dev:server');
    console.log('   2. Check MongoDB connection in server logs');
    console.log('   3. Verify credentials are correct');
  } else {
    console.log('❌ Admin user NOT found in database!');
    console.log('💡 Creating admin user...\n');
    
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
    console.log('\n💡 Login credentials:');
    console.log('   Username: admin');
    console.log('   Password: admin123');
    console.log('\n⚠️  Please change the password after first login!');
  }
  
  console.log('\n✅ Setup complete!\n');
  process.exit(0);
})
.catch((error) => {
  console.error('❌ Error:', error.message);
  
  if (error.message.includes('authentication failed') || error.message.includes('bad auth')) {
    console.error('\n🔐 MongoDB Authentication Error!');
    console.error('💡 Fix your MongoDB connection first:');
    console.error('   1. Check .env file - MONGODB_URI');
    console.error('   2. URL encode password if it has special characters');
    console.error('   3. Or change password in MongoDB Atlas to simple one');
    console.error('\n📖 See FIX_MONGODB_AUTH.md for detailed instructions');
  } else if (error.message.includes('ENOTFOUND')) {
    console.error('\n🌐 Network Error!');
    console.error('💡 Check:');
    console.error('   1. Internet connection');
    console.error('   2. MongoDB Atlas cluster is running');
    console.error('   3. Connection string is correct');
  } else {
    console.error('\n💡 Check:');
    console.error('   1. MongoDB Atlas cluster is running');
    console.error('   2. Connection string format is correct');
    console.error('   3. IP whitelist includes your IP (or 0.0.0.0/0)');
  }
  
  process.exit(1);
});

