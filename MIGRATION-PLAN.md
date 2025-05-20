# WARMAPPER Migration Plan

After setting up the T3 Stack project, follow these steps to migrate your WARMAPPER code:

## 1. Directory Structure Preparation

T3 uses a slightly different structure than your current project. Here's how to map your files:

| Current Location | T3 Location |
|-----------------|-------------|
| `/src/app/globals.css` | `/src/styles/globals.css` |
| `/src/app/layout.tsx` | `/src/app/layout.tsx` |
| `/src/app/page.tsx` | `/src/app/page.tsx` |
| `/src/components/*` | `/src/components/*` |
| `/src/contexts/*` | `/src/contexts/*` |
| `/src/lib/*` | `/src/lib/*` |
| `/src/types/*` | `/src/types/*` |
| `/src/data/*` | `/public/data/*` |

## 2. Files Migration Order

1. First, copy your type definitions:
   ```bash
   cp /Users/jasonbrashear/code/WARMAPPER/src/types/index.ts /Users/jasonbrashear/code/WARMAPPER-T3/src/types/index.ts
   ```

2. Copy utility functions:
   ```bash
   cp /Users/jasonbrashear/code/WARMAPPER/src/lib/wifi-utils.ts /Users/jasonbrashear/code/WARMAPPER-T3/src/lib/wifi-utils.ts
   ```

3. Create the data directory for sample data:
   ```bash
   mkdir -p /Users/jasonbrashear/code/WARMAPPER-T3/public/data
   cp /Users/jasonbrashear/code/WARMAPPER/src/data/sample-data.txt /Users/jasonbrashear/code/WARMAPPER-T3/public/data/
   cp /Users/jasonbrashear/code/WARMAPPER/src/data/wardrive_1.log /Users/jasonbrashear/code/WARMAPPER-T3/public/data/
   ```

4. Copy contexts:
   ```bash
   cp /Users/jasonbrashear/code/WARMAPPER/src/contexts/wifi-context.tsx /Users/jasonbrashear/code/WARMAPPER-T3/src/contexts/wifi-context.tsx
   ```
   
   Note: You'll need to update the imports in this file to use the new path to sample data:
   ```diff
   - import sampleData from '@/data/sample-data.txt';
   + import sampleData from '@/public/data/sample-data.txt';
   ```

5. Copy components:
   ```bash
   mkdir -p /Users/jasonbrashear/code/WARMAPPER-T3/src/components/dashboard
   mkdir -p /Users/jasonbrashear/code/WARMAPPER-T3/src/components/map

   cp /Users/jasonbrashear/code/WARMAPPER/src/components/theme-provider.tsx /Users/jasonbrashear/code/WARMAPPER-T3/src/components/theme-provider.tsx
   cp /Users/jasonbrashear/code/WARMAPPER/src/components/cards.tsx /Users/jasonbrashear/code/WARMAPPER-T3/src/components/cards.tsx
   
   cp /Users/jasonbrashear/code/WARMAPPER/src/components/dashboard/*.tsx /Users/jasonbrashear/code/WARMAPPER-T3/src/components/dashboard/
   cp /Users/jasonbrashear/code/WARMAPPER/src/components/map/*.tsx /Users/jasonbrashear/code/WARMAPPER-T3/src/components/map/
   ```

6. Copy app files:
   ```bash
   cp /Users/jasonbrashear/code/WARMAPPER/src/app/layout.tsx /Users/jasonbrashear/code/WARMAPPER-T3/src/app/layout.tsx
   cp /Users/jasonbrashear/code/WARMAPPER/src/app/page.tsx /Users/jasonbrashear/code/WARMAPPER-T3/src/app/page.tsx
   ```

7. Update imports for shadcn/ui components:
   - You'll need to update imports in your components to use the shadcn/ui components installed in the T3 project.
   - Note that you shouldn't copy the UI components from your old project since you'll be using the ones installed by shadcn in the new project.

## 3. Code Adjustments

After copying the files, you'll need to make these adjustments:

1. Update the import paths for global CSS in layout.tsx:
   ```diff
   - import '@/app/globals.css';
   + import '@/styles/globals.css';
   ```

2. Update the path for sample data in wifi-context.tsx:
   ```diff
   - import sampleData from '@/data/sample-data.txt';
   + import sampleData from '../../public/data/sample-data.txt';
   ```

3. Update any shadcn/ui component imports to match the new installation.

4. If you were using Google Maps, you'll need to install and configure the related packages:
   ```bash
   npm install @react-google-maps/api
   ```

## 4. Environment Variables

Create a new `.env.local` file:
```
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

## 5. Final Checks

1. Run the development server to check if the migration was successful:
   ```bash
   npm run dev
   ```

2. Check for any console errors and fix them.

3. Ensure all features work as expected:
   - Data loading
   - Map display
   - Analytics charts
   - UI components 

## 6. Optimization Opportunities

With T3 stack, consider these optimizations:
- Use tRPC if you want to add API functionality
- Consider adding authentication with NextAuth.js if needed
- Use Prisma with a database if you want to store scan results