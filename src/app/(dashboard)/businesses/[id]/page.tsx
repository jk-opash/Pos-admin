"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { mockBusinesses } from "@/lib/mock/businesses";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EditBusinessModal } from "../_components/EditBusinessModal";
import { formatDate } from "@/lib/utils";
import {
  Building,
  Edit,
  ChevronLeft,
  Store,
  User,
  MapPin,
  BarChart3,
  Loader2,
  FileText,
} from "lucide-react";
import Link from "next/link";
import {
  BusinessStatus,
  SubscriptionPlanSlug,
  Business,
  BusinessType,
} from "@/types";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchBusinessById,
  updateBusiness,
} from "@/store/slices/businessSlice";

// Import Tabs
import { OverviewTab } from "@/app/(dashboard)/businesses/_components/profile/OverviewTab";
import { SubscriptionTab } from "@/app/(dashboard)/businesses/_components/profile/SubscriptionTab";
import { FeaturesTab } from "@/app/(dashboard)/businesses/_components/profile/FeaturesTab";
import { BranchesTab } from "@/app/(dashboard)/businesses/_components/profile/BranchesTab";
import { AuditTab } from "@/app/(dashboard)/businesses/_components/profile/AuditTab";
import { SettingsTab } from "@/app/(dashboard)/businesses/_components/profile/SettingsTab";

export function StatusBadge({ status }: { status: BusinessStatus }) {
  switch (status) {
    case "active":
      return (
        <Badge variant="success" dot>
          Active
        </Badge>
      );
    case "trial":
      return (
        <Badge variant="warning" dot>
          Trialing
        </Badge>
      );
    case "suspended":
      return (
        <Badge variant="danger" dot>
          Suspended
        </Badge>
      );
    case "pending":
      return (
        <Badge variant="info" dot>
          Pending KYC
        </Badge>
      );
    default:
      return (
        <Badge variant="muted" dot>
          Deleted
        </Badge>
      );
  }
}

export function PlanBadge({ plan }: { plan: SubscriptionPlanSlug }) {
  switch (plan) {
    case "enterprise":
      return <Badge variant="purple">Enterprise</Badge>;
    case "professional":
      return <Badge variant="default">Professional</Badge>;
    case "growth":
      return <Badge variant="info">Growth</Badge>;
    case "starter":
      return <Badge variant="success">Starter</Badge>;
    default:
      return <Badge variant="warning">Free Trial</Badge>;
  }
}

export default function BusinessProfilePage() {
  const params = useParams();
  const id = params.id as string;
  const dispatch = useAppDispatch();
  const { currentBusiness, loading } = useAppSelector(
    (state) => state.business,
  );

  const [business, setBusiness] = useState<Business | undefined>(undefined);
  const [isSuspended, setIsSuspended] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editTab, setEditTab] = useState<"info" | "location" | "legal">("info");
  const [activeTab, setActiveTab] = useState("overview");
  const [isSaving, setIsSaving] = useState(false);

  // Fetch business data on mount
  useEffect(() => {
    if (id) {
      dispatch(fetchBusinessById(id));
    }
  }, [dispatch, id]);

  // Map backend currentBusiness to frontend state
  useEffect(() => {
    if (currentBusiness && currentBusiness.id === id) {
      let mappedStatus: BusinessStatus = "active";
      if (currentBusiness.status === "suspended") mappedStatus = "suspended";
      else if (currentBusiness.status === "deleted") mappedStatus = "deleted";
      else if (currentBusiness.status === "pending") mappedStatus = "pending";
      else if (currentBusiness.status === "trial") mappedStatus = "trial";

      setBusiness({
        id: currentBusiness.id,
        name: currentBusiness.name,
        slug: currentBusiness.slug,
        type: currentBusiness.business_type as BusinessType,
        status: mappedStatus,
        owner: {
          name: currentBusiness.admin?.name || "N/A",
          email: currentBusiness.admin?.email || currentBusiness.email || "N/A",
          phone: currentBusiness.admin?.phone || currentBusiness.phone || "N/A",
        },
        address: {
          line1: currentBusiness.address_line1 || "",
          line2: currentBusiness.address_line2 || "",
          city: currentBusiness.city || "N/A",
          state: currentBusiness.state || "N/A",
          country: currentBusiness.country || "N/A",
          pincode: currentBusiness.pincode || "N/A",
        },
        website: currentBusiness.website || "",
        email: currentBusiness.email || "",
        phone: currentBusiness.phone || "",
        legalName: currentBusiness.legal_name || "",
        gstin: currentBusiness.gstin || "",
        pan: currentBusiness.pan || "",
        subscription: currentBusiness.subscription_plan
          ? {
              plan: currentBusiness.subscription_plan
                .plan as SubscriptionPlanSlug,
              status: currentBusiness.subscription_plan.status,
              endsAt: currentBusiness.subscription_plan.updated_at,
              autoRenew: currentBusiness.subscription_plan.auto_renew,
              maxBranches: currentBusiness.subscription_plan.max_branches,
              maxUsers: currentBusiness.subscription_plan.max_team_members,
            }
          : {
              plan: "free_trial",
              status: "active",
              endsAt: "N/A",
              autoRenew: false,
              maxBranches: 5,
              maxUsers: 50,
            },
        stats: {
          branches: currentBusiness.branches?.length ?? 0,
          users: currentBusiness.teamMembers?.length ?? 0,
          totalOrders: 0,
          revenueMTD: 0,
          revenueTotal: 0,
        },
        kyc: { status: "pending" },
        createdAt: currentBusiness.created_at || new Date().toISOString(),
        updatedAt: currentBusiness.updated_at || new Date().toISOString(),
      });
      setIsSuspended(mappedStatus === "suspended");
    }
  }, [currentBusiness, id]);

  const handleSave = async () => {
    if (!business) return;
    setIsSaving(true);
    try {
      const backendData = {
        name: business.name,
        legal_name: business.legalName,
        business_type: business.type,
        website: business.website,
        email: business.email,
        phone: business.phone,
        address_line1: business.address.line1,
        address_line2: business.address.line2,
        city: business.address.city,
        state: business.address.state,
        country: business.address.country,
        pincode: business.address.pincode,
        gstin: business.gstin,
        pan: business.pan,
      };
      await dispatch(updateBusiness({ id, data: backendData })).unwrap();
      setIsEditModalOpen(false);
    } catch (err) {
      console.error("Failed to save", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleSuspend = async (suspend: boolean) => {
    if (!business) return;
    setIsSaving(true);
    try {
      const backendData = {
        status: suspend ? "suspended" : "active",
        is_active: !suspend,
      };
      await dispatch(updateBusiness({ id, data: backendData })).unwrap();
      setBusiness({
        ...business,
        status: suspend ? "suspended" : "active",
        is_active: !suspend,
      } as any);
      setIsSuspended(suspend);
    } catch (err) {
      console.error("Failed to toggle suspend status", err);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading && !business) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center text-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-primary" />
        <p className="mt-4 text-brand-muted">Loading business details...</p>
      </div>
    );
  }

  if (!business) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center text-center">
        <h1 className="text-3xl font-bold text-brand-dark">
          Business Not Found
        </h1>
        <p className="mt-2 text-brand-muted">
          We couldn&apos;t find a business with the ID: {id}
        </p>
        <Link href="/businesses" className="mt-6">
          <Button>Back to Businesses</Button>
        </Link>
      </div>
    );
  }

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "subscription", label: "Subscription & Limits" },
    { id: "branches", label: "Branches & Staff" },
    { id: "settings", label: "Settings" },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Back Button */}
      <div>
        <Link
          href="/businesses"
          className="inline-flex items-center text-sm font-medium text-brand-muted hover:text-brand-dark transition-colors"
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          Back to Businesses
        </Link>
      </div>

      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-brand-dark">
              {business.name}
            </h1>
            <StatusBadge status={isSuspended ? "suspended" : business.status} />
          </div>
          <p className="mt-1 flex items-center gap-2 text-sm text-brand-muted capitalize">
            <Building className="h-4 w-4" /> {business.type}
            <span className="text-brand-border">|</span>
            Joined {formatDate(business.createdAt)}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full md:w-auto">
          {business.is_active === false || business.status === "suspended" ? (
            <Button
              variant="primary"
              onClick={() => handleToggleSuspend(false)}
              disabled={isSaving}
            >
              {isSaving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Restore Access"
              )}
            </Button>
          ) : (
            <Button
              variant="danger"
              className="bg-red-50 text-red-600 hover:bg-red-100 border-none shadow-none"
              onClick={() => handleToggleSuspend(true)}
              disabled={isSaving}
            >
              {isSaving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Suspend"
              )}
            </Button>
          )}
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => setIsEditModalOpen(true)}
          >
            <Edit className="h-4 w-4" /> Edit
          </Button>
          <Button
            onClick={() =>
              alert(`Redirecting to Business Panel for ${business.name}...`)
            }
          >
            Login as Owner
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-brand-border">
        <nav
          className="-mb-px flex space-x-6 overflow-x-auto"
          aria-label="Tabs"
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors
                ${
                  activeTab === tab.id
                    ? "border-brand-dark text-brand-dark"
                    : "border-transparent text-brand-muted hover:text-brand-dark hover:border-brand-border"
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === "overview" && <OverviewTab business={business} />}
        {activeTab === "subscription" && (
          <SubscriptionTab business={business} />
        )}
        {activeTab === "branches" && <BranchesTab business={business} />}
        {activeTab === "settings" && <SettingsTab business={business} />}
      </div>

      {/* Edit Modal */}
      <EditBusinessModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        initialBusiness={business || null}
        onSuccess={(updatedBusiness) => {
          setBusiness(updatedBusiness);
          dispatch(fetchBusinessById(id));
        }}
      />
    </div>
  );
}
