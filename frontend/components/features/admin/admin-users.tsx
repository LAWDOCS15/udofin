"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { SearchFilterBar } from "@/components/shared/search-filter-bar"
import { LoanStatusBadge } from "@/components/shared/loan-status-badge"
import { ConfirmationModal } from "@/components/shared/confirmation-modal"
import { cn } from "@/lib/utils"
import { adminAPI } from "@/config/api/admin" 
import { useToast } from "@/components/shared/simple-toast" 
import {
  ArrowLeft, Ban, Shield, UserCheck, UserX, Mail, Phone,
  MapPin, Briefcase, Building2, CreditCard, FileText,
  IndianRupee, CalendarDays, Eye, CheckCircle2, AlertCircle, Download, Loader2
} from "lucide-react"

export function AdminUsers() {
  const { showToast } = useToast()
  const [users, setUsers] = useState<any[]>([]) 
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState("All")
  const [blockUser, setBlockUser] = useState<any | null>(null)
  const [selectedUser, setSelectedUser] = useState<any | null>(null)

  useEffect(() => {
    adminAPI.getUsers()
      .then(res => {
        setUsers(res.data?.users || [])
        setIsLoading(false)
      })
      .catch(err => {
        console.error(err)
        showToast("Failed to load users", "error")
        setIsLoading(false)
      })
  }, [showToast])
  
  const filtered = users.filter((u) => {
    const matchSearch = (u.name || "").toLowerCase().includes(search.toLowerCase()) || 
                        (u.email || "").toLowerCase().includes(search.toLowerCase())
    if (filter === "Active") return matchSearch && !u.isBlocked
    if (filter === "Blocked") return matchSearch && u.isBlocked

    return matchSearch
  })


  
   //  1. Export CSV Function 
  const handleExportCSV = () => {
    
    if (!filtered || filtered.length === 0) return; 

    // Excel Sheet  Columns (Headers)
    const headers = ["Name", "Email", "Phone", "Status", "Joined Date"];

    // convert Data to Rows 
    const csvRows = filtered.map(user => {
      return [
        `"${user.name || '-'}"`,
        `"${user.email || '-'}"`,
        `"${user.phoneNumber || '-'}"`,
        `"${user.status || 'Active'}"`,
        `"${new Date(user.createdAt).toLocaleDateString()}"`
      ].join(",");
    });

    // Headers and Rows ko adding
    const csvContent = [headers.join(","), ...csvRows].join("\n");

    // make a Blob and trigger download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "Users_Report.csv"); // Excel file ka naam
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ── Detail View Placeholder (You can expand this later) ──
  if (selectedUser) {
    return (
      <div className="p-6 lg:p-8 space-y-6">
        <button onClick={() => setSelectedUser(null)} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to Users
        </button>
        <div className="rounded-3xl border border-border bg-card p-6">
          <h2 className="text-xl font-bold">{selectedUser.name}</h2>
          <p className="text-sm text-muted-foreground">{selectedUser.email} | {selectedUser.phoneNumber}</p>
          <div className="mt-4 p-4 bg-secondary/20 rounded-xl">
             <p className="text-xs text-muted-foreground">More detailed view logic can be built here linking to their applications.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>User Management</h1>
          <p className="text-xs text-muted-foreground mt-1">{users.length} registered borrowers</p>
        </div>
        {/* <Button variant="outline" className="h-9 gap-2 rounded-xl text-xs"><Download className="h-3.5 w-3.5" /> Export</Button> */}

        <Button onClick={handleExportCSV} variant="outline" className="gap-2 shadow-sm rounded-xl">
        <Download className="h-4 w-4" /> Export
        </Button>
      </div>

      <SearchFilterBar search={search} onSearchChange={setSearch} filters={["All", "Active", "Blocked"]} activeFilter={filter} onFilterChange={setFilter} />

      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border bg-secondary/30">
                {["User", "Phone", "Joined Date", "Status", "Actions"].map((h) => (
                  <th key={h} className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={5} className="py-12 text-center"><Loader2 className="h-6 w-6 animate-spin text-accent mx-auto" /></td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={5} className="py-12 text-center text-sm text-muted-foreground">No users found</td></tr>
              ) : (
                filtered.map((u) => (
                  <tr key={u._id} onClick={() => setSelectedUser(u)} className="border-b border-border last:border-0 hover:bg-secondary/20 transition-colors cursor-pointer">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-accent/10 flex items-center justify-center text-xs font-bold text-accent">
                          {u.name ? u.name.substring(0, 2).toUpperCase() : "US"}
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-foreground">{u.name}</p>
                          <p className="text-[10px] text-muted-foreground">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs">{u.phoneNumber || "N/A"}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-1 text-[10px] text-accent"><UserCheck className="h-3 w-3" /> Active</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button title="View details" onClick={(e) => { e.stopPropagation(); setSelectedUser(u) }} className="h-7 w-7 rounded-lg hover:bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
                          <Eye className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}