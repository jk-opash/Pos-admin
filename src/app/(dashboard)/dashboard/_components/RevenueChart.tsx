'use client';

import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { formatCurrency } from '@/lib/utils';
import { RevenueDataPoint } from '@/types';
import colors from '@/config/colors.json';
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';

export function RevenueChart({ data }: { data: RevenueDataPoint[] }) {
  // If recharts is not yet ready during build/first load, we render a fallback
  if (!data || data.length === 0) return null;

  return (
    <Card className="h-full min-h-[380px] flex flex-col">
      <CardHeader>
        <CardTitle>Revenue Overview</CardTitle>
        <CardDescription>Monthly Recurring Revenue (MRR) over the last 12 months</CardDescription>
      </CardHeader>

      <div className="flex-1 mt-4">
        <ResponsiveContainer width="100%" height="100%" minHeight={300}>
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorMrr" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={colors.primary} stopOpacity={0.3} />
                <stop offset="95%" stopColor={colors.primary} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={colors.border} />
            <XAxis
              dataKey="month"
              stroke="#545872"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#545872"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => formatCurrency(value, true)}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-lg border border-brand-border bg-white p-3 shadow-xl">
                      <p className="mb-2 text-xs font-semibold text-brand-muted">{label}</p>
                      <div className="flex flex-col gap-1">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 gap-4">
                          <span className="text-sm text-brand-dark">MRR</span>
                          <span className="text-sm font-bold text-brand-dark">
                            {formatCurrency(payload[0].value as number)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              type="monotone"
              dataKey="mrr"
              stroke={colors.primary}
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorMrr)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
