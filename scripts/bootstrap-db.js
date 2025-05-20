/**
 * Database bootstrap script - a more robust version
 * 
 * This script:
 * 1. Checks if PostgreSQL is running
 * 2. Verifies DATABASE_URL in environment
 * 3. Checks if database exists, creates if needed
 * 4. Runs Prisma migrations and generates client
 * 
 * Run with: node scripts/bootstrap-db.js
 */

import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

const execPromise = promisify(exec);

// Colors for console output
const colors = {
  reset: "\x1b[0m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
};

// Logger utility
const log = {
  info: (msg) => console.log(`${colors.blue}[INFO]${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}[SUCCESS]${colors.reset} ${msg}`),
  warning: (msg) => console.log(`${colors.yellow}[WARNING]${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}[ERROR]${colors.reset} ${msg}`),
  step: (msg) => console.log(`${colors.magenta}[STEP]${colors.reset} ${msg}`),
};

async function checkPostgresRunning() {
  log.step("Checking if PostgreSQL is running...");
  try {
    const { stdout } = await execPromise("ps aux | grep postgres | grep -v grep");
    if (stdout.trim()) {
      log.success("PostgreSQL is running.");
      return true;
    } else {
      log.error("PostgreSQL does not appear to be running.");
      return false;
    }
  } catch (error) {
    log.error("Failed to check PostgreSQL status.");
    return false;
  }
}

async function checkEnvironmentVariables() {
  log.step("Checking environment variables...");
  
  // Check for .env and .env.local files
  const envPath = path.join(process.cwd(), '.env');
  const envLocalPath = path.join(process.cwd(), '.env.local');
  
  let envContent = '';
  let envLocalContent = '';
  let dbUrl = null;
  
  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, 'utf8');
    log.info("Found .env file");
    
    // Extract DATABASE_URL from .env
    const dbUrlMatch = envContent.match(/DATABASE_URL=["'](.+)["']/);
    if (dbUrlMatch && dbUrlMatch[1]) {
      dbUrl = dbUrlMatch[1];
      log.info("Found DATABASE_URL in .env file");
    }
  } else {
    log.warning("No .env file found");
  }
  
  if (fs.existsSync(envLocalPath)) {
    envLocalContent = fs.readFileSync(envLocalPath, 'utf8');
    log.info("Found .env.local file");
    
    // Extract DATABASE_URL from .env.local
    const dbUrlLocalMatch = envLocalContent.match(/DATABASE_URL=["'](.+)["']/);
    if (dbUrlLocalMatch && dbUrlLocalMatch[1]) {
      dbUrl = dbUrlLocalMatch[1]; // .env.local takes precedence
      log.info("Found DATABASE_URL in .env.local file (this takes precedence)");
    }
  } else {
    log.warning("No .env.local file found");
  }
  
  if (!dbUrl) {
    log.error("DATABASE_URL not found in environment files.");
    
    // Create a sample .env.local file with DATABASE_URL if it doesn't exist
    if (!fs.existsSync(envLocalPath)) {
      const sampleEnvContent = `# Database URL for PostgreSQL
DATABASE_URL="postgresql://postgres:password@localhost:5432/warmapper?schema=public"

# Environment flag for development
NODE_ENV=development

# Skip environment validation during development
SKIP_ENV_VALIDATION=true
`;
      
      fs.writeFileSync(envLocalPath, sampleEnvContent);
      log.success("Created sample .env.local file with DATABASE_URL.");
      log.warning("Please edit the file with your actual database credentials.");
      
      return false;
    }
    
    // Or simply add DATABASE_URL to existing .env.local
    else {
      const updatedEnvLocal = envLocalContent + '\n# Database URL for PostgreSQL\nDATABASE_URL="postgresql://postgres:password@localhost:5432/warmapper?schema=public"\n';
      fs.writeFileSync(envLocalPath, updatedEnvLocal);
      log.success("Added DATABASE_URL to existing .env.local file.");
      log.warning("Please edit the file with your actual database credentials.");
      
      return false;
    }
  }
  
  return dbUrl;
}

async function checkAndCreateDatabase(dbUrl) {
  log.step("Checking and creating database if needed...");
  
  // Parse the database URL
  const dbMatch = dbUrl.match(/postgresql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/([^?]+)/);
  
  if (!dbMatch) {
    log.error("Failed to parse DATABASE_URL. Format should be: postgresql://user:password@host:port/database");
    return false;
  }
  
  const [, user, password, host, port, dbName] = dbMatch;
  log.info(`Database information: user=${user}, host=${host}, port=${port}, database=${dbName}`);
  
  try {
    // First check if we can connect to PostgreSQL at all
    const pgConnectionTest = await execPromise(`PGPASSWORD=${password} psql -U ${user} -h ${host} -p ${port} -c "SELECT 1" postgres`);
    log.success("Successfully connected to PostgreSQL server.");
    
    // Now check if the target database exists
    try {
      await execPromise(`PGPASSWORD=${password} psql -U ${user} -h ${host} -p ${port} -c "SELECT 1" ${dbName}`);
      log.success(`Database '${dbName}' exists.`);
      return true;
    } catch (dbError) {
      log.warning(`Database '${dbName}' does not exist yet.`);
      
      // Try to create the database
      try {
        await execPromise(`PGPASSWORD=${password} psql -U ${user} -h ${host} -p ${port} -c "CREATE DATABASE ${dbName}"  postgres`);
        log.success(`Created database '${dbName}'.`);
        return true;
      } catch (createError) {
        log.error(`Failed to create database '${dbName}': ${createError.message}`);
        return false;
      }
    }
  } catch (pgError) {
    log.error(`Cannot connect to PostgreSQL server: ${pgError.message}`);
    return false;
  }
}

async function setupPrisma() {
  log.step("Setting up Prisma...");
  
  try {
    // Generate Prisma client
    log.info("Generating Prisma client...");
    const { stdout: genStdout } = await execPromise("npx prisma generate");
    log.success("Generated Prisma client.");
    
    // Push schema to database
    log.info("Pushing schema to database...");
    const { stdout: pushStdout } = await execPromise("npx prisma db push");
    log.success("Pushed schema to database.");
    
    return true;
  } catch (error) {
    log.error(`Prisma setup failed: ${error.message}`);
    return false;
  }
}

async function main() {
  console.log("\n🚀 WARMAPPER-T3 Database Bootstrap\n");
  
  // Step 1: Check if PostgreSQL is running
  const isPostgresRunning = await checkPostgresRunning();
  if (!isPostgresRunning) {
    log.error("PostgreSQL must be running. Please start PostgreSQL and try again.");
    process.exit(1);
  }
  
  // Step 2: Check environment variables
  const dbUrl = await checkEnvironmentVariables();
  if (!dbUrl) {
    log.error("Please fix the DATABASE_URL issue and run this script again.");
    process.exit(1);
  }
  
  // Step 3: Check and create database if needed
  const isDatabaseReady = await checkAndCreateDatabase(dbUrl);
  if (!isDatabaseReady) {
    log.error("Database setup failed. Please check your PostgreSQL configuration.");
    process.exit(1);
  }
  
  // Step 4: Setup Prisma
  const isPrismaReady = await setupPrisma();
  if (!isPrismaReady) {
    log.error("Prisma setup failed. Please check the errors above.");
    process.exit(1);
  }
  
  log.success("\n✅ Database setup completed successfully!");
  log.info("You can now start your application with: npm run dev");
}

main().catch(error => {
  log.error(`Unhandled error: ${error.message}`);
  process.exit(1);
});