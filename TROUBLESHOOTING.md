# Troubleshooting Guide for WARMAPPER T3

If you're encountering issues with the WARMAPPER T3 project, here are some common problems and solutions.

## UI Styling Issues

If the application is displaying plain text without styling, charts, or proper layout:

1. **Check the CSS Loading**
   - Make sure `globals.css` is properly imported in `src/app/layout.tsx`
   - Verify Tailwind CSS is correctly configured in `tailwind.config.js`

2. **Fix Client-Side Components**
   - Make sure all interactive components have the `"use client"` directive at the top
   - Check component files in `src/components/ui/` to ensure they all have the directive

3. **Verify Dark Mode**
   - Add `className="dark"` to the `<html>` tag in `src/app/layout.tsx`
   - Set the `defaultTheme` in ThemeProvider to `"dark"`

## Chart Rendering Issues

If charts and visualizations aren't appearing:

1. **Check Data Flow**
   - The WiFi context should be providing data to the components
   - Add console logs to verify data is being received by chart components

2. **Debug with Static Data**
   - Use `/app/test/page.tsx` or `/app/simple/page.tsx` to verify charts work with static data
   - If static charts work but dynamic ones don't, the issue is with data loading

## Data Loading Problems

If sample data isn't loading properly:

1. **Verify Public Directory**
   - Ensure data files exist in `/public/data/`
   - Sample data files should be accessible at `/data/sample-data.txt`

2. **Check Error Handling**
   - The WiFi context has fallback handling with default data
   - Check the browser console for any error messages during data loading

3. **Fetch Path Issues**
   - In Next.js, public files are accessed from the root, e.g., `/data/filename.txt`
   - Verify the path in `wifi-context.tsx` is correct

## Next.js Configuration

If there are build or runtime errors:

1. **Check Environment Setup**
   - Ensure `.env.local` has the required environment variables
   - For development, you can set `SKIP_ENV_VALIDATION=true`

2. **Update Next.js Config**
   - Verify that `next.config.js` is properly configured
   - Include necessary experimental features if needed

## Google Maps Integration

If the map isn't loading correctly:

1. **API Key Configuration**
   - Make sure `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` is set in `.env.local`
   - For development purposes, you can even use Google Maps without an API key

2. **Script Loading**
   - Check the script loading logic in `map-view.tsx`
   - Verify the script is being properly injected into the DOM

## Test Pages

For troubleshooting, you can use these test pages:

- `/basic` - Basic UI components without complex data
- `/test` - Test page with static chart data
- `/simple` - Simplified dashboard with placeholder visuals
- `/debug` - Detailed debugging information

These pages don't rely on the WiFi context and should render correctly even if there are issues with data loading.

## Quick Fixes

If you just want to get the application working quickly:

1. Use the simplified version without dynamic data:
   ```tsx
   // src/app/page.tsx
   export { default } from './simple/page';
   ```

2. Or use the test page with static chart data:
   ```tsx
   // src/app/page.tsx
   export { default } from './test/page';
   ```