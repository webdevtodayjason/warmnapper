"use client";

import { useState } from 'react';

interface FileUploaderProps {
  onFileUpload: (file: File) => void;
  accept?: string;
  buttonText?: string;
  buttonClass?: any; // Allow for style object
}

export function FileUploader({ 
  onFileUpload, 
  accept = ".txt,.csv", 
  buttonText = "Upload WiFi Data", 
  buttonClass = ""
}: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileUpload(file);
      
      // Reset the input value so the same file can be uploaded again if needed
      e.target.value = '';
    }
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      onFileUpload(file);
    }
  };
  
  const defaultButtonClass = "bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium";
  const buttonClassName = buttonClass || defaultButtonClass;
  
  return (
    <div 
      className={`relative ${isDragging ? 'bg-blue-100/10 border-blue-500' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        type="file"
        id="file-upload"
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        accept={accept}
        onChange={handleFileChange}
      />
      {typeof buttonClass === 'object' ? (
        <label htmlFor="file-upload" style={buttonClass} className="cursor-pointer">
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 4V16M12 4L8 8M12 4L16 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M20 16V18C20 19.1046 19.1046 20 18 20H6C4.89543 20 4 19.1046 4 18V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {buttonText}
          </span>
        </label>
      ) : (
        <label 
          htmlFor="file-upload"
          className={`flex items-center justify-center cursor-pointer ${buttonClassName}`}
        >
          {buttonText}
        </label>
      )}
    </div>
  );
}