"use client";

import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useEnhancedWiFi } from '@/contexts/enhanced-wifi-context';

interface ChartProps {
  height?: number | string;
}

export const AuthTypesPieChart = ({ height = 240 }: ChartProps) => {
  const { authModeDistribution } = useEnhancedWiFi();
  
  // Return empty container if no data
  if (!authModeDistribution || authModeDistribution.length === 0) {
    return <div style={{ width: '100%', height, display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#aaa' }}>No data available</div>;
  }
  
  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={authModeDistribution}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {authModeDistribution.map((entry, index) => (
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
  );
};

export const ChannelBarChart = ({ height = 240 }: ChartProps) => {
  const { channelDistribution } = useEnhancedWiFi();
  
  // Return empty container if no data
  if (!channelDistribution || channelDistribution.length === 0) {
    return <div style={{ width: '100%', height, display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#aaa' }}>No data available</div>;
  }
  
  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={channelDistribution}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="channel" />
          <YAxis />
          <Tooltip 
            formatter={(value) => [`${value} networks`, 'Count']}
            contentStyle={{ backgroundColor: 'rgba(22, 22, 26, 0.9)', borderColor: 'rgba(100, 100, 100, 0.5)' }}
          />
          <Bar dataKey="count" fill="#4ade80" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export const SecurityPieChart = ({ height = 240 }: ChartProps) => {
  const { securityDistribution } = useEnhancedWiFi();

  // Transform data to the format expected by the chart
  const securityData = securityDistribution.map(item => ({
    name: item.security,
    value: item.count,
    color: item.color
  }));
  
  // Return empty container if no data
  if (!securityData || securityData.length === 0) {
    return <div style={{ width: '100%', height, display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#aaa' }}>No data available</div>;
  }
  
  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={securityData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            nameKey="name"
          >
            {securityData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value, name) => [`${value} networks`, name]}
            contentStyle={{ backgroundColor: 'rgba(22, 22, 26, 0.9)', borderColor: 'rgba(100, 100, 100, 0.5)' }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export const SignalPieChart = ({ height = 240 }: ChartProps) => {
  const { signalDistribution } = useEnhancedWiFi();

  // Transform data to the format expected by the chart
  const signalData = signalDistribution.map(item => ({
    name: item.signal,
    value: item.count,
    color: item.color
  }));
  
  // Return empty container if no data
  if (!signalData || signalData.length === 0) {
    return <div style={{ width: '100%', height, display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#aaa' }}>No data available</div>;
  }
  
  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={signalData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            nameKey="name"
          >
            {signalData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value, name) => [`${value} networks`, name]}
            contentStyle={{ backgroundColor: 'rgba(22, 22, 26, 0.9)', borderColor: 'rgba(100, 100, 100, 0.5)' }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};