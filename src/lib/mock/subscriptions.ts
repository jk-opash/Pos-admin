import { SubscriptionPlan, Subscription, Invoice } from '@/types';

const defaultLimits = {
  branches: 1, employees: 5, posDevices: 2, products: 1000,
  customers: 500, suppliers: 50, purchaseOrders: 100, monthlyOrders: 1000,
  apiCalls: 0, storageLimitGB: 1
};

const defaultModules = {
  pos: true, inventory: true, purchase: false, suppliers: false,
  customers: true, crm: false, hr: false, restaurant: false,
  loyalty: false, accounting: false, analytics: false, apiAccess: false
};

const defaultFeatures = {
  offlinePos: false, barcode: true, advancedReports: false,
  whatsappReceipt: false, customBranding: false, webhooks: false
};

export const mockSubscriptionPlans: SubscriptionPlan[] = [
  {
    id: "plan_trial",
    name: "14-Day Free Trial",
    slug: "free_trial",
    description: "Full access for 14 days, no credit card required.",
    industry: "Universal",
    planType: "trial",
    billingCycle: "lifetime",
    currency: "INR",
    pricing: { monthly: 0, yearly: 0 },
    limits: { ...defaultLimits },
    modules: { ...defaultModules, analytics: true },
    features: { ...defaultFeatures },
    trialDays: 14,
    isActive: true,
  },
  {
    id: "plan_starter",
    name: "Starter",
    slug: "starter",
    description: "Perfect for single branch, growing businesses.",
    industry: "Universal",
    planType: "paid",
    billingCycle: "monthly",
    currency: "INR",
    pricing: { monthly: 999, yearly: 9990 },
    limits: { ...defaultLimits, products: 5000, monthlyOrders: 5000, storageLimitGB: 5 },
    modules: { ...defaultModules, purchase: true, suppliers: true },
    features: { ...defaultFeatures },
    trialDays: 7,
    isActive: true,
  },
  {
    id: "growth",
    name: "Growth",
    slug: "growth",
    description: "Ideal for multi-branch operations.",
    industry: "Universal",
    planType: "paid",
    billingCycle: "monthly",
    currency: "INR",
    pricing: { monthly: 2499, yearly: 24990 },
    limits: { ...defaultLimits, branches: 3, employees: 15, posDevices: 6, products: -1, monthlyOrders: -1, storageLimitGB: 20 },
    modules: { ...defaultModules, purchase: true, suppliers: true, crm: true, loyalty: true, analytics: true },
    features: { ...defaultFeatures, offlinePos: true, advancedReports: true },
    trialDays: 7,
    isPopular: true,
    isActive: true,
  },
  {
    id: "professional",
    name: "Professional",
    slug: "professional",
    description: "Advanced features for large scale businesses.",
    industry: "Universal",
    planType: "paid",
    billingCycle: "monthly",
    currency: "INR",
    pricing: { monthly: 4999, yearly: 49990 },
    limits: { ...defaultLimits, branches: 10, employees: -1, posDevices: -1, products: -1, monthlyOrders: -1, storageLimitGB: 100, apiCalls: 10000 },
    modules: { pos: true, inventory: true, purchase: true, suppliers: true, customers: true, crm: true, hr: true, restaurant: true, loyalty: true, accounting: true, analytics: true, apiAccess: true },
    features: { offlinePos: true, barcode: true, advancedReports: true, whatsappReceipt: true, customBranding: true, webhooks: true },
    trialDays: 7,
    isActive: true,
  },
  {
    id: "plan_enterprise",
    name: "Enterprise",
    slug: "enterprise",
    description: "Custom built for massive scale.",
    industry: "Universal",
    planType: "enterprise",
    billingCycle: "custom",
    currency: "INR",
    pricing: { monthly: 0, yearly: 0 },
    limits: { branches: -1, employees: -1, posDevices: -1, products: -1, customers: -1, suppliers: -1, purchaseOrders: -1, monthlyOrders: -1, apiCalls: -1, storageLimitGB: -1 },
    modules: { pos: true, inventory: true, purchase: true, suppliers: true, customers: true, crm: true, hr: true, restaurant: true, loyalty: true, accounting: true, analytics: true, apiAccess: true },
    features: { offlinePos: true, barcode: true, advancedReports: true, whatsappReceipt: true, customBranding: true, webhooks: true },
    trialDays: 0,
    isEnterprise: true,
    isActive: true,
  }
];

export const mockSubscriptions: Subscription[] = [
  {
    id: "sub_1",
    businessId: "biz_1",
    businessName: "Desai Foods & Catering",
    plan: "growth",
        status: "active",
    amount: 2499,
    billingCycle: "monthly",
    // startedAt: "2024-01-15T10:00:00Z",
    currentPeriodEnd: "2024-02-15T10:00:00Z",
    currentPeriodStart: "2024-01-15T10:00:00Z",
    cancelAtPeriodEnd: false,
    createdAt: "2024-01-15T10:00:00Z",
    autoRenew: true
  },
  {
    id: "sub_2",
    businessId: "biz_2",
    businessName: "TechHub Retail",
    plan: "professional",
        status: "past_due",
    amount: 49990,
    billingCycle: "yearly",
    // startedAt: "2023-01-10T10:00:00Z",
    currentPeriodEnd: "2024-01-10T10:00:00Z",
    currentPeriodStart: "2023-01-10T10:00:00Z",
    cancelAtPeriodEnd: false,
    createdAt: "2023-01-10T10:00:00Z",
    autoRenew: true
  }
];

export const mockInvoices: Invoice[] = [
  {
    id: "inv_1",
    subscriptionId: "sub_1",
    businessName: "Desai Foods & Catering",
    amount: 2499,
    status: "paid",
    issuedAt: "2024-01-15T10:00:00Z",
    dueDate: "2024-01-22T10:00:00Z",
    downloadUrl: "#"
  },
  {
    id: "inv_2",
    subscriptionId: "sub_2",
    businessName: "TechHub Retail",
    amount: 49990,
    status: "overdue",
    issuedAt: "2024-01-10T10:00:00Z",
    dueDate: "2024-01-17T10:00:00Z",
    downloadUrl: "#"
  }
];
