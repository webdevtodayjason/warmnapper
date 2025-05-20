"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Wifi, Shield, Activity, Radio } from "lucide-react";

// Sample data
const sampleData = [
  { name: "WPA2_PSK", value: 45, color: "#a3e635" },
  { name: "WPA_WPA2_PSK", value: 20, color: "#34d399" },
  { name: "OPEN", value: 15, color: "#f87171" },
  { name: "WPA3_PSK", value: 10, color: "#38bdf8" },
  { name: "WEP", value: 5, color: "#fb923c" },
];

export default function TestPage() {
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Test Dashboard</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <StatCard 
          title="Total Networks" 
          value="95" 
          description="WiFi networks detected"
          icon={<Wifi className="h-4 w-4 text-muted-foreground" />}
        />
        <StatCard 
          title="Unique Networks" 
          value="42" 
          description="Unique SSIDs found"
          icon={<Radio className="h-4 w-4 text-muted-foreground" />}
        />
        <StatCard 
          title="Open Networks" 
          value="15.8%" 
          description="15 networks without security"
          icon={<Shield className="h-4 w-4 text-muted-foreground" />}
        />
        <StatCard 
          title="Average Signal" 
          value="-72.3 dBm" 
          description="Avg. RSSI value"
          icon={<Activity className="h-4 w-4 text-muted-foreground" />}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 mb-6">
        <Card className="dashboard-card">
          <CardHeader>
            <CardTitle>Authentication Types</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sampleData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {sampleData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value, name) => [`${value} networks`, name]}
                    contentStyle={{ backgroundColor: 'rgba(22, 22, 26, 0.9)', borderColor: 'rgba(100, 100, 100, 0.5)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card className="dashboard-card">
          <CardHeader>
            <CardTitle>Test UI Elements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-foreground">This is a test card to verify UI components.</p>
              
              <div className="flex gap-2">
                <Button variant="default">Default</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="destructive">Destructive</Button>
              </div>
              
              <div className="h-20 rounded-md bg-primary/20 flex items-center justify-center">
                Primary Background
              </div>
              
              <div className="h-20 rounded-md bg-secondary/20 flex items-center justify-center">
                Secondary Background
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="p-4 border rounded-md bg-yellow-500/10 mb-6">
        <h2 className="text-xl font-bold mb-2">Troubleshooting</h2>
        <p>If this page is displaying properly with styles and charts but the main app isn't, there might be an issue with the WiFi context data.</p>
      </div>
    </div>
  );
}

function StatCard({ title, value, description, icon }: { 
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <Card className="dashboard-card">
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