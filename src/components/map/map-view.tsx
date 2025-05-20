"use client";

import { useRef, useEffect, useState } from "react";
import { useWiFi } from "@/contexts/wifi-context";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { WifiOff, Wifi, Shield, Activity, MapPin } from "lucide-react";
import { getAuthModeDescription, formatMac, formatSignalStrength, calculateSignalRadius } from "@/lib/utils";

// Define a type for the Google Maps API
declare global {
  interface Window {
    google: any;
    initMap: () => void;
  }
}

export function MapView() {
  const { mapMarkers, selectedMarker, setSelectedMarker, viewMode, setViewMode } = useWiFi();
  const mapRef = useRef<HTMLDivElement>(null);
  const [googleMap, setGoogleMap] = useState<any>(null);
  const [googleMarkers, setGoogleMarkers] = useState<any[]>([]);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Calculate center of all markers
  const calculateCenter = () => {
    if (mapMarkers.length === 0) return { lat: 0, lng: 0 };
    
    const total = mapMarkers.reduce((acc, marker) => {
      return {
        lat: acc.lat + marker.CurrentLatitude,
        lng: acc.lng + marker.CurrentLongitude,
      };
    }, { lat: 0, lng: 0 });
    
    return {
      lat: total.lat / mapMarkers.length,
      lng: total.lng / mapMarkers.length,
    };
  };

  // Function to load Google Maps script
  const loadGoogleMapsScript = () => {
    if (window.google && window.google.maps) {
      initMap();
      return;
    }

    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initMap`;
    script.async = true;
    script.defer = true;
    
    window.initMap = initMap;
    document.head.appendChild(script);
  };

  // Initialize the map
  const initMap = () => {
    if (!mapRef.current) return;
    
    const center = calculateCenter();
    const map = new window.google.maps.Map(mapRef.current, {
      center,
      zoom: 15,
      styles: [
        { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
        { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
        { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
        {
          featureType: "administrative.locality",
          elementType: "labels.text.fill",
          stylers: [{ color: "#d59563" }],
        },
        {
          featureType: "poi",
          elementType: "labels.text.fill",
          stylers: [{ color: "#d59563" }],
        },
        {
          featureType: "poi.park",
          elementType: "geometry",
          stylers: [{ color: "#263c3f" }],
        },
        {
          featureType: "poi.park",
          elementType: "labels.text.fill",
          stylers: [{ color: "#6b9a76" }],
        },
        {
          featureType: "road",
          elementType: "geometry",
          stylers: [{ color: "#38414e" }],
        },
        {
          featureType: "road",
          elementType: "geometry.stroke",
          stylers: [{ color: "#212a37" }],
        },
        {
          featureType: "road",
          elementType: "labels.text.fill",
          stylers: [{ color: "#9ca5b3" }],
        },
        {
          featureType: "road.highway",
          elementType: "geometry",
          stylers: [{ color: "#746855" }],
        },
        {
          featureType: "road.highway",
          elementType: "geometry.stroke",
          stylers: [{ color: "#1f2835" }],
        },
        {
          featureType: "road.highway",
          elementType: "labels.text.fill",
          stylers: [{ color: "#f3d19c" }],
        },
        {
          featureType: "transit",
          elementType: "geometry",
          stylers: [{ color: "#2f3948" }],
        },
        {
          featureType: "transit.station",
          elementType: "labels.text.fill",
          stylers: [{ color: "#d59563" }],
        },
        {
          featureType: "water",
          elementType: "geometry",
          stylers: [{ color: "#17263c" }],
        },
        {
          featureType: "water",
          elementType: "labels.text.fill",
          stylers: [{ color: "#515c6d" }],
        },
        {
          featureType: "water",
          elementType: "labels.text.stroke",
          stylers: [{ color: "#17263c" }],
        },
      ],
    });
    
    setGoogleMap(map);
    setMapLoaded(true);
  };

  // Load Google Maps script when component mounts
  useEffect(() => {
    loadGoogleMapsScript();
  }, []);

  // Update markers when mapMarkers or googleMap changes
  useEffect(() => {
    if (!googleMap || !mapLoaded) return;
    
    // Clear existing markers
    googleMarkers.forEach(marker => marker.setMap(null));
    
    // Create new markers
    const newMarkers = mapMarkers.map(marker => {
      const position = {
        lat: marker.CurrentLatitude,
        lng: marker.CurrentLongitude,
      };
      
      // Create marker
      const googleMarker = new window.google.maps.Marker({
        position,
        map: googleMap,
        title: marker.SSID || "Unknown",
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          fillColor: marker.color,
          fillOpacity: 0.8,
          strokeWeight: 1,
          strokeColor: "#ffffff",
          scale: 8,
        },
      });
      
      // Create signal strength circle
      const circle = new window.google.maps.Circle({
        map: googleMap,
        center: position,
        radius: calculateSignalRadius(marker.RSSI), // Radius in meters
        fillColor: marker.color,
        fillOpacity: 0.1,
        strokeWeight: 1,
        strokeColor: marker.color,
        strokeOpacity: 0.5,
      });
      
      // Add click event
      googleMarker.addListener("click", () => {
        setSelectedMarker(marker);
      });
      
      return { marker: googleMarker, circle };
    });
    
    setGoogleMarkers(newMarkers);
    
    // Set bounds to fit all markers
    if (newMarkers.length > 0) {
      const bounds = new window.google.maps.LatLngBounds();
      newMarkers.forEach(({ marker }) => {
        bounds.extend(marker.getPosition());
      });
      googleMap.fitBounds(bounds);
    }
  }, [mapMarkers, googleMap, mapLoaded, viewMode]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">
          Access Point Map
        </h2>
        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === "security" ? "default" : "outline"}
            onClick={() => setViewMode("security")}
            size="sm"
          >
            <Shield className="mr-2 h-4 w-4" />
            Security
          </Button>
          <Button
            variant={viewMode === "signal" ? "default" : "outline"}
            onClick={() => setViewMode("signal")}
            size="sm"
          >
            <Activity className="mr-2 h-4 w-4" />
            Signal
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-1">
              <div ref={mapRef} className="map-container" />
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card className="h-full">
            <CardContent className="p-4">
              {selectedMarker ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">
                      {selectedMarker.SSID || <span className="text-muted-foreground italic">unnamed</span>}
                    </h3>
                    <Button variant="ghost" size="sm" onClick={() => setSelectedMarker(null)}>
                      ×
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">MAC Address</span>
                      <span className="font-mono">{formatMac(selectedMarker.MAC)}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Security</span>
                      <span>{getAuthModeDescription(selectedMarker.AuthMode)}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Channel</span>
                      <span>{selectedMarker.Channel}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Signal Strength</span>
                      <span>{formatSignalStrength(selectedMarker.RSSI)}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">First Seen</span>
                      <span>{selectedMarker.FirstSeen}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Latitude</span>
                      <span className="font-mono">{selectedMarker.CurrentLatitude.toFixed(6)}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Longitude</span>
                      <span className="font-mono">{selectedMarker.CurrentLongitude.toFixed(6)}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-4">
                  <MapPin className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold">Select an Access Point</h3>
                  <p className="text-muted-foreground">Click on a marker on the map to view details</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}