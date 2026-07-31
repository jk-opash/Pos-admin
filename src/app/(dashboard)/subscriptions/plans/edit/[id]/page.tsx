"use client";
import { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Badge } from "@/components/ui/Badge";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import {
  updateSubscriptionPlan,
  fetchSubscriptions,
} from "@/store/slices/subscriptionSlice";
import { SubscriptionPlan } from "@/types";

export default function EditPlanPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [isSaving, setIsSaving] = useState(false);
  const resolvedParams = use(params);
  const { id } = resolvedParams;

  const { subscriptions, loading } = useSelector(
    (state: RootState) => state.subscription,
  );

  const [initialData, setInitialData] = useState<any>(null);

  useEffect(() => {
    if (subscriptions.length === 0) {
      dispatch(fetchSubscriptions());
    }
  }, [dispatch, subscriptions.length]);

  useEffect(() => {
    if (subscriptions.length > 0) {
      const plan = subscriptions.find(
        (p: any) => p.id === id || p.plan_id === id,
      );
      if (plan) {
        setInitialData(plan);
      }
    }
  }, [subscriptions, id]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      plan: formData.get("plan") as string,
      status: formData.get("status") as string,
      currency: formData.get("currency") as string,
      billing_cycle: formData.get("billing_cycle") as string,
      amount: Number(formData.get("amount")) || 0,
      max_branches: Number(formData.get("max_branches")) || 0,
      max_team_members: Number(formData.get("max_team_members")) || 0,
      auto_renew: formData.get("auto_renew") === "on",
      cancel_at_period_end: formData.get("cancel_at_period_end") === "on",
      is_active: formData.get("is_active") === "on",
    };

    try {
      await dispatch(updateSubscriptionPlan({ id, data })).unwrap();
      router.push("/subscriptions/plans");
    } catch (err) {
      console.error("Failed to update plan:", err);
    } finally {
      setIsSaving(false);
    }
  };

  if (!initialData && loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="h-8 w-8 animate-spin rounded-full border-4 border-brand-primary border-t-transparent" />
      </div>
    );
  }

  if (!initialData && !loading) {
    return (
      <div className="flex flex-col justify-center items-center h-64 space-y-4">
        <p className="text-brand-dark font-medium">
          Subscription plan not found.
        </p>
        <Button onClick={() => router.push("/subscriptions/plans")}>
          Back to Plans
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pb-12 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Link
            href="/subscriptions/plans"
            className="inline-flex items-center gap-2 text-sm text-brand-muted hover:text-brand-dark mb-2 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Plans
          </Link>
          <h1 className="text-2xl font-bold text-brand-dark">
            Edit Subscription Plan
          </h1>
          <p className="mt-1 text-sm text-brand-muted">
            Update limits, modules, features, and pricing for this subscription
            tier.
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          <Button
            variant="outline"
            type="button"
            onClick={() => router.push("/subscriptions/plans")}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSaving}
            className="gap-2 bg-brand-primary hover:bg-brand-primaryDark text-white border-none"
          >
            {isSaving ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Save Changes
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Sidebar (Navigation / Jump Links) */}
        <div className="hidden lg:block lg:col-span-1">
          <div className="sticky top-6 space-y-1">
            <h3 className="text-xs font-bold text-brand-placeholder uppercase tracking-wider mb-4 px-3">
              Sections
            </h3>
            <a
              href="#basic-info"
              className="block px-3 py-2 text-sm font-semibold text-brand-primary bg-brand-primaryLight rounded-lg"
            >
              Basic Information
            </a>
            <a
              href="#pricing"
              className="block px-3 py-2 text-sm font-medium text-brand-muted hover:text-brand-dark hover:bg-slate-100 rounded-lg"
            >
              Pricing & Billing
            </a>
            <a
              href="#limits"
              className="block px-3 py-2 text-sm font-medium text-brand-muted hover:text-brand-dark hover:bg-slate-100 rounded-lg"
            >
              Resource Limits
            </a>
            <a
              href="#renewal"
              className="block px-3 py-2 text-sm font-medium text-brand-muted hover:text-brand-dark hover:bg-slate-100 rounded-lg"
            >
              Renewal Settings
            </a>
          </div>
        </div>

        {/* Right Content Area */}
        <div className="lg:col-span-3 space-y-8">
          {/* Section: Basic Info */}
          <div
            id="basic-info"
            className="rounded-2xl border border-brand-border bg-white shadow-sm overflow-hidden scroll-mt-6"
          >
            <div className="px-6 py-4 border-b border-brand-border bg-brand-light">
              <h2 className="font-bold text-brand-dark">Basic Information</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  label="Plan Name *"
                  name="plan"
                  defaultValue={initialData?.plan}
                  options={[
                    { label: "Free Trial", value: "free_trial" },
                    { label: "Starter", value: "starter" },
                    { label: "Growth", value: "growth" },
                    { label: "Professional", value: "professional" },
                    { label: "Enterprise", value: "enterprise" },
                  ]}
                />
                <Select
                  label="Status *"
                  name="status"
                  defaultValue={initialData?.status}
                  options={[
                    { label: "Active", value: "active" },
                    { label: "Trialing", value: "trialing" },
                    { label: "Draft", value: "draft" },
                  ]}
                />
              </div>
            </div>
          </div>

          {/* Section: Pricing & Billing */}
          <div
            id="pricing"
            className="rounded-2xl border border-brand-border bg-white shadow-sm overflow-hidden scroll-mt-6"
          >
            <div className="px-6 py-4 border-b border-brand-border bg-brand-light">
              <h2 className="font-bold text-brand-dark">Pricing & Billing</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Select
                  label="Currency *"
                  name="currency"
                  defaultValue={initialData?.currency || "INR"}
                  options={[
                    { label: "INR (₹)", value: "INR" },
                    { label: "USD ($)", value: "USD" },
                    { label: "AED (د.إ)", value: "AED" },
                    { label: "EUR (€)", value: "EUR" },
                    { label: "GBP (£)", value: "GBP" },
                  ]}
                />
                <Select
                  label="Billing Cycle *"
                  name="billing_cycle"
                  defaultValue={initialData?.billing_cycle || "yearly"}
                  options={[{ label: "Yearly", value: "yearly" }]}
                />
                <Input
                  label="Amount / Price *"
                  name="amount"
                  type="number"
                  placeholder="0.00"
                  defaultValue={initialData?.amount}
                />
              </div>
            </div>
          </div>

          {/* Section: Resource Limits */}
          <div
            id="limits"
            className="rounded-2xl border border-brand-border bg-white shadow-sm overflow-hidden scroll-mt-6"
          >
            <div className="px-6 py-4 border-b border-brand-border bg-brand-light flex justify-between items-center">
              <h2 className="font-bold text-brand-dark">Resource Limits</h2>
              <Badge variant="muted">Use 0 for None</Badge>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <Input
                  label="Max Branches"
                  name="max_branches"
                  type="number"
                  defaultValue={initialData?.max_branches || 1}
                />
                <Input
                  label="Max Employees / Users"
                  name="max_team_members"
                  type="number"
                  defaultValue={initialData?.max_team_members || 5}
                />
              </div>
            </div>
          </div>

          {/* Section: Renewal Settings */}
          <div
            id="renewal"
            className="rounded-2xl border border-brand-border bg-white shadow-sm overflow-hidden scroll-mt-6"
          >
            <div className="px-6 py-4 border-b border-brand-border bg-brand-light">
              <h2 className="font-bold text-brand-dark">Renewal Settings</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="flex items-start gap-3 p-3 rounded-lg border border-brand-border hover:bg-brand-light cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    name="auto_renew"
                    defaultChecked={initialData?.auto_renew ?? true}
                    className="mt-0.5 h-4 w-4 rounded border-brand-border text-brand-primary focus:ring-brand-primary"
                  />
                  <div>
                    <span className="text-sm font-medium text-brand-dark block">
                      Auto Renew
                    </span>
                    <span className="text-xs text-brand-muted">
                      Automatically renew plan at period end
                    </span>
                  </div>
                </label>
                <label className="flex items-start gap-3 p-3 rounded-lg border border-brand-border hover:bg-brand-light cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    name="cancel_at_period_end"
                    defaultChecked={initialData?.cancel_at_period_end ?? false}
                    className="mt-0.5 h-4 w-4 rounded border-brand-border text-brand-primary focus:ring-brand-primary"
                  />
                  <div>
                    <span className="text-sm font-medium text-brand-dark block">
                      Cancel at Period End
                    </span>
                    <span className="text-xs text-brand-muted">
                      Terminate subscription when cycle ends
                    </span>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
