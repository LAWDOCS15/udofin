'use client'

import { useState } from 'react'
import { useAdvancedEMICalculator } from '@/hooks/use-advanced-emi-calculator'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { IndianRupee, TrendingDown, Zap, Info } from 'lucide-react'
import { cn } from '@/lib/utils'

export function AdvancedEMICalculator() {
  const [loanAmount, setLoanAmount] = useState(500000)
  const [interestRate, setInterestRate] = useState(10.5)
  const [months, setMonths] = useState(36)
  const [processingFee, setProcessingFee] = useState(0.5)
  const [showBreakdown, setShowBreakdown] = useState(false)

  const emi = useAdvancedEMICalculator(loanAmount, interestRate, months, processingFee)

  return (
    <div className="w-full rounded-3xl border border-border bg-card p-8 shadow-lg lg:p-10">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-foreground" style={{ fontFamily: 'var(--font-heading)' }}>
          EMI Calculator
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">Calculate your monthly loan repayment instantly</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Inputs */}
        <div className="space-y-6">
          {/* Loan Amount */}
          <div>
            <div className="mb-3 flex items-center justify-between">
              <label className="text-sm font-semibold text-foreground">Loan Amount</label>
              <span className="text-lg font-bold text-primary">₹{loanAmount.toLocaleString('en-IN')}</span>
            </div>
            <input
              type="range"
              min="50000"
              max="5000000"
              step="50000"
              value={loanAmount}
              onChange={(e) => setLoanAmount(Number(e.target.value))}
              className="w-full cursor-pointer"
            />
            <div className="mt-2 flex justify-between text-xs text-muted-foreground">
              <span>₹50K</span>
              <span>₹50L</span>
            </div>
          </div>

          {/* Interest Rate */}
          <div>
            <div className="mb-3 flex items-center justify-between">
              <label className="text-sm font-semibold text-foreground">Interest Rate (p.a.)</label>
              <span className="text-lg font-bold text-primary">{interestRate.toFixed(2)}%</span>
            </div>
            <input
              type="range"
              min="5"
              max="25"
              step="0.1"
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              className="w-full cursor-pointer"
            />
            <div className="mt-2 flex justify-between text-xs text-muted-foreground">
              <span>5%</span>
              <span>25%</span>
            </div>
          </div>

          {/* Tenure */}
          <div>
            <div className="mb-3 flex items-center justify-between">
              <label className="text-sm font-semibold text-foreground">Loan Tenure</label>
              <span className="text-lg font-bold text-primary">
                {emi.totalYearsAndMonths.years}y {emi.totalYearsAndMonths.months}m
              </span>
            </div>
            <input
              type="range"
              min="6"
              max="84"
              step="1"
              value={months}
              onChange={(e) => setMonths(Number(e.target.value))}
              className="w-full cursor-pointer"
            />
            <div className="mt-2 flex justify-between text-xs text-muted-foreground">
              <span>6 months</span>
              <span>84 months</span>
            </div>
          </div>

          {/* Processing Fee */}
          <div>
            <div className="mb-3 flex items-center justify-between">
              <label className="text-sm font-semibold text-foreground">Processing Fee</label>
              <span className="text-lg font-bold text-primary">₹{emi.processingFee.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex gap-2">
              {[0, 0.5, 1, 1.5].map((fee) => (
                <button
                  key={fee}
                  onClick={() => setProcessingFee(fee)}
                  className={cn(
                    'flex-1 rounded-lg border py-2 text-xs font-medium transition-all',
                    processingFee === fee
                      ? 'border-primary bg-primary text-white'
                      : 'border-border bg-muted hover:border-primary/30'
                  )}
                >
                  {fee}%
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results */}
        <div>
          <div className="rounded-2xl bg-gradient-to-br from-primary/5 to-accent/5 p-6">
            <h3 className="mb-6 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Loan Breakdown
            </h3>

            <div className="space-y-4">
              {/* Monthly EMI */}
              <div className="rounded-lg bg-white p-4">
                <p className="text-xs text-muted-foreground">Monthly EMI</p>
                <p className="mt-1 text-3xl font-bold text-primary" style={{ fontFamily: 'var(--font-heading)' }}>
                  ₹{emi.monthlyEMI.toLocaleString('en-IN')}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">≈ ₹{emi.approxDailyEMI} per day</p>
              </div>

              {/* Total Interest */}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-white p-4">
                  <p className="text-xs text-muted-foreground">Total Interest</p>
                  <p className="mt-2 font-bold text-foreground">₹{emi.totalInterest.toLocaleString('en-IN')}</p>
                </div>
                <div className="rounded-lg bg-white p-4">
                  <p className="text-xs text-muted-foreground">Total Cost</p>
                  <p className="mt-2 font-bold text-foreground">₹{emi.totalCost.toLocaleString('en-IN')}</p>
                </div>
              </div>

              {/* Savings */}
              {emi.interestSavingsAt24 > 0 && (
                <div className="rounded-lg border border-accent/20 bg-accent/5 p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingDown className="h-4 w-4 text-accent" />
                    <p className="text-xs font-semibold text-accent">Interest Savings at 24%</p>
                  </div>
                  <p className="text-lg font-bold text-accent">+₹{emi.interestSavingsAt24.toLocaleString('en-IN')}</p>
                </div>
              )}

              {/* Toggle Breakdown */}
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setShowBreakdown(!showBreakdown)}
              >
                {showBreakdown ? 'Hide' : 'View'} Amortization
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Amortization Breakdown */}
      {showBreakdown && (
        <div className="mt-8 rounded-2xl border border-border bg-muted/30 p-6">
          <h3 className="mb-4 font-semibold text-foreground">Payment Schedule (First 12 Months)</h3>
          <div className="max-h-80 overflow-y-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="pb-3 font-semibold text-foreground">Month</th>
                  <th className="pb-3 font-semibold text-foreground">Principal</th>
                  <th className="pb-3 font-semibold text-foreground">Interest</th>
                  <th className="pb-3 font-semibold text-foreground">Balance</th>
                </tr>
              </thead>
              <tbody>
                {emi.breakdown.slice(0, 12).map((row) => (
                  <tr key={row.month} className="border-b border-border/50 text-muted-foreground">
                    <td className="py-2">{row.month}</td>
                    <td className="py-2">₹{row.principal.toLocaleString('en-IN')}</td>
                    <td className="py-2">₹{row.interest.toLocaleString('en-IN')}</td>
                    <td className="py-2 font-medium text-foreground">₹{row.balance.toLocaleString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
