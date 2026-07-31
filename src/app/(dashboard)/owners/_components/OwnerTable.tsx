'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Admin, updateAdminStatus } from '@/store/slices/adminSlice';
import { MoreVertical, Store, ShieldOff, ShieldCheck, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { Search } from 'lucide-react';

interface OwnerTableProps {
  data: Admin[];
}

export function OwnerTable({ data }: OwnerTableProps) {
  const dispatch = useAppDispatch();
  const [togglingId, setTogglingId] = useState<string | null>(null);

  if (!data.length) {
    return <EmptyState icon={<Search />} title="No Owners" message="No business owners found." className="h-64" />;
  }

  const handleToggleStatus = async (admin: Admin) => {
    try {
      setTogglingId(admin.id);
      await dispatch(updateAdminStatus({ id: admin.id, is_active: !admin.is_active })).unwrap();
    } catch (error) {
      console.error("Failed to toggle admin status", error);
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <div className="rounded-xl border border-brand-border bg-white overflow-x-auto">
      <Table>
        <TableHeader className="bg-brand-light">
          <TableRow>
            <TableHead>Owner Info</TableHead>
            <TableHead>Businesses</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((owner) => (
            <TableRow key={owner.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar name={owner.name} />
                  <div className="flex flex-col">
                    <span className="font-medium text-brand-dark">{owner.name}</span>
                    <span className="text-xs text-brand-muted">{owner.email}</span>
                    {owner.phone !== 'N/A' && (
                      <span className="text-xs text-brand-muted">{owner.phone}</span>
                    )}
                  </div>
                </div>
              </TableCell>
              
              <TableCell>
                <div className="flex items-center gap-2">
                  <Store className="h-4 w-4 text-brand-muted" />
                  <span className="text-sm font-medium">{owner.businesses_count}</span>
                </div>
                {owner.businesses_count > 0 && (
                  <div className="mt-1 flex flex-col gap-1">
                    {owner.businesses.slice(0, 2).map(b => (
                      <span key={b.id} className="text-xs text-brand-muted truncate max-w-[150px]">
                        • {b.name}
                      </span>
                    ))}
                    {owner.businesses_count > 2 && (
                      <span className="text-[10px] text-brand-primary">
                        +{owner.businesses_count - 2} more
                      </span>
                    )}
                  </div>
                )}
              </TableCell>

              <TableCell>
                <Badge variant={owner.is_active ? 'success' : 'danger'}>
                  {owner.is_active ? 'Active' : 'Inactive'}
                </Badge>
              </TableCell>

              <TableCell>
                <div className="text-sm text-brand-dark">{formatDate(owner.created_at)}</div>
              </TableCell>

              <TableCell className="text-right">
                {togglingId === owner.id ? (
                  <Button variant="ghost" size="icon" disabled>
                    <Loader2 className="h-4 w-4 animate-spin text-brand-primary" />
                  </Button>
                ) : (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleToggleStatus(owner)}
                    className={owner.is_active ? "text-red-600 border-red-200 hover:bg-red-50" : "text-brand-success border-brand-success/20 hover:bg-brand-success/10"}
                  >
                    {owner.is_active ? (
                      <>
                        <ShieldOff className="mr-2 h-3.5 w-3.5" />
                        Suspend
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="mr-2 h-3.5 w-3.5" />
                        Restore
                      </>
                    )}
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
