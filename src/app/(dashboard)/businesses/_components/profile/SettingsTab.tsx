/* eslint-disable @typescript-eslint/no-unused-vars */
import { Business } from "@/types";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { AlertTriangle, Download, Key, Trash2 } from "lucide-react";

export function SettingsTab({ business }: { business: Business }) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300 ease-spring">
      <Card>
        <h3 className="text-lg font-bold text-brand-dark mb-1">Danger Zone</h3>
        <p className="text-sm text-brand-muted mb-6">
          Advanced administrative actions. Please proceed with caution.
        </p>

        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border border-brand-border rounded-lg">
            <div className="flex gap-3">
              <Key className="h-5 w-5 text-brand-primary shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-brand-dark">
                  Reset Owner Password
                </h4>
                <p className="text-sm text-brand-muted mt-0.5">
                  Send a password reset link to the primary owner email.
                </p>
              </div>
            </div>
            <Button variant="outline">Reset Password</Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
