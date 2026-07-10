'use client';

import { StatsCard } from '@/components/ui/StatsCard';
import { Card } from '@/components/ui/Card';
import { CheckCircle2, Server, Database, ShieldCheck, Mail, Activity, HardDrive, Smartphone } from 'lucide-react';

export function SettingsOverview() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-brand-dark">System Health & Overview</h2>
        <p className="mt-1 text-sm text-brand-muted">
          Real-time status of platform services and core infrastructure.
        </p>
      </div>

      {/* Primary KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Platform Version" value="v4.2.0-stable" icon={<Server className="h-5 w-5 text-indigo-500" />} />
        <StatsCard title="Active Businesses" value="1,245" icon={<Activity className="h-5 w-5 text-emerald-500" />} />
        <StatsCard title="Storage Usage" value="4.2 TB / 10 TB" icon={<HardDrive className="h-5 w-5 text-blue-500" />} />
        <StatsCard title="System Status" value="Healthy" icon={<CheckCircle2 className="h-5 w-5 text-emerald-500" />} />
      </div>

      {/* Service Status Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <Card className="p-0 overflow-hidden">
          <div className="bg-brand-light px-4 py-3 border-b border-brand-border">
            <h3 className="font-semibold text-brand-dark">Core Infrastructure</h3>
          </div>
          <div className="divide-y divide-brand-border">
            <StatusRow label="Primary Database" status="Operational" icon={<Database className="h-4 w-4" />} />
            <StatusRow label="API Gateway" status="Operational" icon={<Activity className="h-4 w-4" />} />
            <StatusRow label="SSL Certificate" status="Valid (90 days left)" icon={<ShieldCheck className="h-4 w-4" />} />
            <StatusRow label="Background Workers" status="Operational" icon={<Server className="h-4 w-4" />} />
          </div>
        </Card>

        <Card className="p-0 overflow-hidden">
          <div className="bg-brand-light px-4 py-3 border-b border-brand-border">
            <h3 className="font-semibold text-brand-dark">External Integrations</h3>
          </div>
          <div className="divide-y divide-brand-border">
            <StatusRow label="Email Service (SendGrid)" status="Operational" icon={<Mail className="h-4 w-4" />} />
            <StatusRow label="SMS Gateway (Twilio)" status="Operational" icon={<Smartphone className="h-4 w-4" />} />
            <StatusRow label="Payment Gateway (Stripe)" status="Operational" icon={<Activity className="h-4 w-4" />} />
            <StatusRow label="Cloud Storage (AWS S3)" status="Operational" icon={<HardDrive className="h-4 w-4" />} />
          </div>
        </Card>

      </div>
    </div>
  );
}

function StatusRow({ label, status, icon }: { label: string, status: string, icon: React.ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-4 py-3">
      <div className="flex items-center gap-3">
        <div className="text-brand-muted">{icon}</div>
        <span className="text-sm font-medium text-brand-dark">{label}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
        </span>
        <span className="text-xs text-brand-muted">{status}</span>
      </div>
    </div>
  );
}
