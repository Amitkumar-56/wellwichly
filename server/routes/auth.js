const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { sendOrderEmail } = require('../utils/mailer');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Admin-only middleware
const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

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
    
    // Send login confirmation email to admin
    if (user.email) {
      try {
        const subject = `Admin Login Confirmation - ${user.username}`;
        const text = `Admin login successful:\n\nUsername: ${user.username}\nEmail: ${user.email}\nRole: ${user.role}\nTime: ${new Date().toLocaleString()}\nIP: ${req.ip || 'Unknown'}`;
        const html = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
            <div style="background-color: #16a34a; color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h1 style="margin: 0; font-size: 24px;">✅ Login Successful</h1>
            </div>
            <div style="background-color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h2 style="color: #111827; margin-top: 0;">Admin Login Confirmation</h2>
              <p><strong>Username:</strong> ${user.username}</p>
              <p><strong>Email:</strong> ${user.email}</p>
              <p><strong>Role:</strong> ${user.role}</p>
              <p><strong>Login Time:</strong> ${new Date().toLocaleString()}</p>
              <p><strong>IP Address:</strong> ${req.ip || 'Unknown'}</p>
              <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
              <p style="color: #6b7280; font-size: 14px;">If this was not you, please change your password immediately.</p>
            </div>
          </div>
        `;
        const emailResult = await sendOrderEmail({
          to: user.email,
          subject,
          text,
          html
        });
        if (emailResult.sent) {
          console.log('✅ Login confirmation email sent to:', user.email);
        } else {
          console.error('❌ Login confirmation email failed:', emailResult.reason);
        }
      } catch (emailError) {
        console.error('❌ Error sending login confirmation email:', emailError.message);
        // Don't fail login if email fails
      }
    }
    
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

// List users (admin only)
router.get('/users', verifyToken, requireAdmin, async (req, res) => {
  try {
    const users = await User.find().select('_id username email role createdAt');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
});

// Create user (admin only)
router.post('/users', verifyToken, requireAdmin, async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password required' });
    }
    if (role && !['admin', 'subadmin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }
    const existing = await User.findOne({ $or: [{ username }, { email }] });
    if (existing) {
      return res.status(409).json({ message: 'User with same username/email already exists' });
    }
    const user = new User({ username, email, password, role: role || 'subadmin' });
    await user.save();
    res.status(201).json({ message: 'User created', user: { id: user._id, username: user.username, email: user.email, role: user.role } });
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error: error.message });
  }
});

// Update user role (admin only)
router.patch('/users/:id/role', verifyToken, requireAdmin, async (req, res) => {
  try {
    const { role } = req.body;
    if (!['admin', 'subadmin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'Role updated', user: { id: user._id, username: user.username, email: user.email, role: user.role } });
  } catch (error) {
    res.status(500).json({ message: 'Error updating role', error: error.message });
  }
});

// Delete user (admin only)
router.delete('/users/:id', verifyToken, requireAdmin, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error: error.message });
  }
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

