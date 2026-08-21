// ── Business ─────────────────────────────────────────────────────────────────

export type BusinessType =
  | "restaurant"
  | "cafe"
  | "retail"
  | "grocery"
  | "pharmacy"
  | "salon"
  | "hotel"
  | "electronics"
  | "clothing"
  | "hardware"
  | "bakery";

export type BusinessStatus =
  | "active"
  | "trial"
  | "suspended"
  | "pending"
  | "deleted";

export interface BusinessStats {
  branches: number;
  users: number;
  totalOrders: number;
  revenueMTD: number;
  revenueTotal: number;
  storageUsed?: number;
}

export interface Business {
  id: string;
  name: string;
  slug: string;
  legalName?: string;
  description?: string;
  website?: string;
  email?: string;
  phone?: string;
  type: BusinessType;
  status: BusinessStatus;
  logo?: string;
  owner: {
    name: string;
    email: string;
    phone: string;
  };
  emergencyContact?: string;
  gstin?: string;
  pan?: string;
  address: {
    line1?: string;
    line2?: string;
    city: string;
    state: string;
    country: string;
    pincode: string;
  };
  subscription: {
    plan: SubscriptionPlanSlug;
    status: SubscriptionStatus;
    endsAt: string;
    autoRenew: boolean;
    maxBranches?: number;
    maxUsers?: number;
  };
  stats: BusinessStats;
  kyc: {
    status: "pending" | "verified" | "rejected";
    submittedAt?: string;
  };
  createdAt: string;
  updatedAt: string;
}

// ── Subscription ──────────────────────────────────────────────────────────────

export type SubscriptionPlanSlug =
  | "free_trial"
  | "starter"
  | "growth"
  | "professional"
  | "enterprise";

export type SubscriptionStatus =
  | "trialing"
  | "active"
  | "past_due"
  | "canceled"
  | "expired"
  | "paused";

export type BillingCycle = "monthly" | "quarterly" | "half_yearly" | "yearly" | "lifetime" | "custom";
export type PlanType = "free" | "trial" | "paid" | "enterprise" | "custom";
export type Currency = "INR" | "USD" | "AED" | "EUR";

export interface PlanLimits {
  branches: number;
  employees: number;
  posDevices: number;
  products: number;
  customers: number;
  suppliers: number;
  purchaseOrders: number;
  monthlyOrders: number;
  apiCalls: number;
  storageLimitGB: number;
}

export interface PlanModules {
  pos: boolean;
  inventory: boolean;
  purchase: boolean;
  suppliers: boolean;
  customers: boolean;
  crm: boolean;
  hr: boolean;
  restaurant: boolean;
  loyalty: boolean;
  accounting: boolean;
  analytics: boolean;
  apiAccess: boolean;
}

export interface PlanFeatures {
  offlinePos: boolean;
  barcode: boolean;
  advancedReports: boolean;
  whatsappReceipt: boolean;
  customBranding: boolean;
  webhooks: boolean;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  slug: SubscriptionPlanSlug;
  description: string;
  industry: string;
  planType: PlanType;
  billingCycle: BillingCycle;
  currency: Currency;
  pricing: {
    monthly: number;
    yearly: number;
  };
  limits: PlanLimits;
  modules: PlanModules;
  features: PlanFeatures;
  trialDays: number;
  isPopular?: boolean;
  isEnterprise?: boolean;
  isActive: boolean;
}

export interface Subscription {
  id: string;
  businessId: string;
  businessName: string;
  plan: SubscriptionPlanSlug;
  status: SubscriptionStatus;
  billingCycle: "monthly" | "quarterly" | "yearly";
  amount: number;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  autoRenew: boolean;
  createdAt: string;
}

// ── Payment ───────────────────────────────────────────────────────────────────

export type PaymentStatus = "success" | "failed" | "pending" | "refunded";

export interface Invoice {
  id: string;
  subscriptionId: string;
  businessName: string;
  amount: number;
  status: "paid" | "overdue" | "pending";
  issuedAt: string;
  dueDate: string;
  downloadUrl: string;
}

export interface Payment {
  id: string;
  businessId: string;
  businessName: string;
  subscriptionId: string;
  amount: number;
  gstAmount: number;
  totalAmount: number;
  currency: string;
  status: PaymentStatus;
  paymentMethod: string;
  invoiceNumber: string;
  paidAt?: string;
  createdAt: string;
  errorMessage?: string;
}

// ── Support Ticket ────────────────────────────────────────────────────────────

export type TicketStatus = 
  | "draft" | "open" | "pending" | "waiting_for_customer" 
  | "assigned" | "in_progress" | "under_investigation" 
  | "escalated" | "testing" | "resolved" | "closed" 
  | "reopened" | "cancelled";

export type TicketPriority = "low" | "medium" | "high" | "critical" | "emergency";

export type TicketCategory = 
  | "technical" | "billing" | "account" | "inventory" 
  | "restaurant" | "hardware" | "integrations" 
  | "feature_request" | "bug_report";

export interface TicketMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: "customer" | "support_agent" | "support_manager" | "system";
  content: string;
  attachments?: string[];
  createdAt: string;
}

export interface TicketInternalNote {
  id: string;
  authorId: string;
  authorName: string;
  content: string;
  createdAt: string;
}

export interface SupportTicket {
  id: string;
  ticketNumber: string;
  businessId: string;
  businessName: string;
  branchName?: string;
  contactPerson: string;
  contactEmail: string;
  
  subject: string;
  description: string;
  category: TicketCategory;
  subCategory?: string;
  
  status: TicketStatus;
  priority: TicketPriority;
  assignedTo?: string; // agent name or id
  assignedTeam?: string;
  
  slaDeadline?: string;
  slaBreached: boolean;
  
  messages: TicketMessage[];
  internalNotes: TicketInternalNote[];
  
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  closedAt?: string;
  
  csatScore?: number;
  resolutionTimeHrs?: number;
}

// ── Feature Flag ──────────────────────────────────────────────────────────────

export type FeatureCategory = 
  | "core" | "inventory" | "restaurant" | "crm" 
  | "accounting" | "employee" | "ai" | "integrations";

export type FeatureType = 
  | "core" | "premium" | "add_on" | "beta" 
  | "experimental" | "hidden" | "internal" | "enterprise";

export type FeatureStatus = 
  | "active" | "disabled" | "deprecated" | "beta" 
  | "coming_soon" | "development" | "maintenance";

export type RolloutStrategy = 
  | "immediate" | "scheduled" | "percentage" 
  | "region" | "industry" | "subscription" | "beta_testers";

export interface PlatformFeature {
  id: string;
  code: string;
  name: string;
  description: string;
  
  category: FeatureCategory;
  type: FeatureType;
  status: FeatureStatus;
  
  // Dependency logic
  dependencies: string[]; // array of feature codes
  
  // Targeting
  enabledForPlans: SubscriptionPlanSlug[];
  enabledForIndustries: string[]; // 'all' or specific like 'restaurant', 'retail'
  
  // Rollout logic
  rolloutStrategy: RolloutStrategy;
  rolloutPercentage: number;
  
  version: string;
  releaseDate?: string;
  
  createdAt: string;
  updatedAt: string;
}

// ── Dashboard ─────────────────────────────────────────────────────────────────

export interface RevenueDataPoint {
  month: string;
  mrr: number;
  newRevenue: number;
  churnedRevenue: number;
}

export interface DashboardStats {
  mrr: number;
  mrrGrowth: number;   // percentage
  arr: number;
  totalRevenue: number;
  todayRevenue: number;
  subscriptionRevenue: number;
  pendingPayments: number;
  failedPayments: number;
  
  totalBusinesses: number;
  activeBusinesses: number;
  trialBusinesses: number;
  suspendedBusinesses: number;
  expiredBusinesses: number;
  pendingApprovalBusinesses: number;
  deletedBusinesses: number;
  verifiedBusinesses: number;
  
  totalBranches: number;
  totalUsers: number;
  activeUsers: number;
  onlineUsers: number;
  offlineUsers: number;
  totalEmployees: number;
  newUsersToday: number;
  newUsersThisMonth: number;
  totalCustomers: number;
  totalPosTransactions: number;
  
  newSignupsThisMonth: number;
  churnedThisMonth: number;
  conversionRate: number;  // trial → paid %
  arpu: number;
  arpb: number; // average revenue per business

  // Subscription KPIs
  activeSubscriptions: number;
  expiredSubscriptions: number;
  trialPlans: number;
  monthlyPlans: number;
  yearlyPlans: number;
  enterprisePlans: number;
  renewalsToday: number;
  upcomingRenewals: number;
  
  revenueChart: RevenueDataPoint[];
  planDistribution: { name: string; value: number; color: string }[];
  industryDistribution: { name: string; value: number }[];
  geographicDistribution: { country: string; businesses: number; revenue: number }[];
  deviceUsage: { name: string; value: number; color: string }[];
  browserUsage: { name: string; value: number; color: string }[];
  paymentMethods: { name: string; value: number; color: string }[];
  
  supportMetrics: {
    openTickets: number;
    closedTickets: number;
    pendingTickets: number;
    highPriority: number;
    avgResolutionTimeHours: number;
    csatScore: number;
  };
  
  recentActivity: ActivityItem[];
  
  systemHealth: {
    status: "healthy" | "warning" | "critical";
    apiUptime: number;
    serverCpu: number;
    serverMemory: number;
    databaseLoad: number;
    activeSessions: number;
  }
}

export interface ActivityItem {
  id: string;
  type: "signup" | "upgrade" | "downgrade" | "suspend" | "payment" | "cancel";
  businessName: string;
  description: string;
  timestamp: string;
}

// ── Verification ──────────────────────────────────────────────────────────────

export type VerificationStatus =
  | "pending"
  | "under_review"
  | "docs_requested"
  | "partially_verified"
  | "fully_verified"
  | "rejected"
  | "suspended"
  | "expired"
  | "blocked";

export type VerificationLevel = 1 | 2 | 3 | 4;

export type DocumentStatus = "pending" | "verified" | "rejected" | "expired" | "not_uploaded";

export interface VerificationDocument {
  id: string;
  type: string;          // e.g. "gst_certificate", "trade_license"
  label: string;         // e.g. "GST Certificate"
  status: DocumentStatus;
  uploadedAt?: string;
  verifiedAt?: string;
  expiresAt?: string;
  rejectionReason?: string;
  fileSize?: string;     // e.g. "2.4 MB"
  fileType?: string;     // e.g. "PDF"
  required: boolean;
}

export interface VerificationChecklistItem {
  key: string;
  label: string;
  completed: boolean;
  completedAt?: string;
}

export interface VerificationAuditLog {
  id: string;
  action: string;
  performedBy: string;
  role: "super_admin" | "verification_officer" | "system" | "business_owner";
  timestamp: string;
  remarks?: string;
  ipAddress?: string;
}

export interface BusinessVerification {
  id: string;
  businessId: string;
  businessName: string;
  businessType: BusinessType;
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  industry: string;
  country: string;
  submittedAt: string;
  updatedAt: string;
  status: VerificationStatus;
  verificationLevel: VerificationLevel;
  assignedOfficer?: string;
  checklist: VerificationChecklistItem[];
  documents: VerificationDocument[];
  auditLog: VerificationAuditLog[];
  adminRemarks?: string;
  rejectionReason?: string;
  docsDeadline?: string;
  completionPercentage: number;
}

// ── Onboarding ────────────────────────────────────────────────────────────────

export type OnboardingStatus =
  | "draft"
  | "approved"
  | "completed";

export interface OnboardingRequest {
  id: string;
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  businessName: string;
  businessType: BusinessType;
  industry: string;
  currentStep: number;   // 1-10
  totalSteps: number;    // 10
  completionPercentage: number;
  status: OnboardingStatus;
  tenantId?: string;     // generated after provisioning
  subscriptionPlan?: SubscriptionPlanSlug;
  startedAt: string;
  updatedAt: string;
  // Identity fields
  ownerDob?: string;
  ownerGender?: string;
  identityDocType?: string;
  
  // Verification states
  emailVerified?: boolean;
  mobileVerified?: boolean;
  docsVerified?: boolean;
  
  // Payment tracking
  paymentStatus?: 'pending' | 'completed' | 'failed' | 'not_required';
  paymentMethod?: string;
  paymentAmount?: number;

  notes?: string;
}

// ── Revenue Analytics ─────────────────────────────────────────────────────────

export interface RevenueMetric {
  title: string;
  value: number | string;
  previousValue: number | string;
  growthPercentage: number;
  trend: 'up' | 'down' | 'neutral';
  isCurrency?: boolean;
}

export interface RevenueTrendData {
  month: string;
  totalRevenue: number;
  recurringRevenue: number;
  newRevenue: number;
}

export interface RevenueBreakdown {
  name: string;
  value: number;
  color?: string;
}

// ── Audit Logs ────────────────────────────────────────────────────────────────

export type AuditSeverity = "info" | "warning" | "critical";
export type AuditStatus = "success" | "failed";

export interface DeviceMetadata {
  ipAddress: string;
  macAddress?: string;
  deviceName: string;
  deviceType: "desktop" | "mobile" | "tablet" | "server" | "unknown";
  browser: string;
  os: string;
  location?: string;
}

export interface AuditLog {
  id: string;
  eventId: string;
  category: string;
  action: string;
  
  module: string;
  businessId?: string;
  branchId?: string;
  
  userId: string;
  username: string;
  userRole: string;
  
  recordId?: string;
  recordName?: string;
  
  previousValues?: Record<string, unknown> | null;
  newValues?: Record<string, unknown> | null;
  
  device: DeviceMetadata;
  
  timestamp: string;
  timezone: string;
  severity: AuditSeverity;
  status: AuditStatus;
  
  failureReason?: string;
  remarks?: string;
}
