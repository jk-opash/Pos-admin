import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { updateOnboardingForm } from "@/store/slices/businessSlice";

interface StepAddressProps {
  errors?: Record<string, string>;
}

export function StepAddress({ errors }: StepAddressProps) {
  const dispatch = useAppDispatch();
  const { onboardingForm } = useAppSelector((state: any) => state.business);

  const handleChange = (field: string, value: string) => {
    const updates: Record<string, string> = { [field]: value };
    if (field === "address_line1") updates.address = value;
    if (field === "address_line2") updates.addressLine2 = value;
    dispatch(updateOnboardingForm(updates));
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          label="Country *"
          options={[
            { label: "India", value: "India" },
            { label: "UAE", value: "UAE" },
            { label: "United Kingdom", value: "UK" },
            { label: "USA", value: "USA" },
          ]}
          value={onboardingForm.country || "India"}
          onChange={(e) => handleChange("country", e.target.value)}
          error={errors?.country}
        />
        <Select
          label="State / Province *"
          options={[
            { label: "Maharashtra", value: "Maharashtra" },
            { label: "Karnataka", value: "Karnataka" },
            { label: "Delhi", value: "Delhi" },
            { label: "Tamil Nadu", value: "Tamil Nadu" },
            { label: "Gujarat", value: "Gujarat" },
            { label: "Kerala", value: "Kerala" },
          ]}
          value={onboardingForm.state || ""}
          onChange={(e) => handleChange("state", e.target.value)}
          error={errors?.state}
        />
        <Input
          label="City *"
          placeholder="e.g. Mumbai"
          value={onboardingForm.city || ""}
          onChange={(e) => handleChange("city", e.target.value)}
          error={errors?.city}
        />
        <Input
          label="Postal / PIN Code *"
          placeholder="e.g. 400001"
          value={onboardingForm.pincode || ""}
          onChange={(e) => handleChange("pincode", e.target.value)}
          error={errors?.pincode}
        />
      </div>
      <div>
        <label className="text-sm font-medium text-brand-muted mb-1.5 block">
          Address Line 1 *
        </label>
        <textarea
          className={`w-full rounded-lg border px-3 py-2.5 text-sm text-brand-dark focus:outline-none focus:ring-1 focus:ring-brand-primary placeholder-brand-placeholder ${errors?.address_line1 ? "border-brand-danger focus:border-brand-danger focus:ring-brand-danger/20 bg-red-50/30" : "border-brand-border focus:border-brand-primary"}`}
          rows={2}
          placeholder="Street address, company name, c/o"
          value={onboardingForm.address_line1 || ""}
          onChange={(e) => handleChange("address_line1", e.target.value)}
        />
        {errors?.address_line1 && <p className="text-xs font-medium text-brand-danger mt-1.5">{errors.address_line1}</p>}
      </div>
      <div>
        <label className="text-sm font-medium text-brand-muted mb-1.5 block">
          Address Line 2 (Optional)
        </label>
        <textarea
          className="w-full rounded-lg border border-brand-border px-3 py-2.5 text-sm text-brand-dark focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary placeholder-brand-placeholder"
          rows={2}
          placeholder="Apartment, suite, unit, building, floor, etc."
          value={onboardingForm.address_line2 || ""}
          onChange={(e) => handleChange("address_line2", e.target.value)}
        />
      </div>
    </div>
  );
}
