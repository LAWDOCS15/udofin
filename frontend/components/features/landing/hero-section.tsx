"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ChevronRight, ArrowUpRight } from "lucide-react";
import { useCountUp } from "@/hooks/use-reveal";
import { Reveal } from "./shared";
import NBFCfilter from "./nbfc-filter";

/* ─── Data ─── */
const stats = [
  { value: 50000, suffix: "+", label: "Loans disbursed" },
  { value: 5, suffix: " min", label: "Avg approval" },
  { value: 99, suffix: ".9%", label: "Platform uptime" },
  { value: 48, suffix: "/5", prefix: "", label: "User rating" },
];

const lenders = [
  { name: "HDFC Bank", code: "HDFC", color: "from-blue-900/30 to-blue-800/20" },
  {
    name: "ICICI Bank",
    code: "ICICI",
    color: "from-orange-900/30 to-orange-800/20",
  },
  {
    name: "Axis Bank",
    code: "AXIS",
    color: "from-violet-900/30 to-violet-800/20",
  },
  {
    name: "Bajaj Finserv",
    code: "BFL",
    color: "from-red-900/30 to-red-800/20",
  },
  {
    name: "Tata Capital",
    code: "TATA",
    color: "from-teal-900/30 to-teal-800/20",
  },
  { name: "SBI", code: "SBI", color: "from-blue-900/30 to-blue-800/20" },
];

function StatCounter({ end, suffix = "", prefix = "" }: { end: number; suffix?: string; prefix?: string }) {
  const { count, ref } = useCountUp(end, 1800);
  return <span ref={ref}>{prefix}{count.toLocaleString("en-IN")}{suffix}</span>;
}

export function HeroSection() {
  const router = useRouter();

  return (
    <section className="relative overflow-hidden bg-primary pt-16">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_-20%,rgba(82,150,100,0.10),transparent)]" />
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-foreground/8 to-transparent" />

      <div className="relative mx-auto max-w-7xl px-6 pb-0 pt-24 lg:px-8 lg:pt-36">
        <div className="mx-auto max-w-4xl">
          {/* Pill */}
          <div
            className="mb-10 flex justify-center opacity-0 animate-fade-up"
            style={{ animationDelay: "0ms", animationFillMode: "forwards" }}
          >
            <div className="inline-flex items-center gap-2.5 rounded-full border border-primary-foreground/6 bg-primary-foreground/3 px-5 py-2.5 text-[13px] text-primary-foreground/50 backdrop-blur-sm transition-all hover:border-primary-foreground/10 hover:text-primary-foreground/60 hover:shadow-lg hover:shadow-primary-foreground/5 cursor-pointer duration-300">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
              </span>
              Announcing $20M Series A Funding
              <ChevronRight className="h-3.5 w-3.5 text-primary-foreground/25 transition-transform group-hover:translate-x-1" />
            </div>
          </div>

          {/* Headline */}
          <h1
            className="text-center text-balance text-[2.5rem] font-bold leading-[1.06] tracking-tight text-primary-foreground sm:text-5xl md:text-6xl lg:text-[4.5rem] opacity-0 animate-fade-up"
            style={{
              fontFamily: "var(--font-heading)",
              animationDelay: "100ms",
              animationFillMode: "forwards",
            }}
          >
            Smart Lending for{" "}
            <span className="relative inline-block">
              Modern India
              <svg
                className="absolute -bottom-2 left-0 right-0 w-full opacity-0 animate-fade-up"
                height="10"
                viewBox="0 0 200 10"
                fill="none"
                preserveAspectRatio="none"
                style={{
                  animationDelay: "500ms",
                  animationFillMode: "forwards",
                }}
              >
                <path
                  d="M1 6.5Q50 1 100 5Q150 9 199 3.5"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  fill="none"
                  className="text-accent"
                />
              </svg>
            </span>
          </h1>

          {/* Sub */}
          <p
            className="mx-auto mt-7 max-w-2xl text-center text-pretty text-base leading-relaxed text-primary-foreground/35 sm:text-lg lg:text-xl opacity-0 animate-fade-up"
            style={{ animationDelay: "200ms", animationFillMode: "forwards" }}
          >
            AI-powered loan applications completed in minutes. From conversation
            to disbursement -- transparent, secure, and instant.
          </p>

          {/* CTAs */}
          <div
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row opacity-0 animate-fade-up"
            style={{ animationDelay: "300ms", animationFillMode: "forwards" }}
          >
            <Button
              size="lg"
              className="group h-14 gap-2.5 rounded-full bg-primary-foreground px-9 text-base font-semibold text-primary shadow-2xl shadow-primary-foreground/10 transition-all hover:bg-primary-foreground/90 hover:shadow-primary-foreground/15 hover:gap-3.5"
              onClick={() => router.push("/auth")}
            >
              Start Application
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Button>
            <Button
              variant="ghost"
              size="lg"
              className="h-14 gap-2 rounded-full px-8 text-base font-medium text-primary-foreground/70 transition-all hover:bg-primary-foreground/5 hover:text-primary-foreground/90 "
              onClick={() => router.push("/auth")}
            >
              Sign In to Apply
            </Button>
          </div>

          {/* Lenders */}
          <div
            className="mt-20 opacity-0 animate-fade-up"
            style={{ animationDelay: "400ms", animationFillMode: "forwards" }}
          >
            <p className="mb-8 text-center text-[10px] font-semibold uppercase tracking-[0.25em] text-primary-foreground/50">
              Trusted by leading financial institutions
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              {lenders.map((inst, i) => (
                <div
                  key={inst.name}
                  className={`opacity-0 animate-fade-up flex items-center gap-2.5 rounded-2xl border border-primary-foreground/8 bg-gradient-to-br ${inst.color} px-4 py-2.5 transition-all duration-300 hover:border-primary-foreground/15 hover:scale-105 cursor-default`}
                  style={{
                    animationDelay: `${500 + i * 60}ms`,
                    animationFillMode: "forwards",
                  }}
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary-foreground/10 text-[10px] font-bold text-primary-foreground/60">
                    {inst.code.slice(0, 2)}
                  </div>
                  <span
                    className="text-[12px] font-semibold text-primary-foreground/70"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {inst.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── LOAN SEARCH & COMPARE ── */}
      <div className="relative mt-16 lg:mt-24 pb-6">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-primary-foreground/[0.02] to-transparent" />
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <Reveal>
            <div className="flex items-center justify-center gap-3 mb-8">
              <div className="h-px flex-1 max-w-16 bg-gradient-to-r from-transparent to-primary-foreground/10" />
              <p className="text-[16px] font-semibold uppercase tracking-[0.25em] text-primary-foreground/60">
                Compare Lenders
              </p>
              <div className="h-px flex-1 max-w-16 bg-gradient-to-l from-transparent to-primary-foreground/10" />
            </div>
          </Reveal>
          <NBFCfilter />
        </div>
      </div>

      {/* Stats strip */}
      <div className="relative mt-20 border-t border-primary-foreground/4">
        <div className="mx-auto grid max-w-7xl grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className={`flex flex-col px-6 py-10 lg:px-10 ${i < stats.length - 1 ? "border-r border-primary-foreground/4" : ""}`}
            >
              <span
                className="text-3xl font-bold text-primary-foreground lg:text-4xl"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {stat.prefix}
                <StatCounter
                  end={stat.value === 48 ? 4 : stat.value}
                  suffix={stat.suffix}
                  prefix={stat.prefix || ""}
                />
              </span>
              <span className="mt-2 text-[13px] text-primary-foreground/30">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
