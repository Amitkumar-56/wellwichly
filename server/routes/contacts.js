const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Contact = require('../models/Contact');
const { verifyToken } = require('./auth');

// Create contact (public)
router.post('/', async (req, res) => {
  try {
    // Check MongoDB connection
    if (mongoose.connection.readyState !== 1) {
      console.error('❌ MongoDB not connected. Cannot save contact.');
      return res.status(503).json({ 
        message: 'Database not available', 
        error: 'MongoDB connection is not established. Please check server logs and ensure MongoDB is connected.',
        details: 'Server is running but database connection failed. Check .env file and MongoDB Atlas settings.'
      });
    }

    console.log('✅ MongoDB connected - Saving contact...');
    console.log('Received contact data:', JSON.stringify(req.body, null, 2));
    
    const contact = new Contact(req.body);
    const savedContact = await contact.save();
    console.log('✅ Contact saved successfully to database!');
    console.log('📞 Contact ID:', savedContact._id);
    console.log('👤 Name:', savedContact.name);
    res.status(201).json({ message: 'Contact form submitted successfully', contact: savedContact });
  } catch (error) {
    console.error('❌ Error saving contact:', error);
    res.status(400).json({ message: 'Error submitting contact form', error: error.message });
  }
});

// Get all contacts (admin only)
router.get('/', verifyToken, async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching contacts', error: error.message });
  }
});

// Update contact status (admin only)
router.patch('/:id/status', verifyToken, async (req, res) => {
  try {
    const { status } = req.body;
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    res.json({ message: 'Contact status updated', contact });
  } catch (error) {
    res.status(500).json({ message: 'Error updating contact', error: error.message });
  }
});

// Delete contact (admin only)
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    res.json({ message: 'Contact deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting contact', error: error.message });
  }
});

module.exports = router;

