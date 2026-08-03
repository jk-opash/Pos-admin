"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchAdmins } from "@/store/slices/adminSlice";

import { OwnerTable } from "./OwnerTable";
import { Input } from "@/components/ui/Input";
import { Pagination } from "@/components/ui/Pagination";
import { Select } from "@/components/ui/Select";

export function OwnersTab() {
  const dispatch = useAppDispatch();
  const { admins, isLoading } = useAppSelector((state) => state.admin);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    dispatch(fetchAdmins());
  }, [dispatch]);

  // Reset to first page when filters change
  useEffect(() => {
    const timeout = setTimeout(() => setCurrentPage(1), 0);
    return () => clearTimeout(timeout);
  }, [searchQuery, statusFilter]);

  const filteredAdmins = admins.filter((admin) => {
    const matchesSearch =
      admin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      admin.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && admin.is_active) ||
      (statusFilter === "inactive" && !admin.is_active);

    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredAdmins.length / itemsPerPage);
  const paginatedAdmins = filteredAdmins.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:max-w-md">
          <Input
            placeholder="Search owners by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-4"
          />
        </div>
        <div className="w-full sm:w-48">
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[
              { label: "All Statuses", value: "all" },
              { label: "Active", value: "active" },
              { label: "Inactive", value: "inactive" },
            ]}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <div className="h-12 w-full rounded-xl bg-slate-100 animate-pulse" />
          <div className="h-16 w-full rounded-xl bg-slate-100 animate-pulse" />
          <div className="h-16 w-full rounded-xl bg-slate-100 animate-pulse" />
          <div className="h-16 w-full rounded-xl bg-slate-100 animate-pulse" />
        </div>
      ) : (
        <>
          <OwnerTable data={paginatedAdmins} />
          <div className="mt-4">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              itemsPerPage={itemsPerPage}
              onItemsPerPageChange={(size) => {
                setItemsPerPage(size);
                setCurrentPage(1);
              }}
              totalItems={filteredAdmins.length}
            />
          </div>
        </>
      )}
    </div>
  );
}
