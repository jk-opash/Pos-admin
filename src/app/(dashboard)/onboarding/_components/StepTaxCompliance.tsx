import { Input } from '@/components/ui/Input';
import { Upload } from 'lucide-react';

export function StepTaxCompliance() {
  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-base font-semibold text-brand-dark">Tax & Compliance</h3>
        <p className="text-sm text-brand-muted mt-0.5">Provide tax registration details and upload necessary documents for verification.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input label="GST Number *" placeholder="e.g. 27ABCDE1234F1Z5" />
        <Input label="PAN Number *" placeholder="e.g. ABCDE1234F" />
        <Input label="TAN Number (Optional)" placeholder="e.g. MUMT12345F" />
        <Input label="FSSAI License Number (If applicable)" placeholder="e.g. 10012022000123" />
      </div>

      <div className="pt-4 border-t border-brand-border">
        <h4 className="text-sm font-semibold text-brand-dark mb-3">Upload Documents</h4>
        
        <div className="space-y-3">
          {/* Document Upload Item */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-3 rounded-lg border border-brand-border bg-white">
            <div>
              <p className="text-sm font-medium text-brand-dark">GST Certificate <span className="text-red-500">*</span></p>
              <p className="text-xs text-brand-placeholder mt-0.5">PDF or JPG, max 5MB</p>
            </div>
            <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-brand-primary bg-brand-primaryLight rounded-md hover:bg-brand-primaryLight transition-colors">
              <Upload className="h-4 w-4" /> Upload
            </button>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-3 rounded-lg border border-brand-border bg-white">
            <div>
              <p className="text-sm font-medium text-brand-dark">PAN Card <span className="text-red-500">*</span></p>
              <p className="text-xs text-brand-placeholder mt-0.5">PDF or JPG, max 5MB</p>
            </div>
            <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-brand-primary bg-brand-primaryLight rounded-md hover:bg-brand-primaryLight transition-colors">
              <Upload className="h-4 w-4" /> Upload
            </button>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-3 rounded-lg border border-brand-border bg-white">
            <div>
              <p className="text-sm font-medium text-brand-dark">Trade License / Registration</p>
              <p className="text-xs text-brand-placeholder mt-0.5">Optional, but recommended for faster verification</p>
            </div>
            <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-brand-primary bg-brand-primaryLight rounded-md hover:bg-brand-primaryLight transition-colors">
              <Upload className="h-4 w-4" /> Upload
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
