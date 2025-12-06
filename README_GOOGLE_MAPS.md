# Google Maps Integration Guide

## Setup Google Maps API

1. **Get Google Maps API Key**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing
   - Enable "Maps JavaScript API"
   - Create API Key
   - Restrict API Key to your domain (optional but recommended)

2. **Add API Key to Environment Variables**
   
   Create or update your `.env` file:
   ```
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
   ```

3. **Features Implemented**
   - ✅ Live location detection (user's current location)
   - ✅ Blue marker for user location
   - ✅ Red markers for franchise stores
   - ✅ Nearby stores calculation (within 50km)
   - ✅ Click markers to see store details
   - ✅ Distance calculation from user location
   - ✅ Interactive map with zoom and pan

4. **How It Works**
   - Browser asks for location permission
   - User's location is detected automatically
   - Map shows user location (blue marker)
   - All franchise stores shown (red markers)
   - Nearby stores (within 50km) are listed below map
   - Click any marker to see store details

5. **Privacy Note**
   - Location is only used to show nearby stores
   - Location data is not stored or sent to server
   - Works entirely in browser

## Troubleshooting

- **Map not loading?** Check if API key is set in `.env` file
- **Location not detected?** Check browser permissions for location access
- **Markers not showing?** Verify API key has Maps JavaScript API enabled

