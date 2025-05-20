# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

WARMAPPER is a WiFi network discovery and mapping tool built with Next.js, TypeScript, Tailwind CSS, and shadcn/ui. It visualizes and analyzes WiFi networks by parsing and displaying data from Wigle WiFi-compatible scans.

This version uses the T3 Stack (TypeScript, Tailwind, and tRPC) for better structure and scalability.

## Development Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build the application
npm run build

# Start production server
npm run start

# Run linter
npm run lint

# Add shadcn/ui components
npx shadcn@latest add [component-name]
```

## Environment Setup

Ensure your `.env.local` file includes your Google Maps API key:

```
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

## Key Architecture

1. **Data Structure**: WiFi network data is represented by the `AccessPoint` interface defined in `src/types/index.ts`.

2. **Data Provider**: The project uses React Context for state management. The `WiFiProvider` in `src/contexts/wifi-context.tsx` manages all state related to WiFi data.

3. **Data Processing**: 
   - WiFi data processing utilities are defined in `src/lib/wifi-utils.ts`.
   - The system currently parses Wigle WiFi-compatible data files.
   - Data processing includes categorizing networks by security level, signal strength, and channel.

4. **UI Components**:
   - Dashboard components for displaying statistics and charts are in `src/components/dashboard`.
   - Map visualization components are in `src/components/map`.
   - UI components use shadcn/ui and are in `src/components/ui`.
   - Theme provider implementation in `src/components/theme-provider.tsx`.

5. **Data Flow**:
   - WiFi data is loaded from a file in `public/data` or via file upload.
   - The data is parsed using `parseWigleWifiData()`.
   - The provider computes statistics, distributions, and prepares map markers.
   - Components consume this data via `useWiFi()` hook.

## Working with Data Files

- Sample data is in `public/data/sample-data.txt`.
- Larger dataset example in `public/data/wardrive_1.log`.
- Data format is Wigle WiFi-compatible CSV with header structure:
  ```
  MAC,SSID,AuthMode,FirstSeen,Channel,RSSI,CurrentLatitude,CurrentLongitude,AltitudeMeters,AccuracyMeters,Type
  ```

## UI Components with shadcn/ui

This project uses [shadcn/ui](https://ui.shadcn.com/) for UI components. The components are already integrated and configured in the project.

- Components configuration is in `components.json` at the root of the project
- UI components are in `src/components/ui`
- To add new components, run: `npx shadcn@latest add [component-name]`

## Code Guidelines

1. Use `.tsx` extension for React components, not `.ts`.
2. When adding features, follow the existing type structure in `src/types/index.ts`.
3. Extend WiFi utility functions in `src/lib/wifi-utils.ts` for data processing.
4. Use the existing context pattern in `src/contexts/wifi-context.tsx` for state management.
5. Follow the component structure established in the project.
6. Use shadcn/ui components where possible to maintain UI consistency.

## T3 Stack Features

This project is built on the T3 Stack, which provides:

1. TypeScript for type safety
2. Tailwind CSS for styling
3. Ready to use with tRPC for type-safe APIs (not yet implemented)
4. Can be extended with Prisma, NextAuth.js, etc.

See [create-t3-app.dev](https://create-t3-app.dev/) for more information on the T3 Stack.