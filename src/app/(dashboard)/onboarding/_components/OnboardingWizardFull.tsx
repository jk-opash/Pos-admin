"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { StepPersonalInfo } from "./StepPersonalInfo";
import { StepBusinessDetails } from "./StepBusinessDetails";
import { StepIndustryTemplate } from "./StepIndustryTemplate";
import { StepAddress } from "./StepAddress";
import { StepTaxCompliance } from "./StepTaxCompliance";
import { StepSubscription } from "./StepSubscription";
import { StepPayment } from "./StepPayment";
import { StepReview } from "./StepReview";
import { Check, ChevronLeft, ChevronRight, Save, Play } from "lucide-react";

const STEPS = [
  "Personal Info",
  "Business Details",
  "Industry",
  "Address",
  "Tax & Compliance",
  "Subscription",
  "Payment",
  "Review",
];

export function OnboardingWizardFull() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isProvisioning, setIsProvisioning] = useState(false);

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep((p) => p + 1);
      window.scrollTo(0, 0);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((p) => p - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleProvision = () => {
    setIsProvisioning(true);
    setTimeout(() => {
      router.push("/businesses");
    }, 2000);
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] pb-12">
      {/* Background Decorators for Glassmorphism */}
      <div className="absolute top-0 -left-1/4 w-[600px] h-[600px] bg-brand-primary/10 rounded-full mix-blend-multiply filter blur-3xl opacity-70 pointer-events-none z-0"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-400/10 rounded-full mix-blend-multiply filter blur-3xl opacity-70 pointer-events-none z-0"></div>

      <div className="relative z-10  mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-brand-dark tracking-tight">
              New Business Onboarding
            </h1>
            <p className="mt-2 text-base text-brand-muted max-w-xl leading-relaxed">
              Complete all steps to register and provision a new tenant.
            </p>
          </div>
          <Button
            variant="outline"
            className="gap-2 bg-white/60 backdrop-blur-md shadow-sm border-slate-200/60 hover:bg-white transition-all rounded-xl"
            onClick={() => router.push("/onboarding")}
          >
            <Save className="h-4 w-4" /> Save as Draft
          </Button>
        </div>

        {/* Main Glass Container */}
        <div className="rounded-3xl border border-white/60 bg-glass-gradient backdrop-blur-xl shadow-glass overflow-hidden flex flex-col lg:flex-row min-h-[700px]">
          {/* Progress Sidebar */}
          <div className="w-full lg:w-72 shrink-0 border-b lg:border-b-0 lg:border-r border-slate-200/50 bg-white/40 p-6 md:p-8">
            <div className="sticky top-8">
              <h3 className="text-xs font-bold text-brand-placeholder uppercase tracking-wider mb-6">
                Onboarding Steps
              </h3>
              <div className="space-y-4">
                {STEPS.map((step, idx) => {
                  const isActive = idx === currentStep;
                  const isPast = idx < currentStep;
                  return (
                    <div key={step} className="flex items-center gap-4">
                      <div
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-all duration-300 shadow-sm ${
                          isActive
                            ? "bg-gradient-to-br from-brand-primary to-brand-primaryDark text-white ring-4 ring-brand-primary/20 shadow-brand-primary/30"
                            : isPast
                              ? "bg-gradient-to-br from-emerald-400 to-emerald-600 text-white shadow-emerald-500/20"
                              : "bg-white border border-slate-200/60 text-slate-400"
                        }`}
                      >
                        {isPast ? <Check className="h-4 w-4" /> : idx + 1}
                      </div>
                      <div>
                        <p
                          className={`text-sm font-semibold transition-colors ${
                            isActive
                              ? "text-brand-dark"
                              : isPast
                                ? "text-emerald-600"
                                : "text-brand-placeholder"
                          }`}
                        >
                          {step}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Completion Widget */}
              <div className="mt-40">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">
                  Completion
                </p>
                <div className="flex justify-between items-end mb-3">
                  <span className="text-3xl font-black text-brand-dark tracking-tight">
                    {Math.round((currentStep / (STEPS.length - 1)) * 100)}%
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200/50 shadow-inner">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-brand-primary to-purple-500 transition-all duration-500 ease-out"
                    style={{
                      width: `${(currentStep / (STEPS.length - 1)) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 flex flex-col relative bg-white/50">
            {/* Step Content */}
            <div className="flex-1 p-6 md:p-10 pb-28 lg:pb-32 overflow-y-auto">
              {currentStep === 0 && <StepPersonalInfo />}
              {currentStep === 1 && <StepBusinessDetails />}
              {currentStep === 2 && <StepIndustryTemplate />}
              {currentStep === 3 && <StepAddress />}
              {currentStep === 4 && <StepTaxCompliance />}
              {currentStep === 5 && <StepSubscription />}
              {currentStep === 6 && <StepPayment />}
              {currentStep === 7 && <StepReview />}
            </div>

            {/* Navigation Footer */}
            <div className="absolute bottom-0 left-0 right-0 p-6 md:px-10 md:py-6 border-t border-slate-200/50 bg-white/70 backdrop-blur-xl flex items-center justify-between">
              <Button
                variant="outline"
                className="gap-2 bg-white hover:bg-slate-50 rounded-xl"
                onClick={handlePrev}
                disabled={currentStep === 0 || isProvisioning}
              >
                <ChevronLeft className="h-4 w-4" /> Previous
              </Button>

              {currentStep < STEPS.length - 1 ? (
                <Button
                  className="gap-2 bg-brand-dark hover:bg-black text-white border-none rounded-xl px-6 shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all"
                  onClick={handleNext}
                >
                  <span className="font-bold">Next Step</span>{" "}
                  <ChevronRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  className="gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white border-none min-w-[200px] rounded-xl px-6 shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all"
                  onClick={handleProvision}
                  disabled={isProvisioning}
                >
                  {isProvisioning ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      <span className="font-bold">Provisioning...</span>
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4" />{" "}
                      <span className="font-bold">Approve & Provision</span>
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
