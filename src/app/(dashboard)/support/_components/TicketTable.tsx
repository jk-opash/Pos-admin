'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { SupportTicket } from '@/types';
import { formatRelativeTime } from '@/lib/utils';
import { MessageSquare, AlertCircle, Clock } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { EmptyState } from '@/components/ui/EmptyState';
import { Search } from 'lucide-react';

interface TicketTableProps {
  data: SupportTicket[];
}

export function TicketTable({ data }: TicketTableProps) {
  const router = useRouter();

  if (data.length === 0) {
    return <EmptyState icon={<Search />} title="No Tickets" message="No support tickets found." className="h-64" />;
  }

  return (
    <div className="rounded-xl border border-brand-border bg-white overflow-x-auto">
      <Table>
        <TableHeader className="bg-brand-light">
          <TableRow>
            <TableHead>Ticket Details</TableHead>
            <TableHead>Business</TableHead>
            <TableHead>Assignee</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Updated</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((ticket) => (
            <TableRow 
              key={ticket.id} 
              className="cursor-pointer hover:bg-brand-light transition-colors"
              onClick={() => router.push(`/support/${ticket.id}`)}
            >
              <TableCell>
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    {ticket.slaBreached ? (
                      <AlertCircle className="h-5 w-5 text-red-500" />
                    ) : (
                      <MessageSquare className="h-5 w-5 text-brand-placeholder" />
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold text-brand-dark max-w-sm truncate" title={ticket.subject}>
                      {ticket.subject}
                    </span>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs font-mono text-brand-primary">{ticket.ticketNumber}</span>
                      <span className="text-[10px] uppercase tracking-wider text-brand-placeholder bg-slate-100 px-1.5 py-0.5 rounded">
                        {ticket.category.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                </div>
              </TableCell>
              
              <TableCell>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-brand-dark">{ticket.businessName}</span>
                  <span className="text-xs text-brand-muted">{ticket.contactPerson}</span>
                </div>
              </TableCell>

              <TableCell>
                <span className="text-sm text-brand-muted">
                  {ticket.assignedTo || 'Unassigned'}
                </span>
              </TableCell>

              <TableCell>
                <PriorityBadge priority={ticket.priority} />
              </TableCell>
              
              <TableCell>
                <StatusBadge status={ticket.status} />
              </TableCell>
              
              <TableCell>
                <div className="flex flex-col">
                  <span className="text-xs text-brand-muted">
                    {formatRelativeTime(ticket.updatedAt)}
                  </span>
                  {ticket.slaDeadline && !ticket.slaBreached && (
                    <span className="text-[10px] text-amber-600 flex items-center gap-1 mt-0.5">
                      <Clock className="h-3 w-3" /> Due {formatRelativeTime(ticket.slaDeadline)}
                    </span>
                  )}
                  {ticket.slaBreached && (
                    <span className="text-[10px] text-red-600 font-bold mt-0.5">SLA Breached</span>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function PriorityBadge({ priority }: { priority: SupportTicket['priority'] }) {
  switch (priority) {
    case 'emergency':
    case 'critical':
      return <Badge variant="danger" className="uppercase text-[10px] font-bold">Critical</Badge>;
    case 'high':
      return <Badge variant="warning" className="uppercase text-[10px] font-bold text-amber-700 bg-amber-100">High</Badge>;
    case 'medium':
      return <Badge variant="info" className="uppercase text-[10px] font-bold">Medium</Badge>;
    case 'low':
      return <Badge variant="muted" className="uppercase text-[10px] font-bold">Low</Badge>;
    default:
      return <Badge variant="default">{priority}</Badge>;
  }
}

function StatusBadge({ status }: { status: SupportTicket['status'] }) {
  switch (status) {
    case 'open':
    case 'reopened':
      return <Badge variant="purple" dot>Open</Badge>;
    case 'in_progress':
    case 'under_investigation':
    case 'testing':
      return <Badge variant="info" dot>In Progress</Badge>;
    case 'escalated':
      return <Badge variant="danger" dot>Escalated</Badge>;
    case 'waiting_for_customer':
    case 'pending':
      return <Badge variant="warning" dot>Pending</Badge>;
    case 'resolved':
      return <Badge variant="success" dot>Resolved</Badge>;
    case 'closed':
    case 'cancelled':
      return <Badge variant="muted" dot>Closed</Badge>;
    default:
      return <Badge variant="default" dot>{status}</Badge>;
  }
}
