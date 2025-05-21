import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { parseWigleWifiData } from "@/lib/wifi-utils";
import fs from 'fs';
import path from 'path';

// Import the specific types from PrismaClient for typing
import type { PrismaClient, AccessPoint } from "@/generated/prisma";

// Declare prisma variable that might be assigned later
let prisma: PrismaClient | null = null;

// Internal flag to track initialization attempt
let prismaInitialized = false;

// Create an async initializer function that logs all steps
const initializePrisma = async () => {
  // If we already attempted initialization and it succeeded, reuse the client
  if (prismaInitialized && prisma) return prisma;

  console.log('[PRISMA] Starting Prisma client initialization...');
  
  try {
    // Use dynamic import to avoid initialization issues
    console.log('[PRISMA] Attempting to import PrismaClient from @/generated/prisma');
    
    let PrismaClientConstructor;
    try {
      // Try direct import from generated prisma
      console.log('[PRISMA] Attempting to import PrismaClient from direct path');
      const directModule = await import('../../../generated/prisma/index.js');
      PrismaClientConstructor = directModule.PrismaClient;
      console.log('[PRISMA] Successfully imported PrismaClient from direct path');
    } catch (directError) {
      console.error('[PRISMA] Error importing PrismaClient from direct path:', directError);
      
      try {
        // Try using the @ alias
        console.log('[PRISMA] Attempting to import PrismaClient from @/generated/prisma');
        const module = await import('@/generated/prisma');
        PrismaClientConstructor = module.PrismaClient;
        console.log('[PRISMA] Successfully imported PrismaClient from @/generated/prisma');
      } catch (importError) {
        console.error('[PRISMA] Error importing PrismaClient from @/generated/prisma:', importError);
        
        // Try fallback import path
        try {
          console.log('[PRISMA] Trying fallback import from @prisma/client');
          const fallbackModule = await import('@prisma/client');
          PrismaClientConstructor = fallbackModule.PrismaClient;
          console.log('[PRISMA] Successfully imported PrismaClient from fallback path');
        } catch (fallbackError) {
          console.error('[PRISMA] Fallback import also failed:', fallbackError);
          throw new Error('Failed to import PrismaClient from any source');
        }
      }
    }
    
    // Create client with detailed logging
    console.log('[PRISMA] Creating new PrismaClient instance');
    const newPrisma = new PrismaClientConstructor({
      log: [
        { emit: 'stdout', level: 'query' },
        { emit: 'stdout', level: 'error' },
        { emit: 'stdout', level: 'info' },
        { emit: 'stdout', level: 'warn' },
      ],
    });
    
    console.log('[PRISMA] Created new PrismaClient instance');
    
    // Test connection
    await newPrisma.$connect();
    console.log('[PRISMA] Successfully connected to database');
    
    // Assign to our variable and mark initialization successful
    prisma = newPrisma;
    prismaInitialized = true;
    return prisma;
  } catch (error) {
    console.error('[PRISMA] Error initializing Prisma client:', error);
    prisma = null;
    prismaInitialized = false;
    return null;
  }
};

// Fallback storage mechanism if database connection fails
const FALLBACK_STORAGE_PATH = path.join(process.cwd(), 'data-fallback.json');

const saveFallbackData = (data: any[]) => {
  try {
    let existingData: any[] = [];
    if (fs.existsSync(FALLBACK_STORAGE_PATH)) {
      const fileContent = fs.readFileSync(FALLBACK_STORAGE_PATH, 'utf8');
      existingData = JSON.parse(fileContent);
    }
    
    const updatedData = [...existingData, ...data];
    fs.writeFileSync(FALLBACK_STORAGE_PATH, JSON.stringify(updatedData, null, 2));
    console.log(`[FALLBACK] Saved ${data.length} records to fallback storage`);
    return true;
  } catch (error) {
    console.error('[FALLBACK] Error saving to fallback storage:', error);
    return false;
  }
};

const getFallbackData = () => {
  try {
    if (fs.existsSync(FALLBACK_STORAGE_PATH)) {
      const fileContent = fs.readFileSync(FALLBACK_STORAGE_PATH, 'utf8');
      return JSON.parse(fileContent);
    }
    return [];
  } catch (error) {
    console.error('[FALLBACK] Error reading from fallback storage:', error);
    return [];
  }
};

// Add logging to help debug database operations
const logApiAction = (action: string, details?: any) => {
  console.log(`[API] ${action}`, details ? details : '');
};

// Define schema for request validation
const shareWifiDataSchema = z.object({
  wifiData: z.string().min(1, "WiFi data is required"),
  shareInfo: z.object({
    city: z.string().min(2, "City is required"),
    state: z.string().min(2, "State is required"),
    uploadedBy: z.string().optional(),
  }).optional(),
});

export async function POST(req: NextRequest) {
  logApiAction('POST access-points - start');
  
  try {
    const body = await req.json();
    logApiAction('Request body received');
    
    const { wifiData, shareInfo } = shareWifiDataSchema.parse(body);
    logApiAction('Validated request data');
    
    // Parse the WiFi data
    const accessPoints = parseWigleWifiData(wifiData);
    logApiAction(`Parsed ${accessPoints.length} access points`);
    
    // Determine if the data should be shared
    const sharedPublicly = !!shareInfo;
    
    // Create an array to store created/updated access points
    const result = [];
    
    // Try to initialize Prisma
    logApiAction('Initializing Prisma client');
    const db = await initializePrisma();
    
    let useFallbackStorage = false;
    
    if (!db) {
      logApiAction('Prisma initialization failed, using fallback storage');
      useFallbackStorage = true;
    } else {
      try {
        // Check if prisma client is connected by running a simple query
        await db.$queryRaw`SELECT 1`;
        logApiAction('Database connection verified');
      } catch (dbError) {
        logApiAction('Database connection failed, using fallback storage', 
          { error: dbError instanceof Error ? dbError.message : 'Unknown error' });
        useFallbackStorage = true;
      }
    }
    
    // Process each access point
    if (useFallbackStorage) {
      // Using fallback storage
      logApiAction('Using fallback JSON storage instead of database');
      
      // Prepare access points with sharing info
      const accessPointsToStore = accessPoints.map(ap => ({
        ...ap,
        id: `fallback-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        city: shareInfo?.city,
        state: shareInfo?.state,
        uploadedBy: shareInfo?.uploadedBy,
        sharedPublicly: sharedPublicly,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }));
      
      // Save to fallback storage
      const saveResult = saveFallbackData(accessPointsToStore);
      
      if (saveResult) {
        accessPointsToStore.forEach(ap => {
          result.push({ id: ap.id, status: "created" });
        });
        logApiAction('Successfully saved to fallback storage', { count: accessPointsToStore.length });
      } else {
        accessPointsToStore.forEach(ap => {
          result.push({ 
            mac: ap.MAC, 
            ssid: ap.SSID, 
            status: "error", 
            error: "Failed to save to fallback storage" 
          });
        });
        logApiAction('Failed to save to fallback storage');
      }
    } else {
      // Using database
      for (const ap of accessPoints) {
        try {
          // Check if this access point already exists by unique constraint
          logApiAction('Checking for existing access point', { mac: ap.MAC, ssid: ap.SSID });
          const existingAP = await prisma.accessPoint.findFirst({
            where: {
              CurrentLatitude: ap.CurrentLatitude,
              CurrentLongitude: ap.CurrentLongitude,
              SSID: ap.SSID,
            },
          });
          
          if (existingAP) {
            logApiAction('Found existing access point', { id: existingAP.id });
          }
          
          // If it exists, skip it
          if (existingAP) {
            result.push({ id: existingAP.id, status: "skipped" });
            continue;
          }
          
          // Creating a new access point
          logApiAction('Creating new access point', { mac: ap.MAC, ssid: ap.SSID });
          
          // Create a new access point record
          const newAP = await prisma.accessPoint.create({
            data: {
              MAC: ap.MAC,
              SSID: ap.SSID,
              AuthMode: ap.AuthMode,
              FirstSeen: ap.FirstSeen,
              Channel: ap.Channel,
              RSSI: ap.RSSI,
              CurrentLatitude: ap.CurrentLatitude,
              CurrentLongitude: ap.CurrentLongitude,
              AltitudeMeters: ap.AltitudeMeters,
              AccuracyMeters: ap.AccuracyMeters,
              Type: ap.Type,
              // Add sharing info if provided
              city: shareInfo?.city,
              state: shareInfo?.state,
              uploadedBy: shareInfo?.uploadedBy,
              sharedPublicly: sharedPublicly,
            },
          });
          
          logApiAction('Successfully created access point', { id: newAP.id });
          
          result.push({ id: newAP.id, status: "created" });
        } catch (error) {
          logApiAction('Error processing access point', { error: error instanceof Error ? error.message : 'Unknown error' });
          result.push({ 
            mac: ap.MAC, 
            ssid: ap.SSID, 
            status: "error", 
            error: error instanceof Error ? error.message : "Unknown error" 
          });
        }
      }
    }
    
    logApiAction('POST access-points - complete', { 
      processed: accessPoints.length,
      created: result.filter(r => r.status === "created").length,
      skipped: result.filter(r => r.status === "skipped").length,
      errors: result.filter(r => r.status === "error").length
    });
    
    return NextResponse.json({
      success: true,
      message: `Processed ${accessPoints.length} access points`,
      created: result.filter(r => r.status === "created").length,
      skipped: result.filter(r => r.status === "skipped").length,
      errors: result.filter(r => r.status === "error").length,
    });
  } catch (error) {
    logApiAction('POST access-points - error', { error: error instanceof Error ? error.message : 'Unknown error' });
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : "An unknown error occurred" 
      },
      { status: 400 }
    );
  }
}

export async function GET() {
  logApiAction('GET access-points - start');
  
  try {
    // Validate database connection first
    logApiAction('GET route - Attempting database connection');
    
    let useFallbackStorage = false;
    let accessPoints = [];
    
    try {
      // First, check if prisma is defined (initialization succeeded)
      if (!prisma) {
        throw new Error('Prisma client was not initialized');
      }
      
      // Check if prisma client is connected by running a simple query
      await prisma.$queryRaw`SELECT 1`;
      logApiAction('Database connection verified');
      
      // Get all publicly shared access points from database
      logApiAction('Fetching shared access points from database');
      accessPoints = await prisma.accessPoint.findMany({
        where: {
          sharedPublicly: true
        },
      });
    } catch (dbError) {
      logApiAction('Database connection failed, using fallback storage', 
        { error: dbError instanceof Error ? dbError.message : 'Unknown error' });
      useFallbackStorage = true;
      
      // Get data from fallback storage
      logApiAction('Fetching shared access points from fallback storage');
      const fallbackData = getFallbackData();
      accessPoints = fallbackData.filter(ap => ap.sharedPublicly === true);
      logApiAction('Retrieved from fallback storage', { count: accessPoints.length });
    }
    
    logApiAction('GET access-points - complete', { count: accessPoints.length });
    
    return NextResponse.json({
      success: true,
      data: accessPoints
    });
  } catch (error) {
    logApiAction('GET access-points - error', { error: error instanceof Error ? error.message : 'Unknown error' });
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : "An unknown error occurred" 
      },
      { status: 500 }
    );
  }
}