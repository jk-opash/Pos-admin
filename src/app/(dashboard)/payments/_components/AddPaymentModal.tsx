import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Payment } from '@/types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useState } from 'react';
import { LottieLoader } from "@/components/ui/LottieLoader";

const paymentSchema = z.object({
  businessId: z.string().min(1, 'Business ID is required'),
  amount: z.number().positive('Amount must be greater than 0'),
  paymentMethod: z.enum(['upi', 'netbanking', 'cash']),
  status: z.enum(['success', 'failed', 'refunded']),
});

type PaymentFormValues = z.infer<typeof paymentSchema>;

interface AddPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (payment: Payment) => void;
}

export function AddPaymentModal({ isOpen, onClose, onAdd }: AddPaymentModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset } = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      businessId: '',
      amount: undefined,
      paymentMethod: 'upi',
      status: 'success',
    },
  });

  const onSubmit = async (data: PaymentFormValues) => {
    setIsSubmitting(true);
    // Simulate network request for adding payment
    await new Promise(resolve => setTimeout(resolve, 800));

    const newPayment: Payment = {
      id: `pay_${Math.random().toString(36).substring(2, 9)}`,
      businessId: data.businessId,
      businessName: "New Business", // Hardcoded for simplicity
      subscriptionId: `sub_${Math.random().toString(36).substring(2, 9)}`,
      amount: data.amount,
      gstAmount: data.amount * 0.18,
      totalAmount: data.amount * 1.18,
      currency: 'INR',
      status: data.status,
      paymentMethod: data.paymentMethod,
      invoiceNumber: `INV-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000)}`,
      createdAt: new Date().toISOString(),
      ...(data.status === 'success' && { paidAt: new Date().toISOString() })
    };

    onAdd(newPayment);
    reset();
    setIsSubmitting(false);
    onClose();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Add New Payment">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-brand-dark mb-1">Business ID</label>
          <Input 
            placeholder="e.g. biz_001" 
            {...register('businessId')}
            error={errors.businessId?.message}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-brand-dark mb-1">Amount (₹)</label>
          <Input 
            type="number" 
            step="0.01"
            placeholder="e.g. 5000" 
            {...register('amount', { valueAsNumber: true })}
            error={errors.amount?.message}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-brand-dark mb-1">Payment Method</label>
          <Select 
            {...register('paymentMethod')}
            error={errors.paymentMethod?.message}
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
            {...register('status')}
            error={errors.status?.message}
            options={[
              { label: 'Success', value: 'success' },
              { label: 'Failed', value: 'failed' },
              { label: 'Refunded', value: 'refunded' }
            ]}
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-brand-border">
          <Button type="button" variant="outline" onClick={handleClose} disabled={isSubmitting}>Cancel</Button>
          <Button type="submit" variant="primary" disabled={isSubmitting} className="flex items-center gap-2">
            {isSubmitting && <LottieLoader size="xs" />}
            {isSubmitting ? "Adding..." : "Add Payment"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
