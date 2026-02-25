'use client'

import { useState } from 'react'
import { useOnboarding } from '@/lib/onboarding-context'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  Wallet, TrendingUp, Calendar, CheckCircle2, FileText, Download,
  Bell, ArrowUpRight, BarChart3, IndianRupee, Clock, Shield,
  Sparkles, Building2, RefreshCw
} from 'lucide-react'

const TRANSACTIONS = [
  { label: 'Application Approved', date: 'Today · 2:30 PM', icon: CheckCircle2, color: 'text-accent', bg: 'bg-accent/10' },
  { label: 'Documents Verified', date: 'Yesterday · 11:15 AM', icon: FileText, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  { label: 'Application Submitted', date: '2 days ago · 4:45 PM', icon: ArrowUpRight, color: 'text-violet-500', bg: 'bg-violet-500/10' },
  { label: 'KYC Completed', date: '3 days ago · 9:20 AM', icon: CheckCircle2, color: 'text-accent', bg: 'bg-accent/10' },
  { label: 'Account Created', date: '3 days ago · 9:00 AM', icon: Sparkles, color: 'text-amber-500', bg: 'bg-amber-500/10' },
]

const EMI_SCHEDULE = [
  { month: 'Mar 2026', amount: '₹20,850', status: 'upcoming', due: '01 Mar 2026' },
  { month: 'Apr 2026', amount: '₹20,850', status: 'upcoming', due: '01 Apr 2026' },
  { month: 'May 2026', amount: '₹20,850', status: 'upcoming', due: '01 May 2026' },
]

export function UserDashboard() {
  const { userProfile, documents, logout } = useOnboarding()
  const [activeTab, setActiveTab] = useState<'overview' | 'schedule' | 'docs'>('overview')

  const name = userProfile.fullName ? userProfile.fullName.split(' ')[0] : 'User'
  const loanAmount = userProfile.loanAmount || '8,00,000'
  const tenure = userProfile.loanTenure || '48 months'

  return (
    <div className="min-h-screen bg-background pt-16">
      {/* Hero banner — same as other dashboards */}
      <div className="bg-primary">
        <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/20">
                <Wallet className="h-5 w-5 text-accent" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-primary-foreground" style={{ fontFamily: 'var(--font-heading)' }}>
                  My Dashboard
                </h1>
                <p className="text-xs text-primary-foreground/35">Welcome back, {name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-primary-foreground/5 border border-primary-foreground/10 hover:bg-primary-foreground/10 transition-all">
                <Bell className="h-4 w-4 text-primary-foreground/50" />
                <span className="absolute -right-0.5 -top-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-red-500 text-[8px] font-bold text-white">1</span>
              </button>
              <button onClick={logout} className="flex items-center gap-2 rounded-xl border border-primary-foreground/10 bg-primary-foreground/5 px-3 py-2 text-xs text-primary-foreground/50 hover:bg-primary-foreground/10 hover:text-primary-foreground/80 transition-all">
                Sign out
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Summary cards */}
      <div className="mx-auto -mt-5 max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[
            { label: 'Loan Amount', value: `₹${loanAmount}`, icon: Wallet, sub: 'Approved', accent: true },
            { label: 'CIBIL Score', value: '758', icon: TrendingUp, sub: 'Excellent', accent: true },
            { label: 'Monthly EMI', value: '₹20,850', icon: Calendar, sub: 'Due 1st monthly', accent: false },
            { label: 'KYC Status', value: 'Verified', icon: Shield, sub: 'All docs approved', accent: false },
          ].map((c, i) => {
            const Icon = c.icon
            return (
              <div key={c.label} className={cn(
                'animate-fade-up rounded-2xl p-5 shadow-xl',
                c.accent ? (i === 0 ? 'bg-primary text-primary-foreground' : 'bg-accent text-accent-foreground') : 'border border-border bg-card'
              )} style={{ animationDelay: `${i * 60}ms` }}>
                <div className={cn('flex h-9 w-9 items-center justify-center rounded-xl mb-3', c.accent ? 'bg-white/10' : 'bg-secondary')}>
                  <Icon className={cn('h-5 w-5', c.accent ? 'opacity-80' : 'text-foreground')} />
                </div>
                <p className={cn('text-[11px] mb-1', c.accent ? 'opacity-50' : 'text-muted-foreground')}>{c.label}</p>
                <p className="text-xl font-bold" style={{ fontFamily: 'var(--font-heading)' }}>{c.value}</p>
                <p className={cn('text-[10px] mt-0.5', c.accent ? 'opacity-40' : 'text-muted-foreground')}>{c.sub}</p>
              </div>
            )
          })}
        </div>
      </div>

      {/* Main content */}
      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        {/* Approval banner */}
        <div className="mb-6 rounded-3xl border border-accent/20 bg-accent/5 p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/15">
              <CheckCircle2 className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="text-sm font-bold text-foreground" style={{ fontFamily: 'var(--font-heading)' }}>Loan Pre-Approved!</p>
              <p className="text-xs text-muted-foreground">Your ₹{loanAmount} loan is approved. Select a lender to proceed.</p>
            </div>
          </div>
          <Badge className="bg-accent text-accent-foreground text-xs">Approved</Badge>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex items-center gap-1 rounded-2xl border border-border bg-card p-1 w-fit">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'schedule', label: 'EMI Schedule', icon: Calendar },
            { id: 'docs', label: 'Documents', icon: FileText },
          ].map((t) => {
            const Icon = t.icon
            return (
              <button key={t.id} onClick={() => setActiveTab(t.id as typeof activeTab)}
                className={cn(
                  'flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all',
                  activeTab === t.id ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                )}>
                <Icon className="h-4 w-4" />{t.label}
              </button>
            )
          })}
        </div>

        {activeTab === 'overview' && (
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Loan details */}
            <div className="lg:col-span-2 rounded-3xl border border-border bg-card p-6 shadow-sm">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-base font-bold text-foreground" style={{ fontFamily: 'var(--font-heading)' }}>Loan Details</h2>
                <Badge className="bg-accent/10 text-accent border-accent/20 text-xs">Active</Badge>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-6">
                {[
                  ['Lender', 'HDFC Bank'],
                  ['Rate', '10.50% p.a.'],
                  ['Monthly EMI', '₹20,850'],
                  ['Tenure', tenure],
                  ['Total Payable', '₹10,00,800'],
                  ['Next EMI Due', '01 Mar 2026'],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-2xl bg-secondary/50 p-3">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide">{label}</p>
                    <p className="text-sm font-bold text-foreground mt-0.5">{value}</p>
                  </div>
                ))}
              </div>
              {/* Progress */}
              <div>
                <div className="flex justify-between mb-2">
                  <p className="text-xs text-muted-foreground">Repayment Progress</p>
                  <p className="text-xs font-semibold text-foreground">0 / 48 EMIs paid</p>
                </div>
                <div className="h-2 rounded-full bg-secondary overflow-hidden mb-4">
                  <div className="h-full bg-accent rounded-full" style={{ width: '2%' }} />
                </div>
                <div className="flex gap-3">
                  <Button className="flex-1 gap-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl h-10 text-sm">
                    <IndianRupee className="h-4 w-4" /> Make EMI Payment
                  </Button>
                  <Button variant="outline" className="gap-2 rounded-xl h-10 text-sm border-border">
                    <Download className="h-4 w-4" /> Statement
                  </Button>
                </div>
              </div>
            </div>

            {/* Activity */}
            <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
              <h2 className="mb-5 text-base font-bold text-foreground" style={{ fontFamily: 'var(--font-heading)' }}>Recent Activity</h2>
              <div className="flex flex-col gap-0">
                {TRANSACTIONS.map((t, i) => {
                  const Icon = t.icon
                  return (
                    <div key={i} className={cn('flex items-start gap-3 py-3.5', i < TRANSACTIONS.length - 1 && 'border-b border-border/40')}>
                      <div className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-xl mt-0.5', t.bg)}>
                        <Icon className={cn('h-3.5 w-3.5', t.color)} />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-foreground">{t.label}</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">{t.date}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'schedule' && (
          <div className="rounded-3xl border border-border bg-card shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-border flex items-center justify-between">
              <h2 className="text-base font-bold text-foreground" style={{ fontFamily: 'var(--font-heading)' }}>EMI Payment Schedule</h2>
              <p className="text-xs text-muted-foreground">48 instalments total</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-border bg-secondary/30">
                  <tr>
                    {['#', 'Month', 'Due Date', 'Amount', 'Status'].map((h) => (
                      <th key={h} className="px-6 py-3.5 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {EMI_SCHEDULE.map((e, i) => (
                    <tr key={i} className="border-b border-border/40 hover:bg-secondary/20 transition-colors">
                      <td className="px-6 py-4 text-xs font-mono text-muted-foreground">{String(i + 1).padStart(2, '0')}</td>
                      <td className="px-6 py-4 font-medium text-foreground">{e.month}</td>
                      <td className="px-6 py-4 text-muted-foreground text-xs">{e.due}</td>
                      <td className="px-6 py-4 font-bold text-foreground">{e.amount}</td>
                      <td className="px-6 py-4">
                        <span className="flex items-center gap-1.5 rounded-full border border-amber-500/20 bg-amber-500/10 px-2.5 py-1 text-[10px] font-semibold text-amber-600 w-fit">
                          <Clock className="h-3 w-3" /> Upcoming
                        </span>
                      </td>
                    </tr>
                  ))}
                  {/* Placeholder rows */}
                  {[...Array(3)].map((_, i) => (
                    <tr key={`ph-${i}`} className="border-b border-border/40">
                      <td className="px-6 py-4 text-xs font-mono text-muted-foreground/30">{String(i + 4).padStart(2, '0')}</td>
                      <td className="px-6 py-4"><div className="h-3 w-20 rounded-full bg-secondary animate-pulse" /></td>
                      <td className="px-6 py-4"><div className="h-3 w-24 rounded-full bg-secondary animate-pulse" /></td>
                      <td className="px-6 py-4"><div className="h-3 w-16 rounded-full bg-secondary animate-pulse" /></td>
                      <td className="px-6 py-4"><div className="h-3 w-20 rounded-full bg-secondary animate-pulse" /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-6 py-4 border-t border-border flex items-center justify-between">
              <p className="text-xs text-muted-foreground">Showing first 3 of 48 EMIs</p>
              <Button variant="outline" className="gap-2 rounded-xl h-9 text-xs border-border">
                <Download className="h-3.5 w-3.5" /> Download Full Schedule
              </Button>
            </div>
          </div>
        )}

        {activeTab === 'docs' && (
          <div className="rounded-3xl border border-border bg-card shadow-sm">
            <div className="px-6 py-4 border-b border-border flex items-center justify-between">
              <h2 className="text-base font-bold text-foreground" style={{ fontFamily: 'var(--font-heading)' }}>My Documents</h2>
              <Badge variant="secondary" className="text-xs rounded-lg">{documents.length} uploaded</Badge>
            </div>
            <div className="p-6">
              {documents.length > 0 ? (
                <div className="grid gap-3 sm:grid-cols-2">
                  {documents.map((doc) => (
                    <div key={doc.id} className="group flex items-center gap-3 rounded-2xl border border-border bg-secondary/30 p-4 hover:border-accent/30 hover:bg-accent/5 transition-all cursor-pointer">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 shrink-0">
                        <FileText className="h-5 w-5 text-accent" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-foreground truncate">{doc.name}</p>
                        <p className="text-[10px] text-muted-foreground capitalize">{doc.type}</p>
                      </div>
                      <CheckCircle2 className="h-4 w-4 text-accent shrink-0" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12">
                  <FileText className="mb-3 h-10 w-10 text-muted-foreground/20" />
                  <p className="text-sm text-muted-foreground">No documents uploaded yet</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
