"use client"

import { useState } from "react"
import { SearchFilterBar } from "@/components/shared/search-filter-bar"
import { cn } from "@/lib/utils"
import { Shield, User, Settings, FileText, Clock, ChevronLeft, ChevronRight, AlertTriangle, LogIn, LogOut, Edit } from "lucide-react"
import type { AuditLogEntry } from "@/types"

const DEMO_LOGS: AuditLogEntry[] = [
  { id: "AL001", userId: "U001", userName: "Admin (Priyanshu)", action: "Approved application APP003", resource: "application", timestamp: "2026-02-16 14:32:01", ipAddress: "192.168.1.100", severity: "info" },
  { id: "AL002", userId: "U002", userName: "Admin (Priyanshu)", action: "Blocked user Rajesh Kumar", resource: "user", timestamp: "2026-02-16 13:15:44", ipAddress: "192.168.1.100", severity: "warning" },
  { id: "AL003", userId: "U001", userName: "Admin (Priyanshu)", action: "Created NBFC partner: QuickLend Finance", resource: "nbfc", timestamp: "2026-02-16 11:08:22", ipAddress: "192.168.1.100", severity: "info" },
  { id: "AL004", userId: "U004", userName: "NBFC Admin (Anjali)", action: "Disbursed ₹8L to Virendra Singh", resource: "loan", timestamp: "2026-02-16 10:45:30", ipAddress: "10.0.0.15", severity: "info" },
  { id: "AL005", userId: "U001", userName: "Admin (Priyanshu)", action: "Updated platform settings", resource: "settings", timestamp: "2026-02-15 18:20:11", ipAddress: "192.168.1.100", severity: "info" },
  { id: "AL006", userId: "system", userName: "System", action: "Failed login attempt (3 times) for admin@udofin.in", resource: "auth", timestamp: "2026-02-15 16:05:33", ipAddress: "45.33.12.89", severity: "critical" },
  { id: "AL007", userId: "U001", userName: "Admin (Priyanshu)", action: "Exported user data CSV", resource: "export", timestamp: "2026-02-15 14:50:18", ipAddress: "192.168.1.100", severity: "warning" },
  { id: "AL008", userId: "U004", userName: "NBFC Admin (Anjali)", action: "Rejected application APP005", resource: "application", timestamp: "2026-02-15 12:30:45", ipAddress: "10.0.0.15", severity: "info" },
]

const FILTERS = ["All", "Info", "Warning", "Critical"]

const getActionIcon = (resource: string) => {
  const map: Record<string, React.ReactNode> = {
    application: <FileText className="h-3.5 w-3.5" />,
    user: <User className="h-3.5 w-3.5" />,
    nbfc: <Settings className="h-3.5 w-3.5" />,
    loan: <Edit className="h-3.5 w-3.5" />,
    settings: <Settings className="h-3.5 w-3.5" />,
    auth: <LogIn className="h-3.5 w-3.5" />,
    export: <LogOut className="h-3.5 w-3.5" />,
  }
  return map[resource] || <Shield className="h-3.5 w-3.5" />
}

export function AdminAuditLogs() {
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState("All")
  const [page, setPage] = useState(1)

  const filtered = DEMO_LOGS.filter((log) => {
    const matchSearch = log.action.toLowerCase().includes(search.toLowerCase()) || log.userName.toLowerCase().includes(search.toLowerCase())
    if (filter === "Info") return matchSearch && log.severity === "info"
    if (filter === "Warning") return matchSearch && log.severity === "warning"
    if (filter === "Critical") return matchSearch && log.severity === "critical"
    return matchSearch
  })

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>Audit Logs</h1>
        <p className="text-xs text-muted-foreground mt-1">Security and activity trail</p>
      </div>

      <SearchFilterBar search={search} onSearchChange={setSearch} filters={FILTERS} activeFilter={filter} onFilterChange={setFilter} />

      {/* Logs */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border bg-secondary/30">
                {["Severity", "User", "Action", "Timestamp", "IP Address"].map((h) => (
                  <th key={h} className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((log) => (
                <tr key={log.id} className="border-b border-border last:border-0 hover:bg-secondary/20 transition-colors">
                  <td className="px-4 py-3">
                    <div className={cn(
                      "h-7 w-7 rounded-lg flex items-center justify-center",
                      log.severity === "critical" ? "bg-red-500/10 text-red-500" :
                      log.severity === "warning" ? "bg-yellow-500/10 text-yellow-500" :
                      "bg-blue-500/10 text-blue-500"
                    )}>
                      {log.severity === "critical" ? <AlertTriangle className="h-3.5 w-3.5" /> : getActionIcon(log.resource)}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-xs font-semibold text-foreground">{log.userName}</p>
                    <p className="text-[10px] text-muted-foreground font-mono">{log.userId}</p>
                  </td>
                  <td className="px-4 py-3 text-xs text-foreground max-w-xs">{log.action}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                      <Clock className="h-3 w-3" /> {log.timestamp}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[10px] font-mono text-muted-foreground">{log.ipAddress}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && <div className="py-12 text-center text-sm text-muted-foreground">No logs found</div>}
        <div className="flex items-center justify-between border-t border-border px-4 py-3">
          <p className="text-[10px] text-muted-foreground">Showing {filtered.length} entries</p>
          <div className="flex items-center gap-1">
            <button onClick={() => setPage(Math.max(1, page - 1))} className="h-7 w-7 rounded-lg hover:bg-secondary flex items-center justify-center text-muted-foreground"><ChevronLeft className="h-3.5 w-3.5" /></button>
            <span className="h-7 w-7 rounded-lg bg-accent/10 text-accent flex items-center justify-center text-xs font-medium">{page}</span>
            <button onClick={() => setPage(page + 1)} className="h-7 w-7 rounded-lg hover:bg-secondary flex items-center justify-center text-muted-foreground"><ChevronRight className="h-3.5 w-3.5" /></button>
          </div>
        </div>
      </div>
    </div>
  )
}
