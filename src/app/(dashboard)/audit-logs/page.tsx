'use client';
/* eslint-disable @typescript-eslint/no-unused-vars */

import { useState } from 'react';
import { mockAuditLogs } from '@/lib/mock/audit-logs';
import { AuditLog } from '@/types';
import { AuditLogTable } from '@/app/(dashboard)/audit-logs/_components/AuditLogTable';
import { AuditLogViewer } from '@/app/(dashboard)/audit-logs/_components/AuditLogViewer';
import { StatsCard } from '@/components/ui/StatsCard';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { ActivitySquare, ShieldAlert, ShieldX, Filter, Search, Download } from 'lucide-react';

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>(mockAuditLogs);
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState('all');
  
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  // Filters
  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      log.eventId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.recordName && log.recordName.toLowerCase().includes(searchTerm.toLowerCase()));
      
    const matchesSeverity = severityFilter === 'all' || log.severity === severityFilter;

    return matchesSearch && matchesSeverity;
  });

  // KPIs
  const totalEvents = logs.length;
  const criticalEvents = logs.filter(l => l.severity === 'critical').length;
  const failedLogins = logs.filter(l => l.category === 'Security' && l.status === 'failed').length;

  const handleViewDetails = (log: AuditLog) => {
    setSelectedLog(log);
    setIsViewerOpen(true);
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-brand-dark">Audit Logs</h2>
          <p className="mt-1 text-sm text-brand-muted">
            Immutable record of all critical system activities and security events.
          </p>
        </div>
        <Button variant="outline" className="gap-2 bg-white">
          <Download className="h-4 w-4" /> Export Report
        </Button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatsCard title="Total Events (Today)" value={totalEvents} icon={<ActivitySquare className="h-5 w-5 text-indigo-500" />} />
        <StatsCard title="Critical Alerts" value={criticalEvents} icon={<ShieldAlert className="h-5 w-5 text-red-500" />} />
        <StatsCard title="Failed Authentication" value={failedLogins} icon={<ShieldX className="h-5 w-5 text-orange-500" />} />
      </div>

      <div className="rounded-2xl border border-brand-border bg-white shadow-sm p-6 space-y-4">
        {/* Filters Toolbar */}
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between w-full">
          <div className="w-full lg:w-96 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-placeholder" />
            <input
              type="text"
              placeholder="Search by event ID, action, user or record..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-brand-border text-sm focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary"
            />
          </div>
          <div className="flex w-full lg:w-auto gap-3 items-center">
            <div className="w-full sm:w-48">
              <Select
                value={severityFilter}
                onChange={(e) => setSeverityFilter(e.target.value)}
                options={[
                  { label: 'All Severities', value: 'all' },
                  { label: 'Info', value: 'info' },
                  { label: 'Warning', value: 'warning' },
                  { label: 'Critical', value: 'critical' },
                ]}
              />
            </div>
            <Button variant="outline" className="justify-center px-3">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <AuditLogTable logs={filteredLogs} onViewDetails={handleViewDetails} />
      </div>

      <AuditLogViewer 
        log={selectedLog} 
        isOpen={isViewerOpen} 
        onClose={() => setIsViewerOpen(false)} 
      />
    </div>
  );
}
