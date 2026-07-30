import { useMemo } from "react";
import {
  CheckCircle2,
  User,
  Building,
  MapPin,
  Receipt,
  CreditCard,
  XCircle
} from "lucide-react";
import { useAppSelector } from "@/store/hooks";

export function StepReview() {
  const { onboardingForm } = useAppSelector((state: any) => state.business);
  const { subscriptions } = useAppSelector((state: any) => state.subscription);

  const selectedPlanDetails = useMemo(() => {
    const plan = subscriptions.find((p: any) => p.id === onboardingForm.subscriptionPlanId);
    if (!plan) return { name: "Select a plan", price: "₹0", limits: "No limits set", period: "Per Month" };
    
    const monthlyPrice = parseFloat(plan.amount || 0);
    const displayPrice = onboardingForm.billingCycle === "monthly" ? monthlyPrice : monthlyPrice * 12 * 0.8;
    
    return {
      name: plan.plan.charAt(0).toUpperCase() + plan.plan.slice(1),
      price: `₹${displayPrice.toLocaleString()}`,
      limits: `${plan.max_branches || "Unlimited"} Branches, ${plan.max_team_members || "Unlimited"} Users`,
      period: onboardingForm.billingCycle === "monthly" ? "Per Month" : "Per Year"
    };
  }, [subscriptions, onboardingForm.subscriptionPlanId, onboardingForm.billingCycle]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          <div className="rounded-xl border border-brand-border p-4">
            <div className="flex items-center gap-2 mb-3">
              <User className="h-4 w-4 text-brand-primary" />
              <h4 className="font-semibold text-brand-dark">Owner Details</h4>
            </div>
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-y-3 text-sm">
              <div>
                <dt className="text-brand-placeholder text-xs">Full Name</dt>
                <dd className="font-medium text-brand-dark">{onboardingForm.ownerName || <span className="text-brand-muted italic">Not provided</span>}</dd>
              </div>
              <div>
                <dt className="text-brand-placeholder text-xs">Contact</dt>
                <dd className="font-medium text-brand-dark">{onboardingForm.ownerPhone || <span className="text-brand-muted italic">Not provided</span>}</dd>
              </div>
              <div className="col-span-2">
                <dt className="text-brand-placeholder text-xs">
                  Email Address
                </dt>
                <dd className="font-medium text-brand-dark">
                  {onboardingForm.ownerEmail || <span className="text-brand-muted italic">Not provided</span>}
                </dd>
              </div>
            </dl>
          </div>

          <div className="rounded-xl border border-brand-border p-4">
            <div className="flex items-center gap-2 mb-3">
              <Building className="h-4 w-4 text-brand-primary" />
              <h4 className="font-semibold text-brand-dark">
                Business Details
              </h4>
            </div>
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-y-3 text-sm">
              <div className="col-span-2">
                <dt className="text-brand-placeholder text-xs">
                  Business Name
                </dt>
                <dd className="font-medium text-brand-dark">
                  {onboardingForm.businessName || <span className="text-brand-muted italic">Not provided</span>}
                </dd>
              </div>
              <div>
                <dt className="text-brand-placeholder text-xs">Industry</dt>
                <dd className="font-medium text-brand-dark capitalize">
                  {onboardingForm.businessType || <span className="text-brand-muted italic">Not provided</span>}
                </dd>
              </div>
              <div>
                <dt className="text-brand-placeholder text-xs">Type</dt>
                <dd className="font-medium text-brand-dark capitalize">
                  {onboardingForm.businessType || <span className="text-brand-muted italic">Not provided</span>}
                </dd>
              </div>
            </dl>
          </div>

          <div className="rounded-xl border border-brand-border p-4">
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="h-4 w-4 text-brand-primary" />
              <h4 className="font-semibold text-brand-dark">
                Location & Branch
              </h4>
            </div>
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-y-3 text-sm">
              <div className="col-span-2">
                <dt className="text-brand-placeholder text-xs">Address</dt>
                <dd className="font-medium text-brand-dark">
                  {onboardingForm.address ? (
                    `${onboardingForm.address}${onboardingForm.addressLine2 ? `, ${onboardingForm.addressLine2}` : ""}, ${onboardingForm.city}, ${onboardingForm.state} - ${onboardingForm.pincode}, ${onboardingForm.country}`
                  ) : (
                    <span className="text-brand-muted italic">Not provided</span>
                  )}
                </dd>
              </div>
              <div>
                <dt className="text-brand-placeholder text-xs">Timezone</dt>
                <dd className="font-medium text-brand-dark">Asia/Kolkata</dd>
              </div>
              <div>
                <dt className="text-brand-placeholder text-xs">Currency</dt>
                <dd className="font-medium text-brand-dark">INR (₹)</dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <div className="rounded-xl border border-brand-border p-4">
            <div className="flex items-center gap-2 mb-3">
              <Receipt className="h-4 w-4 text-brand-primary" />
              <h4 className="font-semibold text-brand-dark">
                Tax & Compliance
              </h4>
            </div>
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-y-3 text-sm">
              <div>
                <dt className="text-brand-placeholder text-xs">GST Number</dt>
                <dd className="font-medium text-brand-dark">{onboardingForm.gstin || <span className="text-brand-muted italic">N/A</span>}</dd>
              </div>
              <div>
                <dt className="text-brand-placeholder text-xs">PAN Number</dt>
                <dd className="font-medium text-brand-dark">{onboardingForm.pan || <span className="text-brand-muted italic">N/A</span>}</dd>
              </div>
              <div className="col-span-2 mt-2">
                <dt className="text-brand-placeholder text-xs mb-1.5">
                  Verification Status
                </dt>
                <dd className="space-y-1.5">
                  {onboardingForm.gstin ? (
                    <div className="flex items-center gap-1.5 text-brand-success">
                      <CheckCircle2 className="h-3.5 w-3.5" /> <span className="font-medium">GST Registered</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-brand-muted">
                      <XCircle className="h-3.5 w-3.5" /> <span className="font-medium">No GST Provided</span>
                    </div>
                  )}
                  {onboardingForm.pan ? (
                    <div className="flex items-center gap-1.5 text-brand-success">
                      <CheckCircle2 className="h-3.5 w-3.5" /> <span className="font-medium">PAN Registered</span>
                    </div>
                  ) : (
                     <div className="flex items-center gap-1.5 text-brand-muted">
                      <XCircle className="h-3.5 w-3.5" /> <span className="font-medium">No PAN Provided</span>
                    </div>
                  )}
                </dd>
              </div>
            </dl>
          </div>

          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
            <div className="flex items-center gap-2 mb-3">
              <CreditCard className="h-4 w-4 text-emerald-600" />
              <h4 className="font-semibold text-emerald-800">
                Subscription Plan
              </h4>
            </div>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-xl font-bold text-emerald-900">
                  {selectedPlanDetails.name}
                </p>
                <p className="text-sm text-emerald-700 mt-0.5">
                  {selectedPlanDetails.limits}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-emerald-900">{selectedPlanDetails.price}</p>
                <p className="text-xs font-medium text-emerald-700 uppercase">
                  {selectedPlanDetails.period}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
