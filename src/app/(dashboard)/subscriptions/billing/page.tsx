'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { mockSubscriptions, mockInvoices } from '@/lib/mock/subscriptions';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Search, FileText, Download, ArrowLeft, Eye } from 'lucide-react';
import { formatDate, formatCurrency } from '@/lib/utils';
import { Subscription, Invoice } from '@/types';
import { Modal } from '@/components/ui/Modal';

export default function BillingPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'subscriptions' | 'invoices'>('subscriptions');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  const filteredSubs = mockSubscriptions.filter(
    (sub) => sub.businessName.toLowerCase().includes(searchTerm.toLowerCase()) || 
             sub.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredInvoices = mockInvoices.filter(
    (inv) => inv.businessName.toLowerCase().includes(searchTerm.toLowerCase()) || 
             inv.id.toLowerCase().includes(searchTerm.toLowerCase())
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
            <h2 className="text-2xl font-bold text-brand-dark">Billing & Invoices</h2>
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
              onClick={() => setActiveTab('subscriptions')}
              className={`whitespace-nowrap py-4 px-2 border-b-2 text-sm font-bold transition-all duration-300 ease-spring ${
                activeTab === 'subscriptions'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Active Subscriptions
            </button>
            <button
              onClick={() => setActiveTab('invoices')}
              className={`whitespace-nowrap py-4 px-2 border-b-2 text-sm font-bold transition-all duration-300 ease-spring ${
                activeTab === 'invoices'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Invoices & History
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
          {activeTab === 'subscriptions' ? (
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-brand-border bg-white">
                  <th className="px-6 py-4 font-semibold text-brand-muted">Business</th>
                  <th className="px-6 py-4 font-semibold text-brand-muted">Plan</th>
                  <th className="px-6 py-4 font-semibold text-brand-muted">Status</th>
                  <th className="px-6 py-4 font-semibold text-brand-muted">Amount</th>
                  <th className="px-6 py-4 font-semibold text-brand-muted">Next Billing</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredSubs.map(sub => (
                  <tr key={sub.id} className="hover:bg-brand-light transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-brand-dark">{sub.businessName}</p>
                      <p className="text-xs text-brand-placeholder font-mono mt-0.5">{sub.id}</p>
                    </td>
                    <td className="px-6 py-4 font-medium text-brand-muted capitalize">{sub.plan}</td>
                    <td className="px-6 py-4">
                      <Badge variant={sub.status === 'active' ? 'success' : sub.status === 'past_due' ? 'danger' : 'warning'}>
                        {sub.status.replace('_', ' ')}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 font-semibold text-brand-dark">{formatCurrency(sub.amount, true)} <span className="text-xs font-normal text-brand-muted capitalize">/{sub.billingCycle}</span></td>
                    <td className="px-6 py-4 text-brand-muted">{formatDate(sub.currentPeriodEnd)}</td>
                  </tr>
                ))}
                {filteredSubs.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-brand-placeholder">No subscriptions found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-brand-border bg-white">
                  <th className="px-6 py-4 font-semibold text-brand-muted">Invoice ID</th>
                  <th className="px-6 py-4 font-semibold text-brand-muted">Business</th>
                  <th className="px-6 py-4 font-semibold text-brand-muted">Amount</th>
                  <th className="px-6 py-4 font-semibold text-brand-muted">Status</th>
                  <th className="px-6 py-4 font-semibold text-brand-muted">Issued On</th>
                  <th className="px-6 py-4 font-semibold text-brand-muted text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredInvoices.map(inv => (
                  <tr key={inv.id} className="hover:bg-brand-light transition-colors">
                    <td className="px-6 py-4 font-mono text-brand-dark uppercase">{inv.id}</td>
                    <td className="px-6 py-4 font-semibold text-brand-muted">{inv.businessName}</td>
                    <td className="px-6 py-4 font-semibold text-brand-dark">{formatCurrency(inv.amount, true)}</td>
                    <td className="px-6 py-4">
                      <Badge variant={inv.status === 'paid' ? 'success' : inv.status === 'overdue' ? 'danger' : 'warning'}>
                        {inv.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-brand-muted">{formatDate(inv.issuedAt)}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button 
                          onClick={() => setSelectedInvoice(inv)}
                          className="inline-flex items-center gap-1 text-sm font-medium text-brand-primary hover:text-brand-primaryDark transition-colors"
                        >
                          <Eye className="h-4 w-4" /> View
                        </button>
                        <button className="inline-flex items-center gap-1 text-sm font-medium text-brand-muted hover:text-brand-dark transition-colors">
                          <Download className="h-4 w-4" /> PDF
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredInvoices.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-brand-placeholder">No invoices found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Invoice Details Modal */}
      <Modal isOpen={!!selectedInvoice} onClose={() => setSelectedInvoice(null)} title="Invoice Details" size="xl">
        {selectedInvoice && (
          <div className="flex flex-col">
            <div className="p-6 pb-0 flex justify-between items-start mb-6">
              <div>
                <h3 className="text-2xl font-bold text-brand-dark mb-1">{selectedInvoice.businessName}</h3>
                <p className="text-sm font-mono text-brand-muted uppercase">INV-{selectedInvoice.id.split('-')[0]}</p>
              </div>
              <Badge variant={selectedInvoice.status === 'paid' ? 'success' : selectedInvoice.status === 'overdue' ? 'danger' : 'warning'} className="text-sm px-3 py-1">
                {selectedInvoice.status}
              </Badge>
            </div>
            
            <div className="px-6 grid grid-cols-2 gap-6 mb-8">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <p className="text-[10px] font-bold text-brand-muted uppercase tracking-widest mb-1.5">Date Issued</p>
                <p className="text-sm font-semibold text-brand-dark">{formatDate(selectedInvoice.issuedAt)}</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <p className="text-[10px] font-bold text-brand-muted uppercase tracking-widest mb-1.5">Due Date</p>
                <p className="text-sm font-semibold text-brand-dark">{formatDate(selectedInvoice.dueDate)}</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <p className="text-[10px] font-bold text-brand-muted uppercase tracking-widest mb-1.5">Subscription ID</p>
                <p className="text-sm font-mono text-brand-dark">{selectedInvoice.subscriptionId}</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col justify-center">
                <p className="text-[10px] font-bold text-brand-muted uppercase tracking-widest mb-1.5">Total Amount</p>
                <p className="text-2xl font-bold text-brand-primary">{formatCurrency(selectedInvoice.amount, true)}</p>
              </div>
            </div>

            <div className="p-6 border-t border-brand-border/50 bg-slate-50/50 flex justify-end gap-3 rounded-b-2xl">
              <button 
                onClick={() => setSelectedInvoice(null)}
                className="px-6 py-2 rounded-xl border border-brand-border text-sm font-semibold text-brand-dark hover:bg-white transition-colors"
              >
                Close
              </button>
              <button className="px-6 py-2 rounded-xl bg-brand-primary text-white text-sm font-bold hover:bg-brand-primaryDark transition-all shadow-md flex items-center gap-2">
                <Download className="h-4 w-4" /> Download PDF
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
