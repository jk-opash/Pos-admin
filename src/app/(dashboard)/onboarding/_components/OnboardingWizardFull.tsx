"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { StepPersonalInfo } from "./StepPersonalInfo";
import { StepBusinessDetails } from "./StepBusinessDetails";
import { StepIndustryTemplate } from "./StepIndustryTemplate";
import { StepAddress } from "./StepAddress";
import { StepTaxCompliance } from "./StepTaxCompliance";
import { StepSubscription } from "./StepSubscription";
import { StepPayment } from "./StepPayment";
import { StepReview } from "./StepReview";
import { toast } from "react-toastify";
import {
  ChevronLeft,
  ChevronRight,
  Check,
  Sparkles,
  Store,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { provisionBusiness } from "@/store/slices/businessSlice";

const STEPS = [
  { id: 1, title: "Personal Info", desc: "Your details" },
  { id: 2, title: "Business Details", desc: "Core info" },
  { id: 3, title: "Industry", desc: "Type & template" },
  { id: 4, title: "Address", desc: "Location info" },
  { id: 5, title: "Compliance", desc: "Tax & docs" },
  { id: 6, title: "Subscription", desc: "Choose plan" },
  { id: 7, title: "Payment", desc: "Billing details" },
  { id: 8, title: "Review", desc: "Verify & submit" },
];

export function OnboardingWizardFull() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { onboardingForm, loading: isProvisioning } = useAppSelector(
    (state: any) => state.business,
  );

  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Smooth transition effect between steps
  const changeStep = (newStep: number) => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentStep(newStep);
      setIsAnimating(false);
    }, 300);
  };

  const validateStep = (step: number): Record<string, string> => {
    const newErrors: Record<string, string> = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\+?[0-9\s\-]{10,15}$/;
    const slugRegex = /^[a-z0-9-]+$/;

    if (step === 0) {
      if (!onboardingForm.ownerName) newErrors.ownerName = "Name is required";
      if (!onboardingForm.ownerPhone) newErrors.ownerPhone = "Phone is required";
      else if (!phoneRegex.test(onboardingForm.ownerPhone)) newErrors.ownerPhone = "Invalid phone format";
      if (!onboardingForm.ownerEmail) newErrors.ownerEmail = "Email is required";
      else if (!emailRegex.test(onboardingForm.ownerEmail)) newErrors.ownerEmail = "Invalid email format";
      if (!onboardingForm.ownerPassword) newErrors.ownerPassword = "Password is required";
      else if (onboardingForm.ownerPassword.length < 8) newErrors.ownerPassword = "Password must be at least 8 characters";
    } else if (step === 1) {
      if (!onboardingForm.name) newErrors.name = "Business name is required";
      if (!onboardingForm.slug) newErrors.slug = "Business slug is required";
      else if (!slugRegex.test(onboardingForm.slug)) newErrors.slug = "Only lowercase letters, numbers, hyphens allowed";
      if (!onboardingForm.phone) newErrors.phone = "Phone is required";
      else if (!phoneRegex.test(onboardingForm.phone)) newErrors.phone = "Invalid phone format";
      if (!onboardingForm.email) newErrors.email = "Email is required";
      else if (!emailRegex.test(onboardingForm.email)) newErrors.email = "Invalid email format";
      if (onboardingForm.website && !/^https?:\/\//.test(onboardingForm.website)) {
        newErrors.website = "Must start with http:// or https://";
      }
    } else if (step === 3) {
      if (!onboardingForm.address_line1) newErrors.address_line1 = "Address is required";
      if (!onboardingForm.city) newErrors.city = "City is required";
      if (!onboardingForm.state) newErrors.state = "State is required";
      if (!onboardingForm.country) newErrors.country = "Country is required";
      if (!onboardingForm.pincode) newErrors.pincode = "Pincode is required";
    } else if (step === 4) {
      if (onboardingForm.gstin && !/^\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1}$/.test(onboardingForm.gstin)) {
        newErrors.gstin = "Invalid GSTIN format";
      }
      if (onboardingForm.pan && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(onboardingForm.pan)) {
        newErrors.pan = "Invalid PAN format";
      }
    } else if (step === 5) {
      if (!onboardingForm.subscriptionPlanId) newErrors.subscriptionPlanId = "Please select a plan";
    }

    return newErrors;
  };

  const handleNext = () => {
    const stepErrors = validateStep(currentStep);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      toast.error("Please fill all required fields correctly.");
      return;
    }
    setErrors({});
    if (currentStep < STEPS.length - 1) changeStep(currentStep + 1);
  };

  const handlePrev = () => {
    if (currentStep > 0) changeStep(currentStep - 1);
  };

  const handleProvision = async () => {
    try {
      await dispatch(provisionBusiness(onboardingForm)).unwrap();
      router.push("/onboarding");
    } catch (err) {
      console.error("Provisioning failed:", err);
    }
  };

  const progressPercentage = ((currentStep + 1) / STEPS.length) * 100;

  return (
    <div className="h-[calc(100vh-12rem)] min-h-[600px] font-sans selection:bg-brand-primary/20 flex flex-col relative overflow-hidden">
      {/* --- Main Content Area --- */}
      <main className="flex-1 flex flex-col items-center pb-4 md:pb-6 lg:pb-8 pb-4 md:pb-6 lg:pb-8 z-10 relative overflow-hidden">
        {/* Top Segmented Progress Bar */}
        <div className="w-full max-w-4xl mb-6 shrink-0">
          <div className="flex items-center gap-2 w-full">
            {STEPS.map((step, idx) => {
              const isCompleted = idx < currentStep;
              const isActive = idx === currentStep;

              return (
                <div key={step.id} className="flex-1 group relative">
                  <div className="h-1.5 w-full rounded-full overflow-hidden bg-slate-200/60">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ease-out ${
                        isCompleted
                          ? "bg-emerald-500 w-full"
                          : isActive
                            ? "bg-brand-primary w-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                            : "w-0"
                      }`}
                    />
                  </div>
                  {/* Tooltip on hover */}
                  <div className="absolute top-3 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                    <div className="bg-slate-800 text-white text-[10px] font-bold px-2 py-1 rounded-md whitespace-nowrap shadow-xl">
                      {step.title}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-between items-center mt-2 px-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-brand-primary">
              Step {currentStep + 1} of {STEPS.length}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              {Math.round(progressPercentage)}% Completed
            </span>
          </div>
        </div>

        {/* Form & Navigation Carousel Layout */}
        <div className="w-full max-w-7xl flex flex-1 flex-row items-center gap-4 lg:gap-8 h-full min-h-0">
          {/* Left: Back Button */}
          <div className="w-16 lg:w-24 shrink-0 flex justify-end">
            <button
              onClick={handlePrev}
              disabled={currentStep === 0 || isProvisioning}
              className={`group flex flex-col items-center justify-center gap-2 transition-all ${
                currentStep === 0
                  ? "opacity-0 pointer-events-none"
                  : "opacity-100"
              }`}
            >
              <div className="flex items-center justify-center w-12 h-12 lg:w-14 lg:h-14 rounded-full bg-white/60 backdrop-blur-md shadow-[0_8px_30px_-10px_rgba(0,0,0,0.15)] border border-white/60 group-hover:bg-white group-hover:scale-110 transition-all">
                <ChevronLeft className="h-6 w-6 text-slate-600 group-hover:text-slate-900 group-hover:-translate-x-0.5 transition-transform" />
              </div>
              <span className="text-[11px] font-bold text-slate-500 group-hover:text-slate-900 hidden sm:block">
                Back
              </span>
            </button>
          </div>

          {/* Center: Main Form Card */}
          <div
            className={`flex-1 flex flex-col h-full min-h-0 bg-white/80 backdrop-blur-2xl border border-white/80 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] rounded-[2rem] p-4 lg:p-6 transition-all duration-500 transform ${
              isAnimating
                ? "opacity-0 scale-[0.98] translate-y-2"
                : "opacity-100 scale-100 translate-y-0"
            }`}
          >
            {/* Header inside card */}
            <div className="mb-4 shrink-0">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-primary/10 border border-brand-primary/20 mb-1">
                <Sparkles className="h-3 w-3 text-brand-primary" />
                <span className="text-[10px] font-bold text-brand-primary uppercase tracking-wider">
                  {STEPS[currentStep].title}
                </span>
              </div>
              <h1 className="text-xl lg:text-xl font-black text-slate-900 tracking-tight leading-tight">
                {currentStep === 0 && "Let's start with your details."}
                {currentStep === 1 && "Tell us about your business."}
                {currentStep === 2 && "What industry are you in?"}
                {currentStep === 3 && "Where are you located?"}
                {currentStep === 4 && "Tax & legal compliance."}
                {currentStep === 5 && "Choose your perfect plan."}
                {currentStep === 6 && "How would you like to pay?"}
                {currentStep === 7 && "Review and finalize."}
              </h1>
            </div>

            {/* Scrollable area */}
            <div className="flex-1 overflow-y-auto pr-3 -mr-3 custom-scrollbar">
              {currentStep === 0 && <StepPersonalInfo errors={errors} />}
              {currentStep === 1 && <StepBusinessDetails errors={errors} />}
              {currentStep === 2 && <StepIndustryTemplate />}
              {currentStep === 3 && <StepAddress errors={errors} />}
              {currentStep === 4 && <StepTaxCompliance errors={errors} />}
              {currentStep === 5 && <StepSubscription />}
              {currentStep === 6 && <StepPayment />}
              {currentStep === 7 && <StepReview />}
            </div>
          </div>

          {/* Right: Continue / Provision Button */}
          <div className="w-16 lg:w-24 shrink-0 flex justify-start">
            {currentStep < STEPS.length - 1 ? (
              <button
                onClick={handleNext}
                className="group flex flex-col items-center justify-center gap-2 transition-all"
              >
                <div className="flex items-center justify-center w-12 h-12 lg:w-14 lg:h-14 rounded-full bg-slate-900 text-white hover:bg-brand-primary shadow-[0_10px_40px_-10px_rgba(15,23,42,0.5)] group-hover:shadow-[0_10px_40px_-10px_rgba(59,130,246,0.5)] group-hover:scale-110 transition-all">
                  <ChevronRight className="h-6 w-6 group-hover:translate-x-0.5 transition-transform" />
                </div>
                <span className="text-[11px] font-bold text-slate-900 group-hover:text-brand-primary hidden sm:block">
                  Next
                </span>
              </button>
            ) : (
              <button
                onClick={handleProvision}
                disabled={isProvisioning}
                className="group flex flex-col items-center justify-center gap-2 transition-all"
              >
                <div
                  className={`flex items-center justify-center w-12 h-12 lg:w-14 lg:h-14 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 text-white shadow-[0_10px_40px_-10px_rgba(16,185,129,0.5)] ${!isProvisioning && "group-hover:scale-110"} transition-all`}
                >
                  {isProvisioning ? (
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  ) : (
                    <Check className="h-6 w-6" />
                  )}
                </div>
                <span className="text-[11px] font-bold text-emerald-600 text-center leading-tight hidden sm:block">
                  {isProvisioning ? "Saving..." : "Approve"}
                </span>
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
