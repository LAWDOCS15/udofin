'use client'

import { useMemo } from 'react'

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

export function useAdvancedEMICalculator(
  principal: number,
  annualRate: number = 9,
  months: number = 12,
  processingFeePercent: number = 0.5
): AdvancedEMIResult {
  return useMemo(() => {
    if (!principal || !months || !annualRate) {
      return {
        monthlyEMI: 0,
        totalAmount: 0,
        totalInterest: 0,
        ratePerMonth: 0,
        breakdown: [],
        totalYearsAndMonths: { years: 0, months: 0 },
        approxDailyEMI: 0,
        interestSavingsAt30: 0,
        interestSavingsAt24: 0,
        processingFee: 0,
        totalCost: 0,
      }
    }

    const monthlyRate = annualRate / 12 / 100
    const numerator = principal * monthlyRate * Math.pow(1 + monthlyRate, months)
    const denominator = Math.pow(1 + monthlyRate, months) - 1
    const monthlyEMI = numerator / denominator

    const totalAmount = monthlyEMI * months
    const totalInterest = totalAmount - principal
    const processingFee = Math.round(principal * (processingFeePercent / 100))
    const totalCost = totalAmount + processingFee

    // Generate amortization breakdown
    let balance = principal
    const breakdown: EMIBreakdown[] = []

    for (let i = 1; i <= Math.min(months, 60); i++) {
      const interestPayment = Math.round(balance * monthlyRate)
      const principalPayment = Math.round(monthlyEMI - interestPayment)
      balance = Math.max(0, balance - principalPayment)

      breakdown.push({
        month: i,
        principal: principalPayment,
        interest: interestPayment,
        balance: balance,
      })
    }

    // Calculate interest savings
    const emiAt30 = (principal * 0.30 / 12 * Math.pow(1 + 0.30 / 12 / 100, months)) / (Math.pow(1 + 0.30 / 12 / 100, months) - 1)
    const interestAt30 = (emiAt30 * months) - principal
    const interestSavingsAt30 = Math.round(interestAt30 - totalInterest)

    const emiAt24 = (principal * 0.24 / 12 * Math.pow(1 + 0.24 / 12 / 100, months)) / (Math.pow(1 + 0.24 / 12 / 100, months) - 1)
    const interestAt24 = (emiAt24 * months) - principal
    const interestSavingsAt24 = Math.round(interestAt24 - totalInterest)

    return {
      monthlyEMI: Math.round(monthlyEMI),
      totalAmount: Math.round(totalAmount),
      totalInterest: Math.round(totalInterest),
      ratePerMonth: monthlyRate,
      breakdown,
      totalYearsAndMonths: {
        years: Math.floor(months / 12),
        months: months % 12,
      },
      approxDailyEMI: Math.round(monthlyEMI / 30),
      interestSavingsAt30,
      interestSavingsAt24,
      processingFee,
      totalCost,
    }
  }, [principal, annualRate, months, processingFeePercent])
}
