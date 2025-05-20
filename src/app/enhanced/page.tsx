"use client";

import { useEnhancedWiFi } from '@/contexts/enhanced-wifi-context';
import { EnhancedHeader } from '@/components/dashboard/enhanced-header';
import { AuthTypesPieChart, ChannelBarChart, SecurityPieChart, SignalPieChart } from '@/components/charts/dashboard-charts';
import { Wifi, Radio, ShieldOff, Activity } from 'lucide-react';

export default function EnhancedDashboardPage() {
  const { 
    stats, 
    loading, 
    error 
  } = useEnhancedWiFi();
  
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
  
  // Only show loading indicator if data is actually loading
  // This prevents the app from showing "loading" if context is missing
  if (loading && stats.totalNetworks === 0) {
    return (
      <div style={containerStyle}>
        <EnhancedHeader />
        <div style={loaderStyle}>Loading WiFi data...</div>
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