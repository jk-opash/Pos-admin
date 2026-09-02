"use client";

import { useState, useEffect } from "react";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Store, MapPin, FileText, User, Sliders } from "lucide-react";
import { Business, BusinessType } from "@/types";
import { useAppDispatch } from "@/store/hooks";
import { updateBusiness } from "@/store/slices/businessSlice";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { LottieLoader } from "@/components/ui/LottieLoader";

const businessSchema = z.object({
  name: z.string().min(1, "Business Name is required"),
  type: z.enum([
    "restaurant",
    "cafe",
    "retail",
    "grocery",
    "pharmacy",
    "salon",
    "hotel",
    "electronics",
    "clothing",
    "hardware",
    "bakery",
  ]),
  website: z.string().url("Invalid URL").or(z.literal("")).optional(),
  phone: z.string().min(10, "Valid phone number is required"),
  email: z.string().email("Invalid email address"),
  owner: z.object({
    name: z.string().min(1, "Owner Name is required"),
    email: z
      .string()
      .email("Invalid email address")
      .or(z.literal(""))
      .optional(),
    phone: z
      .string()
      .min(10, "Valid phone number is required")
      .or(z.literal(""))
      .optional(),
  }),
  address: z.object({
    line1: z.string().min(1, "Address Line 1 is required"),
    line2: z.string().optional(),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    country: z.string().min(1, "Country is required"),
    pincode: z.string().min(1, "Pincode is required"),
  }),
  legalName: z.string().min(1, "Legal Name is required"),
  gstin: z.string().optional(),
  pan: z.string().optional(),
  businessRegistrationNumber: z.string().optional(),
  dateOfBirth: z.string().optional(),
  gender: z.string().optional(),
  gstCertificate: z.string().optional(),
  panCard: z.string().optional(),
  tradeLicense: z.string().optional(),
  subscription: z
    .object({
      plan: z.string().optional(),
      status: z.string().optional(),
      startDate: z.string().optional(),
      endsAt: z.string().optional(),
      trialEndDate: z.string().optional(),
      autoRenew: z.boolean().optional(),
      maxBranches: z.number().min(1, "At least 1 branch required"),
      maxUsers: z.number().min(1, "At least 1 staff user required"),
      extraBranches: z.number().min(0).optional(),
      extraTeamMembers: z.number().min(0).optional(),
    })
    .optional(),
});

type BusinessFormValues = z.infer<typeof businessSchema>;

interface EditBusinessModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialBusiness: Business | null;
  onSuccess?: (business: Business) => void;
}

export function EditBusinessModal({
  isOpen,
  onClose,
  initialBusiness,
  onSuccess,
}: EditBusinessModalProps) {
  const [editTab, setEditTab] = useState<
    "info" | "location" | "legal" | "owner" | "limits"
  >("info");
  const [isSaving, setIsSaving] = useState(false);
  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<BusinessFormValues>({
    resolver: zodResolver(businessSchema),
  });

  useEffect(() => {
    if (initialBusiness && isOpen) {
      reset({
        name: initialBusiness.name || "",
        type: initialBusiness.type || "retail",
        website: initialBusiness.website || "",
        phone: initialBusiness.phone || "",
        email: initialBusiness.email || "",
        owner: {
          name: initialBusiness.owner?.name || "",
          email: initialBusiness.owner?.email || "",
          phone: initialBusiness.owner?.phone || "",
        },
        address: {
          line1: initialBusiness.address?.line1 || "",
          line2: initialBusiness.address?.line2 || "",
          city: initialBusiness.address?.city || "",
          state: initialBusiness.address?.state || "",
          country: initialBusiness.address?.country || "",
          pincode: initialBusiness.address?.pincode || "",
        },
        legalName: initialBusiness.legalName || "",
        gstin: initialBusiness.gstin || "",
        pan: initialBusiness.pan || "",
        businessRegistrationNumber: initialBusiness.businessRegistrationNumber || "",
        dateOfBirth: initialBusiness.dateOfBirth ? new Date(initialBusiness.dateOfBirth).toISOString().split('T')[0] : "",
        gender: initialBusiness.gender || "",
        gstCertificate: initialBusiness.gstCertificate || "",
        panCard: initialBusiness.panCard || "",
        tradeLicense: initialBusiness.tradeLicense || "",
        subscription: {
          plan: initialBusiness.subscription?.plan || "free_trial",
          status: initialBusiness.subscription?.status || "active",
          startDate: initialBusiness.subscription?.startDate ? new Date(initialBusiness.subscription.startDate).toISOString().split('T')[0] : "",
          endsAt: initialBusiness.subscription?.endsAt ? new Date(initialBusiness.subscription.endsAt).toISOString().split('T')[0] : "",
          trialEndDate: initialBusiness.subscription?.trialEndDate ? new Date(initialBusiness.subscription.trialEndDate).toISOString().split('T')[0] : "",
          autoRenew: initialBusiness.subscription?.autoRenew ?? true,
          maxBranches: initialBusiness.subscription?.maxBranches || 1,
          maxUsers: initialBusiness.subscription?.maxUsers || 1,
          extraBranches: initialBusiness.extraBranches || 0,
          extraTeamMembers: initialBusiness.extraTeamMembers || 0,
        },
      });
      setEditTab("info");
    }
  }, [initialBusiness, isOpen, reset]);

  const onSubmit = async (data: BusinessFormValues) => {
    if (!initialBusiness) return;
    setIsSaving(true);
    try {
      const backendData = {
        name: data.name,
        legal_name: data.legalName,
        business_type: data.type,
        website: data.website,
        email: data.email,
        phone: data.phone,
        address_line1: data.address.line1,
        address_line2: data.address.line2,
        city: data.address.city,
        state: data.address.state,
        country: data.address.country,
        pincode: data.address.pincode,
        gstin: data.gstin,
        pan: data.pan,
        business_registration_number: data.businessRegistrationNumber,
        date_of_birth: data.dateOfBirth,
        gender: data.gender,
        gst_certificate: data.gstCertificate,
        pan_card: data.panCard,
        trade_license: data.tradeLicense,
        // Optional owner details
        admin_name: data.owner.name,
        admin_email: data.owner.email,
        admin_phone: data.owner.phone,
        // Limits
        max_branches: data.subscription?.maxBranches,
        max_team_members: data.subscription?.maxUsers,
        extra_branches: data.subscription?.extraBranches,
        extra_team_members: data.subscription?.extraTeamMembers,
        // Plan & Dates
        subscription_plan: data.subscription?.plan,
        subscription_status: data.subscription?.status,
        subscription_start_date: data.subscription?.startDate,
        subscription_ends_at: data.subscription?.endsAt,
        subscription_trial_end_date: data.subscription?.trialEndDate,
        subscription_auto_renew: data.subscription?.autoRenew,
      };

      const updatedBusiness = await dispatch(
        updateBusiness({ id: initialBusiness.id, data: backendData }),
      ).unwrap();
      onSuccess?.({ ...initialBusiness, ...data } as unknown as Business);
      onClose();
    } catch (err) {
      console.error("Failed to save", err);
    } finally {
      setIsSaving(false);
    }
  };

  if (!initialBusiness) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Business Details"
      size="5xl"
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex h-[650px] -mx-6 -mb-6 -mt-4 border-t border-brand-border/50"
      >
        {/* Sidebar Navigation */}
        <div className="w-64 bg-slate-50/50 border-r border-brand-border/50 p-6 flex flex-col gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setEditTab("info")}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm text-left ${
              editTab === "info"
                ? "bg-white shadow-sm border border-brand-border/60 text-brand-dark"
                : "text-brand-muted hover:bg-slate-100 hover:text-brand-dark"
            }`}
          >
            <Store
              className={`h-4 w-4 ${editTab === "info" ? "text-brand-primary" : ""}`}
            />
            Business Info
          </button>

          <button
            type="button"
            onClick={() => setEditTab("owner")}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm text-left ${
              editTab === "owner"
                ? "bg-white shadow-sm border border-brand-border/60 text-brand-dark"
                : "text-brand-muted hover:bg-slate-100 hover:text-brand-dark"
            }`}
          >
            <User
              className={`h-4 w-4 ${editTab === "owner" ? "text-brand-primary" : ""}`}
            />
            Owner Details
          </button>

          <button
            type="button"
            onClick={() => setEditTab("location")}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm text-left ${
              editTab === "location"
                ? "bg-white shadow-sm border border-brand-border/60 text-brand-dark"
                : "text-brand-muted hover:bg-slate-100 hover:text-brand-dark"
            }`}
          >
            <MapPin
              className={`h-4 w-4 ${editTab === "location" ? "text-brand-primary" : ""}`}
            />
            Location
          </button>

          <button
            type="button"
            onClick={() => setEditTab("legal")}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm text-left ${
              editTab === "legal"
                ? "bg-white shadow-sm border border-brand-border/60 text-brand-dark"
                : "text-brand-muted hover:bg-slate-100 hover:text-brand-dark"
            }`}
          >
            <FileText
              className={`h-4 w-4 ${editTab === "legal" ? "text-brand-primary" : ""}`}
            />
            Legal & Tax
          </button>

          <button
            type="button"
            onClick={() => setEditTab("limits")}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm text-left ${
              editTab === "limits"
                ? "bg-white shadow-sm border border-brand-border/60 text-brand-dark"
                : "text-brand-muted hover:bg-slate-100 hover:text-brand-dark"
            }`}
          >
            <Sliders
              className={`h-4 w-4 ${editTab === "limits" ? "text-brand-primary" : ""}`}
            />
            Resource Limits
          </button>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col relative bg-white/50 overflow-hidden">
          <div className="flex-1 p-8 overflow-y-auto pb-28">
            {editTab === "info" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                <h3 className="text-lg font-bold text-brand-dark">
                  Business Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs font-bold text-brand-muted uppercase tracking-wider mb-2 block">
                      Business Name
                    </label>
                    <Input {...register("name")} error={errors.name?.message} />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-brand-muted uppercase tracking-wider mb-2 block">
                      Business Type
                    </label>
                    <div className="flex flex-col gap-1.5">
                      <select
                        className={`w-full rounded-xl border border-slate-200 bg-white/50 px-4 py-2.5 text-sm focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all capitalize ${errors.type ? "border-red-500 ring-red-500/20" : ""}`}
                        {...register("type")}
                      >
                        {[
                          "restaurant",
                          "cafe",
                          "retail",
                          "grocery",
                          "pharmacy",
                          "salon",
                          "hotel",
                          "electronics",
                          "clothing",
                          "hardware",
                          "bakery",
                        ].map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                      {errors.type && (
                        <p className="text-xs font-medium text-brand-danger">
                          {errors.type.message}
                        </p>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-brand-muted uppercase tracking-wider mb-2 block">
                      Website
                    </label>
                    <Input
                      placeholder="https://..."
                      {...register("website")}
                      error={errors.website?.message}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-brand-muted uppercase tracking-wider mb-2 block">
                      Business Phone
                    </label>
                    <Input
                      {...register("phone")}
                      error={errors.phone?.message}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-brand-muted uppercase tracking-wider mb-2 block">
                      Business Email
                    </label>
                    <Input
                      {...register("email")}
                      error={errors.email?.message}
                    />
                  </div>
                </div>
              </div>
            )}

            {editTab === "owner" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                <h3 className="text-lg font-bold text-brand-dark">
                  Owner Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs font-bold text-brand-muted uppercase tracking-wider mb-2 block">
                      Owner Name
                    </label>
                    <Input
                      {...register("owner.name")}
                      error={errors.owner?.name?.message}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-brand-muted uppercase tracking-wider mb-2 block">
                      Owner Email
                    </label>
                    <Input
                      {...register("owner.email")}
                      error={errors.owner?.email?.message}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-brand-muted uppercase tracking-wider mb-2 block">
                      Owner Phone
                    </label>
                    <Input
                      {...register("owner.phone")}
                      error={errors.owner?.phone?.message}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-brand-muted uppercase tracking-wider mb-2 block">
                      Date of Birth
                    </label>
                    <Input
                      type="date"
                      {...register("dateOfBirth")}
                      error={errors.dateOfBirth?.message}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-brand-muted uppercase tracking-wider mb-2 block">
                      Gender
                    </label>
                    <div className="flex flex-col gap-1.5">
                      <select
                        className={`w-full rounded-xl border border-slate-200 bg-white/50 px-4 py-2.5 text-sm focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all capitalize ${errors.gender ? "border-red-500 ring-red-500/20" : ""}`}
                        {...register("gender")}
                      >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {editTab === "location" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                <h3 className="text-lg font-bold text-brand-dark">Location</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="text-xs font-bold text-brand-muted uppercase tracking-wider mb-2 block">
                      Address Line 1
                    </label>
                    <Input
                      {...register("address.line1")}
                      error={errors.address?.line1?.message}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-xs font-bold text-brand-muted uppercase tracking-wider mb-2 block">
                      Address Line 2
                    </label>
                    <Input
                      {...register("address.line2")}
                      error={errors.address?.line2?.message}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-brand-muted uppercase tracking-wider mb-2 block">
                      City
                    </label>
                    <Input
                      {...register("address.city")}
                      error={errors.address?.city?.message}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-brand-muted uppercase tracking-wider mb-2 block">
                      State
                    </label>
                    <Input
                      {...register("address.state")}
                      error={errors.address?.state?.message}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-brand-muted uppercase tracking-wider mb-2 block">
                      Country
                    </label>
                    <Input
                      {...register("address.country")}
                      error={errors.address?.country?.message}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-brand-muted uppercase tracking-wider mb-2 block">
                      Pincode
                    </label>
                    <Input
                      {...register("address.pincode")}
                      error={errors.address?.pincode?.message}
                    />
                  </div>
                </div>
              </div>
            )}

            {editTab === "legal" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                <h3 className="text-lg font-bold text-brand-dark">
                  Legal & Tax
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs font-bold text-brand-muted uppercase tracking-wider mb-2 block">
                      Legal Name
                    </label>
                    <Input
                      {...register("legalName")}
                      error={errors.legalName?.message}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-brand-muted uppercase tracking-wider mb-2 block">
                      GSTIN
                    </label>
                    <Input
                      {...register("gstin")}
                      error={errors.gstin?.message}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-brand-muted uppercase tracking-wider mb-2 block">
                      PAN
                    </label>
                    <Input {...register("pan")} error={errors.pan?.message} />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-brand-muted uppercase tracking-wider mb-2 block">
                      Business Reg No.
                    </label>
                    <Input {...register("businessRegistrationNumber")} error={errors.businessRegistrationNumber?.message} />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-brand-muted uppercase tracking-wider mb-2 block">
                      GST Certificate Path
                    </label>
                    <Input {...register("gstCertificate")} error={errors.gstCertificate?.message} />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-brand-muted uppercase tracking-wider mb-2 block">
                      PAN Card Path
                    </label>
                    <Input {...register("panCard")} error={errors.panCard?.message} />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-brand-muted uppercase tracking-wider mb-2 block">
                      Trade License Path
                    </label>
                    <Input {...register("tradeLicense")} error={errors.tradeLicense?.message} />
                  </div>
                </div>
              </div>
            )}

            {editTab === "limits" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                <h3 className="text-lg font-bold text-brand-dark">
                  Resource Limits
                </h3>
                <p className="text-sm text-brand-muted">
                  Override the default subscription plan limits for this
                  business.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs font-bold text-brand-muted uppercase tracking-wider mb-2 block">
                      Max Branches
                    </label>
                    <Input
                      type="number"
                      min="1"
                      {...register("subscription.maxBranches", {
                        valueAsNumber: true,
                      })}
                      error={errors.subscription?.maxBranches?.message}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-brand-muted uppercase tracking-wider mb-2 block">
                      Plan
                    </label>
                    <select
                      className="w-full rounded-xl border border-slate-200 bg-white/50 px-4 py-2.5 text-sm focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all capitalize"
                      {...register("subscription.plan")}
                    >
                      <option value="free_trial">Free Trial</option>
                      <option value="starter">Starter</option>
                      <option value="growth">Growth</option>
                      <option value="professional">Professional</option>
                      <option value="enterprise">Enterprise</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-brand-muted uppercase tracking-wider mb-2 block">
                      Status
                    </label>
                    <select
                      className="w-full rounded-xl border border-slate-200 bg-white/50 px-4 py-2.5 text-sm focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all capitalize"
                      {...register("subscription.status")}
                    >
                      <option value="active">Active</option>
                      <option value="trialing">Trialing</option>
                      <option value="past_due">Past Due</option>
                      <option value="canceled">Canceled</option>
                      <option value="expired">Expired</option>
                      <option value="paused">Paused</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-brand-muted uppercase tracking-wider mb-2 block">
                      Start Date
                    </label>
                    <Input
                      type="date"
                      {...register("subscription.startDate")}
                      error={errors.subscription?.startDate?.message}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-brand-muted uppercase tracking-wider mb-2 block">
                      Ends At
                    </label>
                    <Input
                      type="date"
                      {...register("subscription.endsAt")}
                      error={errors.subscription?.endsAt?.message}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-brand-muted uppercase tracking-wider mb-2 block">
                      Trial End Date
                    </label>
                    <Input
                      type="date"
                      {...register("subscription.trialEndDate")}
                      error={errors.subscription?.trialEndDate?.message}
                    />
                  </div>
                  <div className="flex items-center gap-2 md:mt-8">
                    <input
                      type="checkbox"
                      id="autoRenew"
                      className="h-4 w-4 rounded border-slate-300 text-brand-primary focus:ring-brand-primary"
                      {...register("subscription.autoRenew")}
                    />
                    <label htmlFor="autoRenew" className="text-sm text-brand-dark">
                      Auto Renew
                    </label>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-brand-muted uppercase tracking-wider mb-2 block">
                      Max Staff Users
                    </label>
                    <Input
                      type="number"
                      min="1"
                      {...register("subscription.maxUsers", {
                        valueAsNumber: true,
                      })}
                      error={errors.subscription?.maxUsers?.message}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-brand-muted uppercase tracking-wider mb-2 block">
                      Extra Branches
                    </label>
                    <Input
                      type="number"
                      min="0"
                      {...register("subscription.extraBranches", {
                        valueAsNumber: true,
                      })}
                      error={errors.subscription?.extraBranches?.message}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-brand-muted uppercase tracking-wider mb-2 block">
                      Extra Staff Users
                    </label>
                    <Input
                      type="number"
                      min="0"
                      {...register("subscription.extraTeamMembers", {
                        valueAsNumber: true,
                      })}
                      error={errors.subscription?.extraTeamMembers?.message}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sticky Footer */}
          <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-brand-border/50 bg-white/70 backdrop-blur-xl flex justify-end gap-3 z-10">
            <Button
              type="button"
              variant="outline"
              className="bg-white hover:bg-slate-50 border-slate-200"
              onClick={onClose}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSaving}
              className="bg-brand-primary hover:bg-brand-primaryDark text-white px-8 shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0"
            >
              {isSaving && <LottieLoader size="xs" className="mr-2" />}
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
