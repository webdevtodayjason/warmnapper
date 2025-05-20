"use client";

import { Wifi } from "lucide-react";
import { useWiFi } from "@/contexts/wifi-context";
import { parseWigleWifiData } from "@/lib/wifi-utils";

export function Header() {
  const { loadWiFiData } = useWiFi();
  
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (content) {
        loadWiFiData(content);
      }
    };
    reader.readAsText(file);
  };
  
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Wifi className="h-6 w-6 text-primary" />
          <span className="text-2xl font-bold tracking-tight">
            <span className="gradient-text">WAR</span>MAPPER
          </span>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative">
            <input
              type="file"
              id="file-upload"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              accept=".txt,.csv"
              onChange={handleFileUpload}
            />
            <label 
              htmlFor="file-upload"
              className="flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 cursor-pointer"
            >
              Upload WiFi Data
            </label>
          </div>
        </div>
      </div>
    </header>
  );
}