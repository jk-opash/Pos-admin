'use client';

import { useState } from 'react';
import { mockPlatformFeatures } from '@/lib/mock/features';
import { FeatureFlagTable } from '@/app/(dashboard)/feature-flags/_components/FeatureFlagTable';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { StatsCard } from '@/components/ui/StatsCard';
import { Modal } from '@/components/ui/Modal';
import { Search, Plus, Filter, Sparkles, Box, ShieldAlert, Rocket } from 'lucide-react';
import { PlatformFeature, FeatureCategory, FeatureType, RolloutStrategy } from '@/types';

export default function FeatureManagementPage() {
  const [features, setFeatures] = useState<PlatformFeature[]>(mockPlatformFeatures);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFeatureId, setEditingFeatureId] = useState<string | null>(null);
  const [newFeature, setNewFeature] = useState<Partial<PlatformFeature>>({
    code: '',
    name: '',
    description: '',
    category: 'core' as FeatureCategory,
    type: 'add_on' as FeatureType,
    rolloutStrategy: 'percentage' as RolloutStrategy,
    rolloutPercentage: 0,
    dependencies: [],
  });

  const filteredFeatures = features.filter((feat) => {
    const matchesSearch =
      feat.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feat.description.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesCategory = categoryFilter === 'all' || feat.category === categoryFilter;
    const matchesType = typeFilter === 'all' || feat.type === typeFilter;

    return matchesSearch && matchesCategory && matchesType;
  });

  // KPI Calculations
  const activeCount = features.filter(f => f.status === 'active').length;
  const premiumCount = features.filter(f => f.type === 'premium').length;
  const betaCount = features.filter(f => f.status === 'beta').length;

  const handleToggle = (id: string) => {
    setFeatures(features.map(feat => {
      if (feat.id === id && (feat.status === 'active' || feat.status === 'disabled')) {
        return { ...feat, status: feat.status === 'active' ? 'disabled' : 'active' };
      }
      return feat;
    }));
  };

  const handleEdit = (feature: PlatformFeature) => {
    setEditingFeatureId(feature.id);
    setNewFeature(feature);
    setIsModalOpen(true);
  };

  const handleOpenCreate = () => {
    setEditingFeatureId(null);
    setNewFeature({ code: '', name: '', description: '', category: 'core', type: 'add_on', rolloutStrategy: 'percentage', rolloutPercentage: 0, dependencies: [] });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingFeatureId(null);
    setNewFeature({ code: '', name: '', description: '', category: 'core', type: 'add_on', rolloutStrategy: 'percentage', rolloutPercentage: 0, dependencies: [] });
  };

  const handleSave = () => {
    if (!newFeature.code || !newFeature.name) return;
    
    if (editingFeatureId) {
      setFeatures(features.map(f => f.id === editingFeatureId ? { ...f, ...newFeature } as PlatformFeature : f));
    } else {
      const featureToAdd: PlatformFeature = {
        id: `feat_${Date.now()}`,
        code: newFeature.code,
        name: newFeature.name,
        description: newFeature.description || '',
        category: newFeature.category as FeatureCategory,
        type: newFeature.type as FeatureType,
        status: 'disabled',
        dependencies: newFeature.dependencies || [],
        enabledForPlans: ["enterprise"],
        enabledForIndustries: ["all"],
        rolloutStrategy: newFeature.rolloutStrategy as RolloutStrategy,
        rolloutPercentage: newFeature.rolloutPercentage || 0,
        version: "1.0.0",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      setFeatures([featureToAdd, ...features]);
    }
    
    closeModal();
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-brand-dark">Feature Management</h2>
          <p className="mt-1 text-sm text-brand-muted">
            Control modules, dependencies, and rollout strategies across industries and plans.
          </p>
        </div>
        <Button onClick={handleOpenCreate} className="bg-brand-primary hover:bg-brand-primaryDark text-white gap-2">
          <Plus className="h-4 w-4" /> Create Feature
        </Button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Total Features" value={features.length} icon={<Box className="h-5 w-5 text-indigo-500" />} />
        <StatsCard title="Active & Live" value={activeCount} icon={<CheckCircle2 className="h-5 w-5 text-emerald-500" />} />
        <StatsCard title="Beta Testing" value={betaCount} icon={<Rocket className="h-5 w-5 text-purple-500" />} />
        <StatsCard title="Premium Modules" value={premiumCount} icon={<Sparkles className="h-5 w-5 text-amber-500" />} />
      </div>

      <div className="rounded-2xl border border-brand-border bg-white shadow-sm p-6 space-y-4">
        {/* Filters Toolbar */}
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="w-full lg:w-96 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-placeholder" />
            <input
              type="text"
              placeholder="Search by code, name or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-brand-border text-sm focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary"
            />
          </div>
          <div className="flex w-full lg:w-auto gap-3">
            <div className="w-full lg:w-40">
              <Select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                options={[
                  { label: 'All Categories', value: 'all' },
                  { label: 'Core', value: 'core' },
                  { label: 'Inventory', value: 'inventory' },
                  { label: 'Restaurant', value: 'restaurant' },
                  { label: 'AI', value: 'ai' },
                ]}
              />
            </div>
            <div className="w-full lg:w-40">
              <Select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                options={[
                  { label: 'All Types', value: 'all' },
                  { label: 'Core', value: 'core' },
                  { label: 'Premium', value: 'premium' },
                  { label: 'Add-on', value: 'add_on' },
                  { label: 'Beta', value: 'beta' },
                ]}
              />
            </div>
            <Button variant="outline" className="px-3">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <FeatureFlagTable data={filteredFeatures} onToggle={handleToggle} onEdit={handleEdit} />
      </div>
      
      {/* Create Feature Modal */}
      <Modal isOpen={isModalOpen} onClose={closeModal} title={editingFeatureId ? "Edit Feature" : "Register New Feature"} size="2xl">
        <div className="flex flex-col h-[550px] -mx-6 -mb-6 -mt-4 border-t border-brand-border/50 bg-white/50 relative overflow-hidden">
          
          <div className="flex-1 p-8 overflow-y-auto pb-24">
            <div className="bg-brand-primary/10 border border-brand-primary/20 text-brand-primary p-4 rounded-xl text-sm flex gap-3 mb-6 items-start shadow-sm">
              <ShieldAlert className="h-5 w-5 shrink-0 mt-0.5" />
              <p>Features registered here must exist in the application codebase. This dashboard controls their visibility and rollout rules.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="col-span-2">
                <label className="text-xs font-bold text-brand-muted uppercase tracking-wider mb-2 block">Feature Code *</label>
                <Input 
                  value={newFeature.code}
                  onChange={(e) => setNewFeature({ ...newFeature, code: e.target.value })}
                  placeholder="e.g. pos_kitchen_display"
                />
                <p className="text-[10px] text-brand-muted mt-1.5 ml-1">Must match the code used in the application source.</p>
              </div>

              <div className="col-span-2">
                <label className="text-xs font-bold text-brand-muted uppercase tracking-wider mb-2 block">Display Name *</label>
                <Input 
                  value={newFeature.name}
                  onChange={(e) => setNewFeature({ ...newFeature, name: e.target.value })}
                  placeholder="e.g. Kitchen Display System"
                />
              </div>

              <div className="col-span-2">
                <label className="text-xs font-bold text-brand-muted uppercase tracking-wider mb-2 block">Description</label>
                <textarea 
                  value={newFeature.description}
                  onChange={(e) => setNewFeature({ ...newFeature, description: e.target.value })}
                  placeholder="Briefly describe what this feature does..."
                  className="w-full rounded-xl border border-slate-200 bg-white/70 px-4 py-3 text-sm focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all"
                  rows={3}
                />
              </div>

              <div>
                <label className="text-xs font-bold text-brand-muted uppercase tracking-wider mb-2 block">Category</label>
                <Select 
                  value={newFeature.category as string}
                  onChange={(e) => setNewFeature({ ...newFeature, category: e.target.value as FeatureCategory })}
                  options={[
                    { label: 'Core', value: 'core' },
                    { label: 'Inventory', value: 'inventory' },
                    { label: 'Restaurant', value: 'restaurant' },
                    { label: 'AI', value: 'ai' },
                    { label: 'Integrations', value: 'integrations' }
                  ]}
                />
              </div>

              <div>
                <label className="text-xs font-bold text-brand-muted uppercase tracking-wider mb-2 block">Feature Type</label>
                <Select 
                  value={newFeature.type as string}
                  onChange={(e) => setNewFeature({ ...newFeature, type: e.target.value as FeatureType })}
                  options={[
                    { label: 'Core', value: 'core' },
                    { label: 'Premium', value: 'premium' },
                    { label: 'Add-on', value: 'add_on' },
                    { label: 'Beta', value: 'beta' }
                  ]}
                />
              </div>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-brand-border/50 bg-white/70 backdrop-blur-xl flex justify-end gap-3 z-10">
            <Button variant="outline" onClick={closeModal} className="bg-white hover:bg-slate-50 border-slate-200">Cancel</Button>
            <Button onClick={handleSave} className="bg-brand-primary hover:bg-brand-primaryDark text-white px-8 shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5">{editingFeatureId ? "Save Changes" : "Create Feature"}</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

// Temporary import for CheckCircle2 since I removed it above
import { CheckCircle2 } from 'lucide-react';
