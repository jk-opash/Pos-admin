'use client';

import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import colors from '@/config/colors.json';

export function IndustryDistribution({ data }: { data: { name: string; value: number }[] }) {
  if (!data || data.length === 0) return null;

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#6366F1', '#94A3B8'];

  return (
    <Card className="h-full min-h-[380px] flex flex-col">
      <CardHeader>
        <CardTitle>Industry Distribution</CardTitle>
        <CardDescription>Businesses categorized by their industry</CardDescription>
      </CardHeader>

      <div className="flex-1 mt-4">
        <ResponsiveContainer width="100%" height="100%" minHeight={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ borderRadius: '8px', border: `1px solid ${colors.border}`, boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              itemStyle={{ color: '#0F172A', fontSize: '14px', fontWeight: 600 }}
            />
            <Legend verticalAlign="bottom" height={36} iconType="circle" />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
