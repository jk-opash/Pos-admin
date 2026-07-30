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
            <a href="#renewal" className="block px-3 py-2 text-sm font-medium text-brand-muted hover:text-brand-dark hover:bg-slate-100 rounded-lg">Renewal Settings</a>
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
                <Input label="Plan Name *" name="plan" placeholder="e.g. Professional" />
                <Select label="Status *" name="status" options={[
                  { label: 'Active', value: 'active' },
                  { label: 'Trialing', value: 'trialing' },
                  { label: 'Draft', value: 'draft' },
                ]} />
              </div>
            </div>
          </div>

          {/* Section: Pricing & Billing */}
          <div id="pricing" className="rounded-2xl border border-brand-border bg-white shadow-sm overflow-hidden scroll-mt-6">
            <div className="px-6 py-4 border-b border-brand-border bg-brand-light">
              <h2 className="font-bold text-brand-dark">Pricing & Billing</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Select label="Currency *" name="currency" options={[
                  { label: 'INR (₹)', value: 'INR' },
                  { label: 'USD ($)', value: 'USD' },
                  { label: 'AED (د.إ)', value: 'AED' },
                  { label: 'EUR (€)', value: 'EUR' },
                  { label: 'GBP (£)', value: 'GBP' }
                ]} />
                <Select label="Billing Cycle *" name="billing_cycle" options={[
                  { label: 'Monthly', value: 'monthly' },
                  { label: 'Quarterly', value: 'quarterly' },
                  { label: 'Yearly', value: 'yearly' }
                ]} />
                <Input label="Amount / Price *" name="amount" type="number" placeholder="0.00" />
              </div>
            </div>
          </div>

          {/* Section: Resource Limits */}
          <div id="limits" className="rounded-2xl border border-brand-border bg-white shadow-sm overflow-hidden scroll-mt-6">
            <div className="px-6 py-4 border-b border-brand-border bg-brand-light flex justify-between items-center">
              <h2 className="font-bold text-brand-dark">Resource Limits</h2>
              <Badge variant="muted">Use 0 for None</Badge>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <Input label="Max Branches" name="max_branches" type="number" defaultValue="1" />
                <Input label="Max Employees / Users" name="max_team_members" type="number" defaultValue="5" />
              </div>
            </div>
          </div>

          {/* Section: Renewal Settings */}
          <div id="renewal" className="rounded-2xl border border-brand-border bg-white shadow-sm overflow-hidden scroll-mt-6">
            <div className="px-6 py-4 border-b border-brand-border bg-brand-light">
              <h2 className="font-bold text-brand-dark">Renewal Settings</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="flex items-start gap-3 p-3 rounded-lg border border-brand-border hover:bg-brand-light cursor-pointer transition-colors">
                  <input type="checkbox" name="auto_renew" className="mt-0.5 h-4 w-4 rounded border-brand-border text-brand-primary focus:ring-brand-primary" />
                  <div>
                    <span className="text-sm font-medium text-brand-dark block">Auto Renew</span>
                    <span className="text-xs text-brand-muted">Automatically renew plan at period end</span>
                  </div>
                </label>
                <label className="flex items-start gap-3 p-3 rounded-lg border border-brand-border hover:bg-brand-light cursor-pointer transition-colors">
                  <input type="checkbox" name="cancel_at_period_end" className="mt-0.5 h-4 w-4 rounded border-brand-border text-brand-primary focus:ring-brand-primary" />
                  <div>
                    <span className="text-sm font-medium text-brand-dark block">Cancel at Period End</span>
                    <span className="text-xs text-brand-muted">Terminate subscription when cycle ends</span>
                  </div>
                </label>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
