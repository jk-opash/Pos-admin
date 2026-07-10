"use client";

import { useState } from "react";
import { mockDashboardStats } from "@/lib/mock/dashboard-stats";
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
import { cn } from "@/lib/utils";
import { Calendar as CalendarIcon, Download, Filter } from "lucide-react";

export default function DashboardPage() {
  const stats = mockDashboardStats;
  const [activeTab, setActiveTab] = useState<
    "overview" | "analytics" | "operations" | "health"
  >("overview");

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "analytics", label: "Analytics" },
    { id: "operations", label: "Operations" },
    { id: "health", label: "System Health" },
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

        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2 h-9 text-sm">
            <CalendarIcon className="h-4 w-4" /> This Month
          </Button>
          <Button variant="outline" className="gap-2 h-9 text-sm">
            <Filter className="h-4 w-4" /> Filters
          </Button>
          <Button variant="outline" className="gap-2 h-9 text-sm">
            <Download className="h-4 w-4" /> Export
          </Button>
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
              <QuickActions />
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

          <div className="grid grid-cols-1 gap-6">
            <div className="lg:col-span-2">
              <UserTechAnalytics
                deviceData={stats.deviceUsage}
                browserData={stats.browserUsage}
              />
            </div>
          </div>
        </div>
      )}

      {/* Operations Tab */}
      {activeTab === "operations" && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300 ease-spring">
          <div className="grid grid-cols-1 gap-6">
            <SupportSnapshot metrics={stats.supportMetrics} />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RecentRegistrationsTable />
            <PendingApprovalsTable />
          </div>
        </div>
      )}

      {/* Health Tab */}
      {activeTab === "health" && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300 ease-spring">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              {stats.systemHealth && (
                <SystemHealth health={stats.systemHealth} />
              )}
            </div>
            <div className="lg:col-span-2 bg-brand-light border border-brand-border rounded-xl flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <p className="text-sm font-medium text-brand-muted">
                  Audit & Security Logs
                </p>
                <p className="text-xs text-brand-placeholder mt-1">
                  Detailed logs will appear here
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
