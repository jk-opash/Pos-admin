'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '@/lib/utils';
import colors from '@/config/colors.json';

export function GeographicAnalytics({ data }: { data: { country: string; businesses: number; revenue: number }[] }) {
  return (
    <div className="bg-white border border-brand-border rounded-xl p-5">
      <div className="mb-4">
        <h3 className="text-base font-semibold text-brand-dark">Geographic Analytics</h3>
        <p className="text-sm text-brand-muted">Registered businesses by top countries</p>
      </div>
      
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ left: 40, right: 20 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke={colors.border} />
            <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: colors.muted }} />
            <YAxis 
              dataKey="country" 
              type="category" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 12, fill: colors.dark, fontWeight: 500 }} 
            />
            <Tooltip 
              cursor={{ fill: colors.light }} 
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              formatter={(value: any, name: any) => {
                if (name === 'revenue') return [formatCurrency(value), 'Revenue'];
                return [value, 'Businesses'];
              }}
            />
            <Bar dataKey="businesses" name="businesses" fill={colors.primary} radius={[0, 4, 4, 0]} barSize={20} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
