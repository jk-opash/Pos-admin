'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Store, User, CreditCard, Building2, ShieldCheck, CheckCircle2, Settings, Globe } from 'lucide-react';

const steps = [
  { id: 'business', label: 'Business Details', icon: <Store className="h-4 w-4" /> },
  { id: 'owner', label: 'Owner Profile', icon: <User className="h-4 w-4" /> },
  { id: 'config', label: 'Business Config', icon: <Settings className="h-4 w-4" /> },
  { id: 'region', label: 'Regional Settings', icon: <Globe className="h-4 w-4" /> },
  { id: 'tax', label: 'Tax & Localization', icon: <Building2 className="h-4 w-4" /> },
  { id: 'plan', label: 'Subscription Plan', icon: <CreditCard className="h-4 w-4" /> },
  { id: 'review', label: 'Review & Provision', icon: <ShieldCheck className="h-4 w-4" /> },
];

export function OnboardingWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((c) => c + 1);
    } else {
      handleProvision();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) setCurrentStep((c) => c - 1);
  };

  const handleProvision = async () => {
    setLoading(true);
    // Simulate auto-provisioning
    await new Promise((r) => setTimeout(r, 2000));
    setLoading(false);
    setIsSuccess(true);
  };

  if (isSuccess) {
    return (
      <Card className="flex flex-col items-center justify-center p-12 text-center" padding="lg">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-success/10 text-brand-success mb-6">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <h2 className="text-2xl font-bold text-brand-dark">Tenant Provisioned Successfully!</h2>
        <p className="mt-2 text-brand-muted max-w-md">
          A dedicated database schema has been created, industry templates seeded, and welcome email sent to the owner.
        </p>
        <div className="mt-8 flex gap-4">
          <Button variant="secondary" onClick={() => window.location.reload()}>Onboard Another</Button>
          <Button onClick={() => window.location.href = '/businesses'}>View Business</Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Sidebar Progress */}
      <div className="lg:col-span-1">
        <Card className="sticky top-6 p-4">
          <nav className="flex flex-row lg:flex-col gap-4 overflow-x-auto pb-2 lg:pb-0 lg:overflow-visible no-scrollbar">
            {steps.map((step, index) => {
              const isActive = index === currentStep;
              const isPast = index < currentStep;

              return (
                <div key={step.id} className="flex items-center gap-3 shrink-0 relative">
                  {/* Line connecting steps - hidden on mobile, shown on desktop */}
                  {index !== steps.length - 1 && (
                    <div className="hidden lg:block absolute left-4 top-10 h-6 w-px bg-brand-border" />
                  )}
                  
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border ${
                      isActive
                        ? 'border-brand-dark bg-brand-dark/10 text-brand-dark'
                        : isPast
                        ? 'border-brand-success bg-brand-success/10 text-brand-success'
                        : 'border-brand-border bg-brand-light text-brand-placeholder'
                    }`}
                  >
                    {isPast ? <CheckCircle2 className="h-4 w-4" /> : step.icon}
                  </div>
                  <span
                    className={`text-sm font-medium ${
                      isActive ? 'text-brand-dark' : isPast ? 'text-brand-muted' : 'text-brand-placeholder'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              );
            })}
          </nav>
        </Card>
      </div>

      {/* Form Area */}
      <div className="lg:col-span-3">
        <Card padding="lg" className="min-h-[500px] flex flex-col">
          <CardHeader>
            <CardTitle>{steps[currentStep].label}</CardTitle>
            <CardDescription>Enter the details below to proceed.</CardDescription>
          </CardHeader>

          <div className="flex-1 mt-6">
            {currentStep === 0 && (
              <div className="space-y-4">
                <Input label="Business Name" placeholder="e.g. Spice Garden Restaurant" />
                <Select
                  label="Industry Type"
                  options={[
                    { label: 'Restaurant', value: 'restaurant' },
                    { label: 'Retail', value: 'retail' },
                    { label: 'Pharmacy', value: 'pharmacy' },
                    { label: 'Salon', value: 'salon' },
                  ]}
                />
                <Input label="Subdomain slug" placeholder="spice-garden" iconRight={<span className="text-xs">.yourdomain.com</span>} />
              </div>
            )}
            
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input label="First Name" placeholder="Rahul" />
                  <Input label="Last Name" placeholder="Sharma" />
                </div>
                <Input label="Email Address" type="email" placeholder="rahul@example.com" />
                <Input label="Phone Number" placeholder="+91 98765 43210" />
                <Input label="Temporary Password" type="password" placeholder="••••••••" />
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-4">
                <Select
                  label="Primary Industry Template"
                  options={[
                    { label: 'Restaurant & F&B', value: 'restaurant' },
                    { label: 'Retail Fashion', value: 'retail' },
                    { label: 'Supermarket & Grocery', value: 'grocery' },
                    { label: 'Pharmacy & Healthcare', value: 'pharmacy' },
                    { label: 'Salon & Spa', value: 'salon' },
                  ]}
                />
                <Input label="Initial Branch Name" placeholder="Main Branch" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Select label="Tax Inclusiveness" options={[{ label: 'Exclusive (Tax added at checkout)', value: 'exclusive' }, { label: 'Inclusive (Prices include tax)', value: 'inclusive' }]} />
                  <Select label="Receipt Format" options={[{ label: 'Thermal (80mm)', value: '80mm' }, { label: 'A4 Standard', value: 'a4' }]} />
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Select label="Base Currency" options={[{ label: 'INR (₹)', value: 'inr' }, { label: 'USD ($)', value: 'usd' }, { label: 'AED (د.إ)', value: 'aed' }]} />
                  <Select label="Timezone" options={[{ label: 'Asia/Kolkata (+05:30)', value: 'ist' }, { label: 'Asia/Dubai (+04:00)', value: 'gst' }]} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Select label="Date Format" options={[{ label: 'DD/MM/YYYY', value: 'dd/mm/yyyy' }, { label: 'MM/DD/YYYY', value: 'mm/dd/yyyy' }]} />
                  <Select label="System Language" options={[{ label: 'English (US)', value: 'en' }, { label: 'Hindi', value: 'hi' }, { label: 'Arabic', value: 'ar' }]} />
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input label="GSTIN / VAT Number" placeholder="29ABCDE1234F1Z5" />
                  <Input label="PAN / Tax ID" placeholder="ABCDE1234F" />
                </div>
                <Input label="Registered Address" placeholder="123 Business Park, Block A" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input label="City" placeholder="Bengaluru" />
                  <Input label="State" placeholder="Karnataka" />
                </div>
              </div>
            )}

            {currentStep === 5 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {['Starter', 'Growth', 'Professional'].map((plan) => (
                    <div key={plan} className="rounded-lg border border-brand-border bg-brand-light p-4 cursor-pointer hover:border-brand-dark/50">
                      <h4 className="font-medium text-brand-dark">{plan}</h4>
                      <p className="mt-1 text-sm text-brand-muted">₹{plan === 'Starter' ? '999' : plan === 'Growth' ? '2499' : '4999'} / mo</p>
                    </div>
                  ))}
                </div>
                <Select label="Billing Cycle" options={[{ label: 'Monthly', value: 'monthly' }, { label: 'Yearly (20% off)', value: 'yearly' }]} />
              </div>
            )}

            {currentStep === 6 && (
              <div className="space-y-4">
                <div className="rounded-lg bg-brand-light p-4 border border-brand-border">
                  <h4 className="text-sm font-medium text-brand-dark mb-4">Provisioning Summary</h4>
                  <ul className="space-y-3 text-sm text-brand-muted">
                    <li className="flex justify-between"><span>Tenant Schema</span><span className="text-brand-dark">tenant_biz_143</span></li>
                    <li className="flex justify-between"><span>Industry Template</span><span className="text-brand-dark">Restaurant & F&B</span></li>
                    <li className="flex justify-between"><span>Region & Currency</span><span className="text-brand-dark">Asia/Kolkata • INR (₹)</span></li>
                    <li className="flex justify-between"><span>Subscription</span><span className="text-brand-dark">Growth (Monthly)</span></li>
                  </ul>
                </div>
              </div>
            )}
          </div>

          <div className="mt-8 pt-6 border-t border-brand-border flex justify-between">
            <Button variant="ghost" onClick={handlePrev} disabled={currentStep === 0}>
              Back
            </Button>
            <Button onClick={handleNext} loading={loading}>
              {currentStep === steps.length - 1 ? 'Provision Tenant' : 'Continue'}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
