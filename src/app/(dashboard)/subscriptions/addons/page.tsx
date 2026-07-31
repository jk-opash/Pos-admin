"use client";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchBusinesses } from "@/store/slices/businessSlice";
import { fetchInvoices } from "@/store/slices/subscriptionSlice";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { Store, Users, Search, PlusCircle, CreditCard } from "lucide-react";
import { AddonModal } from "./_components/AddonModal";
import Link from "next/link";

export default function AddonsPage() {
  const dispatch = useAppDispatch();
  const { businesses, loading } = useAppSelector((state) => state.business);
  const { invoices } = useAppSelector((state) => state.subscription);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBusiness, setSelectedBusiness] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchBusinesses());
    dispatch(fetchInvoices());
  }, [dispatch]);

  const filteredBusinesses = businesses.filter(
    (biz) =>
      biz.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      biz.email.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Helper to calculate total revenue generated from a business (Plan + Addons)
  const getBusinessTotalRevenue = (businessId: string, basePrice: number) => {
    const addonInvoices = invoices.filter(
      (i) =>
        i.business_id === businessId &&
        i.invoice_number.startsWith("INV-ADDON-") &&
        i.status === "paid",
    );
    const addonsTotal = addonInvoices.reduce(
      (acc, curr) => acc + Number(curr.amount || 0),
      0,
    );
    return basePrice + addonsTotal;
  };

  const handleAddExtras = (biz: any) => {
    setSelectedBusiness(biz);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-brand-dark flex items-center gap-2">
            Purchase Add-ons
          </h1>
          <p className="mt-1 text-sm text-brand-muted">
            Manage and purchase extra branches and staff members for businesses.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/subscriptions">
            <Button variant="outline" className="gap-2">
              Back to Overview
            </Button>
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-96">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-4 w-4 text-brand-muted" />
          </div>
          <Input
            type="text"
            placeholder="Search businesses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-brand-light bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-brand-light/30">
                <TableHead>Business</TableHead>
                <TableHead>Current Plan</TableHead>
                <TableHead>Branches</TableHead>
                <TableHead>Staff</TableHead>
                <TableHead className="text-right">Total MRR</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading && !businesses.length ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="h-32 text-center text-brand-muted"
                  >
                    Loading businesses...
                  </TableCell>
                </TableRow>
              ) : filteredBusinesses.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="h-32 text-center text-brand-muted"
                  >
                    No businesses found matching "{searchQuery}"
                  </TableCell>
                </TableRow>
              ) : (
                filteredBusinesses.map((biz) => {
                  const basePlanPrice = Number(
                    biz.subscription_plan?.amount || 0,
                  );
                  const totalRevenue = getBusinessTotalRevenue(
                    biz.id,
                    basePlanPrice,
                  );
                  const baseBranches = biz.subscription_plan?.max_branches || 0;
                  const baseStaff =
                    biz.subscription_plan?.max_team_members || 0;

                  return (
                    <TableRow
                      key={biz.id}
                      className="hover:bg-brand-light/10 transition-colors"
                    >
                      <TableCell>
                        <div>
                          <p className="font-medium text-brand-dark">
                            {biz.name}
                          </p>
                          <p className="text-sm text-brand-muted">
                            {biz.email}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={biz.subscription_plan ? "default" : "muted"}
                          className="capitalize"
                        >
                          {biz.subscription_plan?.plan || "No Plan"}
                        </Badge>
                        <div className="text-xs text-brand-muted mt-1">
                          Base: {formatCurrency(basePlanPrice)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5">
                          <Store className="h-4 w-4 text-brand-muted" />
                          <span className="font-medium">
                            {baseBranches + (biz.extra_branches || 0)}
                          </span>
                          {biz.extra_branches > 0 && (
                            <span className="text-xs text-brand-primary">
                              (+{biz.extra_branches})
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5">
                          <Users className="h-4 w-4 text-brand-muted" />
                          <span className="font-medium">
                            {baseStaff + (biz.extra_team_members || 0)}
                          </span>
                          {biz.extra_team_members > 0 && (
                            <span className="text-xs text-brand-primary">
                              (+{biz.extra_team_members})
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <span className="font-semibold text-brand-dark">
                          {formatCurrency(totalRevenue)}
                        </span>
                        {totalRevenue > basePlanPrice && (
                          <div className="text-xs text-brand-success mt-0.5">
                            + {formatCurrency(totalRevenue - basePlanPrice)}{" "}
                            addons
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          onClick={() => handleAddExtras(biz)}
                          className="gap-2"
                        >
                          <PlusCircle className="h-4 w-4" />
                          Add Extras
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <AddonModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        business={selectedBusiness}
      />
    </div>
  );
}
