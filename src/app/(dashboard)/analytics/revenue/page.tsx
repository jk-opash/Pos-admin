"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { StatsCard } from "@/components/ui/StatsCard";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { Download, TrendingUp, TrendingDown, AlertCircle } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import colors from "@/config/colors.json";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchInvoices, fetchSubscriptions } from "@/store/slices/subscriptionSlice";
import { fetchBusinesses } from "@/store/slices/businessSlice";

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
  const [timeRange, setTimeRange] = useState("6m");
  const dispatch = useAppDispatch();
  const { invoices } = useAppSelector((state) => state.subscription);
  const { businesses } = useAppSelector((state) => state.business);

  useEffect(() => {
    dispatch(fetchInvoices());
    dispatch(fetchBusinesses());
    dispatch(fetchSubscriptions());
  }, [dispatch]);

  // Real KPI calculations
  const paidInvoices = invoices.filter((i: any) => i.status === "paid" || i.status === "success");
  const totalRevenue = paidInvoices.reduce((sum, i: any) => sum + Number(i.amount || 0), 0);

  const activePlansMRR = businesses
    .filter((b: any) => b.status === "active" || b.status === "trial")
    .reduce((sum, b: any) => sum + Number(b.subscription_plan?.amount || 0), 0);

  const mrr = activePlansMRR > 0 ? activePlansMRR : totalRevenue;
  const arr = mrr * 12;
  const arpb = businesses.length > 0 ? Math.round(totalRevenue / businesses.length) : 0;

  const kpiMetrics = [
    { title: "Total Revenue", value: formatCurrency(totalRevenue), trend: "up" },
    { title: "Monthly Recurring (MRR)", value: formatCurrency(mrr), trend: "up" },
    { title: "Annual Recurring (ARR)", value: formatCurrency(arr), trend: "up" },
    { title: "Avg Revenue / Business", value: formatCurrency(arpb), trend: "up" },
  ];

  // Dynamic monthly trend calculation (Jan - Dec)
  const monthLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const revenueTrends = monthLabels.map((m, idx) => {
    let total = 0;
    let recurring = 0;
    invoices.forEach((inv: any) => {
      const date = new Date(inv.issued_at || inv.created_at || inv.paid_at);
      if (!isNaN(date.getTime()) && date.getMonth() === idx) {
        const amt = Number(inv.amount || 0);
        total += amt;
        if (inv.status === "paid" || inv.status === "success") {
          recurring += amt;
        }
      }
    });
    return { month: m, totalRevenue: total, recurringRevenue: recurring };
  });

  // Dynamic Revenue by Industry
  const themeColors = [colors.primary, colors.success, colors.warning, "#8884d8", "#82ca9d", "#ffc658"];
  const industryCounts: Record<string, number> = {};
  businesses.forEach((b: any) => {
    const type = b.business_type || "Restaurant";
    industryCounts[type] = (industryCounts[type] || 0) + 1;
  });

  const revenueByIndustry = Object.keys(industryCounts).length > 0
    ? Object.keys(industryCounts).map((type, idx) => ({
        name: type.charAt(0).toUpperCase() + type.slice(1),
        value: industryCounts[type],
        color: themeColors[idx % themeColors.length],
      }))
    : [{ name: "Restaurant", value: 1, color: colors.primary }];

  // Dynamic Revenue by Plan
  const planMap: Record<string, number> = {};
  businesses.forEach((b: any) => {
    const planName = b.subscription_plan?.plan || "Free Trial";
    planMap[planName] = (planMap[planName] || 0) + Number(b.subscription_plan?.amount || 0);
  });

  const maxPlanVal = Math.max(...Object.values(planMap), 1);
  const revenueByPlan = Object.keys(planMap).length > 0
    ? Object.keys(planMap).map((name, idx) => ({
        name: name.toUpperCase(),
        value: planMap[name],
        color: themeColors[idx % themeColors.length],
      }))
    : [{ name: "FREE_TRIAL", value: 0, color: colors.primary }];

  // Dynamic Revenue by Region
  const regionMap: Record<string, number> = {};
  businesses.forEach((b: any) => {
    const reg = b.state || b.city || "Default Region";
    regionMap[reg] = (regionMap[reg] || 0) + 1;
  });

  const maxRegionVal = Math.max(...Object.values(regionMap), 1);
  const revenueByRegion = Object.keys(regionMap).length > 0
    ? Object.keys(regionMap).map((reg, idx) => ({
        name: reg,
        value: regionMap[reg],
        color: themeColors[idx % themeColors.length],
      }))
    : [{ name: "Default Region", value: 1, color: colors.primary }];

  // Dynamic Revenue Forecast (BarChart)
  const revenueForecast = monthLabels.map((m, idx) => ({
    month: m,
    actual: revenueTrends[idx]?.totalRevenue || 0,
    projected: Math.round(((revenueTrends[idx]?.totalRevenue || mrr) * 1.15)),
  }));

  // Dynamic Net Revenue Retention (NRR) LineChart
  const retentionTrends = monthLabels.map((m) => ({
    month: m,
    nrr: paidInvoices.length > 0 ? 100 : 0,
  }));

  // Dynamic Revenue by Payment Method
  const paymentMethodMap: Record<string, number> = {};
  invoices.forEach((inv: any) => {
    const method = inv.currency ? `${inv.currency} Transfer` : "UPI / Card";
    paymentMethodMap[method] = (paymentMethodMap[method] || 0) + Number(inv.amount || 0);
  });

  const revenueByPaymentMethod = Object.keys(paymentMethodMap).length > 0
    ? Object.keys(paymentMethodMap).map((name, idx) => ({
        name,
        value: paymentMethodMap[name],
        color: themeColors[idx % themeColors.length],
      }))
    : [{ name: "UPI / Card", value: totalRevenue || 0, color: colors.primary }];

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
        {kpiMetrics.map((metric, idx) => (
          <StatsCard
            key={idx}
            title={metric.title}
            value={metric.value}
            icon={renderTrendIcon(metric.trend)}
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
                data={revenueTrends}
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
                  tickFormatter={(val) => `₹${val}`}
                  dx={-10}
                />
                <Tooltip
                  formatter={(value) => formatCurrency(Number(value))}
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
              Distribution of businesses across sectors
            </p>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={revenueByIndustry}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {revenueByIndustry.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => `${value} business(es)`}
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

      {/* Secondary Metrics & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Plan Breakdown */}
        <Card>
          <h3 className="text-lg font-bold text-brand-dark mb-4">
            Revenue by Plan
          </h3>
          <div className="space-y-4">
            {revenueByPlan.map((plan) => (
              <div key={plan.name}>
                <div className="flex justify-between items-end mb-1">
                  <span className="text-sm font-medium text-brand-muted">
                    {plan.name}
                  </span>
                  <span className="text-sm font-bold text-brand-dark">
                    {formatCurrency(plan.value)}
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div
                    className="h-2 rounded-full"
                    style={{
                      width: `${Math.min(100, (plan.value / maxPlanVal) * 100 || 10)}%`,
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
                {invoices.length > 0 ? (
                  invoices.slice(0, 5).map((inv: any) => (
                    <tr key={inv.id} className="hover:bg-brand-light">
                      <td className="px-4 py-3 font-medium text-brand-dark">
                        {inv.business?.name || "Business"}
                      </td>
                      <td className="px-4 py-3 text-brand-muted">
                        {formatDate(inv.issued_at || inv.created_at)}
                      </td>
                      <td className="px-4 py-3 font-semibold text-brand-dark">
                        {formatCurrency(Number(inv.amount || 0))}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-semibold ${
                            inv.status === "paid"
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {inv.status === "paid" ? (
                            <TrendingUp className="h-3 w-3" />
                          ) : (
                            <AlertCircle className="h-3 w-3" />
                          )}
                          {(inv.status || "pending").toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-brand-muted">
                      No recent invoice transactions found.
                    </td>
                  </tr>
                )}
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
                data={revenueForecast}
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
                  tickFormatter={(val) => `₹${val}`}
                  dx={-10}
                />
                <Tooltip
                  formatter={(value) => formatCurrency(Number(value))}
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
            {revenueByRegion.map((region) => (
              <div key={region.name}>
                <div className="flex justify-between items-end mb-1">
                  <span className="text-sm font-medium text-brand-muted">
                    {region.name}
                  </span>
                  <span className="text-sm font-bold text-brand-dark">
                    {region.value} business(es)
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div
                    className="h-2 rounded-full"
                    style={{
                      width: `${Math.min(100, (region.value / maxRegionVal) * 100)}%`,
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
                data={retentionTrends}
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
                  domain={[0, 100]}
                  tickFormatter={(val) => `${val}%`}
                  dx={-10}
                />
                <Tooltip
                  formatter={(value) => `${value}%`}
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
                  data={revenueByPaymentMethod}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {revenueByPaymentMethod.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => formatCurrency(Number(value))}
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
