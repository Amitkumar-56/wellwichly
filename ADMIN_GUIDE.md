# Admin Panel Guide - Wellwichly

## Admin Login Credentials

**Default Login:**
- **Username:** `admin`
- **Password:** `admin123`

⚠️ **Important:** Change the password after first login for security!

## How to Login

1. Go to: `http://localhost:3000/admin`
2. Enter username: `admin`
3. Enter password: `admin123`
4. Click "Login"

## Admin Features

### 1. Orders Management
- View all customer orders
- Update order status (Pending, Confirmed, Preparing, Out for Delivery, Delivered, Cancelled)
- See customer details, items, and payment method
- Track order dates

### 2. Contact & Franchise Enquiries
- View all contact form submissions
- View franchise enquiry forms
- Update status (New, Read, Replied)
- Franchise enquiries are highlighted in orange

### 3. Menu Items Management (NEW!)
- **View all menu items** with images
- **Add new items:**
  - Name
  - Description
  - Price
  - Image URL (use Unsplash or any image URL)
  - Category (Veg/Non-Veg)
  - Available status
- **Edit existing items:**
  - Click "Edit" button on any item
  - Change name, price, description, image, category
  - Update availability
- **Delete items:**
  - Click "Delete" button (confirmation required)

## How to Add/Edit Menu Items

### Adding a New Item:
1. Login to admin panel
2. Click on "🥪 Menu Items" tab
3. Click "+ Add New Item" button
4. Fill in the form:
   - **Name:** e.g., "Chicken Tikka Sandwich"
   - **Description:** e.g., "Spicy chicken tikka with onions and mint chutney"
   - **Price:** e.g., 200
   - **Image URL:** Use Unsplash or any image URL
     - Example: `https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=800&h=600&fit=crop`
   - **Category:** Select "Veg" or "Non-Veg"
   - **Available:** Check if item is available
5. Click "Save"

### Editing an Item:
1. Go to "🥪 Menu Items" tab
2. Find the item you want to edit
3. Click "Edit" button
4. Make your changes
5. Click "Save"

### Changing Image:
1. Edit the item
2. Update the "Image URL" field with new image link
3. Save

### Changing Price:
1. Edit the item
2. Update the "Price" field
3. Save

### Changing Name/Description:
1. Edit the item
2. Update name or description
3. Save

## Image Sources

You can use images from:
- **Unsplash:** https://unsplash.com (free, high quality)
- **Pexels:** https://pexels.com (free)
- **Your own images:** Upload to image hosting service

### Unsplash Image URLs Format:
```
https://images.unsplash.com/photo-[ID]?w=800&h=600&fit=crop
```

## Tips

1. **Always use high-quality images** (at least 800x600px)
2. **Use descriptive names** for menu items
3. **Keep descriptions short** but informative
4. **Set correct category** (Veg/Non-Veg) for filtering
5. **Mark unavailable items** as "Unavailable" instead of deleting

## Security

- Change default password immediately
- Don't share admin credentials
- Logout after use
- Keep your JWT_SECRET secure in `.env` file

