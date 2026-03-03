'use client'

import { useMemo } from 'react'
import type { EMIResult } from '@/types'
export type { EMIResult }

export function useEMICalculator(
  principal: number,
  annualRate: number = 9,
  months: number = 12
): EMIResult {
  return useMemo(() => {
    if (!principal || !months || !annualRate) {
      return {
        monthlyEMI: 0,
        totalAmount: 0,
        totalInterest: 0,
        ratePerMonth: 0,
      }
    }

    const monthlyRate = annualRate / 12 / 100
    const numerator = principal * monthlyRate * Math.pow(1 + monthlyRate, months)
    const denominator = Math.pow(1 + monthlyRate, months) - 1
    const monthlyEMI = numerator / denominator

    const totalAmount = monthlyEMI * months
    const totalInterest = totalAmount - principal

    return {
      monthlyEMI: Math.round(monthlyEMI),
      totalAmount: Math.round(totalAmount),
      totalInterest: Math.round(totalInterest),
      ratePerMonth: monthlyRate,
    }
  }, [principal, annualRate, months])
}
