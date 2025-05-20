# Database Setup Guide

This guide walks you through setting up the database for WARMAPPER-T3 and configuring the necessary environment variables.

## Prerequisites

- PostgreSQL installed and running
- Node.js and npm installed

## Quick Start: Automatic Database Bootstrap

For an automated setup process, run:

```bash
npm run db:bootstrap
```

This script will:
1. Check if PostgreSQL is running
2. Verify the DATABASE_URL environment variable exists and is correctly formatted
3. Create the database if it doesn't exist
4. Generate the Prisma client and push schema changes

If any issues are detected, the script will provide guidance on how to fix them.

## Manual Setup Process

### Step 1: Set Up Environment Variables

1. Create a `.env.local` file in the project root (preferred over `.env` for Next.js):

```bash
# Required: Google Maps API key
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="your_google_maps_api_key"

# Required: PostgreSQL database URL
DATABASE_URL="postgresql://username:password@localhost:5432/warmapper"

# Optional: For production, set NODE_ENV to "production"
NODE_ENV="development"

# Skip environment validation during development
SKIP_ENV_VALIDATION=true
```

**Important**: The `DATABASE_URL` must be defined in `.env.local` for proper operation.

### Step 2: Create the Database

Create a PostgreSQL database for your project:

```bash
# Connect to PostgreSQL
psql -U postgres

# Inside the PostgreSQL shell, create the database
CREATE DATABASE warmapper;

# Grant privileges (replace 'your_username' with your actual PostgreSQL username)
GRANT ALL PRIVILEGES ON DATABASE warmapper TO your_username;

# Exit the PostgreSQL shell
\q
```

### Step 3: Initialize the Database

Run the database initialization script:

```bash
npm run db:init
```

This script will:
- Test the database connection
- Run any pending Prisma migrations
- Generate the Prisma client

## Database Management Commands

The following commands are available for database management:

```bash
# Automated database bootstrap (recommended)
npm run db:bootstrap

# Initialize the database 
npm run db:init

# Push schema changes directly to the database (for development)
npm run db:push

# Create and apply migrations (recommended for production)
npm run db:migrate

# Launch Prisma Studio to view and manage data
npm run db:studio

# Regenerate Prisma client after schema changes
npm run prisma:generate
```

## Troubleshooting

### Connection Issues

If you encounter connection issues, check:

1. Is PostgreSQL running? Check with:
```bash
ps aux | grep postgres | grep -v grep
```

2. Is your `DATABASE_URL` correct and in `.env.local`? The format should be:
```
DATABASE_URL="postgresql://username:password@localhost:5432/warmapper"
```

3. Can you connect to the database with psql?
```bash
psql -U postgres -h localhost -d warmapper
```

### Schema Issues

If you encounter schema-related errors:

1. Ensure you've run `npm run prisma:generate` after any schema changes
2. Check if your schema.prisma file has any validation errors
3. For production environments, always use migrations with `npm run db:migrate`

### Import Issues

If you encounter import errors with Prisma:

1. Make sure the Prisma client is generated at the correct path:
```bash
ls -la ./src/generated/prisma
```

2. Try using the full database bootstrap:
```bash
npm run db:bootstrap
```

## Troubleshooting

### Connection Issues

If you encounter connection issues, check:

1. Is PostgreSQL running?
2. Is your `DATABASE_URL` correct?
3. Do you have the correct username and password?
4. Does the database exist?
5. Does your user have the necessary permissions?

### Schema Issues

If you encounter schema-related errors:

1. Ensure you've run `npm run prisma:generate` after any schema changes
2. Check if your schema.prisma file has any validation errors
3. For production environments, always use migrations with `npm run db:migrate`

## Using Prisma Accelerate (Optional)

For improved performance, especially in serverless environments:

1. Sign up for Prisma Accelerate at [prisma.io/data-platform](https://prisma.io/data-platform)
2. Add your Prisma Accelerate URL to your .env file:
   ```
   PRISMA_ACCELERATE_URL="prisma://accelerate.prisma-data.net/?api_key=your_api_key"
   ```
3. Uncomment the `directUrl` line in `prisma/schema.prisma`
4. Run `npm run prisma:generate` to update your Prisma client

## Next Steps

After setting up your database:

1. Start the development server with `npm run dev`
2. Visit [http://localhost:3000](http://localhost:3000) to view your application
3. Use the file upload functionality to import WiFi data
4. The data will be stored in your database according to the AccessPoint model