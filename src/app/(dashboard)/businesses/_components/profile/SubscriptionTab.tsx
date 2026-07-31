import { Business } from "@/types";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { PlanBadge } from "@/app/(dashboard)/businesses/[id]/page";
import { formatCurrency, formatDate } from "@/lib/utils";
import { useAppSelector } from "@/store/hooks";
import { FileText, Download, CheckCircle2, Clock, AlertCircle } from "lucide-react";

export function SubscriptionTab({ business }: { business: Business }) {
  const { currentBusiness } = useAppSelector((state) => state.business);
  const subPlan = currentBusiness?.subscription_plan;
  const invoices = currentBusiness?.invoices || [];

  // Use API values with fallback to business defaults
  const planSlug = (subPlan?.plan || business.subscription.plan) as any;
  
  const baseBranches = subPlan?.max_branches ?? business.subscription.maxBranches ?? 5;
  const baseUsers = subPlan?.max_team_members ?? business.subscription.maxUsers ?? 50;
  const extraBranches = currentBusiness?.extra_branches || 0;
  const extraUsers = currentBusiness?.extra_team_members || 0;
  
  const maxBranches = baseBranches + extraBranches;
  const maxUsers = baseUsers + extraUsers;
  const mrrAmount = subPlan?.amount ? Number(subPlan.amount) : business.stats.revenueMTD;
  const renewalDate = subPlan?.updated_at || business.subscription.endsAt;
  const isAutoRenew = subPlan?.auto_renew ?? business.subscription.autoRenew;

  const branchPercentage = Math.min(Math.round((business.stats.branches / (maxBranches || 1)) * 100), 100);
  const userPercentage = Math.min(Math.round((business.stats.users / (maxUsers || 1)) * 100), 100);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300 ease-spring">
      {/* Current Subscription Plan */}
      <Card>
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-lg font-bold text-brand-dark">Current Subscription</h3>
            <p className="text-sm text-brand-muted mt-1">Manage your plan and billing details.</p>
          </div>
          <Button variant="outline">Change Plan</Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-brand-border">
          <div>
            <p className="text-xs text-brand-placeholder mb-1">Plan</p>
            <div className="flex items-center gap-2">
              <PlanBadge plan={planSlug} />
              {isAutoRenew && <span className="text-xs text-brand-success bg-brand-success/10 px-2 py-0.5 rounded-full">Auto-renew</span>}
            </div>
          </div>
          <div>
            <p className="text-xs text-brand-placeholder mb-1">Renewal Date</p>
            <p className="font-medium text-brand-dark">{formatDate(renewalDate)}</p>
          </div>
          <div>
            <p className="text-xs text-brand-placeholder mb-1">Monthly MRR</p>
            <p className="font-medium text-brand-dark">{formatCurrency(mrrAmount)}</p>
          </div>
        </div>
      </Card>

      {/* Resource Limits & Usage */}
      <Card>
        <h3 className="text-sm font-bold text-brand-dark mb-4">Resource Limits & Usage</h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-brand-muted">Branches ({business.stats.branches} / {maxBranches})</span>
              <span className="font-medium text-brand-dark">{branchPercentage}%</span>
            </div>
            <div className="h-2 w-full bg-brand-border rounded-full overflow-hidden">
              <div className="h-full bg-brand-info" style={{ width: `${branchPercentage}%` }} />
            </div>
          </div>
          
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-brand-muted">Staff Users ({business.stats.users} / {maxUsers})</span>
              <span className="font-medium text-brand-dark">{userPercentage}%</span>
            </div>
            <div className="h-2 w-full bg-brand-border rounded-full overflow-hidden">
              <div className="h-full bg-brand-success" style={{ width: `${userPercentage}%` }} />
            </div>
          </div>
        </div>
      </Card>

      {/* Billing & Invoices */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-brand-primary" />
            <h3 className="text-lg font-bold text-brand-dark">Subscription Invoices ({invoices.length})</h3>
          </div>
        </div>

        <div className="border border-brand-border rounded-xl overflow-hidden shadow-xs">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-brand-muted border-b border-brand-border">
              <tr>
                <th className="px-4 py-3 font-semibold">Invoice Number</th>
                <th className="px-4 py-3 font-semibold">Date Issued</th>
                <th className="px-4 py-3 font-semibold">Due Date</th>
                <th className="px-4 py-3 font-semibold">Amount</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border/60 bg-white">
              {invoices.length > 0 ? (
                invoices.map((inv: any) => (
                  <tr key={inv.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-3.5 font-semibold font-mono text-brand-dark">
                      {inv.invoice_number}
                    </td>
                    <td className="px-4 py-3.5 text-brand-muted">
                      {formatDate(inv.issued_at || inv.created_at)}
                    </td>
                    <td className="px-4 py-3.5 text-brand-muted">
                      {formatDate(inv.due_date)}
                    </td>
                    <td className="px-4 py-3.5 font-medium text-brand-dark">
                      {formatCurrency(Number(inv.amount || 0))}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        inv.status === "paid"
                          ? "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20"
                          : inv.status === "overdue"
                          ? "bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/20"
                          : "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20"
                      }`}>
                        {inv.status === "paid" && <CheckCircle2 className="h-3 w-3" />}
                        {inv.status === "pending" && <Clock className="h-3 w-3" />}
                        {inv.status === "overdue" && <AlertCircle className="h-3 w-3" />}
                        <span className="capitalize">{inv.status}</span>
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      {inv.download_url ? (
                        <a
                          href={inv.download_url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-brand-primary hover:underline font-medium"
                        >
                          <Download className="h-3.5 w-3.5" /> Download
                        </a>
                      ) : (
                        <button
                          onClick={() => alert(`Invoice ${inv.invoice_number} downloaded.`)}
                          className="inline-flex items-center gap-1 text-xs text-brand-primary hover:underline font-medium"
                        >
                          <Download className="h-3.5 w-3.5" /> Invoice PDF
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-brand-muted">
                    No subscription invoices generated for this business yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
