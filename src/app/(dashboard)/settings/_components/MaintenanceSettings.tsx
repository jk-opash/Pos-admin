'use client';

import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Save, AlertTriangle, Power } from 'lucide-react';

export function MaintenanceSettings() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-brand-dark">Maintenance Mode</h2>
        <p className="mt-1 text-sm text-brand-muted">
          Manage system accessibility during updates or scheduled maintenance.
        </p>
      </div>

      <Card className="p-6 border-amber-200 bg-amber-50/30">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-amber-100 text-amber-600 rounded-full shrink-0">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-brand-dark mb-1">Maintenance Status</h3>
            <p className="text-sm text-brand-muted mb-4">
              Enabling maintenance mode will prevent all non-admin users from accessing the system. Active sessions will be gracefully terminated.
            </p>
            
            <div className="flex items-center gap-4">
              <Button className="bg-amber-500 hover:bg-amber-600 text-white gap-2">
                <Power className="h-4 w-4" /> Enable Maintenance Mode
              </Button>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-bold text-brand-dark mb-4 pb-2 border-b border-brand-border">Maintenance Message</h3>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-brand-muted mb-1.5 block">Public Message</label>
            <textarea 
              className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              rows={4}
              defaultValue="Our system is currently undergoing scheduled maintenance. We expect to be back online shortly. Thank you for your patience."
            />
          </div>
          <div>
            <label className="text-sm font-medium text-brand-muted mb-1.5 block">Estimated Time of Completion</label>
            <input 
              type="datetime-local" 
              className="w-full rounded-xl border border-slate-200 p-2.5 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 max-w-sm"
            />
          </div>
        </div>
      </Card>

      <div className="flex justify-end pt-4">
        <Button className="bg-brand-primary hover:bg-brand-primaryDark text-white gap-2">
          <Save className="h-4 w-4" /> Save Maintenance Settings
        </Button>
      </div>
    </div>
  );
}
