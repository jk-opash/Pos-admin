import { OnboardingWizard } from "@/app/(dashboard)/businesses/_components/OnboardingWizard";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function OnboardBusinessPage() {
  return (
    <div className="space-y-6">
      {/* Back Button */}
      <div>
        <Link
          href="/businesses"
          className="inline-flex items-center text-sm font-medium text-brand-muted hover:text-brand-dark transition-colors mb-2"
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          Back to Businesses
        </Link>
      </div>

      <div>
        <h2 className="text-xl font-bold text-brand-dark">
          Onboard New Business
        </h2>
        <p className="mt-1 text-sm text-brand-muted">
          Follow the steps below to provision a new business tenant and
          configure their environment.
        </p>
      </div>

      <OnboardingWizard />
    </div>
  );
}
