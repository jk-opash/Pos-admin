/* eslint-disable @typescript-eslint/no-unused-vars */
import { StatsCard } from '@/components/ui/StatsCard';
import { formatCurrency } from '@/lib/utils';
import { DashboardStats } from '@/types';
import { 
  Store, StoreIcon, Clock, Ban, XCircle, Building2, Users, UserCheck, 
  CreditCard, IndianRupee, TrendingUp, LineChart, BadgeCheck, CheckCircle2,
  CalendarRange, Sparkles, Receipt, IndianRupeeIcon, AlertTriangle
} from 'lucide-react';

export function SummaryCardsGrid({ stats }: { stats: DashboardStats }) {
  return (
    <div className="space-y-8">
      
      {/* Business Metrics */}
      <section>
        <h3 className="text-sm font-semibold text-brand-dark mb-3 uppercase tracking-wider">Business Metrics</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard title="Total Businesses" value={stats.totalBusinesses.toString()} change={8.5} icon={<Store className="h-5 w-5 text-brand-info" />} />
          <StatsCard title="Active Businesses" value={stats.activeBusinesses.toString()} change={12.0} icon={<StoreIcon className="h-5 w-5 text-brand-success" />} />
          <StatsCard title="Pending Approval" value={stats.pendingApprovalBusinesses.toString()} change={-5.0} icon={<Clock className="h-5 w-5 text-brand-warning" />} />
          <StatsCard title="Verified Businesses" value={stats.verifiedBusinesses.toString()} change={14.2} icon={<BadgeCheck className="h-5 w-5 text-brand-primary" />} />
        </div>
      </section>

      {/* User Metrics */}
      <section>
        <h3 className="text-sm font-semibold text-brand-dark mb-3 uppercase tracking-wider">User Metrics</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard title="Total Users" value={stats.totalUsers.toString()} change={22.4} icon={<Users className="h-5 w-5 text-brand-purple" />} />
          <StatsCard title="Active Users" value={stats.activeUsers.toString()} change={15.2} icon={<UserCheck className="h-5 w-5 text-brand-success" />} />
          <StatsCard title="Online Users" value={stats.onlineUsers.toString()} change={5.4} icon={<CheckCircle2 className="h-5 w-5 text-brand-warning" />} />
          <StatsCard title="New Users (Today)" value={stats.newUsersToday.toString()} change={8.0} icon={<Sparkles className="h-5 w-5 text-brand-pink" />} />
        </div>
      </section>

      {/* Subscription Metrics */}
      <section>
        <h3 className="text-sm font-semibold text-brand-dark mb-3 uppercase tracking-wider">Subscription Metrics</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard title="Active Plans" value={stats.activeSubscriptions.toString()} change={4.2} icon={<Receipt className="h-5 w-5 text-brand-primary" />} />
          <StatsCard title="Monthly Plans" value={stats.monthlyPlans.toString()} change={1.2} icon={<CalendarRange className="h-5 w-5 text-brand-info" />} />
          <StatsCard title="Enterprise Plans" value={stats.enterprisePlans.toString()} change={12.5} icon={<Building2 className="h-5 w-5 text-brand-teal" />} />
          <StatsCard title="Upcoming Renewals" value={stats.upcomingRenewals.toString()} change={0} icon={<Clock className="h-5 w-5 text-brand-warning" />} />
        </div>
      </section>

      {/* Revenue Metrics */}
      <section>
        <h3 className="text-sm font-semibold text-brand-dark mb-3 uppercase tracking-wider">Revenue Metrics</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard title="Today's Revenue" value={formatCurrency(stats.todayRevenue)} change={18.5} icon={<IndianRupeeIcon className="h-5 w-5 text-brand-success" />} />
          <StatsCard title="Monthly Recurring Rev" value={formatCurrency(stats.mrr)} change={stats.mrrGrowth} icon={<TrendingUp className="h-5 w-5 text-brand-info" />} />
          <StatsCard title="Annual Recurring Rev" value={formatCurrency(stats.arr)} change={15.2} icon={<LineChart className="h-5 w-5 text-brand-purple" />} />
          <StatsCard title="Failed Payments" value={formatCurrency(stats.failedPayments)} change={-2.4} icon={<AlertTriangle className="h-5 w-5 text-brand-danger" />} />
        </div>
      </section>

    </div>
  );
}
