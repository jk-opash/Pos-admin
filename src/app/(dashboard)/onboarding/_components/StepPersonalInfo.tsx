import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { UploadCloud } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { updateOnboardingForm } from "@/store/slices/businessSlice";
import { DocumentUploadItem } from "./DocumentUploadItem";

interface StepPersonalInfoProps {
  errors?: Record<string, string>;
}

export function StepPersonalInfo({ errors }: StepPersonalInfoProps) {
  const dispatch = useAppDispatch();
  const { onboardingForm } = useAppSelector((state: any) => state.business);

  const handleChange = (field: string, value: string) => {
    dispatch(updateOnboardingForm({ [field]: value }));
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Full Name *"
          placeholder="e.g. Arjun Desai"
          value={onboardingForm.ownerName}
          onChange={(e) => handleChange("ownerName", e.target.value)}
          error={errors?.ownerName}
        />
        <Input
          label="Mobile Number *"
          placeholder="+91 99123 45678"
          value={onboardingForm.ownerPhone}
          onChange={(e) => handleChange("ownerPhone", e.target.value)}
          error={errors?.ownerPhone}
        />
        <Input
          label="Email Address *"
          placeholder="arjun@business.com"
          value={onboardingForm.ownerEmail}
          onChange={(e) => handleChange("ownerEmail", e.target.value)}
          error={errors?.ownerEmail}
        />

        <Input
          label="Password *"
          type="password"
          placeholder="Min 8 characters"
          value={onboardingForm.ownerPassword || ""}
          onChange={(e) => handleChange("ownerPassword", e.target.value)}
          error={errors?.ownerPassword}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input label="Date of Birth" placeholder="DD / MM / YYYY" />
        <Select
          label="Gender"
          options={[
            { label: "Male", value: "male" },
            { label: "Female", value: "female" },
            { label: "Other", value: "other" },
            { label: "Prefer not to say", value: "none" },
          ]}
        />
      </div>
      <div className="pt-4 border-t border-brand-border">
        <h3 className="text-sm font-semibold text-brand-dark mb-3">
          Identity Verification (Optional for Draft)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="ID Document Type"
            options={[
              { label: "Passport", value: "passport" },
              { label: "National ID / Aadhaar", value: "national_id" },
              { label: "Driving License", value: "driving_license" },
            ]}
          />

          <div className="mt-6">
            <DocumentUploadItem
              title="ID Scan"
              subtitle="JPG, PNG or PDF (Max 5MB)"
              currentUrl={onboardingForm.identity_verification}
              onUploadSuccess={(url) => handleChange("identity_verification", url)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
