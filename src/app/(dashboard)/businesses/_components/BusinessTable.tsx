'use client';
/* eslint-disable @typescript-eslint/no-unused-vars */

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Business, BusinessStatus, BusinessType, SubscriptionPlanSlug } from '@/types';
import { MoreVertical, ExternalLink, Edit } from 'lucide-react';
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { EditBusinessModal } from './EditBusinessModal';

interface BusinessTableProps {
  data: Business[];
  onStatusChange?: (id: string, newStatus: BusinessStatus) => void;
}

import { EmptyState } from '@/components/ui/EmptyState';
import { Search } from 'lucide-react';

export function BusinessTable({ data, onStatusChange }: BusinessTableProps) {
  const [editingBusiness, setEditingBusiness] = useState<Business | null>(null);

  if (!data.length) {
    return <EmptyState icon={<Search />} title="No Businesses" message="No businesses found matching your criteria." className="h-64" />;
  }

  return (
    <div className="rounded-xl border border-brand-border bg-white overflow-x-auto">
      <Table>
        <TableHeader className="bg-brand-light">
          <TableRow>
            <TableHead>Business Info</TableHead>
            <TableHead>Owner</TableHead>
            <TableHead>Plan & Status</TableHead>
            <TableHead>Renewal Date</TableHead>
            <TableHead>Branches & Team</TableHead>
            <TableHead>Plan Start Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((biz) => (
            <TableRow key={biz.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar name={biz.name} />
                  <div className="flex flex-col">
                    <span className="font-medium text-brand-dark">{biz.name}</span>
                    <span className="text-xs text-brand-muted capitalize flex items-center gap-2">
                      {biz.type} • {biz.address.city}
                    </span>
                  </div>
                </div>
              </TableCell>
              
              <TableCell>
                <div className="flex flex-col">
                  <span className="text-sm text-brand-dark">{biz.owner.name}</span>
                  <span className="text-xs text-brand-muted">{biz.owner.email}</span>
                </div>
              </TableCell>
              
              <TableCell>
                <div className="flex flex-col gap-1.5 items-start">
                  <PlanBadge plan={biz.subscription.plan} />
                  <StatusBadge status={biz.status} />
                </div>
              </TableCell>

              <TableCell>
                <div className="flex flex-col items-start gap-1">
                  <span className="text-sm font-medium text-brand-dark">
                    {biz.subscription.endsAt ? formatDate(biz.subscription.endsAt) : "N/A"}
                  </span>
                  {getDaysRemainingBadge(biz.subscription.endsAt)}
                </div>
              </TableCell>
              
              <TableCell>
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-brand-dark">
                    {biz.stats.branches} Branches
                  </span>
                  <span className="text-xs text-brand-muted">
                    {biz.stats.users} team members
                  </span>
                </div>
              </TableCell>
              
              <TableCell>
                <span className="text-sm text-brand-muted">
                  {biz.subscription.startDate ? formatDate(biz.subscription.startDate) : "N/A"}
                </span>
              </TableCell>
              
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Link href={`/businesses/${biz.id}`}>
                    <Button variant="secondary" size="sm">
                      View
                    </Button>
                  </Link>
                  <ActionMenu biz={biz} onStatusChange={onStatusChange} onEdit={() => setEditingBusiness(biz)} />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <EditBusinessModal 
        isOpen={!!editingBusiness}
        onClose={() => setEditingBusiness(null)}
        initialBusiness={editingBusiness}
      />
    </div>
  );
}

function StatusBadge({ status }: { status: BusinessStatus }) {
  switch (status) {
    case 'active':
      return <Badge variant="success" dot>Active</Badge>;
    case 'trial':
      return <Badge variant="warning" dot>Trialing</Badge>;
    case 'suspended':
      return <Badge variant="danger" dot>Suspended</Badge>;
    case 'pending':
      return <Badge variant="info" dot>Pending KYC</Badge>;
    default:
      return <Badge variant="muted" dot>Deleted</Badge>;
  }
}

function PlanBadge({ plan }: { plan: SubscriptionPlanSlug }) {
  switch (plan) {
    case 'enterprise':
      return <Badge variant="purple">Enterprise</Badge>;
    case 'professional':
      return <Badge variant="default">Professional</Badge>;
    case 'growth':
      return <Badge variant="info">Growth</Badge>;
    case 'starter':
      return <Badge variant="success">Starter</Badge>;
    default:
      return <Badge variant="warning">Free Trial</Badge>;
  }
}

function getDaysRemainingBadge(endDateStr: string | undefined | null) {
  if (!endDateStr) return null;
  
  const end = new Date(endDateStr);
  const now = new Date();
  const diffTime = end.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) {
    return <Badge variant="danger" className="px-1.5 py-0 text-[10px]">Expired</Badge>;
  } else if (diffDays <= 7) {
    return <Badge variant="danger" className="px-1.5 py-0 text-[10px]">Critical: {diffDays} days left</Badge>;
  } else if (diffDays <= 30) {
    return <Badge variant="warning" className="px-1.5 py-0 text-[10px]">{diffDays} days left</Badge>;
  } else {
    return <Badge variant="success" className="px-1.5 py-0 text-[10px]">{diffDays} days left</Badge>;
  }
}

function ActionMenu({ biz, onStatusChange, onEdit }: { biz: Business, onStatusChange?: (id: string, newStatus: BusinessStatus) => void, onEdit: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)}>
        <MoreVertical className="h-4 w-4" />
      </Button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white shadow-float border border-brand-border focus:outline-none z-modal">
          <div className="py-1">
            <button
              onClick={() => {
                onEdit();
                setIsOpen(false);
              }}
              className="block w-full px-4 py-2 text-left text-sm text-brand-dark hover:bg-slate-100"
            >
              Edit Details
            </button>
            <button
              onClick={() => {
                onStatusChange?.(biz.id, 'active');
                setIsOpen(false);
              }}
              className="block w-full px-4 py-2 text-left text-sm text-brand-dark hover:bg-slate-100"
            >
              Mark as Active
            </button>
            <button
              onClick={() => {
                onStatusChange?.(biz.id, 'trial');
                setIsOpen(false);
              }}
              className="block w-full px-4 py-2 text-left text-sm text-brand-dark hover:bg-slate-100"
            >
              Set to Trial
            </button>
            <button
              onClick={() => {
                onStatusChange?.(biz.id, 'suspended');
                setIsOpen(false);
              }}
              className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
            >
              Suspend Business
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
