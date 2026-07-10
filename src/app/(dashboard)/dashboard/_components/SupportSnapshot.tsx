"use client";

import {
  LifeBuoy,
  AlertCircle,
  Clock,
  Star,
  CheckCircle2,
  Ticket,
} from "lucide-react";

export function SupportSnapshot({
  metrics,
}: {
  metrics: {
    openTickets: number;
    closedTickets: number;
    pendingTickets: number;
    highPriority: number;
    avgResolutionTimeHours: number;
    csatScore: number;
  };
}) {
  return (
    <div className="bg-white border border-brand-border rounded-xl p-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-base font-semibold text-brand-dark">
            Support Center Snapshot
          </h3>
          <p className="text-sm text-brand-muted">
            Current helpdesk operations
          </p>
        </div>
        <div className="h-10 w-10 bg-indigo-50 rounded-full flex items-center justify-center">
          <LifeBuoy className="h-5 w-5 text-indigo-600" />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {/* Open Tickets */}
        <div className="border border-brand-border rounded-xl p-4 bg-brand-light">
          <div className="flex items-center gap-2 mb-2">
            <Ticket className="h-4 w-4 text-brand-muted" />
            <span className="text-xs font-semibold text-brand-muted uppercase tracking-wider">
              Open Tickets
            </span>
          </div>
          <p className="text-2xl font-bold text-brand-dark">
            {metrics.openTickets}
          </p>
        </div>

        {/* High Priority */}
        <div className="border border-red-100 rounded-xl p-4 bg-red-50">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="h-4 w-4 text-red-500" />
            <span className="text-xs font-semibold text-red-700 uppercase tracking-wider">
              High Priority
            </span>
          </div>
          <p className="text-2xl font-bold text-red-700">
            {metrics.highPriority}
          </p>
        </div>

        {/* Pending */}
        <div className="border border-amber-100 rounded-xl p-4 bg-amber-50">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="h-4 w-4 text-amber-500" />
            <span className="text-xs font-semibold text-amber-700 uppercase tracking-wider">
              Pending Reply
            </span>
          </div>
          <p className="text-2xl font-bold text-amber-700">
            {metrics.pendingTickets}
          </p>
        </div>

        {/* Resolved */}
        <div className="border border-emerald-100 rounded-xl p-4 bg-emerald-50">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">
              Resolved
            </span>
          </div>
          <p className="text-2xl font-bold text-emerald-700">
            {metrics.closedTickets}
          </p>
        </div>

        {/* Avg Resolution Time */}
        <div className="border border-brand-border rounded-xl p-4 bg-white">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="h-4 w-4 text-brand-info" />
            <span className="text-xs font-semibold text-brand-muted uppercase tracking-wider">
              Avg Resolution
            </span>
          </div>
          <p className="text-2xl font-bold text-brand-dark">
            {metrics.avgResolutionTimeHours}
            <span className="text-sm font-normal text-brand-muted ml-1">
              hrs
            </span>
          </p>
        </div>

        {/* CSAT */}
        <div className="border border-brand-border rounded-xl p-4 bg-white">
          <div className="flex items-center gap-2 mb-2">
            <Star className="h-4 w-4 text-brand-warning" />
            <span className="text-xs font-semibold text-brand-muted uppercase tracking-wider">
              CSAT Score
            </span>
          </div>
          <div className="flex items-baseline gap-1">
            <p className="text-2xl font-bold text-brand-dark">
              {metrics.csatScore}
            </p>
            <p className="text-sm text-brand-muted">/ 5.0</p>
          </div>
        </div>
      </div>
    </div>
  );
}
