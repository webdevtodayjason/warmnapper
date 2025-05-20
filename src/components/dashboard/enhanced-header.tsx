"use client";

import { useState } from 'react';
import { Wifi } from 'lucide-react';
import { useEnhancedWiFi } from '@/contexts/enhanced-wifi-context';
import Link from 'next/link';
import { DropZone } from '@/components/ui/drop-zone';

interface FileUploadDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onFileUpload: (file: File, shareData?: { city: string; state: string; uploadedBy?: string }) => void;
}

const FileUploadDialog: React.FC<FileUploadDialogProps> = ({ 
  isOpen, 
  onClose,
  onFileUpload
}) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-800 p-6 rounded-lg w-full max-w-xl">
        <h2 className="text-xl font-semibold mb-4 text-white">Upload WiFi Data</h2>
        <DropZone onFileUpload={(file, shareData) => {
          onFileUpload(file, shareData);
          onClose();
        }} />
        <div className="flex justify-end mt-4">
          <button 
            style={{
              backgroundColor: '#2b2b2b',
              color: 'white',
              border: '1px solid #3b3b3b',
              borderRadius: '4px',
              padding: '8px 16px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export function EnhancedHeader() {
  const { loadWiFiData } = useEnhancedWiFi();
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [showUploadSuccess, setShowUploadSuccess] = useState(false);
  
  const headerStyle = {
    padding: '16px 0',
    borderBottom: '1px solid #333',
    marginBottom: '24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  };
  
  const logoStyle = {
    fontSize: '24px',
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  };
  
  const navStyle = {
    display: 'flex',
    gap: '24px'
  };
  
  const navLinkStyle = {
    color: 'white',
    textDecoration: 'none',
    padding: '4px 0',
    borderBottom: '2px solid transparent',
    transition: 'border-color 0.2s'
  };
  
  const activeNavLinkStyle = {
    ...navLinkStyle,
    borderBottom: '2px solid #3b82f6'
  };
  
  const navActiveStyle = (path: string) => {
    if (typeof window !== 'undefined') {
      // In a real app, you'd use proper router path matching
      return window.location.pathname.includes(path) ? activeNavLinkStyle : navLinkStyle;
    }
    return navLinkStyle;
  };
  
  const actionsStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
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
  
  const uploadButtonStyle = {
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    padding: '8px 16px',
    cursor: 'pointer',
    fontSize: '14px'
  };
  
  const notificationStyle = {
    backgroundColor: '#10b981',
    color: 'white',
    padding: '8px 12px',
    borderRadius: '4px',
    fontSize: '14px',
    position: 'fixed' as const,
    top: '20px',
    right: '20px',
    zIndex: 1000,
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    transition: 'opacity 0.3s, transform 0.3s',
    opacity: showUploadSuccess ? 1 : 0,
    transform: showUploadSuccess ? 'translateY(0)' : 'translateY(-20px)'
  };

  const handleFileUpload = async (file: File, shareData?: { city: string; state: string; uploadedBy?: string }) => {
    try {
      const fileContent = await file.text();
      loadWiFiData(fileContent);
      
      // If shareData is provided, send to API
      if (shareData) {
        try {
          const response = await fetch('/api/access-points', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              wifiData: fileContent,
              shareInfo: shareData
            })
          });
          
          const result = await response.json();
          console.log('Shared WiFi data result:', result);
          
          // Show success notification
          setShowUploadSuccess(true);
          setTimeout(() => setShowUploadSuccess(false), 3000);
        } catch (error) {
          console.error('Error sharing WiFi data:', error);
        }
      } else {
        // Still show success notification for non-shared uploads
        setShowUploadSuccess(true);
        setTimeout(() => setShowUploadSuccess(false), 3000);
      }
    } catch (error) {
      console.error('Error reading file:', error);
    }
  };
  
  return (
    <>
      <header style={headerStyle}>
        <div style={logoStyle}>
          <Wifi style={{ color: '#3b82f6' }} />
          <span>
            <span style={{ color: '#3b82f6' }}>WAR</span>MAPPER
          </span>
        </div>
        
        <nav style={navStyle}>
          <Link href="/enhanced" style={navActiveStyle('/enhanced')}>
            Dashboard
          </Link>
          <Link href="/map" style={navActiveStyle('/map')}>
            Map
          </Link>
          <Link href="/data" style={navActiveStyle('/data')}>
            Data Table
          </Link>
          <Link href="/status" style={navActiveStyle('/status')}>
            Status
          </Link>
        </nav>
        
        <div style={actionsStyle}>
          <button 
            style={{
              ...uploadButtonStyle,
              padding: '10px 20px',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
            onClick={() => setIsUploadDialogOpen(true)}
          >
            Upload WiFi Data
          </button>
        </div>
        
        <div style={notificationStyle}>
          File uploaded successfully!
        </div>
      </header>
      
      <FileUploadDialog 
        isOpen={isUploadDialogOpen} 
        onClose={() => setIsUploadDialogOpen(false)}
        onFileUpload={handleFileUpload}
      />
    </>
  );
}