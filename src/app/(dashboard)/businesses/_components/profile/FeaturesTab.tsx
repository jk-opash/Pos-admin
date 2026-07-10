import { Business } from "@/types";
import { Card } from "@/components/ui/Card";
import { useState } from "react";

export function FeaturesTab({ business }: { business: Business }) {
  const [features, setFeatures] = useState({
    loyalty: true,
    advancedAnalytics: false,
    apiAccess: true,
    multiBranch: business.subscription.plan === 'enterprise' || business.subscription.plan === 'professional',
    customDomain: false
  });

  const toggle = (key: keyof typeof features) => {
    setFeatures(f => ({ ...f, [key]: !f[key] }));
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300 ease-spring">
      <Card>
        <h3 className="text-lg font-bold text-brand-dark mb-1">Platform Features</h3>
        <p className="text-sm text-brand-muted mb-6">Enable or disable specific modules for this tenant.</p>
        
        <div className="space-y-4">
          <FeatureToggle 
            title="Loyalty Program" 
            description="Allow business to create and manage customer loyalty points."
            enabled={features.loyalty}
            onToggle={() => toggle('loyalty')}
          />
          <FeatureToggle 
            title="Advanced Analytics" 
            description="Deep insights, predictive trends, and custom report builder."
            enabled={features.advancedAnalytics}
            onToggle={() => toggle('advancedAnalytics')}
          />
          <FeatureToggle 
            title="API Access" 
            description="Allow integrations with third-party apps via Developer API."
            enabled={features.apiAccess}
            onToggle={() => toggle('apiAccess')}
          />
          <FeatureToggle 
            title="Multi-Branch Management" 
            description="Manage inventory and staff across multiple physical locations."
            enabled={features.multiBranch}
            onToggle={() => toggle('multiBranch')}
          />
        </div>
      </Card>
    </div>
  );
}

function FeatureToggle({ title, description, enabled, onToggle }: { title: string, description: string, enabled: boolean, onToggle: () => void }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border border-brand-border rounded-lg">
      <div>
        <h4 className="font-medium text-brand-dark">{title}</h4>
        <p className="text-sm text-brand-muted mt-0.5">{description}</p>
      </div>
      <button 
        onClick={onToggle}
        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${enabled ? 'bg-brand-success' : 'bg-gray-200'}`}
      >
        <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${enabled ? 'translate-x-5' : 'translate-x-0'}`} />
      </button>
    </div>
  );
}
