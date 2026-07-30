'use client';

import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateUserSettings } from "@/store/slices/authSlice";
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Save, FileText } from 'lucide-react';
import api from "@/lib/axios";

export function InvoiceSettings() {
  const user = useSelector((state: any) => state.auth.user);

  const [invoiceData, setInvoiceData] = useState({
    businessName: user?.invoice_data?.businessName || "",
    taxVatNumber: user?.invoice_data?.taxVatNumber || "",
    billingAddress: user?.invoice_data?.billingAddress || "",
    contactEmail: user?.invoice_data?.contactEmail || "",
    contactPhone: user?.invoice_data?.contactPhone || "",
    invoicePrefix: user?.invoice_data?.invoicePrefix || "",
    nextInvoiceNumber: user?.invoice_data?.nextInvoiceNumber || "",
    termsConditions: user?.invoice_data?.termsConditions || "",
    footerNotes: user?.invoice_data?.footerNotes || "",
  });
  const [isSaving, setIsSaving] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    if (user && user.invoice_data) {
      setInvoiceData(user.invoice_data);
    }
  }, [user]);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await api.put("/auth/superadmin/settings", {
        invoice_data: invoiceData,
      });
      dispatch(updateUserSettings({ invoice_data: invoiceData }));
      alert("Invoice settings updated successfully!");
    } catch (error) {
      console.error("Failed to update settings", error);
      alert("Failed to update settings");
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setInvoiceData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-brand-dark">Invoice Settings</h2>
        <p className="mt-1 text-sm text-brand-muted">
          Manage how your invoices appear to customers, including company details and terms.
        </p>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-bold text-brand-dark mb-4 pb-2 border-b border-brand-border">Company Details on Invoice</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-medium text-brand-muted mb-1.5 block">Business Name</label>
            <Input name="businessName" value={invoiceData.businessName} onChange={handleChange} />
          </div>
          <div>
            <label className="text-sm font-medium text-brand-muted mb-1.5 block">Tax / VAT Number</label>
            <Input name="taxVatNumber" value={invoiceData.taxVatNumber} onChange={handleChange} />
          </div>
          <div className="md:col-span-2">
            <label className="text-sm font-medium text-brand-muted mb-1.5 block">Billing Address</label>
            <textarea 
              name="billingAddress"
              value={invoiceData.billingAddress}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              rows={3}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-brand-muted mb-1.5 block">Contact Email</label>
            <Input name="contactEmail" value={invoiceData.contactEmail} onChange={handleChange} type="email" />
          </div>
          <div>
            <label className="text-sm font-medium text-brand-muted mb-1.5 block">Contact Phone</label>
            <Input name="contactPhone" value={invoiceData.contactPhone} onChange={handleChange} />
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-bold text-brand-dark mb-4 pb-2 border-b border-brand-border">Invoice Configuration</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-medium text-brand-muted mb-1.5 block">Invoice Prefix</label>
            <Input name="invoicePrefix" value={invoiceData.invoicePrefix} onChange={handleChange} />
          </div>
          <div>
            <label className="text-sm font-medium text-brand-muted mb-1.5 block">Next Invoice Number</label>
            <Input name="nextInvoiceNumber" value={invoiceData.nextInvoiceNumber} onChange={handleChange} type="number" />
          </div>
          <div className="md:col-span-2">
            <label className="text-sm font-medium text-brand-muted mb-1.5 block">Terms & Conditions</label>
            <textarea 
              name="termsConditions"
              value={invoiceData.termsConditions}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              rows={4}
            />
          </div>
          <div className="md:col-span-2">
            <label className="text-sm font-medium text-brand-muted mb-1.5 block">Footer Notes</label>
            <textarea 
              name="footerNotes"
              value={invoiceData.footerNotes}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              rows={2}
            />
          </div>
        </div>
      </Card>

      <div className="flex justify-end pt-4 gap-3">
        <Button variant="outline" className="gap-2">
          <FileText className="h-4 w-4" /> Preview Invoice
        </Button>
        <Button onClick={handleSave} disabled={isSaving} className="bg-brand-primary hover:bg-brand-primaryDark text-white gap-2">
          <Save className="h-4 w-4" /> {isSaving ? "Saving..." : "Save Invoice Settings"}
        </Button>
      </div>
    </div>
  );
}
