"use client"

import { useReveal } from "@/hooks/use-reveal"
import { cn } from "@/lib/utils"

/* ─── Reveal wrapper ─── */
export function Reveal({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const { ref, isRevealed } = useReveal(0.12)
  return (
    <div ref={ref} className={cn("reveal", isRevealed && "revealed", className)} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  )
}
