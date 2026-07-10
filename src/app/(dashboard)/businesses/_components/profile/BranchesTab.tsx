import { Business } from "@/types";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export function BranchesTab({ business }: { business: Business }) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300 ease-spring">
      <Card>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h3 className="text-lg font-bold text-brand-dark">Branches ({business.stats.branches})</h3>
          <Button variant="outline" size="sm">Add Branch</Button>
        </div>
        
        <div className="border border-brand-border rounded-lg overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-brand-light text-brand-muted">
              <tr>
                <th className="px-4 py-3 font-medium">Branch Name</th>
                <th className="px-4 py-3 font-medium">Location</th>
                <th className="px-4 py-3 font-medium">Manager</th>
                <th className="px-4 py-3 font-medium text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border">
              <tr>
                <td className="px-4 py-3 font-medium text-brand-dark">Main Branch</td>
                <td className="px-4 py-3 text-brand-muted">{business.address.city}, {business.address.state}</td>
                <td className="px-4 py-3 text-brand-muted">{business.owner.name}</td>
                <td className="px-4 py-3 text-right">
                  <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">Active</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
