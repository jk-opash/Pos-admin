import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Payment } from '@/types';

interface AddPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (payment: Payment) => void;
}

export function AddPaymentModal({ isOpen, onClose, onAdd }: AddPaymentModalProps) {
  const [businessId, setBusinessId] = useState('');
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [status, setStatus] = useState<'success' | 'failed' | 'refunded'>('success');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const numAmount = parseFloat(amount) || 0;
    
    const newPayment: Payment = {
      id: `pay_${Math.random().toString(36).substring(2, 9)}`,
      businessId,
      businessName: "New Business", // Hardcoded for simplicity
      subscriptionId: `sub_${Math.random().toString(36).substring(2, 9)}`,
      amount: numAmount,
      gstAmount: numAmount * 0.18,
      totalAmount: numAmount * 1.18,
      currency: 'INR',
      status,
      paymentMethod,
      invoiceNumber: `INV-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000)}`,
      createdAt: new Date().toISOString(),
      ...(status === 'success' && { paidAt: new Date().toISOString() })
    };

    onAdd(newPayment);
    onClose();
    
    // Reset form
    setBusinessId('');
    setAmount('');
    setPaymentMethod('upi');
    setStatus('success');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Payment">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-brand-dark mb-1">Business ID</label>
          <Input 
            required 
            placeholder="e.g. biz_001" 
            value={businessId} 
            onChange={e => setBusinessId(e.target.value)} 
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-brand-dark mb-1">Amount (₹)</label>
          <Input 
            required 
            type="number" 
            min="0"
            placeholder="e.g. 5000" 
            value={amount} 
            onChange={e => setAmount(e.target.value)} 
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-brand-dark mb-1">Payment Method</label>
          <Select 
            value={paymentMethod} 
            onChange={e => setPaymentMethod(e.target.value)}
            options={[
              { label: 'UPI', value: 'upi' },
              { label: 'Net Banking', value: 'netbanking' },
              { label: 'Cash', value: 'cash' }
            ]}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-brand-dark mb-1">Status</label>
          <Select 
            value={status} 
            onChange={e => setStatus(e.target.value as 'success' | 'failed' | 'refunded')}
            options={[
              { label: 'Success', value: 'success' },
              { label: 'Failed', value: 'failed' },
              { label: 'Refunded', value: 'refunded' }
            ]}
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-brand-border">
          <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="primary">Add Payment</Button>
        </div>
      </form>
    </Modal>
  );
}
