const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Contact = require('../models/Contact');
const { verifyToken } = require('./auth');
const { sendOrderEmail } = require('../utils/mailer');

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
    
    // Send email notification to admin
    try {
      const adminEmail = process.env.ADMIN_EMAIL || 'Wellwichly@gmail.com';
      const subject = `New Contact Form Submission - ${savedContact.name}`;
      const text = `New contact form submission received:\n\nName: ${savedContact.name}\nEmail: ${savedContact.email}\nPhone: ${savedContact.phone}\nMessage: ${savedContact.message}\n\nSubmitted at: ${new Date(savedContact.createdAt).toLocaleString()}`;
      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
          <div style="background-color: #111827; color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h1 style="margin: 0; font-size: 24px;">Wellwichly Admin Notification</h1>
          </div>
          <div style="background-color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h2 style="color: #111827; margin-top: 0;">New Contact Form Submission</h2>
            <p><strong>Name:</strong> ${savedContact.name}</p>
            <p><strong>Email:</strong> ${savedContact.email}</p>
            <p><strong>Phone:</strong> ${savedContact.phone}</p>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
            <p><strong>Message:</strong></p>
            <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin-top: 10px;">
              <p style="margin: 0; white-space: pre-wrap;">${savedContact.message}</p>
            </div>
            <p style="color: #6b7280; font-size: 14px; margin-top: 20px;">
              Submitted at: ${new Date(savedContact.createdAt).toLocaleString()}
            </p>
          </div>
          <div style="text-align: center; color: #6b7280; font-size: 12px; margin-top: 20px;">
            <p>Check admin dashboard for more details.</p>
          </div>
        </div>
      `;
      const emailResult = await sendOrderEmail({
        to: adminEmail,
        subject,
        text,
        html
      });
      if (emailResult.sent) {
        console.log('✅ Admin notification email sent to:', adminEmail);
      } else {
        console.error('❌ Admin notification email failed:', emailResult.reason);
      }
    } catch (emailError) {
      console.error('❌ Error sending admin notification email:', emailError.message);
      // Don't fail the request if email fails
    }
    
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

