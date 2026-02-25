'use client'

import { useState, useMemo } from 'react'
import { useOnboarding } from '@/lib/onboarding-context'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import {
  BarChart3, Users, FileText, TrendingUp, Search, Download, ChevronRight,
  CheckCircle2, Clock, ArrowUpRight, Bell, LogOut, IndianRupee, Calendar,
  AlertTriangle, Zap, TrendingDown, Pause, Settings, Shield, X, RefreshCw,
  Eye, Filter
} from 'lucide-react'

interface LoanRecord {
  id: string; applicantName: string; amount: number; emi: number
  status: 'running' | 'completed' | 'pending-emi' | 'overdue'
  rate: number; appliedDate: string; disbursedDate: string; maturityDate: string
  cibil: number; nextEMIDue: string; emiPaid: number; totalEMI: number
}

const LOAN_RECORDS: LoanRecord[] = [
  { id: 'FL001', applicantName: 'Virendra Singh', amount: 800000, emi: 20850, status: 'running', rate: 10.50, appliedDate: '2026-01-15', disbursedDate: '2026-02-01', maturityDate: '2030-02-01', cibil: 758, nextEMIDue: '2026-03-01', emiPaid: 1, totalEMI: 48 },
  { id: 'FL002', applicantName: 'Priya Sharma', amount: 500000, emi: 14520, status: 'running', rate: 11.25, appliedDate: '2025-12-10', disbursedDate: '2026-01-05', maturityDate: '2029-01-05', cibil: 745, nextEMIDue: '2026-02-05', emiPaid: 2, totalEMI: 36 },
  { id: 'FL003', applicantName: 'Rajesh Kumar', amount: 1200000, emi: 24500, status: 'overdue', rate: 13.50, appliedDate: '2025-10-20', disbursedDate: '2025-11-01', maturityDate: '2028-11-01', cibil: 698, nextEMIDue: '2026-01-01', emiPaid: 3, totalEMI: 36 },
  { id: 'FL004', applicantName: 'Sunita Patel', amount: 350000, emi: 9800, status: 'completed', rate: 10.00, appliedDate: '2023-06-15', disbursedDate: '2023-07-01', maturityDate: '2026-01-01', cibil: 782, nextEMIDue: '–', emiPaid: 30, totalEMI: 30 },
  { id: 'FL005', applicantName: 'Arjun Mehta', amount: 750000, emi: 18200, status: 'pending-emi', rate: 12.00, appliedDate: '2025-11-05', disbursedDate: '2025-12-01', maturityDate: '2029-12-01', cibil: 721, nextEMIDue: '2026-02-01', emiPaid: 2, totalEMI: 48 },
  { id: 'FL006', applicantName: 'Deepa Nair', amount: 600000, emi: 15600, status: 'running', rate: 11.00, appliedDate: '2026-01-20', disbursedDate: '2026-02-10', maturityDate: '2030-02-10', cibil: 740, nextEMIDue: '2026-03-10', emiPaid: 0, totalEMI: 48 },
  { id: 'FL007', applicantName: 'Vikram Bose', amount: 2000000, emi: 41200, status: 'running', rate: 10.25, appliedDate: '2025-09-01', disbursedDate: '2025-10-01', maturityDate: '2031-10-01', cibil: 810, nextEMIDue: '2026-03-01', emiPaid: 5, totalEMI: 72 },
  { id: 'FL008', applicantName: 'Meena Rao', amount: 420000, emi: 11200, status: 'overdue', rate: 14.00, appliedDate: '2025-08-15', disbursedDate: '2025-09-01', maturityDate: '2028-09-01', cibil: 660, nextEMIDue: '2026-01-01', emiPaid: 4, totalEMI: 36 },
]

const STATUS_CONFIG = {
  running: { label: 'Running', color: 'bg-accent/10 text-accent border-accent/20', dot: 'bg-accent', icon: Zap },
  completed: { label: 'Completed', color: 'bg-blue-500/10 text-blue-600 border-blue-500/20', dot: 'bg-blue-500', icon: CheckCircle2 },
  'pending-emi': { label: 'Pending EMI', color: 'bg-amber-500/10 text-amber-600 border-amber-500/20', dot: 'bg-amber-500', icon: Clock },
  overdue: { label: 'Overdue', color: 'bg-red-500/10 text-red-600 border-red-500/20', dot: 'bg-red-500', icon: AlertTriangle },
}

export function AdminPanelV2() {
  const { logout } = useOnboarding()
  const [activeTab, setActiveTab] = useState<'overview' | 'loans' | 'users'>('overview')
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | LoanRecord['status']>('all')
  const [selectedLoan, setSelectedLoan] = useState<LoanRecord | null>(null)

  const filtered = useMemo(() => LOAN_RECORDS.filter((r) => {
    const matchSearch = !search || r.applicantName.toLowerCase().includes(search.toLowerCase()) || r.id.toLowerCase().includes(search.toLowerCase())
    const matchStatus = filterStatus === 'all' || r.status === filterStatus
    return matchSearch && matchStatus
  }), [search, filterStatus])

  const stats = useMemo(() => ({
    totalDisbursed: LOAN_RECORDS.reduce((s, r) => s + r.amount, 0),
    running: LOAN_RECORDS.filter(r => r.status === 'running').length,
    overdue: LOAN_RECORDS.filter(r => r.status === 'overdue').length,
    completed: LOAN_RECORDS.filter(r => r.status === 'completed').length,
    pendingEMI: LOAN_RECORDS.filter(r => r.status === 'pending-emi').length,
    monthlyCollection: LOAN_RECORDS.filter(r => r.status === 'running').reduce((s, r) => s + r.emi, 0),
  }), [])

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'loans', label: 'Loan Records', icon: FileText },
    { id: 'users', label: 'Applicants', icon: Users },
  ]

  return (
    <div className="min-h-screen bg-background pt-16">
      {/* Hero */}
      <div className="bg-primary">
        <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/20">
                <Shield className="h-5 w-5 text-accent" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-primary-foreground" style={{ fontFamily: "var(--font-heading)" }}>Admin Control Center</h1>
                <p className="text-xs text-primary-foreground/35">FinLend Platform — Super Admin</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-primary-foreground/5 border border-primary-foreground/10 hover:bg-primary-foreground/10 transition-all">
                <Bell className="h-4 w-4 text-primary-foreground/50" />
                <span className="absolute -right-0.5 -top-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-red-500 text-[8px] font-bold text-white">3</span>
              </button>
              <button onClick={logout} className="flex items-center gap-2 rounded-xl border border-primary-foreground/10 bg-primary-foreground/5 px-3 py-2 text-xs text-primary-foreground/50 hover:bg-primary-foreground/10 hover:text-primary-foreground/80 transition-all">
                <LogOut className="h-3.5 w-3.5" /> Sign out
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* KPI cards */}
      <div className="mx-auto -mt-5 max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-6">
          {[
            { label: 'Total Disbursed', value: `₹${(stats.totalDisbursed / 10000000).toFixed(1)}Cr`, icon: IndianRupee, accent: true, span: 2 },
            { label: 'Running Loans', value: stats.running, icon: Zap, color: 'text-accent' },
            { label: 'Overdue', value: stats.overdue, icon: AlertTriangle, color: 'text-red-500' },
            { label: 'Completed', value: stats.completed, icon: CheckCircle2, color: 'text-blue-500' },
            { label: 'Pending EMI', value: stats.pendingEMI, icon: Clock, color: 'text-amber-500' },
          ].map((s) => {
            const Icon = s.icon
            return (
              <div key={s.label} className={cn(
                "animate-fade-up rounded-2xl p-5 shadow-xl",
                s.accent ? "bg-accent text-accent-foreground col-span-2" : "border border-border bg-card"
              )}>
                <div className={cn("flex h-9 w-9 items-center justify-center rounded-xl mb-3", s.accent ? "bg-white/15" : "bg-secondary")}>
                  <Icon className={cn("h-4 w-4", s.accent ? "text-white/80" : (s.color || "text-foreground"))} />
                </div>
                <p className="text-2xl font-bold" style={{ fontFamily: "var(--font-heading)" }}>{s.value}</p>
                <p className={cn("text-xs mt-0.5", s.accent ? "text-white/60" : "text-muted-foreground")}>{s.label}</p>
              </div>
            )
          })}
        </div>
      </div>

      {/* Tabs */}
      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        <div className="mb-6 flex items-center gap-1 rounded-2xl border border-border bg-card p-1 w-fit">
          {tabs.map((t) => {
            const Icon = t.icon
            return (
              <button key={t.id} onClick={() => setActiveTab(t.id as typeof activeTab)}
                className={cn(
                  "flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all",
                  activeTab === t.id ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                )}>
                <Icon className="h-4 w-4" />{t.label}
              </button>
            )
          })}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid gap-5 lg:grid-cols-3">
            <div className="lg:col-span-2 rounded-3xl border border-border bg-card p-6 shadow-sm">
              <h2 className="mb-5 text-base font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>Portfolio Summary</h2>
              <div className="space-y-4">
                {[
                  { label: 'Running Loans', count: stats.running, pct: Math.round(stats.running / LOAN_RECORDS.length * 100), color: 'bg-accent' },
                  { label: 'Completed', count: stats.completed, pct: Math.round(stats.completed / LOAN_RECORDS.length * 100), color: 'bg-blue-500' },
                  { label: 'Pending EMI', count: stats.pendingEMI, pct: Math.round(stats.pendingEMI / LOAN_RECORDS.length * 100), color: 'bg-amber-500' },
                  { label: 'Overdue', count: stats.overdue, pct: Math.round(stats.overdue / LOAN_RECORDS.length * 100), color: 'bg-red-500' },
                ].map((item) => (
                  <div key={item.label}>
                    <div className="mb-1.5 flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">{item.label}</span>
                      <span className="text-sm font-semibold text-foreground">{item.count} loans · {item.pct}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-secondary overflow-hidden">
                      <div className={cn("h-full rounded-full transition-all duration-700", item.color)} style={{ width: `${item.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Monthly Collection</p>
                <p className="text-3xl font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>
                  ₹{(stats.monthlyCollection / 100000).toFixed(1)}L
                </p>
                <p className="text-xs text-accent mt-1 flex items-center gap-1"><TrendingUp className="h-3 w-3" /> From running loans</p>
              </div>
              <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Overdue Alert</p>
                <p className="text-3xl font-bold text-red-500" style={{ fontFamily: "var(--font-heading)" }}>{stats.overdue}</p>
                <p className="text-xs text-muted-foreground mt-1">Accounts need attention</p>
              </div>
              <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Total Accounts</p>
                <p className="text-3xl font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>{LOAN_RECORDS.length}</p>
                <p className="text-xs text-muted-foreground mt-1">Active + Closed</p>
              </div>
            </div>

            {/* Recent loans */}
            <div className="lg:col-span-3 rounded-3xl border border-border bg-card p-6 shadow-sm">
              <h2 className="mb-5 text-base font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>Recent Loan Activity</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      {['ID', 'Applicant', 'Amount', 'EMI', 'Status', 'CIBIL', 'Next EMI'].map((h) => (
                        <th key={h} className="pb-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {LOAN_RECORDS.slice(0, 5).map((r) => {
                      const s = STATUS_CONFIG[r.status]
                      return (
                        <tr key={r.id} className="border-b border-border/40 hover:bg-secondary/30 transition-colors cursor-pointer" onClick={() => setSelectedLoan(r)}>
                          <td className="py-3.5 font-mono text-xs text-muted-foreground">{r.id}</td>
                          <td className="py-3.5 font-medium text-foreground">{r.applicantName}</td>
                          <td className="py-3.5 text-foreground">₹{(r.amount / 100000).toFixed(1)}L</td>
                          <td className="py-3.5 text-foreground">₹{r.emi.toLocaleString('en-IN')}</td>
                          <td className="py-3.5">
                            <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold", s.color)}>
                              <span className={cn("h-1.5 w-1.5 rounded-full", s.dot)} />{s.label}
                            </span>
                          </td>
                          <td className="py-3.5 text-foreground">{r.cibil}</td>
                          <td className="py-3.5 text-muted-foreground">{r.nextEMIDue}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Loans Tab */}
        {activeTab === 'loans' && (
          <div>
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-base font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>All Loan Records</h2>
                <p className="text-xs text-muted-foreground mt-0.5">{filtered.length} of {LOAN_RECORDS.length} records</p>
              </div>
              <div className="flex gap-2 flex-wrap">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                  <input type="text" placeholder="Search name or ID..." value={search} onChange={(e) => setSearch(e.target.value)}
                    className="h-9 w-44 rounded-xl border border-border bg-card pl-8 pr-3 text-xs text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/30" />
                </div>
                <div className="flex rounded-xl border border-border bg-card overflow-hidden text-xs">
                  {(['all', 'running', 'overdue', 'pending-emi', 'completed'] as const).map((s) => (
                    <button key={s} onClick={() => setFilterStatus(s)}
                      className={cn("px-3 py-2 capitalize transition-all whitespace-nowrap", filterStatus === s ? "bg-primary text-primary-foreground font-medium" : "text-muted-foreground hover:bg-secondary")}>
                      {s === 'all' ? 'All' : s === 'pending-emi' ? 'Pending' : s.charAt(0).toUpperCase() + s.slice(1)}
                    </button>
                  ))}
                </div>
                <Button variant="outline" className="h-9 gap-2 rounded-xl text-xs border-border">
                  <Download className="h-3.5 w-3.5" /> Export
                </Button>
              </div>
            </div>

            <div className="rounded-3xl border border-border bg-card shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b border-border bg-secondary/30">
                    <tr>
                      {['ID', 'Applicant', 'Amount', 'Rate', 'EMI', 'Status', 'CIBIL', 'Progress', 'Next EMI', ''].map((h) => (
                        <th key={h} className="px-5 py-3.5 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((r) => {
                      const s = STATUS_CONFIG[r.status]
                      const progress = Math.round((r.emiPaid / r.totalEMI) * 100)
                      return (
                        <tr key={r.id} className="border-b border-border/40 hover:bg-secondary/20 transition-colors cursor-pointer" onClick={() => setSelectedLoan(r)}>
                          <td className="px-5 py-4 font-mono text-xs text-muted-foreground">{r.id}</td>
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-2.5">
                              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-secondary text-xs font-bold text-foreground">
                                {r.applicantName.split(' ').map(n => n[0]).join('')}
                              </div>
                              <span className="font-medium text-foreground text-xs">{r.applicantName}</span>
                            </div>
                          </td>
                          <td className="px-5 py-4 font-medium text-foreground">₹{(r.amount / 100000).toFixed(1)}L</td>
                          <td className="px-5 py-4 text-accent font-medium">{r.rate}%</td>
                          <td className="px-5 py-4 text-foreground">₹{r.emi.toLocaleString('en-IN')}</td>
                          <td className="px-5 py-4">
                            <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold", s.color)}>
                              <span className={cn("h-1.5 w-1.5 rounded-full", s.dot)} />{s.label}
                            </span>
                          </td>
                          <td className="px-5 py-4 text-foreground">{r.cibil}</td>
                          <td className="px-5 py-4 min-w-[90px]">
                            <div className="flex items-center gap-2">
                              <div className="flex-1 h-1.5 rounded-full bg-secondary overflow-hidden">
                                <div className={cn("h-full rounded-full", r.status === 'overdue' ? 'bg-red-500' : 'bg-accent')} style={{ width: `${progress}%` }} />
                              </div>
                              <span className="text-[10px] text-muted-foreground whitespace-nowrap">{r.emiPaid}/{r.totalEMI}</span>
                            </div>
                          </td>
                          <td className="px-5 py-4 text-xs text-muted-foreground">{r.nextEMIDue}</td>
                          <td className="px-5 py-4">
                            <button className="flex h-7 w-7 items-center justify-center rounded-lg hover:bg-secondary transition-all">
                              <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                            </button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
              {filtered.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16">
                  <FileText className="mb-2 h-8 w-8 text-muted-foreground/30" />
                  <p className="text-sm text-muted-foreground">No records found</p>
                  <button onClick={() => { setSearch(''); setFilterStatus('all') }} className="mt-1 text-xs text-accent hover:underline">Reset filters</button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {LOAN_RECORDS.map((r, i) => {
              const s = STATUS_CONFIG[r.status]
              return (
                <div key={r.id} className="animate-fade-up rounded-3xl border border-border bg-card p-5 shadow-sm hover:border-accent/30 hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer" style={{ animationDelay: `${i * 50}ms` }}
                  onClick={() => setSelectedLoan(r)}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-sm font-bold text-primary-foreground">
                      {r.applicantName.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{r.applicantName}</p>
                      <p className="text-[10px] text-muted-foreground font-mono">{r.id}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <div className="rounded-xl bg-secondary/50 p-2.5">
                      <p className="text-[10px] text-muted-foreground">Amount</p>
                      <p className="text-xs font-bold text-foreground">₹{(r.amount / 100000).toFixed(1)}L</p>
                    </div>
                    <div className="rounded-xl bg-secondary/50 p-2.5">
                      <p className="text-[10px] text-muted-foreground">CIBIL</p>
                      <p className="text-xs font-bold text-foreground">{r.cibil}</p>
                    </div>
                  </div>
                  <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold", s.color)}>
                    <span className={cn("h-1.5 w-1.5 rounded-full", s.dot)} />{s.label}
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Detail drawer */}
      {selectedLoan && (
        <div className="fixed inset-0 z-50 flex items-end justify-end" onClick={(e) => e.target === e.currentTarget && setSelectedLoan(null)}>
          <div className="absolute inset-0 bg-foreground/20 backdrop-blur-sm" onClick={() => setSelectedLoan(null)} />
          <div className="relative h-full w-full max-w-sm overflow-y-auto border-l border-border bg-card shadow-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-card/90 px-6 py-4 backdrop-blur-sm">
              <p className="font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>Loan Details</p>
              <button onClick={() => setSelectedLoan(null)} className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-secondary text-muted-foreground">✕</button>
            </div>
            <div className="p-6">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-lg font-bold text-primary-foreground">
                  {selectedLoan.applicantName.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <p className="font-bold text-foreground">{selectedLoan.applicantName}</p>
                  <p className="text-xs font-mono text-muted-foreground">{selectedLoan.id}</p>
                </div>
              </div>
              <div className={cn("mb-5 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold", STATUS_CONFIG[selectedLoan.status].color)}>
                <span className={cn("h-1.5 w-1.5 rounded-full", STATUS_CONFIG[selectedLoan.status].dot)} />
                {STATUS_CONFIG[selectedLoan.status].label}
              </div>
              <div className="grid grid-cols-2 gap-3 mb-5">
                {[
                  ['Loan Amount', `₹${selectedLoan.amount.toLocaleString('en-IN')}`],
                  ['Monthly EMI', `₹${selectedLoan.emi.toLocaleString('en-IN')}`],
                  ['Interest Rate', `${selectedLoan.rate}%`],
                  ['CIBIL Score', selectedLoan.cibil],
                  ['EMI Paid', `${selectedLoan.emiPaid} / ${selectedLoan.totalEMI}`],
                  ['Next EMI Due', selectedLoan.nextEMIDue],
                  ['Disbursed', selectedLoan.disbursedDate],
                  ['Maturity', selectedLoan.maturityDate],
                ].map(([k, v]) => (
                  <div key={String(k)} className="rounded-xl bg-secondary/50 p-3">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide">{k}</p>
                    <p className="text-sm font-bold text-foreground mt-0.5">{v}</p>
                  </div>
                ))}
              </div>
              <div className="mb-3">
                <div className="flex justify-between mb-1.5">
                  <p className="text-xs text-muted-foreground">Repayment Progress</p>
                  <p className="text-xs font-semibold text-foreground">{Math.round(selectedLoan.emiPaid / selectedLoan.totalEMI * 100)}%</p>
                </div>
                <div className="h-2 rounded-full bg-secondary overflow-hidden">
                  <div className="h-full bg-accent rounded-full transition-all" style={{ width: `${Math.round(selectedLoan.emiPaid / selectedLoan.totalEMI * 100)}%` }} />
                </div>
              </div>
              <div className="flex gap-2 mt-5">
                {selectedLoan.status === 'overdue' && (
                  <Button className="flex-1 gap-2 bg-red-500 text-white hover:bg-red-600 rounded-xl h-10 text-sm">
                    <AlertTriangle className="h-4 w-4" /> Flag
                  </Button>
                )}
                <Button className="flex-1 gap-2 bg-accent text-accent-foreground hover:bg-accent/90 rounded-xl h-10 text-sm">
                  <FileText className="h-4 w-4" /> Full Report
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
