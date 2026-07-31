'use client';

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface InventoryChartProps {
  data: Record<string, number>;
}

export function InventoryChart({ data }: InventoryChartProps) {
  if (!data) return null;

  const chartData = Object.entries(data).map(([group, count]) => ({
    name: group,
    units: count,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
        <XAxis 
          dataKey="name" 
          tickLine={false} 
          axisLine={false} 
          tick={{ fontSize: 12 }} 
          dy={10}
        />
        <YAxis 
          tickLine={false} 
          axisLine={false} 
          tick={{ fontSize: 12 }} 
          dx={-10}
        />
        <Tooltip 
          cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }} 
          contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
        />
        <Bar 
          dataKey="units" 
          fill="hsl(var(--brand))" 
          radius={[4, 4, 0, 0]} 
          maxBarSize={50}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
