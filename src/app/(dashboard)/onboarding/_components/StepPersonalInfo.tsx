import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { UploadCloud } from 'lucide-react';

export function StepPersonalInfo() {
  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-base font-semibold text-brand-dark">Account Owner Details</h3>
        <p className="text-sm text-brand-muted mt-0.5">This will be the primary administrator account for the business.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input label="Full Name *" placeholder="e.g. Arjun Desai" />
        <Input label="Mobile Number *" placeholder="+91 99123 45678" />
        <Input label="Email Address *" placeholder="arjun@business.com" />
        <Select label="Nationality *" options={[
          { label: 'Indian', value: 'in' },
          { label: 'UAE National', value: 'ae' },
          { label: 'Other', value: 'other' },
        ]} />
        <Input label="Password *" placeholder="Min 8 characters" />
        <Input label="Confirm Password *" placeholder="Repeat password" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input label="Date of Birth" placeholder="DD / MM / YYYY" />
        <Select label="Gender" options={[
          { label: 'Male', value: 'male' },
          { label: 'Female', value: 'female' },
          { label: 'Other', value: 'other' },
          { label: 'Prefer not to say', value: 'none' },
        ]} />
      </div>
      <div className="pt-4 border-t border-brand-border">
        <h3 className="text-sm font-semibold text-brand-dark mb-3">Identity Verification (Optional for Draft)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select label="ID Document Type" options={[
            { label: 'Passport', value: 'passport' },
            { label: 'National ID / Aadhaar', value: 'national_id' },
            { label: 'Driving License', value: 'driving_license' },
          ]} />
          
          <div className="mt-6 border-2 border-dashed border-brand-borderHover rounded-xl flex flex-col items-center justify-center py-4 bg-brand-light hover:bg-slate-100 transition-colors cursor-pointer">
            <UploadCloud className="h-5 w-5 text-brand-muted mb-2" />
            <span className="text-xs text-brand-muted font-medium">Click to upload ID scan</span>
            <span className="text-[10px] text-brand-placeholder mt-0.5">JPG, PNG or PDF (Max 5MB)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
