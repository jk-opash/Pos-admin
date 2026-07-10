"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { StatsCard } from "@/components/ui/StatsCard";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import {
  Download,
  TrendingUp,
  TrendingDown,
  Calendar,
  AlertCircle,
} from "lucide-react";
import {
  mockRevenueMetrics,
  mockRevenueTrends,
  mockRevenueByIndustry,
  mockRevenueByPlan,
  mockRevenueByRegion,
  mockRevenueForecast,
  mockRevenueByPaymentMethod,
  mockRetentionTrends,
} from "@/lib/mock/revenue";
import { mockInvoices } from "@/lib/mock/subscriptions"; // reusing some invoices for recent activity
import { formatCurrency, formatDate } from "@/lib/utils";
import colors from "@/config/colors.json";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  BarChart,
  Bar,
  LineChart,
  Line,
} from "recharts";

export default function RevenueAnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState("Last 6 Months");

  // Helper for trend icons in KPI cards
  const renderTrendIcon = (trend: string) => {
    if (trend === "up")
      return <TrendingUp className="h-5 w-5 text-emerald-500" />;
    if (trend === "down")
      return <TrendingDown className="h-5 w-5 text-red-500" />;
    return <span className="h-5 w-5 text-gray-400">-</span>;
  };

  return (
    <div className="space-y-6 pb-12 mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-brand-dark">
            Revenue Analytics
          </h1>
          <p className="mt-1 text-sm text-brand-muted">
            Comprehensive financial overview, MRR tracking, and growth trends.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-48">
            <Select
              options={[
                { label: "Last 30 Days", value: "30d" },
                { label: "Last 6 Months", value: "6m" },
                { label: "Year to Date", value: "ytd" },
                { label: "All Time", value: "all" },
              ]}
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
            />
          </div>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" /> Export
          </Button>
        </div>
      </div>

      {/* Top KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {mockRevenueMetrics.map((metric, idx) => (
          <StatsCard
            key={idx}
            title={metric.title}
            value={
              metric.isCurrency
                ? formatCurrency(metric.value as number, true)
                : metric.value.toString()
            }
            icon={renderTrendIcon(metric.trend)}
            trend={{
              value: metric.growthPercentage,
              label: "vs previous period",
              positive: metric.growthPercentage > 0,
            }}
          />
        ))}
      </div>

      {/* Main Charts Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Growth Trend (Area Chart) */}
        <Card className="lg:col-span-2">
          <div className="mb-6 flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold text-brand-dark">
                Revenue Growth Trend
              </h3>
              <p className="text-xs text-brand-muted">
                Total Revenue vs Recurring Revenue
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs font-medium">
              <div className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-brand-primary"></span>{" "}
                Total
              </div>
              <div className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-brand-success"></span>{" "}
                Recurring
              </div>
            </div>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={mockRevenueTrends}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor={colors.primary}
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="95%"
                      stopColor={colors.primary}
                      stopOpacity={0}
                    />
                  </linearGradient>
                  <linearGradient
                    id="colorRecurring"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor={colors.success}
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="95%"
                      stopColor={colors.success}
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke={colors.border}
                />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: colors.muted }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: colors.muted }}
                  tickFormatter={(val) => `₹${val / 100000}L`}
                  dx={-10}
                />
                <Tooltip
                  formatter={(value: any) => formatCurrency(value, true)}
                  contentStyle={{
                    borderRadius: "8px",
                    border: `1px solid ${colors.border}`,
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="totalRevenue"
                  name="Total"
                  stroke={colors.primary}
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorTotal)"
                />
                <Area
                  type="monotone"
                  dataKey="recurringRevenue"
                  name="Recurring"
                  stroke={colors.success}
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorRecurring)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Revenue by Industry (Pie Chart) */}
        <Card>
          <div className="mb-2">
            <h3 className="text-lg font-bold text-brand-dark">
              Revenue by Industry
            </h3>
            <p className="text-xs text-brand-muted">
              Distribution of MRR across sectors
            </p>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={mockRevenueByIndustry}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {mockRevenueByIndustry.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: any) => formatCurrency(value, true)}
                  contentStyle={{
                    borderRadius: "8px",
                    border: "none",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  iconType="circle"
                  wrapperStyle={{ fontSize: "12px" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 pt-4 border-t border-brand-border">
            <Button variant="outline" className="w-full text-sm">
              View Full Breakdown
            </Button>
          </div>
        </Card>
      </div>

      {/* Secondary Metrics & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Plan Breakdown */}
        <Card>
          <h3 className="text-lg font-bold text-brand-dark mb-4">
            Revenue by Plan
          </h3>
          <div className="space-y-4">
            {mockRevenueByPlan.map((plan) => (
              <div key={plan.name}>
                <div className="flex justify-between items-end mb-1">
                  <span className="text-sm font-medium text-brand-muted">
                    {plan.name}
                  </span>
                  <span className="text-sm font-bold text-brand-dark">
                    {formatCurrency(plan.value, true)}
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div
                    className="h-2 rounded-full"
                    style={{
                      width: `${(plan.value / 600000) * 100}%`,
                      backgroundColor: plan.color,
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent High-Value Transactions */}
        <Card className="lg:col-span-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <h3 className="text-lg font-bold text-brand-dark">
              Recent Transactions
            </h3>
            <Button variant="ghost" size="sm" className="text-brand-primary">
              View All Invoices
            </Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-brand-light text-brand-muted">
                <tr>
                  <th className="px-4 py-2 font-medium rounded-l-lg">
                    Business
                  </th>
                  <th className="px-4 py-2 font-medium">Date</th>
                  <th className="px-4 py-2 font-medium">Amount</th>
                  <th className="px-4 py-2 font-medium rounded-r-lg">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {mockInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-brand-light">
                    <td className="px-4 py-3 font-medium text-brand-dark">
                      {inv.businessName}
                    </td>
                    <td className="px-4 py-3 text-brand-muted">
                      {formatDate(inv.issuedAt)}
                    </td>
                    <td className="px-4 py-3 font-semibold text-brand-dark">
                      {formatCurrency(inv.amount, true)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-semibold ${
                          inv.status === "paid"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {inv.status === "paid" ? (
                          <TrendingUp className="h-3 w-3" />
                        ) : (
                          <AlertCircle className="h-3 w-3" />
                        )}
                        {inv.status.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Additional Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Forecast */}
        <Card>
          <div className="mb-4">
            <h3 className="text-lg font-bold text-brand-dark">
              Revenue Forecast
            </h3>
            <p className="text-xs text-brand-muted">
              Projected vs Actual Revenue
            </p>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={mockRevenueForecast}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke={colors.border}
                />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: colors.muted }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: colors.muted }}
                  tickFormatter={(val) => `₹${val / 100000}L`}
                  dx={-10}
                />
                <Tooltip
                  formatter={(value: any) =>
                    formatCurrency(value as number, true)
                  }
                  contentStyle={{
                    borderRadius: "8px",
                    border: `1px solid ${colors.border}`,
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                  cursor={{ fill: "transparent" }}
                />
                <Legend
                  verticalAlign="top"
                  height={36}
                  iconType="circle"
                  wrapperStyle={{ fontSize: "12px" }}
                />
                <Bar
                  dataKey="actual"
                  name="Actual Revenue"
                  fill={colors.primary}
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="projected"
                  name="Projected Revenue"
                  fill={colors.warning}
                  radius={[4, 4, 0, 0]}
                  fillOpacity={0.6}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Revenue by Region */}
        <Card>
          <h3 className="text-lg font-bold text-brand-dark mb-4">
            Revenue by Region
          </h3>
          <div className="space-y-4">
            {mockRevenueByRegion.map((region) => (
              <div key={region.name}>
                <div className="flex justify-between items-end mb-1">
                  <span className="text-sm font-medium text-brand-muted">
                    {region.name}
                  </span>
                  <span className="text-sm font-bold text-brand-dark">
                    {formatCurrency(region.value, true)}
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div
                    className="h-2 rounded-full"
                    style={{
                      width: `${(region.value / 600000) * 100}%`,
                      backgroundColor: region.color,
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Net Revenue Retention (NRR) */}
        <Card>
          <div className="mb-4">
            <h3 className="text-lg font-bold text-brand-dark">
              Net Revenue Retention (NRR)
            </h3>
            <p className="text-xs text-brand-muted">
              Monthly retention and expansion rate (%)
            </p>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={mockRetentionTrends}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke={colors.border}
                />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: colors.muted }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: colors.muted }}
                  domain={[90, 120]}
                  tickFormatter={(val) => `${val}%`}
                  dx={-10}
                />
                <Tooltip
                  formatter={(value: any) => `${value}%`}
                  contentStyle={{
                    borderRadius: "8px",
                    border: `1px solid ${colors.border}`,
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                />
                <Legend
                  verticalAlign="top"
                  height={36}
                  iconType="circle"
                  wrapperStyle={{ fontSize: "12px" }}
                />
                <Line
                  type="monotone"
                  dataKey="nrr"
                  name="NRR (%)"
                  stroke={colors.primary}
                  strokeWidth={3}
                  dot={{ r: 4, strokeWidth: 2 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Revenue by Payment Method */}
        <Card>
          <div className="mb-2">
            <h3 className="text-lg font-bold text-brand-dark">
              Payment Methods
            </h3>
            <p className="text-xs text-brand-muted">
              Revenue breakdown by collection method
            </p>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={mockRevenueByPaymentMethod}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {mockRevenueByPaymentMethod.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: any) => formatCurrency(value, true)}
                  contentStyle={{
                    borderRadius: "8px",
                    border: "none",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  iconType="circle"
                  wrapperStyle={{ fontSize: "12px" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}
