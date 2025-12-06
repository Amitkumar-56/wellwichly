'use client';

import { useEffect, useRef } from 'react';

export default function FranchiseMap() {
  const mapRef = useRef(null);

  useEffect(() => {
    // Sample franchise locations
    const locations = [
      { name: 'Wellwichly Patna', lat: 25.5941, lng: 85.1376, address: '123 Main Street, Patna' },
      { name: 'Wellwichly Delhi', lat: 28.6139, lng: 77.2090, address: '456 Market Road, Delhi' },
      { name: 'Wellwichly Mumbai', lat: 19.0760, lng: 72.8777, address: '789 Food Court, Mumbai' },
      { name: 'Wellwichly Bangalore', lat: 12.9716, lng: 77.5946, address: '321 Tech Park, Bangalore' },
      { name: 'Wellwichly Kolkata', lat: 22.5726, lng: 88.3639, address: '654 Park Street, Kolkata' },
    ];

    // Initialize map (using Google Maps API)
    if (window.google && window.google.maps) {
      const map = new window.google.maps.Map(mapRef.current, {
        zoom: 5,
        center: { lat: 23.0225, lng: 72.5714 }, // Center of India
        mapTypeId: 'roadmap',
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          }
        ]
      });

      // Add markers for each location
      locations.forEach((location) => {
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
            <div style="padding: 10px;">
              <h3 style="font-weight: bold; margin-bottom: 5px; color: #6366F1;">${location.name}</h3>
              <p style="margin: 0; color: #666;">${location.address}</p>
            </div>
          `
        });

        marker.addListener('click', () => {
          infoWindow.open(map, marker);
        });
      });
    } else {
      // Fallback: Show static map with markers
      console.log('Google Maps API not loaded. Using fallback.');
    }
  }, []);

  return (
    <div className="w-full h-96 rounded-2xl overflow-hidden shadow-2xl border-4 border-indigo-200">
      <div ref={mapRef} className="w-full h-full">
        {/* Fallback if Google Maps not loaded */}
        <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center relative">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative z-10 text-center text-white">
            <div className="text-6xl mb-4">🗺️</div>
            <p className="text-2xl font-bold mb-2">Franchise Locations Map</p>
            <p className="text-lg">Red markers show our store locations</p>
            <p className="text-sm mt-4 opacity-75">
              To enable interactive map, add Google Maps API key
            </p>
          </div>
          
          {/* Sample Red Markers */}
          <div className="absolute top-1/4 left-1/4 w-10 h-10 bg-red-600 rounded-full border-4 border-white shadow-2xl animate-pulse"></div>
          <div className="absolute top-1/3 right-1/3 w-10 h-10 bg-red-600 rounded-full border-4 border-white shadow-2xl animate-pulse"></div>
          <div className="absolute bottom-1/3 left-1/3 w-10 h-10 bg-red-600 rounded-full border-4 border-white shadow-2xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-10 h-10 bg-red-600 rounded-full border-4 border-white shadow-2xl animate-pulse"></div>
          <div className="absolute top-1/2 left-1/2 w-10 h-10 bg-red-600 rounded-full border-4 border-white shadow-2xl animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}

