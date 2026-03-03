// ─── NBFC Admin Panel Types ─────────────────────────────────────────────────

export type NBFCApplicationStatus = "pending" | "approved" | "rejected" | "disbursed" | "under-review"

export interface NBFCApplication {
  id: string
  applicantName: string
  applicantPhone: string
  applicantEmail: string
  amount: number
  loanType: string
  status: NBFCApplicationStatus
  cibilScore: number
  interestRate: number
  tenure: number
  emiAmount: number
  appliedDate: string
  documents: string[]
  timeline: ApplicationTimelineEntry[]
  rejectionReason?: string
}

export interface ApplicationTimelineEntry {
  status: string
  date: string
  note?: string
  by?: string
}

export interface NBFCCustomer {
  id: string
  name: string
  phone: string
  email: string
  totalLoans: number
  activeLoans: number
  totalOutstanding: number
  cibilScore: number
  kycStatus: "verified" | "pending" | "rejected"
  riskLevel: "low" | "medium" | "high"
  joinedDate: string
}

export interface NBFCEMIRecord {
  id: string
  customerId: string
  customerName: string
  customerPhone: string
  loanId: string
  emiNumber: number
  totalEMI: number
  amount: number
  dueDate: string
  status: "paid" | "upcoming" | "overdue" | "pending"
  paidDate?: string
  daysOverdue?: number
}

export interface NBFCDisbursement {
  id: string
  loanId: string
  applicantName: string
  amount: number
  status: "pending" | "disbursed" | "failed"
  approvedDate: string
  disbursedDate?: string
  bankRef?: string
  accountNumber?: string
  ifsc?: string
}

export interface NBFCDashboardStats {
  totalLoans: number
  runningLoans: number
  completedLoans: number
  totalDisbursed: number
  emiExpectedToday: number
  emiCollectedToday: number
  emiOverdueToday: number
  pendingApplications: number
  pendingDisbursements: number
  pendingDocVerifications: number
  defaultRate: number
}

export interface NBFCStaffMember {
  id: string
  name: string
  email: string
  role: "manager" | "agent" | "verifier"
  status: "active" | "inactive"
  joinedDate: string
  assignedApplications: number
}
