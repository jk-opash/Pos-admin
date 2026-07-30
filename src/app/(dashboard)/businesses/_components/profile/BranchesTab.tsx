import { Business } from "@/types";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useAppSelector } from "@/store/hooks";
import { Building2, Users, MapPin, Phone, Mail, Shield } from "lucide-react";

export function BranchesTab({ business }: { business: Business }) {
  const { currentBusiness } = useAppSelector((state) => state.business);

  const branches = currentBusiness?.branches || [];
  const teamMembers = currentBusiness?.teamMembers || [];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300 ease-spring">
      {/* Branches Card */}
      <Card>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-brand-primary" />
            <h3 className="text-lg font-bold text-brand-dark">
              Branches ({branches.length})
            </h3>
          </div>
          <Button variant="outline" size="sm">Add Branch</Button>
        </div>

        <div className="border border-brand-border rounded-xl overflow-hidden shadow-xs">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-brand-muted border-b border-brand-border">
              <tr>
                <th className="px-4 py-3 font-semibold">Branch Name & Code</th>
                <th className="px-4 py-3 font-semibold">Location</th>
                <th className="px-4 py-3 font-semibold">Contact Info</th>
                <th className="px-4 py-3 font-semibold text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border/60 bg-white">
              {branches.length > 0 ? (
                branches.map((b: any) => (
                  <tr key={b.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-3.5">
                      <div className="font-semibold text-brand-dark">{b.name}</div>
                      <div className="text-xs text-brand-muted font-mono">{b.code || "MAIN"}</div>
                    </td>
                    <td className="px-4 py-3.5 text-brand-muted">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-brand-placeholder shrink-0" />
                        <span>{[b.city, b.state, b.country].filter(Boolean).join(", ") || "N/A"}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-brand-muted">
                      {b.contact && <div className="text-xs flex items-center gap-1"><Phone className="h-3 w-3" />{b.contact}</div>}
                      {b.email && <div className="text-xs flex items-center gap-1"><Mail className="h-3 w-3" />{b.email}</div>}
                      {!b.contact && !b.email && <span className="text-xs text-slate-400">N/A</span>}
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        b.status === "Operational" || b.status === "active"
                          ? "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20"
                          : "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20"
                      }`}>
                        {b.status || "Operational"}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-brand-muted">
                    No branches added to this business yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Staff & Team Members Card */}
      <Card>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-brand-primary" />
            <h3 className="text-lg font-bold text-brand-dark">
              Team Members ({teamMembers.length})
            </h3>
          </div>
          <Button variant="outline" size="sm">Add Staff</Button>
        </div>

        <div className="border border-brand-border rounded-xl overflow-hidden shadow-xs">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-brand-muted border-b border-brand-border">
              <tr>
                <th className="px-4 py-3 font-semibold">Member Name</th>
                <th className="px-4 py-3 font-semibold">Role</th>
                <th className="px-4 py-3 font-semibold">Branch</th>
                <th className="px-4 py-3 font-semibold">Contact</th>
                <th className="px-4 py-3 font-semibold text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border/60 bg-white">
              {teamMembers.length > 0 ? (
                teamMembers.map((member: any) => (
                  <tr key={member.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-3.5">
                      <div className="font-semibold text-brand-dark">
                        {member.first_name} {member.last_name || ""}
                      </div>
                      <div className="text-xs text-brand-muted">{member.email}</div>
                    </td>
                    <td className="px-4 py-3.5 text-brand-muted">
                      <div className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                        <Shield className="h-3 w-3 text-brand-primary" />
                        {member.role?.name || "Staff"}
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-brand-muted">
                      {member.branch?.name || "All Branches"}
                    </td>
                    <td className="px-4 py-3.5 text-brand-muted text-xs">
                      {member.phone || "N/A"}
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        member.status === "Active" || member.status === "active"
                          ? "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20"
                          : "bg-slate-100 text-slate-600"
                      }`}>
                        {member.status || "Active"}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-brand-muted">
                    No staff members added to this business yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
