"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AccessPoint, MarkerInfo } from '@/types';
import { 
  parseWigleWifiData, 
  prepareMapMarkers,
  getAuthModeDistribution,
  getChannelDistribution,
  getSecurityDistribution,
  getSignalDistribution,
  getNetworkStats
} from '@/lib/wifi-utils';

// Updated path for sample data in the T3 Stack structure
// This is a major change you'll need to make
const sampleDataPath = '/data/sample-data.txt';

interface WiFiContextType {
  accessPoints: AccessPoint[];
  mapMarkers: MarkerInfo[];
  loading: boolean;
  stats: {
    totalNetworks: number;
    uniqueNetworkCount: number;
    openNetworkCount: number;
    openNetworkPercentage: string;
    mostCommonChannel: number;
    avgSignalStrength: string;
  };
  authModeDistribution: ReturnType<typeof getAuthModeDistribution>;
  channelDistribution: ReturnType<typeof getChannelDistribution>;
  securityDistribution: ReturnType<typeof getSecurityDistribution>;
  signalDistribution: ReturnType<typeof getSignalDistribution>;
  loadWiFiData: (data: string) => void;
  selectedMarker: MarkerInfo | null;
  setSelectedMarker: React.Dispatch<React.SetStateAction<MarkerInfo | null>>;
  viewMode: 'security' | 'signal';
  setViewMode: React.Dispatch<React.SetStateAction<'security' | 'signal'>>;
}

const WiFiContext = createContext<WiFiContextType | undefined>(undefined);

export function WiFiProvider({ children }: { children: ReactNode }) {
  const [accessPoints, setAccessPoints] = useState<AccessPoint[]>([]);
  const [mapMarkers, setMapMarkers] = useState<MarkerInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMarker, setSelectedMarker] = useState<MarkerInfo | null>(null);
  const [viewMode, setViewMode] = useState<'security' | 'signal'>('security');
  
  // Computed stats
  const stats = getNetworkStats(accessPoints);
  const authModeDistribution = getAuthModeDistribution(accessPoints);
  const channelDistribution = getChannelDistribution(accessPoints);
  const securityDistribution = getSecurityDistribution(accessPoints);
  const signalDistribution = getSignalDistribution(accessPoints);
  
  // Default data in case loading fails
  const defaultData = `WigleWifi-1.4,appRelease=v1.4.1,model=ESP32 Marauder,release=v1.4.1,device=ESP32 Marauder,display=SPI TFT,board=ESP32 Marauder,brand=JustCallMeKoko
MAC,SSID,AuthMode,FirstSeen,Channel,RSSI,CurrentLatitude,CurrentLongitude,AltitudeMeters,AccuracyMeters,Type
72:8C:52:2B:9F:7B,SkyCerda,[WPA2_PSK],2025-5-6 11:14:51,11,-89,30.7193718,-97.3206482,144.50,1.50,WIFI
72:8C:52:6B:9F:7B,,[WPA2_PSK],2025-5-6 11:14:51,11,-89,30.7193718,-97.3206482,144.50,1.50,WIFI
E8:D3:EB:6D:B9:86,Granger Lake Wifi,[WPA2_PSK],2025-5-6 11:14:59,6,-78,30.7194500,-97.3211517,144.50,1.50,WIFI
E8:D3:EB:6D:B9:89,,[OPEN],2025-5-6 11:14:59,6,-78,30.7194500,-97.3211517,144.50,1.50,WIFI
E8:D3:EB:6D:B9:83,,[WPA3_PSK],2025-5-6 11:14:59,6,-79,30.7194500,-97.3211517,144.50,1.50,WIFI
C8:B8:2F:33:DD:A4,,[WPA3_PSK],2025-5-6 11:14:59,6,-81,30.7194500,-97.3211517,144.50,1.50,WIFI
C8:B8:2F:33:DD:A6,Granger Lake Wifi,[WPA2_PSK],2025-5-6 11:14:59,6,-82,30.7194500,-97.3211517,144.50,1.50,WIFI
C8:B8:2F:33:DD:A8,,[OPEN],2025-5-6 11:14:59,6,-82,30.7194500,-97.3211517,144.50,1.50,WIFI`;

  // Updated to fetch sample data from public directory
  useEffect(() => {
    async function fetchSampleData() {
      try {
        console.log('Fetching sample data from:', sampleDataPath);
        const response = await fetch(sampleDataPath);
        
        if (!response.ok) {
          throw new Error(`Failed to load data: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.text();
        if (data && data.length > 0) {
          console.log('Successfully loaded sample data, length:', data.length);
          loadWiFiData(data);
        } else {
          console.error('Empty sample data received');
          loadWiFiData(defaultData);
        }
      } catch (error) {
        console.error('Error loading sample data:', error);
        // Load default data if fetch fails
        console.log('Loading default sample data');
        loadWiFiData(defaultData);
      }
    }
    
    fetchSampleData();
  }, []);
  
  // Recalculate markers when access points or view mode changes
  useEffect(() => {
    const markers = prepareMapMarkers(accessPoints);
    
    // Update colors based on view mode
    if (viewMode === 'signal') {
      markers.forEach(marker => {
        marker.color = marker.signalLevel === 'Excellent' ? '#4ade80' :
                       marker.signalLevel === 'Good' ? '#facc15' :
                       marker.signalLevel === 'Fair' ? '#fb923c' : '#f87171';
      });
    }
    
    setMapMarkers(markers);
  }, [accessPoints, viewMode]);
  
  const loadWiFiData = (data: string) => {
    setLoading(true);
    try {
      const parsedData = parseWigleWifiData(data);
      setAccessPoints(parsedData);
    } catch (error) {
      console.error('Error parsing WiFi data:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const value = {
    accessPoints,
    mapMarkers,
    loading,
    stats,
    authModeDistribution,
    channelDistribution,
    securityDistribution,
    signalDistribution,
    loadWiFiData,
    selectedMarker,
    setSelectedMarker,
    viewMode,
    setViewMode
  };
  
  return <WiFiContext.Provider value={value}>{children}</WiFiContext.Provider>;
}

export const useWiFi = () => {
  const context = useContext(WiFiContext);
  if (context === undefined) {
    throw new Error('useWiFi must be used within a WiFiProvider');
  }
  return context;
};