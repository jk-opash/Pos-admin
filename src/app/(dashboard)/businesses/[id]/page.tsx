"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { mockBusinesses } from "@/lib/mock/businesses";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { formatDate } from "@/lib/utils";
import { Building, Edit, ChevronLeft, Store, User, MapPin, BarChart3 } from "lucide-react";
import Link from "next/link";
import { BusinessStatus, SubscriptionPlanSlug, Business, BusinessType } from "@/types";

// Import Tabs
import { OverviewTab } from "@/app/(dashboard)/businesses/_components/profile/OverviewTab";
import { SubscriptionTab } from "@/app/(dashboard)/businesses/_components/profile/SubscriptionTab";
import { FeaturesTab } from "@/app/(dashboard)/businesses/_components/profile/FeaturesTab";
import { BranchesTab } from "@/app/(dashboard)/businesses/_components/profile/BranchesTab";
import { AuditTab } from "@/app/(dashboard)/businesses/_components/profile/AuditTab";
import { SettingsTab } from "@/app/(dashboard)/businesses/_components/profile/SettingsTab";

export function StatusBadge({ status }: { status: BusinessStatus }) {
  switch (status) {
    case "active": return <Badge variant="success" dot>Active</Badge>;
    case "trial": return <Badge variant="warning" dot>Trialing</Badge>;
    case "suspended": return <Badge variant="danger" dot>Suspended</Badge>;
    case "pending": return <Badge variant="info" dot>Pending KYC</Badge>;
    default: return <Badge variant="muted" dot>Deleted</Badge>;
  }
}

export function PlanBadge({ plan }: { plan: SubscriptionPlanSlug }) {
  switch (plan) {
    case "enterprise": return <Badge variant="purple">Enterprise</Badge>;
    case "professional": return <Badge variant="default">Professional</Badge>;
    case "growth": return <Badge variant="info">Growth</Badge>;
    case "starter": return <Badge variant="success">Starter</Badge>;
    default: return <Badge variant="warning">Free Trial</Badge>;
  }
}

export default function BusinessProfilePage() {
  const params = useParams();
  const id = params.id as string;

  const initialBusiness = mockBusinesses.find((b) => b.id === id);
  const [business, setBusiness] = useState<Business | undefined>(initialBusiness);
  const [isSuspended, setIsSuspended] = useState(initialBusiness?.status === "suspended");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editTab, setEditTab] = useState<'info' | 'owner' | 'location' | 'stats'>('info');
  const [activeTab, setActiveTab] = useState('overview');

  if (!business) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center text-center">
        <h1 className="text-3xl font-bold text-brand-dark">Business Not Found</h1>
        <p className="mt-2 text-brand-muted">We couldn&apos;t find a business with the ID: {id}</p>
        <Link href="/businesses" className="mt-6">
          <Button>Back to Businesses</Button>
        </Link>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'subscription', label: 'Subscription & Limits' },
    { id: 'features', label: 'Features' },
    { id: 'branches', label: 'Branches & Staff' },
    { id: 'audit', label: 'Audit & Activity' },
    { id: 'settings', label: 'Settings' },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Back Button */}
      <div>
        <Link href="/businesses" className="inline-flex items-center text-sm font-medium text-brand-muted hover:text-brand-dark transition-colors">
          <ChevronLeft className="mr-1 h-4 w-4" />
          Back to Businesses
        </Link>
      </div>

      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-brand-dark">{business.name}</h1>
            <StatusBadge status={isSuspended ? "suspended" : business.status} />
          </div>
          <p className="mt-1 flex items-center gap-2 text-sm text-brand-muted capitalize">
            <Building className="h-4 w-4" /> {business.type}
            <span className="text-brand-border">|</span>
            Joined {formatDate(business.createdAt)}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full md:w-auto">
          {isSuspended ? (
            <Button variant="primary" onClick={() => setIsSuspended(false)}>Restore Access</Button>
          ) : (
            <Button
              variant="danger"
              className="bg-red-50 text-red-600 hover:bg-red-100 border-none shadow-none"
              onClick={() => setIsSuspended(true)}
            >
              Suspend
            </Button>
          )}
          <Button variant="outline" className="gap-2" onClick={() => setIsEditModalOpen(true)}>
            <Edit className="h-4 w-4" /> Edit
          </Button>
          <Button onClick={() => alert(`Redirecting to Business Panel for ${business.name}...`)}>Login as Owner</Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-brand-border">
        <nav className="-mb-px flex space-x-6 overflow-x-auto" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors
                ${activeTab === tab.id
                  ? 'border-brand-dark text-brand-dark'
                  : 'border-transparent text-brand-muted hover:text-brand-dark hover:border-brand-border'
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'overview' && <OverviewTab business={business} />}
        {activeTab === 'subscription' && <SubscriptionTab business={business} />}
        {activeTab === 'features' && <FeaturesTab business={business} />}
        {activeTab === 'branches' && <BranchesTab business={business} />}
        {activeTab === 'audit' && <AuditTab business={business} />}
        {activeTab === 'settings' && <SettingsTab business={business} />}
      </div>

      {/* Edit Modal */}
      {/* Edit Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Business Details" size="5xl">
        <div className="flex h-[650px] -mx-6 -mb-6 -mt-4 border-t border-brand-border/50">
          
          {/* Sidebar Navigation */}
          <div className="w-64 bg-slate-50/50 border-r border-brand-border/50 p-6 flex flex-col gap-2 shrink-0">
            <button 
              onClick={() => setEditTab('info')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm text-left
                ${editTab === 'info' ? 'bg-white shadow-sm border border-brand-border/60 text-brand-dark' : 'text-brand-muted hover:bg-slate-100 hover:text-brand-dark'}
              `}
            >
              <Store className={`h-4 w-4 ${editTab === 'info' ? 'text-brand-primary' : ''}`} />
              Business Info
            </button>
            <button 
              onClick={() => setEditTab('owner')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm text-left
                ${editTab === 'owner' ? 'bg-white shadow-sm border border-brand-border/60 text-brand-dark' : 'text-brand-muted hover:bg-slate-100 hover:text-brand-dark'}
              `}
            >
              <User className={`h-4 w-4 ${editTab === 'owner' ? 'text-brand-primary' : ''}`} />
              Owner Details
            </button>
            <button 
              onClick={() => setEditTab('location')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm text-left
                ${editTab === 'location' ? 'bg-white shadow-sm border border-brand-border/60 text-brand-dark' : 'text-brand-muted hover:bg-slate-100 hover:text-brand-dark'}
              `}
            >
              <MapPin className={`h-4 w-4 ${editTab === 'location' ? 'text-brand-primary' : ''}`} />
              Location & Tax
            </button>
            <button 
              onClick={() => setEditTab('stats')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm text-left
                ${editTab === 'stats' ? 'bg-white shadow-sm border border-brand-border/60 text-brand-dark' : 'text-brand-muted hover:bg-slate-100 hover:text-brand-dark'}
              `}
            >
              <BarChart3 className={`h-4 w-4 ${editTab === 'stats' ? 'text-brand-primary' : ''}`} />
              Statistics
            </button>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col relative bg-white/50 overflow-hidden">
            <div className="flex-1 p-8 overflow-y-auto pb-28">
              
              {editTab === 'info' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                  <h3 className="text-lg font-bold text-brand-dark">Business Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-xs font-bold text-brand-muted uppercase tracking-wider mb-2 block">Business Name</label>
                      <Input value={business?.name || ""} onChange={(e) => setBusiness(prev => prev ? {...prev, name: e.target.value} : prev)} />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-brand-muted uppercase tracking-wider mb-2 block">Legal Name</label>
                      <Input value={business?.legalName || ""} onChange={(e) => setBusiness(prev => prev ? {...prev, legalName: e.target.value} : prev)} />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-brand-muted uppercase tracking-wider mb-2 block">Business Type</label>
                      <select 
                        className="w-full rounded-xl border border-slate-200 bg-white/50 px-4 py-2.5 text-sm focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all capitalize"
                        value={business?.type || ""}
                        onChange={(e) => setBusiness(prev => prev ? {...prev, type: e.target.value as BusinessType} : prev)}
                      >
                        {['restaurant', 'cafe', 'retail', 'grocery', 'pharmacy', 'salon', 'hotel', 'electronics', 'clothing', 'hardware', 'bakery'].map(t => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-brand-muted uppercase tracking-wider mb-2 block">Website</label>
                      <Input value={business?.website || ""} placeholder="https://..." onChange={(e) => setBusiness(prev => prev ? {...prev, website: e.target.value} : prev)} />
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-xs font-bold text-brand-muted uppercase tracking-wider mb-2 block">Description</label>
                      <textarea 
                        className="w-full rounded-xl border border-slate-200 bg-white/50 px-4 py-3 text-sm focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all"
                        rows={3} value={business?.description || ""} onChange={(e) => setBusiness(prev => prev ? {...prev, description: e.target.value} : prev)}
                      />
                    </div>
                  </div>
                </div>
              )}

              {editTab === 'owner' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                  <h3 className="text-lg font-bold text-brand-dark">Owner Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="text-xs font-bold text-brand-muted uppercase tracking-wider mb-2 block">Owner Name</label>
                      <Input value={business?.owner.name || ""} onChange={(e) => setBusiness(prev => prev ? {...prev, owner: {...prev.owner, name: e.target.value}} : prev)} />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-brand-muted uppercase tracking-wider mb-2 block">Phone Number</label>
                      <Input value={business?.owner.phone || ""} onChange={(e) => setBusiness(prev => prev ? {...prev, owner: {...prev.owner, phone: e.target.value}} : prev)} />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-brand-muted uppercase tracking-wider mb-2 block">Email Address</label>
                      <Input value={business?.owner.email || ""} onChange={(e) => setBusiness(prev => prev ? {...prev, owner: {...prev.owner, email: e.target.value}} : prev)} />
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-xs font-bold text-brand-muted uppercase tracking-wider mb-2 block">Emergency Contact</label>
                      <Input value={business?.emergencyContact || ""} onChange={(e) => setBusiness(prev => prev ? {...prev, emergencyContact: e.target.value} : prev)} />
                    </div>
                  </div>
                </div>
              )}

              {editTab === 'location' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                  <h3 className="text-lg font-bold text-brand-dark">Location & Tax</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="text-xs font-bold text-brand-muted uppercase tracking-wider mb-2 block">Address Line 1</label>
                      <Input value={business?.address.line1 || ""} onChange={(e) => setBusiness(prev => prev ? {...prev, address: {...prev.address, line1: e.target.value}} : prev)} />
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-xs font-bold text-brand-muted uppercase tracking-wider mb-2 block">Address Line 2</label>
                      <Input value={business?.address.line2 || ""} onChange={(e) => setBusiness(prev => prev ? {...prev, address: {...prev.address, line2: e.target.value}} : prev)} />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-brand-muted uppercase tracking-wider mb-2 block">City</label>
                      <Input value={business?.address.city || ""} onChange={(e) => setBusiness(prev => prev ? {...prev, address: {...prev.address, city: e.target.value}} : prev)} />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-brand-muted uppercase tracking-wider mb-2 block">State</label>
                      <Input value={business?.address.state || ""} onChange={(e) => setBusiness(prev => prev ? {...prev, address: {...prev.address, state: e.target.value}} : prev)} />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-brand-muted uppercase tracking-wider mb-2 block">Country</label>
                      <Input value={business?.address.country || ""} onChange={(e) => setBusiness(prev => prev ? {...prev, address: {...prev.address, country: e.target.value}} : prev)} />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-brand-muted uppercase tracking-wider mb-2 block">Pincode</label>
                      <Input value={business?.address.pincode || ""} onChange={(e) => setBusiness(prev => prev ? {...prev, address: {...prev.address, pincode: e.target.value}} : prev)} />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-brand-muted uppercase tracking-wider mb-2 block">GSTIN</label>
                      <Input value={business?.gstin || ""} onChange={(e) => setBusiness(prev => prev ? {...prev, gstin: e.target.value} : prev)} />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-brand-muted uppercase tracking-wider mb-2 block">PAN</label>
                      <Input value={business?.pan || ""} onChange={(e) => setBusiness(prev => prev ? {...prev, pan: e.target.value} : prev)} />
                    </div>
                  </div>
                </div>
              )}

              {editTab === 'stats' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                  <h3 className="text-lg font-bold text-brand-dark">System Statistics (Override)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-xs font-bold text-brand-muted uppercase tracking-wider mb-2 block">Branches</label>
                      <Input type="number" value={business?.stats.branches || 0} onChange={(e) => setBusiness(prev => prev ? {...prev, stats: {...prev.stats, branches: parseInt(e.target.value) || 0}} : prev)} />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-brand-muted uppercase tracking-wider mb-2 block">Staff Users</label>
                      <Input type="number" value={business?.stats.users || 0} onChange={(e) => setBusiness(prev => prev ? {...prev, stats: {...prev.stats, users: parseInt(e.target.value) || 0}} : prev)} />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-brand-muted uppercase tracking-wider mb-2 block">Total Orders</label>
                      <Input type="number" value={business?.stats.totalOrders || 0} onChange={(e) => setBusiness(prev => prev ? {...prev, stats: {...prev.stats, totalOrders: parseInt(e.target.value) || 0}} : prev)} />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-brand-muted uppercase tracking-wider mb-2 block">MTD Revenue (₹)</label>
                      <Input type="number" value={business?.stats.revenueMTD || 0} onChange={(e) => setBusiness(prev => prev ? {...prev, stats: {...prev.stats, revenueMTD: parseInt(e.target.value) || 0}} : prev)} />
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-xs font-bold text-brand-muted uppercase tracking-wider mb-2 block">Total Lifetime Revenue (₹)</label>
                      <Input type="number" value={business?.stats.revenueTotal || 0} onChange={(e) => setBusiness(prev => prev ? {...prev, stats: {...prev.stats, revenueTotal: parseInt(e.target.value) || 0}} : prev)} />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Sticky Footer */}
            <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-brand-border/50 bg-white/70 backdrop-blur-xl flex justify-end gap-3 z-10">
              <Button variant="outline" className="bg-white hover:bg-slate-50 border-slate-200" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
              <Button className="bg-brand-primary hover:bg-brand-primaryDark text-white px-8 shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5" onClick={() => setIsEditModalOpen(false)}>
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
