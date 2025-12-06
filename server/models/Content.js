const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true,
  },
  type: {
    type: String,
    enum: ['text', 'image', 'logo', 'banner', 'section'],
    required: true,
  },
  value: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  page: {
    type: String,
    default: 'home', // home, about, services, contact
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Content', contentSchema);

