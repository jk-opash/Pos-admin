'use client';
/* eslint-disable @typescript-eslint/no-unused-vars */

import { StatsCard } from '@/components/ui/StatsCard';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { CreditCard, Users, Store, ArrowUpRight, TrendingUp, AlertCircle, FileText } from 'lucide-react';
import Link from 'next/link';
import { mockSubscriptions, mockInvoices } from '@/lib/mock/subscriptions';

export default function SubscriptionsDashboard() {
  const activeSubs = mockSubscriptions.filter(s => s.status === 'active').length;
  const overdueSubs = mockSubscriptions.filter(s => s.status === 'past_due').length;
  
  // Dummy calculations for revenue
  const mrr = 975000;
  const arr = mrr * 12;

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-brand-dark">Subscriptions Dashboard</h1>
          <p className="mt-1 text-sm text-brand-muted">
            Overview of SaaS revenue, active subscriptions, and billing health.
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/subscriptions/plans">
            <Button variant="outline" className="gap-2">
              <Store className="h-4 w-4" /> Manage Plans
            </Button>
          </Link>
          <Link href="/subscriptions/billing">
            <Button className="gap-2">
              <FileText className="h-4 w-4" /> View Invoices
            </Button>
          </Link>
        </div>
      </div>

      {/* Primary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Monthly Revenue (MRR)"
          value={`₹${(mrr / 100000).toFixed(2)}L`}
          icon={<TrendingUp className="h-5 w-5" />}
          trend={{ value: 12, label: 'vs last month', positive: true }}
        />
        <StatsCard
          title="Annual Revenue (ARR)"
          value={`₹${(arr / 10000000).toFixed(2)}Cr`}
          icon={<CreditCard className="h-5 w-5" />}
          trend={{ value: 15, label: 'vs last year', positive: true }}
        />
        <StatsCard
          title="Active Subscriptions"
          value={activeSubs}
          icon={<Users className="h-5 w-5" />}
          trend={{ value: 5, label: 'new this week', positive: true }}
        />
        <StatsCard
          title="Trial Businesses"
          value={145}
          icon={<Store className="h-5 w-5" />}
          trend={{ value: 12, label: 'converted recently', positive: true }}
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 flex items-center gap-4">
          <div className="rounded-full bg-amber-100 p-3">
            <AlertCircle className="h-6 w-6 text-amber-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-amber-800">Past Due Subscriptions</p>
            <p className="text-2xl font-bold text-amber-900">{overdueSubs}</p>
          </div>
        </div>
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 flex items-center gap-4">
          <div className="rounded-full bg-blue-100 p-3">
            <TrendingUp className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-blue-800">Upcoming Renewals (30d)</p>
            <p className="text-2xl font-bold text-blue-900">42</p>
          </div>
        </div>
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 flex items-center gap-4">
          <div className="rounded-full bg-red-100 p-3">
            <TrendingUp className="h-6 w-6 text-red-600 rotate-180" />
          </div>
          <div>
            <p className="text-sm font-medium text-red-800">Cancelled Plans</p>
            <p className="text-2xl font-bold text-red-900">25</p>
          </div>
        </div>
      </div>

      {/* Main Charts & Lists Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <h3 className="text-lg font-bold text-brand-dark mb-4">Revenue Growth</h3>
          <div className="h-64 flex items-end justify-between gap-2 px-2">
            {/* Dummy Bar Chart */}
            {[45, 52, 48, 61, 59, 75, 82, 88, 85, 95, 105, 115].map((val, i) => (
              <div key={i} className="w-full bg-brand-primaryLight rounded-t-md hover:bg-indigo-200 transition-colors relative group" style={{ height: `${(val / 120) * 100}%` }}>
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-brand-dark text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  ₹{val}k
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-4 text-xs font-medium text-brand-placeholder px-2 uppercase">
            <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
            <span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span>
          </div>
        </Card>

        <Card>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <h3 className="text-lg font-bold text-brand-dark">Recent Invoices</h3>
            <Link href="/subscriptions/billing" className="text-sm text-brand-primary font-medium hover:underline">
              View All
            </Link>
          </div>
          <div className="space-y-4">
            {mockInvoices.slice(0, 5).map(inv => (
              <div key={inv.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-3 rounded-lg border border-brand-border hover:bg-brand-light transition-colors">
                <div>
                  <p className="font-semibold text-brand-dark text-sm">{inv.businessName}</p>
                  <p className="text-xs text-brand-muted mt-0.5">Inv: {inv.id.toUpperCase()}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-brand-dark text-sm">₹{inv.amount.toLocaleString()}</p>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    inv.status === 'paid' ? 'bg-emerald-100 text-emerald-700' :
                    inv.status === 'overdue' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {inv.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
