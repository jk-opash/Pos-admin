import { RevenueMetric, RevenueTrendData, RevenueBreakdown } from '@/types';
import { colors } from '@/config/colors';

export const mockRevenueMetrics: RevenueMetric[] = [
  {
    title: 'Total Revenue (Lifetime)',
    value: 48500000,
    previousValue: 42000000,
    growthPercentage: 15.4,
    trend: 'up',
    isCurrency: true
  },
  {
    title: 'Monthly Recurring Revenue (MRR)',
    value: 1250000,
    previousValue: 1150000,
    growthPercentage: 8.7,
    trend: 'up',
    isCurrency: true
  },
  {
    title: 'Annual Recurring Revenue (ARR)',
    value: 15000000,
    previousValue: 13800000,
    growthPercentage: 8.7,
    trend: 'up',
    isCurrency: true
  },
  {
    title: 'Average Revenue Per User (ARPU)',
    value: 4500,
    previousValue: 4600,
    growthPercentage: -2.1,
    trend: 'down',
    isCurrency: true
  }
];

export const mockRevenueTrends: RevenueTrendData[] = [
  { month: 'Jan', totalRevenue: 950000, recurringRevenue: 850000, newRevenue: 100000 },
  { month: 'Feb', totalRevenue: 1020000, recurringRevenue: 890000, newRevenue: 130000 },
  { month: 'Mar', totalRevenue: 980000, recurringRevenue: 920000, newRevenue: 60000 },
  { month: 'Apr', totalRevenue: 1100000, recurringRevenue: 950000, newRevenue: 150000 },
  { month: 'May', totalRevenue: 1150000, recurringRevenue: 980000, newRevenue: 170000 },
  { month: 'Jun', totalRevenue: 1220000, recurringRevenue: 1050000, newRevenue: 170000 },
  { month: 'Jul', totalRevenue: 1250000, recurringRevenue: 1100000, newRevenue: 150000 },
];

export const mockRevenueByIndustry: RevenueBreakdown[] = [
  { name: 'Restaurant', value: 450000, color: colors.primary },
  { name: 'Retail', value: 380000, color: colors.purple },
  { name: 'Grocery', value: 210000, color: colors.pink },
  { name: 'Pharmacy', value: 120000, color: colors.teal },
  { name: 'Other', value: 90000, color: colors.gray },
];

export const mockRevenueByPlan: RevenueBreakdown[] = [
  { name: 'Enterprise', value: 600000, color: colors.dark },
  { name: 'Professional', value: 450000, color: colors.info },
  { name: 'Growth', value: 150000, color: colors.success },
  { name: 'Starter', value: 50000, color: colors.warning },
];

export const mockRevenueByRegion: RevenueBreakdown[] = [
  { name: 'North America', value: 580000, color: colors.primary },
  { name: 'Europe', value: 320000, color: colors.purple },
  { name: 'Asia Pacific', value: 210000, color: colors.teal },
  { name: 'Middle East', value: 90000, color: colors.warning },
  { name: 'Latin America', value: 50000, color: colors.pink },
];

export const mockRevenueForecast = [
  { month: 'Jul', actual: 1250000, projected: 1250000 },
  { month: 'Aug', actual: null, projected: 1320000 },
  { month: 'Sep', actual: null, projected: 1410000 },
  { month: 'Oct', actual: null, projected: 1520000 },
  { month: 'Nov', actual: null, projected: 1650000 },
  { month: 'Dec', actual: null, projected: 1800000 },
];

export const mockRevenueByPaymentMethod: RevenueBreakdown[] = [
  { name: 'Credit/Debit Card', value: 850000, color: colors.primary },
  { name: 'UPI / Digital Wallet', value: 350000, color: colors.success },
  { name: 'Bank Transfer', value: 50000, color: colors.warning },
];

export const mockRetentionTrends = [
  { month: 'Jan', nrr: 102, churn: 1.2 },
  { month: 'Feb', nrr: 104, churn: 1.1 },
  { month: 'Mar', nrr: 103, churn: 1.3 },
  { month: 'Apr', nrr: 106, churn: 0.9 },
  { month: 'May', nrr: 108, churn: 0.8 },
  { month: 'Jun', nrr: 110, churn: 0.7 },
  { month: 'Jul', nrr: 112, churn: 0.5 },
];
