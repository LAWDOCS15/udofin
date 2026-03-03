// ─── Landing Page / NBFC Filter Types ───────────────────────────────────────

export type LoanType =
  | "all"
  | "personal"
  | "home"
  | "car"
  | "business"
  | "education"
  | "gold"

export interface Lender {
  id: string
  name: string
  abbr: string
  loanTypes: LoanType[]
  rate: number
  maxAmount: string
  disbursal: string
  rating: number
  popular?: boolean
  features?: string[]
}
