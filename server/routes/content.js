const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Content = require('../models/Content');
const { verifyToken } = require('./auth');

// Get all content
router.get('/', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ 
        message: 'Database not available',
        error: 'MongoDB connection is not established.'
      });
    }

    const contents = await Content.find({}).sort({ page: 1, key: 1 });
    res.json(contents);
  } catch (error) {
    console.error('Error fetching content:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get content by key
router.get('/:key', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ 
        message: 'Database not available',
        error: 'MongoDB connection is not established.'
      });
    }

    const content = await Content.findOne({ key: req.params.key });
    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }
    res.json(content);
  } catch (error) {
    console.error('Error fetching content:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create or update content (admin only)
router.post('/', verifyToken, async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ 
        message: 'Database not available',
        error: 'MongoDB connection is not established.'
      });
    }

    const { key, type, value, label, description, page } = req.body;

    if (!key || !type || !value || !label) {
      return res.status(400).json({ 
        message: 'Key, type, value, and label are required' 
      });
    }

    const content = await Content.findOneAndUpdate(
      { key },
      {
        key,
        type,
        value,
        label,
        description: description || '',
        page: page || 'home',
      },
      { upsert: true, new: true }
    );

    console.log('✅ Content saved:', key);
    res.json({ message: 'Content saved successfully', content });
  } catch (error) {
    console.error('Error saving content:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update content (admin only)
router.put('/:key', verifyToken, async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ 
        message: 'Database not available',
        error: 'MongoDB connection is not established.'
      });
    }

    const { value, label, description } = req.body;

    const content = await Content.findOneAndUpdate(
      { key: req.params.key },
      {
        $set: {
          value: value !== undefined ? value : undefined,
          label: label !== undefined ? label : undefined,
          description: description !== undefined ? description : undefined,
        }
      },
      { new: true }
    );

    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }

    console.log('✅ Content updated:', req.params.key);
    res.json({ message: 'Content updated successfully', content });
  } catch (error) {
    console.error('Error updating content:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete content (admin only)
router.delete('/:key', verifyToken, async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ 
        message: 'Database not available',
        error: 'MongoDB connection is not established.'
      });
    }

    const content = await Content.findOneAndDelete({ key: req.params.key });
    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }

    console.log('✅ Content deleted:', req.params.key);
    res.json({ message: 'Content deleted successfully' });
  } catch (error) {
    console.error('Error deleting content:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;

