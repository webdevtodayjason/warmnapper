"use client";

import { useState, useEffect } from 'react';
import GoogleMapComponent from '@/components/map/google-map';
import MapError from '@/components/map/map-error';

export default function MapPage() {
  const [hasError, setHasError] = useState(false);

  // Listen for Google Maps errors
  useEffect(() => {
    const handleGoogleMapsError = (e: ErrorEvent) => {
      if (e.message && (
        e.message.includes('Google Maps JavaScript API') || 
        e.message.includes('google is not defined') ||
        e.message.includes('maps') ||
        e.message.includes('ApiNotActivatedMapError')
      )) {
        setHasError(true);
      }
    };

    // Add error listener for window errors
    window.addEventListener('error', handleGoogleMapsError);

    // Also capture console errors for Maps API issues
    const originalConsoleError = console.error;
    console.error = function(...args) {
      const errorMessage = args.join(' ');
      if (
        errorMessage.includes('Google Maps JavaScript API error') || 
        errorMessage.includes('ApiNotActivatedMapError')
      ) {
        setHasError(true);
      }
      originalConsoleError.apply(console, args);
    };

    return () => {
      // Cleanup
      window.removeEventListener('error', handleGoogleMapsError);
      console.error = originalConsoleError;
    };
  }, []);
  
  if (hasError) {
    return <MapError />;
  }

  return <GoogleMapComponent />;
}