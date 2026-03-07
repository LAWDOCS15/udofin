"use client"

import { useState, useEffect } from "react"
import { SearchFilterBar } from "@/components/shared/search-filter-bar"
import { cn } from "@/lib/utils"
import { adminAPI } from "@/config/api/admin"
import { Shield, User, Settings, FileText, Clock, ChevronLeft, ChevronRight, Loader2, AlertTriangle } from "lucide-react"

const getReadableAction = (rawAction: string, moduleName: string) => {
  const action = rawAction?.toLowerCase() || "";
  
  if (action.includes("settings")) return "Updated Platform Settings";
  if (action.includes("delete") && action.includes("nbfcs")) return "Deleted an NBFC Partner";
  if (action.includes("create-nbfc-admin")) return "Created NBFC Admin Account";
  if (action.includes("create-nbfc")) return "Onboarded New NBFC Partner";
  if (action.includes("support/reply")) return "Replied to a Support Ticket";
  if (action.includes("status") && action.includes("tickets")) return "Resolved/Closed a Support Ticket";

  if (moduleName) return moduleName.replace(/_/g, ' '); 
  
  return rawAction; 
};

// Helper for severity icons
const getActionIcon = (severity: string) => {
  if (severity === "critical") return <AlertTriangle className="h-3.5 w-3.5" />;
  if (severity === "warning") return <Shield className="h-3.5 w-3.5" />;
  return <FileText className="h-3.5 w-3.5" />;
};


export function AdminAuditLogs() {
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState("All")
  const [page, setPage] = useState(1)
  const [logs, setLogs] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await adminAPI.getAuditLogs()
        const fetchedLogs = res.data?.logs || res.data || [];
        setLogs(Array.isArray(fetchedLogs) ? fetchedLogs : []);
      } catch (error) {
        console.error("Failed to load logs", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchLogs()
  }, [])

  const filtered = logs.filter((log) => {
    const actionText = log.action?.toLowerCase() || ""
    const adminName = log.adminId?.name?.toLowerCase() || ""
    const matchSearch = actionText.includes(search.toLowerCase()) || adminName.includes(search.toLowerCase())
    
    // For now backend doesn't send severity, mapping all to info unless it's a DELETE/REJECT action
    const severity = actionText.includes('reject') || actionText.includes('delete') ? 'warning' : 'info'
    if (filter === "Info") return matchSearch && severity === "info"
    if (filter === "Warning") return matchSearch && severity === "warning"
    return matchSearch
  })

  if (isLoading) return <div className="py-20 flex justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>Audit Logs</h1>
        <p className="text-xs text-muted-foreground mt-1">Security and activity trail (Live Data)</p>
      </div>

      <SearchFilterBar search={search} onSearchChange={setSearch} filters={["All", "Info", "Warning"]} activeFilter={filter} onFilterChange={setFilter} />

      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border bg-secondary/30">
                {["Role", "Admin", "Action", "Timestamp", "IP Address"].map((h) => (
                  <th key={h} className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((log) => {
                 const severity = log.action?.toLowerCase().includes('delete') ? 'warning' : 'info';
                 return (
                <tr key={log._id} className="border-b border-border hover:bg-secondary/20 transition-colors">
                  <td className="px-4 py-3">
                    <span className={cn(
                      "text-[10px] font-semibold px-2 py-1 rounded-full",
                      log.adminRole === "SUPER_ADMIN" ? "bg-purple-500/10 text-purple-600" : "bg-blue-500/10 text-blue-500"
                    )}>
                      {log.adminRole ? log.adminRole.replace('_', ' ') : 'SYSTEM'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-xs font-semibold text-foreground">{log.adminId?.name || "System"}</p>
                    <p className="text-[10px] text-muted-foreground">{log.adminId?.email || "-"}</p>
                  </td>
                  <td className="px-4 py-3 text-xs font-medium text-foreground">
                    <div className="flex items-center gap-2">
                       <div className={cn(
                        "h-6 w-6 rounded flex items-center justify-center",
                        severity === "warning" ? "bg-red-500/10 text-red-500" : "bg-accent/10 text-accent"
                      )}>
                        {getActionIcon(severity)}
                      </div>
                      {getReadableAction(log.action, log.module)}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                      <Clock className="h-3 w-3" /> {new Date(log.createdAt).toLocaleString()}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[10px] font-mono text-muted-foreground">{log.ip || "Unknown"}</td>
                </tr>
              )})}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && <div className="py-12 text-center text-sm text-muted-foreground">No logs found</div>}
      </div>
    </div>
  )
}