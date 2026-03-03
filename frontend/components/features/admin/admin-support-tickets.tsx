"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { SearchFilterBar } from "@/components/shared/search-filter-bar"
import { LoanStatusBadge } from "@/components/shared/loan-status-badge"
import { cn } from "@/lib/utils"
import { MessageCircle, Send, Clock, User, AlertCircle, CheckCircle2 } from "lucide-react"

type Ticket = {
  id: string; userName: string; subject: string; status: "open" | "in-progress" | "resolved" | "closed"
  priority: "low" | "medium" | "high"; createdAt: string; lastMessage: string; messages: number
}

const DEMO_TICKETS: Ticket[] = [
  { id: "TKT001", userName: "Virendra Singh", subject: "EMI payment not reflecting", status: "in-progress", priority: "high", createdAt: "2026-02-15", lastMessage: "We are looking into this issue.", messages: 4 },
  { id: "TKT002", userName: "Priya Sharma", subject: "Need loan statement for tax", status: "open", priority: "medium", createdAt: "2026-02-14", lastMessage: "Please provide my statement.", messages: 1 },
  { id: "TKT003", userName: "Arjun Verma", subject: "Unable to upload documents", status: "open", priority: "high", createdAt: "2026-02-13", lastMessage: "Getting error on upload page.", messages: 2 },
  { id: "TKT004", userName: "Meera Joshi", subject: "Interest rate query", status: "resolved", priority: "low", createdAt: "2026-02-10", lastMessage: "Thank you for the clarification!", messages: 6 },
  { id: "TKT005", userName: "Sanjay Gupta", subject: "Account access issue", status: "closed", priority: "medium", createdAt: "2026-02-08", lastMessage: "Issue resolved. Thanks!", messages: 3 },
]

const FILTERS = ["All", "Open", "In Progress", "Resolved", "Closed"]

export function AdminSupportTickets() {
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState("All")
  const [selected, setSelected] = useState<Ticket | null>(null)
  const [reply, setReply] = useState("")

  const filtered = DEMO_TICKETS.filter((t) => {
    const matchSearch = t.userName.toLowerCase().includes(search.toLowerCase()) || t.subject.toLowerCase().includes(search.toLowerCase())
    if (filter === "Open") return matchSearch && t.status === "open"
    if (filter === "In Progress") return matchSearch && t.status === "in-progress"
    if (filter === "Resolved") return matchSearch && t.status === "resolved"
    if (filter === "Closed") return matchSearch && t.status === "closed"
    return matchSearch
  })

  const priorityColor = (p: string) => {
    if (p === "high") return "bg-red-500/10 text-red-500"
    if (p === "medium") return "bg-yellow-500/10 text-yellow-500"
    return "bg-blue-500/10 text-blue-500"
  }

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>Support Tickets</h1>
        <p className="text-xs text-muted-foreground mt-1">{DEMO_TICKETS.filter((t) => t.status === "open" || t.status === "in-progress").length} tickets need attention</p>
      </div>

      <SearchFilterBar search={search} onSearchChange={setSearch} filters={FILTERS} activeFilter={filter} onFilterChange={setFilter} />

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Ticket list */}
        <div className="lg:col-span-3 space-y-3">
          {filtered.map((ticket) => (
            <div
              key={ticket.id}
              onClick={() => setSelected(ticket)}
              className={cn(
                "rounded-2xl border bg-card p-4 cursor-pointer transition-all hover:border-accent/20",
                selected?.id === ticket.id ? "border-accent/30 bg-accent/5" : "border-border"
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-muted-foreground">{ticket.id}</span>
                  <span className={cn("text-[10px] px-2 py-0.5 rounded-full font-semibold", priorityColor(ticket.priority))}>{ticket.priority}</span>
                </div>
                <LoanStatusBadge status={ticket.status} />
              </div>
              <p className="text-sm font-semibold text-foreground">{ticket.subject}</p>
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                  <User className="h-3 w-3" /> {ticket.userName}
                  <span>•</span>
                  <Clock className="h-3 w-3" /> {ticket.createdAt}
                </div>
                <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                  <MessageCircle className="h-3 w-3" /> {ticket.messages}
                </div>
              </div>
            </div>
          ))}
          {filtered.length === 0 && <div className="py-12 text-center text-sm text-muted-foreground">No tickets found</div>}
        </div>

        {/* Detail panel */}
        <div className="lg:col-span-2 rounded-3xl border border-border bg-card p-6 shadow-sm h-fit sticky top-24">
          {selected ? (
            <div className="animate-in fade-in duration-200">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-[10px] font-mono text-muted-foreground">{selected.id}</p>
                  <h3 className="text-sm font-bold text-foreground">{selected.subject}</h3>
                </div>
                <LoanStatusBadge status={selected.status} />
              </div>

              <div className="space-y-2 mb-4 border-b border-border pb-4">
                <div className="flex justify-between text-[10px]"><span className="text-muted-foreground">User</span><span className="text-foreground font-medium">{selected.userName}</span></div>
                <div className="flex justify-between text-[10px]"><span className="text-muted-foreground">Priority</span><span className={cn("font-semibold", selected.priority === "high" ? "text-red-500" : selected.priority === "medium" ? "text-yellow-500" : "text-blue-500")}>{selected.priority}</span></div>
                <div className="flex justify-between text-[10px]"><span className="text-muted-foreground">Created</span><span className="text-foreground">{selected.createdAt}</span></div>
              </div>

              <div className="mb-4">
                <p className="text-[10px] font-semibold text-muted-foreground mb-2">Last Message</p>
                <div className="rounded-xl bg-secondary/30 p-3">
                  <p className="text-xs text-foreground">{selected.lastMessage}</p>
                </div>
              </div>

              {(selected.status === "open" || selected.status === "in-progress") && (
                <div className="space-y-3">
                  <textarea
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    placeholder="Type your reply..."
                    rows={3}
                    className="w-full rounded-xl border border-border bg-secondary/30 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/30 transition-colors resize-none"
                  />
                  <div className="flex gap-2">
                    <Button className="flex-1 h-8 gap-1.5 rounded-xl bg-accent text-accent-foreground hover:bg-accent/90 text-xs font-semibold">
                      <Send className="h-3 w-3" /> Reply
                    </Button>
                    <Button variant="outline" className="h-8 gap-1.5 rounded-xl text-xs">
                      <CheckCircle2 className="h-3 w-3" /> Resolve
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="py-10 text-center">
              <MessageCircle className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Select a ticket to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
