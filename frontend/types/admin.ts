// ─── Admin & NBFC Panel Types ───────────────────────────────────────────────

export interface LoanApplication {
  id: string
  applicantName: string
  amount: number
  status: "pending" | "approved" | "rejected" | "disbursed" | "under-review"
  rate: number
  appliedDate: string
  cibil: number
}

export interface LoanRecord {
  id: string
  applicantName: string
  amount: number
  emi: number
  status: "running" | "completed" | "pending-emi" | "overdue"
  rate: number
  appliedDate: string
  disbursedDate: string
  maturityDate: string
  cibil: number
  nextEMIDue: string
  emiPaid: number
  totalEMI: number
}
