'use client';

import { useState } from 'react';
import { mockSupportTickets } from '@/lib/mock/support-tickets';
import { TicketTable } from '@/app/(dashboard)/support/_components/TicketTable';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { StatsCard } from '@/components/ui/StatsCard';
import { Button } from '@/components/ui/Button';
import { Search, Filter, AlertCircle, Clock, CheckCircle2, Ticket } from 'lucide-react';

export default function SupportPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  const filteredTickets = mockSupportTickets.filter((ticket) => {
    const matchesSearch =
      ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.ticketNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Simplistic mapping for the status filter
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'open' && ['open', 'escalated', 'in_progress'].includes(ticket.status)) ||
      (statusFilter === 'resolved' && ticket.status === 'resolved') ||
      (statusFilter === 'closed' && ticket.status === 'closed');
      
    const matchesPriority = priorityFilter === 'all' || ticket.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  // Calculate KPIs
  const totalOpen = mockSupportTickets.filter(t => ['open', 'in_progress', 'escalated'].includes(t.status)).length;
  const totalBreached = mockSupportTickets.filter(t => t.slaBreached && t.status !== 'closed' && t.status !== 'resolved').length;
  const avgCsat = mockSupportTickets.filter(t => t.csatScore).reduce((acc, t) => acc + (t.csatScore || 0), 0) / 
                  (mockSupportTickets.filter(t => t.csatScore).length || 1);

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-brand-dark">Support Desk</h2>
          <p className="mt-1 text-sm text-brand-muted">
            Manage tenant issues, track SLA compliance, and monitor customer satisfaction.
          </p>
        </div>
        <Button className="bg-brand-primary hover:bg-brand-primaryDark text-white">
          + Create Ticket
        </Button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Open Tickets"
          value={totalOpen}
          icon={<Ticket className="h-5 w-5 text-blue-500" />}
        />
        <StatsCard
          title="SLA Breached"
          value={totalBreached}
          icon={<AlertCircle className={`h-5 w-5 ${totalBreached > 0 ? 'text-red-500' : 'text-emerald-500'}`} />}
          trend={totalBreached > 0 ? { value: 2, label: 'needs immediate action', positive: false } : undefined}
        />
        <StatsCard
          title="Avg Resolution Time"
          value="4.2 hrs"
          icon={<Clock className="h-5 w-5 text-amber-500" />}
          trend={{ value: 15, label: 'faster than last week', positive: true }}
        />
        <StatsCard
          title="Avg CSAT Score"
          value={`${avgCsat.toFixed(1)} / 5.0`}
          icon={<CheckCircle2 className="h-5 w-5 text-emerald-500" />}
        />
      </div>

      <div className="rounded-2xl border border-brand-border bg-white shadow-sm overflow-hidden p-6 space-y-4">
        {/* Filters Toolbar */}
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="w-full lg:w-96 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-placeholder" />
            <input
              type="text"
              placeholder="Search by subject, business or ticket number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-brand-border text-sm focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary"
            />
          </div>
          <div className="flex w-full lg:w-auto gap-3">
            <div className="w-full lg:w-40">
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                options={[
                  { label: 'All Statuses', value: 'all' },
                  { label: 'Active Issues', value: 'open' },
                  { label: 'Resolved', value: 'resolved' },
                  { label: 'Closed', value: 'closed' },
                ]}
              />
            </div>
            <div className="w-full lg:w-40">
              <Select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                options={[
                  { label: 'All Priorities', value: 'all' },
                  { label: 'Critical', value: 'critical' },
                  { label: 'High', value: 'high' },
                  { label: 'Medium', value: 'medium' },
                  { label: 'Low', value: 'low' },
                ]}
              />
            </div>
            <Button variant="outline" className="px-3">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <TicketTable data={filteredTickets} />
      </div>
    </div>
  );
}
