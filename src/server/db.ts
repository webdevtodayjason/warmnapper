import { env } from '@/env'

// Import with better error handling
let PrismaClient;
try {
  PrismaClient = (await import('@/generated/prisma')).PrismaClient;
  console.log('[DB] Successfully imported PrismaClient from @/generated/prisma');
} catch (importError) {
  console.error('[DB] Error importing from @/generated/prisma:', importError);
  
  try {
    PrismaClient = (await import('@prisma/client')).PrismaClient;
    console.log('[DB] Successfully imported PrismaClient from @prisma/client');
  } catch (fallbackError) {
    console.error('[DB] Error importing from @prisma/client:', fallbackError);
    
    // Create stub PrismaClient to prevent app from crashing
    console.warn('[DB] Creating stub PrismaClient to prevent crashes');
    PrismaClient = class StubPrismaClient {
      constructor() {
        console.warn('[DB] Using stub PrismaClient - database operations will fail');
      }
      
      // Stub method to prevent undefined errors
      $connect() { 
        return Promise.reject(new Error('Stub PrismaClient cannot connect to database')); 
      }
      
      // Add more stub methods as needed
    };
  }
}

/**
 * Instantiate a single instance PrismaClient for the entire app
 */
const createPrismaClient = () => {
  console.log('[DB] Creating PrismaClient instance');
  try {
    return new PrismaClient({
      log: env.NODE_ENV === 'development' 
        ? ['query', 'error', 'warn'] 
        : ['error'],
      errorFormat: 'pretty',
    });
  } catch (error) {
    console.error('[DB] Failed to create PrismaClient instance:', error);
    throw error;
  }
}

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
// Learn more: 
// https://pris.ly/d/help/next-js-best-practices

const globalForPrisma = globalThis as unknown as { prisma: any | undefined }

let prisma;
try {
  prisma = globalForPrisma.prisma ?? createPrismaClient();
  console.log('[DB] PrismaClient initialized successfully');
} catch (error) {
  console.error('[DB] Failed to initialize PrismaClient:', error);
  throw error;
}

if (env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export const db = prisma;