'use client';

import { useState } from 'react';
import { mockPlatformFeatures } from '@/lib/mock/features';
import { FeatureFlagTable } from '@/app/(dashboard)/feature-flags/_components/FeatureFlagTable';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { StatsCard } from '@/components/ui/StatsCard';
import { Modal } from '@/components/ui/Modal';
import { Search, Plus, Filter, Sparkles, Box, ShieldAlert, Rocket, CheckCircle2 } from 'lucide-react';
import { PlatformFeature, FeatureCategory, FeatureType, RolloutStrategy } from '@/types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const featureSchema = z.object({
  code: z.string().min(1, 'Feature Code is required').regex(/^[a-z0-9_]+$/, 'Must be snake_case, lowercase letters, numbers, and underscores only'),
  name: z.string().min(1, 'Display Name is required'),
  description: z.string().optional(),
  category: z.string(),
  type: z.string(),
});

type FeatureFormValues = z.infer<typeof featureSchema>;

export default function FeatureManagementPage() {
  const [features, setFeatures] = useState<PlatformFeature[]>(mockPlatformFeatures);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFeatureId, setEditingFeatureId] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<FeatureFormValues>({
    resolver: zodResolver(featureSchema),
    defaultValues: {
      code: '',
      name: '',
      description: '',
      category: 'core',
      type: 'add_on',
    }
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
    reset({
      code: feature.code,
      name: feature.name,
      description: feature.description || '',
      category: feature.category,
      type: feature.type,
    });
    setIsModalOpen(true);
  };

  const handleOpenCreate = () => {
    setEditingFeatureId(null);
    reset({
      code: '',
      name: '',
      description: '',
      category: 'core',
      type: 'add_on',
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingFeatureId(null);
    reset();
  };

  const onSubmit = (data: FeatureFormValues) => {
    if (editingFeatureId) {
      setFeatures(features.map(f => f.id === editingFeatureId ? { ...f, ...data } as PlatformFeature : f));
    } else {
      const featureToAdd: PlatformFeature = {
        id: `feat_${Date.now()}`,
        code: data.code,
        name: data.name,
        description: data.description || '',
        category: data.category as FeatureCategory,
        type: data.type as FeatureType,
        status: 'disabled',
        dependencies: [],
        enabledForPlans: ["enterprise"],
        enabledForIndustries: ["all"],
        rolloutStrategy: 'percentage' as RolloutStrategy,
        rolloutPercentage: 0,
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
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col h-[550px] -mx-6 -mb-6 -mt-4 border-t border-brand-border/50 bg-white/50 relative overflow-hidden">
          
          <div className="flex-1 p-8 overflow-y-auto pb-24">
            <div className="bg-brand-primary/10 border border-brand-primary/20 text-brand-primary p-4 rounded-xl text-sm flex gap-3 mb-6 items-start shadow-sm">
              <ShieldAlert className="h-5 w-5 shrink-0 mt-0.5" />
              <p>Features registered here must exist in the application codebase. This dashboard controls their visibility and rollout rules.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="col-span-2">
                <label className="text-xs font-bold text-brand-muted uppercase tracking-wider mb-2 block">Feature Code *</label>
                <Input 
                  {...register('code')}
                  error={errors.code?.message}
                  placeholder="e.g. pos_kitchen_display"
                />
                <p className="text-[10px] text-brand-muted mt-1.5 ml-1">Must match the code used in the application source.</p>
              </div>

              <div className="col-span-2">
                <label className="text-xs font-bold text-brand-muted uppercase tracking-wider mb-2 block">Display Name *</label>
                <Input 
                  {...register('name')}
                  error={errors.name?.message}
                  placeholder="e.g. Kitchen Display System"
                />
              </div>

              <div className="col-span-2">
                <label className="text-xs font-bold text-brand-muted uppercase tracking-wider mb-2 block">Description</label>
                <div className="flex flex-col gap-1.5">
                  <textarea 
                    {...register('description')}
                    placeholder="Briefly describe what this feature does..."
                    className={`w-full rounded-xl border ${errors.description ? 'border-brand-danger bg-red-50/30' : 'border-brand-border bg-white'} px-4 py-3 text-sm focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all`}
                    rows={3}
                  />
                  {errors.description && <p className="text-xs font-medium text-brand-danger">{errors.description.message}</p>}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-brand-muted uppercase tracking-wider mb-2 block">Category</label>
                <Select 
                  {...register('category')}
                  error={errors.category?.message}
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
                  {...register('type')}
                  error={errors.type?.message}
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
            <Button type="button" variant="outline" onClick={closeModal} className="bg-white hover:bg-slate-50 border-slate-200">Cancel</Button>
            <Button type="submit" className="bg-brand-primary hover:bg-brand-primaryDark text-white px-8 shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5">{editingFeatureId ? "Save Changes" : "Create Feature"}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
