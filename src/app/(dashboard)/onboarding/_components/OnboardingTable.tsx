/* eslint-disable @typescript-eslint/no-unused-vars */
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Edit, Eye, Play } from 'lucide-react';
import type { OnboardingRequest, OnboardingStatus } from '@/types';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';

interface Props {
  requests: OnboardingRequest[];
}

const statusConfig: Record<OnboardingStatus, { label: string; variant: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'muted' }> = {
  draft:          { label: 'Draft',          variant: 'muted' },
  pending_review: { label: 'Pending Review', variant: 'warning' },
  approved:       { label: 'Approved',       variant: 'success' },
  rejected:       { label: 'Rejected',       variant: 'danger' },
  provisioning:   { label: 'Provisioning',   variant: 'info' },
  completed:      { label: 'Completed',      variant: 'default' },
};

export function OnboardingTable({ requests }: Props) {
  if (requests.length === 0) {
    return (
      <div className="flex h-48 flex-col items-center justify-center text-center border border-dashed border-brand-border rounded-xl">
        <p className="text-sm font-medium text-brand-dark">No onboarding requests found</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-brand-border">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-brand-border bg-brand-light">
            <th className="px-4 py-3 text-xs font-semibold text-brand-muted uppercase tracking-wide">Business</th>
            <th className="px-4 py-3 text-xs font-semibold text-brand-muted uppercase tracking-wide">Industry</th>
            <th className="px-4 py-3 text-xs font-semibold text-brand-muted uppercase tracking-wide">Status</th>
            <th className="px-4 py-3 text-xs font-semibold text-brand-muted uppercase tracking-wide">Progress</th>
            <th className="px-4 py-3 text-xs font-semibold text-brand-muted uppercase tracking-wide">Started</th>
            <th className="px-4 py-3 text-xs font-semibold text-brand-muted uppercase tracking-wide text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {requests.map(req => {
            const sc = statusConfig[req.status];
            return (
              <tr key={req.id} className="hover:bg-brand-light transition-colors">
                <td className="px-4 py-3.5">
                  <div>
                    <p className="font-semibold text-brand-dark">{req.businessName || 'Unnamed Business'}</p>
                    <p className="text-xs text-brand-placeholder mt-0.5">{req.ownerName} · {req.ownerEmail}</p>
                  </div>
                </td>
                <td className="px-4 py-3.5">
                  <span className="text-brand-muted">{req.industry || 'Not Selected'}</span>
                </td>
                <td className="px-4 py-3.5">
                  <Badge variant={sc.variant} dot>{sc.label}</Badge>
                </td>
                <td className="px-4 py-3.5">
                  <div className="flex flex-col gap-1 w-32">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-brand-muted">Step {req.currentStep} of {req.totalSteps}</span>
                      <span className="text-brand-dark">{req.completionPercentage}%</span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-brand-border">
                      <div
                        className="h-full rounded-full bg-brand-primary transition-all"
                        style={{ width: `${req.completionPercentage}%` }}
                      />
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3.5 text-brand-muted whitespace-nowrap">
                  {formatDate(req.startedAt)}
                </td>
                <td className="px-4 py-3.5 text-right">
                  {req.status === 'draft' ? (
                    <Link href={`/onboarding/new`}>
                      <Button variant="outline" size="sm" className="gap-1.5 border-brand-primary text-brand-primary hover:bg-brand-primaryLight">
                        <Play className="h-3.5 w-3.5" /> Resume
                      </Button>
                    </Link>
                  ) : (
                    <Button variant="outline" size="sm" className="gap-1.5">
                      <Eye className="h-3.5 w-3.5" /> View
                    </Button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
