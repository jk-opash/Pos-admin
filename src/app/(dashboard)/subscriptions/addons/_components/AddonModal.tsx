import { useState } from "react";
import { useAppDispatch } from "@/store/hooks";
import {
  purchaseAddons,
  fetchInvoices,
} from "@/store/slices/subscriptionSlice";
import { fetchBusinesses } from "@/store/slices/businessSlice";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Store, Users, DollarSign } from "lucide-react";
import { toast } from "react-hot-toast";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { LottieLoader } from "@/components/ui/LottieLoader";

const addonSchema = z.object({
  branches: z.number().min(0, 'Must be 0 or more'),
  teamMembers: z.number().min(0, 'Must be 0 or more'),
  amount: z.number().min(0, 'Amount cannot be negative'),
  paymentMethod: z.string().min(1, 'Payment method is required'),
}).refine(data => data.branches > 0 || data.teamMembers > 0, {
  message: "Please add at least one branch or team member",
  path: ["branches"],
});

type AddonFormValues = z.infer<typeof addonSchema>;

interface AddonModalProps {
  isOpen: boolean;
  onClose: () => void;
  business: any | null;
}

export function AddonModal({ isOpen, onClose, business }: AddonModalProps) {
  const dispatch = useAppDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<AddonFormValues>({
    resolver: zodResolver(addonSchema),
    defaultValues: {
      branches: 0,
      teamMembers: 0,
      amount: undefined,
      paymentMethod: "Card",
    }
  });

  if (!business) return null;

  const onSubmit = async (data: AddonFormValues) => {
    setIsSubmitting(true);
    try {
      await dispatch(
        purchaseAddons({
          business_id: business.id,
          addons: {
            branches: data.branches,
            team_members: data.teamMembers,
          },
          amount: data.amount,
          currency: "USD",
          payment_method: data.paymentMethod,
        }),
      ).unwrap();

      toast.success("Add-ons purchased successfully!");

      // Refresh data
      dispatch(fetchBusinesses());
      dispatch(fetchInvoices());

      // Reset form
      reset();
      onClose();
    } catch (err: any) {
      toast.error(err || "Failed to purchase add-ons");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Purchase Add-ons"
      description={`Add extra branches or staff to ${business.name}'s subscription limit.`}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-brand-dark">
              Additional Branches
            </label>
            <Input
              type="number"
              min="0"
              icon={<Store className="h-4 w-4" />}
              defaultValue="0"
              {...register('branches', { valueAsNumber: true })}
              error={errors.branches?.message}
            />
            <p className="mt-1 text-xs text-brand-muted">
              Current limit: {business.subscription_plan?.max_branches || 0}{" "}
              (Base) + {business.extra_branches || 0} (Extra)
            </p>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-brand-dark">
              Additional Staff
            </label>
            <Input
              type="number"
              min="0"
              icon={<Users className="h-4 w-4" />}
              defaultValue="0"
              {...register('teamMembers', { valueAsNumber: true })}
              error={errors.teamMembers?.message}
            />
            <p className="mt-1 text-xs text-brand-muted">
              Current limit: {business.subscription_plan?.max_team_members || 0}{" "}
              (Base) + {business.extra_team_members || 0} (Extra)
            </p>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-brand-dark">
              Total Custom Price ($)
            </label>
            <Input
              type="number"
              min="0"
              step="0.01"
              icon={<DollarSign className="h-4 w-4" />}
              placeholder="e.g. 1000"
              {...register('amount', { valueAsNumber: true })}
              error={errors.amount?.message}
            />
            <p className="mt-1 text-xs text-brand-muted">
              This amount will be billed immediately and an invoice will be
              generated.
            </p>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-brand-dark">
              Payment Method
            </label>
            <div className="relative">
              <select
                {...register('paymentMethod')}
                className={`w-full h-10 px-3 py-2 text-sm bg-white border ${errors.paymentMethod ? 'border-brand-danger ring-2 ring-brand-danger/20' : 'border-brand-border focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary'} rounded-lg outline-none transition-all duration-200 placeholder:text-brand-placeholder text-brand-dark appearance-none`}
              >
                <option value="Card">Card</option>
                <option value="UPI">UPI</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Cash">Cash</option>
              </select>
              {errors.paymentMethod && <p className="mt-1 text-xs font-medium text-brand-danger">{errors.paymentMethod.message}</p>}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <LottieLoader size="xs" className="mr-2" />
                Processing...
              </>
            ) : (
              "Purchase & Bill"
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
