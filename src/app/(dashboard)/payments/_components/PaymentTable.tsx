"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Payment } from "@/types";
import { ExternalLink, Receipt, Eye } from "lucide-react";

import { EmptyState } from "@/components/ui/EmptyState";
import { Search } from "lucide-react";

export function PaymentTable({
  data,
  onViewPayment,
}: {
  data: Payment[];
  onViewPayment?: (payment: Payment) => void;
}) {
  if (!data.length) {
    return (
      <EmptyState
        icon={<Search />}
        title="No Payments"
        message="No payments found."
        className="h-64"
      />
    );
  }

  return (
    <div className="rounded-xl border border-brand-border bg-white overflow-x-auto">
      <Table>
        <TableHeader className="bg-brand-light">
          <TableRow>
            <TableHead>Transaction</TableHead>
            <TableHead>Business ID</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Method</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((payment) => (
            <TableRow key={payment.id}>
              <TableCell>
                <div className="flex flex-col">
                  <span className="font-medium text-brand-dark font-mono text-xs">
                    {payment.id}
                  </span>
                  <span className="text-xs text-brand-muted">
                    {formatDate(payment.createdAt)}
                  </span>
                </div>
              </TableCell>

              <TableCell className="text-sm text-brand-dark">
                {payment.businessId}
              </TableCell>

              <TableCell>
                <span className="text-sm font-medium text-brand-dark">
                  {formatCurrency(payment.amount, payment.currency === "usd")}
                </span>
              </TableCell>

              <TableCell>
                <StatusBadge status={payment.status} />
              </TableCell>

              <TableCell>
                <span className="text-xs text-brand-muted uppercase">
                  {payment.paymentMethod}
                </span>
              </TableCell>

              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    title="Download Invoice"
                    onClick={() => onViewPayment?.(payment)}
                  >
                    <Receipt className="h-4 w-4 text-brand-muted hover:text-brand-primary" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function StatusBadge({ status }: { status: Payment["status"] }) {
  switch (status) {
    case "success":
      return (
        <Badge variant="success" dot>
          Succeeded
        </Badge>
      );
    case "failed":
      return (
        <Badge variant="danger" dot>
          Failed
        </Badge>
      );
    case "refunded":
      return (
        <Badge variant="warning" dot>
          Refunded
        </Badge>
      );
    default:
      return (
        <Badge variant="default" dot>
          {status}
        </Badge>
      );
  }
}
