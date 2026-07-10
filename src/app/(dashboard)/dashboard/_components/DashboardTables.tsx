import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

export function RecentRegistrationsTable() {
  const registrations = [
    { name: 'BuildRight Hardware', owner: 'Rahul Sharma', industry: 'Hardware', plan: 'Trial', status: 'Pending', date: '2025-07-06' },
    { name: 'FreshMart Grocery', owner: 'Amit Singh', industry: 'Grocery', plan: 'Growth', status: 'Active', date: '2025-07-05' },
    { name: 'Style Street Clothing', owner: 'Priya Patel', industry: 'Retail', plan: 'Starter', status: 'Active', date: '2025-07-04' },
    { name: 'MediPlus Pharmacy', owner: 'Dr. Kumar', industry: 'Pharmacy', plan: 'Professional', status: 'Active', date: '2025-07-03' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Registrations</CardTitle>
      </CardHeader>
      <div className="overflow-x-auto pb-2">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Business</TableHead>
              <TableHead>Owner</TableHead>
              <TableHead>Industry</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {registrations.map((reg, i) => (
              <TableRow key={i}>
                <TableCell className="font-medium">{reg.name}</TableCell>
                <TableCell>{reg.owner}</TableCell>
                <TableCell>{reg.industry}</TableCell>
                <TableCell><Badge variant="muted">{reg.plan}</Badge></TableCell>
                <TableCell>
                  <Badge variant={reg.status === 'Active' ? 'success' : 'warning'}>{reg.status}</Badge>
                </TableCell>
                <TableCell>
                  <Button variant="outline" size="sm" className="h-7 text-xs">View</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}

export function PendingApprovalsTable() {
  const approvals = [
    { name: 'Urban Cafe', owner: 'Neha Gupta', date: '2025-07-07', docs: '3/3' },
    { name: 'TechHaven Electronics', owner: 'Vikram Joshi', date: '2025-07-06', docs: '2/3' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pending Approvals</CardTitle>
      </CardHeader>
      <div className="overflow-x-auto pb-2">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Business Name</TableHead>
              <TableHead>Owner</TableHead>
              <TableHead>Submitted</TableHead>
              <TableHead>Documents</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {approvals.map((app, i) => (
              <TableRow key={i}>
                <TableCell className="font-medium">{app.name}</TableCell>
                <TableCell>{app.owner}</TableCell>
                <TableCell>{app.date}</TableCell>
                <TableCell>{app.docs} Verified</TableCell>
                <TableCell className="flex gap-2">
                  <Button variant="primary" size="sm" className="h-7 text-xs bg-emerald-600 hover:bg-emerald-700">Approve</Button>
                  <Button variant="outline" size="sm" className="h-7 text-xs">Review</Button>
                </TableCell>
              </TableRow>
            ))}
            {approvals.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4 text-slate-500">No pending approvals.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
