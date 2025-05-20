import { 
  AccessPoint, 
  AuthModeType, 
  SecurityLevel, 
  SignalStrength,
  ChannelBand,
  AuthModeCount,
  ChannelDistribution,
  SecurityDistribution,
  SignalDistribution,
  MarkerInfo
} from "@/types";

// Parse WiFi data from WigleWifi format
export const parseWigleWifiData = (data: string): AccessPoint[] => {
  const lines = data.split('\n');
  
  // Find the header line (contains "MAC,SSID,AuthMode,...")
  let headerLineIndex = 0;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes("MAC,SSID,AuthMode")) {
      headerLineIndex = i;
      break;
    }
  }
  
  // Get the headers and data lines
  const headers = lines[headerLineIndex].split(',');
  const dataLines = lines.slice(headerLineIndex + 1).filter(line => line.trim() !== '');
  
  // Parse each line into an AccessPoint object
  return dataLines.map(line => {
    const values = line.split(',');
    return {
      MAC: values[0] || "",
      SSID: values[1] || "",
      AuthMode: values[2]?.replace(/[\[\]]/g, '') || "",
      FirstSeen: values[3] || "",
      Channel: parseInt(values[4], 10) || 0,
      RSSI: parseInt(values[5], 10) || 0,
      CurrentLatitude: parseFloat(values[6]) || 0,
      CurrentLongitude: parseFloat(values[7]) || 0,
      AltitudeMeters: parseFloat(values[8]) || 0,
      AccuracyMeters: parseFloat(values[9]) || 0,
      Type: values[10] || ""
    };
  });
};

// Determine security level based on authentication mode
export const getSecurityLevel = (authMode: string): SecurityLevel => {
  // Convert to lowercase for case-insensitive matching
  const mode = authMode.toLowerCase();
  
  if (mode.includes("open") || mode === "") {
    return SecurityLevel.NONE;
  } else if (mode.includes("wep")) {
    return SecurityLevel.LOW;
  } else if (mode.includes("wpa_psk") || mode.includes("wpa2_psk")) {
    return SecurityLevel.MEDIUM;
  } else if (mode.includes("wpa3") || mode.includes("wpa2_wpa3")) {
    return SecurityLevel.HIGH;
  } else {
    return SecurityLevel.MEDIUM; // Default
  }
};

// Determine signal strength category based on RSSI
export const getSignalStrength = (rssi: number): SignalStrength => {
  if (rssi >= -50) {
    return SignalStrength.EXCELLENT;
  } else if (rssi >= -65) {
    return SignalStrength.GOOD;
  } else if (rssi >= -75) {
    return SignalStrength.FAIR;
  } else {
    return SignalStrength.POOR;
  }
};

// Determine channel band (2.4GHz or 5GHz)
export const getChannelBand = (channel: number): ChannelBand => {
  return channel > 14 ? ChannelBand.FIVE_GHZ : ChannelBand.TWO_FOUR_GHZ;
};

// Get color for marker based on security level
export const getSecurityColor = (securityLevel: SecurityLevel): string => {
  switch (securityLevel) {
    case SecurityLevel.NONE:
      return "#f87171"; // Red
    case SecurityLevel.LOW:
      return "#fb923c"; // Orange
    case SecurityLevel.MEDIUM:
      return "#facc15"; // Yellow
    case SecurityLevel.HIGH:
      return "#4ade80"; // Green
    default:
      return "#94a3b8"; // Gray
  }
};

// Get color for marker based on signal strength
export const getSignalColor = (signalLevel: SignalStrength): string => {
  switch (signalLevel) {
    case SignalStrength.EXCELLENT:
      return "#4ade80"; // Green
    case SignalStrength.GOOD:
      return "#facc15"; // Yellow
    case SignalStrength.FAIR:
      return "#fb923c"; // Orange
    case SignalStrength.POOR:
      return "#f87171"; // Red
    default:
      return "#94a3b8"; // Gray
  }
};

// Get auth mode distribution for pie chart
export const getAuthModeDistribution = (accessPoints: AccessPoint[]): AuthModeCount[] => {
  const authCounts: Record<string, number> = {};
  
  accessPoints.forEach(ap => {
    const authMode = ap.AuthMode || "UNKNOWN";
    authCounts[authMode] = (authCounts[authMode] || 0) + 1;
  });
  
  const colorMap: Record<string, string> = {
    "OPEN": "#f87171", // Red
    "WEP": "#fb923c", // Orange
    "WPA_PSK": "#facc15", // Yellow
    "WPA2_PSK": "#a3e635", // Light green
    "WPA_WPA2_PSK": "#34d399", // Teal
    "WPA2": "#2dd4bf", // Light teal
    "WPA2_WPA3_PSK": "#22d3ee", // Light cyan
    "WPA3_PSK": "#38bdf8", // Light blue
    "UNKNOWN": "#94a3b8" // Gray
  };
  
  return Object.entries(authCounts).map(([name, value]) => ({
    name,
    value,
    color: colorMap[name as AuthModeType] || "#94a3b8"
  }));
};

// Get channel distribution for bar chart
export const getChannelDistribution = (accessPoints: AccessPoint[]): ChannelDistribution[] => {
  const channelCounts: Record<number, number> = {};
  
  accessPoints.forEach(ap => {
    if (ap.Channel) {
      channelCounts[ap.Channel] = (channelCounts[ap.Channel] || 0) + 1;
    }
  });
  
  return Object.entries(channelCounts)
    .map(([channel, count]) => ({
      channel: parseInt(channel, 10),
      count
    }))
    .sort((a, b) => a.channel - b.channel);
};

// Get security level distribution for pie chart
export const getSecurityDistribution = (accessPoints: AccessPoint[]): SecurityDistribution[] => {
  const securityCounts: Record<SecurityLevel, number> = {
    [SecurityLevel.NONE]: 0,
    [SecurityLevel.LOW]: 0,
    [SecurityLevel.MEDIUM]: 0,
    [SecurityLevel.HIGH]: 0
  };
  
  accessPoints.forEach(ap => {
    const security = getSecurityLevel(ap.AuthMode);
    securityCounts[security]++;
  });
  
  const colorMap: Record<SecurityLevel, string> = {
    [SecurityLevel.NONE]: "#f87171", // Red
    [SecurityLevel.LOW]: "#fb923c", // Orange
    [SecurityLevel.MEDIUM]: "#facc15", // Yellow
    [SecurityLevel.HIGH]: "#4ade80", // Green
  };
  
  return Object.entries(securityCounts).map(([security, count]) => ({
    security: security as SecurityLevel,
    count,
    color: colorMap[security as SecurityLevel]
  }));
};

// Get signal strength distribution for pie chart
export const getSignalDistribution = (accessPoints: AccessPoint[]): SignalDistribution[] => {
  const signalCounts: Record<SignalStrength, number> = {
    [SignalStrength.EXCELLENT]: 0,
    [SignalStrength.GOOD]: 0,
    [SignalStrength.FAIR]: 0,
    [SignalStrength.POOR]: 0
  };
  
  accessPoints.forEach(ap => {
    const signal = getSignalStrength(ap.RSSI);
    signalCounts[signal]++;
  });
  
  const colorMap: Record<SignalStrength, string> = {
    [SignalStrength.EXCELLENT]: "#4ade80", // Green
    [SignalStrength.GOOD]: "#facc15", // Yellow
    [SignalStrength.FAIR]: "#fb923c", // Orange
    [SignalStrength.POOR]: "#f87171", // Red
  };
  
  return Object.entries(signalCounts).map(([signal, count]) => ({
    signal: signal as SignalStrength,
    count,
    color: colorMap[signal as SignalStrength]
  }));
};

// Prepare markers for Google Maps
export const prepareMapMarkers = (accessPoints: AccessPoint[]): MarkerInfo[] => {
  return accessPoints
    .filter(ap => ap.CurrentLatitude && ap.CurrentLongitude) // Filter out APs without coordinates
    .map(ap => {
      const securityLevel = getSecurityLevel(ap.AuthMode);
      const signalLevel = getSignalStrength(ap.RSSI);
      const channelBand = getChannelBand(ap.Channel);
      
      return {
        ...ap,
        id: ap.MAC, // Use MAC address as unique ID
        securityLevel,
        signalLevel,
        channelBand,
        color: getSecurityColor(securityLevel) // Default color by security
      };
    });
};

// Get statistics about the WiFi networks
export const getNetworkStats = (accessPoints: AccessPoint[]) => {
  const totalNetworks = accessPoints.length;
  const uniqueNetworkCount = new Set(accessPoints.map(ap => ap.SSID)).size;
  const openNetworkCount = accessPoints.filter(ap => 
    ap.AuthMode.toLowerCase().includes("open") || ap.AuthMode === "").length;
  
  const channels = accessPoints.map(ap => ap.Channel);
  const mostCommonChannel = channels.length > 0 
    ? channels.sort((a, b) => 
        channels.filter(v => v === a).length - channels.filter(v => v === b).length
      ).pop() 
    : 0;
    
  const avgSignalStrength = accessPoints.reduce((sum, ap) => sum + ap.RSSI, 0) / totalNetworks;
  
  return {
    totalNetworks,
    uniqueNetworkCount,
    openNetworkCount,
    openNetworkPercentage: (openNetworkCount / totalNetworks * 100).toFixed(1),
    mostCommonChannel,
    avgSignalStrength: avgSignalStrength.toFixed(1)
  };
};