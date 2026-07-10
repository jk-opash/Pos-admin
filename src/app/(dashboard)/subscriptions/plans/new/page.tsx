'use client';
/* eslint-disable @typescript-eslint/no-unused-vars */

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';

export default function NewPlanPage() {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      router.push('/subscriptions/plans');
    }, 1500);
  };

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Link href="/subscriptions/plans" className="inline-flex items-center gap-2 text-sm text-brand-muted hover:text-brand-dark mb-2 transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back to Plans
          </Link>
          <h1 className="text-2xl font-bold text-brand-dark">Create Subscription Plan</h1>
          <p className="mt-1 text-sm text-brand-muted">
            Configure limits, modules, features, and pricing for a new subscription tier.
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          <Button variant="outline" onClick={() => router.push('/subscriptions/plans')}>Cancel</Button>
          <Button onClick={handleSave} disabled={isSaving} className="gap-2 bg-brand-primary hover:bg-brand-primaryDark text-white border-none">
            {isSaving ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Save Plan
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Sidebar (Navigation / Jump Links) */}
        <div className="hidden lg:block lg:col-span-1">
          <div className="sticky top-6 space-y-1">
            <h3 className="text-xs font-bold text-brand-placeholder uppercase tracking-wider mb-4 px-3">Sections</h3>
            <a href="#basic-info" className="block px-3 py-2 text-sm font-semibold text-brand-primary bg-brand-primaryLight rounded-lg">Basic Information</a>
            <a href="#pricing" className="block px-3 py-2 text-sm font-medium text-brand-muted hover:text-brand-dark hover:bg-slate-100 rounded-lg">Pricing & Billing</a>
            <a href="#limits" className="block px-3 py-2 text-sm font-medium text-brand-muted hover:text-brand-dark hover:bg-slate-100 rounded-lg">Resource Limits</a>
            <a href="#modules" className="block px-3 py-2 text-sm font-medium text-brand-muted hover:text-brand-dark hover:bg-slate-100 rounded-lg">Module Access</a>
            <a href="#features" className="block px-3 py-2 text-sm font-medium text-brand-muted hover:text-brand-dark hover:bg-slate-100 rounded-lg">Advanced Features</a>
          </div>
        </div>

        {/* Right Content Area */}
        <div className="lg:col-span-3 space-y-8">
          
          {/* Section: Basic Info */}
          <div id="basic-info" className="rounded-2xl border border-brand-border bg-white shadow-sm overflow-hidden scroll-mt-6">
            <div className="px-6 py-4 border-b border-brand-border bg-brand-light">
              <h2 className="font-bold text-brand-dark">Basic Information</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Plan Name *" placeholder="e.g. Professional Plus" />
                <Select label="Industry *" options={[
                  { label: 'Universal (All)', value: 'Universal' },
                  { label: 'Restaurant & F&B', value: 'Restaurant' },
                  { label: 'Retail & Grocery', value: 'Retail' },
                  { label: 'Pharmacy', value: 'Pharmacy' },
                  { label: 'Salon & Spa', value: 'Salon' }
                ]} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select label="Plan Type *" options={[
                  { label: 'Paid Subscription', value: 'paid' },
                  { label: 'Free Trial', value: 'trial' },
                  { label: 'Completely Free', value: 'free' },
                  { label: 'Enterprise (Custom Pricing)', value: 'enterprise' }
                ]} />
                <Select label="Status *" options={[
                  { label: 'Active (Visible)', value: 'active' },
                  { label: 'Draft (Hidden)', value: 'draft' },
                ]} />
              </div>
              <div>
                <label className="text-sm font-medium text-brand-muted mb-1.5 block">Description</label>
                <textarea
                  className="w-full rounded-lg border border-brand-border px-3 py-2.5 text-sm text-brand-dark focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary"
                  rows={2}
                  placeholder="Brief description of who this plan is for..."
                />
              </div>
              <div className="flex items-center gap-3 p-3 bg-brand-light rounded-lg border border-brand-border">
                <input type="checkbox" id="popular" className="h-4 w-4 rounded border-brand-border text-brand-primary focus:ring-brand-primary" />
                <div>
                  <label htmlFor="popular" className="text-sm font-medium text-brand-dark">Mark as &quot;Most Popular&quot;</label>
                  <p className="text-xs text-brand-muted">Highlights this plan with a badge on the pricing page.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Section: Pricing & Billing */}
          <div id="pricing" className="rounded-2xl border border-brand-border bg-white shadow-sm overflow-hidden scroll-mt-6">
            <div className="px-6 py-4 border-b border-brand-border bg-brand-light">
              <h2 className="font-bold text-brand-dark">Pricing & Billing</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select label="Default Currency *" options={[
                  { label: 'INR (₹)', value: 'INR' },
                  { label: 'USD ($)', value: 'USD' },
                  { label: 'AED (د.إ)', value: 'AED' }
                ]} />
                <Select label="Allowed Billing Cycles *" options={[
                  { label: 'Monthly & Yearly', value: 'both' },
                  { label: 'Monthly Only', value: 'monthly' },
                  { label: 'Yearly Only', value: 'yearly' },
                  { label: 'Lifetime', value: 'lifetime' }
                ]} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Monthly Price *" type="number" placeholder="0" />
                <Input label="Yearly Price *" type="number" placeholder="0" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Free Trial Days" type="number" placeholder="0" defaultValue="14" />
                <Input label="Setup Fee (Optional)" type="number" placeholder="0" />
              </div>
              <div className="rounded-lg bg-amber-50 border border-amber-200 p-4 flex items-start gap-3 mt-2">
                <ShieldAlert className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-sm text-amber-800">
                  <strong>Enterprise Plan Pricing:</strong> For &quot;Enterprise&quot; or &quot;Custom&quot; plan types, pricing is automatically handled via manual invoices and quotes. The values entered above will be hidden from the public pricing page and display as &quot;Custom&quot;.
                </div>
              </div>
            </div>
          </div>

          {/* Section: Resource Limits */}
          <div id="limits" className="rounded-2xl border border-brand-border bg-white shadow-sm overflow-hidden scroll-mt-6">
            <div className="px-6 py-4 border-b border-brand-border bg-brand-light flex justify-between items-center">
              <h2 className="font-bold text-brand-dark">Resource Limits</h2>
              <Badge variant="muted">Use -1 for Unlimited</Badge>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <Input label="Max Branches" type="number" defaultValue="1" />
                <Input label="Max Employees / Users" type="number" defaultValue="5" />
                <Input label="Max POS Devices" type="number" defaultValue="2" />
                <Input label="Max Products / Items" type="number" defaultValue="1000" />
                <Input label="Max Customers" type="number" defaultValue="500" />
                <Input label="Max Suppliers" type="number" defaultValue="50" />
                <Input label="Max Monthly Orders/Invoices" type="number" defaultValue="1000" />
                <Input label="Max Storage (GB)" type="number" defaultValue="1" />
                <Input label="Max API Calls / Month" type="number" defaultValue="0" />
                <Input label="Max Purchase Orders" type="number" defaultValue="100" />
              </div>
            </div>
          </div>

          {/* Section: Module Access */}
          <div id="modules" className="rounded-2xl border border-brand-border bg-white shadow-sm overflow-hidden scroll-mt-6">
            <div className="px-6 py-4 border-b border-brand-border bg-brand-light">
              <h2 className="font-bold text-brand-dark">Module Access (Enable / Disable)</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { id: 'm_pos', label: 'Point of Sale (POS)' },
                  { id: 'm_inv', label: 'Inventory Management' },
                  { id: 'm_pur', label: 'Purchase Management' },
                  { id: 'm_sup', label: 'Supplier Management' },
                  { id: 'm_cust', label: 'Customer Management' },
                  { id: 'm_crm', label: 'CRM & Marketing' },
                  { id: 'm_hr', label: 'HR & Payroll' },
                  { id: 'm_rest', label: 'Restaurant & Kitchen' },
                  { id: 'm_loy', label: 'Loyalty Program' },
                  { id: 'm_acc', label: 'Accounting' },
                  { id: 'm_ana', label: 'Advanced Analytics' },
                  { id: 'm_api', label: 'Developer API Access' },
                ].map(mod => (
                  <label key={mod.id} className="flex items-start gap-3 p-3 rounded-lg border border-brand-border hover:bg-brand-light cursor-pointer transition-colors">
                    <input type="checkbox" defaultChecked={['m_pos', 'm_inv', 'm_cust'].includes(mod.id)} className="mt-0.5 h-4 w-4 rounded border-brand-border text-brand-primary focus:ring-brand-primary" />
                    <span className="text-sm font-medium text-brand-dark">{mod.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Section: Advanced Features */}
          <div id="features" className="rounded-2xl border border-brand-border bg-white shadow-sm overflow-hidden scroll-mt-6">
            <div className="px-6 py-4 border-b border-brand-border bg-brand-light">
              <h2 className="font-bold text-brand-dark">Advanced Features</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { id: 'f_off', label: 'Offline POS Mode', desc: 'Allow billing without internet' },
                  { id: 'f_bar', label: 'Barcode Generation & Scanning', desc: 'Create and scan custom product barcodes' },
                  { id: 'f_rep', label: 'Advanced Custom Reports', desc: 'Export and build custom data reports' },
                  { id: 'f_wa', label: 'WhatsApp Receipts', desc: 'Send digital receipts via WhatsApp' },
                  { id: 'f_cst', label: 'Custom Branding / White-label', desc: 'Remove platform branding from invoices' },
                  { id: 'f_wh', label: 'Webhooks', desc: 'Real-time event streaming for devs' },
                ].map(feat => (
                  <label key={feat.id} className="flex items-start gap-3 p-3 rounded-lg border border-brand-border hover:bg-brand-light cursor-pointer transition-colors">
                    <input type="checkbox" className="mt-0.5 h-4 w-4 rounded border-brand-border text-brand-primary focus:ring-brand-primary" />
                    <div>
                      <span className="text-sm font-medium text-brand-dark block">{feat.label}</span>
                      <span className="text-xs text-brand-muted">{feat.desc}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
