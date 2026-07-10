"use client";

import { useState, useEffect } from "react";
import { mockBusinesses } from "@/lib/mock/businesses";
import { BusinessTable } from "@/app/(dashboard)/businesses/_components/BusinessTable";
import { BusinessFilters } from "@/app/(dashboard)/businesses/_components/BusinessFilters";
import { StatsCard } from "@/components/ui/StatsCard";
import { Pagination } from "@/components/ui/Pagination";
import { Store, CheckCircle, Clock, AlertTriangle } from "lucide-react";

export default function BusinessesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [planFilter, setPlanFilter] = useState("all");
  const [stateFilter, setStateFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Reset to first page when filters change
  useEffect(() => {
    const timeout = setTimeout(() => setCurrentPage(1), 0);
    return () => clearTimeout(timeout);
  }, [searchTerm, statusFilter, typeFilter, planFilter, stateFilter]);

  // Client-side filtering
  const filteredBusinesses = mockBusinesses.filter((biz) => {
    // Search match
    const matchesSearch =
      biz.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      biz.owner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      biz.owner.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (biz.gstin && biz.gstin.toLowerCase().includes(searchTerm.toLowerCase()));

    // Status match
    const matchesStatus = statusFilter === "all" || biz.status === statusFilter;

    // Type match
    const matchesType = typeFilter === "all" || biz.type === typeFilter;

    // Plan match
    const matchesPlan =
      planFilter === "all" || biz.subscription.plan === planFilter;

    // State match
    const matchesState =
      stateFilter === "all" ||
      biz.address.state.toLowerCase() === stateFilter.toLowerCase();

    return (
      matchesSearch &&
      matchesStatus &&
      matchesType &&
      matchesPlan &&
      matchesState
    );
  });

  const totalPages = Math.ceil(filteredBusinesses.length / itemsPerPage);
  const paginatedBusinesses = filteredBusinesses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalBusinesses = mockBusinesses.length;
  const activeBusinesses = mockBusinesses.filter(
    (b) => b.status === "active",
  ).length;
  const trialBusinesses = mockBusinesses.filter(
    (b) => b.status === "trial",
  ).length;
  const pendingBusinesses = mockBusinesses.filter(
    (b) => b.status === "pending",
  ).length;

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h2 className="text-2xl font-bold text-brand-dark">
          Business Management
        </h2>
        <p className="mt-1 text-sm text-brand-muted">
          Manage all registered businesses, view their status, and manage their
          subscriptions.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Businesses"
          value={totalBusinesses.toString()}
          change={12}
          icon={<Store className="h-5 w-5" />}
          iconColor="text-brand-dark"
          gradient="from-brand-dark/20 to-transparent"
        />
        <StatsCard
          title="Active Businesses"
          value={activeBusinesses.toString()}
          change={5}
          icon={<CheckCircle className="h-5 w-5" />}
          iconColor="text-brand-success"
          gradient="from-brand-success/20 to-transparent"
        />
        <StatsCard
          title="Trial Businesses"
          value={trialBusinesses.toString()}
          change={2}
          icon={<Clock className="h-5 w-5" />}
          iconColor="text-brand-warning"
          gradient="from-brand-warning/20 to-transparent"
        />
        <StatsCard
          title="Pending Verification"
          value={pendingBusinesses.toString()}
          change={-1}
          icon={<AlertTriangle className="h-5 w-5" />}
          iconColor="text-brand-info"
          gradient="from-brand-info/20 to-transparent"
        />
      </div>

      <BusinessFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        typeFilter={typeFilter}
        setTypeFilter={setTypeFilter}
        planFilter={planFilter}
        setPlanFilter={setPlanFilter}
        stateFilter={stateFilter}
        setStateFilter={setStateFilter}
      />

      <BusinessTable data={paginatedBusinesses} />

      <div className="mt-4">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          itemsPerPage={itemsPerPage}
          onItemsPerPageChange={(size) => {
            setItemsPerPage(size);
            setCurrentPage(1); // Reset to page 1 on page size change
          }}
          totalItems={filteredBusinesses.length}
        />
      </div>
    </div>
  );
}
