import { Business } from "@/types";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { PlanBadge } from "@/app/(dashboard)/businesses/[id]/page";
import { formatCurrency, formatDate } from "@/lib/utils";

export function SubscriptionTab({ business }: { business: Business }) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300 ease-spring">
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
              <PlanBadge plan={business.subscription.plan} />
              {business.subscription.autoRenew && <span className="text-xs text-brand-success bg-brand-success/10 px-2 py-0.5 rounded-full">Auto-renew</span>}
            </div>
          </div>
          <div>
            <p className="text-xs text-brand-placeholder mb-1">Renewal Date</p>
            <p className="font-medium text-brand-dark">{formatDate(business.subscription.endsAt)}</p>
          </div>
          <div>
            <p className="text-xs text-brand-placeholder mb-1">Monthly MRR</p>
            <p className="font-medium text-brand-dark">{formatCurrency(business.stats.revenueMTD)}</p>
          </div>
        </div>
      </Card>

      <Card>
        <h3 className="text-sm font-bold text-brand-dark mb-4">Resource Limits & Usage</h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-brand-muted">Branches ({business.stats.branches} / 5)</span>
              <span className="font-medium text-brand-dark">{(business.stats.branches / 5 * 100)}%</span>
            </div>
            <div className="h-2 w-full bg-brand-border rounded-full overflow-hidden">
              <div className="h-full bg-brand-info" style={{ width: `${(business.stats.branches / 5 * 100)}%` }} />
            </div>
          </div>
          
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-brand-muted">Staff Users ({business.stats.users} / 50)</span>
              <span className="font-medium text-brand-dark">{(business.stats.users / 50 * 100)}%</span>
            </div>
            <div className="h-2 w-full bg-brand-border rounded-full overflow-hidden">
              <div className="h-full bg-brand-success" style={{ width: `${(business.stats.users / 50 * 100)}%` }} />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
