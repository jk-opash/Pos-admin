'use client';

import { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Store, MapPin, FileText, User, Sliders, Loader2 } from 'lucide-react';
import { Business, BusinessType } from '@/types';
import { useAppDispatch } from '@/store/hooks';
import { updateBusiness } from '@/store/slices/businessSlice';

interface EditBusinessModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialBusiness: Business | null;
  onSuccess?: (business: Business) => void;
}

export function EditBusinessModal({ isOpen, onClose, initialBusiness, onSuccess }: EditBusinessModalProps) {
  const [business, setBusiness] = useState<Business | null>(null);
  const [editTab, setEditTab] = useState<'info' | 'location' | 'legal' | 'owner' | 'limits'>('info');
  const [isSaving, setIsSaving] = useState(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (initialBusiness && isOpen) {
      setBusiness(JSON.parse(JSON.stringify(initialBusiness)));
      setEditTab('info');
    }
  }, [initialBusiness, isOpen]);

  const handleSave = async () => {
    if (!business) return;
    setIsSaving(true);
    try {
      const backendData = {
        name: business.name,
        legal_name: business.legalName,
        business_type: business.type,
        website: business.website,
        email: business.email,
        phone: business.phone,
        address_line1: business.address.line1,
        address_line2: business.address.line2,
        city: business.address.city,
        state: business.address.state,
        country: business.address.country,
        pincode: business.address.pincode,
        gstin: business.gstin,
        pan: business.pan,
        // Optional owner details
        admin_name: business.owner.name,
        admin_email: business.owner.email,
        admin_phone: business.owner.phone,
        // Limits
        max_branches: business.subscription?.maxBranches,
        max_team_members: business.subscription?.maxUsers,
      };
      
      const updatedBusiness = await dispatch(updateBusiness({ id: business.id, data: backendData })).unwrap();
      onSuccess?.(business);
      onClose();
    } catch (err) {
      console.error('Failed to save', err);
    } finally {
      setIsSaving(false);
    }
  };

  if (!business) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Business Details" size="5xl">
      <div className="flex h-[650px] -mx-6 -mb-6 -mt-4 border-t border-brand-border/50">
        {/* Sidebar Navigation */}
        <div className="w-64 bg-slate-50/50 border-r border-brand-border/50 p-6 flex flex-col gap-2 shrink-0">
          <button
            onClick={() => setEditTab('info')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm text-left ${
              editTab === 'info'
                ? 'bg-white shadow-sm border border-brand-border/60 text-brand-dark'
                : 'text-brand-muted hover:bg-slate-100 hover:text-brand-dark'
            }`}
          >
            <Store className={`h-4 w-4 ${editTab === 'info' ? 'text-brand-primary' : ''}`} />
            Business Info
          </button>
          
          <button
            onClick={() => setEditTab('owner')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm text-left ${
              editTab === 'owner'
                ? 'bg-white shadow-sm border border-brand-border/60 text-brand-dark'
                : 'text-brand-muted hover:bg-slate-100 hover:text-brand-dark'
            }`}
          >
            <User className={`h-4 w-4 ${editTab === 'owner' ? 'text-brand-primary' : ''}`} />
            Owner Details
          </button>

          <button
            onClick={() => setEditTab('location')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm text-left ${
              editTab === 'location'
                ? 'bg-white shadow-sm border border-brand-border/60 text-brand-dark'
                : 'text-brand-muted hover:bg-slate-100 hover:text-brand-dark'
            }`}
          >
            <MapPin className={`h-4 w-4 ${editTab === 'location' ? 'text-brand-primary' : ''}`} />
            Location
          </button>
          
          <button
            onClick={() => setEditTab('legal')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm text-left ${
              editTab === 'legal'
                ? 'bg-white shadow-sm border border-brand-border/60 text-brand-dark'
                : 'text-brand-muted hover:bg-slate-100 hover:text-brand-dark'
            }`}
          >
            <FileText className={`h-4 w-4 ${editTab === 'legal' ? 'text-brand-primary' : ''}`} />
            Legal & Tax
          </button>
          
          <button
            onClick={() => setEditTab('limits')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm text-left ${
              editTab === 'limits'
                ? 'bg-white shadow-sm border border-brand-border/60 text-brand-dark'
                : 'text-brand-muted hover:bg-slate-100 hover:text-brand-dark'
            }`}
          >
            <Sliders className={`h-4 w-4 ${editTab === 'limits' ? 'text-brand-primary' : ''}`} />
            Resource Limits
          </button>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col relative bg-white/50 overflow-hidden">
          <div className="flex-1 p-8 overflow-y-auto pb-28">
            {editTab === 'info' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                <h3 className="text-lg font-bold text-brand-dark">Business Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs font-bold text-brand-muted uppercase tracking-wider mb-2 block">
                      Business Name
                    </label>
                    <Input
                      value={business.name || ''}
                      onChange={(e) => setBusiness({ ...business, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-brand-muted uppercase tracking-wider mb-2 block">
                      Business Type
                    </label>
                    <select
                      className="w-full rounded-xl border border-slate-200 bg-white/50 px-4 py-2.5 text-sm focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all capitalize"
                      value={business.type || ''}
                      onChange={(e) => setBusiness({ ...business, type: e.target.value as BusinessType })}
                    >
                      {['restaurant', 'cafe', 'retail', 'grocery', 'pharmacy', 'salon', 'hotel', 'electronics', 'clothing', 'hardware', 'bakery'].map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-brand-muted uppercase tracking-wider mb-2 block">
                      Website
                    </label>
                    <Input
                      value={business.website || ''}
                      placeholder="https://..."
                      onChange={(e) => setBusiness({ ...business, website: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-brand-muted uppercase tracking-wider mb-2 block">
                      Business Phone
                    </label>
                    <Input
                      value={business.phone || ''}
                      onChange={(e) => setBusiness({ ...business, phone: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-brand-muted uppercase tracking-wider mb-2 block">
                      Business Email
                    </label>
                    <Input
                      value={business.email || ''}
                      onChange={(e) => setBusiness({ ...business, email: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            )}

            {editTab === 'owner' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                <h3 className="text-lg font-bold text-brand-dark">Owner Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs font-bold text-brand-muted uppercase tracking-wider mb-2 block">
                      Owner Name
                    </label>
                    <Input
                      value={business.owner.name || ''}
                      onChange={(e) => setBusiness({ ...business, owner: { ...business.owner, name: e.target.value } })}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-brand-muted uppercase tracking-wider mb-2 block">
                      Owner Email
                    </label>
                    <Input
                      value={business.owner.email || ''}
                      onChange={(e) => setBusiness({ ...business, owner: { ...business.owner, email: e.target.value } })}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-brand-muted uppercase tracking-wider mb-2 block">
                      Owner Phone
                    </label>
                    <Input
                      value={business.owner.phone || ''}
                      onChange={(e) => setBusiness({ ...business, owner: { ...business.owner, phone: e.target.value } })}
                    />
                  </div>
                </div>
              </div>
            )}

            {editTab === 'location' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                <h3 className="text-lg font-bold text-brand-dark">Location</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="text-xs font-bold text-brand-muted uppercase tracking-wider mb-2 block">
                      Address Line 1
                    </label>
                    <Input
                      value={business.address.line1 || ''}
                      onChange={(e) => setBusiness({ ...business, address: { ...business.address, line1: e.target.value } })}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-xs font-bold text-brand-muted uppercase tracking-wider mb-2 block">
                      Address Line 2
                    </label>
                    <Input
                      value={business.address.line2 || ''}
                      onChange={(e) => setBusiness({ ...business, address: { ...business.address, line2: e.target.value } })}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-brand-muted uppercase tracking-wider mb-2 block">
                      City
                    </label>
                    <Input
                      value={business.address.city || ''}
                      onChange={(e) => setBusiness({ ...business, address: { ...business.address, city: e.target.value } })}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-brand-muted uppercase tracking-wider mb-2 block">
                      State
                    </label>
                    <Input
                      value={business.address.state || ''}
                      onChange={(e) => setBusiness({ ...business, address: { ...business.address, state: e.target.value } })}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-brand-muted uppercase tracking-wider mb-2 block">
                      Country
                    </label>
                    <Input
                      value={business.address.country || ''}
                      onChange={(e) => setBusiness({ ...business, address: { ...business.address, country: e.target.value } })}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-brand-muted uppercase tracking-wider mb-2 block">
                      Pincode
                    </label>
                    <Input
                      value={business.address.pincode || ''}
                      onChange={(e) => setBusiness({ ...business, address: { ...business.address, pincode: e.target.value } })}
                    />
                  </div>
                </div>
              </div>
            )}

            {editTab === 'legal' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                <h3 className="text-lg font-bold text-brand-dark">Legal & Tax</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs font-bold text-brand-muted uppercase tracking-wider mb-2 block">
                      Legal Name
                    </label>
                    <Input
                      value={business.legalName || ''}
                      onChange={(e) => setBusiness({ ...business, legalName: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-brand-muted uppercase tracking-wider mb-2 block">
                      GSTIN
                    </label>
                    <Input
                      value={business.gstin || ''}
                      onChange={(e) => setBusiness({ ...business, gstin: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-brand-muted uppercase tracking-wider mb-2 block">
                      PAN
                    </label>
                    <Input
                      value={business.pan || ''}
                      onChange={(e) => setBusiness({ ...business, pan: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            )}

            {editTab === 'limits' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                <h3 className="text-lg font-bold text-brand-dark">Resource Limits</h3>
                <p className="text-sm text-brand-muted">Override the default subscription plan limits for this business.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs font-bold text-brand-muted uppercase tracking-wider mb-2 block">
                      Max Branches
                    </label>
                    <Input
                      type="number"
                      min={1}
                      value={business.subscription?.maxBranches || ''}
                      onChange={(e) => setBusiness({ 
                        ...business, 
                        subscription: { 
                          ...business.subscription, 
                          maxBranches: parseInt(e.target.value) || 0 
                        } 
                      })}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-brand-muted uppercase tracking-wider mb-2 block">
                      Max Staff Users
                    </label>
                    <Input
                      type="number"
                      min={1}
                      value={business.subscription?.maxUsers || ''}
                      onChange={(e) => setBusiness({ 
                        ...business, 
                        subscription: { 
                          ...business.subscription, 
                          maxUsers: parseInt(e.target.value) || 0 
                        } 
                      })}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sticky Footer */}
          <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-brand-border/50 bg-white/70 backdrop-blur-xl flex justify-end gap-3 z-10">
            <Button
              variant="outline"
              className="bg-white hover:bg-slate-50 border-slate-200"
              onClick={onClose}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button
              disabled={isSaving}
              className="bg-brand-primary hover:bg-brand-primaryDark text-white px-8 shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0"
              onClick={handleSave}
            >
              {isSaving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
