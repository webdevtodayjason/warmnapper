"use client";

import { useState } from 'react';
import { useEnhancedWiFi } from '@/contexts/enhanced-wifi-context';
import { EnhancedHeader } from '@/components/dashboard/enhanced-header';
import { formatMac } from '@/lib/utils';
import { getSecurityLevel, getSignalStrength } from '@/lib/wifi-utils';
import { 
  Wifi, WifiOff, Shield, ShieldOff, ShieldCheck, 
  SignalHigh, SignalMedium, SignalLow, Search, 
  ArrowUpDown, ChevronUp, ChevronDown 
} from 'lucide-react';
import { AccessPoint } from '@/types';

export default function DataTablePage() {
  const { accessPoints, loading } = useEnhancedWiFi();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof AccessPoint | 'securityLevel' | 'signalLevel'>('RSSI');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  
  const containerStyle = {
    padding: '20px',
    backgroundColor: '#121212',
    minHeight: '100vh',
    color: 'white'
  };
  
  const searchContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '16px'
  };
  
  const searchIconStyle = {
    color: '#aaa'
  };
  
  const searchInputStyle = {
    padding: '8px 12px',
    backgroundColor: '#2b2b2b',
    border: '1px solid #3b3b3b',
    borderRadius: '4px',
    color: 'white',
    width: '300px'
  };
  
  const searchCountStyle = {
    fontSize: '14px',
    color: '#aaa'
  };
  
  const tableContainerStyle = {
    border: '1px solid #333',
    borderRadius: '8px',
    overflow: 'hidden'
  };
  
  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse' as const
  };
  
  const tableHeaderStyle = {
    backgroundColor: '#1e1e1e',
    textAlign: 'left' as const,
    padding: '12px 16px',
    borderBottom: '1px solid #333',
    fontSize: '14px',
    fontWeight: 'bold'
  };
  
  const tableCellStyle = {
    padding: '12px 16px',
    borderBottom: '1px solid #333',
    fontSize: '14px'
  };
  
  const headerButtonStyle = {
    background: 'none',
    border: 'none',
    color: 'white',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    padding: 0,
    fontSize: '14px',
    fontWeight: 'bold'
  };
  
  const iconContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  };
  
  const tableRowStyle = {
    backgroundColor: '#1b1b1b',
    transition: 'background-color 0.2s'
  };
  
  const tableRowHoverStyle = {
    backgroundColor: '#2b2b2b'
  };
  
  const noDataStyle = {
    padding: '20px',
    textAlign: 'center' as const,
    color: '#aaa'
  };
  
  const loaderStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '200px',
    fontSize: '18px',
    color: '#aaa'
  };
  
  // Filter access points based on search term
  const filteredAccessPoints = accessPoints.filter(ap => {
    const searchLower = searchTerm.toLowerCase();
    return (
      ap.SSID?.toLowerCase().includes(searchLower) ||
      ap.MAC.toLowerCase().includes(searchLower) ||
      ap.AuthMode.toLowerCase().includes(searchLower)
    );
  });
  
  // Custom sort function
  const sortedAccessPoints = [...filteredAccessPoints].sort((a, b) => {
    if (sortField === 'securityLevel') {
      const securityLevels = ['None', 'Low', 'Medium', 'High'];
      const securityA = getSecurityLevel(a.AuthMode);
      const securityB = getSecurityLevel(b.AuthMode);
      
      const sortValue = securityLevels.indexOf(securityB) - securityLevels.indexOf(securityA);
      return sortDirection === 'asc' ? -sortValue : sortValue;
    } 
    
    if (sortField === 'signalLevel') {
      return sortDirection === 'asc' ? a.RSSI - b.RSSI : b.RSSI - a.RSSI;
    }
    
    const aValue = a[sortField as keyof AccessPoint];
    const bValue = b[sortField as keyof AccessPoint];
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc' 
        ? aValue.localeCompare(bValue) 
        : bValue.localeCompare(aValue);
    } else {
      return sortDirection === 'asc' 
        ? Number(aValue) - Number(bValue) 
        : Number(bValue) - Number(aValue);
    }
  });
  
  // Handle column header click for sorting
  const handleSort = (field: keyof AccessPoint | 'securityLevel' | 'signalLevel') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  // Render security icon based on security level
  const renderSecurityIcon = (authMode: string) => {
    const security = getSecurityLevel(authMode);
    
    switch (security) {
      case 'None':
        return <ShieldOff size={16} color="#f87171" />;
      case 'Low':
        return <Shield size={16} color="#fb923c" />;
      case 'Medium':
        return <ShieldCheck size={16} color="#facc15" />;
      case 'High':
        return <ShieldCheck size={16} color="#4ade80" />;
      default:
        return <Shield size={16} color="#94a3b8" />;
    }
  };
  
  // Render signal icon based on signal level
  const renderSignalIcon = (rssi: number) => {
    const signal = getSignalStrength(rssi);
    
    switch (signal) {
      case 'Excellent':
        return <SignalHigh size={16} color="#4ade80" />;
      case 'Good':
        return <SignalHigh size={16} color="#facc15" />;
      case 'Fair':
        return <SignalMedium size={16} color="#fb923c" />;
      case 'Poor':
        return <SignalLow size={16} color="#f87171" />;
      default:
        return <SignalLow size={16} color="#94a3b8" />;
    }
  };
  
  // Render sort icon
  const renderSortIcon = (field: keyof AccessPoint | 'securityLevel' | 'signalLevel') => {
    if (sortField !== field) {
      return <ArrowUpDown size={14} opacity={0.5} />;
    }
    
    return sortDirection === 'asc' 
      ? <ChevronUp size={14} /> 
      : <ChevronDown size={14} />;
  };
  
  if (loading) {
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
      
      <div style={searchContainerStyle}>
        <Search size={16} style={searchIconStyle} />
        <input
          type="text"
          placeholder="Search networks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={searchInputStyle}
        />
        <div style={searchCountStyle}>
          Showing {sortedAccessPoints.length} of {accessPoints.length} networks
        </div>
      </div>
      
      <div style={tableContainerStyle}>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={tableHeaderStyle}>
                <button style={headerButtonStyle} onClick={() => handleSort('SSID')}>
                  Network Name {renderSortIcon('SSID')}
                </button>
              </th>
              <th style={tableHeaderStyle}>
                <button style={headerButtonStyle} onClick={() => handleSort('MAC')}>
                  MAC Address {renderSortIcon('MAC')}
                </button>
              </th>
              <th style={tableHeaderStyle}>
                <button style={headerButtonStyle} onClick={() => handleSort('securityLevel')}>
                  Security {renderSortIcon('securityLevel')}
                </button>
              </th>
              <th style={tableHeaderStyle}>
                <button style={headerButtonStyle} onClick={() => handleSort('Channel')}>
                  Channel {renderSortIcon('Channel')}
                </button>
              </th>
              <th style={tableHeaderStyle}>
                <button style={headerButtonStyle} onClick={() => handleSort('signalLevel')}>
                  Signal {renderSortIcon('signalLevel')}
                </button>
              </th>
              <th style={tableHeaderStyle}>
                <button style={headerButtonStyle} onClick={() => handleSort('FirstSeen')}>
                  First Seen {renderSortIcon('FirstSeen')}
                </button>
              </th>
              <th style={tableHeaderStyle}>Location</th>
            </tr>
          </thead>
          <tbody>
            {sortedAccessPoints.length === 0 ? (
              <tr>
                <td colSpan={7} style={noDataStyle}>
                  No networks found
                </td>
              </tr>
            ) : (
              sortedAccessPoints.map((ap) => (
                <tr 
                  key={`${ap.MAC}-${ap.CurrentLatitude}-${ap.CurrentLongitude}-${ap.RSSI}`} 
                  style={tableRowStyle}
                  onMouseEnter={(e) => Object.assign(e.currentTarget.style, tableRowHoverStyle)}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = tableRowStyle.backgroundColor}
                >
                  <td style={tableCellStyle}>
                    <div style={iconContainerStyle}>
                      {ap.SSID ? (
                        <Wifi size={16} />
                      ) : (
                        <WifiOff size={16} style={{ color: '#aaa' }} />
                      )}
                      <span>{ap.SSID || <em style={{ color: '#aaa' }}>unnamed</em>}</span>
                    </div>
                  </td>
                  <td style={{ ...tableCellStyle, fontFamily: 'monospace' }}>{formatMac(ap.MAC)}</td>
                  <td style={tableCellStyle}>
                    <div style={iconContainerStyle}>
                      {renderSecurityIcon(ap.AuthMode)}
                      <span>{ap.AuthMode}</span>
                    </div>
                  </td>
                  <td style={tableCellStyle}>{ap.Channel}</td>
                  <td style={tableCellStyle}>
                    <div style={iconContainerStyle}>
                      {renderSignalIcon(ap.RSSI)}
                      <span>{ap.RSSI} dBm</span>
                    </div>
                  </td>
                  <td style={tableCellStyle}>{ap.FirstSeen}</td>
                  <td style={tableCellStyle}>
                    {ap.CurrentLatitude.toFixed(6)}, {ap.CurrentLongitude.toFixed(6)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}