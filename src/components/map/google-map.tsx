"use client";

import React, { useState, useEffect, useRef } from 'react';
import { GoogleMap, MarkerF, CircleF, useJsApiLoader, useLoadScript } from '@react-google-maps/api';
import { useEnhancedWiFi } from '@/contexts/enhanced-wifi-context';
import Link from 'next/link';

// Add type declaration for window.google
declare global {
  interface Window {
    google: any;
  }
}

// Sample access point data
const sampleAccessPoints = [
  {
    id: '72:8C:52:2B:9F:7B',
    SSID: 'SkyCerda',
    MAC: '72:8C:52:2B:9F:7B',
    AuthMode: 'WPA2_PSK',
    CurrentLatitude: 30.7193718,
    CurrentLongitude: -97.3206482,
    RSSI: -89,
    Channel: 11,
    securityLevel: 'Medium',
    signalLevel: 'Poor',
    color: '#facc15'
  },
  {
    id: 'E8:D3:EB:6D:B9:86',
    SSID: 'Granger Lake Wifi',
    MAC: 'E8:D3:EB:6D:B9:86',
    AuthMode: 'WPA2_PSK',
    CurrentLatitude: 30.7194500,
    CurrentLongitude: -97.3211517,
    RSSI: -78,
    Channel: 6,
    securityLevel: 'Medium',
    signalLevel: 'Fair',
    color: '#facc15'
  },
  {
    id: 'E8:D3:EB:6D:B9:89',
    SSID: '',
    MAC: 'E8:D3:EB:6D:B9:89',
    AuthMode: 'OPEN',
    CurrentLatitude: 30.7194500,
    CurrentLongitude: -97.3211517,
    RSSI: -78,
    Channel: 6,
    securityLevel: 'None',
    signalLevel: 'Fair',
    color: '#f87171'
  },
  {
    id: 'E8:D3:EB:6D:B9:83',
    SSID: '',
    MAC: 'E8:D3:EB:6D:B9:83',
    AuthMode: 'WPA3_PSK',
    CurrentLatitude: 30.7194500,
    CurrentLongitude: -97.3211517,
    RSSI: -79,
    Channel: 6,
    securityLevel: 'High',
    signalLevel: 'Fair',
    color: '#4ade80'
  },
  {
    id: 'C8:B8:2F:33:DD:A4',
    SSID: '',
    MAC: 'C8:B8:2F:33:DD:A4',
    AuthMode: 'WPA3_PSK',
    CurrentLatitude: 30.7194500,
    CurrentLongitude: -97.3211517,
    RSSI: -81,
    Channel: 6,
    securityLevel: 'High',
    signalLevel: 'Poor',
    color: '#4ade80'
  }
];

// Calculate an estimated radius based on RSSI
const calculateSignalRadius = (rssi: number): number => {
  // Simple approximation: stronger signals have smaller radius
  // RSSI ranges from about -30 (strong) to -90 (weak)
  // Map this to a radius range of 20m to 200m
  const minRssi = -90;
  const maxRssi = -30;
  const minRadius = 20;
  const maxRadius = 200;
  
  const normalizedRssi = Math.min(Math.max(rssi, minRssi), maxRssi);
  const percentage = (normalizedRssi - minRssi) / (maxRssi - minRssi);
  const radius = maxRadius - percentage * (maxRadius - minRadius);
  
  return radius;
};

// Format a MAC address with colons
const formatMac = (mac: string): string => {
  if (mac.includes(':')) return mac;
  return mac.match(/.{1,2}/g)?.join(':') || mac;
};

interface AccessPoint {
  id: string;
  SSID: string;
  MAC: string;
  AuthMode: string;
  CurrentLatitude: number;
  CurrentLongitude: number;
  RSSI: number;
  Channel: number;
  securityLevel: string;
  signalLevel: string;
  color: string;
}

export default function GoogleMapComponent() {
  const [selectedAP, setSelectedAP] = useState<AccessPoint | null>(null);
  const [viewMode, setViewMode] = useState<'security' | 'signal'>('security');
  const [markers, setMarkers] = useState<AccessPoint[]>(sampleAccessPoints);
  const [filter, setFilter] = useState<string>('all'); // Filter: 'all', 'high', 'medium', 'low', 'none', 'excellent', 'good', 'fair', 'poor'
  const [displayedMarkers, setDisplayedMarkers] = useState<AccessPoint[]>([]);
  
  // Load Google Maps API with better error handling
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    // Using latest version
    version: 'weekly',
  });
  
  // Use the enhanced WiFi context to get real access points and more detailed info
  const { accessPoints, mapMarkers, loading, error } = useEnhancedWiFi();
  
  useEffect(() => {
    console.log("Context data:", { 
      accessPointsCount: accessPoints.length,
      mapMarkersCount: mapMarkers?.length || 0,
      loading,
      error
    });
  }, [accessPoints, mapMarkers, loading, error]);
  
  // Update markers color based on view mode
  useEffect(() => {
    try {
      // First try to use mapMarkers from context
      if (mapMarkers && mapMarkers.length > 0) {
        const updatedMapMarkers = mapMarkers.map(marker => {
          let color;
          
          if (viewMode === 'security') {
            // Color based on security level
            color = marker.securityLevel === 'High' ? '#4ade80' : 
                    marker.securityLevel === 'Medium' ? '#facc15' :
                    marker.securityLevel === 'Low' ? '#fb923c' : '#f87171';
          } else {
            // Color based on signal strength
            color = marker.signalLevel === 'Excellent' ? '#4ade80' :
                    marker.signalLevel === 'Good' ? '#facc15' :
                    marker.signalLevel === 'Fair' ? '#fb923c' : '#f87171';
          }
          
          return { ...marker, color };
        });
        
        console.log(`Showing ${updatedMapMarkers.length} access points on map from context mapMarkers`);
        setMarkers(updatedMapMarkers);
      } 
      // If mapMarkers is empty but we have accessPoints, process them
      else if (accessPoints && accessPoints.length > 0) {
        console.log(`Processing ${accessPoints.length} raw access points`);
        
        // We need to use prepareMapMarkers to convert raw AccessPoints to MarkerInfo objects
        import('@/lib/wifi-utils').then(({ prepareMapMarkers, getSecurityLevel, getSignalStrength }) => {
          const processedMarkers = prepareMapMarkers(accessPoints);
          
          // Apply colors based on view mode
          const coloredMarkers = processedMarkers.map(marker => {
            let color;
            
            if (viewMode === 'security') {
              // Color based on security level
              color = marker.securityLevel === 'High' ? '#4ade80' : 
                      marker.securityLevel === 'Medium' ? '#facc15' :
                      marker.securityLevel === 'Low' ? '#fb923c' : '#f87171';
            } else {
              // Color based on signal strength
              color = marker.signalLevel === 'Excellent' ? '#4ade80' :
                      marker.signalLevel === 'Good' ? '#facc15' :
                      marker.signalLevel === 'Fair' ? '#fb923c' : '#f87171';
            }
            
            return { ...marker, color };
          });
          
          console.log(`Showing ${coloredMarkers.length} access points on map from processed accessPoints`);
          setMarkers(coloredMarkers);
        });
      } 
      // Fall back to sample data as a last resort
      else {
        const updatedSampleMarkers = sampleAccessPoints.map(marker => {
          let color;
          
          if (viewMode === 'security') {
            // Color based on security level
            color = marker.securityLevel === 'High' ? '#4ade80' : 
                    marker.securityLevel === 'Medium' ? '#facc15' :
                    marker.securityLevel === 'Low' ? '#fb923c' : '#f87171';
          } else {
            // Color based on signal strength
            color = marker.signalLevel === 'Excellent' ? '#4ade80' :
                    marker.signalLevel === 'Good' ? '#facc15' :
                    marker.signalLevel === 'Fair' ? '#fb923c' : '#f87171';
          }
          
          return { ...marker, color };
        });
        
        console.log(`Showing ${updatedSampleMarkers.length} sample access points on map`);
        setMarkers(updatedSampleMarkers);
      }
    } catch (err) {
      console.error("Error processing markers:", err);
      // Fallback to sample data on error
      setMarkers(sampleAccessPoints);
    }
  }, [viewMode, accessPoints, mapMarkers]);
  
  // Map center state
  const [mapCenter, setMapCenter] = useState({ lat: 30.7194, lng: -97.3211 });
  
  // Apply filters to markers
  useEffect(() => {
    if (markers.length > 0) {
      let filteredMarkers = [...markers];
      
      // Apply filtering based on current filter
      if (filter !== 'all') {
        if (['high', 'medium', 'low', 'none'].includes(filter)) {
          // Security filter
          filteredMarkers = filteredMarkers.filter(marker => 
            marker.securityLevel?.toLowerCase() === filter
          );
        } else if (['excellent', 'good', 'fair', 'poor'].includes(filter)) {
          // Signal filter
          filteredMarkers = filteredMarkers.filter(marker => 
            marker.signalLevel?.toLowerCase() === filter
          );
        }
      }
      
      console.log(`Filtered markers: ${filteredMarkers.length} of ${markers.length} shown`);
      setDisplayedMarkers(filteredMarkers);
    } else {
      setDisplayedMarkers([]);
    }
  }, [markers, filter]);
  
  // Set the map center based on the available markers
  useEffect(() => {
    // Use displayed (filtered) markers if there are any, otherwise use all markers
    const sourceMarkers = displayedMarkers.length > 0 ? displayedMarkers : markers;
    
    if (sourceMarkers.length > 0) {
      // Option 1: Center on the average position of all markers
      const avgCenter = {
        lat: sourceMarkers.reduce((sum, marker) => sum + marker.CurrentLatitude, 0) / sourceMarkers.length,
        lng: sourceMarkers.reduce((sum, marker) => sum + marker.CurrentLongitude, 0) / sourceMarkers.length
      };
      
      // Option 2: Center on the strongest signal (typically closest AP)
      // Find the marker with the highest RSSI (least negative value)
      const strongestSignalMarker = [...sourceMarkers].sort((a, b) => b.RSSI - a.RSSI)[0];
      const strongestCenter = strongestSignalMarker ? {
        lat: strongestSignalMarker.CurrentLatitude,
        lng: strongestSignalMarker.CurrentLongitude
      } : avgCenter;
      
      // Use the strongest signal as the center
      console.log(`Centering map on strongest signal: ${strongestSignalMarker?.SSID || 'unnamed'} (${strongestSignalMarker?.RSSI} dBm)`);
      setMapCenter(strongestCenter);
    }
  }, [displayedMarkers, markers]);
  
  const mapContainerStyle = {
    width: '100%',
    height: '100%',
    minHeight: '400px',
    borderRadius: '8px'
  };
  
  const mapOptions = {
    disableDefaultUI: true,
    zoomControl: true,
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
        featureType: "water",
        elementType: "geometry",
        stylers: [{ color: "#17263c" }],
      }
    ]
  };
  
  const containerStyle = {
    backgroundColor: '#121212',
    padding: '20px',
    color: 'white',
    minHeight: '100vh'
  };
  
  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px'
  };
  
  const titleStyle = {
    fontSize: '24px',
    fontWeight: 'bold'
  };
  
  const buttonContainerStyle = {
    display: 'flex',
    gap: '10px'
  };
  
  const buttonStyle = {
    backgroundColor: '#2b2b2b',
    color: 'white',
    border: '1px solid #3b3b3b',
    borderRadius: '4px',
    padding: '8px 16px',
    cursor: 'pointer',
    fontSize: '14px'
  };
  
  const activeButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6'
  };
  
  const contentContainerStyle = {
    display: 'grid',
    gridTemplateColumns: '1fr 350px',
    gap: '20px',
    height: '500px',
    marginBottom: '24px'
  };
  
  const mapCardStyle = {
    backgroundColor: '#1e1e1e',
    borderRadius: '8px',
    border: '1px solid #333',
    height: '100%',
    overflow: 'hidden'
  };
  
  const infoCardStyle = {
    backgroundColor: '#1e1e1e',
    borderRadius: '8px',
    border: '1px solid #333',
    padding: '16px',
    height: '100%',
    overflowY: 'auto'
  };
  
  const infoTitleStyle = {
    fontSize: '18px',
    fontWeight: 'bold',
    marginBottom: '16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  };
  
  const infoDetailStyle = {
    marginBottom: '24px'
  };
  
  const infoRowStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '8px'
  };
  
  const infoLabelStyle = {
    color: '#aaa',
    fontSize: '14px'
  };
  
  const infoValueStyle = {
    textAlign: 'right' as const
  };
  
  const placeholderStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    textAlign: 'center',
    color: '#aaa'
  };
  
  const iconStyle = {
    fontSize: '48px',
    marginBottom: '16px'
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h2 style={titleStyle}>Access Point Map</h2>
        
        <nav style={{
          display: 'flex',
          gap: '24px',
          marginRight: 'auto',
          marginLeft: '24px'
        }}>
          <Link href="/" style={{
            color: 'white',
            textDecoration: 'none',
            padding: '4px 0',
            borderBottom: '2px solid transparent',
            transition: 'border-color 0.2s'
          }}>
            Dashboard
          </Link>
          <Link href="/map" style={{
            color: 'white',
            textDecoration: 'none',
            padding: '4px 0',
            borderBottom: '2px solid #3b82f6',
            transition: 'border-color 0.2s'
          }}>
            Map
          </Link>
          <Link href="/data" style={{
            color: 'white',
            textDecoration: 'none',
            padding: '4px 0',
            borderBottom: '2px solid transparent',
            transition: 'border-color 0.2s'
          }}>
            Data Table
          </Link>
        </nav>
        
        <div style={buttonContainerStyle}>
          <button 
            style={viewMode === 'security' ? activeButtonStyle : buttonStyle}
            onClick={() => setViewMode('security')}
          >
            Security
          </button>
          <button 
            style={viewMode === 'signal' ? activeButtonStyle : buttonStyle}
            onClick={() => setViewMode('signal')}
          >
            Signal
          </button>
          
          <div style={{ marginLeft: '20px', display: 'flex', alignItems: 'center' }}>
            <span style={{ fontSize: '14px', marginRight: '8px', color: '#aaa' }}>Filter:</span>
            <select 
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              style={{
                backgroundColor: '#2b2b2b',
                color: 'white',
                border: '1px solid #3b3b3b',
                borderRadius: '4px',
                padding: '8px 12px',
                fontSize: '14px'
              }}
            >
              <option value="all">Show All</option>
              <optgroup label="Security Level">
                <option value="high">High Security</option>
                <option value="medium">Medium Security</option>
                <option value="low">Low Security</option>
                <option value="none">No Security</option>
              </optgroup>
              <optgroup label="Signal Strength">
                <option value="excellent">Excellent Signal</option>
                <option value="good">Good Signal</option>
                <option value="fair">Fair Signal</option>
                <option value="poor">Poor Signal</option>
              </optgroup>
            </select>
          </div>
          
          <button 
            style={{
              ...buttonStyle,
              backgroundColor: '#3b82f6',
              marginLeft: '10px'
            }}
            onClick={() => {
              // Re-center map on strongest AP
              const sourceMarkers = displayedMarkers.length > 0 ? displayedMarkers : markers;
              if (sourceMarkers.length > 0) {
                const strongestSignalMarker = [...sourceMarkers].sort((a, b) => b.RSSI - a.RSSI)[0];
                setMapCenter({
                  lat: strongestSignalMarker.CurrentLatitude,
                  lng: strongestSignalMarker.CurrentLongitude
                });
              }
            }}
          >
            Center Map
          </button>
        </div>
      </div>
      
      <div style={contentContainerStyle}>
        <div style={mapCardStyle}>
          {loadError && (
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              height: '100%',
              color: '#f87171',
              flexDirection: 'column',
              textAlign: 'center',
              padding: '20px'
            }}>
              <div style={{ fontSize: '24px', marginBottom: '20px' }}>🗺️</div>
              <h3 style={{ marginBottom: '10px' }}>Google Maps Error</h3>
              <p>Could not load Google Maps API: {loadError.message}</p>
              <p style={{ marginTop: '20px', fontSize: '14px', color: '#aaa' }}>
                Please check API key and enabled services in Google Cloud Console
              </p>
            </div>
          )}
          
          {!loadError && !isLoaded && (
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              height: '100%',
              color: '#aaa'
            }}>
              Loading Maps...
            </div>
          )}
          
          {!loadError && isLoaded && (
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={mapCenter}
              zoom={16}
              options={mapOptions}
            >
              {displayedMarkers.length > 0 ? displayedMarkers.map(marker => (
                <React.Fragment key={marker.id}>
                  <MarkerF
                    position={{ lat: marker.CurrentLatitude, lng: marker.CurrentLongitude }}
                    onClick={() => setSelectedAP(marker)}
                    icon={{
                      path: window.google.maps.SymbolPath.CIRCLE,
                      fillColor: marker.color,
                      fillOpacity: 0.8,
                      strokeWeight: 1,
                      strokeColor: "#ffffff",
                      scale: 8,
                    }}
                  />
                  <CircleF
                    center={{ lat: marker.CurrentLatitude, lng: marker.CurrentLongitude }}
                    radius={calculateSignalRadius(marker.RSSI)}
                    options={{
                      fillColor: marker.color,
                      fillOpacity: 0.1,
                      strokeWeight: 1,
                      strokeColor: marker.color,
                      strokeOpacity: 0.5
                    }}
                  />
                </React.Fragment>
              )) : (
                // If no markers match the filter, fall back to showing all markers
                markers.map(marker => (
                  <React.Fragment key={marker.id}>
                    <MarkerF
                      position={{ lat: marker.CurrentLatitude, lng: marker.CurrentLongitude }}
                      onClick={() => setSelectedAP(marker)}
                      icon={{
                        path: window.google.maps.SymbolPath.CIRCLE,
                        fillColor: marker.color,
                        fillOpacity: 0.5, // Less opacity for filtered out markers
                        strokeWeight: 1,
                        strokeColor: "#ffffff",
                        scale: 8,
                      }}
                    />
                  </React.Fragment>
                ))
              )}
            </GoogleMap>
          )}
        </div>
        
        <div style={infoCardStyle}>
          {selectedAP ? (
            <div>
              <div style={infoTitleStyle}>
                <span>{selectedAP.SSID || <em style={{ color: '#aaa' }}>unnamed</em>}</span>
                <button 
                  style={{ 
                    border: 'none', 
                    background: 'none', 
                    color: '#aaa', 
                    cursor: 'pointer',
                    fontSize: '18px' 
                  }}
                  onClick={() => setSelectedAP(null)}
                >
                  ×
                </button>
              </div>
              
              <div style={infoDetailStyle}>
                <div style={infoRowStyle}>
                  <span style={infoLabelStyle}>MAC Address</span>
                  <span style={{ ...infoValueStyle, fontFamily: 'monospace' }}>{formatMac(selectedAP.MAC)}</span>
                </div>
                
                <div style={infoRowStyle}>
                  <span style={infoLabelStyle}>Security</span>
                  <span style={infoValueStyle}>{selectedAP.AuthMode}</span>
                </div>
                
                <div style={infoRowStyle}>
                  <span style={infoLabelStyle}>Channel</span>
                  <span style={infoValueStyle}>{selectedAP.Channel}</span>
                </div>
                
                <div style={infoRowStyle}>
                  <span style={infoLabelStyle}>Signal Strength</span>
                  <span style={infoValueStyle}>{selectedAP.RSSI} dBm</span>
                </div>
                
                <div style={infoRowStyle}>
                  <span style={infoLabelStyle}>Latitude</span>
                  <span style={{ ...infoValueStyle, fontFamily: 'monospace' }}>{selectedAP.CurrentLatitude.toFixed(6)}</span>
                </div>
                
                <div style={infoRowStyle}>
                  <span style={infoLabelStyle}>Longitude</span>
                  <span style={{ ...infoValueStyle, fontFamily: 'monospace' }}>{selectedAP.CurrentLongitude.toFixed(6)}</span>
                </div>
                
                <div style={{marginTop: '16px'}}>
                  <a 
                    href={`https://www.google.com/maps/search/?api=1&query=${selectedAP.CurrentLatitude},${selectedAP.CurrentLongitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-block',
                      backgroundColor: '#3b82f6',
                      color: 'white',
                      textDecoration: 'none',
                      padding: '8px 12px',
                      borderRadius: '4px',
                      fontSize: '14px',
                      textAlign: 'center'
                    }}
                  >
                    Open in Google Maps
                  </a>
                </div>
              </div>
            </div>
          ) : (
            <div style={placeholderStyle}>
              <div style={iconStyle}>📍</div>
              <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>Select an Access Point</h3>
              <p>Click on a marker on the map to view details</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Data Table Section */}
      <div style={{
        backgroundColor: '#1e1e1e',
        borderRadius: '8px',
        border: '1px solid #333',
        marginTop: '16px',
        overflow: 'hidden'
      }}>
        <div style={{
          padding: '16px',
          borderBottom: '1px solid #333',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h3 style={{ margin: 0, fontSize: '18px' }}>
            Access Points {filter !== 'all' ? `(Filtered: ${filter})` : ''}
          </h3>
          <div style={{ color: '#aaa', fontSize: '14px' }}>
            Showing {displayedMarkers.length} of {markers.length} access points
          </div>
        </div>
        
        <div style={{ overflowX: 'auto' }}>
          <table style={{ 
            width: '100%', 
            borderCollapse: 'collapse' as const,
            fontSize: '14px'
          }}>
            <thead>
              <tr style={{ backgroundColor: '#2b2b2b' }}>
                <th style={{ 
                  padding: '12px 16px', 
                  textAlign: 'left' as const, 
                  borderBottom: '1px solid #333' 
                }}>
                  Network Name
                </th>
                <th style={{ 
                  padding: '12px 16px', 
                  textAlign: 'left' as const, 
                  borderBottom: '1px solid #333' 
                }}>
                  MAC Address
                </th>
                <th style={{ 
                  padding: '12px 16px', 
                  textAlign: 'left' as const, 
                  borderBottom: '1px solid #333' 
                }}>
                  Security
                </th>
                <th style={{ 
                  padding: '12px 16px', 
                  textAlign: 'center' as const, 
                  borderBottom: '1px solid #333' 
                }}>
                  Channel
                </th>
                <th style={{ 
                  padding: '12px 16px', 
                  textAlign: 'right' as const, 
                  borderBottom: '1px solid #333' 
                }}>
                  Signal
                </th>
                <th style={{ 
                  padding: '12px 16px', 
                  textAlign: 'right' as const, 
                  borderBottom: '1px solid #333' 
                }}>
                  Location
                </th>
              </tr>
            </thead>
            <tbody>
              {displayedMarkers.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ 
                    padding: '24px', 
                    textAlign: 'center' as const, 
                    color: '#aaa' 
                  }}>
                    No access points match the current filter.
                  </td>
                </tr>
              ) : (
                displayedMarkers.map(ap => (
                  <tr 
                    key={`table-${ap.id}`}
                    style={{ 
                      borderBottom: '1px solid #333',
                      backgroundColor: selectedAP?.id === ap.id ? '#3b3b3b' : '#1e1e1e',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#2b2b2b';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = selectedAP?.id === ap.id ? '#3b3b3b' : '#1e1e1e';
                    }}
                  >
                    <td style={{ 
                      padding: '12px 16px',
                      cursor: 'pointer'
                    }}>
                      <div 
                        style={{ 
                          display: 'flex', 
                          alignItems: 'center',
                          gap: '8px'
                        }}
                        onClick={() => {
                          // Center the map on this access point
                          setMapCenter({
                            lat: ap.CurrentLatitude,
                            lng: ap.CurrentLongitude
                          });
                          // Select this access point
                          setSelectedAP(ap);
                        }}
                      >
                        {ap.securityLevel === 'None' ? (
                          <span style={{ color: '#f87171' }}>●</span>
                        ) : ap.securityLevel === 'Low' ? (
                          <span style={{ color: '#fb923c' }}>●</span>
                        ) : ap.securityLevel === 'Medium' ? (
                          <span style={{ color: '#facc15' }}>●</span>
                        ) : (
                          <span style={{ color: '#4ade80' }}>●</span>
                        )}
                        <span style={{ 
                          color: selectedAP?.id === ap.id ? '#3b82f6' : 'white',
                          textDecoration: 'underline',
                          fontWeight: selectedAP?.id === ap.id ? 'bold' : 'normal'
                        }}>
                          {ap.SSID || <em style={{ color: '#aaa' }}>unnamed</em>}
                        </span>
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px', fontFamily: 'monospace' }}>
                      {ap.MAC}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      {ap.AuthMode}
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'center' as const }}>
                      {ap.Channel}
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'right' as const }}>
                      {ap.RSSI} dBm
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'right' as const, fontFamily: 'monospace' }}>
                      <a 
                        href={`https://www.google.com/maps/search/?api=1&query=${ap.CurrentLatitude},${ap.CurrentLongitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          color: '#3b82f6',
                          textDecoration: 'none'
                        }}
                      >
                        {ap.CurrentLatitude.toFixed(6)}, {ap.CurrentLongitude.toFixed(6)}
                      </a>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}