// WiFi Access Point type definition
export interface AccessPoint {
  MAC: string;
  SSID: string;
  AuthMode: string;
  FirstSeen: string;
  Channel: number;
  RSSI: number;
  CurrentLatitude: number;
  CurrentLongitude: number;
  AltitudeMeters: number;
  AccuracyMeters: number;
  Type: string;
}

// Authentication mode types for classification
export type AuthModeType = 
  | "OPEN" 
  | "WEP" 
  | "WPA_PSK" 
  | "WPA2_PSK" 
  | "WPA_WPA2_PSK" 
  | "WPA2" 
  | "WPA2_WPA3_PSK" 
  | "WPA3_PSK"
  | "UNKNOWN";

// Security level classification
export enum SecurityLevel {
  NONE = "None",
  LOW = "Low",
  MEDIUM = "Medium",
  HIGH = "High"
}

// Signal strength classification
export enum SignalStrength {
  EXCELLENT = "Excellent",
  GOOD = "Good",
  FAIR = "Fair",
  POOR = "Poor"
}

// Channel band classification
export enum ChannelBand {
  TWO_FOUR_GHZ = "2.4GHz",
  FIVE_GHZ = "5GHz"
}

// For the pie charts and statistics
export interface AuthModeCount {
  name: string;
  value: number;
  color: string;
}

export interface ChannelDistribution {
  channel: number;
  count: number;
}

export interface SecurityDistribution {
  security: SecurityLevel;
  count: number;
  color: string;
}

export interface SignalDistribution {
  signal: SignalStrength;
  count: number;
  color: string;
}

// For map markers
export interface MarkerInfo extends AccessPoint {
  id: string;
  securityLevel: SecurityLevel;
  signalLevel: SignalStrength;
  channelBand: ChannelBand;
  color: string;
}