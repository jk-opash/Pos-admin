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
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const planSchema = z.object({
  plan: z.string().min(1, "Plan name is required"),
  status: z.string().min(1, "Status is required"),
  currency: z.string().min(1, "Currency is required"),
  billing_cycle: z.string().min(1, "Billing cycle is required"),
  amount: z.number().min(0, "Amount must be a positive number or 0"),
  max_branches: z
    .number()
    .min(0, "Must be a valid number (use 0 for unlimited)"),
  max_team_members: z
    .number()
    .min(0, "Must be a valid number (use 0 for unlimited)"),
  auto_renew: z.boolean(),
  cancel_at_period_end: z.boolean(),
  is_active: z.boolean(),
});

type PlanFormValues = z.infer<typeof planSchema>;

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

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PlanFormValues>({
    resolver: zodResolver(planSchema),
  });

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
        reset({
          plan: plan.plan,
          status: plan.status,
          currency: plan.currency || "INR",
          billing_cycle: plan.billing_cycle || "yearly",
          amount: plan.amount || 0,
          max_branches: plan.max_branches || 0,
          max_team_members: plan.max_team_members || 0,
          auto_renew: plan.auto_renew ?? true,
          cancel_at_period_end: plan.cancel_at_period_end ?? false,
          is_active: plan.is_active ?? true,
        });
      }
    }
  }, [subscriptions, id, reset]);

  const onSubmit = async (data: PlanFormValues) => {
    setIsSaving(true);
    try {
      await dispatch(updateSubscriptionPlan({ id, data })).unwrap();
      toast.success("Plan updated successfully!");
      router.push("/subscriptions/plans");
    } catch (err) {
      console.error("Failed to update plan:", err);
      toast.error("Failed to update plan");
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
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 pb-12  mx-auto"
    >
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

      {/* Right Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
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
                {...register("plan")}
                error={errors.plan?.message}
                options={[
                  { label: "Free Trial", value: "free trial" },
                  { label: "Starter", value: "starter" },
                  { label: "Growth", value: "growth" },
                  { label: "Professional", value: "professional" },
                  { label: "Enterprise", value: "enterprise" },
                ]}
              />
              <Select
                label="Status *"
                {...register("status")}
                error={errors.status?.message}
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
                {...register("currency")}
                error={errors.currency?.message}
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
                {...register("billing_cycle")}
                error={errors.billing_cycle?.message}
                options={[
                  { label: "Monthly", value: "monthly" },
                  { label: "Yearly", value: "yearly" },
                ]}
              />
              <Input
                label="Amount / Price *"
                type="number"
                step="0.01"
                placeholder="0.00"
                {...register("amount", { valueAsNumber: true })}
                error={errors.amount?.message}
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
                type="number"
                {...register("max_branches", { valueAsNumber: true })}
                error={errors.max_branches?.message}
              />
              <Input
                label="Max Employees / Users"
                type="number"
                {...register("max_team_members", { valueAsNumber: true })}
                error={errors.max_team_members?.message}
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
                  {...register("auto_renew")}
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
                  {...register("cancel_at_period_end")}
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
    </form>
  );
}
