import { OnboardingWizardFull } from "@/app/(dashboard)/onboarding/_components/OnboardingWizardFull";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function NewOnboardingPage() {
  return (
    <div className="space-y-6">
      {/* Back Button */}
      <div>
        <Link
          href="/onboarding"
          className="inline-flex items-center text-sm font-medium text-brand-muted hover:text-brand-dark transition-colors mb-2"
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          Back to Onboarding
        </Link>
      </div>

      <OnboardingWizardFull />
    </div>
  );
}
