// ─── EMI Calculator Types ───────────────────────────────────────────────────

export interface EMIResult {
  monthlyEMI: number
  totalAmount: number
  totalInterest: number
  ratePerMonth: number
}

export interface EMIBreakdown {
  month: number
  principal: number
  interest: number
  balance: number
}

export interface AdvancedEMIResult {
  monthlyEMI: number
  totalAmount: number
  totalInterest: number
  ratePerMonth: number
  breakdown: EMIBreakdown[]
  totalYearsAndMonths: { years: number; months: number }
  approxDailyEMI: number
  interestSavingsAt30: number
  interestSavingsAt24: number
  processingFee: number
  totalCost: number
}
