'use client';

import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Save, Smartphone, MessageSquare } from 'lucide-react';

export function SMSSettings() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-brand-dark">SMS & WhatsApp Integrations</h2>
        <p className="mt-1 text-sm text-brand-muted">
          Configure external providers like Twilio for SMS and WhatsApp messaging.
        </p>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-bold text-brand-dark mb-4 pb-2 border-b border-brand-border">Provider Configuration</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-medium text-brand-muted mb-1.5 block">Service Provider</label>
            <Select 
              defaultValue="twilio"
              options={[
                { label: 'Twilio', value: 'twilio' },
                { label: 'MessageBird', value: 'messagebird' },
                { label: 'Vonage (Nexmo)', value: 'vonage' }
              ]}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-brand-muted mb-1.5 block">Account SID</label>
            <Input placeholder="Enter your Twilio Account SID" />
          </div>
          <div className="md:col-span-2">
            <label className="text-sm font-medium text-brand-muted mb-1.5 block">Auth Token</label>
            <Input type="password" defaultValue="********************************" />
          </div>
          <div>
            <label className="text-sm font-medium text-brand-muted mb-1.5 block">Sender ID / Phone Number (SMS)</label>
            <Input defaultValue="+1234567890" />
          </div>
          <div>
            <label className="text-sm font-medium text-brand-muted mb-1.5 block">WhatsApp Number</label>
            <Input defaultValue="whatsapp:+1234567890" />
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-bold text-brand-dark mb-4 pb-2 border-b border-brand-border">Message Templates</h3>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-brand-muted mb-1.5 block">Order Confirmation Template</label>
            <textarea 
              className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              rows={3}
              defaultValue="Hi {{customer_name}}, your order {{order_id}} has been confirmed. Total: {{amount}}. Thanks for shopping with us!"
            />
            <p className="text-xs text-brand-placeholder mt-1">Available variables: {'{{customer_name}}, {{order_id}}, {{amount}}'}</p>
          </div>
        </div>
      </Card>

      <div className="flex justify-end pt-4 gap-3">
        <Button variant="outline" className="gap-2">
          <MessageSquare className="h-4 w-4" /> Send Test SMS
        </Button>
        <Button className="bg-brand-primary hover:bg-brand-primaryDark text-white gap-2">
          <Save className="h-4 w-4" /> Save SMS Settings
        </Button>
      </div>
    </div>
  );
}
