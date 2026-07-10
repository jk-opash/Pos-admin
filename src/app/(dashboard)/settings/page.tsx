"use client";
/* eslint-disable @typescript-eslint/no-unused-vars */

import { useState } from "react";
import { SettingsOverview } from "@/app/(dashboard)/settings/_components/SettingsOverview";
import { GeneralSettings } from "@/app/(dashboard)/settings/_components/GeneralSettings";
import { BrandingSettings } from "@/app/(dashboard)/settings/_components/BrandingSettings";
import { UnderConstruction } from "@/components/ui/UnderConstruction";
import {
  LayoutDashboard,
  Settings,
  Palette,
  ShieldCheck,
  Globe,
  Mail,
  Smartphone,
  CreditCard,
  Database,
  Cloud,
  Wrench,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";

type SettingTab =
  | "overview"
  | "general"
  | "branding"
  | "localization"
  | "security"
  | "auth"
  | "email"
  | "sms"
  | "payments"
  | "storage"
  | "backup"
  | "maintenance";

export default function SystemSettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingTab>("overview");

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return <SettingsOverview />;
      case "general":
        return <GeneralSettings />;
      case "branding":
        return <BrandingSettings />;
      default:
        return (
          <UnderConstruction
            title="Under Construction"
            message="This settings panel will be available in the next release."
          />
        );
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-8 pb-12 min-h-[calc(100vh-8rem)]">
      {/* Sidebar Navigation */}
      <div className="w-full md:w-64 shrink-0 flex flex-col gap-6">
        <div>
          <h2 className="text-2xl font-bold text-brand-dark">
            System Settings
          </h2>
          <p className="text-xs text-brand-muted mt-1">
            Global platform configuration
          </p>
        </div>

        <nav className="flex flex-col gap-1 pr-4 md:pr-0 border-r border-brand-border md:border-transparent h-full">
          <SettingsNavLink
            label="Overview"
            icon={<LayoutDashboard className="h-4 w-4" />}
            active={activeTab === "overview"}
            onClick={() => setActiveTab("overview")}
          />

          <NavSectionTitle title="Configuration" />
          <SettingsNavLink
            label="General Settings"
            icon={<Settings className="h-4 w-4" />}
            active={activeTab === "general"}
            onClick={() => setActiveTab("general")}
          />
          <SettingsNavLink
            label="Branding & UI"
            icon={<Palette className="h-4 w-4" />}
            active={activeTab === "branding"}
            onClick={() => setActiveTab("branding")}
          />
          <SettingsNavLink
            label="Localization"
            icon={<Globe className="h-4 w-4" />}
            active={activeTab === "localization"}
            onClick={() => setActiveTab("localization")}
          />

          <NavSectionTitle title="Security & Access" />
          <SettingsNavLink
            label="Security Policies"
            icon={<AlertTriangle className="h-4 w-4" />}
            active={activeTab === "security"}
            onClick={() => setActiveTab("security")}
          />

          <NavSectionTitle title="Integrations" />
          <SettingsNavLink
            label="Email (SMTP)"
            icon={<Mail className="h-4 w-4" />}
            active={activeTab === "email"}
            onClick={() => setActiveTab("email")}
          />
          <SettingsNavLink
            label="SMS & WhatsApp"
            icon={<Smartphone className="h-4 w-4" />}
            active={activeTab === "sms"}
            onClick={() => setActiveTab("sms")}
          />

          <NavSectionTitle title="Infrastructure" />
          <SettingsNavLink
            label="Storage (S3)"
            icon={<Cloud className="h-4 w-4" />}
            active={activeTab === "storage"}
            onClick={() => setActiveTab("storage")}
          />
          <SettingsNavLink
            label="Backups"
            icon={<Database className="h-4 w-4" />}
            active={activeTab === "backup"}
            onClick={() => setActiveTab("backup")}
          />
          <SettingsNavLink
            label="Maintenance Mode"
            icon={<Wrench className="h-4 w-4" />}
            active={activeTab === "maintenance"}
            onClick={() => setActiveTab("maintenance")}
          />
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 min-w-0">
        <div className="bg-white rounded-2xl border border-brand-border shadow-sm p-6 md:p-8 min-h-full">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

function NavSectionTitle({ title }: { title: string }) {
  return (
    <p className="px-3 mt-4 mb-1 text-[10px] font-bold text-brand-placeholder uppercase tracking-widest">
      {title}
    </p>
  );
}

function SettingsNavLink({
  label,
  icon,
  active,
  onClick,
}: {
  label: string;
  icon: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors w-full text-left",
        active
          ? "bg-slate-100 text-brand-dark"
          : "text-brand-muted hover:bg-brand-light hover:text-brand-dark",
      )}
    >
      <span
        className={cn(active ? "text-brand-primary" : "text-brand-placeholder")}
      >
        {icon}
      </span>
      {label}
    </button>
  );
}
