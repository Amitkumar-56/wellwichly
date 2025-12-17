'use client';

import { useEffect, useRef, useState } from 'react';

export default function GoogleMap() {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [userLocation, setUserLocation] = useState(null);
  const [nearbyStores, setNearbyStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const [googleMapsLoaded, setGoogleMapsLoaded] = useState(false);
  const [scriptLoading, setScriptLoading] = useState(false);
  const scriptLoadedRef = useRef(false);

  // Franchise locations (sample data - replace with real data from API)
  const franchiseLocations = [
    { id: 100, name: 'Corporate HQ', lat: 25.4358, lng: 81.8463, address: '212/184, Swaraj Bhawan, Uttar Pradesh 211003', phone: '+91 8881917644' },
    { id: 1, name: 'Wellwichly Patna', lat: 25.5941, lng: 85.1376, address: '123 Main Street, Patna', phone: '+91 8881917644' },
    { id: 2, name: 'Wellwichly Delhi', lat: 28.6139, lng: 77.2090, address: '456 Market Road, Delhi', phone: '+91 8881917644' },
    { id: 3, name: 'Wellwichly Mumbai', lat: 19.0760, lng: 72.8777, address: '789 Food Court, Mumbai', phone: '+91 8881917644' },
    { id: 4, name: 'Wellwichly Bangalore', lat: 12.9716, lng: 77.5946, address: '321 Tech Park, Bangalore', phone: '+91 8881917644' },
    { id: 5, name: 'Wellwichly Kolkata', lat: 22.5726, lng: 88.3639, address: '654 Park Street, Kolkata', phone: '+91 8881917644' },
    { id: 6, name: 'Wellwichly Chennai', lat: 13.0827, lng: 80.2707, address: '987 Beach Road, Chennai', phone: '+91 8881917644' },
    { id: 7, name: 'Wellwichly Hyderabad', lat: 17.3850, lng: 78.4867, address: '555 Tech City, Hyderabad', phone: '+91 8881917644' },
    { id: 8, name: 'Wellwichly Pune', lat: 18.5204, lng: 73.8567, address: '777 IT Park, Pune', phone: '+91 8881917644' },
  ];

  // Check if we're on client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Get user's current location
  useEffect(() => {
    if (!isClient) return;
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(location);
          calculateNearbyStores(location);
          setLoading(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          // Default to center of India if location denied
          const defaultLocation = { lat: 23.0225, lng: 72.5714 };
          setUserLocation(defaultLocation);
          calculateNearbyStores(defaultLocation);
          setLoading(false);
        }
      );
    } else {
      const defaultLocation = { lat: 23.0225, lng: 72.5714 };
      setUserLocation(defaultLocation);
      calculateNearbyStores(defaultLocation);
      setLoading(false);
    }
  }, [isClient]);

  // Calculate distance between two coordinates (Haversine formula)
  const calculateDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371; // Radius of Earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Find nearby stores within 50km
  const calculateNearbyStores = (userLoc) => {
    const storesWithDistance = franchiseLocations.map(store => ({
      ...store,
      distance: calculateDistance(userLoc.lat, userLoc.lng, store.lat, store.lng),
    }));

    const nearby = storesWithDistance
      .filter(store => store.distance <= 50) // Within 50km
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 5); // Top 5 nearest

    setNearbyStores(nearby);
  };

  // Load Google Maps script
  useEffect(() => {
    if (!isClient || scriptLoadedRef.current) return;

    // Check if Google Maps is already loaded
    if (typeof window !== 'undefined' && window.google && window.google.maps) {
      setGoogleMapsLoaded(true);
      return;
    }

    // Check if script is already being loaded
    const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
    if (existingScript) {
      existingScript.addEventListener('load', () => {
        setGoogleMapsLoaded(true);
      });
      return;
    }

    // Load the script
    setScriptLoading(true);
    scriptLoadedRef.current = true;
    
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 'YOUR_API_KEY';
    if (apiKey === 'YOUR_API_KEY') {
      console.warn('Google Maps API key not found. Please set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY in your .env file');
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      setGoogleMapsLoaded(true);
      setScriptLoading(false);
    };
    
    script.onerror = () => {
      console.error('Failed to load Google Maps script');
      setScriptLoading(false);
      scriptLoadedRef.current = false;
    };
    
    document.head.appendChild(script);
  }, [isClient]);

  // Initialize Google Maps
  useEffect(() => {
    if (!isClient || !googleMapsLoaded || !userLocation || !mapRef.current || mapInstanceRef.current) return;

    try {
      if (!window.google || !window.google.maps) {
        console.error('Google Maps API not available');
        return;
      }

      const map = new window.google.maps.Map(mapRef.current, {
        zoom: 6,
        center: userLocation,
        mapTypeId: 'roadmap',
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          }
        ]
      });

      mapInstanceRef.current = map;

      // Add user location marker (blue)
      if (userLocation) {
        new window.google.maps.Marker({
          position: userLocation,
          map: map,
          title: 'Your Location',
          icon: {
            url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
              <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                <circle cx="20" cy="20" r="18" fill="#3B82F6" stroke="#FFFFFF" stroke-width="3"/>
                <circle cx="20" cy="20" r="8" fill="#FFFFFF"/>
              </svg>
            `),
            scaledSize: new window.google.maps.Size(40, 40),
            anchor: new window.google.maps.Point(20, 20)
          }
        });
      }

      // Add franchise location markers (red)
      franchiseLocations.forEach((location) => {
        const marker = new window.google.maps.Marker({
          position: { lat: location.lat, lng: location.lng },
          map: map,
          title: location.name,
          icon: {
            url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
              <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                <circle cx="20" cy="20" r="18" fill="#EF4444" stroke="#FFFFFF" stroke-width="3"/>
                <circle cx="20" cy="20" r="8" fill="#FFFFFF"/>
              </svg>
            `),
            scaledSize: new window.google.maps.Size(40, 40),
            anchor: new window.google.maps.Point(20, 20)
          }
        });

        const infoWindow = new window.google.maps.InfoWindow({
          content: `
            <div style="padding: 10px; min-width: 200px;">
              <h3 style="font-weight: bold; margin-bottom: 5px; color: #6366F1; font-size: 16px;">${location.name}</h3>
              <p style="margin: 5px 0; color: #666; font-size: 14px;">📍 ${location.address}</p>
              <p style="margin: 5px 0; color: #666; font-size: 14px;">📞 <a href="tel:${location.phone}" style="color: #6366F1; text-decoration: none;">${location.phone}</a></p>
            </div>
          `
        });

        marker.addListener('click', () => {
          infoWindow.open(map, marker);
        });
      });

      // Fit bounds to show all markers
      const bounds = new window.google.maps.LatLngBounds();
      franchiseLocations.forEach(loc => {
        bounds.extend(new window.google.maps.LatLng(loc.lat, loc.lng));
      });
      if (userLocation) {
        bounds.extend(new window.google.maps.LatLng(userLocation.lat, userLocation.lng));
      }
      map.fitBounds(bounds);
    } catch (error) {
      console.error('Error initializing Google Maps:', error);
    }
  }, [isClient, googleMapsLoaded, userLocation]);

  if (!isClient) {
    return (
      <div className="w-full h-full bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 flex items-center justify-center relative">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 text-center text-white">
          <div className="text-7xl mb-4">🗺️</div>
          <p className="text-2xl font-bold mb-2">Loading Map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Map Container */}
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl p-8 shadow-2xl border-4 border-indigo-200 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-3xl font-black text-gray-800">Find Our Stores</h2>
          {loading && <p className="text-gray-600">📍 Detecting your location...</p>}
        </div>
        
        <div className="w-full h-[500px] rounded-2xl overflow-hidden shadow-xl border-4 border-white">
          <div ref={mapRef} className="w-full h-full">
            {/* Fallback if Google Maps not loaded */}
            {(!googleMapsLoaded || scriptLoading) && (
              <div className="w-full h-full bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 flex items-center justify-center relative">
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="relative z-10 text-center text-white">
                  <div className="text-7xl mb-4">🗺️</div>
                  <p className="text-2xl font-bold mb-2">Loading Map...</p>
                  <p className="text-lg opacity-90">
                    {scriptLoading ? 'Loading Google Maps...' : 'Please enable location access for best experience'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Legend */}
        <div className="mt-4 flex flex-wrap gap-4 justify-center">
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow">
            <div className="w-6 h-6 bg-blue-500 rounded-full border-2 border-white"></div>
            <span className="font-semibold text-gray-700">Your Location</span>
          </div>
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow">
            <div className="w-6 h-6 bg-red-600 rounded-full border-2 border-white"></div>
            <span className="font-semibold text-gray-700">Franchise Stores</span>
          </div>
        </div>
      </div>

      {/* Nearby Stores List */}
      {nearbyStores.length > 0 && (
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl p-8 shadow-2xl border-4 border-indigo-200">
          <h3 className="text-3xl font-black mb-6 text-gray-800">
            📍 Nearby Franchises (Within 50km)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {nearbyStores.map((store) => (
              <div key={store.id} className="bg-white p-6 rounded-2xl shadow-xl border-4 border-indigo-200 hover:border-indigo-500 transition transform hover:scale-105">
                <div className="flex items-start gap-3 mb-3">
                  <div className="text-3xl">📍</div>
                  <div>
                    <h4 className="font-black text-xl bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent mb-2">
                      {store.name}
                    </h4>
                    <p className="text-gray-600 text-sm mb-2">{store.address}</p>
                    <p className="text-indigo-600 font-bold text-sm">📞 <a href={`tel:${store.phone}`} className="hover:underline">{store.phone}</a></p>
                    <p className="text-green-600 font-bold mt-2">📍 {store.distance.toFixed(1)} km away</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All Stores List */}
      <div className="mt-8 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl p-8 shadow-2xl border-4 border-indigo-200">
        <h3 className="text-3xl font-black mb-6 text-gray-800">All Franchise Locations</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {franchiseLocations.map((store) => (
            <div key={store.id} className="bg-white p-4 rounded-xl shadow-lg border-2 border-indigo-200 hover:border-indigo-500 transition">
              <h4 className="font-black text-lg text-indigo-600 mb-1">{store.name}</h4>
              <p className="text-gray-600 text-xs mb-2">{store.address}</p>
              <a href={`tel:${store.phone}`} className="text-indigo-600 font-semibold text-sm hover:underline">
                📞 {store.phone}
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

