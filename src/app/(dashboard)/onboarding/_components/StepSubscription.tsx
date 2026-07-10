'use client';
/* eslint-disable @typescript-eslint/no-unused-vars */

import { useState } from 'react';
import { CheckCircle2, ChevronRight } from 'lucide-react';

const plans = [
  { id: 'free_trial', name: '14-Day Free Trial', price: '₹0', period: '', desc: 'Full access for 14 days, no credit card required', limits: '1 Branch, 3 Users, 1000 Products', popular: false },
  { id: 'starter', name: 'Starter', price: '₹999', period: '/month', desc: 'Perfect for single branch, growing businesses', limits: '1 Branch, 5 Users, Unlimited Products', popular: false },
  { id: 'growth', name: 'Growth', price: '₹2,499', period: '/month', desc: 'Ideal for multi-branch operations', limits: '3 Branches, 15 Users, Unlimited Products', popular: true },
  { id: 'professional', name: 'Professional', price: '₹4,999', period: '/month', desc: 'Advanced features for large scale businesses', limits: '10 Branches, Unlimited Users, API Access', popular: false },
];

export function StepSubscription() {
  const [selectedPlan, setSelectedPlan] = useState('free_trial');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-semibold text-brand-dark">Select Subscription Plan</h3>
        <p className="text-sm text-brand-muted mt-0.5">Choose a plan that fits the business needs. You can start with a trial and upgrade later.</p>
      </div>

      <div className="flex justify-center">
        <div className="inline-flex items-center rounded-lg bg-slate-100 p-1">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${billingCycle === 'monthly' ? 'bg-white text-brand-dark shadow-sm' : 'text-brand-muted hover:text-brand-dark'}`}
          >
            Monthly billing
          </button>
          <button
            onClick={() => setBillingCycle('yearly')}
            className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${billingCycle === 'yearly' ? 'bg-white text-brand-dark shadow-sm' : 'text-brand-muted hover:text-brand-dark'}`}
          >
            Annual billing <span className="ml-1 text-[10px] font-bold text-emerald-600 uppercase">Save 20%</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {plans.map(p => (
          <div
            key={p.id}
            onClick={() => setSelectedPlan(p.id)}
            className={`relative cursor-pointer rounded-2xl border-2 p-5 transition-all ${
              selectedPlan === p.id
                ? 'border-brand-primary bg-brand-primaryLight'
                : 'border-brand-border bg-white hover:border-indigo-200'
            }`}
          >
            {p.popular && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-brand-primary px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                Most Popular
              </span>
            )}
            <div className="flex justify-between items-start">
              <div>
                <h4 className={`text-lg font-bold ${selectedPlan === p.id ? 'text-brand-primaryDark' : 'text-brand-dark'}`}>{p.name}</h4>
                <p className="text-sm text-brand-muted mt-1 pr-4">{p.desc}</p>
              </div>
              <div className={`h-5 w-5 rounded-full border flex items-center justify-center shrink-0 ${selectedPlan === p.id ? 'border-brand-primary bg-brand-primary' : 'border-brand-borderHover'}`}>
                {selectedPlan === p.id && <div className="h-2 w-2 rounded-full bg-white" />}
              </div>
            </div>
            <div className="mt-4 flex items-baseline gap-1">
              <span className="text-2xl font-black text-brand-dark">{p.price}</span>
              <span className="text-sm font-medium text-brand-muted">{p.period}</span>
            </div>
            <div className="mt-4 pt-4 border-t border-brand-border">
              <p className="text-xs font-semibold text-brand-dark mb-2 uppercase tracking-wide">Included Limits</p>
              <ul className="space-y-2">
                {p.limits.split(', ').map((limit, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-sm text-brand-muted">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                    {limit}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
