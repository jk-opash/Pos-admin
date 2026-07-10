import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';

export function StepAddress() {
  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-base font-semibold text-brand-dark">Business Address</h3>
        <p className="text-sm text-brand-muted mt-0.5">Enter the primary registered address of the business.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select label="Country *" options={[
          { label: 'India', value: 'IN' }, { label: 'UAE', value: 'AE' },
          { label: 'United Kingdom', value: 'GB' }, { label: 'USA', value: 'US' },
        ]} />
        <Select label="State / Province *" options={[
          { label: 'Maharashtra', value: 'MH' }, { label: 'Karnataka', value: 'KA' },
          { label: 'Delhi', value: 'DL' }, { label: 'Tamil Nadu', value: 'TN' },
          { label: 'Gujarat', value: 'GJ' }, { label: 'Kerala', value: 'KL' },
        ]} />
        <Input label="City *" placeholder="e.g. Mumbai" />
        <Input label="District" placeholder="e.g. Thane" />
        <Input label="Postal / PIN Code *" placeholder="e.g. 400001" />
        <Input label="Building Number / Flat No." placeholder="e.g. Shop 12, Building A" />
      </div>
      <div>
        <label className="text-sm font-medium text-brand-muted mb-1.5 block">Street Address *</label>
        <textarea
          className="w-full rounded-lg border border-brand-border px-3 py-2.5 text-sm text-brand-dark focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary placeholder-brand-placeholder"
          rows={2}
          placeholder="Full street address..."
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input label="Landmark (Optional)" placeholder="e.g. Near City Mall" />
        <Input label="GPS Coordinates (Optional)" placeholder="e.g. 19.0760, 72.8777" />
      </div>
    </div>
  );
}
