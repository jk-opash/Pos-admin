/* eslint-disable @typescript-eslint/no-unused-vars */
import { CheckCircle2, User, Building, Settings, MapPin, Receipt, CreditCard } from 'lucide-react';

export function StepReview() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold text-brand-dark">Review & Provision</h3>
        <p className="text-sm text-brand-muted mt-1">Review the business details before final provisioning. Once approved, the system will generate the tenant environment and send an invitation to the owner.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          <div className="rounded-xl border border-brand-border p-4">
            <div className="flex items-center gap-2 mb-3">
              <User className="h-4 w-4 text-brand-primary" />
              <h4 className="font-semibold text-brand-dark">Owner Details</h4>
            </div>
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-y-3 text-sm">
              <div>
                <dt className="text-brand-placeholder text-xs">Full Name</dt>
                <dd className="font-medium text-brand-dark">Arjun Desai</dd>
              </div>
              <div>
                <dt className="text-brand-placeholder text-xs">Contact</dt>
                <dd className="font-medium text-brand-dark">+91 99123 45678</dd>
              </div>
              <div className="col-span-2">
                <dt className="text-brand-placeholder text-xs">Email Address</dt>
                <dd className="font-medium text-brand-dark">arjun@desaifoods.in</dd>
              </div>
            </dl>
          </div>

          <div className="rounded-xl border border-brand-border p-4">
            <div className="flex items-center gap-2 mb-3">
              <Building className="h-4 w-4 text-brand-primary" />
              <h4 className="font-semibold text-brand-dark">Business Details</h4>
            </div>
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-y-3 text-sm">
              <div className="col-span-2">
                <dt className="text-brand-placeholder text-xs">Business Name</dt>
                <dd className="font-medium text-brand-dark">Desai Foods & Catering</dd>
              </div>
              <div>
                <dt className="text-brand-placeholder text-xs">Industry</dt>
                <dd className="font-medium text-brand-dark">Restaurant & F&B</dd>
              </div>
              <div>
                <dt className="text-brand-placeholder text-xs">Type</dt>
                <dd className="font-medium text-brand-dark capitalize">Restaurant</dd>
              </div>
            </dl>
          </div>

          <div className="rounded-xl border border-brand-border p-4">
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="h-4 w-4 text-brand-primary" />
              <h4 className="font-semibold text-brand-dark">Location & Branch</h4>
            </div>
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-y-3 text-sm">
              <div className="col-span-2">
                <dt className="text-brand-placeholder text-xs">Address</dt>
                <dd className="font-medium text-brand-dark">Shop 12, ABC Complex, Andheri East, Mumbai, Maharashtra - 400069, IN</dd>
              </div>
              <div>
                <dt className="text-brand-placeholder text-xs">Timezone</dt>
                <dd className="font-medium text-brand-dark">Asia/Kolkata</dd>
              </div>
              <div>
                <dt className="text-brand-placeholder text-xs">Currency</dt>
                <dd className="font-medium text-brand-dark">INR (₹)</dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <div className="rounded-xl border border-brand-border p-4">
            <div className="flex items-center gap-2 mb-3">
              <Receipt className="h-4 w-4 text-brand-primary" />
              <h4 className="font-semibold text-brand-dark">Tax & Compliance</h4>
            </div>
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-y-3 text-sm">
              <div>
                <dt className="text-brand-placeholder text-xs">GST Number</dt>
                <dd className="font-medium text-brand-dark">27ABCDE1234F1Z5</dd>
              </div>
              <div>
                <dt className="text-brand-placeholder text-xs">PAN Number</dt>
                <dd className="font-medium text-brand-dark">ABCDE1234F</dd>
              </div>
              <div className="col-span-2 mt-2">
                <dt className="text-brand-placeholder text-xs mb-1.5">Uploaded Documents</dt>
                <dd className="space-y-1.5">
                  <div className="flex items-center gap-1.5 text-brand-success">
                    <CheckCircle2 className="h-3.5 w-3.5" /> <span className="font-medium">GST Certificate.pdf</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-brand-success">
                    <CheckCircle2 className="h-3.5 w-3.5" /> <span className="font-medium">PAN_Card.jpg</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-brand-success">
                    <CheckCircle2 className="h-3.5 w-3.5" /> <span className="font-medium">FSSAI_License.pdf</span>
                  </div>
                </dd>
              </div>
            </dl>
          </div>

          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
            <div className="flex items-center gap-2 mb-3">
              <CreditCard className="h-4 w-4 text-emerald-600" />
              <h4 className="font-semibold text-emerald-800">Subscription Plan</h4>
            </div>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-xl font-bold text-emerald-900">Professional</p>
                <p className="text-sm text-emerald-700 mt-0.5">10 Branches, Unlimited Users</p>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-emerald-900">₹4,999</p>
                <p className="text-xs font-medium text-emerald-700 uppercase">Per Month</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
