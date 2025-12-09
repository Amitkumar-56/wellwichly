const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Order = require('../models/Order');
const { verifyToken } = require('./auth');

// Create order (public)
router.post('/', async (req, res) => {
  try {
    // Check MongoDB connection
    if (mongoose.connection.readyState !== 1) {
      console.error('❌ MongoDB not connected. Cannot save order.');
      return res.status(503).json({ 
        message: 'Database not available', 
        error: 'MongoDB connection is not established. Please check server logs and ensure MongoDB is connected.',
        details: 'Server is running but database connection failed. Check .env file and MongoDB Atlas settings.'
      });
    }

    console.log('✅ MongoDB connected - Saving order...');
    console.log('Received order data:', JSON.stringify(req.body, null, 2));
    
    // Validate required fields
    if (!req.body.customerName || !req.body.phone || !req.body.address) {
      return res.status(400).json({ 
        message: 'Missing required fields', 
        error: 'Customer name, phone, and address are required',
        received: {
          customerName: req.body.customerName,
          phone: req.body.phone,
          address: req.body.address
        }
      });
    }

    if (!req.body.items || !Array.isArray(req.body.items) || req.body.items.length === 0) {
      return res.status(400).json({ 
        message: 'Invalid order items', 
        error: 'Order must contain at least one item',
        received: req.body.items
      });
    }

    // Validate items structure
    for (let i = 0; i < req.body.items.length; i++) {
      const item = req.body.items[i];
      if (!item.name || !item.quantity || !item.price) {
        return res.status(400).json({ 
          message: 'Invalid item structure', 
          error: `Item at index ${i} is missing required fields (name, quantity, price)`,
          item: item
        });
      }
    }

    if (!req.body.totalAmount || req.body.totalAmount <= 0) {
      return res.status(400).json({ 
        message: 'Invalid total amount', 
        error: 'Total amount must be greater than 0',
        received: req.body.totalAmount
      });
    }

    if (!req.body.paymentMethod || !['cash', 'online'].includes(req.body.paymentMethod)) {
      return res.status(400).json({ 
        message: 'Invalid payment method', 
        error: 'Payment method must be either "cash" or "online"',
        received: req.body.paymentMethod
      });
    }

    // Prepare order data
    const orderData = {
      customerName: req.body.customerName.trim(),
      phone: req.body.phone.trim(),
      email: req.body.email ? req.body.email.trim() : undefined,
      address: req.body.address.trim(),
      items: req.body.items.map(item => ({
        name: item.name.trim(),
        quantity: Number(item.quantity),
        price: Number(item.price)
      })),
      totalAmount: Number(req.body.totalAmount),
      paymentMethod: req.body.paymentMethod,
      status: 'pending'
    };

    console.log('Processed order data:', JSON.stringify(orderData, null, 2));

    const order = new Order(orderData);
    const savedOrder = await order.save();
    console.log('✅ Order saved successfully to database!');
    console.log('📦 Order ID:', savedOrder._id);
    console.log('👤 Customer:', savedOrder.customerName);
    console.log('💰 Total:', savedOrder.totalAmount);
    res.status(201).json({ message: 'Order placed successfully', order: savedOrder });
  } catch (error) {
    console.error('Error creating order:', error);
    console.error('Error stack:', error.stack);
    
    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = {};
      Object.keys(error.errors).forEach(key => {
        validationErrors[key] = error.errors[key].message;
      });
      return res.status(400).json({ 
        message: 'Validation error', 
        error: 'Order validation failed',
        validationErrors: validationErrors,
        details: error.message
      });
    }

    // Handle other errors
    res.status(500).json({ 
      message: 'Error creating order', 
      error: error.message,
      errorType: error.name,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Track order by phone or order ID (public)
router.get('/track', async (req, res) => {
  try {
    const { phone, orderId } = req.query;
    
    if (!phone && !orderId) {
      return res.status(400).json({ 
        message: 'Please provide phone number or order ID',
        error: 'Either phone or orderId query parameter is required'
      });
    }

    let order;
    if (orderId) {
      // Track by order ID
      if (!mongoose.Types.ObjectId.isValid(orderId)) {
        return res.status(400).json({ message: 'Invalid order ID format' });
      }
      order = await Order.findById(orderId);
    } else {
      // Track by phone number - get most recent order
      order = await Order.findOne({ phone: phone.trim() }).sort({ createdAt: -1 });
    }

    if (!order) {
      return res.status(404).json({ 
        message: 'Order not found',
        error: 'No order found with the provided phone number or order ID'
      });
    }

    // Return order details (excluding sensitive info if needed)
    res.json({
      message: 'Order found',
      order: {
        _id: order._id,
        customerName: order.customerName,
        phone: order.phone,
        address: order.address,
        items: order.items,
        totalAmount: order.totalAmount,
        paymentMethod: order.paymentMethod,
        status: order.status,
        orderDate: order.orderDate,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt
      }
    });
  } catch (error) {
    console.error('Error tracking order:', error);
    res.status(500).json({ message: 'Error tracking order', error: error.message });
  }
});

// Get all orders (admin only)
router.get('/', verifyToken, async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders', error: error.message });
  }
});

// Get single order (admin only)
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching order', error: error.message });
  }
});

// Update order status (admin only)
router.patch('/:id/status', verifyToken, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json({ message: 'Order status updated', order });
  } catch (error) {
    res.status(500).json({ message: 'Error updating order', error: error.message });
  }
});

// Delete order (admin only)
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting order', error: error.message });
  }
});

module.exports = router;

