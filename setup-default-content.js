// Setup Default Website Content
require('dotenv').config();
const mongoose = require('mongoose');
const Content = require('./server/models/Content');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/sandwich-website';

const defaultContent = [
  // Home Page
  { key: 'hero-title', type: 'text', value: 'Wellwichly Fresh Sandwiches, Every Day', label: 'Hero Title', description: 'Main hero section title', page: 'home' },
  { key: 'hero-subtitle', type: 'text', value: 'Start your own Wellwichly Outlet today!', label: 'Hero Subtitle', description: 'Hero section subtitle', page: 'home' },
  { key: 'logo-url', type: 'logo', value: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=200', label: 'Website Logo', description: 'Main website logo URL', page: 'home' },
  { key: 'banner-image-1', type: 'banner', value: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?q=80&w=2070', label: 'Banner Image 1', description: 'First banner image for slider', page: 'home' },
  { key: 'banner-image-2', type: 'banner', value: 'https://images.unsplash.com/photo-1550507701-e9158606476c?q=80&w=2070', label: 'Banner Image 2', description: 'Second banner image for slider', page: 'home' },
  { key: 'banner-image-3', type: 'banner', value: 'https://images.unsplash.com/photo-1592415499578-ce3cd68f046b?q=80&w=2070', label: 'Banner Image 3', description: 'Third banner image for slider', page: 'home' },
  { key: 'welcome-text', type: 'text', value: 'Batawa Ka Khaiba??', label: 'Welcome Section Title', description: 'Welcome section heading', page: 'home' },
  
  // About Page
  { key: 'about-title', type: 'text', value: 'About Wellwichly', label: 'About Page Title', description: 'About page main title', page: 'about' },
  { key: 'about-description', type: 'section', value: 'We serve fresh and delicious sandwiches every day.', label: 'About Description', description: 'About page description', page: 'about' },
  
  // Contact Page
  { key: 'contact-title', type: 'text', value: 'Contact Us', label: 'Contact Page Title', description: 'Contact page title', page: 'contact' },
  { key: 'contact-phone', type: 'text', value: '+91 8881917644', label: 'Contact Phone', description: 'Contact phone number', page: 'contact' },
  { key: 'contact-email', type: 'text', value: 'Wellwichly@gmail.com', label: 'Contact Email', description: 'Contact email address', page: 'contact' },
];

mongoose.connect(MONGODB_URI)
.then(async () => {
  console.log('✅ Connected to MongoDB');
  console.log('📊 Setting up default website content...\n');
  
  let created = 0;
  let updated = 0;
  
  for (const item of defaultContent) {
    const existing = await Content.findOne({ key: item.key });
    if (existing) {
      await Content.updateOne({ key: item.key }, { $set: item });
      updated++;
      console.log(`✅ Updated: ${item.key}`);
    } else {
      await Content.create(item);
      created++;
      console.log(`✅ Created: ${item.key}`);
    }
  }
  
  console.log(`\n✅ Setup complete!`);
  console.log(`   Created: ${created} items`);
  console.log(`   Updated: ${updated} items`);
  console.log(`\n💡 You can now edit all content from Admin Panel → Website Content tab\n`);
  
  mongoose.disconnect();
  process.exit(0);
})
.catch((error) => {
  console.error('❌ Error:', error.message);
  process.exit(1);
});

