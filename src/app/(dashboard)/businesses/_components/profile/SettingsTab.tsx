/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
import { Business } from "@/types";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { AlertTriangle, Download, Key, Trash2 } from "lucide-react";
import { useAppDispatch } from "@/store/hooks";
import { resetBusinessOwnerPassword } from "@/store/slices/businessSlice";

export function SettingsTab({ business }: { business: Business }) {
  const dispatch = useAppDispatch();
  const [isResetting, setIsResetting] = useState(false);
  const [newPassword, setNewPassword] = useState<string | null>(null);
  const [customPassword, setCustomPassword] = useState("");

  const handleResetPassword = async () => {
    if (!confirm("Are you sure you want to reset the owner's password?")) return;
    
    setIsResetting(true);
    setNewPassword(null);
    try {
      const response = await dispatch(
        resetBusinessOwnerPassword({ id: business.id, newPassword: customPassword || undefined })
      ).unwrap();
      setNewPassword(response.newPassword);
      setCustomPassword(""); // Clear the input field after successful reset
    } catch (error) {
      console.error("Failed to reset password:", error);
      // Let global interceptor or unwrap handle error toasts if they do.
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300 ease-spring">
      <Card>
        <h3 className="text-lg font-bold text-brand-dark mb-1">Danger Zone</h3>
        <p className="text-sm text-brand-muted mb-6">
          Advanced administrative actions. Please proceed with caution.
        </p>

        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 p-4 border border-brand-border rounded-lg">
            <div className="flex gap-3">
              <Key className="h-5 w-5 text-brand-primary shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-medium text-brand-dark">
                  Reset Owner Password
                </h4>
                <p className="text-sm text-brand-muted mt-0.5">
                  Set a custom password or leave blank to generate a random one.
                </p>
                <div className="mt-3 flex gap-2 items-center max-w-sm">
                  <Input 
                    type="text" 
                    placeholder="Enter custom password..." 
                    value={customPassword}
                    onChange={(e) => setCustomPassword(e.target.value)}
                    disabled={isResetting}
                  />
                  <Button 
                    variant="outline" 
                    onClick={handleResetPassword}
                    disabled={isResetting}
                    className="shrink-0"
                  >
                    {isResetting ? "Resetting..." : "Reset Password"}
                  </Button>
                </div>
                {newPassword && (
                  <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
                    <p className="text-sm text-green-800 font-medium">Password reset successful!</p>
                    <p className="text-sm text-green-900 mt-1">
                      New Password: <span className="font-bold font-mono bg-white px-2 py-1 rounded">{newPassword}</span>
                    </p>
                    <p className="text-xs text-green-700 mt-1">Please copy this password and share it with the owner securely.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
