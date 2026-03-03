"use client";

import { useState, useMemo } from "react";
import {
  Search,
  X,
  ChevronDown,
  ArrowRight,
  Star,
  Zap,
  SlidersHorizontal,
  Home,
  Car,
  Briefcase,
  GraduationCap,
  Coins,
  User,
  IndianRupee,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { LoanType, Lender } from "@/types";

/* --- Helpers --- */
const loanTypeLabels: Record<Exclude<LoanType, "all">, string> = {
  personal: "Personal",
  home: "Home Loan",
  car: "Car Loan",
  business: "Business",
  education: "Education",
  gold: "Gold Loan",
};

const loanTypeIcons: Record<Exclude<LoanType, "all">, typeof Home> = {
  personal: User,
  home: Home,
  car: Car,
  business: Briefcase,
  education: GraduationCap,
  gold: Coins,
};

function calcEMI(principal: number, annualRate: number, months: number) {
  const r = annualRate / 12 / 100;
  const emi =
    (principal * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
  return Math.round(emi);
}

function renderStars(rating: number) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.3;
  const stars: React.ReactNode[] = [];
  for (let i = 0; i < 5; i++) {
    if (i < full) {
      stars.push(
        <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />,
      );
    } else if (i === full && half) {
      stars.push(
        <span key={i} className="relative inline-flex">
          <Star className="h-3 w-3 text-gray-300" />
          <span className="absolute inset-0 overflow-hidden w-[50%]">
            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
          </span>
        </span>,
      );
    } else {
      stars.push(<Star key={i} className="h-3 w-3 text-gray-300" />);
    }
  }
  return stars;
}

/* --- Loan Type Filter Pills --- */
const typeOptions: { type: LoanType; label: string; icon: typeof Home }[] = [
  { type: "all", label: "All", icon: SlidersHorizontal },
  { type: "personal", label: "Personal", icon: User },
  { type: "home", label: "Home", icon: Home },
  { type: "car", label: "Car", icon: Car },
  { type: "business", label: "Business", icon: Briefcase },
  { type: "education", label: "Education", icon: GraduationCap },
  { type: "gold", label: "Gold", icon: Coins },
];

/* --- Lender Data --- */
const lenders: Lender[] = [
  {
    id: "sbi",
    name: "State Bank of India",
    abbr: "SBI",
    loanTypes: ["personal", "home", "car", "education", "gold"],
    rate: 8.5,
    maxAmount: "5 Cr",
    disbursal: "3-5 days",
    rating: 4.5,
    popular: true,
    features: [
      "No prepayment charges",
      "Flexible tenure up to 7 years",
      "Special rates for govt employees",
      "Online account management",
    ],
  },
  {
    id: "hdfc",
    name: "HDFC Bank",
    abbr: "HDFC",
    loanTypes: ["personal", "home", "car", "business"],
    rate: 8.75,
    maxAmount: "10 Cr",
    disbursal: "24 hrs",
    rating: 4.6,
    popular: true,
    features: [
      "Instant approval for pre-approved customers",
      "Balance transfer facility",
      "Top-up loan available",
      "Doorstep service",
    ],
  },
  {
    id: "icici",
    name: "ICICI Bank",
    abbr: "ICICI",
    loanTypes: ["personal", "home", "car", "business", "education"],
    rate: 8.85,
    maxAmount: "5 Cr",
    disbursal: "2-4 days",
    rating: 4.4,
    features: [
      "Flexible repayment options",
      "Part-prepayment allowed",
      "Digital loan management",
      "Insurance bundled options",
    ],
  },
  {
    id: "axis",
    name: "Axis Bank",
    abbr: "AXIS",
    loanTypes: ["personal", "home", "car", "gold"],
    rate: 9.0,
    maxAmount: "3 Cr",
    disbursal: "48 hrs",
    rating: 4.3,
    features: [
      "Step-up EMI option",
      "Express disbursal",
      "Online document upload",
      "Dedicated RM for high-value loans",
    ],
  },
  {
    id: "kotak",
    name: "Kotak Mahindra Bank",
    abbr: "KMB",
    loanTypes: ["personal", "home", "business", "gold"],
    rate: 8.7,
    maxAmount: "7 Cr",
    disbursal: "2-3 days",
    rating: 4.4,
    popular: true,
    features: [
      "Zero foreclosure charges after 12 months",
      "Overdraft facility",
      "Competitive rates for salaried",
      "Minimal documentation",
    ],
  },
  {
    id: "bajaj",
    name: "Bajaj Finserv",
    abbr: "BAJ",
    loanTypes: ["personal", "business", "gold"],
    rate: 11.0,
    maxAmount: "40 L",
    disbursal: "4 hrs",
    rating: 4.2,
    features: [
      "Flexi loan facility",
      "No collateral required",
      "Part-prepayment allowed",
      "Quick 4-hour disbursal",
    ],
  },
  {
    id: "tata",
    name: "Tata Capital",
    abbr: "TATA",
    loanTypes: ["personal", "home", "car", "business", "education"],
    rate: 10.5,
    maxAmount: "3 Cr",
    disbursal: "3-5 days",
    rating: 4.1,
    features: [
      "Customized repayment plans",
      "Balance transfer option",
      "Minimal documentation",
      "Wide branch network",
    ],
  },
  {
    id: "pnb",
    name: "Punjab National Bank",
    abbr: "PNB",
    loanTypes: ["personal", "home", "car", "education", "gold"],
    rate: 8.45,
    maxAmount: "5 Cr",
    disbursal: "5-7 days",
    rating: 4.0,
    features: [
      "Lowest interest rates",
      "Govt bank security",
      "Education loan moratorium",
      "Subsidized rates for women",
    ],
  },
  {
    id: "idfc",
    name: "IDFC First Bank",
    abbr: "IDFC",
    loanTypes: ["personal", "home", "car"],
    rate: 9.5,
    maxAmount: "1 Cr",
    disbursal: "24 hrs",
    rating: 4.3,
    features: [
      "100% digital process",
      "Instant approval",
      "No hidden charges",
      "Flexible EMI dates",
    ],
  },
  {
    id: "muthoot",
    name: "Muthoot Finance",
    abbr: "MF",
    loanTypes: ["gold", "personal"],
    rate: 9.0,
    maxAmount: "1.5 Cr",
    disbursal: "10 min",
    rating: 4.1,
    features: [
      "Instant gold loan in 10 min",
      "No income proof required",
      "Lowest gold loan rates",
      "Flexible repayment",
    ],
  },
  {
    id: "manappuram",
    name: "Manappuram Finance",
    abbr: "MANA",
    loanTypes: ["gold", "personal"],
    rate: 10.0,
    maxAmount: "1 Cr",
    disbursal: "15 min",
    rating: 3.9,
    features: [
      "Quick gold valuation",
      "Multiple repayment schemes",
      "Online gold loan renewal",
      "Pan-India branches",
    ],
  },
  {
    id: "iifl",
    name: "IIFL Finance",
    abbr: "IIFL",
    loanTypes: ["personal", "business", "gold", "home"],
    rate: 9.5,
    maxAmount: "5 Cr",
    disbursal: "1-3 days",
    rating: 4.0,
    features: [
      "Digital-first process",
      "Gold loan at doorstep",
      "Business loan without collateral",
      "Attractive balance transfer rates",
    ],
  },
];

/* --- Lender Card --- */
function LenderCard({ lender }: { lender: Lender }) {
  const [expanded, setExpanded] = useState(false);
  const emi = calcEMI(1000000, lender.rate, 60);

  return (
    <div
      className={cn(
        "relative flex flex-col rounded-2xl border bg-white shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 overflow-hidden",
        lender.popular ? "border-accent/30" : "border-gray-200",
      )}
    >
      {/* Popular badge */}
      {lender.popular && (
        <div className="absolute top-5 right-27 z-10">
          <span className="rounded-md bg-accent px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm">
            Popular
          </span>
        </div>
      )}

      {/* Header */}
      <div className="p-5 pb-0">
        <div className="flex items-start gap-3.5">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gray-100 text-xs font-bold text-gray-600 border border-gray-200">
            {lender.abbr}
          </div>
          <div className="flex-1 min-w-0 pt-0.5">
            <div className="flex items-center gap-2 pr-20">
              <h3 className="text-[15px] font-bold text-gray-900 truncate">
                {lender.name}
              </h3>
            </div>
            <div className="mt-1 flex items-center gap-1.5">
              <div className="flex items-center gap-0.5">
                {renderStars(lender.rating)}
              </div>
              <span className="text-xs font-medium text-gray-500">
                {lender.rating}
              </span>
            </div>
          </div>
          <div className="shrink-0 mt-0.5">
            <span className="inline-flex items-center gap-1 rounded-full border border-accent/30 bg-accent/5 px-2.5 py-1 text-[10px] font-semibold text-accent">
              <Zap className="h-2.5 w-2.5" />
              {lender.disbursal}
            </span>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="mx-5 mt-5 grid grid-cols-3 gap-3 rounded-xl bg-gray-50 p-4">
        <div>
          <p className="text-[9px] font-semibold uppercase tracking-wider text-gray-400">
            Rate From
          </p>
          <p className="mt-1 text-lg font-bold text-accent leading-none">
            {lender.rate}%
          </p>
        </div>
        <div>
          <p className="text-[9px] font-semibold uppercase tracking-wider text-gray-400">
            EMI From
          </p>
          <p className="mt-1 text-lg font-bold text-gray-900 leading-none">
            <IndianRupee className="inline h-3.5 w-3.5 mb-0.5" />
            {emi.toLocaleString("en-IN")}
          </p>
        </div>
        <div>
          <p className="text-[9px] font-semibold uppercase tracking-wider text-gray-400">
            Max Amount
          </p>
          <p className="mt-1 text-lg font-bold text-gray-900 leading-none">
            <IndianRupee className="inline h-3.5 w-3.5 mb-0.5" />
            {lender.maxAmount}
          </p>
        </div>
      </div>

      {/* Loan Type Pills */}
      <div className="px-5 mt-4 flex flex-wrap gap-1.5">
        {lender.loanTypes
          .filter((t): t is Exclude<LoanType, "all"> => t !== "all")
          .map((t) => {
            const Icon = loanTypeIcons[t];
            return (
              <span
                key={t}
                className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-[10px] font-medium text-gray-600"
              >
                <Icon className="h-2.5 w-2.5 text-accent" />
                {loanTypeLabels[t]}
              </span>
            );
          })}
      </div>

      {/* Expandable Features */}
      <div className="px-5 mt-3">
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-gray-700 transition-colors py-1.5"
        >
          <ChevronDown
            className={cn(
              "h-3.5 w-3.5 transition-transform duration-200",
              expanded && "rotate-180",
            )}
          />
          View Features &amp; Details
        </button>
        {expanded && lender.features && (
          <div className="mt-2 mb-1 space-y-1.5">
            {lender.features.map((f, i) => (
              <div
                key={i}
                className="flex items-start gap-2 text-[11px] text-gray-600"
              >
                <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent/60" />
                {f}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CTA Button */}
      <div className="p-5 pt-3 mt-auto">
        <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-accent py-3 text-sm font-semibold text-white transition-all hover:bg-accent/90 hover:shadow-md hover:shadow-accent/20 active:scale-[0.98]">
          Check Eligibility
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

/* --- Main Component --- */
function NBFCfilter() {
  const [query, setQuery] = useState("");
  const [type, setType] = useState<LoanType>("all");
  const [showAll, setShowAll] = useState(false);
  const LIMIT = 6;

  const filtered = useMemo(() => {
    let results = [...lenders];

    if (type !== "all") {
      results = results.filter((l) => l.loanTypes.includes(type));
    }

    if (query.trim()) {
      const q = query.toLowerCase().trim();
      results = results.filter(
        (l) =>
          l.name.toLowerCase().includes(q) || l.abbr.toLowerCase().includes(q),
      );
    }

    results.sort((a, b) => {
      if (a.popular && !b.popular) return -1;
      if (!a.popular && b.popular) return 1;
      return a.rate - b.rate;
    });

    return results;
  }, [query, type]);

  const visible = showAll ? filtered : filtered.slice(0, LIMIT);
  const remaining = filtered.length - LIMIT;

  return (
    <div className="w-full">
      {/* Search */}
      <div className="relative mx-auto max-w-xl mb-6">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-primary-foreground/25" />
        <input
          type="text"
          placeholder="Search banks & NBFCs..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowAll(false);
          }}
          className="h-12 w-full rounded-full border border-primary-foreground/8 bg-primary-foreground/5 pl-11 pr-10 text-sm text-primary-foreground placeholder:text-primary-foreground/25 focus:border-accent/50 focus:outline-none focus:ring-1 focus:ring-accent/30 backdrop-blur-sm transition-all"
        />
        {query && (
          <button
            onClick={() => {
              setQuery("");
              setShowAll(false);
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-primary-foreground/30 hover:text-primary-foreground/60 transition-colors"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* Type pills */}
      <div className="flex flex-wrap justify-center gap-1.5 mb-8">
        {typeOptions.map((opt) => {
          const Icon = opt.icon;
          const active = type === opt.type;
          return (
            <button
              key={opt.type}
              onClick={() => {
                setType(opt.type);
                setShowAll(false);
              }}
              className={cn(
                "flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition-all duration-200",
                active
                  ? "bg-accent text-white shadow-sm shadow-accent/20"
                  : "text-primary-foreground/60 hover:text-primary-foreground/80 hover:bg-primary-foreground/5",
              )}
            >
              <Icon className="h-3 w-3" />
              {opt.label}
            </button>
          );
        })}
      </div>

      {/* Count */}
      <p className="text-xs text-primary-foreground/50 mb-4">
        Showing{" "}
        <span className="font-semibold text-primary-foreground/50">
          {Math.min(visible.length, filtered.length)}
        </span>{" "}
        of{" "}
        <span className="font-semibold text-primary-foreground/50">
          {filtered.length}
        </span>{" "}
        lenders
      </p>

      {/* Lender Grid */}
      {filtered.length > 0 ? (
        <>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((l) => (
              <LenderCard key={l.id} lender={l} />
            ))}
          </div>

          {/* Show More */}
          {remaining > 0 && (
            <div className="mt-8 flex justify-center">
              <button
                onClick={() => setShowAll(!showAll)}
                className="flex items-center gap-1.5 rounded-full border border-primary-foreground/10 bg-primary-foreground/5 px-6 py-2.5 text-xs font-medium text-primary-foreground/60 transition-all hover:text-primary-foreground/80 hover:bg-primary-foreground/8 hover:border-primary-foreground/15"
              >
                {showAll ? (
                  <>
                    Show less
                    <ChevronDown className="h-3 w-3 rotate-180" />
                  </>
                ) : (
                  <>
                    Show {remaining} more lenders
                    <ChevronDown className="h-3 w-3" />
                  </>
                )}
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="flex flex-col items-center py-12 text-center">
          <Search className="h-8 w-8 text-primary-foreground/10 mb-3" />
          <p className="text-sm text-primary-foreground/30">
            No lenders found.{" "}
            <button
              onClick={() => {
                setQuery("");
                setType("all");
              }}
              className="text-accent hover:underline"
            >
              Clear filters
            </button>
          </p>
        </div>
      )}
    </div>
  );
}

export default NBFCfilter;
