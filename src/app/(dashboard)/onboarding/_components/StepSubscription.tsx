"use client";

import { useEffect } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchSubscriptions } from "@/store/slices/subscriptionSlice";
import { updateOnboardingForm } from "@/store/slices/businessSlice";

export function StepSubscription() {
  const dispatch = useAppDispatch();
  const { subscriptions, loading } = useAppSelector(
    (state) => state.subscription,
  );
  const { onboardingForm } = useAppSelector((state: any) => state.business);

  const selectedPlan = onboardingForm.subscriptionPlanId;
  const billingCycle = onboardingForm.billingCycle || "monthly";

  useEffect(() => {
    dispatch(fetchSubscriptions());
  }, [dispatch]);

  useEffect(() => {
    if (subscriptions.length > 0 && !selectedPlan) {
      dispatch(updateOnboardingForm({ subscriptionPlanId: subscriptions[0].id, billingCycle: "monthly" }));
    }
  }, [subscriptions, selectedPlan, dispatch]);

  const mappedPlans = subscriptions.map((sub: any) => {
    const monthlyPrice = parseFloat(sub.amount || 0);
    const yearlyPrice = monthlyPrice * 12 * 0.8; // 20% discount mock
    const displayPrice =
      billingCycle === "monthly" ? monthlyPrice : yearlyPrice;

    return {
      id: sub.id,
      name: sub.plan.charAt(0).toUpperCase() + sub.plan.slice(1),
      price: displayPrice === 0 ? "₹0" : `₹${displayPrice.toLocaleString()}`,
      period:
        displayPrice === 0
          ? ""
          : billingCycle === "monthly"
            ? "/month"
            : "/year",
      desc: `Ideal for ${sub.max_branches || "unlimited"} branches and ${sub.max_team_members || "unlimited"} users.`,
      limits: `${sub.max_branches || "Unlimited"} Branch${sub.max_branches === 1 ? "" : "es"}, ${sub.max_team_members || "Unlimited"} User${sub.max_team_members === 1 ? "" : "s"}`,
      popular: sub.plan === "growth" || sub.plan === "professional",
    };
  });

  return (
    <div className="space-y-6">
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-brand-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mappedPlans.map((p) => (
            <div
              key={p.id}
              onClick={() => dispatch(updateOnboardingForm({ subscriptionPlanId: p.id }))}
              className={`relative cursor-pointer rounded-2xl border-2 p-5 transition-all ${
                selectedPlan === p.id
                  ? "border-brand-primary bg-brand-primaryLight"
                  : "border-brand-border bg-white hover:border-indigo-200"
              }`}
            >
              {p.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-brand-primary px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                  Most Popular
                </span>
              )}
              <div className="flex justify-between items-start">
                <div>
                  <h4
                    className={`text-lg font-bold ${selectedPlan === p.id ? "text-brand-primaryDark" : "text-brand-dark"}`}
                  >
                    {p.name}
                  </h4>
                  <p className="text-sm text-brand-muted mt-1 pr-4">{p.desc}</p>
                </div>
                <div
                  className={`h-5 w-5 rounded-full border flex items-center justify-center shrink-0 ${selectedPlan === p.id ? "border-brand-primary bg-brand-primary" : "border-brand-borderHover"}`}
                >
                  {selectedPlan === p.id && (
                    <div className="h-2 w-2 rounded-full bg-white" />
                  )}
                </div>
              </div>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-2xl font-black text-brand-dark">
                  {p.price}
                </span>
                <span className="text-sm font-medium text-brand-muted">
                  {p.period}
                </span>
              </div>
              <div className="mt-4 pt-4 border-t border-brand-border">
                <p className="text-xs font-semibold text-brand-dark mb-2 uppercase tracking-wide">
                  Included Limits
                </p>
                <ul className="space-y-2">
                  {p.limits.split(", ").map((limit: string, idx: number) => (
                    <li
                      key={idx}
                      className="flex items-center gap-2 text-sm text-brand-muted"
                    >
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                      {limit}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
