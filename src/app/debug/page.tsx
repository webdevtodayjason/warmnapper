"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function DebugPage() {
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Debug Page</h1>
      
      <div className="grid gap-4 md:grid-cols-2 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Basic Card Test</CardTitle>
          </CardHeader>
          <CardContent>
            <p>This is a basic card to test if styling is working properly.</p>
            <Button className="mt-4">Test Button</Button>
          </CardContent>
        </Card>
        
        <Card className="bg-blue-900/20">
          <CardHeader>
            <CardTitle>Styled Card Test</CardTitle>
          </CardHeader>
          <CardContent>
            <p>This card has custom background to test if Tailwind is working.</p>
            <div className="flex gap-2 mt-4">
              <Button variant="default">Default</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="destructive">Destructive</Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="p-4 border rounded-md bg-yellow-500/10 mb-8">
        <h2 className="text-xl font-bold mb-2">Component Rendering Test</h2>
        <p>If you can see this box with a yellow background, basic Tailwind styling is working.</p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-3">
        <div className="h-32 bg-red-500/20 rounded-md flex items-center justify-center">
          Red Box
        </div>
        <div className="h-32 bg-green-500/20 rounded-md flex items-center justify-center">
          Green Box
        </div>
        <div className="h-32 bg-blue-500/20 rounded-md flex items-center justify-center">
          Blue Box
        </div>
      </div>
    </div>
  );
}