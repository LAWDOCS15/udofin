// "use client"

// import { useState } from "react"
// import { Button } from "@/components/ui/button"
// import { SearchFilterBar } from "@/components/shared/search-filter-bar"
// import { LoanStatusBadge } from "@/components/shared/loan-status-badge"
// import { ConfirmationModal } from "@/components/shared/confirmation-modal"
// import { useToast } from "@/components/shared/simple-toast"
// import { cn } from "@/lib/utils"
// import { Plus, Building2, Eye, Settings, Trash2, X, Loader2 } from "lucide-react"
// import type { NBFCPartner } from "@/types"

// const DEMO_NBFCS: NBFCPartner[] = [
//   { id: "NBFC001", name: "QuickLend Finance", registrationNumber: "N-14.03456", status: "active", totalLoans: 342, totalDisbursed: 85000000, region: "North India", adminEmail: "admin@quicklend.in", onboardedAt: "2025-06-15" },
//   { id: "NBFC002", name: "TrustCapital Pvt Ltd", registrationNumber: "N-14.07891", status: "active", totalLoans: 198, totalDisbursed: 52000000, region: "West India", adminEmail: "admin@trustcapital.in", onboardedAt: "2025-08-20" },
//   { id: "NBFC003", name: "EasyFin Solutions", registrationNumber: "N-14.01234", status: "suspended", totalLoans: 87, totalDisbursed: 15000000, region: "South India", adminEmail: "admin@easyfin.in", onboardedAt: "2025-10-01" },
//   { id: "NBFC004", name: "PrimeLoan Corp", registrationNumber: "N-14.05678", status: "active", totalLoans: 450, totalDisbursed: 120000000, region: "Pan India", adminEmail: "admin@primeloan.in", onboardedAt: "2025-04-10" },
// ]

// const FILTERS = ["All", "Active", "Suspended"]

// export function AdminNbfcManagement() {
//   const { showToast } = useToast()
//   const [search, setSearch] = useState("")
//   const [filter, setFilter] = useState("All")
//   const [showModal, setShowModal] = useState(false)
//   const [deleteNbfc, setDeleteNbfc] = useState<NBFCPartner | null>(null)
//   const [isSubmitting, setIsSubmitting] = useState(false)
//   const [form, setForm] = useState({ nbfcName: "", registrationNumber: "", adminName: "", adminEmail: "", adminPassword: "" })

//   const filtered = DEMO_NBFCS.filter((n) => {
//     const matchSearch = n.name.toLowerCase().includes(search.toLowerCase()) || n.registrationNumber.toLowerCase().includes(search.toLowerCase())
//     if (filter === "Active") return matchSearch && n.status === "active"
//     if (filter === "Suspended") return matchSearch && n.status === "suspended"
//     return matchSearch
//   })

//   const handleCreate = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setIsSubmitting(true)
//     try {
//       const nbfcRes = await fetch("http://localhost:5000/api/admin/create-nbfc", {
//         method: "POST", headers: { "Content-Type": "application/json" }, credentials: "include",
//         body: JSON.stringify({ name: form.nbfcName, registrationNumber: form.registrationNumber }),
//       })
//       const nbfcData = await nbfcRes.json()
//       if (!nbfcRes.ok) throw new Error(nbfcData.message || "Failed to create NBFC")

//       const adminRes = await fetch("http://localhost:5000/api/admin/create-nbfc-admin", {
//         method: "POST", headers: { "Content-Type": "application/json" }, credentials: "include",
//         body: JSON.stringify({ name: form.adminName, email: form.adminEmail, password: form.adminPassword, nbfcId: nbfcData.nbfc._id }),
//       })
//       const adminData = await adminRes.json()
//       if (!adminRes.ok) throw new Error(adminData.message || "Failed to create Admin")

//       showToast("NBFC Partner and Admin created successfully!", "success")
//       setShowModal(false)
//       setForm({ nbfcName: "", registrationNumber: "", adminName: "", adminEmail: "", adminPassword: "" })
//     } catch (err: any) {
//       showToast(err.message, "error")
//     } finally {
//       setIsSubmitting(false)
//     }
//   }

//   const inputClass = "h-10 w-full rounded-xl border border-border bg-secondary/30 px-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/30 transition-colors"
//   const labelClass = "text-[11px] font-semibold text-muted-foreground mb-1.5 block"

//   return (
//     <div className="p-6 lg:p-8 space-y-6">
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>NBFC Partners</h1>
//           <p className="text-xs text-muted-foreground mt-1">Manage registered NBFC partners</p>
//         </div>
//         <Button onClick={() => setShowModal(true)} className="h-9 gap-2 rounded-full bg-accent text-accent-foreground hover:bg-accent/90 text-xs font-semibold shadow-lg shadow-accent/20">
//           <Plus className="h-3.5 w-3.5" /> Add NBFC Partner
//         </Button>
//       </div>

//       <SearchFilterBar search={search} onSearchChange={setSearch} filters={FILTERS} activeFilter={filter} onFilterChange={setFilter} />

//       {/* NBFC Cards */}
//       <div className="grid gap-4 sm:grid-cols-2">
//         {filtered.map((nbfc) => (
//           <div key={nbfc.id} className="rounded-2xl border border-border bg-card p-5 hover:border-accent/20 transition-all">
//             <div className="flex items-center justify-between mb-3">
//               <div className="flex items-center gap-3">
//                 <div className="h-10 w-10 rounded-xl bg-accent/10 flex items-center justify-center">
//                   <Building2 className="h-5 w-5 text-accent" />
//                 </div>
//                 <div>
//                   <p className="text-sm font-bold text-foreground">{nbfc.name}</p>
//                   <p className="text-[10px] text-muted-foreground font-mono">{nbfc.registrationNumber}</p>
//                 </div>
//               </div>
//               <LoanStatusBadge status={nbfc.status} />
//             </div>
//             <div className="grid grid-cols-3 gap-3 mb-4">
//               <div className="text-center p-2 rounded-xl bg-secondary/30">
//                 <p className="text-[10px] text-muted-foreground">Loans</p>
//                 <p className="text-sm font-bold text-foreground">{nbfc.totalLoans}</p>
//               </div>
//               <div className="text-center p-2 rounded-xl bg-secondary/30">
//                 <p className="text-[10px] text-muted-foreground">Disbursed</p>
//                 <p className="text-sm font-bold text-foreground">₹{(nbfc.totalDisbursed / 10000000).toFixed(1)}Cr</p>
//               </div>
//               <div className="text-center p-2 rounded-xl bg-secondary/30">
//                 <p className="text-[10px] text-muted-foreground">Region</p>
//                 <p className="text-xs font-medium text-foreground">{nbfc.region}</p>
//               </div>
//             </div>
//             <div className="flex items-center justify-between text-[10px] text-muted-foreground border-t border-border pt-3">
//               <span>Admin: {nbfc.adminEmail}</span>
//               <div className="flex items-center gap-1">
//                 <button className="h-7 w-7 rounded-lg hover:bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground"><Eye className="h-3.5 w-3.5" /></button>
//                 <button className="h-7 w-7 rounded-lg hover:bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground"><Settings className="h-3.5 w-3.5" /></button>
//                 <button onClick={() => setDeleteNbfc(nbfc)} className="h-7 w-7 rounded-lg hover:bg-destructive/10 flex items-center justify-center text-muted-foreground hover:text-destructive"><Trash2 className="h-3.5 w-3.5" /></button>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Add NBFC Modal */}
//       {showModal && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
//           <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setShowModal(false)} />
//           <div className="relative w-full max-w-md rounded-3xl border border-border bg-card shadow-2xl p-6 animate-in fade-in zoom-in-95 duration-200">
//             <div className="flex items-center justify-between mb-5">
//               <h3 className="text-lg font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>Add NBFC Partner</h3>
//               <button onClick={() => setShowModal(false)} className="text-muted-foreground hover:text-foreground"><X className="h-4 w-4" /></button>
//             </div>
//             <form onSubmit={handleCreate} className="space-y-4">
//               <div className="border-b border-border pb-4 space-y-3">
//                 <p className="text-xs font-bold text-accent">NBFC Details</p>
//                 <div><label className={labelClass}>Company Name *</label><input required value={form.nbfcName} onChange={(e) => setForm({ ...form, nbfcName: e.target.value })} placeholder="NBFC company name" className={inputClass} /></div>
//                 <div><label className={labelClass}>Registration Number *</label><input required value={form.registrationNumber} onChange={(e) => setForm({ ...form, registrationNumber: e.target.value })} placeholder="N-14.XXXXX" className={inputClass} /></div>
//               </div>
//               <div className="space-y-3">
//                 <p className="text-xs font-bold text-accent">Admin Account</p>
//                 <div><label className={labelClass}>Admin Name *</label><input required value={form.adminName} onChange={(e) => setForm({ ...form, adminName: e.target.value })} placeholder="Full name" className={inputClass} /></div>
//                 <div><label className={labelClass}>Email *</label><input required type="email" value={form.adminEmail} onChange={(e) => setForm({ ...form, adminEmail: e.target.value })} placeholder="admin@nbfc.com" className={inputClass} /></div>
//                 <div><label className={labelClass}>Password *</label><input required type="password" value={form.adminPassword} onChange={(e) => setForm({ ...form, adminPassword: e.target.value })} placeholder="Min 8 characters" className={inputClass} /></div>
//               </div>
//               <div className="flex justify-end gap-3 pt-2">
//                 <button type="button" onClick={() => setShowModal(false)} className="h-9 px-4 rounded-xl text-xs text-muted-foreground hover:bg-secondary">Cancel</button>
//                 <Button type="submit" disabled={isSubmitting} className="h-9 rounded-xl bg-accent text-accent-foreground hover:bg-accent/90 text-xs font-semibold gap-2">
//                   {isSubmitting ? <><Loader2 className="h-3 w-3 animate-spin" /> Creating...</> : <><Plus className="h-3 w-3" /> Create Partner</>}
//                 </Button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {deleteNbfc && (
//         <ConfirmationModal open onClose={() => setDeleteNbfc(null)} onConfirm={() => setDeleteNbfc(null)}
//           title="Remove NBFC Partner" description={`Remove ${deleteNbfc.name}? This will disable all their operations on the platform.`}
//           confirmText="Remove" danger
//         />
//       )}
//     </div>
//   )
// }



"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { SearchFilterBar } from "@/components/shared/search-filter-bar";
import { LoanStatusBadge } from "@/components/shared/loan-status-badge";
import { ConfirmationModal } from "@/components/shared/confirmation-modal";
import { useToast } from "@/hooks/use-toast"; // ✅ Fixed toast import
import { adminAPI } from "@/config/api"; // ✅ Using centralized API
import { cn } from "@/lib/utils";
import {
  Plus,
  Building2,
  Eye,
  Settings,
  Trash2,
  X,
  Loader2,
  UserPlus,
} from "lucide-react";
// Updated Interface to match dynamic data
interface NBFCPartner {
  id: string;
  name: string;
  registrationNumber: string;
  status: "active" | "suspended" | string;
  totalLoans: number;
  totalDisbursed: number;
  region: string;
  adminEmail: string;
  onboardedAt: string;
}

const FILTERS = ["All", "Active", "Suspended"];

export function AdminNbfcManagement() {
  const { toast } = useToast(); // ✅ Fixed hook usage
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [deleteNbfc, setDeleteNbfc] = useState<NBFCPartner | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Real data state instead of DEMO_NBFCS
  const [nbfcs, setNbfcs] = useState<NBFCPartner[]>([]);

  const [form, setForm] = useState({
    nbfcName: "",
    registrationNumber: "",
    adminName: "",
    adminEmail: "",
    adminPassword: "",
  });

  // ✅ Fetch real NBFC data on load
  const fetchNbfcs = async () => {
    setIsLoading(true);
    try {
      const response = await adminAPI.getNbfcs();
      if (response.data?.nbfcs) {
        setNbfcs(response.data.nbfcs);
      }
    } catch (err: any) {
      toast({
        title: "Warning",
        description: "Failed to load NBFCs or using local demo data.",
        variant: "destructive",
      });
      // Fallback if backend route isn't ready yet
      setNbfcs([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNbfcs();
  }, []);

  const filtered = nbfcs.filter((n) => {
    const matchSearch =
      n.name.toLowerCase().includes(search.toLowerCase()) ||
      n.registrationNumber.toLowerCase().includes(search.toLowerCase());
    if (filter === "Active") return matchSearch && n.status === "active";
    if (filter === "Suspended") return matchSearch && n.status === "suspended";
    return matchSearch;
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // ✅ Using centralized adminAPI
      const nbfcRes = await adminAPI.createNbfc({
        name: form.nbfcName,
        registrationNumber: form.registrationNumber,
      });

      await adminAPI.createNbfcAdmin({
        name: form.adminName,
        email: form.adminEmail,
        password: form.adminPassword,
        nbfcId: nbfcRes.data.nbfcId || nbfcRes.data.nbfc?._id,
      });

      toast({
        title: "Success",
        description: "NBFC Partner and Admin created successfully!",
      }); // ✅ Correct toast
      setShowModal(false);
      setForm({
        nbfcName: "",
        registrationNumber: "",
        adminName: "",
        adminEmail: "",
        adminPassword: "",
      });

      // Refresh list after creation
      fetchNbfcs();
    } catch (err: any) {
      toast({
        title: "Error",
        description:
          err.response?.data?.message ||
          err.message ||
          "Failed to create partner",
        variant: "destructive",
      }); // ✅ Correct toast
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass =
    "h-10 w-full rounded-xl border border-border bg-secondary/30 px-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/30 transition-colors";
  const labelClass =
    "text-[11px] font-semibold text-muted-foreground mb-1.5 block";

  return (
    <div className="p-6 lg:p-8 space-y-6 relative">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1
            className="text-2xl font-bold text-foreground"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            NBFC Partners
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Manage registered NBFC partners
          </p>
        </div>
        <Button
          onClick={() => setShowModal(true)}
          className="h-9 gap-2 rounded-full bg-accent text-accent-foreground hover:bg-accent/90 text-xs font-semibold shadow-lg shadow-accent/20"
        >
          <Plus className="h-3.5 w-3.5" /> Add NBFC Partner
        </Button>
      </div>

      <SearchFilterBar
        search={search}
        onSearchChange={setSearch}
        filters={FILTERS}
        activeFilter={filter}
        onFilterChange={setFilter}
      />

      {/* Loading State */}
      {isLoading ? (
        <div className="py-12 flex justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        /* NBFC Cards */
        <div className="grid gap-4 sm:grid-cols-2">
          {filtered.length > 0 ? (
            filtered.map((nbfc) => (
              <div
                key={nbfc.id}
                className="rounded-2xl border border-border bg-card p-5 hover:border-accent/20 transition-all shadow-sm"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-accent/10 flex items-center justify-center">
                      <Building2 className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-foreground">
                        {nbfc.name}
                      </p>
                      <p className="text-[10px] text-muted-foreground font-mono">
                        {nbfc.registrationNumber}
                      </p>
                    </div>
                  </div>
                  <LoanStatusBadge status={nbfc.status} />
                </div>
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="text-center p-2 rounded-xl bg-secondary/30">
                    <p className="text-[10px] text-muted-foreground">Loans</p>
                    <p className="text-sm font-bold text-foreground">
                      {nbfc.totalLoans}
                    </p>
                  </div>
                  <div className="text-center p-2 rounded-xl bg-secondary/30">
                    <p className="text-[10px] text-muted-foreground">
                      Disbursed
                    </p>
                    <p className="text-sm font-bold text-foreground">
                      ₹{(nbfc.totalDisbursed / 100000).toFixed(1)}L
                    </p>
                  </div>
                  <div className="text-center p-2 rounded-xl bg-secondary/30">
                    <p className="text-[10px] text-muted-foreground">Region</p>
                    <p className="text-xs font-medium text-foreground">
                      {nbfc.region}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between text-[10px] text-muted-foreground border-t border-border pt-3">
                  <span>Admin: {nbfc.adminEmail}</span>
                  <div className="flex items-center gap-1">
                    <button className="h-7 w-7 rounded-lg hover:bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground">
                      <Eye className="h-3.5 w-3.5" />
                    </button>
                    <button className="h-7 w-7 rounded-lg hover:bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground">
                      <Settings className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => setDeleteNbfc(nbfc)}
                      className="h-7 w-7 rounded-lg hover:bg-destructive/10 flex items-center justify-center text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-12 text-center text-sm text-muted-foreground">
              No NBFC partners found.
            </div>
          )}
        </div>
      )}

      {/* Add NBFC Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          />
          <div className="relative w-full max-w-md rounded-3xl border border-border bg-card shadow-2xl p-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-5">
              <h3
                className="text-lg font-bold text-foreground"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Add NBFC Partner
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-muted-foreground hover:text-foreground bg-secondary p-1.5 rounded-full"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="border-b border-border pb-4 space-y-3">
                <p className="text-xs font-bold text-accent flex items-center gap-1.5">
                  <Building2 className="h-3.5 w-3.5" /> NBFC Details
                </p>
                <div>
                  <label className={labelClass}>Company Name *</label>
                  <input
                    required
                    value={form.nbfcName}
                    onChange={(e) =>
                      setForm({ ...form, nbfcName: e.target.value })
                    }
                    placeholder="NBFC company name"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Registration Number *</label>
                  <input
                    required
                    value={form.registrationNumber}
                    onChange={(e) =>
                      setForm({ ...form, registrationNumber: e.target.value })
                    }
                    placeholder="N-14.XXXXX"
                    className={inputClass}
                  />
                </div>
              </div>
              <div className="space-y-3">
                <p className="text-xs font-bold text-accent flex items-center gap-1.5">
                  <UserPlus className="h-3.5 w-3.5" /> Admin Account
                </p>
                <div>
                  <label className={labelClass}>Admin Name *</label>
                  <input
                    required
                    value={form.adminName}
                    onChange={(e) =>
                      setForm({ ...form, adminName: e.target.value })
                    }
                    placeholder="Full name"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Email *</label>
                  <input
                    required
                    type="email"
                    value={form.adminEmail}
                    onChange={(e) =>
                      setForm({ ...form, adminEmail: e.target.value })
                    }
                    placeholder="admin@nbfc.com"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Password *</label>
                  <input
                    required
                    type="password"
                    minLength={8}
                    value={form.adminPassword}
                    onChange={(e) =>
                      setForm({ ...form, adminPassword: e.target.value })
                    }
                    placeholder="Min 8 characters"
                    className={inputClass}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="h-9 px-4 rounded-xl text-xs text-muted-foreground hover:bg-secondary"
                >
                  Cancel
                </button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-9 rounded-xl bg-accent text-accent-foreground hover:bg-accent/90 text-xs font-semibold gap-2 min-w-[120px]"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-3 w-3 animate-spin" /> Creating...
                    </>
                  ) : (
                    <>
                      <Plus className="h-3 w-3" /> Create Partner
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteNbfc && (
        <ConfirmationModal
          open
          onClose={() => setDeleteNbfc(null)}
          onConfirm={() => setDeleteNbfc(null)}
          title="Remove NBFC Partner"
          description={`Remove ${deleteNbfc.name}? This will disable all their operations on the platform.`}
          confirmText="Remove"
          danger
        />
      )}
    </div>
  );
}
