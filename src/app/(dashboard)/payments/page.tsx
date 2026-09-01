"use client";

import { useState, useEffect } from "react";
import { PaymentTable } from "@/app/(dashboard)/payments/_components/PaymentTable";
import { PaymentDetailsModal } from "@/app/(dashboard)/payments/_components/PaymentDetailsModal";
import { AddPaymentModal } from "@/app/(dashboard)/payments/_components/AddPaymentModal";
import { Payment, PaymentStatus } from "@/types";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Pagination } from "@/components/ui/Pagination";
import { Search, Plus, Loader2 } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchInvoices } from "@/store/slices/subscriptionSlice";
import { LottieLoader } from "@/components/ui/LottieLoader";

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const dispatch = useAppDispatch();
  const { invoices, loading } = useAppSelector((state) => state.subscription);

  useEffect(() => {
    dispatch(fetchInvoices());
  }, [dispatch]);

  // Map API invoices to Payments array
  useEffect(() => {
    if (invoices && invoices.length > 0) {
      const mappedPayments: Payment[] = invoices.map((inv: any) => {
        let status: PaymentStatus = "success";
        if (inv.status === "pending") status = "pending";
        else if (inv.status === "overdue" || inv.status === "failed")
          status = "failed";

        return {
          id: inv.invoice_number || inv.id,
          businessId: inv.business_id || "N/A",
          businessName: inv.business?.name || "Business",
          subscriptionId: inv.subscription_id || "N/A",
          amount: Number(inv.amount || 0),
          gstAmount: Math.round(Number(inv.amount || 0) * 0.18),
          totalAmount: Math.round(Number(inv.amount || 0) * 1.18),
          currency: inv.currency || "INR",
          status,
          paymentMethod: inv.payment_method,
          invoiceNumber: inv.invoice_number || `INV-${inv.id.slice(0, 8)}`,
          paidAt: inv.paid_at || inv.issued_at || new Date().toISOString(),
          createdAt: inv.created_at || new Date().toISOString(),
        };
      });
      setPayments(mappedPayments);
    }
  }, [invoices]);

  const handleViewPayment = (payment: Payment) => {
    setSelectedPayment(payment);
    setIsDetailsModalOpen(true);
  };

  const handleAddPayment = (newPayment: Payment) => {
    setPayments((prev) => [newPayment, ...prev]);
  };

  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      payment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.businessId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || payment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Reset to first page when filters change
  useEffect(() => {
    const timeout = setTimeout(() => setCurrentPage(1), 0);
    return () => clearTimeout(timeout);
  }, [searchTerm, statusFilter]);

  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);
  const paginatedPayments = filteredPayments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  // Calculate totals
  const totalVolume = filteredPayments
    .filter((p) => p.status === "success")
    .reduce((acc, curr) => acc + curr.amount, 0);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-40">
        <LottieLoader size="lg" text="Loading payments..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-brand-dark">
            Payments & Transactions
          </h2>
          <p className="mt-1 text-sm text-brand-muted">
            View and manage all subscription payments across the platform.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="flex flex-col items-start sm:items-end">
            <p className="text-xs text-brand-muted uppercase tracking-wider font-semibold">
              Filtered Volume (Succeeded)
            </p>
            <p className="text-2xl font-bold text-brand-success leading-none mt-1.5">
              {formatCurrency(totalVolume)}
            </p>
          </div>
          <Button onClick={() => setIsAddModalOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" /> Add Payment
          </Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="w-full sm:w-80">
          <Input
            placeholder="Search by Transaction ID or Business Name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={<Search className="h-4 w-4" />}
          />
        </div>
      </div>

      <PaymentTable
        data={paginatedPayments}
        onViewPayment={handleViewPayment}
      />

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
          totalItems={filteredPayments.length}
        />
      </div>

      <PaymentDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        payment={selectedPayment}
      />

      <AddPaymentModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddPayment}
      />
    </div>
  );
}
