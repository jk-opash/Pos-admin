"use client";

import { useState } from "react";
import { BusinessesTab } from "@/app/(dashboard)/businesses/_components/BusinessesTab";
import { OwnersTab } from "@/app/(dashboard)/businesses/_components/OwnersTab";
import { cn } from "@/lib/utils";
import { Store, Users } from "lucide-react";

export default function BusinessesPage() {
  const [activeTab, setActiveTab] = useState<"businesses" | "owners">("businesses");

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h2 className="text-2xl font-bold text-brand-dark">
          Business Management
        </h2>
        <p className="mt-1 text-sm text-brand-muted">
          Manage all registered businesses and their owners.
        </p>
      </div>

      <div className="border-b border-brand-border">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            onClick={() => setActiveTab("businesses")}
            className={cn(
              "flex items-center gap-2 whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium transition-colors",
              activeTab === "businesses"
                ? "border-brand-primary text-brand-primary"
                : "border-transparent text-brand-muted hover:border-brand-border hover:text-brand-dark"
            )}
          >
            <Store className="h-4 w-4" />
            Businesses
          </button>
          <button
            onClick={() => setActiveTab("owners")}
            className={cn(
              "flex items-center gap-2 whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium transition-colors",
              activeTab === "owners"
                ? "border-brand-primary text-brand-primary"
                : "border-transparent text-brand-muted hover:border-brand-border hover:text-brand-dark"
            )}
          >
            <Users className="h-4 w-4" />
            Business Owners
          </button>
        </nav>
      </div>

      {activeTab === "businesses" && <BusinessesTab />}
      {activeTab === "owners" && <OwnersTab />}
    </div>
  );
}
