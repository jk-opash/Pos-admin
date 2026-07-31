"use client";

import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Check, Box, Building2, Rocket, Loader2 } from "lucide-react";
import { SubscriptionPlan } from "@/types";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";
import { useState } from "react";
import { useAppDispatch } from "@/store/hooks";
import { updateSubscriptionPlan, fetchSubscriptions } from "@/store/slices/subscriptionSlice";

export function PlanCard({ plan }: { plan: SubscriptionPlan }) {
  const dispatch = useAppDispatch();
  const [isToggling, setIsToggling] = useState(false);

  const handleToggle = async () => {
    setIsToggling(true);
    try {
      await dispatch(updateSubscriptionPlan({ id: plan.id, data: { is_active: !plan.isActive } })).unwrap();
      await dispatch(fetchSubscriptions());
    } catch (err) {
      console.error("Failed to toggle plan active status", err);
    } finally {
      setIsToggling(false);
    }
  };

  const isEnterprise = plan.planType === "enterprise";
  const isPro = plan.planType === "paid"; // Or whatever denotes the middle tier
  const planName = plan.name.replace("_", " ");
  // Decide an icon based on plan type for the top-left
  const PlanIcon = isEnterprise ? Building2 : isPro ? Rocket : Box;

  return (
    <div
      className={`relative flex flex-col h-full rounded-2xl border transition-colors ${
        isEnterprise
          ? "bg-brand-dark text-white border-brand-dark"
          : "bg-white border-brand-border text-brand-dark"
      }`}
    >
      <div className="flex flex-col flex-1 p-5">
        <div className="flex justify-between items-start mb-4">
          <PlanIcon
            className={`h-8 w-8 ${isEnterprise ? "text-white" : "text-brand-dark"}`}
            strokeWidth={1.5}
          />
          <div className="flex flex-col gap-2 items-end">
            <div className="flex flex-wrap gap-1 justify-end">
              {plan.isPopular && (
                <Badge
                  variant="purple"
                  className="text-[10px] bg-purple-100 text-purple-700 border-none font-semibold px-2 py-0.5"
                >
                  Most Popular
                </Badge>
              )}
              {!plan.isActive && (
                <Badge
                  variant="danger"
                  className="text-[10px] bg-red-100 text-red-700 border-red-200 font-semibold px-2 py-0.5"
                >
                  Inactive
                </Badge>
              )}
            </div>
            
            <label className="flex items-center gap-2 cursor-pointer group mt-1">
              <span className={`text-[10px] font-medium ${isEnterprise ? 'text-slate-300' : 'text-slate-500'}`}>
                {plan.isActive ? 'Active' : 'Inactive'}
              </span>
              <div className="relative inline-flex h-[20px] w-[36px] shrink-0 cursor-pointer items-center justify-center rounded-full">
                <input
                  type="checkbox"
                  className="peer sr-only"
                  checked={plan.isActive}
                  onChange={handleToggle}
                  disabled={isToggling}
                />
                <span className="pointer-events-none absolute h-full w-full rounded-full bg-slate-200 transition-colors peer-checked:bg-brand-primary peer-focus-visible:ring-2 peer-focus-visible:ring-brand-primary peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-white peer-disabled:cursor-not-allowed peer-disabled:opacity-50"></span>
                <span className={`pointer-events-none absolute left-[2px] h-[16px] w-[16px] rounded-full bg-white shadow-sm ring-0 transition-transform ${plan.isActive ? 'translate-x-[16px]' : 'translate-x-0'} flex items-center justify-center`}>
                  {isToggling && <Loader2 className="h-2.5 w-2.5 animate-spin text-brand-primary" />}
                </span>
              </div>
            </label>
          </div>
        </div>

        {/* Title & Description */}
        <h3 className="text-xl font-semibold mb-1">{planName}</h3>
        <p
          className={`text-xs mb-4 ${isEnterprise ? "text-slate-300" : "text-brand-muted"}`}
        >
          {plan.description}
        </p>

        {/* Price */}
        <div className="flex items-center gap-1 mb-4">
          {isEnterprise ? (
            <span className="text-3xl font-bold">Custom</span>
          ) : plan.pricing.monthly === 0 ? (
            <span className="text-3xl font-bold">Free</span>
          ) : (
            <>
              <span className="text-3xl font-bold">
                {formatCurrency(plan.pricing.monthly, true).replace(".00", "")}
              </span>
            </>
          )}
          {plan.pricing.monthly > 0 && !isEnterprise && (
            <div className="flex flex-col ml-1">
              <span
                className={`text-[10px] leading-tight ${isEnterprise ? "text-slate-400" : "text-brand-muted"}`}
              >
                INR / month
              </span>
              <span
                className={`text-[10px] leading-tight ${isEnterprise ? "text-slate-400" : "text-brand-muted"}`}
              >
                billed monthly
              </span>
            </div>
          )}
        </div>

        {/* Action Button */}
        <Link
          href={`/subscriptions/plans/edit/${plan.id}`}
          className="w-full mb-5 mt-2"
        >
          <Button
            variant={isEnterprise ? "outline" : "primary"}
            className={`w-full font-medium ${
              isEnterprise
                ? "bg-white text-brand-dark border-transparent hover:bg-slate-100"
                : "bg-brand-dark text-white hover:bg-black border-transparent"
            }`}
          >
            Configure Plan
          </Button>
        </Link>

        <div
          className={`h-px w-full mb-5 ${isEnterprise ? "bg-slate-700" : "bg-slate-200"}`}
        ></div>

        {/* Features Checklist */}
        <div className="flex-1">
          <p
            className={`text-xs font-semibold mb-3 ${isEnterprise ? "text-white" : "text-brand-dark"}`}
          >
            Plan limits & features:
          </p>
          <div className="space-y-2.5">
            <FeatureRow
              label={`${plan.limits.branches === -1 ? "Unlimited" : plan.limits.branches} Branches`}
              included={true}
              isEnterprise={isEnterprise}
            />
            <FeatureRow
              label={`${plan.limits.employees === -1 ? "Unlimited" : plan.limits.employees} Users`}
              included={true}
              isEnterprise={isEnterprise}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureRow({
  label,
  included,
  isEnterprise,
}: {
  label: string;
  included: boolean;
  isEnterprise: boolean;
}) {
  if (!included) return null; // Optionally hide excluded features entirely for a cleaner look

  return (
    <div className="flex items-start gap-2">
      <Check
        className={`h-3.5 w-3.5 mt-0.5 shrink-0 ${isEnterprise ? "text-slate-300" : "text-slate-500"}`}
        strokeWidth={2.5}
      />
      <span
        className={`text-[13px] leading-tight ${isEnterprise ? "text-slate-300" : "text-slate-600"}`}
      >
        {label}
      </span>
    </div>
  );
}
