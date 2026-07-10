import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { DashboardStats } from '@/types';
import { Activity, Server, Database, ShieldAlert, Cpu, HardDrive } from 'lucide-react';
import { cn } from '@/lib/utils';

export function SystemHealth({ health }: { health: DashboardStats['systemHealth'] }) {
  if (!health) return null;

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Platform Health</CardTitle>
            <CardDescription>Real-time system monitoring</CardDescription>
          </div>
          <div className={cn(
            "px-2.5 py-1 text-xs font-bold rounded-full flex items-center gap-1.5",
            health.status === 'healthy' ? "bg-emerald-100 text-emerald-700" :
            health.status === 'warning' ? "bg-amber-100 text-amber-700" :
            "bg-rose-100 text-rose-700"
          )}>
            <span className={cn(
              "w-2 h-2 rounded-full",
              health.status === 'healthy' ? "bg-emerald-500" :
              health.status === 'warning' ? "bg-amber-500" :
              "bg-rose-500"
            )} />
            <span className="capitalize">{health.status}</span>
          </div>
        </div>
      </CardHeader>

      <div className="space-y-6 mt-4">
        {/* Core Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-brand-light border border-brand-border">
            <div className="flex items-center gap-2 mb-2 text-brand-muted">
              <Server className="h-4 w-4" />
              <span className="text-sm font-medium">API Uptime</span>
            </div>
            <p className="text-2xl font-bold text-brand-dark">{health.apiUptime}%</p>
          </div>
          <div className="p-4 rounded-lg bg-brand-light border border-brand-border">
            <div className="flex items-center gap-2 mb-2 text-brand-muted">
              <Activity className="h-4 w-4" />
              <span className="text-sm font-medium">Active Sessions</span>
            </div>
            <p className="text-2xl font-bold text-brand-dark">{health.activeSessions}</p>
          </div>
        </div>

        {/* Resource Usage */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-brand-dark">Resource Usage</h4>
          
          <div className="space-y-1.5">
            <div className="flex justify-between text-sm">
              <div className="flex items-center gap-2 text-brand-muted">
                <Cpu className="h-4 w-4" />
                <span>Server CPU</span>
              </div>
              <span className="font-medium text-brand-dark">{health.serverCpu}%</span>
            </div>
            <div className="w-full bg-brand-border rounded-full h-2">
              <div className="bg-brand-info h-2 rounded-full" style={{ width: `${health.serverCpu}%` }} />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-sm">
              <div className="flex items-center gap-2 text-brand-muted">
                <HardDrive className="h-4 w-4" />
                <span>Memory</span>
              </div>
              <span className="font-medium text-brand-dark">{health.serverMemory}%</span>
            </div>
            <div className="w-full bg-brand-border rounded-full h-2">
              <div className="bg-brand-purple h-2 rounded-full" style={{ width: `${health.serverMemory}%` }} />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-sm">
              <div className="flex items-center gap-2 text-brand-muted">
                <Database className="h-4 w-4" />
                <span>Database Load</span>
              </div>
              <span className="font-medium text-brand-dark">{health.databaseLoad}%</span>
            </div>
            <div className="w-full bg-brand-border rounded-full h-2">
              <div className="bg-brand-warning h-2 rounded-full" style={{ width: `${health.databaseLoad}%` }} />
            </div>
          </div>
        </div>
        
        {/* Security Summary */}
        <div className="mt-6 pt-6 border-t border-brand-border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-rose-50 text-rose-500 rounded-lg">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-brand-dark">3 Failed Login Attempts</p>
              <p className="text-xs text-brand-muted">In the last 24 hours</p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
