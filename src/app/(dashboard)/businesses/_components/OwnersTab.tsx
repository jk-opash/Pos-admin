"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchAdmins } from "@/store/slices/adminSlice";

import { Filter } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { OwnerTable } from "./OwnerTable";
import { Input } from "@/components/ui/Input";

export function OwnersTab() {
  const dispatch = useAppDispatch();
  const { admins, isLoading } = useAppSelector((state) => state.admin);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    dispatch(fetchAdmins());
  }, [dispatch]);

  const filteredAdmins = admins.filter(
    (admin) =>
      admin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      admin.email.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Input
            placeholder="Search owners by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-4"
          />
        </div>
        <Button variant="outline" className="w-full sm:w-auto">
          <Filter className="mr-2 h-4 w-4" />
          Filters
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <div className="h-12 w-full rounded-xl bg-slate-100 animate-pulse" />
          <div className="h-16 w-full rounded-xl bg-slate-100 animate-pulse" />
          <div className="h-16 w-full rounded-xl bg-slate-100 animate-pulse" />
          <div className="h-16 w-full rounded-xl bg-slate-100 animate-pulse" />
        </div>
      ) : (
        <OwnerTable data={filteredAdmins} />
      )}
    </div>
  );
}
