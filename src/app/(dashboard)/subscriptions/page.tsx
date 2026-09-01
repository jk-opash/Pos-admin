"use client";
/* eslint-disable @typescript-eslint/no-unused-vars */

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchSubscriptions,
  fetchInvoices,
} from "@/store/slices/subscriptionSlice";
import { fetchBusinesses } from "@/store/slices/businessSlice";
import { StatsCard } from "@/components/ui/StatsCard";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import {
  CreditCard,
  Users,
  Store,
  TrendingUp,
  AlertCircle,
  FileText,
  Loader2,
  PlusCircle,
} from "lucide-react";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import { LottieLoader } from "@/components/ui/LottieLoader";

export default function SubscriptionsDashboard() {
  const dispatch = useAppDispatch();
  const {
    subscriptions,
    invoices,
    loading: subLoading,
  } = useAppSelector((state) => state.subscription);
  const { businesses, loading: busLoading } = useAppSelector(
    (state) => state.business,
  );

  useEffect(() => {
    dispatch(fetchSubscriptions());
    dispatch(fetchInvoices());
    dispatch(fetchBusinesses());
  }, [dispatch]);

  // Dynamic calculations from API data
  const activeSubs = businesses.filter((b) => b.status === "active").length;
  const trialSubs = businesses.filter((b) => b.status === "trial").length;
  const overdueInvoices = invoices.filter(
    (i) => i.status === "overdue" || i.status === "pending",
  ).length;

  // Real MRR calculation: Sum of active business plan amounts + paid addon invoices
  const activePlansMRR = businesses
    .filter((b) => b.status === "active" || b.status === "trial")
    .reduce((acc, b) => acc + Number(b.subscription_plan?.amount || 0), 0);

  const paidAddonsTotal = invoices
    .filter(
      (i) =>
        i.invoice_number?.startsWith("INV-ADDON-") &&
        (i.status === "paid" || i.status === "success"),
    )
    .reduce((acc, i) => acc + Number(i.amount || 0), 0);

  const paidInvoicesTotal = invoices
    .filter((i) => i.status === "paid" || i.status === "success")
    .reduce((acc, curr) => acc + Number(curr.amount || 0), 0);

  const mrr = activePlansMRR + paidAddonsTotal || paidInvoicesTotal;
  const arr = mrr * 12;

  const isLoading =
    subLoading && busLoading && !businesses.length && !invoices.length;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-40">
        <LottieLoader size="lg" text="Loading dashboard..." />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-brand-dark">
            Subscriptions Dashboard
          </h1>
          <p className="mt-1 text-sm text-brand-muted">
            Overview of SaaS revenue, active subscriptions, and billing health.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/subscriptions/plans">
            <Button variant="outline" className="gap-2">
              <Store className="h-4 w-4" /> Manage Plans
            </Button>
          </Link>
          <Link href="/subscriptions/addons">
            <Button
              variant="outline"
              className="gap-2 border-brand-primary text-brand-primary hover:bg-brand-primaryLight hover:text-brand-primaryDark transition-colors"
            >
              <PlusCircle className="h-4 w-4" /> Buy Add-ons
            </Button>
          </Link>
        </div>
      </div>

      {/* Primary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Monthly Revenue (MRR)"
          value={formatCurrency(mrr)}
          icon={<TrendingUp className="h-5 w-5" />}
        />
        <StatsCard
          title="Annual Revenue (ARR)"
          value={formatCurrency(arr)}
          icon={<CreditCard className="h-5 w-5" />}
        />
        <StatsCard
          title="Active Subscriptions"
          value={activeSubs}
          icon={<Users className="h-5 w-5" />}
        />
        <StatsCard
          title="Trial Businesses"
          value={trialSubs}
          icon={<Store className="h-5 w-5" />}
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 flex items-center gap-4">
          <div className="rounded-full bg-amber-100 p-3">
            <AlertCircle className="h-6 w-6 text-amber-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-amber-800">
              Pending / Overdue Invoices
            </p>
            <p className="text-2xl font-bold text-amber-900">
              {overdueInvoices}
            </p>
          </div>
        </div>
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 flex items-center gap-4">
          <div className="rounded-full bg-blue-100 p-3">
            <TrendingUp className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-blue-800">
              Total Billed Invoices
            </p>
            <p className="text-2xl font-bold text-blue-900">
              {invoices.length}
            </p>
          </div>
        </div>
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 flex items-center gap-4">
          <div className="rounded-full bg-emerald-100 p-3">
            <Users className="h-6 w-6 text-emerald-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-emerald-800">
              Total Registered Tenants
            </p>
            <p className="text-2xl font-bold text-emerald-900">
              {businesses.length}
            </p>
          </div>
        </div>
      </div>

      {/* Main Charts & Lists Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-brand-dark">
              Revenue Growth (Monthly)
            </h3>
            <span className="text-xs font-semibold text-brand-muted bg-slate-100 px-2.5 py-1 rounded-md">
              {new Date().getFullYear()}
            </span>
          </div>

          {/* Calculate dynamic monthly revenues */}
          {(() => {
            const monthlyRevenues = Array(12).fill(0);
            invoices.forEach((inv: any) => {
              if (inv.status === "paid" || inv.status === "success") {
                const invDate = new Date(
                  inv.issued_at || inv.created_at || inv.paid_at,
                );
                if (!isNaN(invDate.getTime())) {
                  monthlyRevenues[invDate.getMonth()] += Number(
                    inv.amount || 0,
                  );
                }
              }
            });

            const maxRevenue = Math.max(...monthlyRevenues, 1000);
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

            return (
              <>
                <div className="h-64 flex items-end justify-between gap-2 px-2 border-b border-brand-border/60 pb-2">
                  {monthlyRevenues.map((val, i) => {
                    const heightPercent =
                      val > 0 ? (val / maxRevenue) * 100 : 4;
                    return (
                      <div
                        key={i}
                        className="w-full bg-brand-primaryLight rounded-t-md hover:bg-brand-primary/80 transition-all relative group cursor-pointer"
                        style={{ height: `${heightPercent}%` }}
                      >
                        <div className="absolute -top-9 left-1/2 -translate-x-1/2 bg-brand-dark text-white text-xs px-2.5 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-md z-10">
                          {formatCurrency(val)}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="flex justify-between mt-3 text-xs font-medium text-brand-placeholder px-2 uppercase">
                  {monthLabels.map((m) => (
                    <span key={m}>{m}</span>
                  ))}
                </div>
              </>
            );
          })()}
        </Card>

        <Card>
          <div className="flex items-center justify-between gap-4 mb-4">
            <h3 className="text-lg font-bold text-brand-dark">
              Recent Invoices
            </h3>
            <Link
              href="/payments"
              className="text-sm text-brand-primary font-medium hover:underline"
            >
              View All
            </Link>
          </div>
          <div className="space-y-4">
            {invoices.length > 0 ? (
              invoices.slice(0, 3).map((inv: any) => (
                <div
                  key={inv.id}
                  className="flex items-center justify-between gap-4 p-3 rounded-xl border border-brand-border hover:bg-slate-50 transition-colors"
                >
                  <div>
                    <p className="font-semibold text-brand-dark text-sm">
                      {inv.business?.name || "Business"}
                    </p>
                    <p className="text-xs font-mono text-brand-muted mt-0.5">
                      Inv: {inv.invoice_number || inv.id.slice(0, 8)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-brand-dark text-sm">
                      {formatCurrency(Number(inv.amount || 0))}
                    </p>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        inv.status === "paid"
                          ? "bg-emerald-100 text-emerald-700"
                          : inv.status === "overdue"
                            ? "bg-red-100 text-red-700"
                            : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {inv.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-12 text-center text-sm text-brand-muted">
                No invoices generated yet.
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
