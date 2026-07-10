'use client';

import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Save } from 'lucide-react';

export function GeneralSettings() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-brand-dark">General Settings</h2>
        <p className="mt-1 text-sm text-brand-muted">
          Configure core platform information, localization, and regional defaults.
        </p>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-bold text-brand-dark mb-4 pb-2 border-b border-brand-border">Platform Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-medium text-brand-muted mb-1.5 block">Platform Name</label>
            <Input defaultValue="UniversalPOS" />
          </div>
          <div>
            <label className="text-sm font-medium text-brand-muted mb-1.5 block">Company Name</label>
            <Input defaultValue="UniversalPOS Technologies Inc." />
          </div>
          <div>
            <label className="text-sm font-medium text-brand-muted mb-1.5 block">Support Email</label>
            <Input defaultValue="support@universalpos.com" type="email" />
          </div>
          <div>
            <label className="text-sm font-medium text-brand-muted mb-1.5 block">Help Center URL</label>
            <Input defaultValue="https://help.universalpos.com" />
          </div>
          <div className="md:col-span-2">
            <label className="text-sm font-medium text-brand-muted mb-1.5 block">Company Address</label>
            <Input defaultValue="123 Tech Park, Suite 400, San Francisco, CA 94107" />
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-bold text-brand-dark mb-4 pb-2 border-b border-brand-border">Localization</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-medium text-brand-muted mb-1.5 block">Default Language</label>
            <Select 
              defaultValue="en"
              options={[
                { label: 'English (US)', value: 'en' },
                { label: 'Spanish (ES)', value: 'es' },
                { label: 'French (FR)', value: 'fr' }
              ]}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-brand-muted mb-1.5 block">System Time Zone</label>
            <Select 
              defaultValue="utc"
              options={[
                { label: 'UTC (Coordinated Universal Time)', value: 'utc' },
                { label: 'EST (Eastern Standard Time)', value: 'est' },
                { label: 'IST (Indian Standard Time)', value: 'ist' }
              ]}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-brand-muted mb-1.5 block">Date Format</label>
            <Select 
              defaultValue="mm-dd-yyyy"
              options={[
                { label: 'MM/DD/YYYY', value: 'mm-dd-yyyy' },
                { label: 'DD/MM/YYYY', value: 'dd-mm-yyyy' },
                { label: 'YYYY-MM-DD', value: 'yyyy-mm-dd' }
              ]}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-brand-muted mb-1.5 block">Time Format</label>
            <Select 
              defaultValue="12h"
              options={[
                { label: '12 Hour (AM/PM)', value: '12h' },
                { label: '24 Hour', value: '24h' }
              ]}
            />
          </div>
        </div>
      </Card>

      <div className="flex justify-end pt-4">
        <Button className="bg-brand-primary hover:bg-brand-primaryDark text-white gap-2">
          <Save className="h-4 w-4" /> Save General Settings
        </Button>
      </div>
    </div>
  );
}
