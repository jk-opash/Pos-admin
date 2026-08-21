'use client';
/* eslint-disable @typescript-eslint/no-unused-vars */

import { useState, useEffect } from 'react';
import { AuditLog } from '@/types';
import { AuditLogTable } from '@/app/(dashboard)/audit-logs/_components/AuditLogTable';
import { AuditLogViewer } from '@/app/(dashboard)/audit-logs/_components/AuditLogViewer';
import { AuditLogFilters } from '@/app/(dashboard)/audit-logs/_components/AuditLogFilters';
import { StatsCard } from '@/components/ui/StatsCard';
import { Button } from '@/components/ui/Button';
import { Pagination } from '@/components/ui/Pagination';
import { ActivitySquare, ShieldAlert, ShieldX, Download } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchAuditLogs } from '@/store/slices/auditLogSlice';

export default function AuditLogsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  const dispatch = useAppDispatch();
  const { logs, loading: isLoading } = useAppSelector((state) => state.auditLog);
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (user?.role === 'superadmin') {
      dispatch(fetchAuditLogs({ actorRole: 'superadmin' }));
    }
  }, [dispatch, user]);

  if (user?.role !== 'superadmin') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <ShieldX className="h-16 w-16 text-red-500" />
        <h2 className="text-2xl font-bold text-brand-dark">Access Denied</h2>
        <p className="text-brand-muted max-w-md text-center">
          You do not have the required permissions to view audit logs. This area is restricted to super administrators.
        </p>
      </div>
    );
  }

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, severityFilter]);

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

  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
  const paginatedLogs = filteredLogs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
        <StatsCard title="Total Events (Today)" value={totalEvents.toString()} icon={<ActivitySquare className="h-5 w-5 text-indigo-500" />} />
        <StatsCard title="Critical Alerts" value={criticalEvents.toString()} icon={<ShieldAlert className="h-5 w-5 text-red-500" />} />
        <StatsCard title="Failed Authentication" value={failedLogins.toString()} icon={<ShieldX className="h-5 w-5 text-orange-500" />} />
      </div>

      <div className="rounded-2xl border border-brand-border bg-white shadow-sm p-6 space-y-4">
        {/* Filters Toolbar */}
        <AuditLogFilters 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          severityFilter={severityFilter}
          setSeverityFilter={setSeverityFilter}
        />

        {isLoading ? (
          <div className="py-16 text-center text-sm font-medium text-brand-muted">
            Loading system logs...
          </div>
        ) : (
          <>
            <AuditLogTable logs={paginatedLogs} onViewDetails={handleViewDetails} />
            <div className="mt-4">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                itemsPerPage={itemsPerPage}
                onItemsPerPageChange={(size) => {
                  setItemsPerPage(size);
                  setCurrentPage(1);
                }}
                totalItems={filteredLogs.length}
              />
            </div>
          </>
        )}
      </div>

      <AuditLogViewer 
        log={selectedLog} 
        isOpen={isViewerOpen} 
        onClose={() => setIsViewerOpen(false)} 
      />
    </div>
  );
}
