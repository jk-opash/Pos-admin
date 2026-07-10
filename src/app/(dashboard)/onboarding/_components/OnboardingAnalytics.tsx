'use client';
import colors from '@/config/colors.json';

import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, Legend
} from 'recharts';

const dailyTrends = [
  { date: 'Jul 1', registrations: 12, approved: 8 },
  { date: 'Jul 2', registrations: 15, approved: 10 },
  { date: 'Jul 3', registrations: 18, approved: 12 },
  { date: 'Jul 4', registrations: 22, approved: 15 },
  { date: 'Jul 5', registrations: 14, approved: 9 },
  { date: 'Jul 6', registrations: 25, approved: 18 },
  { date: 'Jul 7', registrations: 30, approved: 22 },
];

const industryDistribution = [
  { name: 'Restaurant', value: 45 },
  { name: 'Retail', value: 30 },
  { name: 'Pharmacy', value: 15 },
  { name: 'Salon', value: 10 },
];

const planConversion = [
  { name: 'Free Trial', value: 50 },
  { name: 'Basic', value: 20 },
  { name: 'Standard', value: 20 },
  { name: 'Professional', value: 10 },
];

const COLORS = [colors.primary, colors.success, colors.warning, colors.pink];

export function OnboardingAnalytics() {
  return (
    <div className="space-y-6">
      
      {/* Daily Trends Chart */}
      <div className="border border-brand-border rounded-xl p-5 bg-white">
        <h3 className="text-base font-semibold text-brand-dark mb-4">Daily Registration Trends</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={dailyTrends}>
              <defs>
                <linearGradient id="colorReg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={colors.primary} stopOpacity={0.1}/>
                  <stop offset="95%" stopColor={colors.primary} stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorApp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={colors.success} stopOpacity={0.1}/>
                  <stop offset="95%" stopColor={colors.success} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: colors.muted }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: colors.muted }} dx={-10} />
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={colors.border} />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Area type="monotone" dataKey="registrations" name="New Registrations" stroke={colors.primary} strokeWidth={3} fillOpacity={1} fill="url(#colorReg)" />
              <Area type="monotone" dataKey="approved" name="Approved Tenants" stroke={colors.success} strokeWidth={3} fillOpacity={1} fill="url(#colorApp)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Industry Distribution */}
        <div className="border border-brand-border rounded-xl p-5 bg-white">
          <h3 className="text-base font-semibold text-brand-dark mb-4">Industry Distribution</h3>
          <div className="h-[250px]">
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
                  {industryDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Plan Conversion */}
        <div className="border border-brand-border rounded-xl p-5 bg-white">
          <h3 className="text-base font-semibold text-brand-dark mb-4">Subscription Selection</h3>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={planConversion} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={colors.border} />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: colors.muted }} />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: colors.dark, fontWeight: 500 }} />
                <Tooltip cursor={{ fill: colors.light }} contentStyle={{ borderRadius: '8px' }} />
                <Bar dataKey="value" name="Businesses" fill={colors.primary} radius={[0, 4, 4, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}
