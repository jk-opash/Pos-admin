import { useState, useMemo } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useAppSelector } from "@/store/hooks";
import {
  CreditCard,
  Landmark,
  QrCode,
  Banknote,
  ShieldCheck,
} from "lucide-react";

export function StepPayment() {
  const [method, setMethod] = useState<"card" | "upi" | "netbanking" | "cash">(
    "upi",
  );
  const [cardDetails, setCardDetails] = useState({
    name: "",
    number: "",
    expiry: "",
    cvv: "",
  });

  const { onboardingForm } = useAppSelector((state: any) => state.business);
  const { subscriptions } = useAppSelector((state: any) => state.subscription);

  const selectedPlanDetails = useMemo(() => {
    const plan = subscriptions.find(
      (p: any) => p.id === onboardingForm.subscriptionPlanId,
    );
    if (!plan) return { name: "Select a plan", price: "$0", period: "Monthly" };

    const monthlyPrice = parseFloat(plan.amount || 0);
    const displayPrice =
      onboardingForm.billingCycle === "monthly"
        ? monthlyPrice
        : monthlyPrice * 12 * 0.8;
    return {
      name: plan.plan.charAt(0).toUpperCase() + plan.plan.slice(1) + " Plan",
      price: `₹${displayPrice.toLocaleString()}`,
      period:
        onboardingForm.billingCycle === "monthly"
          ? "Billed monthly"
          : "Billed yearly",
    };
  }, [
    subscriptions,
    onboardingForm.subscriptionPlanId,
    onboardingForm.billingCycle,
  ]);

  return (
    <div className="space-y-6">
      {/* Subscription Summary */}
      <div className="bg-brand-light border border-brand-border p-4 rounded-xl flex justify-between items-center">
        <div>
          <p className="text-xs text-brand-muted font-semibold uppercase tracking-wider mb-1">
            Selected Plan
          </p>
          <p className="text-lg font-bold text-brand-dark">
            {selectedPlanDetails.name}
          </p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-black text-brand-primary">
            {selectedPlanDetails.price}
            <span className="text-sm font-normal text-brand-muted">
              {onboardingForm.billingCycle === "monthly" ? "/mo" : "/yr"}
            </span>
          </p>
          <p className="text-xs text-brand-muted">
            {selectedPlanDetails.period}
          </p>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="space-y-3">
        <label className="text-sm font-semibold text-brand-dark">
          Select Payment Method
        </label>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div
            onClick={() => setMethod("upi")}
            className={`rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer transition-colors relative ${method === "upi" ? "border-2 border-brand-primary bg-indigo-50/50" : "border border-brand-border bg-white hover:border-brand-borderHover"}`}
          >
            {method === "upi" && (
              <div className="absolute top-2 right-2 h-2.5 w-2.5 rounded-full bg-brand-primary ring-2 ring-indigo-100" />
            )}
            <QrCode
              className={`h-6 w-6 mb-2 ${method === "upi" ? "text-brand-primary" : "text-brand-muted"}`}
            />
            <span
              className={`text-sm ${method === "upi" ? "font-semibold text-brand-dark" : "font-medium text-brand-muted"}`}
            >
              UPI
            </span>
          </div>

          <div
            onClick={() => setMethod("card")}
            className={`rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer transition-colors relative ${method === "card" ? "border-2 border-brand-primary bg-indigo-50/50" : "border border-brand-border bg-white hover:border-brand-borderHover"}`}
          >
            {method === "card" && (
              <div className="absolute top-2 right-2 h-2.5 w-2.5 rounded-full bg-brand-primary ring-2 ring-indigo-100" />
            )}
            <CreditCard
              className={`h-6 w-6 mb-2 ${method === "card" ? "text-brand-primary" : "text-brand-muted"}`}
            />
            <span
              className={`text-sm ${method === "card" ? "font-semibold text-brand-dark" : "font-medium text-brand-muted"}`}
            >
              Card
            </span>
          </div>

          <div
            onClick={() => setMethod("netbanking")}
            className={`rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer transition-colors relative ${method === "netbanking" ? "border-2 border-brand-primary bg-indigo-50/50" : "border border-brand-border bg-white hover:border-brand-borderHover"}`}
          >
            {method === "netbanking" && (
              <div className="absolute top-2 right-2 h-2.5 w-2.5 rounded-full bg-brand-primary ring-2 ring-indigo-100" />
            )}
            <Landmark
              className={`h-6 w-6 mb-2 ${method === "netbanking" ? "text-brand-primary" : "text-brand-muted"}`}
            />
            <span
              className={`text-sm ${method === "netbanking" ? "font-semibold text-brand-dark" : "font-medium text-brand-muted"}`}
            >
              Netbanking
            </span>
          </div>

          <div
            onClick={() => setMethod("cash")}
            className={`rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer transition-colors relative ${method === "cash" ? "border-2 border-brand-primary bg-indigo-50/50" : "border border-brand-border bg-white hover:border-brand-borderHover"}`}
          >
            {method === "cash" && (
              <div className="absolute top-2 right-2 h-2.5 w-2.5 rounded-full bg-brand-primary ring-2 ring-indigo-100" />
            )}
            <Banknote
              className={`h-6 w-6 mb-2 ${method === "cash" ? "text-brand-primary" : "text-brand-muted"}`}
            />
            <span
              className={`text-sm ${method === "cash" ? "font-semibold text-brand-dark" : "font-medium text-brand-muted"}`}
            >
              Cash
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
