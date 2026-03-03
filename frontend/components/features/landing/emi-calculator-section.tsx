"use client"

import { useState, useMemo } from "react"
import { Calculator, IndianRupee, Bot, FileCheck, TrendingUp } from "lucide-react"
import { Reveal } from "./shared"

const features = [
  { icon: Bot, title: "AI-Powered Onboarding", desc: "Natural language interface replaces forms. Complete your application in under 5 minutes through effortless dialogue with our AI assistant." },
  { icon: FileCheck, title: "Instant Document Verification", desc: "Government-grade APIs verify your identity documents in real time. KYC, CKYC, and CIBIL checks completed automatically." },
  { icon: TrendingUp, title: "Smart Loan Matching", desc: "Our algorithm matches your profile against 50+ lenders to find the most competitive rates and terms uniquely suited to you." },
]

function EMICalculator() {
  const [amount, setAmount] = useState(500000)
  const [rate, setRate] = useState(10.5)
  const [tenure, setTenure] = useState(36)

  const { emi, totalInterest, totalPayable } = useMemo(() => {
    const r = rate / 12 / 100
    const n = tenure
    const emiVal = (amount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
    const total = emiVal * n
    return {
      emi: Math.round(emiVal),
      totalInterest: Math.round(total - amount),
      totalPayable: Math.round(total),
    }
  }, [amount, rate, tenure])

  const interestPct = Math.round((totalInterest / totalPayable) * 100)

  return (
    <div className="rounded-3xl border border-border bg-card p-8 shadow-xl shadow-foreground/3 lg:p-10">
      <div className="flex items-center gap-3 mb-8">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-accent/10">
          <Calculator className="h-5 w-5 text-accent" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>EMI Calculator</h3>
          <p className="text-xs text-muted-foreground">Estimate your monthly payments</p>
        </div>
      </div>

      {/* Sliders */}
      <div className="flex flex-col gap-7">
        <div>
          <div className="flex items-baseline justify-between mb-3">
            <label className="text-sm font-medium text-foreground">Loan Amount</label>
            <span className="text-lg font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>
              <IndianRupee className="inline h-4 w-4 mb-0.5" />{amount.toLocaleString("en-IN")}
            </span>
          </div>
          <input type="range" min={50000} max={5000000} step={50000} value={amount} onChange={(e) => setAmount(Number(e.target.value))}
            className="w-full h-2 rounded-full bg-secondary appearance-none cursor-pointer accent-accent [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-accent [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-accent/30 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-card" />
          <div className="flex justify-between mt-1.5 text-[10px] text-muted-foreground">
            <span>50K</span><span>50L</span>
          </div>
        </div>

        <div>
          <div className="flex items-baseline justify-between mb-3">
            <label className="text-sm font-medium text-foreground">Interest Rate</label>
            <span className="text-lg font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>{rate}%</span>
          </div>
          <input type="range" min={7} max={24} step={0.25} value={rate} onChange={(e) => setRate(Number(e.target.value))}
            className="w-full h-2 rounded-full bg-secondary appearance-none cursor-pointer accent-accent [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-accent [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-accent/30 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-card" />
          <div className="flex justify-between mt-1.5 text-[10px] text-muted-foreground">
            <span>7%</span><span>24%</span>
          </div>
        </div>

        <div>
          <div className="flex items-baseline justify-between mb-3">
            <label className="text-sm font-medium text-foreground">Tenure (Months)</label>
            <span className="text-lg font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>{tenure} mo</span>
          </div>
          <input type="range" min={6} max={84} step={6} value={tenure} onChange={(e) => setTenure(Number(e.target.value))}
            className="w-full h-2 rounded-full bg-secondary appearance-none cursor-pointer accent-accent [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-accent [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-accent/30 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-card" />
          <div className="flex justify-between mt-1.5 text-[10px] text-muted-foreground">
            <span>6 mo</span><span>84 mo</span>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="mt-8 rounded-2xl bg-primary p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.15em] text-primary-foreground/40">Monthly EMI</p>
            <p className="mt-1 text-3xl font-bold text-primary-foreground lg:text-4xl" style={{ fontFamily: "var(--font-heading)" }}>
              <IndianRupee className="inline h-6 w-6 mb-1" />{emi.toLocaleString("en-IN")}
            </p>
          </div>
          <div className="flex gap-6">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-primary-foreground/30">Principal</p>
              <p className="text-sm font-semibold text-primary-foreground"><IndianRupee className="inline h-3 w-3" />{amount.toLocaleString("en-IN")}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-primary-foreground/30">Interest</p>
              <p className="text-sm font-semibold text-primary-foreground"><IndianRupee className="inline h-3 w-3" />{totalInterest.toLocaleString("en-IN")}</p>
            </div>
          </div>
        </div>
        {/* Visual bar */}
        <div className="mt-5 flex h-3 w-full overflow-hidden rounded-full">
          <div className="bg-accent transition-all duration-500" style={{ width: `${100 - interestPct}%` }} />
          <div className="bg-primary-foreground/15 transition-all duration-500" style={{ width: `${interestPct}%` }} />
        </div>
        <div className="mt-2 flex items-center gap-4 text-[10px] text-primary-foreground/40">
          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-accent" /> Principal</span>
          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-primary-foreground/15" /> Interest</span>
        </div>
      </div>
    </div>
  )
}

export function GuideFeaturesSection() {
  return (
    <section className="bg-primary">
      <div className="mx-auto max-w-7xl px-6 py-28 lg:px-8 lg:py-36">
        <div className="grid items-start gap-16 lg:grid-cols-2">
          <div className="lg:sticky lg:top-32">
            <Reveal>
              <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.25em] text-accent">Tools</p>
              <h2 className="text-balance text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl lg:text-5xl" style={{ fontFamily: "var(--font-heading)" }}>
                Calculate before{" "}
                <br className="hidden sm:block" />
                you apply.
              </h2>
              <p className="mt-5 text-primary-foreground/35 leading-relaxed">
                Use our interactive EMI calculator to understand your monthly commitments. Adjust loan amount, interest rate, and tenure to find the perfect fit.
              </p>
            </Reveal>
            <Reveal delay={100}>
              <div className="mt-10">
                <EMICalculator />
              </div>
            </Reveal>
          </div>

          {/* Feature cards */}
          <div className="flex flex-col gap-5 lg:pt-16">
            <Reveal><p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-accent">Platform</p></Reveal>
            {features.map((f, i) => {
              const Icon = f.icon
              return (
                <Reveal key={f.title} delay={i * 80}>
                  <div className="group rounded-3xl border border-primary-foreground/5 bg-primary-foreground/3 p-7 transition-all duration-500 hover:border-primary-foreground/8 hover:bg-primary-foreground/5 hover:-translate-y-0.5 lg:p-8">
                    <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/10 transition-all duration-500 group-hover:bg-accent/15 group-hover:shadow-lg group-hover:shadow-accent/10">
                      <Icon className="h-5 w-5 text-accent" />
                    </div>
                    <h3 className="mb-2 text-lg font-bold text-primary-foreground" style={{ fontFamily: "var(--font-heading)" }}>{f.title}</h3>
                    <p className="text-sm leading-relaxed text-primary-foreground/35">{f.desc}</p>
                  </div>
                </Reveal>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
