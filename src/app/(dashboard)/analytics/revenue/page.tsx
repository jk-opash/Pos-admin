"use client";

import { useState, useEffect, useMemo } from "react";
import { Card } from "@/components/ui/Card";
import { StatsCard } from "@/components/ui/StatsCard";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import {
  Download,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  IndianRupee,
  Calendar,
  Filter,
  RefreshCw,
  Store,
  Receipt,
  X,
  Search,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatCurrency, formatDate } from "@/lib/utils";
import colors from "@/config/colors.json";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchInvoices,
  fetchSubscriptions,
} from "@/store/slices/subscriptionSlice";
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

// ─── helpers ────────────────────────────────────────────────────────────────

const PLAN_COLORS: Record<string, string> = {
  enterprise: "#1e293b",
  professional: "#7c3aed",
  growth: "#0ea5e9",
  starter: "#22c55e",
  free_trial: "#f59e0b",
};

const THEME_COLORS = [
  colors.primary,
  "#7c3aed",
  "#0ea5e9",
  "#22c55e",
  "#f59e0b",
  "#ef4444",
  "#ec4899",
];

const MONTH_LABELS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function planColor(slug: string) {
  return PLAN_COLORS[slug?.toLowerCase()] ?? colors.primary;
}

function getInvoiceDate(inv: any): Date {
  return new Date(inv.paid_at || inv.issued_at || inv.created_at || 0);
}

function isPaid(inv: any) {
  return inv.status === "paid" || inv.status === "success";
}

function isAddon(inv: any) {
  return (inv.invoice_number || "").startsWith("INV-ADDON-");
}

// Return true if invoice falls within time-range relative to today
function inRange(inv: any, range: string): boolean {
  const d = getInvoiceDate(inv);
  const now = new Date();

  if (range === "today") {
    return (
      d.getDate() === now.getDate() &&
      d.getMonth() === now.getMonth() &&
      d.getFullYear() === now.getFullYear()
    );
  }
  if (range === "7d") {
    const cutoff = new Date(now);
    cutoff.setDate(now.getDate() - 7);
    return d >= cutoff;
  }
  if (range === "30d") {
    const cutoff = new Date(now);
    cutoff.setDate(now.getDate() - 30);
    return d >= cutoff;
  }
  if (range === "6m") {
    const cutoff = new Date(now);
    cutoff.setMonth(now.getMonth() - 6);
    return d >= cutoff;
  }
  if (range === "ytd") {
    return d.getFullYear() === now.getFullYear();
  }
  return true; // "all"
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function RevenueAnalyticsDashboard() {
  const dispatch = useAppDispatch();
  const { invoices, loading: invoiceLoading } = useAppSelector(
    (state) => state.subscription,
  );
  const { businesses, loading: bizLoading } = useAppSelector(
    (state) => state.business,
  );

  // ── filter state ──
  const [timeRange, setTimeRange] = useState("ytd");
  const [planFilter, setPlanFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all"); // subscription | addon | all
  const [regionFilter, setRegionFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const isLoading = invoiceLoading || bizLoading;

  useEffect(() => {
    dispatch(fetchInvoices());
    dispatch(fetchBusinesses());
    dispatch(fetchSubscriptions());
  }, [dispatch]);

  // ── Derived filter options ────────────────────────────────────────────────

  const planOptions = useMemo(() => {
    const plans = new Set<string>();
    businesses.forEach((b: any) => {
      const p = b.subscription_plan?.plan;
      if (p) plans.add(p);
    });
    return [
      { label: "All Plans", value: "all" },
      ...[...plans].map((p) => ({
        label: p.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
        value: p,
      })),
    ];
  }, [businesses]);

  const regionOptions = useMemo(() => {
    const regions = new Set<string>();
    businesses.forEach((b: any) => {
      const r = (b as any).state || (b as any).city;
      if (r) regions.add(r);
    });
    return [
      { label: "All Regions", value: "all" },
      ...[...regions].map((r) => ({ label: r, value: r })),
    ];
  }, [businesses]);

  // ── business-level filtering ──────────────────────────────────────────────

  const filteredBusinesses = useMemo(() => {
    return businesses.filter((b: any) => {
      if (planFilter !== "all" && b.subscription_plan?.plan !== planFilter)
        return false;
      if (
        regionFilter !== "all" &&
        (b as any).state !== regionFilter &&
        (b as any).city !== regionFilter
      )
        return false;
      return true;
    });
  }, [businesses, planFilter, regionFilter]);

  const filteredBusinessIds = useMemo(
    () => new Set(filteredBusinesses.map((b: any) => b.id)),
    [filteredBusinesses],
  );

  // ── invoice-level filtering ───────────────────────────────────────────────

  const filteredInvoices = useMemo(() => {
    return invoices.filter((inv: any) => {
      if (!inRange(inv, timeRange)) return false;
      if (statusFilter !== "all" && inv.status !== statusFilter) return false;
      if (typeFilter === "addon" && !isAddon(inv)) return false;
      if (typeFilter === "subscription" && isAddon(inv)) return false;
      // Business-level filter
      if (filteredBusinessIds.size < businesses.length) {
        if (!filteredBusinessIds.has(inv.business_id)) return false;
      }
      // Search by business name / invoice number
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const bizName = (inv.business?.name || "").toLowerCase();
        const invNum = (inv.invoice_number || "").toLowerCase();
        if (!bizName.includes(q) && !invNum.includes(q)) return false;
      }
      return true;
    });
  }, [
    invoices,
    timeRange,
    statusFilter,
    typeFilter,
    filteredBusinessIds,
    businesses.length,
    searchQuery,
  ]);

  // ── KPI Metrics ──────────────────────────────────────────────────────────

  const paidFiltered = filteredInvoices.filter(isPaid);
  const totalRevenue = paidFiltered.reduce(
    (s, i: any) => s + Number(i.amount || 0),
    0,
  );

  const baseMRR = filteredBusinesses.reduce(
    (s, b: any) =>
      b.status === "active" || b.status === "trial"
        ? s + Number(b.subscription_plan?.amount || 0)
        : s,
    0,
  );
  const addonsMRR = paidFiltered
    .filter(isAddon)
    .reduce((s, i: any) => s + Number(i.amount || 0), 0);
  const mrr = baseMRR + addonsMRR || totalRevenue;
  const arr = mrr * 12;

  const arpb =
    filteredBusinesses.length > 0
      ? Math.round(totalRevenue / filteredBusinesses.length)
      : 0;

  const pendingTotal = filteredInvoices
    .filter((i: any) => i.status === "pending" || i.status === "overdue")
    .reduce((s, i: any) => s + Number(i.amount || 0), 0);

  // ── Monthly trend (respects timeRange) ───────────────────────────────────

  const revenueTrends = useMemo(() => {
    const now = new Date();
    const currentYear = now.getFullYear();

    return MONTH_LABELS.map((m, idx) => {
      let total = 0;
      let recurring = 0;
      let addon = 0;

      filteredInvoices.forEach((inv: any) => {
        const d = getInvoiceDate(inv);
        if (d.getMonth() !== idx) return;
        // For ytd and all, show correct year
        if (timeRange === "ytd" && d.getFullYear() !== currentYear) return;
        const amt = Number(inv.amount || 0);
        total += amt;
        if (isPaid(inv)) {
          if (isAddon(inv)) addon += amt;
          else recurring += amt;
        }
      });

      return { month: m, total, recurring, addon };
    });
  }, [filteredInvoices, timeRange]);

  // ── Revenue by Plan ───────────────────────────────────────────────────────

  const revenueByPlan = useMemo(() => {
    const map: Record<string, number> = {};
    filteredBusinesses.forEach((b: any) => {
      const slug = b.subscription_plan?.plan || "free_trial";
      map[slug] = (map[slug] || 0) + Number(b.subscription_plan?.amount || 0);
    });
    const max = Math.max(...Object.values(map), 1);
    return Object.entries(map)
      .sort((a, b) => b[1] - a[1])
      .map(([slug, val]) => ({
        name: slug.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
        slug,
        value: val,
        pct: Math.round((val / max) * 100),
        color: planColor(slug),
      }));
  }, [filteredBusinesses]);

  // ── Revenue by Industry ───────────────────────────────────────────────────

  const revenueByIndustry = useMemo(() => {
    const map: Record<string, number> = {};
    filteredBusinesses.forEach((b: any) => {
      const type = (b.business_type || "Other").toLowerCase();
      map[type] = (map[type] || 0) + 1;
    });
    return Object.entries(map)
      .sort((a, b) => b[1] - a[1])
      .map(([type, count], idx) => ({
        name: type.replace(/\b\w/g, (c) => c.toUpperCase()),
        value: count,
        color: THEME_COLORS[idx % THEME_COLORS.length],
      }));
  }, [filteredBusinesses]);

  // ── Revenue by Region ─────────────────────────────────────────────────────

  const revenueByRegion = useMemo(() => {
    const map: Record<string, number> = {};
    const bizRevMap: Record<string, number> = {};
    filteredBusinesses.forEach((b: any) => {
      const reg = (b as any).state || (b as any).city || "Unknown";
      map[reg] = (map[reg] || 0) + 1;
    });
    paidFiltered.forEach((inv: any) => {
      const biz = filteredBusinesses.find(
        (b: any) => b.id === inv.business_id,
      ) as any;
      const reg = biz?.state || biz?.city || "Unknown";
      bizRevMap[reg] = (bizRevMap[reg] || 0) + Number(inv.amount || 0);
    });
    const maxBiz = Math.max(...Object.values(map), 1);
    return Object.entries(map)
      .sort((a, b) => b[1] - a[1])
      .map(([reg, count], idx) => ({
        name: reg,
        businesses: count,
        revenue: bizRevMap[reg] || 0,
        pct: Math.round((count / maxBiz) * 100),
        color: THEME_COLORS[idx % THEME_COLORS.length],
      }));
  }, [filteredBusinesses, paidFiltered]);

  // ── Revenue Forecast (actual vs projected 15% growth) ────────────────────

  const revenueForecast = useMemo(() => {
    return revenueTrends.map((r) => ({
      month: r.month,
      actual: r.total,
      projected: Math.round((r.total || mrr) * 1.15),
    }));
  }, [revenueTrends, mrr]);

  // ── Revenue by Payment Method ─────────────────────────────────────────────

  const revenueByPaymentMethod = useMemo(() => {
    const map: Record<string, number> = {};
    paidFiltered.forEach((inv: any) => {
      // In a real app this would come from inv.payment_method
      const method = inv.payment_method;
      map[method] = (map[method] || 0) + Number(inv.amount || 0);
    });

    if (Object.keys(map).length === 0) {
      return [{ name: "No Data", value: 1, color: "#e5e7eb" }];
    }

    return Object.entries(map)
      .sort((a, b) => b[1] - a[1])
      .map(([method, val], idx) => ({
        name: method,
        value: val,
        color: THEME_COLORS[idx % THEME_COLORS.length],
      }));
  }, [paidFiltered]);

  // ── Invoice status split ──────────────────────────────────────────────────

  const invoiceStatusSplit = useMemo(() => {
    const map: Record<string, number> = {};
    filteredInvoices.forEach((inv: any) => {
      const s = inv.status || "pending";
      map[s] = (map[s] || 0) + Number(inv.amount || 0);
    });
    const colorMap: Record<string, string> = {
      paid: "#059669",
      success: "#059669",
      pending: "#f59e0b",
      overdue: "#ef4444",
      failed: "#dc2626",
    };
    return Object.entries(map).map(([status, value]) => ({
      name: status.charAt(0).toUpperCase() + status.slice(1),
      value,
      color: colorMap[status] ?? "#94a3b8",
    }));
  }, [filteredInvoices]);

  // ── Recent transactions ───────────────────────────────────────────────────

  const recentTransactions = useMemo(() => {
    return [...filteredInvoices]
      .sort(
        (a: any, b: any) =>
          getInvoiceDate(b).getTime() - getInvoiceDate(a).getTime(),
      )
      .slice(0, 10);
  }, [filteredInvoices]);

  // ── Active filter count badge ─────────────────────────────────────────────

  const activeFilterCount = [
    planFilter !== "all",
    regionFilter !== "all",
  ].filter(Boolean).length;

  function clearFilters() {
    setPlanFilter("all");
    setRegionFilter("all");
  }

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6 pb-12">
      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-brand-dark">
            Revenue Analytics
          </h1>
          <p className="mt-1 text-sm text-brand-muted">
            Comprehensive financial overview — subscriptions, add-ons, MRR &
            growth trends.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Time Range */}
          <div className="w-40">
            <Select
              options={[
                { label: "Today", value: "today" },
                { label: "Last 7 Days", value: "7d" },
                { label: "Last 30 Days", value: "30d" },
                { label: "Last 6 Months", value: "6m" },
                { label: "Year to Date", value: "ytd" },
                { label: "All Time", value: "all" },
              ]}
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
            />
          </div>

          {/* Filters toggle */}
          <Button
            variant="outline"
            className="gap-2 relative"
            onClick={() => setFiltersOpen((o) => !o)}
          >
            <Filter className="h-4 w-4" />
            Filters
            {activeFilterCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-brand-primary text-white text-xs flex items-center justify-center font-bold">
                {activeFilterCount}
              </span>
            )}
          </Button>

          <Button
            variant="outline"
            className="gap-2"
            onClick={() => {
              dispatch(fetchInvoices());
              dispatch(fetchBusinesses());
            }}
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* ── Filter Panel ── */}
      {filtersOpen && (
        <Card className="border-brand-primary/30 bg-brand-primary/5 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex flex-wrap items-end gap-4">
            <div>
              <label className="block text-xs font-medium text-brand-muted mb-1">
                Plan
              </label>
              <div className="w-44">
                <Select
                  options={planOptions}
                  value={planFilter}
                  onChange={(e) => setPlanFilter(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-brand-muted mb-1">
                Region
              </label>
              <div className="w-44">
                <Select
                  options={regionOptions}
                  value={regionFilter}
                  onChange={(e) => setRegionFilter(e.target.value)}
                />
              </div>
            </div>

            {activeFilterCount > 0 && (
              <Button
                variant="outline"
                className="gap-2 text-brand-danger border-brand-danger/40 hover:bg-red-50"
                onClick={clearFilters}
              >
                <X className="h-4 w-4" /> Clear All
              </Button>
            )}
          </div>

          <p className="mt-3 text-xs text-brand-muted">
            Showing <strong>{filteredInvoices.length}</strong> invoices from{" "}
            <strong>{filteredBusinesses.length}</strong> businesses
          </p>
        </Card>
      )}

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatsCard
          title="Total Revenue"
          value={isLoading ? "—" : formatCurrency(totalRevenue)}
          change={12.5}
          icon={<IndianRupee className="h-5 w-5 text-brand-primary" />}
        />
        <StatsCard
          title="MRR"
          value={isLoading ? "—" : formatCurrency(mrr)}
          change={8.2}
          icon={<TrendingUp className="h-5 w-5 text-brand-success" />}
        />
        <StatsCard
          title="ARR"
          value={isLoading ? "—" : formatCurrency(arr)}
          change={10.5}
          icon={<Calendar className="h-5 w-5 text-brand-info" />}
        />
        <StatsCard
          title="Avg Rev / Business"
          value={isLoading ? "—" : formatCurrency(arpb)}
          change={5.4}
          icon={<Store className="h-5 w-5 text-brand-dark" />}
        />
        <StatsCard
          title="Pending Clearance"
          value={isLoading ? "—" : formatCurrency(pendingTotal)}
          change={-2.4}
          icon={<AlertCircle className="h-5 w-5 text-brand-warning" />}
        />
      </div>

      {/* ── Revenue Trend + Invoice Status Split ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Area Chart */}
        <Card className="lg:col-span-2">
          <div className="mb-4 flex justify-between items-start">
            <div>
              <h3 className="text-base font-bold text-brand-dark">
                Revenue Growth Trend
              </h3>
              <p className="text-xs text-brand-muted">
                Total · Subscription · Add-ons
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs font-medium">
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-brand-primary" />
                Total
              </span>
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Recurring
              </span>
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-amber-400" />
                Add-ons
              </span>
            </div>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={revenueTrends}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <defs>
                  {[
                    ["total", colors.primary],
                    ["recurring", "#22c55e"],
                    ["addon", "#f59e0b"],
                  ].map(([key, color]) => (
                    <linearGradient
                      key={key}
                      id={`grad-${key}`}
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor={color} stopOpacity={0.25} />
                      <stop offset="95%" stopColor={color} stopOpacity={0} />
                    </linearGradient>
                  ))}
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
                  tick={{ fontSize: 11, fill: colors.muted }}
                  dy={8}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: colors.muted }}
                  tickFormatter={(v) =>
                    `₹${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`
                  }
                  dx={-4}
                />
                <Tooltip
                  formatter={(v, name) => [formatCurrency(Number(v)), name]}
                  contentStyle={{
                    borderRadius: 8,
                    border: `1px solid ${colors.border}`,
                    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
                    fontSize: 12,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="total"
                  name="Total"
                  stroke={colors.primary}
                  strokeWidth={2}
                  fill="url(#grad-total)"
                />
                <Area
                  type="monotone"
                  dataKey="recurring"
                  name="Recurring"
                  stroke="#22c55e"
                  strokeWidth={2}
                  fill="url(#grad-recurring)"
                />
                <Area
                  type="monotone"
                  dataKey="addon"
                  name="Add-ons"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  fill="url(#grad-addon)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Invoice Status Pie */}
        <Card>
          <h3 className="text-base font-bold text-brand-dark mb-1">
            Invoice Status Split
          </h3>
          <p className="text-xs text-brand-muted mb-4">
            Revenue by payment status
          </p>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={
                    invoiceStatusSplit.length
                      ? invoiceStatusSplit
                      : [{ name: "No Data", value: 1, color: "#e5e7eb" }]
                  }
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {(invoiceStatusSplit.length
                    ? invoiceStatusSplit
                    : [{ color: "#e5e7eb" }]
                  ).map((e: any, i) => (
                    <Cell key={i} fill={e.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(v) => formatCurrency(Number(v))}
                  contentStyle={{
                    borderRadius: 8,
                    border: "none",
                    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
                    fontSize: 12,
                  }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  iconType="circle"
                  wrapperStyle={{ fontSize: 11 }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* ── Plan Breakdown + Industry Pie ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue by Plan — progress bars */}
        <Card>
          <h3 className="text-base font-bold text-brand-dark mb-4">
            Revenue by Plan
          </h3>
          {revenueByPlan.length === 0 ? (
            <p className="text-sm text-brand-muted">No plan data.</p>
          ) : (
            <div className="space-y-4">
              {revenueByPlan.map((plan) => (
                <div key={plan.slug}>
                  <div className="flex justify-between items-end mb-1">
                    <span className="text-sm font-medium text-brand-dark">
                      {plan.name}
                    </span>
                    <span className="text-sm font-bold text-brand-dark">
                      {formatCurrency(plan.value)}
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all duration-500"
                      style={{
                        width: `${plan.pct || 5}%`,
                        backgroundColor: plan.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Industry Pie */}
        <Card>
          <h3 className="text-base font-bold text-brand-dark mb-1">
            Businesses by Industry
          </h3>
          <p className="text-xs text-brand-muted mb-2">
            Distribution across sectors
          </p>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={
                    revenueByIndustry.length
                      ? revenueByIndustry
                      : [{ name: "No Data", value: 1, color: "#e5e7eb" }]
                  }
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {(revenueByIndustry.length
                    ? revenueByIndustry
                    : [{ color: "#e5e7eb" }]
                  ).map((e: any, i) => (
                    <Cell key={i} fill={e.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(v, name) => [`${v} business(es)`, name]}
                  contentStyle={{
                    borderRadius: 8,
                    border: "none",
                    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
                    fontSize: 12,
                  }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  iconType="circle"
                  wrapperStyle={{ fontSize: 11 }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Region Breakdown */}
        <Card>
          <h3 className="text-base font-bold text-brand-dark mb-4">
            Revenue by Region
          </h3>
          {revenueByRegion.length === 0 ? (
            <p className="text-sm text-brand-muted">No region data.</p>
          ) : (
            <div className="space-y-4">
              {revenueByRegion.map((r) => (
                <div key={r.name}>
                  <div className="flex justify-between items-end mb-1">
                    <span className="text-sm font-medium text-brand-dark">
                      {r.name}
                    </span>
                    <div className="text-right">
                      <span className="text-xs font-bold text-brand-dark block">
                        {formatCurrency(r.revenue)}
                      </span>
                      <span className="text-xs text-brand-muted">
                        {r.businesses} biz
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all duration-500"
                      style={{
                        width: `${r.pct || 5}%`,
                        backgroundColor: r.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* ── Forecast Bar Chart & Payment Methods ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <div className="mb-4">
            <h3 className="text-base font-bold text-brand-dark">
              Revenue Forecast
            </h3>
            <p className="text-xs text-brand-muted">
              Actual vs Projected (+15% growth model)
            </p>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={revenueForecast}
                margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
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
                  tick={{ fontSize: 11, fill: colors.muted }}
                  dy={8}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: colors.muted }}
                  tickFormatter={(v) =>
                    `₹${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`
                  }
                  dx={-4}
                />
                <Tooltip
                  formatter={(v) => formatCurrency(Number(v))}
                  contentStyle={{
                    borderRadius: 8,
                    border: `1px solid ${colors.border}`,
                    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
                    fontSize: 12,
                  }}
                  cursor={{ fill: "transparent" }}
                />
                <Legend
                  verticalAlign="top"
                  height={32}
                  iconType="circle"
                  wrapperStyle={{ fontSize: 11 }}
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
                  fill="#f59e0b"
                  radius={[4, 4, 0, 0]}
                  fillOpacity={0.6}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <h3 className="text-base font-bold text-brand-dark mb-1">
            Payment Methods
          </h3>
          <p className="text-xs text-brand-muted mb-4">
            Revenue by collection method
          </p>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={revenueByPaymentMethod}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {revenueByPaymentMethod.map((e: any, i) => (
                    <Cell key={i} fill={e.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(v, name) => [formatCurrency(Number(v)), name]}
                  contentStyle={{
                    borderRadius: 8,
                    border: "none",
                    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
                    fontSize: 12,
                  }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  iconType="circle"
                  wrapperStyle={{ fontSize: 11 }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* ── Recent Transactions Table ── */}
      <Card>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-base font-bold text-brand-dark">
              Recent Transactions
            </h3>
            <p className="text-xs text-brand-muted">
              Filtered invoices — most recent first
            </p>
          </div>
          <span className="text-xs text-brand-muted bg-brand-light px-2.5 py-1 rounded-full font-medium">
            {recentTransactions.length} shown
          </span>
        </div>
        {recentTransactions.length === 0 ? (
          <EmptyState
            icon={<Search />}
            title="No Transactions"
            message="No transactions match the selected filters."
            className="h-64"
          />
        ) : (
          <div className="rounded-xl border border-brand-border bg-white overflow-x-auto">
            <Table>
              <TableHeader className="bg-brand-light">
                <TableRow>
                  <TableHead>Invoice #</TableHead>
                  <TableHead>Business</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentTransactions.map((inv: any) => {
                  const getStatusVariant = (status: string) => {
                    switch (status?.toLowerCase()) {
                      case "paid":
                      case "success":
                        return "success";
                      case "pending":
                        return "warning";
                      case "overdue":
                      case "failed":
                        return "danger";
                      default:
                        return "default";
                    }
                  };
                  return (
                    <TableRow key={inv.id}>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-mono text-xs text-brand-dark font-medium">
                            {inv.invoice_number?.slice(0, 22) ||
                              inv.id?.slice(0, 8)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm font-medium text-brand-dark">
                        {inv.business?.name || "—"}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={isAddon(inv) ? "purple" : "info"}
                          dot={false}
                        >
                          <span className="flex items-center gap-1">
                            <Receipt className="h-3 w-3" />
                            {isAddon(inv) ? "Add-on" : "Subscription"}
                          </span>
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-xs text-brand-muted">
                          {formatDate(getInvoiceDate(inv).toISOString())}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm font-medium text-brand-dark">
                          {formatCurrency(Number(inv.amount || 0))}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusVariant(inv.status)} dot>
                          {(inv.status || "pending").toUpperCase()}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>
    </div>
  );
}
