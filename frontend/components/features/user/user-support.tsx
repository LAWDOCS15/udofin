"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { LoanStatusBadge } from "@/components/shared/loan-status-badge"
import { MessageCircle, HelpCircle, Send, Plus, ChevronRight, CheckCircle } from "lucide-react"
import type { SupportTicket } from "@/types"

const DEMO_TICKETS: SupportTicket[] = [
  {
    id: "TKT001", subject: "EMI payment not reflected", description: "I paid my EMI on Feb 1st but it still shows as pending.",
    status: "in-progress", priority: "high", createdAt: "2026-02-15", updatedAt: "2026-02-16",
    messages: [
      { id: "M1", sender: "user", message: "My EMI payment of ₹16,500 made on Feb 1st is not reflecting.", createdAt: "Feb 15, 9:00 AM" },
      { id: "M2", sender: "support", message: "We are looking into this. Could you share the payment reference number?", createdAt: "Feb 15, 11:30 AM" },
    ],
  },
  {
    id: "TKT002", subject: "Need loan statement", description: "I need a detailed loan statement for tax purposes.",
    status: "resolved", priority: "low", createdAt: "2026-01-20", updatedAt: "2026-01-22",
    messages: [
      { id: "M3", sender: "user", message: "Please provide my loan statement for FY 2025-26.", createdAt: "Jan 20, 2:00 PM" },
      { id: "M4", sender: "support", message: "Your loan statement has been emailed to your registered email.", createdAt: "Jan 22, 10:00 AM" },
    ],
  },
]

const FAQ = [
  { q: "How can I prepay my loan?", a: "Go to Loan Detail page and click 'Prepayment Calculator' to see options." },
  { q: "What happens if I miss an EMI?", a: "A late fee will be charged and it may affect your CIBIL score." },
  { q: "How to download my loan agreement?", a: "Go to Loan Detail → Click 'Download Agreement' button." },
  { q: "How to update my bank details?", a: "Visit Profile → Employment tab → Update bank information." },
]

export function UserSupport() {
  const [showNewTicket, setShowNewTicket] = useState(false)
  const [subject, setSubject] = useState("")
  const [description, setDescription] = useState("")
  const [submitState, setSubmitState] = useState<"idle" | "submitting" | "success">("idle")

  const handleSubmitTicket = () => {
    if (!subject.trim() || !description.trim()) return
    setSubmitState("submitting")
    setTimeout(() => {
      setSubmitState("success")
      setTimeout(() => {
        setShowNewTicket(false)
        setSubject("")
        setDescription("")
        setSubmitState("idle")
      }, 1500)
    }, 1000)
  }

  const inputClass = "h-10 w-full rounded-xl border border-border bg-secondary/30 px-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/30 transition-colors"

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card">
        <div className="px-6 py-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>Help & Support</h1>
              <p className="text-xs text-muted-foreground mt-1">Get help with your loans and account</p>
            </div>
            <Button
              onClick={() => setShowNewTicket(true)}
              className="h-9 gap-2 rounded-full bg-accent px-5 text-xs font-semibold text-accent-foreground hover:bg-accent/90 shadow-lg shadow-accent/20"
            >
              <Plus className="h-3.5 w-3.5" /> New Ticket
            </Button>
          </div>
        </div>
      </div>

      <div className="px-6 py-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Tickets */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-base font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>My Tickets</h2>
            {DEMO_TICKETS.map((ticket) => (
              <div key={ticket.id} className="rounded-2xl border border-border bg-card p-5 hover:border-accent/20 transition-all cursor-pointer">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-semibold text-foreground">{ticket.subject}</p>
                  <LoanStatusBadge status={ticket.status} />
                </div>
                <p className="text-xs text-muted-foreground mb-3">{ticket.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] text-muted-foreground">{ticket.id}</span>
                    <span className="text-[10px] text-muted-foreground">Created: {ticket.createdAt}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-accent">
                    <MessageCircle className="h-3 w-3" /> {ticket.messages.length} messages
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* FAQ */}
          <div className="rounded-3xl border border-border bg-card p-6 shadow-sm h-fit">
            <h2 className="text-base font-bold text-foreground mb-4" style={{ fontFamily: "var(--font-heading)" }}>
              <HelpCircle className="h-4 w-4 inline mr-1.5" /> FAQ
            </h2>
            <div className="space-y-3">
              {FAQ.map((item, i) => (
                <div key={i} className="rounded-xl bg-secondary/30 p-3">
                  <p className="text-xs font-semibold text-foreground mb-1">{item.q}</p>
                  <p className="text-[10px] text-muted-foreground">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* New Ticket Modal */}
      {showNewTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setShowNewTicket(false)} />
          <div className="relative w-full max-w-md rounded-3xl border border-border bg-card shadow-2xl p-6 animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-lg font-bold text-foreground mb-4" style={{ fontFamily: "var(--font-heading)" }}>Raise a Support Ticket</h3>
            <div className="space-y-4">
              <div>
                <label className="text-[11px] font-semibold text-muted-foreground mb-1.5 block">Subject</label>
                <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Brief description of issue" className={inputClass} />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-muted-foreground mb-1.5 block">Description</label>
                <textarea
                  value={description} onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your issue in detail..."
                  rows={4}
                  className="w-full rounded-xl border border-border bg-secondary/30 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/30 transition-colors resize-none"
                />
              </div>
              <div className="flex justify-end gap-3">
                <button onClick={() => { setShowNewTicket(false); setSubject(""); setDescription("") }} className="h-9 px-4 rounded-xl text-xs text-muted-foreground hover:bg-secondary" disabled={submitState === "submitting"}>
                  Cancel
                </button>
                {submitState === "success" ? (
                  <Button className="h-9 rounded-xl bg-accent text-accent-foreground text-xs font-semibold gap-2" disabled>
                    <CheckCircle className="h-3 w-3" /> Ticket Created!
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmitTicket}
                    disabled={submitState === "submitting" || !subject.trim() || !description.trim()}
                    className="h-9 rounded-xl bg-accent text-accent-foreground hover:bg-accent/90 text-xs font-semibold gap-2"
                  >
                    {submitState === "submitting" ? <><div className="h-3 w-3 border-2 border-accent-foreground/30 border-t-accent-foreground rounded-full animate-spin" /> Submitting...</> : <><Send className="h-3 w-3" /> Submit Ticket</>}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
