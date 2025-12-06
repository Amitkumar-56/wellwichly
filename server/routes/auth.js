const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Login (supports both username and email)
router.post('/login', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const loginIdentifier = username || email;

    // Check MongoDB connection
    if (mongoose.connection.readyState !== 1) {
      console.error('❌ MongoDB not connected. Cannot authenticate user.');
      return res.status(503).json({ 
        message: 'Database not available', 
        error: 'MongoDB connection is not established. Please check server logs and ensure MongoDB is connected.',
        details: 'Server is running but database connection failed. Check .env file and MongoDB Atlas settings.'
      });
    }

    if (!loginIdentifier || !password) {
      return res.status(400).json({ message: 'Username/Email and password are required' });
    }

    console.log('🔐 Login attempt for:', loginIdentifier);

    // Try to find user by username or email
    const user = await User.findOne({
      $or: [
        { username: loginIdentifier },
        { email: loginIdentifier }
      ]
    });

    if (!user) {
      console.error('❌ User not found:', loginIdentifier);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.error('❌ Password mismatch for user:', loginIdentifier);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user._id, username: user.username, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    console.log('✅ Login successful for user:', user.username);
    res.json({ 
      token, 
      user: { 
        id: user._id, 
        username: user.username, 
        email: user.email,
        role: user.role 
      } 
    });
  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Verify token middleware
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

router.get('/verify', verifyToken, (req, res) => {
  res.json({ user: req.user });
});

// Change password
router.post('/change-password', verifyToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Check MongoDB connection
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ 
        message: 'Database not available', 
        error: 'MongoDB connection is not established.'
      });
    }

    // Validate input
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current password and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters long' });
    }

    // Find user
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    console.log('✅ Password changed successfully for user:', user.username);
    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('❌ Password change error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
module.exports.verifyToken = verifyToken;

