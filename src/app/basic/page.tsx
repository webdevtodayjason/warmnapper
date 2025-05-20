"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function BasicPage() {
  return (
    <div className="container py-8 text-white">
      <h1 className="text-3xl font-bold mb-6">Basic Components Test</h1>
      
      <div className="grid gap-4 md:grid-cols-2 mb-8">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle>Card Test</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">This is a basic card component to test if styling is working.</p>
            <Button>Click Me</Button>
          </CardContent>
        </Card>
        
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Manual Card</h2>
          <p className="mb-4">This is a card built with custom CSS, not using the Card component.</p>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
            Test Button
          </button>
        </div>
      </div>
      
      <div className="p-4 border border-yellow-700 bg-yellow-900/20 rounded-lg mb-8">
        <h2 className="text-xl font-bold text-yellow-500 mb-2">Troubleshooting Notice</h2>
        <p>If you can see this box with styling, Tailwind CSS is working properly.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-red-500/20 border border-red-700 rounded-lg p-6 text-center">
          Red Box
        </div>
        <div className="bg-green-500/20 border border-green-700 rounded-lg p-6 text-center">
          Green Box
        </div>
        <div className="bg-blue-500/20 border border-blue-700 rounded-lg p-6 text-center">
          Blue Box
        </div>
      </div>
    </div>
  );
}