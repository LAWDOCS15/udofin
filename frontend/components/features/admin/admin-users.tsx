"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { SearchFilterBar } from "@/components/shared/search-filter-bar"
import { LoanStatusBadge } from "@/components/shared/loan-status-badge"
import { ConfirmationModal } from "@/components/shared/confirmation-modal"
import { cn } from "@/lib/utils"
import {
  ArrowLeft, Ban, Shield, UserCheck, UserX, Mail, Phone,
  MapPin, Briefcase, Building2, CreditCard, FileText,
  IndianRupee, CalendarDays, Eye, CheckCircle2, AlertCircle, Download,
} from "lucide-react"

// ─── Extended User type for admin detail view ───────────────────────────────

interface AdminUser {
  id: string
  name: string
  email: string
  phone: string
  dob: string
  address: string
  panNumber: string
  aadhaarNumber: string
  status: "active" | "blocked"
  kycVerified: boolean
  cibilScore: number
  joinedAt: string
  // Employment / Company
  employmentType: string
  companyName: string
  designation: string
  monthlyIncome: number
  workExperience: string
  // Loan summary
  totalLoans: number
  activeLoans: number
  totalBorrowed: number
  totalRepaid: number
  outstandingBalance: number
  // Loans breakdown
  loans: {
    id: string
    nbfcName: string
    amount: number
    emiAmount: number
    rate: number
    status: "running" | "completed" | "overdue"
    disbursedDate: string
    emiPaid: number
    totalEMI: number
  }[]
  // Documents
  documents: {
    name: string
    type: string
    status: "verified" | "pending" | "rejected"
    uploadedAt: string
  }[]
}

// ─── Demo Data (only loan-approved users) ───────────────────────────────────

const DEMO_USERS: AdminUser[] = [
  {
    id: "U001", name: "Virendra Singh", email: "virendra@email.com", phone: "+91 98765 43210",
    dob: "1992-04-15", address: "42 Sector 15, Noida, UP 201301", panNumber: "ABCPS1234K", aadhaarNumber: "XXXX-XXXX-4532",
    status: "active", kycVerified: true, cibilScore: 758, joinedAt: "2025-11-15",
    employmentType: "Salaried", companyName: "TCS Limited", designation: "Senior Developer", monthlyIncome: 95000, workExperience: "6 years",
    totalLoans: 2, activeLoans: 1, totalBorrowed: 1300000, totalRepaid: 420000, outstandingBalance: 880000,
    loans: [
      { id: "L001", nbfcName: "Bajaj Finserv", amount: 500000, emiAmount: 16500, rate: 11.5, status: "running", disbursedDate: "2025-07-05", emiPaid: 8, totalEMI: 36 },
      { id: "L003", nbfcName: "HDFC", amount: 800000, emiAmount: 22400, rate: 10.5, status: "completed", disbursedDate: "2024-03-10", emiPaid: 24, totalEMI: 24 },
    ],
    documents: [
      { name: "PAN Card", type: "identity", status: "verified", uploadedAt: "2025-11-15" },
      { name: "Aadhaar Card", type: "identity", status: "verified", uploadedAt: "2025-11-15" },
      { name: "Salary Slips (3 months)", type: "income", status: "verified", uploadedAt: "2025-11-16" },
      { name: "Bank Statement (6 months)", type: "financial", status: "verified", uploadedAt: "2025-11-16" },
      { name: "Address Proof", type: "address", status: "verified", uploadedAt: "2025-11-15" },
      { name: "Passport Photo", type: "photo", status: "verified", uploadedAt: "2025-11-15" },
    ],
  },
  {
    id: "U002", name: "Priya Sharma", email: "priya@email.com", phone: "+91 87654 32109",
    dob: "1995-06-20", address: "123 HSR Layout, Bangalore, KA 560102", panNumber: "DEFPS5678L", aadhaarNumber: "XXXX-XXXX-7821",
    status: "active", kycVerified: true, cibilScore: 745, joinedAt: "2025-12-01",
    employmentType: "Salaried", companyName: "Infosys Ltd", designation: "Software Engineer", monthlyIncome: 75000, workExperience: "4 years",
    totalLoans: 1, activeLoans: 1, totalBorrowed: 500000, totalRepaid: 66000, outstandingBalance: 434000,
    loans: [
      { id: "L002", nbfcName: "Tata Capital", amount: 500000, emiAmount: 16500, rate: 11.25, status: "running", disbursedDate: "2025-12-10", emiPaid: 3, totalEMI: 36 },
    ],
    documents: [
      { name: "PAN Card", type: "identity", status: "verified", uploadedAt: "2025-12-01" },
      { name: "Aadhaar Card", type: "identity", status: "verified", uploadedAt: "2025-12-01" },
      { name: "Salary Slips (3 months)", type: "income", status: "verified", uploadedAt: "2025-12-02" },
      { name: "Bank Statement (6 months)", type: "financial", status: "verified", uploadedAt: "2025-12-02" },
      { name: "Address Proof", type: "address", status: "verified", uploadedAt: "2025-12-01" },
      { name: "Passport Photo", type: "photo", status: "verified", uploadedAt: "2025-12-01" },
    ],
  },
  {
    id: "U005", name: "Arjun Verma", email: "arjun@email.com", phone: "+91 54321 09876",
    dob: "1990-01-10", address: "78 MG Road, Pune, MH 411001", panNumber: "GHIPS9012M", aadhaarNumber: "XXXX-XXXX-3156",
    status: "active", kycVerified: true, cibilScore: 710, joinedAt: "2026-01-05",
    employmentType: "Self-Employed", companyName: "Verma Traders Pvt Ltd", designation: "Director", monthlyIncome: 120000, workExperience: "8 years",
    totalLoans: 1, activeLoans: 1, totalBorrowed: 450000, totalRepaid: 45000, outstandingBalance: 405000,
    loans: [
      { id: "L004", nbfcName: "Axis Finance", amount: 450000, emiAmount: 14800, rate: 12.0, status: "running", disbursedDate: "2026-01-15", emiPaid: 2, totalEMI: 36 },
    ],
    documents: [
      { name: "PAN Card", type: "identity", status: "verified", uploadedAt: "2026-01-05" },
      { name: "Aadhaar Card", type: "identity", status: "verified", uploadedAt: "2026-01-05" },
      { name: "ITR (2 years)", type: "income", status: "verified", uploadedAt: "2026-01-06" },
      { name: "Bank Statement (6 months)", type: "financial", status: "verified", uploadedAt: "2026-01-06" },
      { name: "Business Registration", type: "business", status: "verified", uploadedAt: "2026-01-06" },
      { name: "Passport Photo", type: "photo", status: "verified", uploadedAt: "2026-01-05" },
    ],
  },
  {
    id: "U006", name: "Rajesh Kumar", email: "rajesh@email.com", phone: "+91 76543 21098",
    dob: "1988-09-05", address: "56 Civil Lines, Jaipur, RJ 302001", panNumber: "JKLPS3456N", aadhaarNumber: "XXXX-XXXX-9347",
    status: "active", kycVerified: true, cibilScore: 780, joinedAt: "2025-10-20",
    employmentType: "Salaried", companyName: "Wipro Technologies", designation: "Project Manager", monthlyIncome: 140000, workExperience: "10 years",
    totalLoans: 3, activeLoans: 1, totalBorrowed: 2200000, totalRepaid: 1450000, outstandingBalance: 750000,
    loans: [
      { id: "L005", nbfcName: "Bajaj Finserv", amount: 1000000, emiAmount: 28500, rate: 10.0, status: "running", disbursedDate: "2025-10-25", emiPaid: 5, totalEMI: 48 },
      { id: "L006", nbfcName: "HDFC", amount: 700000, emiAmount: 21000, rate: 10.5, status: "completed", disbursedDate: "2024-06-15", emiPaid: 36, totalEMI: 36 },
      { id: "L007", nbfcName: "Tata Capital", amount: 500000, emiAmount: 16500, rate: 11.0, status: "completed", disbursedDate: "2023-09-01", emiPaid: 24, totalEMI: 24 },
    ],
    documents: [
      { name: "PAN Card", type: "identity", status: "verified", uploadedAt: "2025-10-20" },
      { name: "Aadhaar Card", type: "identity", status: "verified", uploadedAt: "2025-10-20" },
      { name: "Salary Slips (3 months)", type: "income", status: "verified", uploadedAt: "2025-10-21" },
      { name: "Bank Statement (6 months)", type: "financial", status: "verified", uploadedAt: "2025-10-21" },
      { name: "Address Proof", type: "address", status: "verified", uploadedAt: "2025-10-20" },
      { name: "Passport Photo", type: "photo", status: "verified", uploadedAt: "2025-10-20" },
    ],
  },
  {
    id: "U007", name: "Meera Joshi", email: "meera@email.com", phone: "+91 43210 98765",
    dob: "1993-12-25", address: "90 Anna Nagar, Chennai, TN 600040", panNumber: "MNOPS7890P", aadhaarNumber: "XXXX-XXXX-6278",
    status: "blocked", kycVerified: true, cibilScore: 690, joinedAt: "2025-09-10",
    employmentType: "Salaried", companyName: "HCL Technologies", designation: "QA Lead", monthlyIncome: 85000, workExperience: "5 years",
    totalLoans: 1, activeLoans: 1, totalBorrowed: 600000, totalRepaid: 120000, outstandingBalance: 480000,
    loans: [
      { id: "L008", nbfcName: "Axis Finance", amount: 600000, emiAmount: 19800, rate: 12.5, status: "overdue", disbursedDate: "2025-09-15", emiPaid: 4, totalEMI: 36 },
    ],
    documents: [
      { name: "PAN Card", type: "identity", status: "verified", uploadedAt: "2025-09-10" },
      { name: "Aadhaar Card", type: "identity", status: "verified", uploadedAt: "2025-09-10" },
      { name: "Salary Slips (3 months)", type: "income", status: "verified", uploadedAt: "2025-09-11" },
      { name: "Bank Statement (6 months)", type: "financial", status: "verified", uploadedAt: "2025-09-11" },
      { name: "Address Proof", type: "address", status: "verified", uploadedAt: "2025-09-10" },
      { name: "Passport Photo", type: "photo", status: "verified", uploadedAt: "2025-09-10" },
    ],
  },
]

const FILTERS = ["All", "Active", "Blocked"]

const fmtDate = (d: string) =>
  new Date(d + "T00:00:00").toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })

// ─── User Detail View ───────────────────────────────────────────────────────

function UserDetailView({ user, onBack }: { user: AdminUser; onBack: () => void }) {
  return (
    <div className="p-6 lg:p-8 space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <button onClick={onBack} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group">
        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" /> Back to Users
      </button>

      {/* User Header */}
      <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-accent/10 flex items-center justify-center text-lg font-bold text-accent">
              {user.name.split(" ").map((n) => n[0]).join("")}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>{user.name}</h2>
                <LoanStatusBadge status={user.status} />
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">ID: {user.id} &middot; Joined {fmtDate(user.joinedAt)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="h-8 gap-1.5 rounded-xl text-xs"><Mail className="h-3.5 w-3.5" /> Email</Button>
            <Button variant="outline" className={cn("h-8 gap-1.5 rounded-xl text-xs", user.status === "blocked" ? "text-accent border-accent/30" : "text-destructive border-destructive/30")}>
              {user.status === "blocked" ? <><Shield className="h-3.5 w-3.5" /> Unblock</> : <><Ban className="h-3.5 w-3.5" /> Block</>}
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {/* Personal Details */}
        <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
          <h3 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2" style={{ fontFamily: "var(--font-heading)" }}>
            <UserCheck className="h-4 w-4 text-accent" /> Personal Details
          </h3>
          <div className="space-y-3">
            {[
              { icon: Mail, label: "Email", value: user.email },
              { icon: Phone, label: "Phone", value: user.phone },
              { icon: CalendarDays, label: "Date of Birth", value: fmtDate(user.dob) },
              { icon: MapPin, label: "Address", value: user.address },
              { icon: CreditCard, label: "PAN Number", value: user.panNumber },
              { icon: CreditCard, label: "Aadhaar Number", value: user.aadhaarNumber },
            ].map((item) => (
              <div key={item.label} className="flex items-start gap-3 rounded-xl bg-secondary/30 px-4 py-2.5">
                <item.icon className="h-3.5 w-3.5 text-muted-foreground mt-0.5 shrink-0" />
                <div>
                  <p className="text-[10px] text-muted-foreground">{item.label}</p>
                  <p className="text-xs font-medium text-foreground">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* KYC & CIBIL */}
        <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
          <h3 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2" style={{ fontFamily: "var(--font-heading)" }}>
            <Shield className="h-4 w-4 text-accent" /> KYC & Credit Score
          </h3>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="rounded-xl bg-secondary/40 p-4 text-center">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">KYC Status</p>
              <div className="mt-2">
                {user.kycVerified ? (
                  <span className="inline-flex items-center gap-1 text-sm font-bold text-accent"><CheckCircle2 className="h-4 w-4" /> Verified</span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-sm font-bold text-yellow-500"><AlertCircle className="h-4 w-4" /> Pending</span>
                )}
              </div>
            </div>
            <div className="rounded-xl bg-secondary/40 p-4 text-center">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">CIBIL Score</p>
              <p className={cn("text-2xl font-bold mt-1", user.cibilScore >= 750 ? "text-accent" : user.cibilScore >= 700 ? "text-yellow-500" : "text-red-500")}>
                {user.cibilScore}
              </p>
            </div>
          </div>

          {/* Company / Employment */}
          <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2 pt-3 border-t border-border" style={{ fontFamily: "var(--font-heading)" }}>
            <Building2 className="h-4 w-4 text-accent" /> Company Details
          </h3>
          <div className="space-y-2.5">
            {[
              { label: "Employment Type", value: user.employmentType },
              { label: "Company", value: user.companyName },
              { label: "Designation", value: user.designation },
              { label: "Monthly Income", value: `₹${user.monthlyIncome.toLocaleString("en-IN")}` },
              { label: "Experience", value: user.workExperience },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between rounded-xl bg-secondary/30 px-4 py-2.5">
                <span className="text-[10px] text-muted-foreground">{item.label}</span>
                <span className="text-xs font-semibold text-foreground">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Loan Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {[
          { label: "Total Loans", value: String(user.totalLoans), color: "text-foreground" },
          { label: "Active Loans", value: String(user.activeLoans), color: "text-accent" },
          { label: "Total Borrowed", value: `₹${(user.totalBorrowed / 100000).toFixed(1)}L`, color: "text-foreground" },
          { label: "Total Repaid", value: `₹${(user.totalRepaid / 100000).toFixed(1)}L`, color: "text-accent" },
          { label: "Outstanding", value: `₹${(user.outstandingBalance / 100000).toFixed(1)}L`, color: "text-red-500" },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border border-border bg-card p-4 text-center">
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">{s.label}</p>
            <p className={cn("text-lg font-bold mt-1", s.color)}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* All Loans Table */}
      <div className="rounded-3xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex items-center gap-2">
          <IndianRupee className="h-4 w-4 text-accent" />
          <h3 className="text-sm font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>All Loans</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border bg-secondary/30">
                {["Loan ID", "NBFC", "Amount", "EMI", "Rate", "Progress", "Status", "Disbursed"].map((h) => (
                  <th key={h} className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {user.loans.map((loan) => (
                <tr key={loan.id} className="border-b border-border last:border-0 hover:bg-secondary/20 transition-colors">
                  <td className="px-4 py-3 text-xs font-mono text-accent">{loan.id}</td>
                  <td className="px-4 py-3 text-xs font-semibold text-foreground">{loan.nbfcName}</td>
                  <td className="px-4 py-3 text-xs text-foreground">₹{(loan.amount / 100000).toFixed(1)}L</td>
                  <td className="px-4 py-3 text-xs text-foreground">₹{loan.emiAmount.toLocaleString("en-IN")}</td>
                  <td className="px-4 py-3 text-xs text-foreground">{loan.rate}%</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-16 rounded-full bg-secondary overflow-hidden">
                        <div className="h-full rounded-full bg-accent" style={{ width: `${(loan.emiPaid / loan.totalEMI) * 100}%` }} />
                      </div>
                      <span className="text-[10px] text-muted-foreground">{loan.emiPaid}/{loan.totalEMI}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3"><LoanStatusBadge status={loan.status} /></td>
                  <td className="px-4 py-3 text-[10px] text-muted-foreground">{fmtDate(loan.disbursedDate)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* All Documents */}
      <div className="rounded-3xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex items-center gap-2">
          <FileText className="h-4 w-4 text-accent" />
          <h3 className="text-sm font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>Documents</h3>
        </div>
        <div className="grid gap-3 p-5 sm:grid-cols-2 lg:grid-cols-3">
          {user.documents.map((doc) => (
            <div key={doc.name} className="rounded-xl border border-border bg-secondary/20 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-accent/10 flex items-center justify-center">
                  <FileText className="h-4 w-4 text-accent" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-foreground">{doc.name}</p>
                  <p className="text-[10px] text-muted-foreground">{fmtDate(doc.uploadedAt)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <LoanStatusBadge status={doc.status} />
                <button title="View document" className="h-7 w-7 rounded-lg hover:bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground">
                  <Eye className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Component ──────────────────────────────────────────────────────────────

export function AdminUsers() {
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState("All")
  const [blockUser, setBlockUser] = useState<AdminUser | null>(null)
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null)

  const filtered = DEMO_USERS.filter((u) => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()) || u.id.toLowerCase().includes(search.toLowerCase())
    if (filter === "Active") return matchSearch && u.status === "active"
    if (filter === "Blocked") return matchSearch && u.status === "blocked"
    return matchSearch
  })

  // ── Detail View ──
  if (selectedUser) {
    return <UserDetailView user={selectedUser} onBack={() => setSelectedUser(null)} />
  }

  // ── Users List ──
  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>User Management</h1>
          <p className="text-xs text-muted-foreground mt-1">{DEMO_USERS.length} loan-approved users</p>
        </div>
        <Button variant="outline" className="h-9 gap-2 rounded-xl text-xs"><Download className="h-3.5 w-3.5" /> Export</Button>
      </div>

      <SearchFilterBar search={search} onSearchChange={setSearch} filters={FILTERS} activeFilter={filter} onFilterChange={setFilter} />

      {/* Users Table */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border bg-secondary/30">
                {["User", "CIBIL", "KYC", "Active Loans", "Total Borrowed", "Outstanding", "Status", "Actions"].map((h) => (
                  <th key={h} className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u.id} onClick={() => setSelectedUser(u)} className="border-b border-border last:border-0 hover:bg-secondary/20 transition-colors cursor-pointer">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-accent/10 flex items-center justify-center text-xs font-bold text-accent">
                        {u.name.split(" ").map((n) => n[0]).join("")}
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-foreground">{u.name}</p>
                        <p className="text-[10px] text-muted-foreground">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={cn("text-xs font-bold", u.cibilScore >= 750 ? "text-accent" : u.cibilScore >= 700 ? "text-yellow-500" : "text-red-500")}>{u.cibilScore}</span>
                  </td>
                  <td className="px-4 py-3">
                    {u.kycVerified ? (
                      <span className="flex items-center gap-1 text-[10px] text-accent"><UserCheck className="h-3 w-3" /> Verified</span>
                    ) : (
                      <span className="flex items-center gap-1 text-[10px] text-yellow-500"><UserX className="h-3 w-3" /> Pending</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-xs font-semibold text-foreground">{u.activeLoans}</td>
                  <td className="px-4 py-3 text-xs text-foreground">₹{(u.totalBorrowed / 100000).toFixed(1)}L</td>
                  <td className="px-4 py-3 text-xs font-semibold text-red-500">₹{(u.outstandingBalance / 100000).toFixed(1)}L</td>
                  <td className="px-4 py-3"><LoanStatusBadge status={u.status} /></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button title="View details" onClick={(e) => { e.stopPropagation(); setSelectedUser(u) }} className="h-7 w-7 rounded-lg hover:bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
                        <Eye className="h-3.5 w-3.5" />
                      </button>
                      <button title="Send email" onClick={(e) => e.stopPropagation()} className="h-7 w-7 rounded-lg hover:bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
                        <Mail className="h-3.5 w-3.5" />
                      </button>
                      <button
                        title={u.status === "blocked" ? "Unblock user" : "Block user"}
                        onClick={(e) => { e.stopPropagation(); setBlockUser(u) }}
                        className={cn("h-7 w-7 rounded-lg hover:bg-secondary flex items-center justify-center transition-colors",
                          u.status === "blocked" ? "text-accent hover:text-accent" : "text-muted-foreground hover:text-destructive"
                        )}
                      >
                        {u.status === "blocked" ? <Shield className="h-3.5 w-3.5" /> : <Ban className="h-3.5 w-3.5" />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="py-12 text-center text-sm text-muted-foreground">No users found</div>
        )}
      </div>

      {blockUser && (
        <ConfirmationModal
          open
          onClose={() => setBlockUser(null)}
          onConfirm={() => setBlockUser(null)}
          title={blockUser.status === "blocked" ? "Unblock User" : "Block User"}
          description={blockUser.status === "blocked"
            ? `Are you sure you want to unblock ${blockUser.name}?`
            : `Are you sure you want to block ${blockUser.name}? They will not be able to access the platform.`
          }
          confirmText={blockUser.status === "blocked" ? "Unblock" : "Block"}
          danger={blockUser.status !== "blocked"}
        />
      )}
    </div>
  )
}
