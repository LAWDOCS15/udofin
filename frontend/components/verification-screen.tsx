"use client"

import { useEffect, useState, useRef } from "react"
import { useOnboarding } from "@/lib/onboarding-context"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { CheckCircle2, Loader2, ShieldCheck, ArrowRight, Fingerprint, BarChart3, FileSearch, Scale, Lock } from "lucide-react"
import { cn } from "@/lib/utils"

const verificationSteps = [
  { label: "Identity Verification (KYC)", desc: "Checking government databases", icon: Fingerprint, duration: 2000 },
  { label: "CKYC Database Check", desc: "Central KYC registry lookup", icon: FileSearch, duration: 1800 },
  { label: "CIBIL Score Retrieval", desc: "Fetching credit history", icon: BarChart3, duration: 2200 },
  { label: "Cross-Verification", desc: "Document consistency check", icon: Lock, duration: 1600 },
  { label: "Risk Assessment", desc: "Calculating eligibility", icon: Scale, duration: 1400 },
]

export function VerificationScreen() {
  const { completeStep, setStep } = useOnboarding()
  const [currentStep, setCurrentStep] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const startedRef = useRef(false)

  useEffect(() => {
    if (startedRef.current) return
    startedRef.current = true
    let step = 0
    const runStep = () => {
      if (step >= verificationSteps.length) { setIsComplete(true); completeStep("verification"); return }
      setCurrentStep(step)
      const t = setTimeout(() => { step++; runStep() }, verificationSteps[step].duration)
      return t
    }
    const t = runStep()
    return () => { if (t) clearTimeout(t) }
  }, [completeStep])

  const progressValue = isComplete ? 100 : (currentStep / verificationSteps.length) * 100

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6 py-12 pt-24">
      <div className="w-full max-w-lg">
        {!isComplete ? (
          <div className="animate-scale-in flex flex-col items-center text-center">
            <div className="relative mb-10">
              <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-primary shadow-2xl shadow-primary/20">
                <Loader2 className="h-10 w-10 animate-spin text-primary-foreground" />
              </div>
              <div className="absolute -inset-3 -z-10 animate-pulse rounded-[28px] bg-primary/10" />
            </div>
            <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.2em] text-accent">Step 3 of 4</p>
            <h2 className="text-2xl font-bold text-foreground lg:text-3xl" style={{ fontFamily: "var(--font-heading)" }}>Verifying your application</h2>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">This usually takes about 30 seconds. Please wait while we verify your documents.</p>

            <div className="mt-10 w-full">
              <div className="mb-3 flex items-center justify-between text-xs text-muted-foreground">
                <span>Processing</span>
                <span className="font-mono">{Math.round(progressValue)}%</span>
              </div>
              <Progress value={progressValue} className="h-2" />
            </div>

            <div className="mt-8 flex w-full flex-col gap-2">
              {verificationSteps.map((vs, i) => {
                const Icon = vs.icon
                return (
                  <div key={vs.label} className={cn(
                    "flex items-center gap-4 rounded-xl px-4 py-3.5 text-left transition-all duration-500",
                    i < currentStep ? "bg-accent/5" : i === currentStep ? "bg-card border border-border shadow-sm" : "opacity-30"
                  )}>
                    <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg", i < currentStep ? "bg-accent/10" : i === currentStep ? "bg-primary/10" : "bg-secondary")}>
                      {i < currentStep ? <CheckCircle2 className="h-4 w-4 text-accent" /> : i === currentStep ? <Loader2 className="h-4 w-4 animate-spin text-primary" /> : <Icon className="h-4 w-4 text-muted-foreground" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={cn("text-sm font-medium", i <= currentStep ? "text-foreground" : "text-muted-foreground")}>{vs.label}</p>
                      <p className="text-[11px] text-muted-foreground">{vs.desc}</p>
                    </div>
                    {i < currentStep && <span className="text-[10px] font-semibold uppercase tracking-wider text-accent">Done</span>}
                  </div>
                )
              })}
            </div>
          </div>
        ) : (
          <div className="animate-scale-in flex flex-col items-center text-center">
            <div className="relative mb-10">
              <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-accent shadow-2xl shadow-accent/30">
                <ShieldCheck className="h-10 w-10 text-accent-foreground" />
              </div>
              <div className="absolute -inset-3 -z-10 rounded-[28px] bg-accent/10" />
            </div>
            <h2 className="text-2xl font-bold text-foreground lg:text-3xl" style={{ fontFamily: "var(--font-heading)" }}>Verification Complete</h2>
            <p className="mt-3 max-w-sm text-sm text-muted-foreground leading-relaxed">
              Your identity has been verified and credit profile assessed. You are eligible for personalized loan offers.
            </p>

            <div className="mt-10 grid w-full grid-cols-3 gap-3">
              {[
                { label: "KYC Status", value: "Verified", color: "text-accent" },
                { label: "CIBIL Score", value: "742", color: "text-foreground" },
                { label: "Risk Grade", value: "Low", color: "text-accent" },
              ].map((r) => (
                <div key={r.label} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{r.label}</p>
                  <p className={cn("mt-2 text-2xl font-bold", r.color)} style={{ fontFamily: "var(--font-heading)" }}>{r.value}</p>
                </div>
              ))}
            </div>

            <Button className="mt-10 h-13 w-full gap-2 rounded-xl bg-primary text-primary-foreground text-base font-semibold hover:bg-primary/90 shadow-xl shadow-primary/15 transition-all" onClick={() => { completeStep("dashboard"); setStep("dashboard") }}>
              View Loan Offers <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
