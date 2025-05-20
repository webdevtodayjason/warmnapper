import { AccessPoint } from "@/types";
import { parseWigleWifiData } from "@/lib/wifi-utils";

// Default sample data in case loading from file fails
const DEFAULT_SAMPLE_DATA = `WigleWifi-1.4,appRelease=v1.4.1,model=ESP32 Marauder,release=v1.4.1,device=ESP32 Marauder,display=SPI TFT,board=ESP32 Marauder,brand=JustCallMeKoko
MAC,SSID,AuthMode,FirstSeen,Channel,RSSI,CurrentLatitude,CurrentLongitude,AltitudeMeters,AccuracyMeters,Type
72:8C:52:2B:9F:7B,SkyCerda,[WPA2_PSK],2025-5-6 11:14:51,11,-89,30.7193718,-97.3206482,144.50,1.50,WIFI
72:8C:52:6B:9F:7B,,[WPA2_PSK],2025-5-6 11:14:51,11,-89,30.7193718,-97.3206482,144.50,1.50,WIFI
E8:D3:EB:6D:B9:86,Granger Lake Wifi,[WPA2_PSK],2025-5-6 11:14:59,6,-78,30.7194500,-97.3211517,144.50,1.50,WIFI
E8:D3:EB:6D:B9:89,,[OPEN],2025-5-6 11:14:59,6,-78,30.7194500,-97.3211517,144.50,1.50,WIFI
E8:D3:EB:6D:B9:83,,[WPA3_PSK],2025-5-6 11:14:59,6,-79,30.7194500,-97.3211517,144.50,1.50,WIFI
C8:B8:2F:33:DD:A4,,[WPA3_PSK],2025-5-6 11:14:59,6,-81,30.7194500,-97.3211517,144.50,1.50,WIFI
C8:B8:2F:33:DD:A6,Granger Lake Wifi,[WPA2_PSK],2025-5-6 11:14:59,6,-82,30.7194500,-97.3211517,144.50,1.50,WIFI
C8:B8:2F:33:DD:A8,,[OPEN],2025-5-6 11:14:59,6,-82,30.7194500,-97.3211517,144.50,1.50,WIFI`;

// Cache for loaded data
let cachedData: AccessPoint[] | null = null;

/**
 * Loads WiFi data from the public data directory
 */
export async function loadSampleWiFiData(forceReload = false): Promise<AccessPoint[]> {
  // Return cached data if available and not forcing reload
  if (cachedData && !forceReload) {
    return cachedData;
  }
  
  try {
    console.log('Fetching sample data from: /data/sample-data.txt');
    
    // Try to fetch the sample data file
    const response = await fetch('/data/sample-data.txt');
    
    if (!response.ok) {
      throw new Error(`Failed to load sample data: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.text();
    
    if (!data || data.length === 0) {
      console.warn('Empty sample data received, using default data');
      cachedData = parseWigleWifiData(DEFAULT_SAMPLE_DATA);
      return cachedData;
    }
    
    console.log('Successfully loaded sample data, length:', data.length);
    cachedData = parseWigleWifiData(data);
    return cachedData;
  } catch (error) {
    console.error('Error loading sample data:', error);
    console.log('Loading default sample data');
    cachedData = parseWigleWifiData(DEFAULT_SAMPLE_DATA);
    return cachedData;
  }
}

/**
 * Parses WiFi data from a user-uploaded file
 */
export function parseUserWiFiData(fileContent: string): AccessPoint[] {
  try {
    const parsedData = parseWigleWifiData(fileContent);
    cachedData = parsedData; // Update cache with the new data
    return parsedData;
  } catch (error) {
    console.error('Error parsing user WiFi data:', error);
    throw new Error('Failed to parse the uploaded file. Please make sure it\'s in the correct Wigle WiFi format.');
  }
}

/**
 * Handles the file upload event and returns parsed data
 */
export async function handleFileUpload(file: File): Promise<AccessPoint[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        if (content) {
          const parsedData = parseUserWiFiData(content);
          resolve(parsedData);
        } else {
          reject(new Error('Empty file content'));
        }
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Error reading file'));
    };
    
    reader.readAsText(file);
  });
}