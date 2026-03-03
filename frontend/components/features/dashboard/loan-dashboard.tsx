"use client";

import { useOnboarding } from "@/lib/onboarding-context";
import { useEMICalculator } from "@/hooks/use-emi-calculator";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  IndianRupee,
  TrendingUp,
  Calendar,
  Wallet,
  Download,
  Filter,
  X,
  CheckCircle2,
  Star,
  Building2,
  FileText,
  ShieldCheck,
  ArrowUpRight,
  Sparkles,
  Search,
  SlidersHorizontal,
  Info,
  ExternalLink,
  Percent,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useMemo } from "react";

const ALL_OFFERS = [
  {
    id: 1,
    lender: "HDFC Bank",
    logo: "HDFC",
    amount: 800000,
    rate: 10.5,
    tenure: 48,
    tag: "Best Rate",
    featured: true,
    processing: "0.5%",
    preApproved: true,
    type: "Personal Loan",
    disbursal: "Same Day",
  },
  {
    id: 2,
    lender: "ICICI Bank",
    logo: "ICICI",
    amount: 800000,
    rate: 11.0,
    tenure: 48,
    tag: "Quick Approval",
    featured: false,
    processing: "0.75%",
    preApproved: true,
    type: "Personal Loan",
    disbursal: "24 Hrs",
  },
  {
    id: 3,
    lender: "SBI",
    logo: "SBI",
    amount: 800000,
    rate: 10.75,
    tenure: 48,
    tag: "Trusted Lender",
    featured: false,
    processing: "0.5%",
    preApproved: true,
    type: "Personal Loan",
    disbursal: "Same Day",
  },
  {
    id: 4,
    lender: "Axis Bank",
    logo: "AXIS",
    amount: 800000,
    rate: 11.5,
    tenure: 48,
    tag: "Flexible Terms",
    featured: false,
    processing: "1.0%",
    preApproved: false,
    type: "Personal Loan",
    disbursal: "48 Hrs",
  },
  {
    id: 5,
    lender: "Bajaj Finserv",
    logo: "BFL",
    amount: 800000,
    rate: 12.0,
    tenure: 48,
    tag: "No Collateral",
    featured: false,
    processing: "1.25%",
    preApproved: false,
    type: "Personal Loan",
    disbursal: "24 Hrs",
  },
  {
    id: 6,
    lender: "Tata Capital",
    logo: "TATA",
    amount: 800000,
    rate: 11.75,
    tenure: 48,
    tag: "Low Processing",
    featured: false,
    processing: "0.5%",
    preApproved: false,
    type: "Personal Loan",
    disbursal: "48 Hrs",
  },
];

// Offer card component
function OfferCard({
  offer,
  index,
}: {
  offer: (typeof ALL_OFFERS)[0];
  index: number;
}) {
  const emi = useEMICalculator(offer.amount, offer.rate, offer.tenure);
  const totalInterest = emi.totalAmount - offer.amount;

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-3xl border transition-all duration-500 animate-fade-up",
        offer.featured
          ? "border-accent/40 bg-gradient-to-br from-card to-accent/5 shadow-2xl shadow-accent/10 ring-1 ring-accent/20"
          : "border-border bg-card hover:border-accent/25 hover:shadow-xl hover:shadow-foreground/5 hover:-translate-y-0.5",
      )}
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {offer.featured && (
        <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-accent to-transparent" />
      )}

      <div className="p-6 lg:p-7">
        {/* Header */}
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "flex h-12 w-12 items-center justify-center rounded-2xl text-xs font-bold transition-all",
                offer.featured
                  ? "bg-accent/15 text-accent"
                  : "bg-secondary text-foreground group-hover:bg-accent/10 group-hover:text-accent",
              )}
            >
              {offer.logo}
            </div>
            <div>
              <p className="font-semibold text-foreground text-sm">
                {offer.lender}
              </p>
              {offer.preApproved && (
                <span className="inline-flex items-center gap-1 mt-0.5 text-[10px] font-semibold text-accent">
                  <CheckCircle2 className="h-3 w-3" /> Pre-Approved
                </span>
              )}
            </div>
          </div>
          <div className="flex flex-col items-end gap-1.5">
            {offer.featured && (
              <Badge className="bg-accent text-accent-foreground text-[10px] gap-1">
                <Star className="h-2.5 w-2.5" /> Recommended
              </Badge>
            )}
            <span className="text-[10px] text-muted-foreground bg-secondary rounded-full px-2 py-0.5">
              {offer.tag}
            </span>
          </div>
        </div>

        {/* EMI highlight */}
        <div className="mb-5 rounded-2xl bg-primary p-5">
          <p className="text-[10px] uppercase tracking-[0.2em] text-primary-foreground/40 mb-1">
            Monthly EMI
          </p>
          <p
            className="text-3xl font-bold text-primary-foreground"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            <IndianRupee className="inline h-6 w-6 mb-0.5" />
            {emi.monthlyEMI.toLocaleString("en-IN")}
          </p>
          <div className="mt-3 flex gap-4">
            <div>
              <p className="text-[9px] text-primary-foreground/30 uppercase tracking-wider">
                Rate
              </p>
              <p className="text-sm font-semibold text-accent">
                {offer.rate}% p.a.
              </p>
            </div>
            <div>
              <p className="text-[9px] text-primary-foreground/30 uppercase tracking-wider">
                Processing
              </p>
              <p className="text-sm font-semibold text-primary-foreground/70">
                {offer.processing}
              </p>
            </div>
            <div>
              <p className="text-[9px] text-primary-foreground/30 uppercase tracking-wider">
                Disbursal
              </p>
              <p className="text-sm font-semibold text-primary-foreground/70">
                {offer.disbursal}
              </p>
            </div>
          </div>
        </div>

        {/* Breakdown */}
        <div className="mb-5 space-y-2.5 text-sm">
          {[
            ["Loan Amount", `₹${offer.amount.toLocaleString("en-IN")}`],
            ["Tenure", `${offer.tenure} months`],
            ["Total Interest", `₹${totalInterest.toLocaleString("en-IN")}`],
            ["Total Repayment", `₹${emi.totalAmount.toLocaleString("en-IN")}`],
          ].map(([label, value], i) => (
            <div
              key={label}
              className={cn(
                "flex items-center justify-between",
                i === 3 && "border-t border-border/50 pt-2.5 font-semibold",
              )}
            >
              <span className="text-muted-foreground">{label}</span>
              <span
                className={cn(
                  "font-medium text-foreground",
                  i === 3 && "text-accent",
                )}
              >
                {value}
              </span>
            </div>
          ))}
        </div>

        <Button
          className="w-full h-11 rounded-xl font-semibold gap-2 transition-all bg-accent text-accent-foreground hover:bg-accent/90 shadow-lg shadow-accent/20"
        >
          Apply Now <ArrowUpRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

// Loan Dashboard component
export function LoanDashboard() {
  const { userProfile, documents } = useOnboarding();
  const [search, setSearch] = useState("");
  const [rateFilter, setRateFilter] = useState<"all" | "low" | "mid" | "high">(
    "all",
  );
  const [approvedOnly, setApprovedOnly] = useState(false);

  const filtered = useMemo(
    () =>
      ALL_OFFERS.filter((o) => {
        const matchSearch =
          !search || o.lender.toLowerCase().includes(search.toLowerCase());
        const matchRate =
          rateFilter === "all" ||
          (rateFilter === "low" && o.rate <= 10.75) ||
          (rateFilter === "mid" && o.rate > 10.75 && o.rate <= 11.5) ||
          (rateFilter === "high" && o.rate > 11.5);
        const matchApproved = !approvedOnly || o.preApproved;
        return matchSearch && matchRate && matchApproved;
      }),
    [search, rateFilter, approvedOnly],
  );

  const name = userProfile.fullName
    ? userProfile.fullName.split(" ")[0]
    : "there";

  return (
    <div className="min-h-screen bg-background pt-16">
      {/* Hero banner */}
      <div className="bg-primary">
        <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-3 flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-md bg-accent/20">
                  <CheckCircle2 className="h-3 w-3 text-accent" />
                </span>
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">
                  Application Approved
                </p>
              </div>
              <h1
                className="text-3xl font-bold text-primary-foreground lg:text-4xl"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Welcome back, {name} 👋
              </h1>
              <p className="mt-2 text-sm text-primary-foreground/35 max-w-lg">
                Your profile matches{" "}
                {ALL_OFFERS.filter((o) => o.preApproved).length} pre-approved
                offers. Compare and apply in one click.
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="ghost"
                className="h-10 gap-2 rounded-full border border-primary-foreground/10 text-sm text-primary-foreground/50 hover:bg-primary-foreground/5 hover:text-primary-foreground/70"
              >
                <Download className="h-4 w-4" /> Export
              </Button>
              <Button className="h-10 gap-2 rounded-full bg-accent px-5 text-sm font-semibold text-accent-foreground hover:bg-accent/90 shadow-lg shadow-accent/20">
                <Sparkles className="h-4 w-4" /> Refresh Offers
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Summary cards */}
      <div className="mx-auto mt-6 max-w-7xl px-6 lg:px-8">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: Wallet,
              label: "Loan Amount",
              value: `₹${userProfile.loanAmount || "8,00,000"}`,
              sub: "Requested",
              accent: true,
            },
            {
              icon: TrendingUp,
              label: "CIBIL Score",
              value: "758",
              sub: "Excellent",
              accent: true,
            },
            {
              icon: Calendar,
              label: "Tenure",
              value: userProfile.loanTenure || "48 Months",
              sub: "Preferred",
              accent: false,
            },
            {
              icon: ShieldCheck,
              label: "KYC Status",
              value: "Verified",
              sub: "All docs approved",
              accent: false,
            },
          ].map((c, i) => {
            const Icon = c.icon;
            return (
              <div
                key={c.label}
                className={cn(
                  "animate-fade-up rounded-2xl p-5 shadow-xl",
                  c.accent
                    ? i === 0
                      ? "bg-primary text-primary-foreground"
                      : "bg-accent text-accent-foreground"
                    : "border border-border bg-card",
                )}
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div
                    className={cn(
                      "flex h-9 w-9 items-center justify-center rounded-xl",
                      c.accent ? "bg-white/10" : "bg-secondary",
                    )}
                  >
                    <Icon
                      className={cn(
                        "h-5 w-5",
                        c.accent ? "opacity-80" : "text-foreground",
                      )}
                    />
                  </div>
                  <span
                    className={cn(
                      "text-[10px] uppercase tracking-wider",
                      c.accent ? "opacity-40" : "text-muted-foreground",
                    )}
                  >
                    {c.sub}
                  </span>
                </div>
                <p
                  className={cn(
                    "text-[11px] mb-1",
                    c.accent ? "opacity-50" : "text-muted-foreground",
                  )}
                >
                  {c.label}
                </p>
                <p
                  className="text-xl font-bold"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {c.value}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main content */}
      <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Offers column */}
          <div className="lg:col-span-2">
            {/* Search & filters */}
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2
                  className="text-lg font-bold text-foreground"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Loan Offers
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {filtered.length} of {ALL_OFFERS.length} offers
                </p>
              </div>
              <div className="flex gap-2 flex-wrap">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search lender..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="h-9 w-40 rounded-xl border border-border bg-card pl-8 pr-3 text-xs text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/30"
                  />
                </div>
                <div className="flex rounded-xl border border-border bg-card overflow-hidden text-xs">
                  {(["all", "low", "mid", "high"] as const).map((r) => (
                    <button
                      key={r}
                      onClick={() => setRateFilter(r)}
                      className={cn(
                        "px-3 py-2 capitalize transition-all",
                        rateFilter === r
                          ? "bg-primary text-primary-foreground font-medium"
                          : "text-muted-foreground hover:bg-secondary",
                      )}
                    >
                      {r === "all"
                        ? "All"
                        : r === "low"
                          ? "≤10.75%"
                          : r === "mid"
                            ? "11-11.5%"
                            : ">11.5%"}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setApprovedOnly(!approvedOnly)}
                  className={cn(
                    "flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs transition-all",
                    approvedOnly
                      ? "border-accent bg-accent/10 text-accent"
                      : "border-border bg-card text-muted-foreground hover:bg-secondary",
                  )}
                >
                  <CheckCircle2 className="h-3.5 w-3.5" /> Pre-Approved
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-5">
              {filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-card py-16">
                  <Building2 className="mb-3 h-8 w-8 text-muted-foreground/30" />
                  <p className="text-sm font-medium text-muted-foreground">
                    No offers match your filters
                  </p>
                  <button
                    onClick={() => {
                      setSearch("");
                      setRateFilter("all");
                      setApprovedOnly(false);
                    }}
                    className="mt-2 text-xs text-accent hover:underline"
                  >
                    Reset filters
                  </button>
                </div>
              ) : (
                filtered.map((offer, i) => (
                  <OfferCard key={offer.id} offer={offer} index={i} />
                ))
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="flex flex-col gap-5">
            {/* Approval score */}
            <div className="rounded-3xl border border-border bg-card p-6 overflow-hidden relative shadow-sm">
              <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-accent/8 blur-2xl" />
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <h3
                    className="text-sm font-bold text-foreground"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    Approval Probability
                  </h3>
                  <Badge className="bg-accent/15 text-accent border-accent/20 text-[10px]">
                    High
                  </Badge>
                </div>
                <div className="flex items-end gap-2 mb-3">
                  <span
                    className="text-4xl font-bold text-foreground"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    94
                  </span>
                  <span className="text-lg font-bold text-accent mb-1">%</span>
                </div>
                <div className="w-full h-2 bg-secondary rounded-full overflow-hidden mb-3">
                  <div
                    className="h-full bg-gradient-to-r from-accent to-accent/70 rounded-full transition-all duration-1000"
                    style={{ width: "94%" }}
                  />
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Based on your CIBIL score, income, and verified documents —
                  excellent approval chance.
                </p>
              </div>
            </div>

            {/* Application details */}
            <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h3
                  className="text-sm font-bold text-foreground"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Application Details
                </h3>
                <button className="text-[10px] text-accent flex items-center gap-1 hover:underline">
                  Edit <ExternalLink className="h-3 w-3" />
                </button>
              </div>
              <div className="flex flex-col gap-3 text-sm">
                {[
                  ["Applicant", userProfile.fullName || "—"],
                  ["DOB", userProfile.dateOfBirth || "—"],
                  ["Employment", userProfile.employmentType || "—"],
                  [
                    "Income",
                    userProfile.monthlyIncome
                      ? `₹${userProfile.monthlyIncome}`
                      : "—",
                  ],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="flex items-center justify-between border-b border-border/40 pb-2.5 last:border-0 last:pb-0"
                  >
                    <span className="text-muted-foreground text-xs">
                      {label}
                    </span>
                    <span className="font-medium text-foreground text-xs text-right max-w-[140px] truncate">
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Documents */}
            <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h3
                  className="text-sm font-bold text-foreground"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Documents
                </h3>
                <Badge variant="secondary" className="text-[10px] rounded-lg">
                  {documents.length} files
                </Badge>
              </div>
              <div className="flex flex-col gap-2">
                {documents.length > 0 ? (
                  documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center gap-2.5 rounded-xl border border-border/50 bg-secondary/40 px-3 py-2"
                    >
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-accent/10">
                        <FileText className="h-3.5 w-3.5 text-accent" />
                      </div>
                      <span className="flex-1 truncate text-[11px] font-medium text-foreground">
                        {doc.name}
                      </span>
                      <CheckCircle2 className="h-3.5 w-3.5 text-accent shrink-0" />
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-muted-foreground py-2 text-center">
                    No documents uploaded
                  </p>
                )}
              </div>
            </div>

            {/* Consent */}
            <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
              <h3
                className="mb-4 text-sm font-bold text-foreground"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Consent & Compliance
              </h3>
              <div className="flex flex-col gap-3">
                {[
                  { label: "KYC / CKYC", granted: userProfile.consentKYC },
                  {
                    label: "CIBIL Credit Check",
                    granted: userProfile.consentCBIL,
                  },
                  { label: "Data Processing", granted: true },
                ].map((c) => (
                  <div
                    key={c.label}
                    className="flex items-center justify-between"
                  >
                    <span className="text-xs text-muted-foreground">
                      {c.label}
                    </span>
                    <Badge
                      className={cn(
                        "text-[10px] rounded-lg",
                        c.granted
                          ? "bg-accent/10 text-accent border-accent/20"
                          : "bg-secondary text-muted-foreground",
                      )}
                    >
                      {c.granted ? "Granted" : "Pending"}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            {/* Help */}
            <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
              <h3
                className="mb-1.5 text-sm font-bold text-foreground"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Need help?
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                Our loan specialists are available Mon–Sat, 9 AM–7 PM.
              </p>
              <Button
                variant="outline"
                className="w-full gap-2 rounded-xl text-sm h-10"
              >
                <Building2 className="h-4 w-4" /> Talk to a Specialist
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
