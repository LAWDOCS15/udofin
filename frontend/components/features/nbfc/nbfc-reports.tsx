
"use client";

import { useState, useEffect } from "react"; 
import axios from "axios"; 
import { cn } from "@/lib/utils";
import { ArrowUpRight, ArrowDownRight, Loader2 } from "lucide-react";
import { DataExportButton } from "@/components/shared/data-export-button";

type Period = "7d" | "30d" | "90d" | "1y";

export function NbfcReports() {
  const [period, setPeriod] = useState<Period>("30d");
  const [data, setData] = useState<any>(null); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:5000/api/nbfc/reports", {
          withCredentials: true,
        });
        if (response.data.success) {
          setData(response.data);
        }
      } catch (error) {
        console.error("Report Fetch Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, [period]);

  if (loading) return (
    <div className="flex h-[400px] items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-accent" />
    </div>
  );

  if (!data) return <div className="p-8 text-center">No report data available.</div>;

  const monthlyData = data.monthly || [];
  const maxApps = Math.max(...monthlyData.map((d: any) => d.apps), 1);

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Reports</h1>
          <p className="text-xs text-muted-foreground mt-1">Live performance analytics</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 rounded-xl border border-border bg-card p-1">
            {(["7d", "30d", "90d", "1y"] as Period[]).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-[10px] font-semibold transition-all",
                  period === p ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:text-foreground"
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
        {data.stats.map((s: any) => (
          <div key={s.label} className="rounded-2xl border border-border bg-card p-4">
            <p className="text-[10px] text-muted-foreground mb-1">{s.label}</p>
            <div className="flex items-center justify-between">
              <p className="text-xl font-bold text-foreground">{s.value}</p>
              <span className={cn("flex items-center gap-0.5 text-[10px] font-semibold", 
                s.up ? "text-accent" : "text-red-500"
              )}>
                {s.up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                {s.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3 rounded-3xl border border-border bg-card p-6 shadow-sm">
          <h2 className="text-base font-bold text-foreground mb-5">Application Trends</h2>
          <div className="flex items-end gap-3 h-[200px]">
            {monthlyData.map((d: any) => (
              <div key={d.month} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full space-y-0.5 flex flex-col justify-end h-full">
                  <div 
                    className="w-full rounded-t-md bg-accent/20" 
                    style={{ height: `${(d.apps / maxApps) * 100}%` }} 
                  />
                  <div 
                    className="w-full rounded-b-md bg-accent" 
                    style={{ height: `${(d.approved / maxApps) * 100}%` }} 
                  />
                </div>
                <span className="text-[9px] text-muted-foreground">{d.month}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 rounded-3xl border border-border bg-card p-6 shadow-sm">
          <h2 className="text-base font-bold text-foreground mb-4">Collection Summary</h2>
          <div className="space-y-3">
            {monthlyData.map((d: any) => (
              <div key={d.month}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-foreground">{d.month}</span>
                  <span className="text-xs font-semibold text-foreground">
                    ₹{(d.collected / 100000).toFixed(1)}L
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full bg-accent"
                    style={{ width: `${Math.min((d.collected / 500000) * 100, 100)}%` }}
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