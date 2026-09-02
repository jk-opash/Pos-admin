import { Business } from "@/types";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { MapPin, Phone, Mail, FileCheck, CheckCircle2, Clock } from "lucide-react";

export function OverviewTab({ business }: { business: Business }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-300 ease-spring">
      <div className="md:col-span-1 space-y-6">
        <Card>
          <h3 className="text-sm font-bold text-brand-dark mb-4">Contact Information</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-brand-muted">
                <span className="font-bold">{business.owner.name.charAt(0)}</span>
              </div>
              <div>
                <p className="font-medium text-brand-dark">{business.owner.name}</p>
                <p className="text-xs text-brand-placeholder">Primary Owner</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-sm text-brand-muted">
              <Mail className="h-4 w-4 text-brand-placeholder" />
              {business.owner.email}
            </div>
            <div className="flex items-center gap-3 text-sm text-brand-muted">
              <Phone className="h-4 w-4 text-brand-placeholder" />
              {business.owner.phone}
            </div>
          </div>
        </Card>

        <Card>
          <h3 className="text-sm font-bold text-brand-dark mb-4">Company Details</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3 text-sm text-brand-muted">
              <MapPin className="h-4 w-4 text-brand-placeholder mt-0.5 shrink-0" />
              <span>
                {business.address.city}, {business.address.state}
                <br />
                {business.address.country} - {business.address.pincode}
              </span>
            </div>
            <div className="pt-3 mt-3 border-t border-brand-border space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-brand-placeholder">GSTIN</span>
                <span className="font-medium text-brand-dark">{business.gstin || "Not Provided"}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-brand-placeholder">PAN</span>
                <span className="font-medium text-brand-dark">{business.pan || "Not Provided"}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-brand-placeholder">Reg. No</span>
                <span className="font-medium text-brand-dark">{business.businessRegistrationNumber || "Not Provided"}</span>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <h3 className="text-sm font-bold text-brand-dark mb-4 flex items-center gap-2">
            <FileCheck className="h-4 w-4 text-brand-placeholder" /> KYC Documents
          </h3>
          <div className="space-y-3">
            {[
              { label: 'Identity (PAN)', path: business.panCard, status: business.identityVerification },
              { label: 'Business (GST)', path: business.gstCertificate, status: business.identityVerification },
              { label: 'Trade License', path: business.tradeLicense, status: business.identityVerification },
            ].map((doc, i) => (
              <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-sm">
                <div className="flex flex-col">
                  <span className="text-brand-muted">{doc.label}</span>
                  {doc.path && <span className="text-xs text-brand-primary truncate max-w-[180px]">{doc.path.split('/').pop()}</span>}
                </div>
                {doc.status === "verified" || business.kyc.status === "verified" ? (
                  <Badge variant="success" className="gap-1 px-1.5 py-0">
                    <CheckCircle2 className="h-3 w-3" /> Verified
                  </Badge>
                ) : (
                  <Badge variant="warning" className="gap-1 px-1.5 py-0">
                    <Clock className="h-3 w-3" /> Pending
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="md:col-span-2 space-y-6">
        <Card className="h-full">
          <h3 className="text-sm font-bold text-brand-dark mb-4">Activity Overview</h3>
          <div className="flex h-64 items-center justify-center rounded-lg border border-dashed border-brand-border bg-brand-light">
            <p className="text-sm text-brand-placeholder">Activity charts will be implemented here</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
