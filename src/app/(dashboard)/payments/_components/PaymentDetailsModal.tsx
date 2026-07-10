import { Payment } from '@/types';
import { Modal } from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Badge';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Receipt, CheckCircle2, XCircle, Clock, Copy, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface PaymentDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  payment: Payment | null;
}

export function PaymentDetailsModal({ isOpen, onClose, payment }: PaymentDetailsModalProps) {
  if (!payment) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Transaction Details">
      <div className="space-y-6">
        {/* Header Status */}
        <div className="flex items-center justify-between p-4 bg-brand-light rounded-xl border border-brand-border">
          <div className="flex items-center gap-3">
            {payment.status === 'success' ? (
              <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                <CheckCircle2 className="h-5 w-5" />
              </div>
            ) : payment.status === 'failed' ? (
              <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                <XCircle className="h-5 w-5" />
              </div>
            ) : (
              <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                <Clock className="h-5 w-5" />
              </div>
            )}
            <div>
              <p className="text-sm text-brand-muted">Amount</p>
              <p className="text-2xl font-bold text-brand-dark">
                {formatCurrency(payment.amount, payment.currency === 'usd')}
              </p>
            </div>
          </div>
          <div className="text-right">
            <Badge variant={
              payment.status === 'success' ? 'success' : 
              payment.status === 'failed' ? 'danger' : 'warning'
            } dot>
              {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
            </Badge>
          </div>
        </div>

        {/* Core Details Grid */}
        <div className="grid grid-cols-2 gap-y-4 gap-x-8">
          <div>
            <p className="text-xs text-brand-muted uppercase tracking-wider mb-1">Transaction ID</p>
            <div className="flex items-center gap-2">
              <span className="text-sm font-mono text-brand-dark">{payment.id}</span>
              <Button variant="ghost" size="icon" className="h-5 w-5 hover:bg-transparent text-brand-muted hover:text-brand-primary">
                <Copy className="h-3 w-3" />
              </Button>
            </div>
          </div>

          <div>
            <p className="text-xs text-brand-muted uppercase tracking-wider mb-1">Business ID</p>
            <div className="flex items-center gap-2">
              <span className="text-sm font-mono text-brand-dark">{payment.businessId}</span>
              <Button variant="ghost" size="icon" className="h-5 w-5 hover:bg-transparent text-brand-muted hover:text-brand-primary">
                <ExternalLink className="h-3 w-3" />
              </Button>
            </div>
          </div>

          <div>
            <p className="text-xs text-brand-muted uppercase tracking-wider mb-1">Date & Time</p>
            <p className="text-sm font-medium text-brand-dark">{formatDate(payment.createdAt)}</p>
          </div>

          <div>
            <p className="text-xs text-brand-muted uppercase tracking-wider mb-1">Payment Method</p>
            <p className="text-sm font-medium text-brand-dark uppercase">{payment.paymentMethod}</p>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-brand-border w-full"></div>

        {/* Error Details if Failed */}
        {payment.status === 'failed' && payment.errorMessage && (
          <div className="p-3 rounded-lg bg-red-50 border border-red-100">
            <p className="text-xs text-red-600 font-semibold mb-1">Failure Reason</p>
            <p className="text-sm text-red-700">{payment.errorMessage}</p>
          </div>
        )}

        {/* Raw Metadata (Mocked) */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
          <p className="text-xs text-brand-muted font-mono mb-2">Raw Gateway Metadata</p>
          <pre className="text-[10px] text-slate-600 overflow-x-auto whitespace-pre-wrap font-mono">
            {JSON.stringify({
              gateway_id: `ch_${payment.id.split('-')[0] || '123456'}`,
              risk_level: "normal",
              network: "visa",
              funding: "credit",
              country: "IN"
            }, null, 2)}
          </pre>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-brand-border">
          <Button variant="outline" onClick={onClose}>Close</Button>
          <Button variant="primary" className="gap-2">
            <Receipt className="h-4 w-4" /> Download Receipt
          </Button>
        </div>
      </div>
    </Modal>
  );
}
