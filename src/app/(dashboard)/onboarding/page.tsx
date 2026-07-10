'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { StatsCard } from '@/components/ui/StatsCard';
import { OnboardingTable } from '@/app/(dashboard)/onboarding/_components/OnboardingTable';
import { OnboardingAnalytics } from '@/app/(dashboard)/onboarding/_components/OnboardingAnalytics';
import { mockOnboardingRequests } from '@/lib/mock/onboarding-requests';

export default function OnboardingPage() {
  const [activeTab, setActiveTab] = useState<'requests' | 'analytics'>('requests');
  const [statusFilter, setStatusFilter] = useState<'all' | 'draft' | 'pending' | 'completed'>('all');

  const stats = {
    total: mockOnboardingRequests.length,
    drafts: mockOnboardingRequests.filter(r => r.status === 'draft').length,
    pending: mockOnboardingRequests.filter(r => r.status === 'pending_review').length,
    completed: mockOnboardingRequests.filter(r => r.status === 'completed' || r.status === 'approved').length,
  };

  const filtered = mockOnboardingRequests.filter(req => {
    if (statusFilter === 'all') return true;
    if (statusFilter === 'draft') return req.status === 'draft';
    if (statusFilter === 'pending') return req.status === 'pending_review';
    if (statusFilter === 'completed') return req.status === 'completed' || req.status === 'approved';
    return true;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-brand-dark">Business Onboarding</h1>
          <p className="mt-1 text-sm text-brand-muted">
            Track and manage new business registrations and manual provisioning requests.
          </p>
        </div>
        <Link href="/onboarding/new">
          <Button className="gap-2 bg-brand-primary hover:bg-brand-primaryDark text-white border-none shadow-sm">
            <Plus className="h-4 w-4" /> New Business
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Requests"
          value={stats.total}
          icon={<UserPlus className="h-5 w-5" />}
          trend={{ value: 12, label: 'this month', positive: true }}
        />
        <StatsCard
          title="Drafts"
          value={stats.drafts}
          icon={<span className="text-brand-placeholder font-bold text-lg">✎</span>}
          trend={{ value: 3, label: 'abandoned', positive: false }}
        />
        <StatsCard
          title="Pending Review"
          value={stats.pending}
          icon={<span className="text-amber-500 font-bold text-lg">⚠</span>}
          trend={{ value: 1, label: 'needs action', positive: false }}
        />
        <StatsCard
          title="Successfully Provisioned"
          value={stats.completed}
          icon={<span className="text-emerald-500 font-bold text-lg">✓</span>}
          trend={{ value: 8, label: 'this month', positive: true }}
        />
      </div>

      {/* Top Level Tabs (Requests vs Analytics) */}
      <div className="flex space-x-6 border-b border-brand-border mb-6">
        <button
          onClick={() => setActiveTab('requests')}
          className={`py-3 px-1 border-b-2 text-sm font-semibold transition-colors ${
            activeTab === 'requests' ? 'border-brand-primary text-brand-primary' : 'border-transparent text-brand-muted hover:text-brand-dark'
          }`}
        >
          Registration Requests
        </button>
        <button
          onClick={() => setActiveTab('analytics')}
          className={`py-3 px-1 border-b-2 text-sm font-semibold transition-colors ${
            activeTab === 'analytics' ? 'border-brand-primary text-brand-primary' : 'border-transparent text-brand-muted hover:text-brand-dark'
          }`}
        >
          Onboarding Analytics
        </button>
      </div>

      {activeTab === 'requests' ? (
        <div className="rounded-2xl border border-brand-border bg-white shadow-sm overflow-hidden">
          {/* Status Filter Tabs */}
          <div className="border-b border-brand-border px-6">
            <nav className="-mb-px flex space-x-6">
              {(['all', 'draft', 'pending', 'completed'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setStatusFilter(tab)}
                  className={`whitespace-nowrap py-4 px-1 border-b-2 text-sm font-medium transition-colors capitalize ${
                    statusFilter === tab
                      ? 'border-brand-dark text-brand-dark'
                      : 'border-transparent text-brand-muted hover:text-brand-dark'
                  }`}
                >
                  {tab === 'pending' ? 'Pending Review' : tab}
                </button>
              ))}
            </nav>
          </div>

          {/* Table */}
          <div className="p-6">
            <OnboardingTable requests={filtered} />
          </div>
        </div>
      ) : (
        <OnboardingAnalytics />
      )}
    </div>
  );
}
