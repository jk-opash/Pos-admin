'use client';

import { useState } from 'react';
import { PaymentTable } from '@/app/(dashboard)/payments/_components/PaymentTable';
import { PaymentDetailsModal } from '@/app/(dashboard)/payments/_components/PaymentDetailsModal';
import { AddPaymentModal } from '@/app/(dashboard)/payments/_components/AddPaymentModal';
import { Payment } from '@/types';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Search, Plus } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { mockPayments } from '@/lib/mock/payments';

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>(mockPayments);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

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
            placeholder="Search by Transaction ID or Business ID..."
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
