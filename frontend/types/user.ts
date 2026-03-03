// ─── User Dashboard Types ───────────────────────────────────────────────────

export type LoanStatus = "running" | "completed" | "rejected" | "pending" | "overdue"

export type LoanType = "personal" | "business" | "home" | "car" | "education" | "gold"

export interface UserLoan {
  id: string
  nbfcName: string
  nbfcLogo: string
  loanType: LoanType
  sanctionedAmount: number
  disbursedAmount: number
  interestRate: number
  tenure: number           // months
  emiAmount: number
  emiPaid: number
  totalEMI: number
  outstandingBalance: number
  status: LoanStatus
  startDate: string
  maturityDate: string
  nextEMIDate: string
}

export interface EMIEntry {
  emiNumber: number
  dueDate: string
  amount: number
  principal: number
  interest: number
  status: "paid" | "upcoming" | "overdue" | "pending"
  paidDate?: string
  loanId?: string
  nbfcName?: string
}

export interface UserNotification {
  id: string
  title: string
  message: string
  type: "success" | "warning" | "info" | "error"
  read: boolean
  createdAt: string
}

export interface UserDashboardStats {
  totalLoans: number
  runningLoans: number
  completedLoans: number
  totalOutstanding: number
  nextEMI: EMIEntry | null
  cibilScore: number
}

export interface KYCDocument {
  id: string
  type: "aadhaar" | "pan" | "address_proof" | "income_proof" | "bank_statement" | "photo" | "other"
  fileName: string
  fileUrl?: string
  status: "pending" | "verified" | "rejected"
  uploadedAt: string
  rejectedReason?: string
}

export interface SupportTicket {
  id: string
  subject: string
  description: string
  status: "open" | "in-progress" | "resolved" | "closed"
  priority: "low" | "medium" | "high"
  createdAt: string
  updatedAt: string
  messages: TicketMessage[]
}

export interface TicketMessage {
  id: string
  sender: "user" | "support"
  message: string
  createdAt: string
}
