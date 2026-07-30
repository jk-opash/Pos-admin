"use client";

import { useState, useEffect } from 'react';
import { PaymentTable } from '@/app/(dashboard)/payments/_components/PaymentTable';
import { PaymentDetailsModal } from '@/app/(dashboard)/payments/_components/PaymentDetailsModal';
import { AddPaymentModal } from '@/app/(dashboard)/payments/_components/AddPaymentModal';
import { Payment, PaymentStatus } from '@/types';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Search, Plus, Loader2 } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { mockPayments } from '@/lib/mock/payments';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchInvoices } from '@/store/slices/subscriptionSlice';

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>(mockPayments);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const dispatch = useAppDispatch();
  const { invoices, loading } = useAppSelector((state) => state.subscription);

  useEffect(() => {
    dispatch(fetchInvoices());
  }, [dispatch]);

  // Map API invoices to Payments array
  useEffect(() => {
    if (invoices && invoices.length > 0) {
      const mappedPayments: Payment[] = invoices.map((inv: any) => {
        let status: PaymentStatus = 'success';
        if (inv.status === 'pending') status = 'pending';
        else if (inv.status === 'overdue' || inv.status === 'failed') status = 'failed';

        return {
          id: inv.invoice_number || inv.id,
          businessId: inv.business_id || 'N/A',
          businessName: inv.business?.name || 'Business',
          subscriptionId: inv.subscription_id || 'N/A',
          amount: Number(inv.amount || 0),
          gstAmount: Math.round(Number(inv.amount || 0) * 0.18),
          totalAmount: Math.round(Number(inv.amount || 0) * 1.18),
          currency: inv.currency || 'INR',
          status,
          paymentMethod: 'UPI / Card',
          invoiceNumber: inv.invoice_number || `INV-${inv.id.slice(0, 8)}`,
          paidAt: inv.paid_at || inv.issued_at || new Date().toISOString(),
          createdAt: inv.created_at || new Date().toISOString(),
        };
      });
      setPayments(mappedPayments);
    }
  }, [invoices]);

  const handleViewPayment = (payment: Payment) => {
    setSelectedPayment(payment);
    setIsDetailsModalOpen(true);
  };

  const handleAddPayment = (newPayment: Payment) => {
    setPayments(prev => [newPayment, ...prev]);
  };

  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      payment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.businessId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate totals
  const totalVolume = filteredPayments
    .filter((p) => p.status === 'success')
    .reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-4">
        <div>
          <h2 className="text-xl font-bold text-brand-dark">Payments & Transactions</h2>
          <p className="mt-1 text-sm text-brand-muted">
            View and manage all subscription payments across the platform.
          </p>
        </div>
        <div className="flex flex-col items-end">
          <p className="text-xs text-brand-muted">Filtered Volume (Succeeded)</p>
          <p className="text-2xl font-bold text-brand-success">{formatCurrency(totalVolume)}</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="w-full sm:w-80">
          <Input
            placeholder="Search by Transaction ID or Business Name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={<Search className="h-4 w-4" />}
          />
        </div>
        <div className="w-full sm:w-40">
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[
              { label: 'All Statuses', value: 'all' },
              { label: 'Succeeded', value: 'succeeded' },
              { label: 'Failed', value: 'failed' },
              { label: 'Refunded', value: 'refunded' },
            ]}
          />
        </div>
      </div>

      <PaymentTable data={filteredPayments} onViewPayment={handleViewPayment} />

      <PaymentDetailsModal 
        isOpen={isDetailsModalOpen} 
        onClose={() => setIsDetailsModalOpen(false)} 
        payment={selectedPayment} 
      />

      <AddPaymentModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddPayment}
      />

      {/* Floating Action Button */}
      <Button 
        variant="primary" 
        className="fixed bottom-8 right-8 h-14 w-14 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all z-50 p-0 flex items-center justify-center"
        onClick={() => setIsAddModalOpen(true)}
        title="Add Payment"
      >
        <Plus className="h-6 w-6" />
      </Button>
    </div>
  );
}
