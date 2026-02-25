"use client"

import { useOnboarding } from "@/lib/onboarding-context"
import { Button } from "@/components/ui/button"
import { useReveal, useCountUp } from "@/hooks/use-reveal"
import NBFCfilter from "@/components/NBFCfilter";
import { ArrowRight, Shield, ChevronRight, Bot, FileCheck, TrendingUp, Lock, Clock, Users, ArrowUpRight, CheckCircle2, Calculator, IndianRupee } from "lucide-react"
import { useState, useMemo } from "react"
import { cn } from "@/lib/utils"

/* ─── Animated stat number ─── */
function StatCounter({ end, suffix = "", prefix = "" }: { end: number; suffix?: string; prefix?: string }) {
  const { count, ref } = useCountUp(end, 1800)
  return <span ref={ref}>{prefix}{count.toLocaleString("en-IN")}{suffix}</span>
}

/* ─── Reveal wrapper ─── */
function Reveal({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const { ref, isRevealed } = useReveal(0.12)
  return (
    <div ref={ref} className={cn("reveal", isRevealed && "revealed", className)} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  )
}

/* ─── EMI Calculator ─── */
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

/* ─── Data ─── */
const stats = [
  { value: 50000, suffix: "+", label: "Loans disbursed" },
  { value: 5, suffix: " min", label: "Avg approval" },
  { value: 99, suffix: ".9%", label: "Platform uptime" },
  { value: 48, suffix: "/5", prefix: "", label: "User rating" },
]

const steps = [
  { num: "01", title: "Talk to our AI", desc: "Answer quick questions in a natural conversation. No paper forms.", icon: Bot },
  { num: "02", title: "Upload documents", desc: "Securely upload PAN, Aadhaar, and selfie. Verified in real time.", icon: FileCheck },
  { num: "03", title: "Get your offers", desc: "Personalized loan offers from top lenders within minutes.", icon: TrendingUp },
]

const features = [
  { icon: Bot, title: "AI-Powered Onboarding", desc: "Natural language interface replaces forms. Complete your application in under 5 minutes through effortless dialogue with our AI assistant." },
  { icon: FileCheck, title: "Instant Document Verification", desc: "Government-grade APIs verify your identity documents in real time. KYC, CKYC, and CIBIL checks completed automatically." },
  { icon: TrendingUp, title: "Smart Loan Matching", desc: "Our algorithm matches your profile against 50+ lenders to find the most competitive rates and terms uniquely suited to you." },
]

const trustItems = [
  { icon: Shield, title: "KYC Verified", desc: "Direct government API integration" },
  { icon: Lock, title: "AES-256 Encryption", desc: "Bank-grade data protection" },
  { icon: Clock, title: "Real-time Processing", desc: "Instant verification pipeline" },
  { icon: Users, title: "RBI Compliant", desc: "Fully regulated operations" },
]

/* ─── Component ─── */
export function LandingPage() {
  const { setStep } = useOnboarding()

  return (
    <div className="flex flex-col">
      {/* ══════ HERO ══════ */}
      <section className="relative overflow-hidden bg-primary pt-16">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_-20%,rgba(82,150,100,0.10),transparent)]" />
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-foreground/8 to-transparent" />

        <div className="relative mx-auto max-w-7xl px-6 pb-0 pt-24 lg:px-8 lg:pt-36">
          <div className="mx-auto max-w-4xl">
            {/* Pill */}
            <div className="mb-10 flex justify-center opacity-0 animate-fade-up" style={{ animationDelay: "0ms", animationFillMode: "forwards" }}>
              <div className="inline-flex items-center gap-2.5 rounded-full border border-primary-foreground/6 bg-primary-foreground/3 px-5 py-2.5 text-[13px] text-primary-foreground/50 backdrop-blur-sm transition-all hover:border-primary-foreground/10 hover:text-primary-foreground/60 hover:shadow-lg hover:shadow-primary-foreground/5 cursor-pointer duration-300">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
                </span>
                Announcing $20M Series A Funding
                <ChevronRight className="h-3.5 w-3.5 text-primary-foreground/25 transition-transform group-hover:translate-x-1" />
              </div>
            </div>

            {/* Headline */}
            <h1 className="text-center text-balance text-[2.5rem] font-bold leading-[1.06] tracking-tight text-primary-foreground sm:text-5xl md:text-6xl lg:text-[4.5rem] opacity-0 animate-fade-up" style={{ fontFamily: "var(--font-heading)", animationDelay: "100ms", animationFillMode: "forwards" }}>
              Smart Lending for{" "}
              <span className="relative inline-block">
                Modern India
                <svg className="absolute -bottom-2 left-0 right-0 w-full opacity-0 animate-fade-up" height="10" viewBox="0 0 200 10" fill="none" preserveAspectRatio="none" style={{ animationDelay: "500ms", animationFillMode: "forwards" }}>
                  <path d="M1 6.5Q50 1 100 5Q150 9 199 3.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none" className="text-accent" />
                </svg>
              </span>
            </h1>

            {/* Sub */}
            <p className="mx-auto mt-7 max-w-2xl text-center text-pretty text-base leading-relaxed text-primary-foreground/35 sm:text-lg lg:text-xl opacity-0 animate-fade-up" style={{ animationDelay: "200ms", animationFillMode: "forwards" }}>
              AI-powered loan applications completed in minutes. From conversation to disbursement -- transparent, secure, and instant.
            </p>

            {/* CTAs */}
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row opacity-0 animate-fade-up" style={{ animationDelay: "300ms", animationFillMode: "forwards" }}>
              <Button size="lg" className="group h-14 gap-2.5 rounded-full bg-primary-foreground px-9 text-base font-semibold text-primary shadow-2xl shadow-primary-foreground/10 transition-all hover:bg-primary-foreground/90 hover:shadow-primary-foreground/15 hover:gap-3.5" onClick={() => setStep("auth")}>
                Start Application
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Button>
              <Button variant="ghost" size="lg" className="h-14 gap-2 rounded-full px-8 text-base font-medium text-primary-foreground/50 transition-all hover:bg-primary-foreground/5 hover:text-primary-foreground/70" onClick={() => setStep("auth")}>
                Sign In to Apply
              </Button>
            </div>

            {/* Lenders */}
            <div className="mt-20 opacity-0 animate-fade-up" style={{ animationDelay: "400ms", animationFillMode: "forwards" }}>
              <p className="mb-8 text-center text-[10px] font-semibold uppercase tracking-[0.25em] text-primary-foreground/15">Trusted by leading financial institutions</p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                {[
                  { name: "HDFC Bank", code: "HDFC", color: "from-blue-900/30 to-blue-800/20" },
                  { name: "ICICI Bank", code: "ICICI", color: "from-orange-900/30 to-orange-800/20" },
                  { name: "Axis Bank", code: "AXIS", color: "from-violet-900/30 to-violet-800/20" },
                  { name: "Bajaj Finserv", code: "BFL", color: "from-red-900/30 to-red-800/20" },
                  { name: "Tata Capital", code: "TATA", color: "from-teal-900/30 to-teal-800/20" },
                  { name: "SBI", code: "SBI", color: "from-blue-900/30 to-blue-800/20" },
                ].map((inst, i) => (
                  <div key={inst.name}
                    className={`opacity-0 animate-fade-up flex items-center gap-2.5 rounded-2xl border border-primary-foreground/8 bg-gradient-to-br ${inst.color} px-4 py-2.5 transition-all duration-300 hover:border-primary-foreground/15 hover:scale-105 cursor-default`}
                    style={{ animationDelay: `${500 + i * 60}ms`, animationFillMode: "forwards" }}
                  >
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary-foreground/10 text-[10px] font-bold text-primary-foreground/60">
                      {inst.code.slice(0,2)}
                    </div>
                    <span className="text-[12px] font-semibold text-primary-foreground/25" style={{ fontFamily: "var(--font-heading)" }}>{inst.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        
        {/* ══════ LOAN SEARCH & COMPARE ══════ */}
        <div className="relative mt-16 lg:mt-24 pb-6">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-primary-foreground/[0.02] to-transparent" />
          <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
            <Reveal>
              <div className="flex items-center justify-center gap-3 mb-8">
                <div className="h-px flex-1 max-w-16 bg-gradient-to-r from-transparent to-primary-foreground/10" />
                <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-primary-foreground/25">
                  Compare Lenders
                </p>
                <div className="h-px flex-1 max-w-16 bg-gradient-to-l from-transparent to-primary-foreground/10" />
              </div>
            </Reveal>
            <NBFCfilter />
          </div>
        </div>

        {/* Stats strip */}
        <div className="relative mt-20 border-t border-primary-foreground/4">
          <div className="mx-auto grid max-w-7xl grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, i) => (
              <div key={stat.label} className={`flex flex-col px-6 py-10 lg:px-10 ${i < stats.length - 1 ? "border-r border-primary-foreground/4" : ""}`}>
                <span className="text-3xl font-bold text-primary-foreground lg:text-4xl" style={{ fontFamily: "var(--font-heading)" }}>
                  {stat.prefix}<StatCounter end={stat.value === 48 ? 4 : stat.value} suffix={stat.suffix} prefix={stat.prefix || ""} />
                </span>
                <span className="mt-2 text-[13px] text-primary-foreground/30">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════ HOW IT WORKS ══════ */}
      <section className="bg-background">
        <div className="mx-auto max-w-7xl px-6 py-28 lg:px-8 lg:py-36">
          <Reveal>
            <div className="mx-auto mb-16 max-w-2xl text-center lg:mb-20">
              <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.25em] text-accent">How it works</p>
              <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl" style={{ fontFamily: "var(--font-heading)" }}>
                Three steps to your loan
              </h2>
              <p className="mt-5 text-muted-foreground leading-relaxed">Our streamlined process gets you from application to approval faster than any traditional bank.</p>
            </div>
          </Reveal>

          <div className="grid gap-6 lg:grid-cols-3">
            {steps.map((s, i) => {
              const Icon = s.icon
              return (
                <Reveal key={s.num} delay={i * 100}>
                  <div className="group relative overflow-hidden rounded-3xl border border-border bg-card p-8 transition-all duration-500 hover:border-foreground/8 hover:shadow-2xl hover:shadow-foreground/4 hover:-translate-y-1 lg:p-10">
                    <span className="pointer-events-none absolute -right-6 -top-8 text-[140px] font-bold leading-none text-foreground/[0.02] transition-colors duration-700 group-hover:text-accent/[0.05]" style={{ fontFamily: "var(--font-heading)" }}>{s.num}</span>
                    <div className="relative">
                      <div className="mb-7 flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary transition-all duration-500 group-hover:bg-accent/10 group-hover:shadow-lg group-hover:shadow-accent/10">
                        <Icon className="h-6 w-6 text-muted-foreground transition-colors duration-500 group-hover:text-accent" />
                      </div>
                      <h3 className="mb-3 text-xl font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>{s.title}</h3>
                      <p className="text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
                    </div>
                  </div>
                </Reveal>
              )
            })}
          </div>
        </div>
      </section>

      {/* ══════ EMI CALCULATOR + FEATURES ══════ */}
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

      {/* ══════ TRUST & SECURITY ══════ */}
      <section className="bg-background">
        <div className="mx-auto max-w-7xl px-6 py-28 lg:px-8 lg:py-36">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            <Reveal>
              <div>
                <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.25em] text-accent">Security</p>
                <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl" style={{ fontFamily: "var(--font-heading)" }}>
                  Bank-grade security.
                  <br />
                  Lightning fast.
                </h2>
                <p className="mt-5 text-muted-foreground leading-relaxed">All data is encrypted end-to-end with AES-256. Documents are verified through secure government APIs and auto-deleted after processing.</p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Button className="h-12 gap-2 rounded-full bg-primary px-8 text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/10 transition-all" onClick={() => setStep("auth")}>
                    Start Application <ArrowRight className="h-4 w-4" />
                  </Button>
                
                </div>
              </div>
            </Reveal>
            <div className="grid grid-cols-2 gap-4">
              {trustItems.map((item, i) => {
                const Icon = item.icon
                return (
                  <Reveal key={item.title} delay={i * 80}>
                    <div className="group rounded-3xl border border-border bg-card p-6 transition-all duration-500 hover:border-foreground/8 hover:shadow-xl hover:shadow-foreground/3 hover:-translate-y-0.5 lg:p-7">
                      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-secondary transition-all duration-500 group-hover:bg-accent/10">
                        <Icon className="h-5 w-5 text-foreground/50 transition-colors duration-500 group-hover:text-accent" />
                      </div>
                      <p className="text-sm font-bold text-foreground">{item.title}</p>
                      <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                    </div>
                  </Reveal>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ══════ FINAL CTA ══════ */}
      <section className="bg-primary">
        <div className="mx-auto max-w-3xl px-6 py-28 text-center lg:px-8 lg:py-36">
          <Reveal>
            <h2 className="text-balance text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl lg:text-5xl" style={{ fontFamily: "var(--font-heading)" }}>
              Ready to get funded?
            </h2>
            <p className="mx-auto mt-5 max-w-lg text-primary-foreground/35 leading-relaxed">
              Join 50,000+ borrowers who got their loans approved in minutes.
            </p>
            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Button size="lg" className="group h-14 gap-2.5 rounded-full bg-primary-foreground px-10 text-base font-semibold text-primary shadow-2xl shadow-primary-foreground/10 transition-all hover:bg-primary-foreground/90 hover:gap-3.5" onClick={() => setStep("auth")}>
                Start Application
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══════ FOOTER ══════ */}
      <footer className="border-t border-border bg-card">
        <div className="mx-auto max-w-7xl px-6 py-14 lg:px-8">
          <div className="flex flex-col gap-10 sm:flex-row sm:items-start sm:justify-between">
            <div className="max-w-xs">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-primary-foreground">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span className="text-base font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>FinLend</span>
              </div>
              <p className="mt-4 text-xs leading-relaxed text-muted-foreground">AI-powered lending platform making credit accessible, transparent, and instant for everyone.</p>
            </div>
            <div className="grid grid-cols-2 gap-10 text-sm sm:grid-cols-3">
              {[
                { heading: "Product", items: ["Personal Loans", "Business Loans", "Credit Score", "EMI Calculator"] },
                { heading: "Company", items: ["About Us", "Careers", "Blog", "Contact"] },
                { heading: "Legal", items: ["Privacy Policy", "Terms of Service", "Compliance"] },
              ].map((col) => (
                <div key={col.heading}>
                  <p className="mb-3.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground/40">{col.heading}</p>
                  <div className="flex flex-col gap-2.5">
                    {col.items.map((l) => <span key={l} className="text-muted-foreground transition-colors hover:text-foreground cursor-pointer">{l}</span>)}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-border pt-8 sm:flex-row">
            <p className="text-xs text-muted-foreground/50">{"2026 FinLend Technologies Pvt. Ltd. All rights reserved."}</p>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-accent" />
              <span className="text-xs text-muted-foreground/50">RBI Registered NBFC Partner</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
