"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AccessPoint, MarkerInfo } from '@/types';
import { 
  prepareMapMarkers,
  getAuthModeDistribution,
  getChannelDistribution,
  getSecurityDistribution,
  getSignalDistribution,
  getNetworkStats
} from '@/lib/wifi-utils';
import { loadSampleWiFiData, handleFileUpload, parseUserWiFiData } from '@/services/wifi-data-service';

interface WiFiContextType {
  accessPoints: AccessPoint[];
  mapMarkers: MarkerInfo[];
  loading: boolean;
  error: string | null;
  stats: ReturnType<typeof getNetworkStats>;
  authModeDistribution: ReturnType<typeof getAuthModeDistribution>;
  channelDistribution: ReturnType<typeof getChannelDistribution>;
  securityDistribution: ReturnType<typeof getSecurityDistribution>;
  signalDistribution: ReturnType<typeof getSignalDistribution>;
  loadWiFiData: (data: string) => void;
  uploadFile: (file: File) => Promise<void>;
  selectedMarker: MarkerInfo | null;
  setSelectedMarker: React.Dispatch<React.SetStateAction<MarkerInfo | null>>;
  viewMode: 'security' | 'signal';
  setViewMode: React.Dispatch<React.SetStateAction<'security' | 'signal'>>;
  reloadSampleData: () => Promise<void>;
}

const WiFiContext = createContext<WiFiContextType | undefined>(undefined);

export function EnhancedWiFiProvider({ children }: { children: ReactNode }) {
  const [accessPoints, setAccessPoints] = useState<AccessPoint[]>([]);
  const [mapMarkers, setMapMarkers] = useState<MarkerInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMarker, setSelectedMarker] = useState<MarkerInfo | null>(null);
  const [viewMode, setViewMode] = useState<'security' | 'signal'>('security');
  
  // Computed stats
  const stats = getNetworkStats(accessPoints);
  const authModeDistribution = getAuthModeDistribution(accessPoints);
  const channelDistribution = getChannelDistribution(accessPoints);
  const securityDistribution = getSecurityDistribution(accessPoints);
  const signalDistribution = getSignalDistribution(accessPoints);
  
  // Initialize with empty state instead of loading sample data
  useEffect(() => {
    // Set loading to false as we're not loading any data initially
    setLoading(false);
  }, []);
  
  // Recalculate markers when access points or view mode changes
  useEffect(() => {
    const markers = prepareMapMarkers(accessPoints);
    
    // Update colors based on view mode
    if (viewMode === 'signal') {
      markers.forEach(marker => {
        marker.color = 
          marker.signalLevel === 'Excellent' ? '#4ade80' :
          marker.signalLevel === 'Good' ? '#facc15' :
          marker.signalLevel === 'Fair' ? '#fb923c' : '#f87171';
      });
    }
    
    setMapMarkers(markers);
  }, [accessPoints, viewMode]);
  
  // Function to load WiFi data from string
  const loadWiFiData = (data: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // Use the parseUserWiFiData function from service
      const parsedData = parseUserWiFiData(data);
      setAccessPoints(parsedData);
    } catch (err) {
      console.error('Error parsing WiFi data:', err);
      setError('Failed to parse WiFi data');
    } finally {
      setLoading(false);
    }
  };
  
  // Function to handle file upload
  const uploadFile = async (file: File) => {
    setLoading(true);
    setError(null);
    
    try {
      const parsedData = await handleFileUpload(file);
      setAccessPoints(parsedData);
    } catch (err) {
      console.error('Error uploading file:', err);
      setError('Failed to upload and parse file');
    } finally {
      setLoading(false);
    }
  };
  
  // Function to reload sample data
  const reloadSampleData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await loadSampleWiFiData(true); // Force reload
      setAccessPoints(data);
    } catch (err) {
      console.error('Error reloading sample data:', err);
      setError('Failed to reload sample data');
    } finally {
      setLoading(false);
    }
  };
  
  const value = {
    accessPoints,
    mapMarkers,
    loading,
    error,
    stats,
    authModeDistribution,
    channelDistribution,
    securityDistribution,
    signalDistribution,
    loadWiFiData,
    uploadFile,
    selectedMarker,
    setSelectedMarker,
    viewMode,
    setViewMode,
    reloadSampleData
  };
  
  return <WiFiContext.Provider value={value}>{children}</WiFiContext.Provider>;
}

export const useEnhancedWiFi = () => {
  const context = useContext(WiFiContext);
  
  // Return a default empty context if provider is missing
  // This prevents the app from crashing but will show empty data
  if (context === undefined) {
    console.error('Warning: useEnhancedWiFi hook used outside of EnhancedWiFiProvider. Using fallback data.');
    
    // Return a default context with empty data
    return {
      accessPoints: [],
      mapMarkers: [],
      loading: false,
      error: "Context provider missing",
      stats: {
        totalNetworks: 0,
        uniqueNetworkCount: 0,
        openNetworkCount: 0,
        openNetworkPercentage: "0",
        mostCommonChannel: 0,
        avgSignalStrength: "0"
      },
      authModeDistribution: [],
      channelDistribution: [],
      securityDistribution: [],
      signalDistribution: [],
      loadWiFiData: () => {},
      uploadFile: async () => {},
      selectedMarker: null,
      setSelectedMarker: () => {},
      viewMode: 'security',
      setViewMode: () => {},
      reloadSampleData: async () => {}
    } as WiFiContextType;
  }
  
  return context;
};