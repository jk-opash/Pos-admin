'use client';

import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Save, UploadCloud } from 'lucide-react';

export function BrandingSettings() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-brand-dark">Platform Branding</h2>
        <p className="mt-1 text-sm text-brand-muted">
          Customize logos, theme colors, and typography for the tenant portal.
        </p>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-bold text-brand-dark mb-4 pb-2 border-b border-brand-border">Logos & Assets</h3>
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-dashed border-brand-borderHover rounded-xl p-6 flex flex-col items-center justify-center bg-brand-light">
              <div className="h-12 w-12 rounded-lg bg-brand-dark flex items-center justify-center mb-3">
                <span className="text-white font-bold text-xl">P</span>
              </div>
              <p className="text-sm font-medium text-brand-dark">Primary Logo</p>
              <p className="text-xs text-brand-muted mb-3">Recommended size: 512x512px</p>
              <Button variant="outline" size="sm" className="gap-2">
                <UploadCloud className="h-4 w-4" /> Upload New
              </Button>
            </div>

            <div className="border border-dashed border-brand-borderHover rounded-xl p-6 flex flex-col items-center justify-center bg-brand-dark">
              <div className="h-12 w-12 rounded-lg bg-white flex items-center justify-center mb-3">
                <span className="text-brand-dark font-bold text-xl">P</span>
              </div>
              <p className="text-sm font-medium text-white">Dark Mode Logo</p>
              <p className="text-xs text-brand-gray mb-3">For dark themed environments</p>
              <Button variant="outline" size="sm" className="gap-2 bg-transparent text-white border-white/20 hover:bg-white/10 hover:text-white">
                <UploadCloud className="h-4 w-4" /> Upload New
              </Button>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-bold text-brand-dark mb-4 pb-2 border-b border-brand-border">Theme Colors</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <label className="text-sm font-medium text-brand-muted mb-1.5 block">Primary Color</label>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded border border-brand-border bg-brand-primary" />
              <Input defaultValue="#6366F1" className="font-mono text-sm uppercase" />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-brand-muted mb-1.5 block">Secondary Color</label>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded border border-brand-border bg-brand-dark" />
              <Input defaultValue="#0F172A" className="font-mono text-sm uppercase" />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-brand-muted mb-1.5 block">Accent Color</label>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded border border-brand-border bg-brand-success" />
              <Input defaultValue="#10B981" className="font-mono text-sm uppercase" />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-brand-muted mb-1.5 block">Background Color</label>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded border border-brand-border bg-brand-bg" />
              <Input defaultValue="#FAFAFA" className="font-mono text-sm uppercase" />
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-bold text-brand-dark mb-4 pb-2 border-b border-brand-border">Typography</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-medium text-brand-muted mb-1.5 block">Primary Font Family</label>
            <Select 
              defaultValue="inter"
              options={[
                { label: 'Inter', value: 'inter' },
                { label: 'Roboto', value: 'roboto' },
                { label: 'Open Sans', value: 'open_sans' }
              ]}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-brand-muted mb-1.5 block">Heading Font Family</label>
            <Select 
              defaultValue="inter"
              options={[
                { label: 'Inter', value: 'inter' },
                { label: 'Playfair Display', value: 'playfair' },
                { label: 'Montserrat', value: 'montserrat' }
              ]}
            />
          </div>
        </div>
      </Card>

      <div className="flex justify-end pt-4">
        <Button className="bg-brand-primary hover:bg-brand-primaryDark text-white gap-2">
          <Save className="h-4 w-4" /> Save Branding Settings
        </Button>
      </div>
    </div>
  );
}
