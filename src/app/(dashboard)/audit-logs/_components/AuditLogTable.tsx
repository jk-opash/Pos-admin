'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { AuditLog } from '@/types';
import { ShieldAlert, Info, AlertTriangle, Monitor, Smartphone, Tablet, Search, Eye } from 'lucide-react';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';

interface AuditLogTableProps {
  logs: AuditLog[];
  onViewDetails: (log: AuditLog) => void;
}

export function AuditLogTable({ logs, onViewDetails }: AuditLogTableProps) {
  if (logs.length === 0) {
    return <EmptyState icon={<Search />} title="No Logs" message="No audit logs found matching criteria." className="h-64" />;
  }

  return (
    <div className="rounded-xl border border-brand-border bg-white overflow-x-auto">
      <Table>
        <TableHeader className="bg-brand-light">
          <TableRow>
            <TableHead>Event & Time</TableHead>
            <TableHead>User & Role</TableHead>
            <TableHead>Action</TableHead>
            <TableHead>Severity</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs.map((log) => (
            <TableRow 
              key={log.id} 
              className="cursor-pointer hover:bg-brand-light transition-colors"
              onClick={() => onViewDetails(log)}
            >
              <TableCell>
                <div className="flex flex-col">
                  <span className="font-mono text-xs text-brand-dark font-semibold">{log.eventId}</span>
                  <span className="text-[11px] text-brand-muted mt-0.5">
                    {new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }).format(new Date(log.timestamp))}
                  </span>
                  <span className="text-[10px] text-brand-placeholder uppercase tracking-wider mt-0.5">{log.category}</span>
                </div>
              </TableCell>

              <TableCell>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-brand-dark">{log.username}</span>
                  <Badge variant="muted" className="text-[10px] w-fit mt-1 capitalize px-1.5 py-0">
                    {log.userRole.replace('_', ' ')}
                  </Badge>
                </div>
              </TableCell>

              <TableCell>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-brand-dark">{log.action}</span>
                  <span className="text-xs text-brand-muted mt-0.5">Mod: {log.module}</span>
                </div>
              </TableCell>

              <TableCell>
                <SeverityBadge severity={log.severity} />
                {log.status === 'failed' && (
                  <Badge variant="danger" className="text-[10px] mt-1 block w-fit">Failed</Badge>
                )}
              </TableCell>

              <TableCell className="text-right">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={(e) => { e.stopPropagation(); onViewDetails(log); }}
                  className="gap-2 text-xs font-medium bg-white text-brand-dark hover:bg-brand-light border-brand-border hover:text-brand-primary"
                >
                  <Eye className="h-3.5 w-3.5 text-brand-muted group-hover:text-brand-primary" /> View Details
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function DeviceIcon({ type }: { type: string }) {
  switch (type) {
    case 'mobile': return <Smartphone className="h-3 w-3 text-brand-muted" />;
    case 'tablet': return <Tablet className="h-3 w-3 text-brand-muted" />;
    default: return <Monitor className="h-3 w-3 text-brand-muted" />;
  }
}

function SeverityBadge({ severity }: { severity: AuditLog['severity'] }) {
  switch (severity) {
    case 'info':
      return (
        <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded text-xs font-medium">
          <Info className="h-3 w-3" /> Info
        </span>
      );
    case 'warning':
      return (
        <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded text-xs font-medium">
          <AlertTriangle className="h-3 w-3" /> Warning
        </span>
      );
    case 'critical':
      return (
        <span className="inline-flex items-center gap-1 bg-red-50 text-red-700 border border-red-200 px-2 py-0.5 rounded text-xs font-medium animate-pulse">
          <ShieldAlert className="h-3 w-3" /> Critical
        </span>
      );
  }
}
