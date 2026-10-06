// ─── NextAuth Session augmentation ─────────────────────────────────────────────
import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      kycStatus: string;
    } & DefaultSession["user"];
  }
}

// ─── Tontine Types ──────────────────────────────────────────────────────────────
export type TontineStatus = "DRAFT" | "PENDING" | "ACTIVE" | "COMPLETED" | "DISSOLVED";
export type Frequency = "WEEKLY" | "BIWEEKLY" | "MONTHLY";
export type RotationMode = "MANUAL" | "RANDOM" | "AUCTION";
export type MemberRole = "ADMIN" | "CO_ADMIN" | "MEMBER";
export type MemberStatus = "INVITED" | "ACTIVE" | "SUSPENDED" | "EXCLUDED";
export type CycleStatus = "UPCOMING" | "ACTIVE" | "COMPLETED" | "FAILED";
export type ContributionStatus = "PENDING" | "PAID" | "LATE" | "EXCUSED" | "CANCELLED";
export type TransactionType = "CONTRIBUTION" | "DISBURSEMENT" | "PENALTY" | "COMMISSION" | "GUARANTEE_IN" | "GUARANTEE_OUT" | "REFUND";
export type TransactionStatus = "PENDING" | "SUCCESS" | "FAILED" | "CANCELLED";
export type PaymentMethod = "ORANGE_MONEY" | "MTN_MOMO" | "WAVE" | "MOOV_MONEY" | "FREE_MONEY" | "BANK_TRANSFER" | "CASH";
export type KycStatus = "PENDING" | "SUBMITTED" | "VERIFIED" | "REJECTED";

export interface UserSummary {
  id: string;
  name: string | null;
  email: string;
  phone: string | null;
  image: string | null;
  reliabilityScore: number;
  kycStatus: KycStatus;
}

export interface TontineSummary {
  id: string;
  name: string;
  slug: string;
  amount: number;
  currency: string;
  frequency: Frequency;
  status: TontineStatus;
  maxMembers: number;
  currentCycle: number;
  totalCycles: number;
  memberCount: number;
  collectedThisCycle: number;
  nextDueDate: Date | null;
  isAdmin: boolean;
  userHasPaid: boolean;
  createdAt: Date;
}

export interface TontineDetail extends TontineSummary {
  description: string | null;
  rotationMode: RotationMode;
  isPrivate: boolean;
  requireGuarantee: boolean;
  guaranteeAmount: number | null;
  latePenaltyAmount: number;
  latePenaltyType: "FIXED" | "PERCENTAGE";
  maxLatePayments: number;
  allowPositionSwap: boolean;
  inviteCode: string;
  commissionRate: number;
  startDate: Date | null;
  endDate: Date | null;
  members: MemberDetail[];
  cycles: CycleSummary[];
}

export interface MemberDetail {
  id: string;
  userId: string;
  role: MemberRole;
  status: MemberStatus;
  rotationPosition: number | null;
  hasReceivedPot: boolean;
  latePayments: number;
  joinedAt: Date | null;
  user: UserSummary;
}

export interface CycleSummary {
  id: string;
  cycleNumber: number;
  beneficiaryId: string | null;
  beneficiaryName: string | null;
  totalAmount: number;
  collectedAmount: number;
  startDate: Date;
  dueDate: Date;
  disbursementDate: Date | null;
  status: CycleStatus;
  progress: number; // 0-100
}

export interface ContributionDetail {
  id: string;
  cycleId: string;
  memberId: string;
  userId: string;
  amount: number;
  penaltyAmount: number;
  status: ContributionStatus;
  paymentMethod: PaymentMethod | null;
  transactionRef: string | null;
  paidAt: Date | null;
  dueDate: Date;
  memberName: string;
}

export interface DashboardStats {
  totalTontines: number;
  activeTontines: number;
  totalSaved: number;
  pendingContributions: number;
  upcomingPayments: TontineSummary[];
  recentActivity: ActivityItem[];
}

export interface ActivityItem {
  id: string;
  type: string;
  description: string;
  amount?: number;
  date: Date;
  tontineName?: string;
}

// ─── API Response types ────────────────────────────────────────────────────────
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
