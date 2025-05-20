import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format date from string like "2025-5-6 11:14:51" to a more readable format
export function formatDate(dateStr: string): string {
  try {
    const [datePart, timePart] = dateStr.split(' ');
    const [year, month, day] = datePart.split('-').map(Number);
    const [hour, minute, second] = timePart.split(':').map(Number);
    
    const date = new Date(year, month - 1, day, hour, minute, second);
    
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    }).format(date);
  } catch (e) {
    return dateStr; // Return original if parsing fails
  }
}

// Format MAC address with colons for readability
export function formatMac(mac: string): string {
  // Check if MAC is already formatted
  if (mac.includes(':')) return mac;
  
  // Format MAC with colons
  return mac.match(/.{1,2}/g)?.join(':') || mac;
}

// Generate a unique ID for elements
export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

// Format signal strength from dBm to a more readable format
export function formatSignalStrength(rssi: number): string {
  // RSSI typically ranges from -30 dBm (strong) to -90 dBm (weak)
  return `${rssi} dBm`;
}

// Calculate an estimated radius for the signal strength circle on the map
export function calculateSignalRadius(rssi: number): number {
  // Simple approximation: stronger signals have smaller radius
  // RSSI ranges from about -30 (strong) to -90 (weak)
  // Map this to a radius range of 20m to 200m
  const minRssi = -90;
  const maxRssi = -30;
  const minRadius = 20;
  const maxRadius = 200;
  
  const normalizedRssi = Math.min(Math.max(rssi, minRssi), maxRssi);
  const percentage = (normalizedRssi - minRssi) / (maxRssi - minRssi);
  const radius = maxRadius - percentage * (maxRadius - minRadius);
  
  return radius;
}

// Truncate SSID if too long
export function truncateSsid(ssid: string, maxLength: number = 20): string {
  if (!ssid) return "unnamed";
  if (ssid.length <= maxLength) return ssid;
  return `${ssid.substring(0, maxLength)}...`;
}

// Get more readable description for authentication mode
export function getAuthModeDescription(authMode: string): string {
  const authLower = authMode.toLowerCase();
  
  if (authLower.includes("open") || authMode === "") {
    return "Open (No Security)";
  } else if (authLower.includes("wep")) {
    return "WEP (Outdated)";
  } else if (authLower.includes("wpa_psk")) {
    return "WPA Personal";
  } else if (authLower.includes("wpa2_psk")) {
    return "WPA2 Personal";
  } else if (authLower.includes("wpa_wpa2")) {
    return "WPA/WPA2 Mixed";
  } else if (authLower.includes("wpa2_wpa3")) {
    return "WPA2/WPA3 Mixed";
  } else if (authLower.includes("wpa3")) {
    return "WPA3 Personal";
  } else if (authLower.includes("wpa2") && !authLower.includes("psk")) {
    return "WPA2 Enterprise";
  } else {
    return authMode || "Unknown";
  }
}