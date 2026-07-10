import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';

export function StepBranchSetup() {
  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-base font-semibold text-brand-dark">Branch Setup</h3>
        <p className="text-sm text-brand-muted mt-0.5">Configure the default settings for the first branch (Head Office).</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input label="Branch Name *" defaultValue="Head Office" />
        <Input label="Branch Code" placeholder="e.g. HO-001" />
        
        <Select label="Timezone *" options={[
          { label: '(GMT+05:30) India Standard Time', value: 'Asia/Kolkata' },
          { label: '(GMT+04:00) Gulf Standard Time', value: 'Asia/Dubai' },
          { label: '(GMT+00:00) Greenwich Mean Time', value: 'Europe/London' },
        ]} />
        
        <Select label="Currency *" options={[
          { label: 'INR (₹) - Indian Rupee', value: 'INR' },
          { label: 'AED (د.إ) - UAE Dirham', value: 'AED' },
          { label: 'USD ($) - US Dollar', value: 'USD' },
          { label: 'GBP (£) - British Pound', value: 'GBP' },
        ]} />
      </div>

      <div className="pt-4 border-t border-brand-border">
        <h4 className="text-sm font-semibold text-brand-dark mb-3">Working Hours</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Opening Time" type="time" defaultValue="09:00" />
          <Input label="Closing Time" type="time" defaultValue="22:00" />
        </div>
        
        <div className="mt-4">
          <label className="text-sm font-medium text-brand-muted mb-2 block">Working Days</label>
          <div className="flex flex-wrap gap-2">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
              <label key={day} className="flex items-center gap-2 bg-brand-light border border-brand-border px-3 py-1.5 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors">
                <input type="checkbox" defaultChecked={day !== 'Sun'} className="h-4 w-4 rounded border-brand-border text-brand-primary focus:ring-brand-primary" />
                <span className="text-sm text-brand-muted">{day}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
