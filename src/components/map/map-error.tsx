"use client";

import { EnhancedHeader } from '@/components/dashboard/enhanced-header';
import Link from 'next/link';

export default function MapError() {
  const containerStyle = {
    padding: '20px',
    backgroundColor: '#121212',
    minHeight: '100vh',
    color: 'white'
  };

  const errorContainerStyle = {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    padding: '50px 20px',
    textAlign: 'center' as const,
    maxWidth: '600px',
    margin: '40px auto',
    backgroundColor: '#1e1e1e',
    borderRadius: '8px',
    border: '1px solid #333'
  };

  const headingStyle = {
    fontSize: '24px',
    marginBottom: '16px',
    color: '#f87171'
  };

  const iconStyle = {
    fontSize: '48px',
    marginBottom: '24px'
  };

  const textStyle = {
    marginBottom: '24px',
    color: '#aaa',
    lineHeight: '1.5'
  };

  const linkContainerStyle = {
    marginTop: '24px'
  };

  const buttonStyle = {
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    padding: '12px 24px',
    fontSize: '16px',
    cursor: 'pointer',
    textDecoration: 'none'
  };

  return (
    <div style={containerStyle}>
      <EnhancedHeader />
      
      <div style={errorContainerStyle}>
        <div style={iconStyle}>🗺️</div>
        <h1 style={headingStyle}>Google Maps Failed to Load</h1>
        
        <p style={textStyle}>
          We couldn't load Google Maps correctly. This is usually due to one of these issues:
        </p>
        
        <ul style={{ textAlign: 'left', color: '#aaa', marginBottom: '24px' }}>
          <li><strong>Maps JavaScript API not enabled</strong> - You need to enable it in your Google Cloud Console</li>
          <li>Missing or invalid Google Maps API key</li>
          <li>Billing not enabled for the Google Maps API</li>
          <li>Network connectivity issue</li>
        </ul>
        
        <p style={textStyle}>
          <strong>How to fix this:</strong>
        </p>
        
        <ol style={{ textAlign: 'left', color: '#aaa', marginBottom: '24px' }}>
          <li>Go to <a href="https://console.cloud.google.com/apis/library/maps-backend.googleapis.com" target="_blank" style={{ color: '#3b82f6' }}>Google Cloud Console</a></li>
          <li>Make sure you're in the correct project</li>
          <li>Search for "Maps JavaScript API" and click on it</li>
          <li>Click the "Enable" button</li>
          <li>Set up billing if prompted (many features have a free tier)</li>
          <li>Restart your application</li>
        </ol>
        
        <p style={textStyle}>
          Your API key ({process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY?.substring(0, 8)}...) is set, but the Maps JavaScript API needs to be enabled for it.
        </p>
        
        <div style={linkContainerStyle}>
          <Link href="/" style={buttonStyle}>Return to Dashboard</Link>
        </div>
      </div>
    </div>
  );
}