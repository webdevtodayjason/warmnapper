# WARMAPPER-T3 🌐📡

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Version](https://img.shields.io/badge/version-1.0.0-green.svg)
![T3 Stack](https://img.shields.io/badge/T3%20Stack-TypeScript%20|%20Tailwind%20|%20tRPC-blue)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![Prisma](https://img.shields.io/badge/Prisma-6.8-white)

WARMAPPER is a modern WiFi network discovery and mapping tool built with the T3 Stack (TypeScript, Tailwind CSS, and tRPC). It helps security researchers and network administrators visualize and analyze WiFi networks from Wigle WiFi-compatible scans.

<p align="center">
  <img src="https://raw.githubusercontent.com/webdevtodayjason/warmnapper/main/public/warmapper-preview.png" alt="WARMAPPER Preview" width="800">
</p>

## ✨ Features

- 🗺️ **Interactive Maps**: Visualize WiFi networks on Google Maps
- 📊 **Dashboard Analytics**: Comprehensive WiFi network statistics
- 🔍 **Security Analysis**: Categorize networks by security level
- 📡 **Signal Insights**: Analyze signal strength and coverage
- 📂 **Data Sharing**: Share WiFi data with the community
- 🔄 **Real-time Parsing**: Parse and process WiFi scan data instantly
- 🌐 **Community Database**: Access shared WiFi data from other users

## 🚀 Live Demo

Check out the live demo at [warmapper-t3.vercel.app](https://warmapper-t3.vercel.app)

## 📋 Table of Contents

- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Database Setup](#-database-setup)
- [Environment Setup](#-environment-setup)
- [Usage](#-usage)
- [Project Structure](#-project-structure)
- [Technologies](#-technologies)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)
- [License](#-license)
- [Contact](#-contact)

## 🔍 Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v18.x or later)
- [npm](https://www.npmjs.com/) (v10.x or later)
- [PostgreSQL](https://www.postgresql.org/) (v15.x or later)
- [Git](https://git-scm.com/)

## 🔧 Installation

```bash
# Clone the repository
git clone https://github.com/webdevtodayjason/warmnapper.git
cd warmnapper

# Install dependencies
npm install
```

## 🗄️ Database Setup

WARMAPPER uses PostgreSQL for data storage. You can set up the database either manually or using our automated bootstrap script.

### Option 1: Automated Setup (Recommended)

Our automated database bootstrap script will:
- Check if PostgreSQL is running
- Verify your DATABASE_URL environment variable
- Create the database if it doesn't exist
- Generate the Prisma client
- Push the schema to your database

```bash
# Run the database bootstrap script
npm run db:bootstrap
```

### Option 2: Manual Setup

1. Create a PostgreSQL database:

```bash
# Connect to PostgreSQL
psql -U postgres

# Create the database
CREATE DATABASE warmapper;

# Grant permissions (replace 'your_username' with your PostgreSQL username)
GRANT ALL PRIVILEGES ON DATABASE warmapper TO your_username;

# Exit psql
\q
```

2. Generate the Prisma client and sync the schema:

```bash
# Generate Prisma client
npm run prisma:generate

# Push schema changes to the database
npm run db:push
```

## 🔐 Environment Setup

Create a `.env.local` file in the root directory with the following:

```
# Required: Google Maps API Key
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# Required: PostgreSQL Database URL
DATABASE_URL="postgresql://postgres:password@localhost:5432/warmapper?schema=public"

# Optional: For production, set NODE_ENV to "production"
NODE_ENV="development"

# Skip environment validation during development
SKIP_ENV_VALIDATION=true
```

Note: The `DATABASE_URL` must be defined in `.env.local` for proper operation.

## 📚 Usage

1. **Start the application**:
   ```bash
   npm run dev
   ```

2. **Open your browser**:
   Navigate to `http://localhost:3000`

3. **Upload WiFi Data**:
   - Use the upload button or drag and drop a WiFi scan file
   - Sample data is available in `public/data/` directory
   - Choose whether to share the data with the community
   - If sharing, provide your city and state information

4. **Explore the Map**:
   - View WiFi networks plotted on the map
   - Toggle between security and signal strength views
   - Click on markers to see detailed information

5. **Analyze Statistics**:
   - Check the dashboard for comprehensive statistics
   - View distribution charts for security levels, channels, etc.

6. **Share Data**:
   - Your uploaded WiFi data can be stored in the PostgreSQL database
   - You can choose to share it publicly with the community

## 📁 Project Structure

```
WARMAPPER-T3/
├── prisma/                 # Database schema and migrations
├── public/                 # Static assets and sample data
│   ├── data/               # Sample WiFi data files
├── scripts/                # Utility scripts
│   ├── bootstrap-db.js     # Database bootstrap script
│   ├── init-db.js          # Database initialization script
├── src/
│   ├── app/                # Next.js App Router pages
│   │   ├── api/            # API routes
│   │   │   ├── access-points/ # WiFi data API endpoint
│   ├── components/         # React components
│   │   ├── charts/         # Dashboard chart components
│   │   ├── dashboard/      # Dashboard UI components
│   │   ├── map/            # Map visualization components
│   │   ├── providers/      # Context providers
│   │   └── ui/             # UI components (shadcn/ui)
│   ├── contexts/           # React context providers
│   │   ├── wifi-context.tsx # WiFi data context
│   │   ├── enhanced-wifi-context.tsx # Enhanced WiFi context
│   ├── generated/          # Generated code
│   │   ├── prisma/         # Generated Prisma client
│   ├── lib/                # Utility functions
│   │   ├── utils.ts        # General utilities
│   │   └── wifi-utils.ts   # WiFi data processing utilities
│   ├── server/             # Server-side code
│   │   ├── db.ts           # Prisma client initialization
│   ├── services/           # Data services
│   │   ├── wifi-data-service.ts # WiFi data service
│   ├── styles/             # Global styles
│   └── types/              # TypeScript type definitions
├── .env.example            # Example environment variables
├── .env.local              # Local environment variables (not in git)
├── DATABASE-SETUP.md       # Detailed database setup guide
├── next.config.js          # Next.js configuration
├── package.json            # Project dependencies
├── tailwind.config.js      # Tailwind CSS configuration
└── tsconfig.json           # TypeScript configuration
```

## 🛠️ Technologies

- **Frontend**:
  - [Next.js](https://nextjs.org/) 14 - React framework with App Router
  - [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
  - [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
  - [shadcn/ui](https://ui.shadcn.com/) - UI components
  - [React Hook Form](https://react-hook-form.com/) - Form handling
  - [Zod](https://zod.dev/) - Schema validation

- **Backend**:
  - [Next.js API Routes](https://nextjs.org/docs/api-routes) - Serverless functions
  - [Prisma](https://prisma.io/) - Database ORM
  - [PostgreSQL](https://www.postgresql.org/) - Database

- **Maps & Visualization**:
  - [Google Maps API](https://developers.google.com/maps) - Map visualization
  - [Recharts](https://recharts.org/) - Data visualization

- **DevOps**:
  - [Vercel](https://vercel.com/) - Deployment platform
  - [GitHub Actions](https://github.com/features/actions) - CI/CD

## 🔧 Troubleshooting

### Database Connection Issues

If you encounter database connection issues:

1. **Check if PostgreSQL is running**:
   ```bash
   ps aux | grep postgres
   ```

2. **Verify your DATABASE_URL in `.env.local`**:
   - The URL should be in the format: `postgresql://username:password@localhost:5432/dbname`
   - Make sure the DATABASE_URL is defined in `.env.local` (not just `.env`)

3. **Run the database bootstrap script**:
   ```bash
   npm run db:bootstrap
   ```

4. **Check Prisma client generation**:
   ```bash
   npm run prisma:generate
   ```

5. **Try direct connection to the database**:
   ```bash
   psql -U postgres -h localhost -d warmapper
   ```

For detailed troubleshooting guidance, refer to the `DATABASE-SETUP.md` file.

### Common Issues

- **"Prisma client was not initialized"**: Usually means the DATABASE_URL is missing in `.env.local` or PostgreSQL isn't running
- **"Cannot find module '@/generated/prisma'"**: Run `npm run prisma:generate` to generate the Prisma client
- **Mapping issues**: Ensure your Google Maps API key is properly set in `.env.local`

## 👨‍💻 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Set up the database using instructions above
4. Commit your changes (`git commit -m 'Add some amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📬 Contact

Project Link: [github.com/webdevtodayjason/warmnapper](https://github.com/webdevtodayjason/warmnapper)

---

<p align="center">
  Made with ❤️ by <a href="https://github.com/webdevtodayjason">Jason Brashear</a>
</p>