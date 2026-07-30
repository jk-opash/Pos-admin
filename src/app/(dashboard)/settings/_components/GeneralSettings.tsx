"use client";

import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateUserSettings } from "@/store/slices/authSlice";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Save } from "lucide-react";
import api from "@/lib/axios";

export function GeneralSettings() {
  const user = useSelector((state: any) => state.auth.user);
  
  const [generalData, setGeneralData] = useState({
    platformName: user?.general_data?.platformName || "",
    companyName: user?.general_data?.companyName || "",
    supportEmail: user?.general_data?.supportEmail || "",
    helpCenterUrl: user?.general_data?.helpCenterUrl || "",
    companyAddress: user?.general_data?.companyAddress || "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user && user.general_data) {
      setGeneralData(user.general_data);
    }
  }, [user]);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await api.put("/auth/superadmin/settings", {
        general_data: generalData,
      });
      dispatch(updateUserSettings({ general_data: generalData }));
      alert("General settings updated successfully!");
    } catch (error) {
      console.error("Failed to update settings", error);
      alert("Failed to update settings");
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setGeneralData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-brand-dark">General Settings</h2>
        <p className="mt-1 text-sm text-brand-muted">
          Configure core platform information, localization, and regional
          defaults.
        </p>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-bold text-brand-dark mb-4 pb-2 border-b border-brand-border">
          Platform Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-medium text-brand-muted mb-1.5 block">
              Platform Name
            </label>
            <Input name="platformName" value={generalData.platformName} onChange={handleChange} />
          </div>
          <div>
            <label className="text-sm font-medium text-brand-muted mb-1.5 block">
              Company Name
            </label>
            <Input name="companyName" value={generalData.companyName} onChange={handleChange} />
          </div>
          <div>
            <label className="text-sm font-medium text-brand-muted mb-1.5 block">
              Support Email
            </label>
            <Input name="supportEmail" value={generalData.supportEmail} onChange={handleChange} type="email" />
          </div>
          <div>
            <label className="text-sm font-medium text-brand-muted mb-1.5 block">
              Help Center URL
            </label>
            <Input name="helpCenterUrl" value={generalData.helpCenterUrl} onChange={handleChange} />
          </div>
          <div className="md:col-span-2">
            <label className="text-sm font-medium text-brand-muted mb-1.5 block">
              Company Address
            </label>
            <Input name="companyAddress" value={generalData.companyAddress} onChange={handleChange} />
          </div>
        </div>
      </Card>

      <div className="flex justify-end pt-4">
        <Button onClick={handleSave} disabled={isSaving} className="bg-brand-primary hover:bg-brand-primaryDark text-white gap-2">
          <Save className="h-4 w-4" /> {isSaving ? "Saving..." : "Save General Settings"}
        </Button>
      </div>
    </div>
  );
}
