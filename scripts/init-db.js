/**
 * Database initialization script
 * 
 * This script validates database connection and runs initial Prisma schema migrations
 * Run this script with: node scripts/init-db.js
 */

import { exec } from 'child_process';
import { PrismaClient } from '../src/generated/prisma';

async function main() {
  console.log('🔍 Validating database connection...');
  
  try {
    // Test database connection
    const prisma = new PrismaClient();
    await prisma.$connect();
    console.log('✅ Database connection successful!');
    await prisma.$disconnect();
    
    // Run migrations
    console.log('\n🔄 Running Prisma migrations...');
    exec('npx prisma migrate deploy', (error, stdout, stderr) => {
      if (error) {
        console.error('❌ Migration error:', error.message);
        return;
      }
      
      if (stderr) {
        console.error('⚠️ Migration warning:', stderr);
      }
      
      console.log(stdout);
      console.log('✅ Database setup complete!');
      
      // Generate Prisma client
      console.log('\n🔄 Generating Prisma client...');
      exec('npx prisma generate', (error, stdout, stderr) => {
        if (error) {
          console.error('❌ Client generation error:', error.message);
          return;
        }
        
        if (stderr) {
          console.error('⚠️ Client generation warning:', stderr);
        }
        
        console.log(stdout);
        console.log('✅ Prisma client generated successfully!');
        console.log('\n🚀 Your database is ready to use!');
      });
    });
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.log('\n⚠️ Please check your DATABASE_URL in your .env file');
    console.log('Example: DATABASE_URL="postgresql://username:password@localhost:5432/warmapper_db"');
  }
}

main();