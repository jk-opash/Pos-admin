import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import {
  Store,
  UserPlus,
  CreditCard,
  Bell,
  Tags,
  FileText,
  IndianRupee,
  HeadphonesIcon,
  Settings2,
  PlusCircle,
} from "lucide-react";
import Link from "next/link";

export function QuickActions() {
  const actions = [
    {
      icon: <Store className="h-4 w-4" />,
      label: "Add Business",
      href: "/businesses/onboard",
    },
    {
      icon: <UserPlus className="h-4 w-4" />,
      label: "Approve Business",
      href: "/businesses",
    },
    {
      icon: <PlusCircle className="h-4 w-4" />,
      label: "Create Subscription",
      href: "/subscriptions/plans",
    },
    {
      icon: <CreditCard className="h-4 w-4" />,
      label: "Manage Plans",
      href: "/subscriptions/plans",
    },
    {
      icon: <IndianRupee className="h-4 w-4" />,
      label: "View Revenue",
      href: "/payments",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <div className=" pt-0">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
          {actions.map((action, i) => (
            <Link key={i} href={action.href} passHref>
              <Button
                variant="outline"
                className="w-full flex-col h-auto py-2.5 gap-1.5 justify-center hover:bg-slate-50 transition-colors rounded-2xl"
              >
                <div className="bg-slate-100 p-1.5 rounded-full text-slate-700">
                  {action.icon}
                </div>
                <span className="text-xs font-medium text-slate-600 truncate w-full text-center">
                  {action.label}
                </span>
              </Button>
            </Link>
          ))}
        </div>
      </div>
    </Card>
  );
}
