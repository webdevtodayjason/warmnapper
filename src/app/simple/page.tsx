"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wifi, Shield, Activity, Radio } from "lucide-react";

export default function SimpleDashboard() {
  return (
    <main className="container py-8 text-white">
      <h1 className="text-3xl font-bold mb-8">Simple Dashboard</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCard 
          title="Total Networks" 
          value="34" 
          description="WiFi networks detected"
          icon={<Wifi className="h-4 w-4 text-muted-foreground" />}
        />
        <StatCard 
          title="Unique Networks" 
          value="18" 
          description="Unique SSIDs found"
          icon={<Radio className="h-4 w-4 text-muted-foreground" />}
        />
        <StatCard 
          title="Open Networks" 
          value="17.6%" 
          description="6 networks without security"
          icon={<Shield className="h-4 w-4 text-muted-foreground" />}
        />
        <StatCard 
          title="Average Signal" 
          value="-81.4 dBm" 
          description="Avg. RSSI value"
          icon={<Activity className="h-4 w-4 text-muted-foreground" />}
        />
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 mb-8">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle>Authentication Types</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80 flex items-center justify-center bg-gray-900/50 rounded-lg">
              <p className="text-lg">Pie chart would appear here</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle>Channel Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80 flex items-center justify-center bg-gray-900/50 rounded-lg">
              <p className="text-lg">Bar chart would appear here</p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle>Security Levels</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80 flex items-center justify-center bg-gray-900/50 rounded-lg">
              <p className="text-lg">Pie chart would appear here</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle>Signal Strength</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80 flex items-center justify-center bg-gray-900/50 rounded-lg">
              <p className="text-lg">Pie chart would appear here</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

function StatCard({ title, value, description, icon }: { 
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}