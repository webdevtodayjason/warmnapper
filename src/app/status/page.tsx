"use client";

import { useEnhancedWiFi } from '@/contexts/enhanced-wifi-context';
import { EnhancedHeader } from '@/components/dashboard/enhanced-header';

export default function StatusPage() {
  const { 
    accessPoints, 
    loading, 
    error,
    stats
  } = useEnhancedWiFi();
  
  const containerStyle = {
    padding: '20px',
    backgroundColor: '#121212',
    minHeight: '100vh',
    color: 'white'
  };
  
  const cardStyle = {
    backgroundColor: '#1e1e1e',
    borderRadius: '8px',
    border: '1px solid #333',
    padding: '16px',
    marginBottom: '16px'
  };
  
  const statusStyle = {
    padding: '8px 12px',
    borderRadius: '4px',
    display: 'inline-block',
    marginBottom: '8px',
    fontWeight: 'bold'
  };
  
  const successStyle = {
    ...statusStyle,
    backgroundColor: '#10b981',
    color: 'white'
  };
  
  const warningStyle = {
    ...statusStyle,
    backgroundColor: '#f59e0b',
    color: 'white'
  };
  
  const errorStyle = {
    ...statusStyle,
    backgroundColor: '#ef4444',
    color: 'white'
  };
  
  const titleStyle = {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '16px'
  };
  
  const sectionTitleStyle = {
    fontSize: '18px',
    fontWeight: 'bold',
    marginBottom: '8px',
    marginTop: '16px'
  };
  
  const codeStyle = {
    fontFamily: 'monospace',
    backgroundColor: '#2d2d2d',
    padding: '12px',
    borderRadius: '4px',
    overflow: 'auto',
    maxHeight: '200px'
  };
  
  return (
    <div style={containerStyle}>
      <EnhancedHeader />
      
      <h1 style={titleStyle}>Context Provider Status</h1>
      
      <div style={cardStyle}>
        <div style={error ? errorStyle : loading ? warningStyle : successStyle}>
          {error ? 'Error' : loading ? 'Loading' : 'Ready'}
        </div>
        
        <h2 style={sectionTitleStyle}>Context Status</h2>
        <ul>
          <li>Provider Active: <strong>{error ? 'No' : 'Yes'}</strong></li>
          <li>Loading State: <strong>{loading ? 'Loading' : 'Loaded'}</strong></li>
          <li>Error State: <strong>{error ? error : 'None'}</strong></li>
          <li>Access Points: <strong>{accessPoints.length}</strong></li>
        </ul>
        
        <h2 style={sectionTitleStyle}>Stats Data</h2>
        <div style={codeStyle}>
          <pre>{JSON.stringify(stats, null, 2)}</pre>
        </div>
      </div>
    </div>
  );
}