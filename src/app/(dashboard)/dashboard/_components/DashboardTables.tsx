"use client";

import { useAppSelector } from "@/store/hooks";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { formatDate } from "@/lib/utils";

export function RecentRegistrationsTable() {
  const { businesses } = useAppSelector((state) => state.business);

  const getOwnerName = (b: any) => {
    if (b.owner_name) return b.owner_name;
    if (typeof b.owner === "string") return b.owner;
    if (b.owner?.name) return b.owner.name;
    if (b.admin?.name) return b.admin.name;
    return "N/A";
  };

  const getBusinessType = (b: any) => {
    const type = b.business_type || b.type || b.businessType || "Retail";
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  const getPlanName = (b: any) => {
    const plan =
      b.subscription_plan?.name ||
      b.subscription_plan?.plan ||
      b.subscription?.plan ||
      "Starter";
    return plan.charAt(0).toUpperCase() + plan.slice(1);
  };

  const list = [...businesses]
    .sort((a: any, b: any) => {
      const timeA = new Date(a.created_at || a.createdAt || 0).getTime();
      const timeB = new Date(b.created_at || b.createdAt || 0).getTime();
      return timeB - timeA;
    })
    .slice(0, 5);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Registrations</CardTitle>
        <Link
          href="/businesses"
          className="text-xs font-semibold text-brand-primary hover:underline"
        >
          View All
        </Link>
      </CardHeader>
      <div className="overflow-x-auto pb-2">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Business</TableHead>
              <TableHead>Owner</TableHead>
              <TableHead>Industry</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {list.map((b: any) => (
              <TableRow key={b.id}>
                <TableCell className="font-medium">{b.name}</TableCell>
                <TableCell>{getOwnerName(b)}</TableCell>
                <TableCell>{getBusinessType(b)}</TableCell>
                <TableCell>
                  <Badge variant="muted">{getPlanName(b)}</Badge>
                </TableCell>
                <TableCell className="text-xs text-brand-muted">
                  {b.created_at || b.createdAt
                    ? formatDate(b.created_at || b.createdAt)
                    : "N/A"}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      b.status === "active"
                        ? "success"
                        : b.status === "pending" || b.status === "onboarding"
                          ? "warning"
                          : "muted"
                    }
                  >
                    {(b.status || "pending").toUpperCase()}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Link href={`/businesses/${b.id}`}>
                    <Button variant="outline" size="sm" className="h-7 text-xs">
                      View
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
            {list.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-6 text-brand-muted"
                >
                  No business registrations found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}

export function PendingApprovalsTable() {
  const { businesses } = useAppSelector((state) => state.business);

  const getOwnerName = (b: any) => {
    if (b.owner_name) return b.owner_name;
    if (typeof b.owner === "string") return b.owner;
    if (b.owner?.name) return b.owner.name;
    if (b.admin?.name) return b.admin.name;
    return "N/A";
  };

  const pendingList = businesses
    .filter(
      (b) =>
        b.status === "pending" ||
        b.status === "onboarding" ||
        b.status === "trial",
    )
    .sort((a: any, b: any) => {
      const timeA = new Date(a.created_at || a.createdAt || 0).getTime();
      const timeB = new Date(b.created_at || b.createdAt || 0).getTime();
      return timeB - timeA;
    });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Pending Approvals</CardTitle>
        <Link
          href="/onboarding"
          className="text-xs font-semibold text-brand-primary hover:underline"
        >
          Review Onboarding
        </Link>
      </CardHeader>
      <div className="overflow-x-auto pb-2">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Business Name</TableHead>
              <TableHead>Owner</TableHead>
              <TableHead>Submitted</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pendingList.map((app: any) => (
              <TableRow key={app.id}>
                <TableCell className="font-medium">{app.name}</TableCell>
                <TableCell>{getOwnerName(app)}</TableCell>
                <TableCell>
                  {formatDate(app.created_at || app.createdAt)}
                </TableCell>
                <TableCell>
                  <Badge variant="warning">
                    {(app.status || "Pending").toUpperCase()}
                  </Badge>
                </TableCell>
                <TableCell className="flex gap-2">
                  <Link href={`/businesses/${app.id}`}>
                    <Button variant="outline" size="sm" className="h-7 text-xs">
                      Review
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
            {pendingList.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-6 text-brand-muted"
                >
                  No pending approvals required.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
