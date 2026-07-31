import { Input } from "@/components/ui/Input";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { updateOnboardingForm } from "@/store/slices/businessSlice";
import { DocumentUploadItem } from "./DocumentUploadItem";

export function StepTaxCompliance() {
  const dispatch = useAppDispatch();
  const { onboardingForm } = useAppSelector((state: any) => state.business);

  const handleChange = (field: string, value: string) => {
    dispatch(updateOnboardingForm({ [field]: value }));
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="GST Number"
          placeholder="e.g. 27ABCDE1234F1Z5"
          value={onboardingForm.gstin || ""}
          onChange={(e) => handleChange("gstin", e.target.value)}
        />
        <Input
          label="PAN Number *"
          placeholder="e.g. ABCDE1234F"
          value={onboardingForm.pan || ""}
          onChange={(e) => handleChange("pan", e.target.value)}
        />
      </div>

      <div className="pt-4 border-t border-brand-border">
        <h4 className="text-sm font-semibold text-brand-dark mb-3">
          Upload Documents
        </h4>

        <div className="space-y-3">
          <DocumentUploadItem
            title="Identity Verification (Aadhar/Passport)"
            subtitle="PDF or JPG, max 5MB"
            required={true}
            currentUrl={onboardingForm.identity_verification}
            onUploadSuccess={(url) =>
              handleChange("identity_verification", url)
            }
          />

          <DocumentUploadItem
            title="PAN Card"
            subtitle="PDF or JPG, max 5MB"
            required={true}
            currentUrl={onboardingForm.pan_card}
            onUploadSuccess={(url) => handleChange("pan_card", url)}
          />

          <DocumentUploadItem
            title="GST Certificate"
            subtitle="Optional. PDF or JPG, max 5MB"
            required={false}
            currentUrl={onboardingForm.gst_certificate}
            onUploadSuccess={(url) => handleChange("gst_certificate", url)}
          />
        </div>
      </div>
    </div>
  );
}
