"use client";

import { useEffect, useState } from 'react';
import { useEnhancedWiFi } from '@/contexts/enhanced-wifi-context';
import { EnhancedHeader } from '@/components/dashboard/enhanced-header';
import { AuthTypesPieChart, ChannelBarChart, SecurityPieChart, SignalPieChart } from '@/components/charts/dashboard-charts';
import { Wifi, Radio, ShieldOff, Activity } from 'lucide-react';
import { DropZone } from '@/components/ui/drop-zone';

export default function DashboardPage() {
  const { 
    stats, 
    loading, 
    error,
    loadWiFiData
  } = useEnhancedWiFi();
  
  const [hasSharedData, setHasSharedData] = useState(false);

  useEffect(() => {
    // Check if there are any shared records
    const checkSharedData = async () => {
      try {
        const response = await fetch('/api/access-points', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        });
        
        if (!response.ok) {
          console.error('Failed to fetch shared data');
          return;
        }
        
        const data = await response.json();
        
        if (data.success && data.data && data.data.length > 0) {
          setHasSharedData(true);
          
          // Load the data into the context
          const accessPoints = data.data.map(ap => ({
            MAC: ap.MAC,
            SSID: ap.SSID,
            AuthMode: ap.AuthMode,
            FirstSeen: ap.FirstSeen,
            Channel: ap.Channel,
            RSSI: ap.RSSI,
            CurrentLatitude: ap.CurrentLatitude,
            CurrentLongitude: ap.CurrentLongitude,
            AltitudeMeters: ap.AltitudeMeters,
            AccuracyMeters: ap.AccuracyMeters,
            Type: ap.Type
          }));
          
          // Create a Wigle WiFi compatible string
          const header = "WigleWifi-1.4,appRelease=v1.4.1,model=ESP32 Marauder,release=v1.4.1,device=ESP32 Marauder,display=SPI TFT,board=ESP32 Marauder,brand=JustCallMeKoko";
          const columns = "MAC,SSID,AuthMode,FirstSeen,Channel,RSSI,CurrentLatitude,CurrentLongitude,AltitudeMeters,AccuracyMeters,Type";
          
          const rows = accessPoints.map(ap => {
            return `${ap.MAC},${ap.SSID},[${ap.AuthMode}],${ap.FirstSeen},${ap.Channel},${ap.RSSI},${ap.CurrentLatitude},${ap.CurrentLongitude},${ap.AltitudeMeters},${ap.AccuracyMeters},${ap.Type}`;
          }).join('\n');
          
          const wigleData = `${header}\n${columns}\n${rows}`;
          loadWiFiData(wigleData);
        }
      } catch (error) {
        console.error("Error checking shared data:", error);
      }
    };
    
    checkSharedData();
  }, [loadWiFiData]);
  
  // Handle file upload with sharing options
  const handleFileUpload = async (file: File, shareData?: { city: string; state: string; uploadedBy?: string }) => {
    try {
      const fileContent = await file.text();
      
      // Load the data into the context for immediate display
      loadWiFiData(fileContent);
      
      // If shareData is provided, send to API
      if (shareData) {
        try {
          console.log('Sharing data:', { wifiData: fileContent, shareInfo: shareData });
          
          const response = await fetch('/api/access-points', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              wifiData: fileContent,
              shareInfo: shareData
            })
          });
          
          if (!response.ok) {
            throw new Error(`Failed to share data: ${response.status} ${response.statusText}`);
          }
          
          const result = await response.json();
          console.log('Shared WiFi data result:', result);
        } catch (error) {
          console.error('Error sharing WiFi data:', error);
        }
      }
    } catch (error) {
      console.error('Error processing file:', error);
    }
  };

  const containerStyle = {
    padding: '20px',
    backgroundColor: '#121212',
    minHeight: '100vh',
    color: 'white'
  };
  
  const loaderStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '200px',
    fontSize: '18px',
    color: '#aaa'
  };
  
  const errorStyle = {
    padding: '16px',
    backgroundColor: '#f87171',
    color: 'white',
    borderRadius: '4px',
    marginBottom: '20px'
  };
  
  const cardContainerStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '16px',
    marginBottom: '24px'
  };
  
  const cardStyle = {
    backgroundColor: '#1e1e1e',
    borderRadius: '8px',
    border: '1px solid #333',
    padding: '16px',
    color: 'white',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
  };
  
  const cardHeaderStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    paddingBottom: '12px',
    borderBottom: '1px solid #333',
    marginBottom: '12px'
  };
  
  const cardTitleStyle = {
    fontSize: '14px',
    fontWeight: 'bold',
    margin: 0
  };
  
  const statValueStyle = {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '4px'
  };
  
  const statDescStyle = {
    fontSize: '12px',
    color: '#aaa'
  };
  
  const chartCardStyle = {
    ...cardStyle,
    height: '350px'
  };
  
  const iconStyle = {
    color: '#aaa'
  };
  
  // Show loading indicator if data is loading
  if (loading) {
    return (
      <div style={containerStyle}>
        <EnhancedHeader />
        <div style={loaderStyle}>Loading WiFi data...</div>
      </div>
    );
  }
  
  // Show upload prompt if no data is loaded
  if (stats.totalNetworks === 0) {
    return (
      <div style={containerStyle}>
        <EnhancedHeader />
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '50px 20px',
          textAlign: 'center',
          color: '#aaa'
        }}>
          <h2 style={{ marginBottom: '20px', color: 'white' }}>No WiFi Data Loaded</h2>
          <p style={{ fontSize: '16px', marginBottom: '30px' }}>
            Upload a WiFi scan file or use our community database.
          </p>
          
          <DropZone 
            onFileUpload={handleFileUpload} 
            className="w-full max-w-xl mb-8"
          />
        </div>
      </div>
    );
  }
  
  return (
    <div style={containerStyle}>
      <EnhancedHeader />
      
      {error && (
        <div style={errorStyle}>
          {error}
        </div>
      )}
      
      <div style={cardContainerStyle}>
        <div style={cardStyle}>
          <div style={cardHeaderStyle}>
            <div style={cardTitleStyle}>Total Networks</div>
            <Wifi size={18} style={iconStyle} />
          </div>
          <div>
            <div style={statValueStyle}>{stats.totalNetworks}</div>
            <div style={statDescStyle}>WiFi networks detected</div>
          </div>
        </div>
        
        <div style={cardStyle}>
          <div style={cardHeaderStyle}>
            <div style={cardTitleStyle}>Unique Networks</div>
            <Radio size={18} style={iconStyle} />
          </div>
          <div>
            <div style={statValueStyle}>{stats.uniqueNetworkCount}</div>
            <div style={statDescStyle}>Unique SSIDs found</div>
          </div>
        </div>
        
        <div style={cardStyle}>
          <div style={cardHeaderStyle}>
            <div style={cardTitleStyle}>Open Networks</div>
            <ShieldOff size={18} style={iconStyle} />
          </div>
          <div>
            <div style={statValueStyle}>{stats.openNetworkPercentage}%</div>
            <div style={statDescStyle}>{stats.openNetworkCount} networks without security</div>
          </div>
        </div>
        
        <div style={cardStyle}>
          <div style={cardHeaderStyle}>
            <div style={cardTitleStyle}>Average Signal</div>
            <Activity size={18} style={iconStyle} />
          </div>
          <div>
            <div style={statValueStyle}>{stats.avgSignalStrength} dBm</div>
            <div style={statDescStyle}>Avg. RSSI value</div>
          </div>
        </div>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
        <div style={chartCardStyle}>
          <div style={cardHeaderStyle}>
            <div style={cardTitleStyle}>Authentication Types</div>
          </div>
          <AuthTypesPieChart />
        </div>
        
        <div style={chartCardStyle}>
          <div style={cardHeaderStyle}>
            <div style={cardTitleStyle}>Channel Distribution</div>
          </div>
          <ChannelBarChart />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div style={chartCardStyle}>
          <div style={cardHeaderStyle}>
            <div style={cardTitleStyle}>Security Levels</div>
          </div>
          <SecurityPieChart />
        </div>
        
        <div style={chartCardStyle}>
          <div style={cardHeaderStyle}>
            <div style={cardTitleStyle}>Signal Strength</div>
          </div>
          <SignalPieChart />
        </div>
      </div>
    </div>
  );
}