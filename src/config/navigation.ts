import { 
  LayoutDashboard, 
  Store, 
  CreditCard, 
  Receipt,
  ToggleLeft,
  LifeBuoy,
  ShieldCheck,
  UserPlus,
  TrendingUp,
  ActivitySquare
} from 'lucide-react';

export const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/businesses', label: 'Businesses', icon: Store },
  { href: '/onboarding', label: 'Onboarding', icon: UserPlus },
  { href: '/subscriptions', label: 'Subscriptions', icon: CreditCard },
  { href: '/payments', label: 'Payments', icon: Receipt },
  { href: '/analytics/revenue', label: 'Revenue Analytics', icon: TrendingUp },
  { href: '/audit-logs', label: 'Audit Logs', icon: ActivitySquare },
  { href: '/feature-flags', label: 'Feature Flags', icon: ToggleLeft },
  { href: '/support', label: 'Support Tickets', icon: LifeBuoy },
];
