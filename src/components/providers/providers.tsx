"use client";

import React from 'react';
import { ThemeProvider } from '@/components/theme-provider';
import { EnhancedWiFiProvider } from '@/contexts/enhanced-wifi-context';

export default function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      disableTransitionOnChange
    >
      <EnhancedWiFiProvider>
        {children}
      </EnhancedWiFiProvider>
    </ThemeProvider>
  );
}