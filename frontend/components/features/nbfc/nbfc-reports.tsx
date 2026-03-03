"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { DataExportButton } from "@/components/shared/data-export-button";

const MONTHLY = [
  { month: "Sep", apps: 32, approved: 28, collected: 3200000 },
  { month: "Oct", apps: 38, approved: 33, collected: 3600000 },
  { month: "Nov", apps: 45, approved: 40, collected: 4100000 },
  { month: "Dec", apps: 42, approved: 36, collected: 3900000 },
  { month: "Jan", apps: 55, approved: 48, collected: 4500000 },
  { month: "Feb", apps: 48, approved: 42, collected: 4200000 },
];

type Period = "7d" | "30d" | "90d" | "1y";

export function NbfcReports() {
  const [period, setPeriod] = useState<Period>("30d");
  const maxApps = Math.max(...MONTHLY.map((d) => d.apps));

  const stats = [
    { label: "Total Revenue", value: "₹23.5L", change: "+12%", up: true },
    { label: "Avg Ticket Size", value: "₹5.8L", change: "+3%", up: true },
    { label: "Collection Rate", value: "96.2%", change: "+1.5%", up: true },
    { label: "NPA Rate", value: "1.8%", change: "-0.2%", up: false },
  ];

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1
            className="text-2xl font-bold text-foreground"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Reports
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Performance analytics for your NBFC
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 rounded-xl border border-border bg-card p-1">
            {(["7d", "30d", "90d", "1y"] as Period[]).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-[10px] font-semibold transition-all",
                  period === p
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {p}
              </button>
            ))}
          </div>
          <DataExportButton onExportCSV={() => {}} onExportPDF={() => {}} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-2xl border border-border bg-card p-4"
          >
            <p className="text-[10px] text-muted-foreground mb-1">{s.label}</p>
            <div className="flex items-center justify-between">
              <p className="text-xl font-bold text-foreground">{s.value}</p>
              <span
                className={cn(
                  "flex items-center gap-0.5 text-[10px] font-semibold",
                  s.label === "NPA Rate"
                    ? "text-accent"
                    : s.up
                      ? "text-accent"
                      : "text-red-500",
                )}
              >
                {s.up ? (
                  <ArrowUpRight className="h-3 w-3" />
                ) : (
                  <ArrowDownRight className="h-3 w-3" />
                )}{" "}
                {s.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3 rounded-3xl border border-border bg-card p-6 shadow-sm">
          <h2
            className="text-base font-bold text-foreground mb-5"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Application Trends
          </h2>
          <div className="flex items-end gap-3 h-auto">
            {MONTHLY.map((d) => (
              <div
                key={d.month}
                className="flex-1 flex flex-col items-center gap-1"
              >
                <div className="w-full space-y-0.5">
                  <div
                    className="w-full rounded-t-md bg-accent/20"
                    style={{ height: `${(d.apps / maxApps) * 140}px` }}
                  />
                  <div
                    className="w-full rounded-b-md bg-accent"
                    style={{ height: `${(d.approved / maxApps) * 140}px` }}
                  />
                </div>
                <span className="text-[9px] text-muted-foreground">
                  {d.month}
                </span>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-4 mt-3 pt-3 border-t border-border">
            <div className="flex items-center gap-1.5">
              <div className="h-2.5 w-2.5 rounded-sm bg-accent/20" />
              <span className="text-[10px] text-muted-foreground">Applied</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-2.5 w-2.5 rounded-sm bg-accent" />
              <span className="text-[10px] text-muted-foreground">
                Approved
              </span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 rounded-3xl border border-border bg-card p-6 shadow-sm">
          <h2
            className="text-base font-bold text-foreground mb-4"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Collection Summary
          </h2>
          <div className="space-y-3">
            {MONTHLY.map((d) => (
              <div key={d.month}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-foreground">{d.month}</span>
                  <span className="text-xs font-semibold text-foreground">
                    ₹{(d.collected / 100000).toFixed(0)}L
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full bg-accent"
                    style={{ width: `${(d.collected / 4500000) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
