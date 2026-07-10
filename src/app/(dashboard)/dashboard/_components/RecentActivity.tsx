/* eslint-disable @typescript-eslint/no-unused-vars */
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { formatRelativeTime } from '@/lib/utils';
import { ActivityItem } from '@/types';
import { ArrowDownCircle, ArrowUpCircle, CheckCircle2, DollarSign, Store, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export function RecentActivity({ activities }: { activities: ActivityItem[] }) {
  if (!activities || activities.length === 0) return null;

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest platform events and actions</CardDescription>
      </CardHeader>

      <div className="flex-1 overflow-y-auto pr-2 mt-4 space-y-6">
        {activities.map((activity, index) => (
          <div key={activity.id} className="relative flex gap-4">
            {/* Timeline line */}
            {index !== activities.length - 1 && (
              <div className="absolute left-[15px] top-8 h-[calc(100%-12px)] w-px bg-[#252836]" />
            )}
            
            {/* Icon */}
            <div className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-brand-border bg-white">
              {getActivityIcon(activity.type)}
            </div>

            {/* Content */}
            <div className="flex flex-1 flex-col pb-1 pt-1.5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <span className="text-sm font-medium text-brand-dark">
                  {activity.businessName}
                </span>
                <span className="text-xs text-brand-placeholder">
                  {formatRelativeTime(activity.timestamp)}
                </span>
              </div>
              <p className="mt-1 text-xs text-brand-muted leading-relaxed">
                {activity.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function getActivityIcon(type: ActivityItem['type']) {
  switch (type) {
    case 'signup':
      return <Store className="h-4 w-4 text-brand-info" />;
    case 'upgrade':
      return <ArrowUpCircle className="h-4 w-4 text-brand-success" />;
    case 'downgrade':
      return <ArrowDownCircle className="h-4 w-4 text-brand-warning" />;
    case 'payment':
      return <DollarSign className="h-4 w-4 text-brand-dark" />;
    case 'suspend':
      return <XCircle className="h-4 w-4 text-brand-danger" />;
    case 'cancel':
      return <XCircle className="h-4 w-4 text-brand-muted" />;
    default:
      return <CheckCircle2 className="h-4 w-4 text-brand-muted" />;
  }
}
