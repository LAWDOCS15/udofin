"use client"

import { useState, useEffect } from "react"
import { BarChart3, ArrowUpRight, ArrowDownRight, Loader2 } from "lucide-react"
import { DataExportButton } from "@/components/shared/data-export-button"
import { adminAPI } from "@/config/api/admin"
import { cn } from "@/lib/utils"

export function AdminReports() {
  const [isLoading, setIsLoading] = useState(true)
  const [trends, setTrends] = useState<any[]>([])
  const [nbfcs, setNbfcs] = useState<any[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dashRes = await adminAPI.getDashboardData()
        const nbfcRes = await adminAPI.getNbfcs()
        setTrends(dashRes.data?.data?.trends || [])
        setNbfcs(nbfcRes.data?.nbfcs || [])
      } catch (err) {
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  // CSV Export Logic
  const handleExportCSV = () => {
    const headers = "NBFC Name,Registration,Status\n";
    const csvData = nbfcs.map(n => `${n.name},${n.registrationNumber},${n.status}`).join('\n');
    const blob = new Blob([headers + csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'nbfc_report.csv';
    a.click();
  }

  if (isLoading) return <div className="py-20 flex justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>Reports & Analytics</h1>
        </div>
        <div onClick={handleExportCSV} className="cursor-pointer bg-accent text-accent-foreground px-4 py-2 rounded-xl text-xs font-semibold">
          Download CSV Report
        </div>
      </div>

      {/* NBFC Performance Table */}
      <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
        <h2 className="text-base font-bold text-foreground mb-4">NBFC Performance (Live)</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border">
                {["NBFC", "Registration", "Status", "Onboarded Date"].map((h) => (
                  <th key={h} className="px-4 py-3 text-[10px] font-bold uppercase text-muted-foreground">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {nbfcs.map((n) => (
                <tr key={n.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 text-xs font-semibold">{n.name}</td>
                  <td className="px-4 py-3 text-xs">{n.registrationNumber}</td>
                  <td className="px-4 py-3 text-xs">{n.status}</td>
                  <td className="px-4 py-3 text-xs">{n.onboardedAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}