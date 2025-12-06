# Franchise Inquiry Form - Database & Admin Panel

## ✅ Kya Fix Kiya:

### 1. **Form Error Handling**
   - Better error messages
   - Success/Error states properly managed
   - Timeout cleanup to prevent memory leaks

### 2. **Data Format**
   - Detailed message format with all franchise details
   - Company name, address, liquid capital included
   - Contact details properly formatted

### 3. **Database Integration**
   - Data saves to MongoDB via `/api/contacts`
   - Same Contact model used
   - "Franchise Enquiry" prefix in message

### 4. **Admin Panel Display**
   - Orange highlight for franchise enquiries
   - "🏪 FRANCHISE ENQUIRY" badge
   - All details visible in admin panel

## 🚀 Kaise Kaam Karta Hai:

### Step 1: User Fills Form

**Franchise Inquiry Form Fields:**
- First Name
- Last Name
- Mobile Phone
- Email Address
- Company Address
- Company Name
- Liquid Capital (1-5 Lakhs, 5-10 Lakhs, etc.)
- Terms & Conditions checkbox

### Step 2: Form Submission

1. **User clicks:** "Submit Your Information"
2. **Data sent to:** `/api/contacts` (POST request)
3. **Message format:**
   ```
   Franchise Enquiry:

   Company Name: [Company Name]
   Company Address: [Address]
   Liquid Capital: [Amount]

   Contact Details:
   Name: [First Last]
   Phone: [Phone]
   Email: [Email]
   ```

### Step 3: Database Save

- **MongoDB:** Contact collection me save hota hai
- **Status:** "new" (default)
- **Timestamp:** Automatically added

### Step 4: Admin Panel Display

**Admin Dashboard → "📞 Contact & Franchise" Tab:**

1. **Franchise Enquiries:**
   - Orange border and background
   - "🏪 FRANCHISE ENQUIRY" badge
   - All details visible

2. **Regular Contacts:**
   - Gray border
   - Normal display

3. **Status Management:**
   - New → Read → Replied
   - Status update kar sakte hain

## 📋 Admin Panel Me Kya Dikhega:

**Franchise Enquiry Card:**
```
🏪 FRANCHISE ENQUIRY

Name: John Doe
Phone: 1234567890
Email: john@example.com

Message/Details:
Franchise Enquiry:

Company Name: ABC Foods
Company Address: 123 Main St
Liquid Capital: 10-20 Lakhs

Contact Details:
Name: John Doe
Phone: 1234567890
Email: john@example.com

Status: [New/Read/Replied]
Date: [Timestamp]
```

## ✅ Features:

- ✅ Form properly submits
- ✅ Data saves to database
- ✅ Success message shows
- ✅ Error handling
- ✅ Admin panel me dikhega
- ✅ Orange highlight for franchise
- ✅ Status management
- ✅ All details visible

## 🎯 Test:

1. **Fill franchise form:**
   - Go to: `/franchising`
   - Fill all fields
   - Submit

2. **Check success:**
   - Success message dikhega
   - Form reset ho jayega

3. **Check admin panel:**
   - Login: `http://localhost:3000/admin`
   - "Contact & Franchise" tab
   - Orange highlighted card dikhega
   - "🏪 FRANCHISE ENQUIRY" badge

## 📝 Data Flow:

```
Franchise Form → /api/contacts → MongoDB → Admin Panel
```

**Ab franchise form ka data bhi database me save hoga aur admin panel me dikhega! 🎉**

