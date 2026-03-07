"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { SearchFilterBar } from "@/components/shared/search-filter-bar"
import { LoanStatusBadge } from "@/components/shared/loan-status-badge"
import { useToast } from "@/components/shared/simple-toast" 
import { cn } from "@/lib/utils"
import { adminAPI } from "@/config/api/admin" 
import { MessageCircle, Send, Clock, User, CheckCircle2, Loader2 ,XCircle} from "lucide-react"

type Ticket = {
  _id: string; 
  userName: string; 
  subject: string; 
  status: "open" | "in-progress" | "resolved" | "closed"
  priority: "low" | "medium" | "high"; 
  createdAt: string; 
  messages: Array<any>;
}

const FILTERS = ["All", "Open", "In Progress", "Resolved", "Closed"]

export function AdminSupportTickets() {
  const { showToast } = useToast() 
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState("All")
  const [selected, setSelected] = useState<Ticket | null>(null)
  const [reply, setReply] = useState("")
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isReplying, setIsReplying] = useState(false)

  const fetchTickets = async () => {
    try {
      setIsLoading(true)
      const res = await adminAPI.getTickets() 
      if (res.data?.tickets) {
        setTickets(res.data.tickets)
      }
    } catch (error) {
      showToast("Could not load support tickets.", "error")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchTickets()
  }, [])

  const handleReply = async () => {
    if (!reply.trim() || !selected) return
    setIsReplying(true)
    try {
      await adminAPI.replyToTicket({ ticketId: selected._id, message: reply })
      showToast("Reply added to the ticket successfully.", "success")
      setReply("")
      fetchTickets() 
      
      const updatedRes = await adminAPI.getTickets()
      const updatedList = updatedRes.data?.tickets || []
      const reSelect = updatedList.find((t: Ticket) => t._id === selected._id)
      if(reSelect) setSelected(reSelect)
    } catch (error) {
      showToast("Could not send reply.", "error")
    } finally {
      setIsReplying(false)
    }
  }

  const filtered = tickets.filter((t) => {
    const matchSearch = (t.userName || "").toLowerCase().includes(search.toLowerCase()) || t.subject.toLowerCase().includes(search.toLowerCase())
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

  if (isLoading) {
    return <div className="min-h-[60vh] flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>Support Tickets</h1>
        <p className="text-xs text-muted-foreground mt-1">{tickets.filter((t) => t.status === "open" || t.status === "in-progress").length} tickets need attention</p>
      </div>

      <SearchFilterBar search={search} onSearchChange={setSearch} filters={FILTERS} activeFilter={filter} onFilterChange={setFilter} />

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3 space-y-3">
          {filtered.map((ticket) => {
            return (
            <div
              key={ticket._id}
              onClick={() => setSelected(ticket)}
              className={cn(
                "rounded-2xl border bg-card p-4 cursor-pointer transition-all hover:border-accent/20",
                selected?._id === ticket._id ? "border-accent/30 bg-accent/5" : "border-border"
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-muted-foreground">#{ticket._id.slice(-6).toUpperCase()}</span>
                  <span className={cn("text-[10px] px-2 py-0.5 rounded-full font-semibold", priorityColor(ticket.priority))}>{ticket.priority}</span>
                </div>
                <LoanStatusBadge status={ticket.status} />
              </div>
              <p className="text-sm font-semibold text-foreground">{ticket.subject}</p>
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                  <User className="h-3 w-3" /> {ticket.userName || "User"}
                  <span>•</span>
                  <Clock className="h-3 w-3" /> {new Date(ticket.createdAt).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                  <MessageCircle className="h-3 w-3" /> {ticket.messages?.length || 0}
                </div>
              </div>
            </div>
          )})}
          {filtered.length === 0 && <div className="py-12 text-center text-sm text-muted-foreground">No live tickets found</div>}
        </div>

        <div className="lg:col-span-2 rounded-3xl border border-border bg-card p-6 shadow-sm h-fit sticky top-24">
          {selected ? (
            <div className="animate-in fade-in duration-200">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-[10px] font-mono text-muted-foreground">#{selected._id.slice(-6).toUpperCase()}</p>
                  <h3 className="text-sm font-bold text-foreground">{selected.subject}</h3>
                </div>
                <LoanStatusBadge status={selected.status} />
              </div>

              <div className="space-y-2 mb-4 border-b border-border pb-4">
                <div className="flex justify-between text-[10px]"><span className="text-muted-foreground">User</span><span className="text-foreground font-medium">{selected.userName || "Unknown User"}</span></div>
                <div className="flex justify-between text-[10px]"><span className="text-muted-foreground">Priority</span><span className={cn("font-semibold", selected.priority === "high" ? "text-red-500" : selected.priority === "medium" ? "text-yellow-500" : "text-blue-500")}>{selected.priority}</span></div>
                <div className="flex justify-between text-[10px]"><span className="text-muted-foreground">Created</span><span className="text-foreground">{new Date(selected.createdAt).toLocaleDateString()}</span></div>
              </div>

              <div className="mb-4">
                <p className="text-[10px] font-semibold text-muted-foreground mb-2">Last Message</p>
                <div className="rounded-xl bg-secondary/30 p-3">
                  <p className="text-xs text-foreground">
                    {selected.messages?.length > 0 ? selected.messages[selected.messages.length - 1].message : "No messages."}
                  </p>
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
                    <Button onClick={handleReply} disabled={isReplying || !reply.trim()} className="flex-1 h-8 gap-1.5 rounded-xl bg-accent text-accent-foreground hover:bg-accent/90 text-xs font-semibold">
                      {isReplying ? <Loader2 className="h-3 w-3 animate-spin"/> : <Send className="h-3 w-3" />} Reply
                    </Button>
                    {/* <Button variant="outline" className="h-8 gap-1.5 rounded-xl text-xs">
                      <CheckCircle2 className="h-3 w-3" /> Resolve
                    </Button> */}
                    <Button 
  onClick={async () => {
    try {
      await adminAPI.updateTicketStatus(selected._id, "resolved");
      showToast("Ticket marked as Resolved", "success");
      fetchTickets();
      setSelected(null);
    } catch (e) { showToast("Failed to resolve", "error"); }
              }}
              variant="outline" 
              className="h-8 gap-1.5 rounded-xl text-xs"
            >
              <CheckCircle2 className="h-3 w-3" /> Resolve
            </Button>
            <Button 
    onClick={async () => {
      try {
        await adminAPI.updateTicketStatus(selected._id, "closed");
        showToast("Ticket Closed successfully", "success");
        fetchTickets();
        setSelected(null);
      } catch (e) { showToast("Failed to close ticket", "error"); }
    }}
    variant="destructive" 
    className="h-8 gap-1.5 rounded-xl text-xs bg-red-100 text-red-600 hover:bg-red-200 border-0"
  >
    <XCircle className="h-3 w-3" /> Close
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