'use client';

import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface PlanData {
  name: string;
  value: string | number;
  color: string;
}

export function SubscriptionBreakdown({ data }: { data: PlanData[] }) {
  if (!data || data.length === 0) return null;

  return (
    <Card className="h-full min-h-[380px] flex flex-col">
      <CardHeader>
        <CardTitle>Plan Distribution</CardTitle>
        <CardDescription>Breakdown of active businesses by subscription plan</CardDescription>
      </CardHeader>

      <div className="flex-1 flex flex-col items-center justify-center mt-4">
        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-lg border border-brand-border bg-white px-3 py-2 shadow-xl">
                        <div className="flex items-center gap-2">
                          <span
                            className="h-3 w-3 rounded-full"
                            style={{ backgroundColor: payload[0].payload.color }}
                          />
                          <span className="text-sm font-medium text-brand-dark">
                            {payload[0].name}: {payload[0].value}
                          </span>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="mt-4 grid w-full grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3 px-2">
          {data.map((item) => (
            <div key={item.name} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-xs text-brand-muted">{item.name}</span>
              </div>
              <span className="text-xs font-semibold text-brand-dark">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
