import { Business } from "@/types";
import { Card } from "@/components/ui/Card";
import { formatDate } from "@/lib/utils";
import { Activity, Key, LogIn, AlertTriangle } from "lucide-react";

// Use static dates for mock data to avoid impurities during render
const baseTime = new Date('2024-03-10T12:00:00Z').getTime();
const mockLogs = [
  { id: 1, action: "Business details updated", user: "Platform Admin", time: new Date(baseTime).toISOString(), icon: <Activity className="h-4 w-4 text-blue-500" /> },
  { id: 2, action: "Owner password reset requested", user: "Platform Admin", time: new Date(baseTime - 86400000).toISOString(), icon: <Key className="h-4 w-4 text-amber-500" /> },
  { id: 3, action: "Owner logged in", user: "Owner", time: new Date(baseTime - 172800000).toISOString(), icon: <LogIn className="h-4 w-4 text-green-500" /> },
  { id: 4, action: "Failed payment attempt", user: "System", time: new Date(baseTime - 259200000).toISOString(), icon: <AlertTriangle className="h-4 w-4 text-red-500" /> },
];

export function AuditTab({ business }: { business: Business }) {
  // Update the 'Owner logged in' log with the actual owner name for realism
  const logsWithRealNames = [...mockLogs];
  logsWithRealNames[2].user = business.owner.name;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300 ease-spring">
      <Card>
        <h3 className="text-lg font-bold text-brand-dark mb-1">Audit Logs</h3>
        <p className="text-sm text-brand-muted mb-6">Recent activity and system events for this business.</p>
        
        <div className="space-y-4">
          {logsWithRealNames.map(log => (
            <div key={log.id} className="flex gap-4 p-4 rounded-lg bg-brand-light border border-brand-border">
              <div className="mt-0.5 shrink-0">{log.icon}</div>
              <div className="flex-1">
                <p className="text-sm font-medium text-brand-dark">{log.action}</p>
                <div className="flex items-center gap-2 mt-1 text-xs text-brand-muted">
                  <span>{log.user}</span>
                  <span>•</span>
                  <span>{formatDate(log.time)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
