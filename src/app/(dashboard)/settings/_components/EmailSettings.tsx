'use client';

import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Save, Mail } from 'lucide-react';

export function EmailSettings() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-brand-dark">Email (SMTP) Integrations</h2>
        <p className="mt-1 text-sm text-brand-muted">
          Configure SMTP settings for sending system emails like invoices, receipts, and alerts.
        </p>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-bold text-brand-dark mb-4 pb-2 border-b border-brand-border">SMTP Configuration</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-medium text-brand-muted mb-1.5 block">SMTP Host</label>
            <Input defaultValue="smtp.sendgrid.net" />
          </div>
          <div>
            <label className="text-sm font-medium text-brand-muted mb-1.5 block">SMTP Port</label>
            <Input defaultValue="587" />
          </div>
          <div>
            <label className="text-sm font-medium text-brand-muted mb-1.5 block">SMTP Username</label>
            <Input defaultValue="apikey" />
          </div>
          <div>
            <label className="text-sm font-medium text-brand-muted mb-1.5 block">SMTP Password</label>
            <Input type="password" defaultValue="************************" />
          </div>
          <div>
            <label className="text-sm font-medium text-brand-muted mb-1.5 block">Encryption</label>
            <Select 
              defaultValue="tls"
              options={[
                { label: 'TLS', value: 'tls' },
                { label: 'SSL', value: 'ssl' },
                { label: 'None', value: 'none' }
              ]}
            />
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-bold text-brand-dark mb-4 pb-2 border-b border-brand-border">Sender Identity</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-medium text-brand-muted mb-1.5 block">From Name</label>
            <Input defaultValue="UniversalPOS System" />
          </div>
          <div>
            <label className="text-sm font-medium text-brand-muted mb-1.5 block">From Email Address</label>
            <Input defaultValue="noreply@universalpos.com" type="email" />
          </div>
        </div>
      </Card>

      <div className="flex justify-end pt-4 gap-3">
        <Button variant="outline" className="gap-2">
          <Mail className="h-4 w-4" /> Send Test Email
        </Button>
        <Button className="bg-brand-primary hover:bg-brand-primaryDark text-white gap-2">
          <Save className="h-4 w-4" /> Save Email Settings
        </Button>
      </div>
    </div>
  );
}
