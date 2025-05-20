import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ShareModal } from "./share-modal";

interface DropZoneProps {
  onFileUpload: (file: File, shareData?: { city: string; state: string; uploadedBy?: string }) => void;
  className?: string;
}

export function DropZone({ onFileUpload, className }: DropZoneProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setSelectedFile(file);
      setIsShareModalOpen(true);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/plain': ['.txt'],
      'text/csv': ['.csv']
    },
    maxFiles: 1,
  });

  const handleShare = (shareData: { city: string; state: string; uploadedBy?: string }) => {
    if (selectedFile) {
      onFileUpload(selectedFile, shareData);
    }
  };

  const handleDecline = () => {
    if (selectedFile) {
      onFileUpload(selectedFile);
    }
  };

  return (
    <>
      <div 
        className={cn(
          "border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition-colors",
          isDragActive 
            ? "border-primary bg-primary/10" 
            : "border-gray-300 hover:border-primary/50 hover:bg-primary/5",
          className
        )}
        {...getRootProps()}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="text-4xl">📡</div>
          {isDragActive ? (
            <p className="text-lg font-medium">Drop the WiFi scan file here...</p>
          ) : (
            <>
              <p className="text-lg font-medium">Drag & drop a WiFi scan file here, or click to select</p>
              <p className="text-sm text-muted-foreground">
                The file should be in Wigle WiFi format with headers
              </p>
              <Button variant="outline" className="mt-2">
                Select File
              </Button>
            </>
          )}
        </div>
      </div>

      {selectedFile && (
        <ShareModal
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          onDecline={handleDecline}
          onConfirm={handleShare}
        />
      )}
    </>
  );
}