"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function TroubleshootPage() {
  const router = useRouter();

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">WARMAPPER T3 Troubleshooting</h1>
      
      <div className="p-4 bg-amber-700/20 border border-amber-600 rounded-lg mb-8">
        <h2 className="text-xl font-semibold text-amber-400 mb-2">Troubleshooting Instructions</h2>
        <p className="mb-4">
          Use the buttons below to navigate to different test pages that can help isolate rendering issues.
        </p>
        <p>
          Each test page focuses on different aspects of the application to help identify which component
          might be causing problems.
        </p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Basic Components</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Tests basic styling and UI components without any charts or data dependencies.</p>
            <Button 
              className="w-full" 
              onClick={() => router.push('/basic')}
            >
              Go to Basic Test
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Static Charts</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Tests chart rendering with static data instead of using the WiFi context.</p>
            <Button 
              className="w-full" 
              onClick={() => router.push('/test')}
            >
              Go to Chart Test
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Simple Dashboard</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">A simplified version of the dashboard with placeholder charts and static data.</p>
            <Button 
              className="w-full" 
              onClick={() => router.push('/simple')}
            >
              Go to Simple Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
      
      <div className="mb-8">
        <Button 
          variant="outline" 
          className="mr-4" 
          onClick={() => router.push('/')}
        >
          Back to Main App
        </Button>
        
        <Button 
          variant="secondary"
          onClick={() => router.push('/debug')}
        >
          Debug Page
        </Button>
      </div>
      
      <div className="border border-gray-700 rounded-lg p-6 bg-gray-900/50">
        <h2 className="text-xl font-semibold mb-4">Common Issues</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>Styling issues: Make sure Tailwind is configured correctly and dark mode is enabled</li>
          <li>Chart rendering: Check if recharts components have proper sizes and container elements</li>
          <li>Data loading: Verify sample data is properly loaded from public/data directory</li>
          <li>Component rendering: All interactive components need the "use client" directive</li>
          <li>Context errors: WiFi context provider might not be passing data correctly</li>
        </ul>
      </div>
    </div>
  );
}