"use client"

import { cn } from "@/lib/utils"

interface StatsCardProps {
  /** Label text — also accepts `title` for backwards compatibility */
  label?: string
  title?: string
  value: string
  change?: string
  icon: React.ElementType
  accent?: boolean
  accentIndex?: number
  /** Also accepts `idx` */
  idx?: number
  animationDelay?: number
}

export function StatsCard({ label, title, value, change, icon: Icon, accent = false, accentIndex, idx, animationDelay = 0 }: StatsCardProps) {
  const displayLabel = label || title || ""
  const displayIdx = accentIndex ?? idx ?? 0

  return (
    <div
      className={cn(
        "group animate-fade-up rounded-2xl p-5 shadow-xl transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-2xl",
        accent
          ? displayIdx === 0 ? "bg-primary text-primary-foreground" : "bg-accent text-accent-foreground"
          : "border border-border bg-card",
      )}
      style={{ animationDelay: `${animationDelay}ms` }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className={cn(
          "flex h-9 w-9 items-center justify-center rounded-xl transition-transform duration-200 group-hover:scale-110",
          accent ? "bg-white/10" : "bg-secondary",
        )}>
          <Icon className={cn("h-5 w-5", accent ? "opacity-80" : "text-foreground")} />
        </div>
        {change && (
          <span className={cn(
            "text-[10px] uppercase tracking-wider font-semibold",
            accent ? "opacity-60" : change.startsWith("+") ? "text-accent" : change.startsWith("-") ? "text-red-500" : "text-accent",
          )}>
            {change}
          </span>
        )}
      </div>
      <p className={cn("text-[11px] mb-1", accent ? "opacity-50" : "text-muted-foreground")}>
        {displayLabel}
      </p>
      <p className="text-xl font-bold" style={{ fontFamily: "var(--font-heading)" }}>
        {value}
      </p>
    </div>
  )
}
