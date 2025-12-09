# Mobile Access Guide - Test Website on Mobile

## 📱 Access Website from Mobile Device

### Step 1: Find Your Computer's IP Address

Your local IP address is: **192.168.31.254** (Wi-Fi)

To find it manually:
- Windows: Open PowerShell → Run: `Get-NetIPAddress -AddressFamily IPv4`
- Or check: Settings → Network & Internet → Wi-Fi → Properties

### Step 2: Make Sure Both Devices Are on Same Network

- ✅ Computer and Mobile must be on **same Wi-Fi network**
- ✅ Both devices should be connected to same router

### Step 3: Start Development Server

The server is already configured to accept connections from network:

```bash
npm run dev
```

You should see:
```
- Local:        http://localhost:3000
- Network:      http://192.168.31.254:3000
```

### Step 4: Access from Mobile

On your mobile device browser, open:

```
http://192.168.31.254:3000
```

**Important:** Replace `192.168.31.254` with your actual IP address if different!

### Step 5: Test Responsive Design

✅ Check:
- Header menu (should show hamburger menu on mobile)
- Images scale properly
- Text is readable
- Buttons are touch-friendly
- Social sidebar is visible
- Google Map loads correctly

## 🔧 Troubleshooting

### Can't Access from Mobile?

1. **Check Firewall:**
   - Windows Firewall might be blocking port 3000
   - Allow Node.js through firewall

2. **Check IP Address:**
   - Make sure you're using correct IP
   - Run: `Get-NetIPAddress -AddressFamily IPv4`

3. **Check Network:**
   - Both devices on same Wi-Fi?
   - Try disconnecting and reconnecting

4. **Check Server:**
   - Server running? Check terminal for errors
   - Try restarting: `Ctrl+C` then `npm run dev`

### Port Already in Use?

If port 3000 is busy:
```bash
# Use different port
next dev -p 3001 -H 0.0.0.0
```

Then access: `http://192.168.31.254:3001`

## 📝 Notes

- **New Tabs Opening:** Social media links (WhatsApp, Instagram, Facebook, YouTube) open in new tabs - this is normal behavior (`target="_blank"`)
- **Responsive Design:** Website uses Tailwind CSS responsive classes (`md:`, `lg:`) for mobile-first design
- **Viewport Meta:** Added for proper mobile scaling

## ✅ Quick Test Checklist

- [ ] Server running on `0.0.0.0`
- [ ] Both devices on same network
- [ ] Mobile browser opens website
- [ ] Header menu works on mobile
- [ ] Images display correctly
- [ ] Text is readable
- [ ] Buttons are clickable
- [ ] Social sidebar visible
- [ ] Google Map loads

Happy Testing! 🎉

