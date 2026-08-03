import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { updateOnboardingForm } from "@/store/slices/businessSlice";

const BUSINESS_TYPES = [
  "Restaurant",
  "Cafe",
  "Bakery",
  "Grocery Store",
  "Supermarket",
  "Retail Store",
  "Pharmacy",
  "Clothing Store",
  "Electronics Store",
  "Salon",
  "Spa",
  "Hotel",
  "Bar",
  "Fast Food",
  "Hardware Store",
  "Medical Store",
  "Wholesale Business",
  "Manufacturing",
  "Service Business",
  "Custom Business",
].map((t) => ({ label: t, value: t.toLowerCase().replace(/ /g, "_") }));

interface StepBusinessDetailsProps {
  errors?: Record<string, string>;
}

export function StepBusinessDetails({ errors }: StepBusinessDetailsProps) {
  const dispatch = useAppDispatch();
  const { onboardingForm } = useAppSelector((state: any) => state.business);

  const handleChange = (field: string, value: string) => {
    const updates: Record<string, string> = { [field]: value };
    if (field === "name") updates.businessName = value;
    if (field === "slug") updates.businessSlug = value;
    if (field === "legal_name") updates.businessLegalName = value;
    if (field === "business_type") updates.businessType = value;
    if (field === "email") updates.businessEmail = value;
    if (field === "website") updates.businessWebsite = value;
    dispatch(updateOnboardingForm(updates));
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Business Name *"
          placeholder="e.g. Desai Foods & Catering"
          value={onboardingForm.name || ""}
          onChange={(e) => handleChange("name", e.target.value)}
          error={errors?.name}
        />
        <Input
          label="Legal Business Name *"
          placeholder="As per registration"
          value={onboardingForm.legal_name || ""}
          onChange={(e) => handleChange("legal_name", e.target.value)}
        />
        <Input
          label="Business Slug (URL) *"
          placeholder="e.g. desai-foods"
          value={onboardingForm.slug || ""}
          onChange={(e) => handleChange("slug", e.target.value)}
          error={errors?.slug}
        />
        <Select
          label="Business Type *"
          options={BUSINESS_TYPES}
          value={onboardingForm.business_type || ""}
          onChange={(e) => handleChange("business_type", e.target.value)}
        />
        <Input
          label="Business Registration Number"
          placeholder="e.g. U74999MH2022PTC123456"
          value={onboardingForm.business_registration_number || ""}
          onChange={(e) =>
            handleChange("business_registration_number", e.target.value)
          }
        />
        <Input
          label="Phone Number"
          placeholder="+91 9876543210"
          value={onboardingForm.phone || ""}
          onChange={(e) => handleChange("phone", e.target.value)}
          error={errors?.phone}
        />
        <Input
          label="Support Email"
          placeholder="support@business.com"
          value={onboardingForm.email || ""}
          onChange={(e) => handleChange("email", e.target.value)}
          error={errors?.email}
        />
        <Input
          label="Website (Optional)"
          placeholder="https://..."
          value={onboardingForm.website || ""}
          onChange={(e) => handleChange("website", e.target.value)}
          error={errors?.website}
        />
        <Input
          label="Owner Date of Birth (Optional)"
          type="date"
          value={onboardingForm.date_of_birth || ""}
          onChange={(e) => handleChange("date_of_birth", e.target.value)}
        />
        <Select
          label="Owner Gender (Optional)"
          options={[
            { label: "Male", value: "male" },
            { label: "Female", value: "female" },
            { label: "Other", value: "other" },
          ]}
          value={onboardingForm.gender || ""}
          onChange={(e) => handleChange("gender", e.target.value)}
        />
      </div>
    </div>
  );
}
