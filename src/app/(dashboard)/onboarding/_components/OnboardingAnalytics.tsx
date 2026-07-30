'use client';

import colors from '@/config/colors.json';
import { useAppSelector } from '@/store/hooks';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, Legend
} from 'recharts';

const PALETTE = [
  colors.primary,
  colors.success,
  colors.warning,
  colors.pink,
  colors.purple,
  colors.teal,
  colors.info,
  colors.danger,
];

export function OnboardingAnalytics() {
  const { businesses, onboardingRequests } = useAppSelector(
    (state: any) => state.business
  );

  // Deduplicate businesses and onboarding requests by ID to avoid double counting
  const itemMap = new Map();
  businesses.forEach((b: any) => itemMap.set(b.id, b));
  onboardingRequests.forEach((r: any) => {
    if (!itemMap.has(r.id)) {
      itemMap.set(r.id, r);
    }
  });
  const allItems = Array.from(itemMap.values());

  // 1. Compute Daily Registration Trends (Last 7 Days)
  const dailyTrendsMap: Record<
    string,
    { date: string; rawDate: string; registrations: number; approved: number }
  > = {};

  // Initialize last 7 days with 0 values
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
    const key = d.toISOString().split('T')[0];
    dailyTrendsMap[key] = {
      date: dateStr,
      rawDate: key,
      registrations: 0,
      approved: 0,
    };
  }

  allItems.forEach((item: any) => {
    const rawDate = item.created_at || item.createdAt || item.startedAt;
    if (!rawDate) return;
    const dateObj = new Date(rawDate);
    if (isNaN(dateObj.getTime())) return;

    const key = dateObj.toISOString().split('T')[0];
    if (!dailyTrendsMap[key]) {
      const dateStr = dateObj.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
      dailyTrendsMap[key] = {
        date: dateStr,
        rawDate: key,
        registrations: 0,
        approved: 0,
      };
    }

    dailyTrendsMap[key].registrations += 1;
    const status = (item.status || '').toLowerCase();
    if (
      status === 'active' ||
      status === 'approved' ||
      status === 'completed'
    ) {
      dailyTrendsMap[key].approved += 1;
    }
  });

  const dailyTrends = Object.values(dailyTrendsMap)
    .sort((a, b) => a.rawDate.localeCompare(b.rawDate))
    .slice(-7);

  // 2. Compute Industry Distribution
  const industryCounts: Record<string, number> = {};
  allItems.forEach((item: any) => {
    const type =
      item.business_type ||
      item.type ||
      item.businessType ||
      item.industry ||
      'Retail';
    const formatted =
      type.charAt(0).toUpperCase() + type.slice(1).replace(/_/g, ' ');
    industryCounts[formatted] = (industryCounts[formatted] || 0) + 1;
  });

  const industryDistribution = Object.entries(industryCounts).map(
    ([name, value]) => ({
      name,
      value,
    })
  );

  // 3. Compute Subscription Selection
  const planCounts: Record<string, number> = {};
  allItems.forEach((item: any) => {
    const rawPlan =
      item.subscription_plan?.plan ||
      item.subscription_plan?.name ||
      item.subscription?.plan ||
      (item.status === 'trial' ? 'Free Trial' : 'Free Trial');

    const formatted = rawPlan
      ? rawPlan.charAt(0).toUpperCase() + rawPlan.slice(1).replace(/_/g, ' ')
      : 'Free Trial';
    planCounts[formatted] = (planCounts[formatted] || 0) + 1;
  });

  const planConversion = Object.entries(planCounts).map(([name, value]) => ({
    name,
    value,
  }));

  return (
    <div className="space-y-6">
      {/* Daily Trends Chart */}
      <div className="border border-brand-border rounded-xl p-5 bg-white">
        <h3 className="text-base font-semibold text-brand-dark mb-4">
          Daily Registration Trends
        </h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={dailyTrends}>
              <defs>
                <linearGradient id="colorReg" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor={colors.primary}
                    stopOpacity={0.1}
                  />
                  <stop
                    offset="95%"
                    stopColor={colors.primary}
                    stopOpacity={0}
                  />
                </linearGradient>
                <linearGradient id="colorApp" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor={colors.success}
                    stopOpacity={0.1}
                  />
                  <stop
                    offset="95%"
                    stopColor={colors.success}
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: colors.muted }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: colors.muted }}
                dx={-10}
              />
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke={colors.border}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: '8px',
                  border: 'none',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                }}
              />
              <Area
                type="monotone"
                dataKey="registrations"
                name="New Registrations"
                stroke={colors.primary}
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorReg)"
              />
              <Area
                type="monotone"
                dataKey="approved"
                name="Approved Tenants"
                stroke={colors.success}
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorApp)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Industry Distribution */}
        <div className="border border-brand-border rounded-xl p-5 bg-white">
          <h3 className="text-base font-semibold text-brand-dark mb-4">
            Industry Distribution
          </h3>
          <div className="h-[250px]">
            {industryDistribution.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={industryDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {industryDistribution.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={PALETTE[index % PALETTE.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-brand-muted">
                No industry data available yet.
              </div>
            )}
          </div>
        </div>

        {/* Plan Conversion */}
        <div className="border border-brand-border rounded-xl p-5 bg-white">
          <h3 className="text-base font-semibold text-brand-dark mb-4">
            Subscription Selection
          </h3>
          <div className="h-[250px]">
            {planConversion.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={planConversion}
                  layout="vertical"
                  margin={{ left: 20 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    horizontal={false}
                    stroke={colors.border}
                  />
                  <XAxis
                    type="number"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: colors.muted }}
                  />
                  <YAxis
                    dataKey="name"
                    type="category"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: colors.dark, fontWeight: 500 }}
                  />
                  <Tooltip
                    cursor={{ fill: colors.light }}
                    contentStyle={{ borderRadius: '8px' }}
                  />
                  <Bar
                    dataKey="value"
                    name="Businesses"
                    fill={colors.primary}
                    radius={[0, 4, 4, 0]}
                    barSize={24}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-brand-muted">
                No subscription data available yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
