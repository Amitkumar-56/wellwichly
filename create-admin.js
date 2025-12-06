const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./server/models/User');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/sandwich-website';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(async () => {
  console.log('Connected to MongoDB');
  
  // Check if admin already exists
  const existingAdmin = await User.findOne({ username: 'admin' });
  if (existingAdmin) {
    console.log('Admin user already exists!');
    process.exit();
    return;
  }
  
  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);
  await User.create({
    username: 'admin',
    email: 'Wellwichly@gmail.com',
    password: hashedPassword,
    role: 'admin'
  });
  
  console.log('\n✅ Admin user created successfully!');
  console.log('Username: admin');
  console.log('Email: Wellwichly@gmail.com');
  console.log('Password: admin123');
  console.log('\n⚠️  Please change the password after first login!\n');
  
  process.exit();
})
.catch((error) => {
  console.error('Error:', error);
  process.exit(1);
});

