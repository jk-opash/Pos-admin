"use client";

import { useState } from "react";

import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Search, Filter, Plus } from "lucide-react";
import Link from "next/link";

interface FiltersProps {
  searchTerm: string;
  setSearchTerm: (v: string) => void;
  statusFilter: string;
  setStatusFilter: (v: string) => void;
  typeFilter: string;
  setTypeFilter: (v: string) => void;
  planFilter: string;
  setPlanFilter: (v: string) => void;
  stateFilter: string;
  setStateFilter: (v: string) => void;
}

export function BusinessFilters({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  typeFilter,
  setTypeFilter,
  planFilter,
  setPlanFilter,
  stateFilter,
  setStateFilter,
}: FiltersProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
          <div className="w-full sm:max-w-xs">
            <Input
              placeholder="Search businesses, owners, GSTIN..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Search className="h-4 w-4" />}
            />
          </div>
          <div className="grid grid-cols-2 gap-3 w-full sm:w-auto">
            <div className="w-full sm:w-36">
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                options={[
                  { label: "All Statuses", value: "all" },
                  { label: "Active", value: "active" },
                  { label: "Trialing", value: "trial" },
                  { label: "Suspended", value: "suspended" },
                  { label: "Pending KYC", value: "pending" },
                ]}
              />
            </div>
            <div className="w-full sm:w-36">
              <Select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                options={[
                  { label: "All Industries", value: "all" },
                  { label: "Restaurant", value: "restaurant" },
                  { label: "Retail", value: "retail" },
                  { label: "Grocery", value: "grocery" },
                  { label: "Pharmacy", value: "pharmacy" },
                  { label: "Salon", value: "salon" },
                  { label: "Hotel", value: "hotel" },
                ]}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button
            variant={showAdvanced ? "primary" : "secondary"}
            className="flex-1 sm:flex-initial gap-2 justify-center"
            onClick={() => setShowAdvanced(!showAdvanced)}
          >
            <Filter className="h-4 w-4" />
            More Filters
          </Button>
        </div>
      </div>

      {showAdvanced && (
        <div className="p-4 border border-brand-border rounded-xl bg-brand-light animate-in fade-in slide-in-from-top-2">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold text-brand-muted mb-1.5 block">
                Subscription Plan
              </label>
              <Select
                value={planFilter}
                onChange={(e) => setPlanFilter(e.target.value)}
                options={[
                  { label: "All Plans", value: "all" },
                  { label: "Free Trial", value: "free_trial" },
                  { label: "Starter", value: "starter" },
                  { label: "Growth", value: "growth" },
                  { label: "Professional", value: "professional" },
                  { label: "Enterprise", value: "enterprise" },
                ]}
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-brand-muted mb-1.5 block">
                State / Region
              </label>
              <Select
                value={stateFilter}
                onChange={(e) => setStateFilter(e.target.value)}
                options={[
                  { label: "All Regions", value: "all" },
                  { label: "Maharashtra", value: "Maharashtra" },
                  { label: "Karnataka", value: "Karnataka" },
                  { label: "Delhi", value: "Delhi" },
                  { label: "Kerala", value: "Kerala" },
                  { label: "Tamil Nadu", value: "Tamil Nadu" },
                  { label: "Gujarat", value: "Gujarat" },
                  { label: "Haryana", value: "Haryana" },
                  { label: "Telangana", value: "Telangana" },
                  { label: "West Bengal", value: "West Bengal" },
                ]}
              />
            </div>
            <div className="flex items-end">
              <Button
                variant="outline"
                className="w-full text-sm text-brand-muted"
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("all");
                  setTypeFilter("all");
                  setPlanFilter("all");
                  setStateFilter("all");
                }}
              >
                Clear All Filters
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
