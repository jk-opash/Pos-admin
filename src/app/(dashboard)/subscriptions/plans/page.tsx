"use client";
/* eslint-disable @typescript-eslint/no-unused-vars */

import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchSubscriptions } from "@/store/slices/subscriptionSlice";
import Link from "next/link";
import { Plus, CheckCircle2, Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { PlanCard } from "@/app/(dashboard)/subscriptions/_components/PlanCard";
import { SubscriptionPlan } from "@/types";

export default function PlansPage() {
  const dispatch = useAppDispatch();
  const { subscriptions, loading } = useAppSelector(
    (state) => state.subscription,
  );

  const [activeTab, setActiveTab] = useState<
    "published" | "draft" | "archived"
  >("published");
  const [search, setSearch] = useState("");

  useEffect(() => {
    dispatch(fetchSubscriptions());
  }, [dispatch]);

  // Map backend Subscription data to the frontend SubscriptionPlan type for PlanCard
  const mappedPlans: SubscriptionPlan[] = subscriptions.map((sub) => ({
    id: sub.id,
    name: sub.plan.charAt(0).toUpperCase() + sub.plan.slice(1),
    slug: sub.plan as any,
    description: `Configured for ${sub.max_team_members || "unlimited"} users and ${sub.max_branches || "unlimited"} branches.`,
    industry: "all",
    planType:
      sub.plan === "enterprise"
        ? "enterprise"
        : sub.amount > 0
          ? "paid"
          : "free",
    billingCycle: sub.billing_cycle as any,
    currency: sub.currency as any,
    pricing: {
      monthly: parseFloat(sub.amount),
      yearly: parseFloat(sub.amount) * 12 * 0.8, // Assuming 20% discount on yearly
    },
    limits: {
      branches: sub.max_branches || -1,
      employees: sub.max_team_members || -1,
      products: -1,
      customers: -1,
      monthlyOrders: -1,
      posDevices: -1,
      suppliers: -1,
      purchaseOrders: -1,
      apiCalls: -1,
      storageLimitGB: -1,
    },
    modules: {
      pos: true,
      inventory: true,
      purchase: true,
      suppliers: true,
      customers: true,
      crm: true,
      hr: false,
      restaurant: false,
      loyalty: false,
      accounting: false,
      analytics: sub.plan === "enterprise" || sub.plan === "professional",
      apiAccess: sub.plan === "enterprise" || sub.plan === "professional",
    },
    features: {
      offlinePos: true,
      barcode: true,
      advancedReports: sub.plan === "enterprise" || sub.plan === "professional",
      whatsappReceipt: true,
      customBranding: sub.plan === "enterprise",
      webhooks: sub.plan === "enterprise" || sub.plan === "professional",
    },
    trialDays: 14,
    isPopular: sub.plan === "professional" || sub.plan === "growth",
    isActive:
      sub.is_active ?? (sub.status === "active" || sub.status === "trialing"),
  }));

  const filteredPlans = mappedPlans.filter((plan) => {
    if (search && !plan.name.toLowerCase().includes(search.toLowerCase()))
      return false;

    // In a real app, we'd have a status field. For mock, we'll just show all in published.
    if (activeTab === "published") return plan.isActive;
    if (activeTab === "draft") return !plan.isActive; // Dummy logic
    if (activeTab === "archived") return false; // Dummy logic
    return true;
  });

  return (
    <div className="relative min-h-screen space-y-8 pb-12">
      {/* Background Decorators for Glassmorphism */}
      <div className="absolute top-0 -left-1/4 w-[600px] h-[600px] bg-brand-primary/10 rounded-full mix-blend-multiply filter blur-3xl opacity-70 pointer-events-none z-0"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-400/10 rounded-full mix-blend-multiply filter blur-3xl opacity-70 pointer-events-none z-0"></div>

      {/* Header */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-brand-dark tracking-tight">
            Subscription Plans
          </h1>
          <p className="mt-2 text-base text-brand-muted max-w-xl leading-relaxed">
            Configure plan limits, modules, features, and pricing tiers to scale
            with your business.
          </p>
        </div>
        <Link href="/subscriptions/plans/new">
          <Button className="gap-2 shrink-0 bg-brand-dark hover:bg-black text-white rounded-full px-6 py-6 shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all">
            <Plus className="h-5 w-5" />
            <span className="font-bold">Create New Plan</span>
          </Button>
        </Link>
      </div>

      {/* Main Container */}
      <div className="relative z-10 w-full">
        {/* Toolbar: Tabs & Search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
          {/* <div className="bg-white/60 backdrop-blur-md p-1.5 flex items-center rounded-full border border-slate-200/60 shadow-sm w-fit">
            {(["published", "draft", "archived"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2.5 rounded-full text-sm font-bold capitalize transition-all duration-300 ${
                  activeTab === tab
                    ? "bg-white text-brand-dark shadow-sm ring-1 ring-slate-200/50"
                    : "text-slate-500 hover:text-brand-dark hover:bg-white/40"
                }`}
              >
                {tab}
              </button>
            ))}
          </div> */}
          <div className="relative w-full sm:w-80 group">
            <input
              type="text"
              placeholder="Search plans..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-4 pr-4 py-3 rounded-full border border-slate-200/60 bg-white/60 backdrop-blur-md text-sm font-medium focus:bg-white focus:border-brand-primary focus:outline-none focus:ring-4 focus:ring-brand-primary/10 transition-all shadow-sm"
            />
          </div>
        </div>

        {/* Plan Grid */}
        <div>
          {filteredPlans.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredPlans.map((plan) => (
                <PlanCard key={plan.id} plan={plan} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center bg-white/40 backdrop-blur-xl border border-white/60 rounded-3xl shadow-glass">
              <div className="h-20 w-20 rounded-full bg-white shadow-sm flex items-center justify-center mb-6">
                <Search className="h-8 w-8 text-slate-300" />
              </div>
              <h3 className="text-xl font-black text-brand-dark">
                No plans found
              </h3>
              <p className="text-base text-brand-muted mt-2 max-w-sm">
                Try adjusting your search terms or switch to a different tab.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
