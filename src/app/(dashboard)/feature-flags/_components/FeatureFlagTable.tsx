'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { PlatformFeature } from '@/types';
import { Check, X, AlertCircle, Edit2 } from 'lucide-react';

export function FeatureFlagTable({ data, onToggle, onEdit }: { data: PlatformFeature[], onToggle?: (id: string) => void, onEdit?: (feature: PlatformFeature) => void }) {
  if (!data.length) {
    return (
      <div className="flex h-64 flex-col items-center justify-center rounded-xl border border-brand-border bg-white">
        <p className="text-sm text-brand-muted">No features found.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-brand-border bg-white overflow-x-auto">
      <Table>
        <TableHeader className="bg-brand-light">
          <TableRow>
            <TableHead>Feature Code</TableHead>
            <TableHead>Category / Type</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((feature) => (
            <TableRow key={feature.id}>
              <TableCell>
                <div className="flex flex-col">
                  <span className="font-semibold text-sm text-brand-dark">{feature.name}</span>
                  <span className="font-mono text-[10px] text-brand-primary">{feature.code}</span>
                  <span className="text-xs text-brand-muted max-w-[200px] truncate mt-0.5" title={feature.description}>
                    {feature.description}
                  </span>
                </div>
              </TableCell>
              
              <TableCell>
                <div className="flex flex-col gap-1.5 items-start">
                  <Badge variant="muted" className="text-[10px] uppercase tracking-wider py-0 px-1.5">
                    {feature.category}
                  </Badge>
                  <TypeBadge type={feature.type} />
                </div>
              </TableCell>
              
              <TableCell>
                <div className="flex items-center gap-3">
                  <StatusBadge status={feature.status} />
                  
                  {/* Status Toggle (only interactive if active or disabled) */}
                  {(feature.status === 'active' || feature.status === 'disabled') && (
                    <button
                      onClick={() => onToggle?.(feature.id)}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none shrink-0 ${feature.status === 'active' ? 'bg-brand-success' : 'bg-brand-border'}`}
                    >
                      <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${feature.status === 'active' ? 'translate-x-5' : 'translate-x-1'}`} />
                    </button>
                  )}
                  
                  <button
                    onClick={() => onEdit?.(feature)}
                    className="p-1.5 text-brand-muted hover:text-brand-primary hover:bg-brand-light rounded-md transition-colors"
                    title="Edit Feature"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function TypeBadge({ type }: { type: PlatformFeature['type'] }) {
  switch (type) {
    case 'core': return <Badge variant="muted" className="text-[10px] bg-slate-100 text-slate-600">Core</Badge>;
    case 'premium': return <Badge variant="warning" className="text-[10px] bg-amber-100 text-amber-700 border-amber-200">Premium</Badge>;
    case 'add_on': return <Badge variant="info" className="text-[10px] bg-blue-100 text-blue-700">Add-on</Badge>;
    case 'beta': return <Badge variant="purple" className="text-[10px] bg-purple-100 text-purple-700">Beta</Badge>;
    case 'enterprise': return <Badge variant="danger" className="text-[10px] bg-slate-800 text-white">Enterprise</Badge>;
    default: return <Badge variant="muted" className="text-[10px] capitalize">{type.replace('_', ' ')}</Badge>;
  }
}

function StatusBadge({ status }: { status: PlatformFeature['status'] }) {
  switch (status) {
    case 'active':
      return <Badge variant="success" className="text-[10px]"><Check className="h-3 w-3 mr-1" /> Active</Badge>;
    case 'disabled':
      return <Badge variant="muted" className="text-[10px]"><X className="h-3 w-3 mr-1" /> Disabled</Badge>;
    case 'beta':
      return <Badge variant="purple" dot className="text-[10px]">Beta Testing</Badge>;
    case 'development':
      return <Badge variant="warning" dot className="text-[10px]">In Dev</Badge>;
    default:
      return <Badge variant="default" className="text-[10px] capitalize">{status.replace('_', ' ')}</Badge>;
  }
}
