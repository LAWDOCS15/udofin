"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { LoanStatusBadge } from "@/components/shared/loan-status-badge"
import { ChevronLeft, ChevronRight, IndianRupee, Calendar } from "lucide-react"
import type { EMIEntry } from "@/types"

// ─── Demo Data ──────────────────────────────────────────────────────────────

const DEMO_EMI_CALENDAR: EMIEntry[] = [
  { emiNumber: 7, dueDate: "2026-01-01", amount: 20400, principal: 13900, interest: 6500, status: "paid", paidDate: "2026-01-01", nbfcName: "Tata Capital", loanId: "L002" },
  { emiNumber: 3, dueDate: "2026-01-05", amount: 16500, principal: 12500, interest: 4000, status: "paid", paidDate: "2026-01-05", nbfcName: "Bajaj Finserv", loanId: "L001" },
  { emiNumber: 4, dueDate: "2026-02-01", amount: 20400, principal: 14050, interest: 6350, status: "paid", paidDate: "2026-02-01", nbfcName: "Tata Capital", loanId: "L002" },
  { emiNumber: 8, dueDate: "2026-02-05", amount: 16500, principal: 12700, interest: 3800, status: "paid", paidDate: "2026-02-05", nbfcName: "Bajaj Finserv", loanId: "L001" },
  { emiNumber: 5, dueDate: "2026-03-01", amount: 20400, principal: 14200, interest: 6200, status: "upcoming", nbfcName: "Tata Capital", loanId: "L002" },
  { emiNumber: 9, dueDate: "2026-03-05", amount: 16500, principal: 12800, interest: 3700, status: "upcoming", nbfcName: "Bajaj Finserv", loanId: "L001" },
  { emiNumber: 6, dueDate: "2026-04-01", amount: 20400, principal: 14350, interest: 6050, status: "pending", nbfcName: "Tata Capital", loanId: "L002" },
  { emiNumber: 10, dueDate: "2026-04-05", amount: 16500, principal: 12900, interest: 3600, status: "pending", nbfcName: "Bajaj Finserv", loanId: "L001" },
  { emiNumber: 7, dueDate: "2026-05-01", amount: 20400, principal: 14500, interest: 5900, status: "pending", nbfcName: "Tata Capital", loanId: "L002" },
  { emiNumber: 11, dueDate: "2026-05-05", amount: 16500, principal: 13000, interest: 3500, status: "pending", nbfcName: "Bajaj Finserv", loanId: "L001" },
]

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

// Helper: parse date string as local (avoids UTC timezone shift)
const parseLocal = (ds: string) => new Date(ds + "T00:00:00")

export function UserEMICalendar() {
  const now = new Date()
  const [currentMonth, setCurrentMonth] = useState(now.getMonth())
  const [currentYear, setCurrentYear] = useState(now.getFullYear())
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
  const firstDay = new Date(currentYear, currentMonth, 1).getDay()

  // Build a lookup map: "YYYY-MM-DD" → EMIEntry[]
  const emisByDate = DEMO_EMI_CALENDAR.reduce<Record<string, EMIEntry[]>>((acc, emi) => {
    const date = emi.dueDate
    if (!acc[date]) acc[date] = []
    acc[date].push(emi)
    return acc
  }, {})

  const prevMonth = () => {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear((y) => y - 1) }
    else setCurrentMonth((m) => m - 1)
  }
  const nextMonth = () => {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear((y) => y + 1) }
    else setCurrentMonth((m) => m + 1)
  }

  // Filter EMIs for the sidebar using local date parsing
  const currentMonthEmis = DEMO_EMI_CALENDAR.filter((e) => {
    const d = parseLocal(e.dueDate)
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear
  })

  // Summary stats for current month
  const monthTotal = currentMonthEmis.reduce((s, e) => s + e.amount, 0)
  const monthPaid = currentMonthEmis.filter((e) => e.status === "paid").length
  const monthUpcoming = currentMonthEmis.filter((e) => e.status === "upcoming" || e.status === "pending").length

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card">
        <div className="px-6 py-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10">
              <Calendar className="h-5 w-5 text-accent" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>EMI Calendar</h1>
              <p className="text-xs text-muted-foreground mt-1">Track all your EMI due dates in one place</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-6 lg:px-8">
        {/* Month Summary Bar */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="rounded-2xl border border-border bg-card p-4 text-center">
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Total Due</p>
            <p className="text-lg font-bold text-foreground mt-1">₹{monthTotal.toLocaleString("en-IN")}</p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-4 text-center">
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Paid</p>
            <p className="text-lg font-bold text-accent mt-1">{monthPaid}</p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-4 text-center">
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Upcoming</p>
            <p className="text-lg font-bold text-yellow-500 mt-1">{monthUpcoming}</p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Calendar */}
          <div className="lg:col-span-2 rounded-3xl border border-border bg-card p-6 shadow-sm">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <button onClick={prevMonth} className="h-9 w-9 rounded-xl flex items-center justify-center hover:bg-secondary border border-border transition-colors">
                <ChevronLeft className="h-4 w-4 text-muted-foreground" />
              </button>
              <h2 className="text-base font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>
                {MONTHS[currentMonth]} {currentYear}
              </h2>
              <button onClick={nextMonth} className="h-9 w-9 rounded-xl flex items-center justify-center hover:bg-secondary border border-border transition-colors">
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>

            {/* Day Names */}
            <div className="grid grid-cols-7 mb-2">
              {DAYS.map((d) => (
                <div key={d} className="text-center text-[10px] font-semibold uppercase tracking-wider text-muted-foreground py-2">{d}</div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: firstDay }).map((_, i) => (
                <div key={`empty-${i}`} className="h-16" />
              ))}
              {Array.from({ length: daysInMonth }, (_, i) => {
                const day = i + 1
                const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
                const dayEmis = emisByDate[dateStr]
                const hasPaid = dayEmis?.some((e) => e.status === "paid")
                const hasUpcoming = dayEmis?.some((e) => e.status === "upcoming")
                const hasPending = dayEmis?.some((e) => e.status === "pending")
                const hasOverdue = dayEmis?.some((e) => e.status === "overdue")
                const isToday = dateStr === `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`

                return (
                  <div
                    key={day}
                    onClick={() => dayEmis && setSelectedDate(selectedDate === dateStr ? null : dateStr)}
                    className={cn(
                      "h-16 rounded-xl flex flex-col items-center justify-center relative transition-all",
                      dayEmis ? "cursor-pointer hover:scale-105 hover:shadow-md" : "",
                      isToday && !dayEmis && "ring-1 ring-accent/30",
                      hasPaid && "bg-accent/10 border-2 border-accent/30",
                      hasUpcoming && "bg-yellow-500/10 border-2 border-yellow-500/30",
                      hasPending && !hasUpcoming && "bg-blue-500/10 border-2 border-blue-500/30",
                      hasOverdue && "bg-red-500/10 border-2 border-red-500/30",
                      selectedDate === dateStr && "ring-2 ring-accent shadow-lg scale-105",
                    )}
                  >
                    <span className={cn(
                      "text-sm font-medium",
                      isToday && "font-bold",
                      dayEmis ? "font-bold text-foreground" : "text-muted-foreground",
                    )}>
                      {day}
                    </span>
                    {dayEmis && (
                      <div className="flex flex-col items-center gap-0.5 mt-0.5">
                        <p className="text-[8px] font-bold text-foreground leading-none">
                          ₹{(dayEmis.reduce((s, e) => s + e.amount, 0) / 1000).toFixed(0)}K
                        </p>
                        <div className="flex gap-0.5">
                          {dayEmis.map((_, idx) => (
                            <div key={idx} className={cn(
                              "h-1.5 w-1.5 rounded-full",
                              hasPaid ? "bg-accent" : hasOverdue ? "bg-red-500" : hasUpcoming ? "bg-yellow-500" : "bg-blue-500",
                            )} />
                          ))}
                        </div>
                      </div>
                    )}
                    {isToday && (
                      <div className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-accent border-2 border-card" />
                    )}
                  </div>
                )
              })}
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-4 mt-5 pt-4 border-t border-border">
              {[
                { color: "bg-accent", label: "Paid" },
                { color: "bg-yellow-500", label: "Upcoming" },
                { color: "bg-blue-500", label: "Scheduled" },
                { color: "bg-red-500", label: "Overdue" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-1.5">
                  <div className={cn("h-2.5 w-2.5 rounded-full", item.color)} />
                  <span className="text-[10px] font-medium text-muted-foreground">{item.label}</span>
                </div>
              ))}
            </div>

            {/* Selected Day Detail */}
            {selectedDate && emisByDate[selectedDate] && (
              <div className="mt-5 pt-5 border-t border-border animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-foreground">
                    {parseLocal(selectedDate).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                  </h3>
                  <button onClick={() => setSelectedDate(null)} className="text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded-lg hover:bg-secondary">
                    &times; Close
                  </button>
                </div>
                <div className="space-y-2">
                  {emisByDate[selectedDate].map((emi, idx) => (
                    <div key={idx} className="rounded-xl border border-border bg-secondary/30 p-4 flex items-center justify-between">
                      <div>
                        <p className="text-xs font-semibold text-foreground">{emi.nbfcName} &middot; {emi.loanId}</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">EMI #{emi.emiNumber} &middot; Principal: ₹{emi.principal.toLocaleString("en-IN")} &middot; Interest: ₹{emi.interest.toLocaleString("en-IN")}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-foreground">₹{emi.amount.toLocaleString("en-IN")}</p>
                        <LoanStatusBadge status={emi.status} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* EMIs This Month Sidebar */}
          <div className="rounded-3xl border border-border bg-card p-6 shadow-sm h-fit">
            <h3 className="text-base font-bold text-foreground mb-4" style={{ fontFamily: "var(--font-heading)" }}>
              EMIs in {MONTHS[currentMonth]}
            </h3>
            <div className="flex flex-col gap-3">
              {currentMonthEmis.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground">No EMIs scheduled this month</p>
                </div>
              ) : (
                currentMonthEmis.map((emi, i) => (
                  <div key={i} className="rounded-xl border border-border/50 bg-secondary/30 p-4 transition-all hover:bg-secondary/50">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs font-semibold text-foreground">{emi.nbfcName}</p>
                      <LoanStatusBadge status={emi.status} />
                    </div>
                    <p className="text-lg font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>
                      ₹{emi.amount.toLocaleString("en-IN")}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-[10px] text-muted-foreground">
                        Due: {parseLocal(emi.dueDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })} &middot; EMI #{emi.emiNumber}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        P: ₹{(emi.principal / 1000).toFixed(1)}K &middot; I: ₹{(emi.interest / 1000).toFixed(1)}K
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
