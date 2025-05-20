"use client";

import { ReactNode } from 'react';
import { EnhancedWiFiProvider } from '@/contexts/enhanced-wifi-context';

export function WiFiProviderWrapper({ children }: { children: ReactNode }) {
  return <EnhancedWiFiProvider>{children}</EnhancedWiFiProvider>;
}