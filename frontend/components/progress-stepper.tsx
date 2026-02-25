"use client"

import { useOnboarding } from "@/lib/onboarding-context"
import type { OnboardingStep } from "@/lib/types"
import { Check, MessageSquare, FileText, ShieldCheck, LayoutDashboard } from "lucide-react"
import { cn } from "@/lib/utils"

const steps: { key: OnboardingStep; label: string; icon: typeof Check }[] = [
  { key: "chatbot", label: "Q&A", icon: MessageSquare },
  { key: "documents", label: "Documents", icon: FileText },
  { key: "verification", label: "Verify", icon: ShieldCheck },
  { key: "dashboard", label: "Offers", icon: LayoutDashboard },
]

export function ProgressStepper() {
  const { step, completedSteps, setStep, isAuthenticated } = useOnboarding()

  if (!isAuthenticated || step === "landing" || step === "auth") return null

  const currentIdx = steps.findIndex((s) => s.key === step)

  return (
    <div className="border-b border-border bg-card/80 pt-16 backdrop-blur-xl">
      <div className="mx-auto max-w-2xl px-6 py-5 lg:px-8">
        <div className="flex items-center justify-between">
          {steps.map((s, i) => {
            const isCompleted = completedSteps.includes(s.key)
            const isCurrent = s.key === step
            const isClickable = isCompleted || isCurrent || i <= currentIdx
            const Icon = s.icon

            return (
              <div key={s.key} className="flex flex-1 items-center">
                <button
                  onClick={() => isClickable && setStep(s.key)}
                  disabled={!isClickable}
                  className={cn("flex items-center gap-2.5 transition-all", isClickable ? "cursor-pointer" : "cursor-not-allowed opacity-20")}
                >
                  <div className={cn(
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-medium transition-all duration-300",
                    isCompleted ? "bg-accent text-accent-foreground shadow-sm shadow-accent/20"
                    : isCurrent ? "bg-primary text-primary-foreground ring-[3px] ring-primary/15"
                    : "bg-secondary text-muted-foreground"
                  )}>
                    {isCompleted ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                  </div>
                  <span className={cn(
                    "hidden text-[13px] font-medium sm:block",
                    isCurrent ? "text-foreground" : isCompleted ? "text-accent" : "text-muted-foreground"
                  )}>
                    {s.label}
                  </span>
                </button>

                {i < steps.length - 1 && (
                  <div className="relative mx-4 h-[2px] flex-1 overflow-hidden rounded-full bg-border">
                    <div className={cn("absolute inset-y-0 left-0 rounded-full bg-accent transition-all duration-700 ease-out", isCompleted ? "w-full" : "w-0")} />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
