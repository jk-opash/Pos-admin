import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';

const BUSINESS_TYPES = [
  'Restaurant', 'Cafe', 'Bakery', 'Grocery Store', 'Supermarket', 'Retail Store',
  'Pharmacy', 'Clothing Store', 'Electronics Store', 'Salon', 'Spa', 'Hotel',
  'Bar', 'Fast Food', 'Hardware Store', 'Medical Store', 'Wholesale Business',
  'Manufacturing', 'Service Business', 'Custom Business',
].map(t => ({ label: t, value: t.toLowerCase().replace(/ /g, '_') }));

export function StepBusinessDetails() {
  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-base font-semibold text-brand-dark">Business Information</h3>
        <p className="text-sm text-brand-muted mt-0.5">Provide the official registered details of the business.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input label="Business Name *" placeholder="e.g. Desai Foods & Catering" />
        <Input label="Legal Business Name *" placeholder="As per registration" />
        <Input label="Display Name (Brand) *" placeholder="Shown to customers" />
        <Select label="Business Type *" options={BUSINESS_TYPES} />
        <Input label="Business Registration Number" placeholder="e.g. U74999MH2022PTC123456" />
        <Input label="Number of Employees" placeholder="e.g. 15" />
        <Input label="Website (Optional)" placeholder="https://..." />
        <Input label="Support Email" placeholder="support@business.com" />
      </div>
      <div>
        <label className="text-sm font-medium text-brand-muted mb-1.5 block">Business Description</label>
        <textarea
          className="w-full rounded-lg border border-brand-border px-3 py-2.5 text-sm text-brand-dark focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary placeholder-brand-placeholder"
          rows={3}
          placeholder="Brief description of the business, its products or services..."
        />
      </div>
    </div>
  );
}
