const express = require('express');
const router = express.Router();
const Service = require('../models/Service');
const { verifyToken } = require('./auth');

// Get all services (public)
router.get('/', async (req, res) => {
  try {
    let services = await Service.find({ available: true }).sort({ createdAt: -1 });
    
    // If no services in DB, return default services with images
    if (services.length === 0) {
      services = [
        {
          name: 'Classic Club Sandwich',
          description: 'Triple decker with chicken, bacon, lettuce, tomato, and mayo',
          price: 250,
          image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=800&h=600&fit=crop',
          category: 'Non-Veg',
          available: true,
        },
        {
          name: 'Veggie Delight',
          description: 'Fresh vegetables, cheese, and special sauce',
          price: 180,
          image: 'https://images.unsplash.com/photo-1553909489-cd47ac38e1f8?w=800&h=600&fit=crop',
          category: 'Veg',
          available: true,
        },
        {
          name: 'Grilled Chicken Sandwich',
          description: 'Tender grilled chicken with special spices',
          price: 220,
          image: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?w=800&h=600&fit=crop',
          category: 'Non-Veg',
          available: true,
        },
        {
          name: 'Chicken Tikka Sandwich',
          description: 'Spicy chicken tikka with onions and mint chutney',
          price: 200,
          image: 'https://images.unsplash.com/photo-1534939561126-855b8675edd7?w=800&h=600&fit=crop',
          category: 'Non-Veg',
          available: true,
        },
        {
          name: 'BBQ Chicken Sandwich',
          description: 'Smoky BBQ chicken with coleslaw',
          price: 240,
          image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=600&fit=crop',
          category: 'Non-Veg',
          available: true,
        },
        {
          name: 'Paneer Sandwich',
          description: 'Spiced paneer with vegetables and chutney',
          price: 190,
          image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800&h=600&fit=crop',
          category: 'Veg',
          available: true,
        },
        {
          name: 'Egg Sandwich',
          description: 'Scrambled eggs with cheese and herbs',
          price: 150,
          image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=800&h=600&fit=crop',
          category: 'Non-Veg',
          available: true,
        },
        {
          name: 'Chicken Wrap',
          description: 'Grilled chicken wrapped in soft tortilla',
          price: 210,
          image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=800&h=600&fit=crop',
          category: 'Non-Veg',
          available: true,
        },
        {
          name: 'Veggie Wrap',
          description: 'Fresh vegetables wrapped in tortilla',
          price: 170,
          image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=800&h=600&fit=crop',
          category: 'Veg',
          available: true,
        },
      ];
    }
    
    res.json(services);
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({ message: 'Error fetching services', error: error.message });
  }
});

// Create service (admin only)
router.post('/', verifyToken, async (req, res) => {
  try {
    const service = new Service(req.body);
    await service.save();
    res.status(201).json({ message: 'Service created successfully', service });
  } catch (error) {
    res.status(400).json({ message: 'Error creating service', error: error.message });
  }
});

// Update service (admin only)
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    res.json({ message: 'Service updated successfully', service });
  } catch (error) {
    res.status(500).json({ message: 'Error updating service', error: error.message });
  }
});

// Delete service (admin only)
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting service', error: error.message });
  }
});

module.exports = router;

