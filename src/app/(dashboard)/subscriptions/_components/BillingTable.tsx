'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatDate } from '@/lib/utils';
import { Subscription } from '@/types';
import { MoreVertical } from 'lucide-react';

interface BillingTableProps {
  data: Subscription[];
}

export function BillingTable({ data }: BillingTableProps) {
  if (!data.length) {
    return (
      <div className="flex h-64 flex-col items-center justify-center rounded-xl border border-brand-border bg-white">
        <p className="text-sm text-brand-muted">No active subscriptions found.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-brand-border bg-white overflow-x-auto">
      <Table>
        <TableHeader className="bg-brand-light">
          <TableRow>
            <TableHead>Business ID</TableHead>
            <TableHead>Plan</TableHead>
            <TableHead>Billing Cycle</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Current Period</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((sub) => (
            <TableRow key={sub.id}>
              <TableCell className="font-medium text-brand-dark">
                {sub.businessId}
              </TableCell>
              
              <TableCell>
                <span className="capitalize">{sub.plan}</span>
              </TableCell>

              <TableCell>
                <span className="capitalize">{sub.billingCycle}</span>
              </TableCell>
              
              <TableCell>
                <StatusBadge status={sub.status} />
              </TableCell>
              
              <TableCell>
                <div className="flex flex-col">
                  <span className="text-sm text-brand-dark">
                    {formatDate(sub.currentPeriodStart)} - {formatDate(sub.currentPeriodEnd)}
                  </span>
                  {sub.cancelAtPeriodEnd && (
                    <span className="text-xs text-brand-danger">Cancels at end of period</span>
                  )}
                </div>
              </TableCell>
              
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function StatusBadge({ status }: { status: Subscription['status'] }) {
  switch (status) {
    case 'active':
      return <Badge variant="success" dot>Active</Badge>;
    case 'past_due':
      return <Badge variant="danger" dot>Past Due</Badge>;
    case 'canceled':
      return <Badge variant="muted" dot>Canceled</Badge>;
    case 'trialing':
      return <Badge variant="warning" dot>Trialing</Badge>;
    default:
      return <Badge variant="default" dot>{status}</Badge>;
  }
}
