'use client';
/* eslint-disable @typescript-eslint/no-unused-vars */

import { AuditLog } from '@/types';
import { Modal } from '@/components/ui/Modal';
import { ShieldCheck, Activity, Monitor, Globe, Server, Hash, FileCode, Clock, Download } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

interface AuditLogViewerProps {
  log: AuditLog | null;
  isOpen: boolean;
  onClose: () => void;
}

export function AuditLogViewer({ log, isOpen, onClose }: AuditLogViewerProps) {
  if (!log) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Audit Event Details`} size="3xl">
      <div className="flex flex-col max-h-[85vh] md:h-[650px] -mx-6 -mb-6 -mt-4 border-t border-brand-border/50 bg-slate-50/50 relative overflow-hidden">
        
        <div className="flex-1 p-8 overflow-y-auto pb-28">
          
          {/* Header Block */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/60 shadow-sm mb-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
              <Activity className="h-24 w-24" />
            </div>
            
            <div className="flex flex-col md:flex-row gap-6 justify-between items-start">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xl font-bold text-brand-dark">{log.action}</span>
                  {log.status === 'success' ? (
                    <Badge variant="success" className="px-2 py-0.5 text-xs">Success</Badge>
                  ) : (
                    <Badge variant="danger" className="px-2 py-0.5 text-xs">Failed</Badge>
                  )}
                </div>
                <div className="flex items-center gap-2 text-sm text-brand-muted font-medium">
                  <Clock className="h-4 w-4" />
                  <span>
                    {new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }).format(new Date(log.timestamp))}
                  </span>
                  <span className="text-xs uppercase bg-slate-100 px-1.5 py-0.5 rounded text-slate-500">{log.timezone}</span>
                </div>
                <div className="mt-3 font-mono text-xs text-brand-placeholder bg-slate-50 px-2 py-1 rounded inline-block">
                  Event ID: {log.eventId}
                </div>
              </div>

              <div className="flex items-center gap-6 text-sm bg-slate-50/80 px-4 py-3 rounded-xl border border-slate-100">
                <div className="flex flex-col">
                  <span className="text-brand-muted text-[10px] uppercase tracking-widest font-bold mb-1">Category</span>
                  <span className="font-semibold text-brand-dark">{log.category}</span>
                </div>
                <div className="h-8 w-px bg-slate-200" />
                <div className="flex flex-col">
                  <span className="text-brand-muted text-[10px] uppercase tracking-widest font-bold mb-1">Module</span>
                  <span className="font-semibold text-brand-dark">{log.module}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Failure Reason Alert */}
          {log.status === 'failed' && log.failureReason && (
            <div className="bg-red-50/50 border border-red-200/50 text-red-700 p-4 rounded-2xl text-sm mb-6 flex gap-3 items-start shadow-sm">
               <ShieldCheck className="h-5 w-5 shrink-0 text-red-500 mt-0.5" />
               <div>
                  <span className="font-bold block mb-1">Failure Reason</span>
                  {log.failureReason}
               </div>
            </div>
          )}

          {log.remarks && (
            <div className="bg-amber-50/50 border border-amber-200/50 text-amber-800 p-4 rounded-2xl text-sm mb-6 flex gap-3 items-start shadow-sm">
               <Activity className="h-5 w-5 shrink-0 text-amber-500 mt-0.5" />
               <div>
                  <span className="font-bold block mb-1">Remarks & Flags</span>
                  {log.remarks}
               </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* User Details */}
            <div className="bg-white border border-slate-200/60 rounded-2xl overflow-hidden shadow-sm">
              <div className="bg-slate-50/50 px-5 py-3 border-b border-slate-100 flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-indigo-500" />
                <h3 className="font-bold text-xs uppercase tracking-widest text-brand-dark">Actor (User)</h3>
              </div>
              <div className="p-5 space-y-1">
                <DetailRow label="Username" value={log.username} />
                <DetailRow label="User ID" value={log.userId} isMono />
                <DetailRow label="Role" value={log.userRole.replace('_', ' ')} isCapitalize />
                {log.businessId && <DetailRow label="Business ID" value={log.businessId} isMono />}
              </div>
            </div>

            {/* Device & Network */}
            <div className="bg-white border border-slate-200/60 rounded-2xl overflow-hidden shadow-sm">
              <div className="bg-slate-50/50 px-5 py-3 border-b border-slate-100 flex items-center gap-2">
                <Monitor className="h-4 w-4 text-emerald-500" />
                <h3 className="font-bold text-xs uppercase tracking-widest text-brand-dark">Device & Network</h3>
              </div>
              <div className="p-5 space-y-1">
                <DetailRow label="IP Address" value={log.device.ipAddress} isMono />
                <DetailRow label="Location" value={log.device.location || 'Unknown'} />
                <DetailRow label="Device" value={`${log.device.deviceName} (${log.device.deviceType})`} />
                <DetailRow label="Browser" value={log.device.browser} />
                <DetailRow label="OS" value={log.device.os} />
              </div>
            </div>
          </div>

          {/* Affected Record */}
          {log.recordId && (
            <div className="bg-white border border-slate-200/60 rounded-2xl overflow-hidden shadow-sm mb-6">
              <div className="bg-slate-50/50 px-5 py-3 border-b border-slate-100 flex items-center gap-2">
                <Hash className="h-4 w-4 text-purple-500" />
                <h3 className="font-bold text-xs uppercase tracking-widest text-brand-dark">Affected Record</h3>
              </div>
              <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                <DetailRow label="Record Name" value={log.recordName || 'Unknown'} />
                <DetailRow label="Record ID" value={log.recordId} isMono />
              </div>
            </div>
          )}

          {/* State Changes (JSON Diffs) */}
          {(log.previousValues || log.newValues) && (
            <div className="bg-white border border-slate-200/60 rounded-2xl overflow-hidden shadow-sm">
              <div className="bg-slate-50/50 px-5 py-3 border-b border-slate-100 flex items-center gap-2">
                <FileCode className="h-4 w-4 text-amber-500" />
                <h3 className="font-bold text-xs uppercase tracking-widest text-brand-dark">State Changes Payload</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100">
                
                {/* Previous Values */}
                <div className="p-5 bg-red-50/20">
                  <p className="text-[10px] font-bold text-red-600 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block"></span>
                    Previous State (Before)
                  </p>
                  <pre className="text-[11px] font-mono text-slate-700 whitespace-pre-wrap overflow-x-auto bg-white/60 p-4 rounded-xl border border-red-100/50 shadow-inner">
                    {log.previousValues ? JSON.stringify(log.previousValues, null, 2) : 'null'}
                  </pre>
                </div>

                {/* New Values */}
                <div className="p-5 bg-emerald-50/20">
                  <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
                    New State (After)
                  </p>
                  <pre className="text-[11px] font-mono text-slate-700 whitespace-pre-wrap overflow-x-auto bg-white/60 p-4 rounded-xl border border-emerald-100/50 shadow-inner">
                    {log.newValues ? JSON.stringify(log.newValues, null, 2) : 'null'}
                  </pre>
                </div>

              </div>
            </div>
          )}

        </div>

        {/* Sticky Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-5 border-t border-slate-200/60 bg-white/80 backdrop-blur-xl flex justify-between items-center z-10">
          <span className="text-xs text-brand-muted font-medium ml-2">Immutable record entry</span>
          <div className="flex gap-3">
            <Button variant="outline" className="bg-white hover:bg-slate-50 border-slate-200 gap-2">
               <Download className="h-4 w-4" /> Export
            </Button>
            <Button onClick={onClose} className="bg-brand-primary hover:bg-brand-primaryDark text-white px-8 shadow-md">Close</Button>
          </div>
        </div>

      </div>
    </Modal>
  );
}

function DetailRow({ label, value, isMono = false, isCapitalize = false }: { label: string, value: string, isMono?: boolean, isCapitalize?: boolean }) {
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2.5 border-b border-dashed border-slate-200 last:border-0 group">
      <span className="text-xs font-medium text-brand-muted group-hover:text-brand-primary transition-colors">{label}</span>
      <span className={`text-sm font-medium text-brand-dark text-right ${isMono ? 'font-mono text-xs bg-slate-100 px-1.5 py-0.5 rounded' : ''} ${isCapitalize ? 'capitalize' : ''}`}>
        {value}
      </span>
    </div>
  );
}
