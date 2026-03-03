// ─── Platform Admin Types ───────────────────────────────────────────────────

export type PlatformUserStatus = "active" | "blocked" | "suspended"

export interface PlatformUser {
  id: string
  name: string
  email: string
  phone: string
  role: "user" | "admin" | "nbfc-admin"
  kycStatus: "verified" | "pending" | "rejected"
  cibilScore: number
  totalLoans: number
  activeLoans: number
  registeredDate: string
  status: PlatformUserStatus
  nbfcsTakenFrom: string[]
}

export interface NBFCPartner {
  id: string
  name: string
  registrationNumber: string
  status: "active" | "inactive" | "suspended"
  adminId: string
  adminName: string
  adminEmail: string
  totalLoans: number
  totalDisbursed: number
  approvalRate: number
  defaultRate: number
  avgProcessingTime: string
  commissionRate: number
  createdDate: string
  agreementDocUrl?: string
}

export interface AdminDashboardStats {
  totalUsers: number
  totalApplications: number
  activeLoans: number
  totalDisbursed: number
  revenue: number
  approvalRate: number
  totalNBFCs: number
  activeNBFCs: number
  newUsersThisMonth: number
  newUsersToday: number
  pendingApplications: number
  rejectedToday: number
}

export interface AuditLogEntry {
  id: string
  adminId: string
  adminName: string
  action: "login" | "approve" | "reject" | "create_nbfc" | "block_user" | "unblock_user" | "update_settings" | "create_admin"
  targetType: "user" | "application" | "nbfc" | "settings"
  targetId: string
  targetName: string
  details: string
  ip: string
  timestamp: string
}

export interface PlatformSettings {
  minInterestRate: number
  maxInterestRate: number
  minLoanAmount: number
  maxLoanAmount: number
  minCibilScore: number
  requiredDocuments: string[]
  maintenanceMode: boolean
  emailNotifications: boolean
  smsNotifications: boolean
}

export interface AdminChartData {
  label: string
  value: number
}
