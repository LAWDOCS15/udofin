'use client'

import { useState, useMemo } from 'react'
import { useOnboarding } from '@/lib/onboarding-context'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import {
  Search, Building2, CheckCircle2, Clock, XCircle, LogOut, Bell,
  MapPin, Phone, Mail, Globe, Star, ChevronRight, Settings, Download,
  RefreshCw, Shield, FileText, BarChart3, TrendingUp, Users, Filter
} from 'lucide-react'

interface NBFCRecord {
  id: string; name: string; shortCode: string; location: string; phone: string
  email: string; website: string; type: 'Gold Loan' | 'Personal Loan' | 'Business Loan' | 'Microfinance' | 'Housing Loan'
  status: 'active' | 'pending' | 'suspended'; totalLoans: number; activeLoans: number
  totalDisbursed: string; avgInterestRate: number; cibilMin: number; rating: number
  registeredDate: string; licenseNo: string; rbiApproved: boolean
}

const NBFCS: NBFCRecord[] = [
  { id: 'NBFC001', name: 'Muthoot Finance Ltd.', shortCode: 'MFL', location: 'Kochi, Kerala', phone: '+91-484-6690000', email: 'contact@muthoot.com', website: 'muthootfinance.com', type: 'Gold Loan', status: 'active', totalLoans: 4820, activeLoans: 3100, totalDisbursed: '₹2,450 Cr', avgInterestRate: 12.5, cibilMin: 650, rating: 4.7, registeredDate: '2018-04-12', licenseNo: 'N-05.01234', rbiApproved: true },
  { id: 'NBFC002', name: 'Bajaj Finance Ltd.', shortCode: 'BFL', location: 'Pune, Maharashtra', phone: '+91-20-71575555', email: 'support@bajajfinserv.in', website: 'bajajfinserv.in', type: 'Personal Loan', status: 'active', totalLoans: 12400, activeLoans: 9200, totalDisbursed: '₹8,720 Cr', avgInterestRate: 13.0, cibilMin: 700, rating: 4.5, registeredDate: '2017-08-20', licenseNo: 'N-05.05678', rbiApproved: true },
  { id: 'NBFC003', name: 'Shriram Finance', shortCode: 'SRF', location: 'Chennai, Tamil Nadu', phone: '+91-44-28112300', email: 'info@shriramfinance.in', website: 'shriramfinance.in', type: 'Business Loan', status: 'active', totalLoans: 7600, activeLoans: 5400, totalDisbursed: '₹5,100 Cr', avgInterestRate: 15.5, cibilMin: 675, rating: 4.3, registeredDate: '2019-02-14', licenseNo: 'N-05.09012', rbiApproved: true },
  { id: 'NBFC004', name: 'Arohan Financial', shortCode: 'ARH', location: 'Kolkata, West Bengal', phone: '+91-33-40048877', email: 'info@arohan.in', website: 'arohan.in', type: 'Microfinance', status: 'active', totalLoans: 3200, activeLoans: 2800, totalDisbursed: '₹980 Cr', avgInterestRate: 22.0, cibilMin: 600, rating: 4.1, registeredDate: '2020-06-30', licenseNo: 'N-05.13456', rbiApproved: true },
  { id: 'NBFC005', name: 'PNB Housing Finance', shortCode: 'PNB', location: 'Delhi, NCR', phone: '+91-11-23736055', email: 'care@pnbhfl.com', website: 'pnbhousing.com', type: 'Housing Loan', status: 'active', totalLoans: 9800, activeLoans: 7100, totalDisbursed: '₹14,200 Cr', avgInterestRate: 8.75, cibilMin: 720, rating: 4.6, registeredDate: '2016-11-05', licenseNo: 'N-05.17890', rbiApproved: true },
  { id: 'NBFC006', name: 'CreditAccess Grameen', shortCode: 'CAG', location: 'Bengaluru, Karnataka', phone: '+91-80-40500000', email: 'info@creditaccess.in', website: 'creditaccess.in', type: 'Microfinance', status: 'pending', totalLoans: 1200, activeLoans: 980, totalDisbursed: '₹340 Cr', avgInterestRate: 23.5, cibilMin: 580, rating: 3.9, registeredDate: '2022-01-18', licenseNo: 'N-05.22134', rbiApproved: false },
  { id: 'NBFC007', name: 'Five Star Business Finance', shortCode: 'FSB', location: 'Chennai, Tamil Nadu', phone: '+91-44-45209999', email: 'support@fivestarfinance.in', website: 'fivestarfinance.in', type: 'Business Loan', status: 'active', totalLoans: 5400, activeLoans: 3900, totalDisbursed: '₹3,200 Cr', avgInterestRate: 17.0, cibilMin: 660, rating: 4.2, registeredDate: '2019-09-22', licenseNo: 'N-05.25678', rbiApproved: true },
  { id: 'NBFC008', name: 'Aavas Financiers', shortCode: 'AFS', location: 'Jaipur, Rajasthan', phone: '+91-141-6612000', email: 'info@aavas.in', website: 'aavas.in', type: 'Housing Loan', status: 'suspended', totalLoans: 2100, activeLoans: 1800, totalDisbursed: '₹1,870 Cr', avgInterestRate: 11.25, cibilMin: 680, rating: 3.7, registeredDate: '2021-03-10', licenseNo: 'N-05.29012', rbiApproved: false },
  { id: 'NBFC009', name: 'Manappuram Finance', shortCode: 'MNP', location: 'Valapad, Kerala', phone: '+91-487-3050000', email: 'support@manappuram.com', website: 'manappuram.com', type: 'Gold Loan', status: 'active', totalLoans: 6200, activeLoans: 5100, totalDisbursed: '₹4,600 Cr', avgInterestRate: 14.0, cibilMin: 630, rating: 4.4, registeredDate: '2017-07-15', licenseNo: 'N-05.32456', rbiApproved: true },
  { id: 'NBFC010', name: 'L&T Finance Holdings', shortCode: 'LTF', location: 'Mumbai, Maharashtra', phone: '+91-22-67987000', email: 'care@ltfs.com', website: 'ltfs.com', type: 'Personal Loan', status: 'active', totalLoans: 15200, activeLoans: 11800, totalDisbursed: '₹22,000 Cr', avgInterestRate: 11.0, cibilMin: 710, rating: 4.8, registeredDate: '2015-05-20', licenseNo: 'N-05.35890', rbiApproved: true },
]

const STATUS_CONFIG = {
  active: { label: 'Active', color: 'bg-accent/10 text-accent border-accent/20', dot: 'bg-accent' },
  pending: { label: 'Pending Review', color: 'bg-amber-500/10 text-amber-600 border-amber-500/20', dot: 'bg-amber-500' },
  suspended: { label: 'Suspended', color: 'bg-red-500/10 text-red-600 border-red-500/20', dot: 'bg-red-500' },
}

const TYPE_COLORS: Record<string, string> = {
  'Gold Loan': 'bg-yellow-500/10 text-yellow-700 border-yellow-500/20',
  'Personal Loan': 'bg-blue-500/10 text-blue-700 border-blue-500/20',
  'Business Loan': 'bg-violet-500/10 text-violet-700 border-violet-500/20',
  'Microfinance': 'bg-teal-500/10 text-teal-700 border-teal-500/20',
  'Housing Loan': 'bg-orange-500/10 text-orange-700 border-orange-500/20',
}

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1,2,3,4,5].map((i) => (
        <Star key={i} className={cn("h-3 w-3", i <= Math.floor(rating) ? "fill-amber-400 text-amber-400" : "text-border")} />
      ))}
      <span className="ml-1 text-xs font-semibold text-foreground">{rating}</span>
    </div>
  )
}

export function NBFCAdminPanel() {
  const { logout } = useOnboarding()
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'pending' | 'suspended'>('all')
  const [filterType, setFilterType] = useState('all')
  const [selected, setSelected] = useState<NBFCRecord | null>(null)
  const [activeTab, setActiveTab] = useState<'grid' | 'list'>('grid')

  const loanTypes = ['all', 'Gold Loan', 'Personal Loan', 'Business Loan', 'Microfinance', 'Housing Loan']

  const filtered = useMemo(() => NBFCS.filter((n) => {
    const matchSearch = !search || n.name.toLowerCase().includes(search.toLowerCase()) || n.location.toLowerCase().includes(search.toLowerCase()) || n.id.toLowerCase().includes(search.toLowerCase())
    const matchStatus = filterStatus === 'all' || n.status === filterStatus
    const matchType = filterType === 'all' || n.type === filterType
    return matchSearch && matchStatus && matchType
  }), [search, filterStatus, filterType])

  const stats = useMemo(() => ({
    total: NBFCS.length,
    active: NBFCS.filter(n => n.status === 'active').length,
    pending: NBFCS.filter(n => n.status === 'pending').length,
    suspended: NBFCS.filter(n => n.status === 'suspended').length,
  }), [])

  return (
    <div className="min-h-screen bg-background pt-16">
      {/* Hero */}
      <div className="bg-primary">
        <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/20">
                <Building2 className="h-5 w-5 text-accent" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-primary-foreground" style={{ fontFamily: "var(--font-heading)" }}>NBFC Management</h1>
                <p className="text-xs text-primary-foreground/35">FinLend Platform — NBFC Admin Portal</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-primary-foreground/5 border border-primary-foreground/10 hover:bg-primary-foreground/10 transition-all">
                <Bell className="h-4 w-4 text-primary-foreground/50" />
                <span className="absolute -right-0.5 -top-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-red-500 text-[8px] font-bold text-white">2</span>
              </button>
              <button onClick={logout} className="flex items-center gap-2 rounded-xl border border-primary-foreground/10 bg-primary-foreground/5 px-3 py-2 text-xs text-primary-foreground/50 hover:bg-primary-foreground/10 hover:text-primary-foreground/80 transition-all">
                <LogOut className="h-3.5 w-3.5" /> Sign out
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="mx-auto -mt-5 max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[
            { label: 'Total NBFCs', value: stats.total, color: 'bg-primary text-primary-foreground', icon: Building2, accent: true },
            { label: 'Active', value: stats.active, icon: CheckCircle2, accent: false },
            { label: 'Pending Review', value: stats.pending, icon: Clock, accent: false },
            { label: 'Suspended', value: stats.suspended, icon: XCircle, accent: false },
          ].map((s) => {
            const Icon = s.icon
            return (
              <div key={s.label} className={cn(
                "animate-fade-up rounded-2xl p-5 shadow-xl",
                s.accent ? "bg-primary text-primary-foreground" : "border border-border bg-card"
              )}>
                <div className={cn("flex h-9 w-9 items-center justify-center rounded-xl mb-3", s.accent ? "bg-white/10" : "bg-secondary")}>
                  <Icon className={cn("h-4 w-4", s.accent ? "text-white/80" : "text-foreground")} />
                </div>
                <p className="text-3xl font-bold" style={{ fontFamily: "var(--font-heading)" }}>{s.value}</p>
                <p className={cn("text-xs mt-0.5", s.accent ? "text-primary-foreground/40" : "text-muted-foreground")}>{s.label}</p>
              </div>
            )
          })}
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        {/* Search & filters */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-base font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>Registered NBFCs</h2>
            <p className="text-xs text-muted-foreground mt-0.5">{filtered.length} of {NBFCS.length} institutions</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <input type="text" placeholder="Search by name or location..." value={search} onChange={(e) => setSearch(e.target.value)}
                className="h-9 w-52 rounded-xl border border-border bg-card pl-8 pr-3 text-xs text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/30" />
            </div>
            <div className="flex rounded-xl border border-border bg-card overflow-hidden text-xs">
              {(['all', 'active', 'pending', 'suspended'] as const).map((s) => (
                <button key={s} onClick={() => setFilterStatus(s)}
                  className={cn("px-3 py-2 capitalize transition-all", filterStatus === s ? "bg-primary text-primary-foreground font-medium" : "text-muted-foreground hover:bg-secondary")}>
                  {s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
            <select value={filterType} onChange={(e) => setFilterType(e.target.value)}
              className="h-9 rounded-xl border border-border bg-card px-3 text-xs text-foreground focus:border-accent focus:outline-none cursor-pointer">
              {loanTypes.map((t) => <option key={t} value={t}>{t === 'all' ? 'All Types' : t}</option>)}
            </select>
            {(search || filterStatus !== 'all' || filterType !== 'all') && (
              <button onClick={() => { setSearch(''); setFilterStatus('all'); setFilterType('all') }}
                className="flex h-9 items-center gap-1.5 rounded-xl border border-border bg-card px-3 text-xs text-muted-foreground hover:bg-secondary">
                <RefreshCw className="h-3.5 w-3.5" /> Reset
              </button>
            )}
            <Button className="h-9 gap-2 rounded-xl bg-accent text-accent-foreground hover:bg-accent/90 text-xs">
              <Building2 className="h-3.5 w-3.5" /> Add NBFC
            </Button>
          </div>
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-card py-20">
            <Building2 className="mb-3 h-10 w-10 text-muted-foreground/20" />
            <p className="text-sm font-medium text-muted-foreground">No NBFCs found</p>
            <button onClick={() => { setSearch(''); setFilterStatus('all'); setFilterType('all') }} className="mt-1.5 text-xs text-accent hover:underline">Clear filters</button>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((nbfc, i) => {
              const status = STATUS_CONFIG[nbfc.status]
              return (
                <div key={nbfc.id}
                  className="animate-fade-up group cursor-pointer rounded-3xl border border-border bg-card p-6 shadow-sm transition-all hover:border-accent/30 hover:shadow-lg hover:-translate-y-0.5"
                  style={{ animationDelay: `${i * 50}ms` }}
                  onClick={() => setSelected(nbfc)}
                >
                  {/* Header */}
                  <div className="mb-4 flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-sm font-bold text-primary-foreground group-hover:bg-accent group-hover:text-accent-foreground transition-all">
                        {nbfc.shortCode}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-foreground leading-tight">{nbfc.name}</p>
                        <p className="text-[10px] font-mono text-muted-foreground">{nbfc.id}</p>
                      </div>
                    </div>
                    <span className={cn("flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold", status.color)}>
                      <span className={cn("h-1.5 w-1.5 rounded-full", status.dot)} />{status.label}
                    </span>
                  </div>

                  {/* Tags */}
                  <div className="mb-3 flex flex-wrap gap-1.5">
                    <span className={cn("rounded-full border px-2 py-0.5 text-[10px] font-medium", TYPE_COLORS[nbfc.type])}>{nbfc.type}</span>
                    {nbfc.rbiApproved && (
                      <span className="flex items-center gap-1 rounded-full border border-accent/20 bg-accent/5 px-2 py-0.5 text-[10px] font-medium text-accent">
                        <Shield className="h-2.5 w-2.5" /> RBI
                      </span>
                    )}
                  </div>

                  {/* Location & Rating */}
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3" />{nbfc.location}
                    </div>
                    <Stars rating={nbfc.rating} />
                  </div>

                  {/* Stats */}
                  <div className="rounded-2xl bg-secondary/50 p-3 grid grid-cols-3 gap-2 mb-3">
                    <div className="text-center">
                      <p className="text-sm font-bold text-foreground">{(nbfc.totalLoans / 1000).toFixed(1)}K</p>
                      <p className="text-[9px] text-muted-foreground">Loans</p>
                    </div>
                    <div className="text-center border-x border-border">
                      <p className="text-sm font-bold text-accent">{nbfc.avgInterestRate}%</p>
                      <p className="text-[9px] text-muted-foreground">Avg Rate</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-bold text-foreground">{nbfc.cibilMin}</p>
                      <p className="text-[9px] text-muted-foreground">Min CIBIL</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-muted-foreground">Total Disbursed</p>
                      <p className="text-sm font-bold text-accent">{nbfc.totalDisbursed}</p>
                    </div>
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-border group-hover:border-accent/30 group-hover:bg-accent/5 transition-all">
                      <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-accent" />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Detail Drawer */}
      {selected && (
        <div className="fixed inset-0 z-50" onClick={(e) => e.target === e.currentTarget && setSelected(null)}>
          <div className="absolute inset-0 bg-foreground/20 backdrop-blur-sm" onClick={() => setSelected(null)} />
          <div className="absolute right-0 top-0 h-full w-full max-w-md overflow-y-auto border-l border-border bg-card shadow-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-card/90 px-6 py-4 backdrop-blur-sm">
              <p className="font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>NBFC Details</p>
              <button onClick={() => setSelected(null)} className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-secondary text-muted-foreground">✕</button>
            </div>
            <div className="p-6">
              <div className="mb-5 flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-lg font-bold text-primary-foreground">
                  {selected.shortCode}
                </div>
                <div>
                  <h2 className="text-base font-bold text-foreground">{selected.name}</h2>
                  <p className="text-xs font-mono text-muted-foreground">{selected.id} · {selected.licenseNo}</p>
                  <div className="mt-1.5 flex gap-2">
                    <span className={cn("flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] font-semibold", STATUS_CONFIG[selected.status].color)}>
                      <span className={cn("h-1.5 w-1.5 rounded-full", STATUS_CONFIG[selected.status].dot)} />
                      {STATUS_CONFIG[selected.status].label}
                    </span>
                    <span className={cn("rounded-full border px-2 py-0.5 text-[10px] font-medium", TYPE_COLORS[selected.type])}>{selected.type}</span>
                  </div>
                </div>
              </div>

              <div className="mb-5"><Stars rating={selected.rating} /></div>

              <div className="mb-5 grid grid-cols-2 gap-3">
                {[
                  ['Total Loans', selected.totalLoans.toLocaleString('en-IN')],
                  ['Active Loans', selected.activeLoans.toLocaleString('en-IN')],
                  ['Total Disbursed', selected.totalDisbursed],
                  ['Avg Interest Rate', `${selected.avgInterestRate}%`],
                  ['Min CIBIL Score', selected.cibilMin],
                  ['RBI Approved', selected.rbiApproved ? '✓ Yes' : '✗ No'],
                ].map(([k, v]) => (
                  <div key={k} className="rounded-xl bg-secondary/50 p-3">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide">{k}</p>
                    <p className="text-sm font-bold text-foreground mt-0.5">{v}</p>
                  </div>
                ))}
              </div>

              <div className="mb-5 space-y-2.5">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Contact</p>
                {[
                  { icon: MapPin, value: selected.location },
                  { icon: Phone, value: selected.phone },
                  { icon: Mail, value: selected.email },
                  { icon: Globe, value: selected.website },
                ].map((item) => (
                  <div key={item.value} className="flex items-center gap-2.5">
                    <item.icon className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                    <span className="text-xs text-foreground">{item.value}</span>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                {selected.status === 'pending' && (
                  <Button className="flex-1 gap-2 bg-accent text-accent-foreground hover:bg-accent/90 rounded-xl h-10 text-sm">
                    <CheckCircle2 className="h-4 w-4" /> Approve
                  </Button>
                )}
                {selected.status === 'active' && (
                  <Button variant="outline" className="flex-1 gap-2 border-red-500/30 text-red-600 hover:bg-red-500/5 rounded-xl h-10 text-sm">
                    <XCircle className="h-4 w-4" /> Suspend
                  </Button>
                )}
                {selected.status === 'suspended' && (
                  <Button className="flex-1 gap-2 bg-accent text-accent-foreground hover:bg-accent/90 rounded-xl h-10 text-sm">
                    <CheckCircle2 className="h-4 w-4" /> Reactivate
                  </Button>
                )}
                <Button variant="outline" className="flex-1 gap-2 rounded-xl h-10 text-sm border-border">
                  <Settings className="h-4 w-4" /> Manage
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
