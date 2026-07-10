import { Business } from "@/types";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { AlertTriangle, Download, Key, Trash2 } from "lucide-react";

export function SettingsTab({ business }: { business: Business }) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300 ease-spring">
      <Card>
        <h3 className="text-lg font-bold text-brand-dark mb-1">Danger Zone</h3>
        <p className="text-sm text-brand-muted mb-6">Advanced administrative actions. Please proceed with caution.</p>
        
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border border-brand-border rounded-lg">
            <div className="flex gap-3">
              <Key className="h-5 w-5 text-brand-primary shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-brand-dark">Reset Owner Password</h4>
                <p className="text-sm text-brand-muted mt-0.5">Send a password reset link to the primary owner email.</p>
              </div>
            </div>
            <Button variant="outline">Reset Password</Button>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border border-brand-border rounded-lg">
            <div className="flex gap-3">
              <Download className="h-5 w-5 text-brand-success shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-brand-dark">Export Tenant Data</h4>
                <p className="text-sm text-brand-muted mt-0.5">Download a complete backup of this business&apos;s data.</p>
              </div>
            </div>
            <Button variant="outline">Export Data</Button>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border border-red-200 bg-red-50 rounded-lg">
            <div className="flex gap-3">
              <AlertTriangle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-red-900">Suspend Business</h4>
                <p className="text-sm text-red-700 mt-0.5">Temporarily disable access for all users in this business.</p>
              </div>
            </div>
            <Button variant="danger" className="bg-red-600 hover:bg-red-700 text-white shadow-none border-none">Suspend</Button>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border border-red-200 bg-red-50 rounded-lg">
            <div className="flex gap-3">
              <Trash2 className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-red-900">Delete Business</h4>
                <p className="text-sm text-red-700 mt-0.5">Permanently delete this business and all associated data.</p>
              </div>
            </div>
            <Button variant="danger" className="bg-red-600 hover:bg-red-700 text-white shadow-none border-none">Delete Permanently</Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
