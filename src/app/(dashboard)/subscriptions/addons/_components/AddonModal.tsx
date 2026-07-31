import { useState } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { purchaseAddons, fetchInvoices } from '@/store/slices/subscriptionSlice';
import { fetchBusinesses } from '@/store/slices/businessSlice';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Store, Users, DollarSign, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface AddonModalProps {
  isOpen: boolean;
  onClose: () => void;
  business: any | null;
}

export function AddonModal({ isOpen, onClose, business }: AddonModalProps) {
  const dispatch = useAppDispatch();
  const [branches, setBranches] = useState(0);
  const [teamMembers, setTeamMembers] = useState(0);
  const [amount, setAmount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('Card');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!business) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (branches === 0 && teamMembers === 0) {
      toast.error('Please add at least one branch or team member');
      return;
    }

    setIsSubmitting(true);
    try {
      await dispatch(purchaseAddons({
        business_id: business.id,
        addons: {
          branches: branches,
          team_members: teamMembers
        },
        amount: amount,
        currency: 'USD',
        payment_method: paymentMethod
      })).unwrap();
      
      toast.success('Add-ons purchased successfully!');
      
      // Refresh data
      dispatch(fetchBusinesses());
      dispatch(fetchInvoices());
      
      // Reset form
      setBranches(0);
      setTeamMembers(0);
      setAmount(0);
      onClose();
    } catch (err: any) {
      toast.error(err || 'Failed to purchase add-ons');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Purchase Add-ons"
      description={`Add extra branches or staff to ${business.name}'s subscription limit.`}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-brand-dark">
              Additional Branches
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Store className="h-4 w-4 text-brand-muted" />
              </div>
              <Input
                type="number"
                min="0"
                value={branches}
                onChange={(e) => setBranches(parseInt(e.target.value) || 0)}
                className="pl-9"
              />
            </div>
            <p className="mt-1 text-xs text-brand-muted">
              Current limit: {business.subscription_plan?.max_branches || 0} (Base) + {business.extra_branches || 0} (Extra)
            </p>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-brand-dark">
              Additional Staff
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Users className="h-4 w-4 text-brand-muted" />
              </div>
              <Input
                type="number"
                min="0"
                value={teamMembers}
                onChange={(e) => setTeamMembers(parseInt(e.target.value) || 0)}
                className="pl-9"
              />
            </div>
            <p className="mt-1 text-xs text-brand-muted">
              Current limit: {business.subscription_plan?.max_team_members || 0} (Base) + {business.extra_team_members || 0} (Extra)
            </p>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-brand-dark">
              Total Custom Price ($)
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <DollarSign className="h-4 w-4 text-brand-muted" />
              </div>
              <Input
                type="number"
                min="0"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                className="pl-9"
                required
              />
            </div>
            <p className="mt-1 text-xs text-brand-muted">
              This amount will be billed immediately and an invoice will be generated.
            </p>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-brand-dark">
              Payment Method
            </label>
            <div className="relative">
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full h-10 px-3 py-2 text-sm bg-white border border-brand-border rounded-lg outline-none transition-all duration-200 focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary placeholder:text-brand-placeholder text-brand-dark appearance-none"
              >
                <option value="Card">Card</option>
                <option value="UPI">UPI</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Cash">Cash</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              'Purchase & Bill'
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
