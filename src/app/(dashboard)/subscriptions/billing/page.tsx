"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { mockSubscriptions } from "@/lib/mock/subscriptions";
import { Badge } from "@/components/ui/Badge";
import { Search, Download, ArrowLeft, Eye, Loader2 } from "lucide-react";
import { formatDate, formatCurrency } from "@/lib/utils";
import { Invoice } from "@/types";
import { Modal } from "@/components/ui/Modal";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchBusinesses } from "@/store/slices/businessSlice";
import {
  fetchSubscriptions,
  fetchInvoices,
} from "@/store/slices/subscriptionSlice";

export default function BillingPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { businesses } = useAppSelector((state) => state.business);
  const { subscriptions, invoices, loading } = useAppSelector(
    (state) => state.subscription,
  );

  const [activeTab, setActiveTab] = useState<"subscriptions" | "invoices">(
    "subscriptions",
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [downloadingInvoiceId, setDownloadingInvoiceId] = useState<
    string | null
  >(null);
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string | null>(null);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);

  useEffect(() => {
    let currentUrl: string | null = null;

    if (selectedInvoice) {
      let isMounted = true;
      const loadPreview = async () => {
        setIsPreviewLoading(true);
        try {
          const res = await fetch("/api/invoice/pdf", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(selectedInvoice),
          });
          if (res.ok) {
            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            currentUrl = url;
            if (isMounted) setPdfPreviewUrl(url);
          }
        } catch (error) {
          console.error(error);
        } finally {
          if (isMounted) setIsPreviewLoading(false);
        }
      };
      loadPreview();

      return () => {
        isMounted = false;
        if (currentUrl) window.URL.revokeObjectURL(currentUrl);
      };
    } else {
      setPdfPreviewUrl(null);
    }
  }, [selectedInvoice]);

  const downloadInvoicePDF = async (invoice: Invoice) => {
    try {
      setDownloadingInvoiceId(invoice.id);
      const res = await fetch("/api/invoice/pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(invoice),
      });

      if (!res.ok) throw new Error("Failed to generate PDF");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Invoice-${invoice.id}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Download failed:", error);
      alert("Failed to download PDF. Please try again.");
    } finally {
      setDownloadingInvoiceId(null);
    }
  };

  useEffect(() => {
    dispatch(fetchBusinesses());
    dispatch(fetchSubscriptions());
    dispatch(fetchInvoices());
  }, [dispatch]);

  // Map real business subscriptions from backend
  const realSubscriptions = businesses.map((b: any) => {
    const subPlan = b.subscription_plan;
    return {
      id: b.id,
      businessName: b.name,
      plan: subPlan?.plan || subPlan?.name || "Free Trial",
      status: subPlan?.status || b.status || "active",
      amount: subPlan?.amount ? Number(subPlan.amount) : 0,
      billingCycle: subPlan?.billing_cycle || "monthly",
      currentPeriodEnd:
        subPlan?.updated_at || b.created_at || new Date().toISOString(),
    };
  });

  const displaySubs =
    realSubscriptions.length > 0 ? realSubscriptions : mockSubscriptions;

  // Map real invoices from backend
  const realInvoices: Invoice[] = invoices.map((inv: any) => ({
    id: inv.invoice_number || inv.id,
    businessId: inv.business_id || inv.business?.id || "N/A",
    businessName: inv.business?.name || "Business Tenant",
    subscriptionId: inv.subscription_id || inv.subscription_plan_id || "N/A",
    amount: Number(inv.amount || 0),
    status: (inv.status as any) || "paid",
    issuedAt: inv.issued_at || inv.created_at || new Date().toISOString(),
    dueDate: inv.due_date || inv.created_at || new Date().toISOString(),
    downloadUrl: inv.invoice_pdf_url || inv.downloadUrl || "#",
  }));

  const displayInvoices = realInvoices.length > 0 ? realInvoices : [];

  const filteredSubs = displaySubs.filter(
    (sub) =>
      sub.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.id.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const filteredInvoices = displayInvoices.filter(
    (inv) =>
      inv.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.id.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-6 pb-12 max-w-7xl mx-auto">
      <div className="flex flex-col gap-3">
        <button
          onClick={() => router.back()}
          className="w-fit flex items-center gap-1.5 text-sm font-medium text-brand-muted hover:text-brand-dark transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-brand-dark">
              Billing & Invoices
            </h2>
            <p className="mt-1 text-sm text-brand-muted">
              Manage active subscriptions, upcoming renewals, and past invoices.
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-white/60 bg-glass-gradient backdrop-blur-xl shadow-glass overflow-hidden">
        {/* Toolbar */}
        <div className="border-b border-slate-200/50 px-6 py-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/40">
          <nav className="flex space-x-6" aria-label="Tabs">
            <button
              onClick={() => setActiveTab("subscriptions")}
              className={`whitespace-nowrap py-4 px-2 border-b-2 text-sm font-bold transition-all duration-300 ease-spring ${
                activeTab === "subscriptions"
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              Active Subscriptions ({displaySubs.length})
            </button>
            <button
              onClick={() => setActiveTab("invoices")}
              className={`whitespace-nowrap py-4 px-2 border-b-2 text-sm font-bold transition-all duration-300 ease-spring ${
                activeTab === "invoices"
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              Invoices & History ({displayInvoices.length})
            </button>
          </nav>
          <div className="relative w-full sm:w-64 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
            <input
              type="text"
              placeholder="Search by business or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm transition-all duration-300 ease-spring shadow-inset-subtle focus:border-indigo-300 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:bg-white"
            />
          </div>
        </div>

        {/* Content */}
        <div className="overflow-x-auto">
          {loading &&
          displaySubs.length === 0 &&
          displayInvoices.length === 0 ? (
            <div className="flex justify-center items-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-brand-primary" />
            </div>
          ) : activeTab === "subscriptions" ? (
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-brand-border bg-white">
                  <th className="px-6 py-4 font-semibold text-brand-muted">
                    Business
                  </th>
                  <th className="px-6 py-4 font-semibold text-brand-muted">
                    Plan
                  </th>
                  <th className="px-6 py-4 font-semibold text-brand-muted">
                    Status
                  </th>
                  <th className="px-6 py-4 font-semibold text-brand-muted">
                    Amount
                  </th>
                  <th className="px-6 py-4 font-semibold text-brand-muted">
                    Next Billing
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredSubs.map((sub) => (
                  <tr
                    key={sub.id}
                    className="hover:bg-brand-light transition-colors"
                  >
                    <td className="px-6 py-4">
                      <p className="font-semibold text-brand-dark">
                        {sub.businessName}
                      </p>
                      <p className="text-xs text-brand-placeholder font-mono mt-0.5">
                        {sub.id}
                      </p>
                    </td>
                    <td className="px-6 py-4 font-medium text-brand-muted capitalize">
                      {sub.plan}
                    </td>
                    <td className="px-6 py-4">
                      <Badge
                        variant={
                          sub.status === "active"
                            ? "success"
                            : sub.status === "past_due"
                              ? "danger"
                              : "warning"
                        }
                      >
                        {sub.status.replace("_", " ")}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 font-semibold text-brand-dark">
                      {formatCurrency(sub.amount, true)}{" "}
                      <span className="text-xs font-normal text-brand-muted capitalize">
                        /{sub.billingCycle}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-brand-muted">
                      {formatDate(sub.currentPeriodEnd)}
                    </td>
                  </tr>
                ))}
                {filteredSubs.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-12 text-center text-brand-placeholder"
                    >
                      No subscriptions found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-brand-border bg-white">
                  <th className="px-6 py-4 font-semibold text-brand-muted">
                    Invoice ID
                  </th>
                  <th className="px-6 py-4 font-semibold text-brand-muted">
                    Business
                  </th>
                  <th className="px-6 py-4 font-semibold text-brand-muted">
                    Amount
                  </th>
                  <th className="px-6 py-4 font-semibold text-brand-muted">
                    Status
                  </th>
                  <th className="px-6 py-4 font-semibold text-brand-muted">
                    Issued On
                  </th>
                  <th className="px-6 py-4 font-semibold text-brand-muted text-right">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredInvoices.map((inv) => (
                  <tr
                    key={inv.id}
                    className="hover:bg-brand-light transition-colors"
                  >
                    <td className="px-6 py-4 font-mono text-brand-dark uppercase">
                      {inv.id}
                    </td>
                    <td className="px-6 py-4 font-semibold text-brand-muted">
                      {inv.businessName}
                    </td>
                    <td className="px-6 py-4 font-semibold text-brand-dark">
                      {formatCurrency(inv.amount, true)}
                    </td>
                    <td className="px-6 py-4">
                      <Badge
                        variant={
                          inv.status === "paid"
                            ? "success"
                            : inv.status === "overdue"
                              ? "danger"
                              : "warning"
                        }
                      >
                        {inv.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-brand-muted">
                      {formatDate(inv.issuedAt)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button
                          onClick={() => setSelectedInvoice(inv)}
                          className="inline-flex items-center gap-1 text-sm font-medium text-brand-primary hover:text-brand-primaryDark transition-colors"
                        >
                          <Eye className="h-4 w-4" /> View
                        </button>
                        <button
                          onClick={() => downloadInvoicePDF(inv)}
                          disabled={downloadingInvoiceId !== null}
                          className="inline-flex items-center gap-1 text-sm font-medium text-brand-muted hover:text-brand-dark transition-colors disabled:opacity-50"
                        >
                          {downloadingInvoiceId === inv.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Download className="h-4 w-4" />
                          )}{" "}
                          PDF
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredInvoices.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-12 text-center text-brand-placeholder"
                    >
                      No invoices found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Invoice Details Modal */}
      <Modal
        isOpen={!!selectedInvoice}
        onClose={() => setSelectedInvoice(null)}
        title="Invoice Preview"
        size="4xl"
      >
        {selectedInvoice && (
          <div className="flex flex-col h-[70vh] -mx-6 -mb-6 -mt-4 bg-slate-100/50 rounded-b-3xl overflow-hidden relative">
            <div className="flex-1 w-full h-full relative">
              {isPreviewLoading ? (
                <div className="absolute inset-0 flex flex-col justify-center items-center bg-white/50 backdrop-blur-sm z-10">
                  <Loader2 className="h-8 w-8 animate-spin text-brand-primary mb-2" />
                  <p className="text-sm font-medium text-brand-muted">
                    Generating PDF preview...
                  </p>
                </div>
              ) : pdfPreviewUrl ? (
                <iframe
                  src={pdfPreviewUrl}
                  className="w-full h-full border-0"
                  title="Invoice PDF"
                />
              ) : (
                <div className="absolute inset-0 flex justify-center items-center bg-white">
                  <p className="text-sm font-medium text-red-500">
                    Failed to load PDF preview.
                  </p>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-brand-border bg-white flex justify-end gap-3 shrink-0">
              <button
                onClick={() => setSelectedInvoice(null)}
                className="px-6 py-2 rounded-xl border border-brand-border text-sm font-semibold text-brand-dark hover:bg-slate-50 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => downloadInvoicePDF(selectedInvoice)}
                disabled={downloadingInvoiceId !== null || isPreviewLoading}
                className="px-6 py-2 rounded-xl bg-brand-primary text-white text-sm font-bold hover:bg-brand-primaryDark transition-all shadow-md flex items-center gap-2 disabled:opacity-50"
              >
                {downloadingInvoiceId === selectedInvoice.id ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Download className="h-4 w-4" />
                )}
                {downloadingInvoiceId === selectedInvoice.id
                  ? "Generating..."
                  : "Download PDF"}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
