"use client";

import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchBusinesses } from "@/store/slices/businessSlice";
import {
  fetchInvoices,
  fetchSubscriptions,
} from "@/store/slices/subscriptionSlice";
import { SummaryCardsGrid } from "./_components/SummaryCardsGrid";
import { RevenueChart } from "./_components/RevenueChart";
import { SubscriptionBreakdown } from "./_components/SubscriptionBreakdown";
import { IndustryDistribution } from "./_components/IndustryDistribution";
import {
  RecentRegistrationsTable,
  PendingApprovalsTable,
} from "./_components/DashboardTables";
import { SystemHealth } from "./_components/SystemHealth";
import { QuickActions } from "./_components/QuickActions";
import { RecentActivity } from "./_components/RecentActivity";
import { GeographicAnalytics } from "./_components/GeographicAnalytics";
import { UserTechAnalytics } from "./_components/UserTechAnalytics";
import { PaymentAnalytics } from "./_components/PaymentAnalytics";
import { SupportSnapshot } from "./_components/SupportSnapshot";
import { Button } from "@/components/ui/Button";
import { cn, formatDate } from "@/lib/utils";
import { ActivityItem, DashboardStats } from "@/types";
import { colors } from "@/config/colors";
import { Calendar as CalendarIcon, Download, Filter } from "lucide-react";

export default function DashboardPage() {
  const dispatch = useAppDispatch();
  const { businesses } = useAppSelector((state) => state.business);
  const { invoices, subscriptions } = useAppSelector(
    (state) => state.subscription,
  );

  const [activeTab, setActiveTab] = useState<
    "overview" | "analytics" | "operations" | "health"
  >("overview");

  useEffect(() => {
    dispatch(fetchBusinesses());
    dispatch(fetchInvoices());
    dispatch(fetchSubscriptions());
  }, [dispatch]);

  // Compute dynamic stats from DB
  const totalBusinesses = businesses.length;
  const activeBusinesses = businesses.filter(
    (b) => b.status === "active",
  ).length;
  const pendingApprovalBusinesses = businesses.filter(
    (b) => b.status === "pending" || b.status === "onboarding",
  ).length;
  const verifiedBusinesses = businesses.filter(
    (b) => b.status === "active" || b.status === "verified",
  ).length;

  const totalUsers = businesses.reduce(
    (acc, b: any) => acc + (b.teamMembers?.length || 1),
    0,
  );
  const activeUsers = activeBusinesses;

  const paidInvoices = invoices.filter(
    (i: any) => i.status === "paid" || i.status === "success",
  );
  const totalRevenue = paidInvoices.reduce(
    (acc, i: any) => acc + Number(i.amount || 0),
    0,
  );

  const baseMRR = businesses
    .filter((b: any) => b.status === "active" || b.status === "trial")
    .reduce((acc, b: any) => acc + Number(b.subscription_plan?.amount || 0), 0);

  const addonsMRR = invoices
    .filter(
      (i: any) =>
        i.invoice_number?.startsWith("INV-ADDON-") &&
        (i.status === "paid" || i.status === "success"),
    )
    .reduce((acc, i: any) => acc + Number(i.amount || 0), 0);

  const mrr = baseMRR + addonsMRR || totalRevenue;
  const arr = mrr * 12;

  // Monthly Revenue Chart calculation (Jan - Dec)
  const monthLabels = [
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
  const revenueChart = monthLabels.map((m, idx) => {
    let rev = 0;
    invoices.forEach((inv: any) => {
      const date = new Date(inv.issued_at || inv.created_at);
      if (!isNaN(date.getTime()) && date.getMonth() === idx) {
        rev += Number(inv.amount || 0);
      }
    });
    return {
      month: m,
      mrr: rev,
      newRevenue: rev,
      churnedRevenue: 0,
    };
  });

  // Industry distribution
  const indMap: Record<string, number> = {};
  businesses.forEach((b: any) => {
    const type = b.business_type || "Retail";
    indMap[type] = (indMap[type] || 0) + 1;
  });
  const industryDistribution =
    Object.keys(indMap).length > 0
      ? Object.keys(indMap).map((name) => ({
          name: name.charAt(0).toUpperCase() + name.slice(1),
          value: indMap[name],
        }))
      : [{ name: "Retail", value: totalBusinesses || 1 }];

  // Plan distribution
  const planMap: Record<string, number> = {};
  businesses.forEach((b: any) => {
    let rawName =
      b.subscription_plan?.name ||
      b.subscription_plan?.plan ||
      b.subscription?.plan ||
      b.plan?.name ||
      b.plan;
    if (!rawName && (b.status === "trial" || b.status === "onboarding")) {
      rawName = "Trial";
    }
    if (!rawName) {
      rawName = "Starter";
    }

    const formattedName = rawName
      .replace(/_/g, " ")
      .replace(/\b\w/g, (c: string) => c.toUpperCase());

    planMap[formattedName] = (planMap[formattedName] || 0) + 1;
  });

  const planColorPalette: Record<string, string> = {
    Enterprise: colors.dark,
    Professional: colors.purple,
    Growth: colors.info,
    Starter: colors.success,
    Trial: colors.warning,
    "Free Trial": colors.warning,
  };

  const fallbackColors = [
    colors.primary,
    colors.purple,
    colors.info,
    colors.success,
    colors.warning,
  ];

  const planDistribution =
    Object.keys(planMap).length > 0
      ? Object.keys(planMap).map((name, index) => ({
          name,
          value: planMap[name],
          color:
            planColorPalette[name] ||
            fallbackColors[index % fallbackColors.length],
        }))
      : [];

  // Geographic distribution
  const geoMap: Record<string, number> = {};
  businesses.forEach((b: any) => {
    const reg = b.state || b.city || "Primary Region";
    geoMap[reg] = (geoMap[reg] || 0) + 1;
  });
  const geographicDistribution =
    Object.keys(geoMap).length > 0
      ? Object.keys(geoMap).map((region) => ({
          country: region,
          businesses: geoMap[region],
          revenue: geoMap[region] * (mrr || 1000),
        }))
      : [
          {
            country: "Main State",
            businesses: totalBusinesses || 1,
            revenue: totalRevenue || 1000,
          },
        ];

  // Build real Recent Activity stream from businesses and invoices
  const activityList: ActivityItem[] = [];

  businesses.forEach((b: any) => {
    activityList.push({
      id: `bus-${b.id}`,
      type: b.status === "active" ? "signup" : "signup",
      businessName: b.name || "Business",
      description: `Registered business by ${b.owner_name || "Owner"} (${b.business_type || "Store"})`,
      timestamp: b.created_at || new Date().toISOString(),
    });
  });

  invoices.forEach((inv: any) => {
    activityList.push({
      id: `inv-${inv.id}`,
      type: inv.status === "paid" ? "payment" : "signup",
      businessName: inv.business?.name || "Tenant Business",
      description: `Subscription invoice #${inv.invoice_number || inv.id.slice(0, 8)} (${inv.status.toUpperCase()}) for ₹${inv.amount}`,
      timestamp:
        inv.paid_at ||
        inv.issued_at ||
        inv.created_at ||
        new Date().toISOString(),
    });
  });

  activityList.sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
  );
  const recentActivity = activityList.slice(0, 6);

  const todayRevenue = invoices
    .filter((inv: any) => {
      if (inv.status !== "paid" && inv.status !== "success") return false;
      const d = new Date(inv.paid_at || inv.issued_at || inv.created_at);
      const today = new Date();
      return (
        d.getDate() === today.getDate() &&
        d.getMonth() === today.getMonth() &&
        d.getFullYear() === today.getFullYear()
      );
    })
    .reduce((acc, inv: any) => acc + Number(inv.amount || 0), 0);

  const stats: DashboardStats = {
    subscriptionRevenue: 0,
    trialBusinesses: 0,
    suspendedBusinesses: 0,
    expiredBusinesses: 0,
    deletedBusinesses: 0,
    totalBranches: 0,
    offlineUsers: 0,
    totalEmployees: 0,
    newUsersThisMonth: 0,
    totalCustomers: 0,
    totalPosTransactions: 0,
    newSignupsThisMonth: 0,
    churnedThisMonth: 0,
    conversionRate: 0,
    arpu: 0,
    arpb: 0,
    expiredSubscriptions: 0,
    trialPlans: 0,
    yearlyPlans: 0,
    renewalsToday: 0,
    totalBusinesses,
    activeBusinesses,
    pendingApprovalBusinesses,
    verifiedBusinesses,
    totalUsers,
    activeUsers,
    onlineUsers: Math.min(totalUsers, 5),
    newUsersToday: businesses.filter((b) => {
      const d = new Date(b.created_at);
      const today = new Date();
      return (
        d.getDate() === today.getDate() && d.getMonth() === today.getMonth()
      );
    }).length,
    activeSubscriptions: activeBusinesses,
    monthlyPlans: subscriptions.length || activeBusinesses,
    enterprisePlans: businesses.filter((b: any) =>
      b.subscription_plan?.plan?.toLowerCase().includes("enterprise"),
    ).length,
    upcomingRenewals: invoices.filter((i: any) => i.status === "pending")
      .length,
    totalRevenue,
    todayRevenue,
    mrr,
    mrrGrowth: 0,
    arr,
    pendingPayments: invoices
      .filter((i: any) => i.status === "pending")
      .reduce((acc, i: any) => acc + Number(i.amount || 0), 0),
    failedPayments: invoices
      .filter((i: any) => i.status === "overdue" || i.status === "failed")
      .reduce((acc, i: any) => acc + Number(i.amount || 0), 0),
    revenueChart,
    industryDistribution,
    planDistribution,
    geographicDistribution,
    recentActivity,
    deviceUsage: [
      { name: "Desktop / POS Terminal", value: 70, color: colors.primary },
      { name: "Mobile App", value: 20, color: colors.success },
      { name: "Tablet", value: 10, color: colors.info },
    ],
    browserUsage: [
      { name: "Chrome", value: 65, color: colors.success },
      { name: "Safari", value: 20, color: colors.info },
      { name: "Edge / Firefox", value: 15, color: colors.warning },
    ],
    paymentMethods: [
      { name: "UPI / Bank Transfer", value: 80, color: colors.primary },
      { name: "Cards", value: 20, color: colors.success },
    ],
    supportMetrics: {
      openTickets: 0,
      closedTickets: 0,
      pendingTickets: 0,
      highPriority: 0,
      avgResolutionTimeHours: 1.2,
      csatScore: 98,
    },
    systemHealth: {
      status: "healthy" as const,
      apiUptime: 99.98,
      serverCpu: 15,
      serverMemory: 40,
      databaseLoad: 20,
      activeSessions: activeUsers,
    },
  };

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "analytics", label: "Analytics" },
    { id: "operations", label: "Operations" },
  ] as const;

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Global Filters */}
      <div className="flex flex-col gap-4 sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h2 className="text-2xl font-bold text-brand-dark">
            Platform Dashboard
          </h2>
          <p className="mt-1 text-sm text-brand-muted">
            Real-time overview of the POS SaaS platform.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200 bg-white/50 backdrop-blur-md rounded-t-2xl px-2">
        <nav className="-mb-px flex space-x-6 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "whitespace-nowrap py-4 px-2 border-b-2 font-bold text-sm transition-all duration-300 ease-spring",
                activeTab === tab.id
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300",
              )}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300 ease-spring">
          <SummaryCardsGrid stats={stats} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="flex flex-col gap-6">
              <RevenueChart data={stats.revenueChart} />
            </div>
            <RecentActivity activities={stats.recentActivity} />
          </div>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === "analytics" && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300 ease-spring">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <RevenueChart data={stats.revenueChart} />
            </div>
            <GeographicAnalytics data={stats.geographicDistribution} />
          </div>

          <PaymentAnalytics
            paymentData={stats.paymentMethods}
            totalRevenue={stats.totalRevenue}
            pendingPayments={stats.pendingPayments}
            failedPayments={stats.failedPayments}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SubscriptionBreakdown data={stats.planDistribution} />
            <IndustryDistribution data={stats.industryDistribution} />
          </div>
        </div>
      )}

      {/* Operations Tab */}
      {activeTab === "operations" && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300 ease-spring">
          <div className="grid grid-cols-1 gap-6">
            <SupportSnapshot metrics={stats.supportMetrics} />
          </div>
          <RecentRegistrationsTable />
        </div>
      )}
    </div>
  );
}
