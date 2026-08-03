"use client";
/* eslint-disable @typescript-eslint/no-unused-vars */

import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Search } from "lucide-react";

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
          <div className="grid grid-cols-3 gap-3 w-full sm:w-auto">
            <div className="w-full sm:w-36">
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                options={[
                  { label: "All Statuses", value: "all" },
                  { label: "Active", value: "active" },
                  { label: "Suspended", value: "suspended" },
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
                  { label: "Cafe", value: "cafe" },
                ]}
              />
            </div>
            <div>
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
          </div>
        </div>
      </div>
    </div>
  );
}
