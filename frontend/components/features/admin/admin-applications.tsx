// "use client"

// import { useState } from "react"
// import { Button } from "@/components/ui/button"
// import { SearchFilterBar } from "@/components/shared/search-filter-bar"
// import { LoanStatusBadge } from "@/components/shared/loan-status-badge"
// import { ConfirmationModal } from "@/components/shared/confirmation-modal"
// import { cn } from "@/lib/utils"
// import {
//   ArrowLeft, Eye, CheckCircle2, XCircle, Download, ChevronLeft, ChevronRight,
//   Star, Mail, Phone, MapPin, Building2, CreditCard, FileText, Shield,
//   IndianRupee, CalendarDays, Briefcase, UserCheck, AlertCircle, Clock,
// } from "lucide-react"

// // ─── Extended Application type ──────────────────────────────────────────────

// interface ExtendedApplication {
//   id: string
//   applicantName: string
//   email: string
//   phone: string
//   dob: string
//   address: string
//   panNumber: string
//   aadhaarNumber: string
//   amount: number
//   status: "pending" | "approved" | "rejected" | "disbursed" | "under-review"
//   rate: number
//   tenure: number
//   appliedDate: string
//   cibil: number
//   kycVerified: boolean
//   // Employment / Company
//   employmentType: string
//   companyName: string
//   designation: string
//   monthlyIncome: number
//   workExperience: string
//   // Loan history
//   previousLoans: number
//   previousDefaults: number
//   // Documents
//   documents: {
//     name: string
//     type: string
//     status: "verified" | "pending" | "rejected"
//     uploadedAt: string
//   }[]
//   // Admin rating (null = not rated yet)
//   adminRating: number | null
//   adminNotes: string
// }

// // ─── Demo Data ──────────────────────────────────────────────────────────────

// const INITIAL_APPS: ExtendedApplication[] = [
//   {
//     id: "APP001", applicantName: "Virendra Singh", email: "virendra@email.com", phone: "+91 98765 43210",
//     dob: "1992-04-15", address: "42 Sector 15, Noida, UP 201301", panNumber: "ABCPS1234K", aadhaarNumber: "XXXX-XXXX-4532",
//     amount: 800000, status: "approved", rate: 10.5, tenure: 36, appliedDate: "2026-02-15", cibil: 758, kycVerified: true,
//     employmentType: "Salaried", companyName: "TCS Limited", designation: "Senior Developer", monthlyIncome: 95000, workExperience: "6 years",
//     previousLoans: 1, previousDefaults: 0,
//     documents: [
//       { name: "PAN Card", type: "identity", status: "verified", uploadedAt: "2026-02-15" },
//       { name: "Aadhaar Card", type: "identity", status: "verified", uploadedAt: "2026-02-15" },
//       { name: "Salary Slips (3 months)", type: "income", status: "verified", uploadedAt: "2026-02-15" },
//       { name: "Bank Statement (6 months)", type: "financial", status: "verified", uploadedAt: "2026-02-15" },
//       { name: "Address Proof", type: "address", status: "verified", uploadedAt: "2026-02-15" },
//     ],
//     adminRating: 4, adminNotes: "Strong profile. Good CIBIL, stable income.",
//   },
//   {
//     id: "APP002", applicantName: "Priya Sharma", email: "priya@email.com", phone: "+91 87654 32109",
//     dob: "1995-06-20", address: "123 HSR Layout, Bangalore, KA 560102", panNumber: "DEFPS5678L", aadhaarNumber: "XXXX-XXXX-7821",
//     amount: 500000, status: "pending", rate: 11.25, tenure: 24, appliedDate: "2026-02-14", cibil: 745, kycVerified: true,
//     employmentType: "Salaried", companyName: "Infosys Ltd", designation: "Software Engineer", monthlyIncome: 75000, workExperience: "4 years",
//     previousLoans: 0, previousDefaults: 0,
//     documents: [
//       { name: "PAN Card", type: "identity", status: "verified", uploadedAt: "2026-02-14" },
//       { name: "Aadhaar Card", type: "identity", status: "verified", uploadedAt: "2026-02-14" },
//       { name: "Salary Slips (3 months)", type: "income", status: "verified", uploadedAt: "2026-02-14" },
//       { name: "Bank Statement (6 months)", type: "financial", status: "pending", uploadedAt: "2026-02-14" },
//       { name: "Address Proof", type: "address", status: "verified", uploadedAt: "2026-02-14" },
//     ],
//     adminRating: null, adminNotes: "",
//   },
//   {
//     id: "APP003", applicantName: "Rajesh Kumar", email: "rajesh@email.com", phone: "+91 76543 21098",
//     dob: "1988-09-05", address: "56 Civil Lines, Jaipur, RJ 302001", panNumber: "JKLPS3456N", aadhaarNumber: "XXXX-XXXX-9347",
//     amount: 1000000, status: "disbursed", rate: 9.75, tenure: 48, appliedDate: "2026-02-12", cibil: 780, kycVerified: true,
//     employmentType: "Salaried", companyName: "Wipro Technologies", designation: "Project Manager", monthlyIncome: 140000, workExperience: "10 years",
//     previousLoans: 2, previousDefaults: 0,
//     documents: [
//       { name: "PAN Card", type: "identity", status: "verified", uploadedAt: "2026-02-12" },
//       { name: "Aadhaar Card", type: "identity", status: "verified", uploadedAt: "2026-02-12" },
//       { name: "Salary Slips (3 months)", type: "income", status: "verified", uploadedAt: "2026-02-12" },
//       { name: "Bank Statement (6 months)", type: "financial", status: "verified", uploadedAt: "2026-02-12" },
//       { name: "Address Proof", type: "address", status: "verified", uploadedAt: "2026-02-12" },
//       { name: "Passport Photo", type: "photo", status: "verified", uploadedAt: "2026-02-12" },
//     ],
//     adminRating: 5, adminNotes: "Excellent profile. High income, great CIBIL, no defaults.",
//   },
//   {
//     id: "APP004", applicantName: "Anjali Patel", email: "anjali@email.com", phone: "+91 65432 10987",
//     dob: "1997-03-18", address: "15 Bandra West, Mumbai, MH 400050", panNumber: "PQRPS1122R", aadhaarNumber: "XXXX-XXXX-5614",
//     amount: 600000, status: "pending", rate: 11.5, tenure: 36, appliedDate: "2026-02-10", cibil: 720, kycVerified: true,
//     employmentType: "Salaried", companyName: "Accenture India", designation: "Analyst", monthlyIncome: 55000, workExperience: "2 years",
//     previousLoans: 0, previousDefaults: 0,
//     documents: [
//       { name: "PAN Card", type: "identity", status: "verified", uploadedAt: "2026-02-10" },
//       { name: "Aadhaar Card", type: "identity", status: "verified", uploadedAt: "2026-02-10" },
//       { name: "Salary Slips (3 months)", type: "income", status: "pending", uploadedAt: "2026-02-10" },
//       { name: "Bank Statement (6 months)", type: "financial", status: "pending", uploadedAt: "2026-02-10" },
//       { name: "Address Proof", type: "address", status: "verified", uploadedAt: "2026-02-10" },
//     ],
//     adminRating: null, adminNotes: "",
//   },
//   {
//     id: "APP005", applicantName: "Arjun Verma", email: "arjun@email.com", phone: "+91 54321 09876",
//     dob: "1990-01-10", address: "78 MG Road, Pune, MH 411001", panNumber: "GHIPS9012M", aadhaarNumber: "XXXX-XXXX-3156",
//     amount: 450000, status: "rejected", rate: 12.0, tenure: 24, appliedDate: "2026-02-08", cibil: 680, kycVerified: false,
//     employmentType: "Self-Employed", companyName: "Verma Traders Pvt Ltd", designation: "Director", monthlyIncome: 120000, workExperience: "8 years",
//     previousLoans: 1, previousDefaults: 1,
//     documents: [
//       { name: "PAN Card", type: "identity", status: "verified", uploadedAt: "2026-02-08" },
//       { name: "Aadhaar Card", type: "identity", status: "rejected", uploadedAt: "2026-02-08" },
//       { name: "ITR (2 years)", type: "income", status: "verified", uploadedAt: "2026-02-08" },
//       { name: "Bank Statement (6 months)", type: "financial", status: "verified", uploadedAt: "2026-02-08" },
//       { name: "Business Registration", type: "business", status: "pending", uploadedAt: "2026-02-08" },
//     ],
//     adminRating: 2, adminNotes: "Low CIBIL, previous default, KYC incomplete.",
//   },
//   {
//     id: "APP006", applicantName: "Meera Joshi", email: "meera@email.com", phone: "+91 43210 98765",
//     dob: "1993-12-25", address: "90 Anna Nagar, Chennai, TN 600040", panNumber: "MNOPS7890P", aadhaarNumber: "XXXX-XXXX-6278",
//     amount: 700000, status: "pending", rate: 10.8, tenure: 36, appliedDate: "2026-02-07", cibil: 760, kycVerified: true,
//     employmentType: "Salaried", companyName: "HCL Technologies", designation: "QA Lead", monthlyIncome: 85000, workExperience: "5 years",
//     previousLoans: 0, previousDefaults: 0,
//     documents: [
//       { name: "PAN Card", type: "identity", status: "verified", uploadedAt: "2026-02-07" },
//       { name: "Aadhaar Card", type: "identity", status: "verified", uploadedAt: "2026-02-07" },
//       { name: "Salary Slips (3 months)", type: "income", status: "verified", uploadedAt: "2026-02-07" },
//       { name: "Bank Statement (6 months)", type: "financial", status: "verified", uploadedAt: "2026-02-07" },
//       { name: "Address Proof", type: "address", status: "verified", uploadedAt: "2026-02-07" },
//       { name: "Passport Photo", type: "photo", status: "verified", uploadedAt: "2026-02-07" },
//     ],
//     adminRating: null, adminNotes: "",
//   },
//   {
//     id: "APP007", applicantName: "Sanjay Gupta", email: "sanjay@email.com", phone: "+91 32109 87654",
//     dob: "1985-07-14", address: "22 Connaught Place, New Delhi, DL 110001", panNumber: "STUPS4455S", aadhaarNumber: "XXXX-XXXX-8901",
//     amount: 350000, status: "approved", rate: 11.0, tenure: 24, appliedDate: "2026-02-05", cibil: 735, kycVerified: true,
//     employmentType: "Salaried", companyName: "Deloitte India", designation: "Senior Consultant", monthlyIncome: 110000, workExperience: "12 years",
//     previousLoans: 3, previousDefaults: 0,
//     documents: [
//       { name: "PAN Card", type: "identity", status: "verified", uploadedAt: "2026-02-05" },
//       { name: "Aadhaar Card", type: "identity", status: "verified", uploadedAt: "2026-02-05" },
//       { name: "Salary Slips (3 months)", type: "income", status: "verified", uploadedAt: "2026-02-05" },
//       { name: "Bank Statement (6 months)", type: "financial", status: "verified", uploadedAt: "2026-02-05" },
//       { name: "Address Proof", type: "address", status: "verified", uploadedAt: "2026-02-05" },
//     ],
//     adminRating: 4, adminNotes: "Experienced professional, good track record.",
//   },
//   {
//     id: "APP008", applicantName: "Nisha Reddy", email: "nisha@email.com", phone: "+91 21098 76543",
//     dob: "1994-11-02", address: "48 Jubilee Hills, Hyderabad, TS 500033", panNumber: "UVWPS6677T", aadhaarNumber: "XXXX-XXXX-2345",
//     amount: 900000, status: "under-review", rate: 10.25, tenure: 48, appliedDate: "2026-02-03", cibil: 770, kycVerified: true,
//     employmentType: "Salaried", companyName: "Microsoft India", designation: "Product Manager", monthlyIncome: 160000, workExperience: "7 years",
//     previousLoans: 1, previousDefaults: 0,
//     documents: [
//       { name: "PAN Card", type: "identity", status: "verified", uploadedAt: "2026-02-03" },
//       { name: "Aadhaar Card", type: "identity", status: "verified", uploadedAt: "2026-02-03" },
//       { name: "Salary Slips (3 months)", type: "income", status: "verified", uploadedAt: "2026-02-03" },
//       { name: "Bank Statement (6 months)", type: "financial", status: "verified", uploadedAt: "2026-02-03" },
//       { name: "Address Proof", type: "address", status: "verified", uploadedAt: "2026-02-03" },
//       { name: "Passport Photo", type: "photo", status: "verified", uploadedAt: "2026-02-03" },
//     ],
//     adminRating: null, adminNotes: "",
//   },
// ]

// const FILTERS = ["All", "Pending", "Under Review", "Approved", "Rejected", "Disbursed"]

// const fmtDate = (d: string) =>
//   new Date(d + "T00:00:00").toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })

// // ─── Star Rating Component ──────────────────────────────────────────────────

// function StarRating({
//   value,
//   onChange,
//   readonly = false,
// }: {
//   value: number | null
//   onChange?: (v: number) => void
//   readonly?: boolean
// }) {
//   const [hover, setHover] = useState(0)
//   return (
//     <div className="flex items-center gap-0.5">
//       {[1, 2, 3, 4, 5].map((star) => (
//         <button
//           key={star}
//           type="button"
//           disabled={readonly}
//           onClick={() => onChange?.(star)}
//           onMouseEnter={() => !readonly && setHover(star)}
//           onMouseLeave={() => !readonly && setHover(0)}
//           className={cn(
//             "transition-colors",
//             readonly ? "cursor-default" : "cursor-pointer hover:scale-110 transition-transform",
//           )}
//         >
//           <Star
//             className={cn(
//               "h-5 w-5",
//               (hover || value || 0) >= star
//                 ? "fill-yellow-400 text-yellow-400"
//                 : "fill-none text-muted-foreground/40",
//             )}
//           />
//         </button>
//       ))}
//       {value && (
//         <span className="ml-1.5 text-xs font-bold text-foreground">{value}/5</span>
//       )}
//     </div>
//   )
// }

// // ─── Application Detail View ────────────────────────────────────────────────

// function ApplicationDetailView({
//   app,
//   onBack,
//   onRate,
//   onNotesChange,
//   onAction,
// }: {
//   app: ExtendedApplication
//   onBack: () => void
//   onRate: (rating: number) => void
//   onNotesChange: (notes: string) => void
//   onAction: (action: "approve" | "reject") => void
// }) {
//   const emi = Math.round((app.amount * (app.rate / 1200) * Math.pow(1 + app.rate / 1200, app.tenure)) / (Math.pow(1 + app.rate / 1200, app.tenure) - 1))
//   const debtToIncome = ((emi / app.monthlyIncome) * 100).toFixed(1)

//   return (
//     <div className="p-6 lg:p-8 space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
//       <button onClick={onBack} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group">
//         <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" /> Back to Applications
//       </button>

//       {/* Header */}
//       <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
//         <div className="flex items-start justify-between flex-wrap gap-4">
//           <div className="flex items-center gap-4">
//             <div className="h-14 w-14 rounded-2xl bg-accent/10 flex items-center justify-center text-lg font-bold text-accent">
//               {app.applicantName.split(" ").map((n) => n[0]).join("")}
//             </div>
//             <div>
//               <div className="flex items-center gap-2">
//                 <h2 className="text-xl font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>{app.applicantName}</h2>
//                 <LoanStatusBadge status={app.status} />
//               </div>
//               <p className="text-xs text-muted-foreground mt-0.5">{app.id} &middot; Applied {fmtDate(app.appliedDate)}</p>
//             </div>
//           </div>
//           {(app.status === "pending" || app.status === "under-review") && (
//             <div className="flex items-center gap-2">
//               <Button onClick={() => onAction("approve")} className="h-8 gap-1.5 rounded-xl bg-accent text-accent-foreground hover:bg-accent/90 text-xs font-semibold">
//                 <CheckCircle2 className="h-3.5 w-3.5" /> Approve
//               </Button>
//               <Button onClick={() => onAction("reject")} variant="outline" className="h-8 gap-1.5 rounded-xl text-xs text-destructive border-destructive/30 hover:bg-destructive/5">
//                 <XCircle className="h-3.5 w-3.5" /> Reject
//               </Button>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Key Metrics Bar */}
//       <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
//         {[
//           { label: "Loan Amount", value: `₹${(app.amount / 100000).toFixed(1)}L`, color: "text-foreground" },
//           { label: "Interest Rate", value: `${app.rate}%`, color: "text-foreground" },
//           { label: "Tenure", value: `${app.tenure} months`, color: "text-foreground" },
//           { label: "EMI (est.)", value: `₹${emi.toLocaleString("en-IN")}`, color: "text-accent" },
//           { label: "Debt-to-Income", value: `${debtToIncome}%`, color: parseFloat(debtToIncome) > 50 ? "text-red-500" : "text-accent" },
//           { label: "CIBIL Score", value: String(app.cibil), color: app.cibil >= 750 ? "text-accent" : app.cibil >= 700 ? "text-yellow-500" : "text-red-500" },
//         ].map((m) => (
//           <div key={m.label} className="rounded-2xl border border-border bg-card p-4 text-center">
//             <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">{m.label}</p>
//             <p className={cn("text-lg font-bold mt-1", m.color)}>{m.value}</p>
//           </div>
//         ))}
//       </div>

//       <div className="grid gap-5 lg:grid-cols-2">
//         {/* Personal Details */}
//         <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
//           <h3 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2" style={{ fontFamily: "var(--font-heading)" }}>
//             <UserCheck className="h-4 w-4 text-accent" /> Applicant Details
//           </h3>
//           <div className="space-y-3">
//             {[
//               { icon: Mail, label: "Email", value: app.email },
//               { icon: Phone, label: "Phone", value: app.phone },
//               { icon: CalendarDays, label: "Date of Birth", value: fmtDate(app.dob) },
//               { icon: MapPin, label: "Address", value: app.address },
//               { icon: CreditCard, label: "PAN Number", value: app.panNumber },
//               { icon: CreditCard, label: "Aadhaar Number", value: app.aadhaarNumber },
//             ].map((item) => (
//               <div key={item.label} className="flex items-start gap-3 rounded-xl bg-secondary/30 px-4 py-2.5">
//                 <item.icon className="h-3.5 w-3.5 text-muted-foreground mt-0.5 shrink-0" />
//                 <div>
//                   <p className="text-[10px] text-muted-foreground">{item.label}</p>
//                   <p className="text-xs font-medium text-foreground">{item.value}</p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* KYC + Company Details */}
//         <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
//           <h3 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2" style={{ fontFamily: "var(--font-heading)" }}>
//             <Shield className="h-4 w-4 text-accent" /> KYC & Verification
//           </h3>
//           <div className="grid grid-cols-2 gap-3 mb-4">
//             <div className="rounded-xl bg-secondary/40 p-4 text-center">
//               <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">KYC Status</p>
//               <div className="mt-2">
//                 {app.kycVerified ? (
//                   <span className="inline-flex items-center gap-1 text-sm font-bold text-accent"><CheckCircle2 className="h-4 w-4" /> Verified</span>
//                 ) : (
//                   <span className="inline-flex items-center gap-1 text-sm font-bold text-yellow-500"><AlertCircle className="h-4 w-4" /> Pending</span>
//                 )}
//               </div>
//             </div>
//             <div className="rounded-xl bg-secondary/40 p-4 text-center">
//               <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Loan History</p>
//               <p className="text-sm font-bold text-foreground mt-2">{app.previousLoans} loan{app.previousLoans !== 1 ? "s" : ""}</p>
//               {app.previousDefaults > 0 && (
//                 <p className="text-[10px] text-red-500 font-semibold">{app.previousDefaults} default{app.previousDefaults !== 1 ? "s" : ""}</p>
//               )}
//             </div>
//           </div>

//           <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2 pt-3 border-t border-border" style={{ fontFamily: "var(--font-heading)" }}>
//             <Building2 className="h-4 w-4 text-accent" /> Company Details
//           </h3>
//           <div className="space-y-2.5">
//             {[
//               { label: "Employment Type", value: app.employmentType },
//               { label: "Company", value: app.companyName },
//               { label: "Designation", value: app.designation },
//               { label: "Monthly Income", value: `₹${app.monthlyIncome.toLocaleString("en-IN")}` },
//               { label: "Experience", value: app.workExperience },
//             ].map((item) => (
//               <div key={item.label} className="flex items-center justify-between rounded-xl bg-secondary/30 px-4 py-2.5">
//                 <span className="text-[10px] text-muted-foreground">{item.label}</span>
//                 <span className="text-xs font-semibold text-foreground">{item.value}</span>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Documents */}
//       <div className="rounded-3xl border border-border bg-card shadow-sm overflow-hidden">
//         <div className="px-6 py-4 border-b border-border flex items-center gap-2">
//           <FileText className="h-4 w-4 text-accent" />
//           <h3 className="text-sm font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>Documents</h3>
//         </div>
//         <div className="grid gap-3 p-5 sm:grid-cols-2 lg:grid-cols-3">
//           {app.documents.map((doc) => (
//             <div key={doc.name} className="rounded-xl border border-border bg-secondary/20 p-4 flex items-center justify-between">
//               <div className="flex items-center gap-3">
//                 <div className="h-9 w-9 rounded-lg bg-accent/10 flex items-center justify-center">
//                   <FileText className="h-4 w-4 text-accent" />
//                 </div>
//                 <div>
//                   <p className="text-xs font-semibold text-foreground">{doc.name}</p>
//                   <p className="text-[10px] text-muted-foreground">{fmtDate(doc.uploadedAt)}</p>
//                 </div>
//               </div>
//               <div className="flex items-center gap-2">
//                 <LoanStatusBadge status={doc.status} />
//                 <button title="View document" className="h-7 w-7 rounded-lg hover:bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground">
//                   <Eye className="h-3.5 w-3.5" />
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Admin Rating & Notes */}
//       <div className="rounded-3xl border border-accent/20 bg-accent/5 p-6 shadow-sm">
//         <h3 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2" style={{ fontFamily: "var(--font-heading)" }}>
//           <Star className="h-4 w-4 text-yellow-400" /> Admin Rating & Assessment
//         </h3>
//         <div className="space-y-4">
//           <div>
//             <p className="text-xs text-muted-foreground mb-2">Rate this applicant based on overall profile quality</p>
//             <StarRating value={app.adminRating} onChange={onRate} />
//           </div>
//           <div>
//             <label htmlFor={`notes-${app.id}`} className="text-xs text-muted-foreground mb-1.5 block">Admin Notes</label>
//             <textarea
//               id={`notes-${app.id}`}
//               value={app.adminNotes}
//               onChange={(e) => onNotesChange(e.target.value)}
//               placeholder="Add your assessment notes here..."
//               rows={3}
//               className="w-full rounded-xl border border-border bg-background px-4 py-3 text-xs text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-accent/30 resize-none"
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// // ─── Component ──────────────────────────────────────────────────────────────

// export function AdminApplications() {
//   const [apps, setApps] = useState<ExtendedApplication[]>(INITIAL_APPS)
//   const [search, setSearch] = useState("")
//   const [filter, setFilter] = useState("All")
//   const [selectedAppId, setSelectedAppId] = useState<string | null>(null)
//   const [action, setAction] = useState<"approve" | "reject" | null>(null)
//   const [page, setPage] = useState(1)

//   const selectedApp = apps.find((a) => a.id === selectedAppId) || null

//   const filtered = apps.filter((a) => {
//     const matchSearch = a.applicantName.toLowerCase().includes(search.toLowerCase()) || a.id.toLowerCase().includes(search.toLowerCase())
//     if (filter === "Pending") return matchSearch && a.status === "pending"
//     if (filter === "Under Review") return matchSearch && a.status === "under-review"
//     if (filter === "Approved") return matchSearch && a.status === "approved"
//     if (filter === "Rejected") return matchSearch && a.status === "rejected"
//     if (filter === "Disbursed") return matchSearch && a.status === "disbursed"
//     return matchSearch
//   })

//   const handleRate = (rating: number) => {
//     if (!selectedAppId) return
//     setApps((prev) => prev.map((a) => (a.id === selectedAppId ? { ...a, adminRating: rating } : a)))
//   }

//   const handleNotesChange = (notes: string) => {
//     if (!selectedAppId) return
//     setApps((prev) => prev.map((a) => (a.id === selectedAppId ? { ...a, adminNotes: notes } : a)))
//   }

//   // ── Detail View ──
//   if (selectedApp) {
//     return (
//       <ApplicationDetailView
//         app={selectedApp}
//         onBack={() => setSelectedAppId(null)}
//         onRate={handleRate}
//         onNotesChange={handleNotesChange}
//         onAction={setAction}
//       />
//     )
//   }

//   // ── Applications List ──
//   return (
//     <div className="p-6 lg:p-8 space-y-6">
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>Loan Applications</h1>
//           <p className="text-xs text-muted-foreground mt-1">{apps.length} total applications</p>
//         </div>
//         <Button variant="outline" className="h-9 gap-2 rounded-xl text-xs"><Download className="h-3.5 w-3.5" /> Export</Button>
//       </div>

//       <SearchFilterBar search={search} onSearchChange={setSearch} filters={FILTERS} activeFilter={filter} onFilterChange={setFilter} />

//       {/* Table */}
//       <div className="rounded-2xl border border-border bg-card overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="w-full text-left">
//             <thead>
//               <tr className="border-b border-border bg-secondary/30">
//                 {["ID", "Applicant", "Amount", "Rate", "CIBIL", "Rating", "Status", "Applied", "Actions"].map((h) => (
//                   <th key={h} className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{h}</th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody>
//               {filtered.map((app) => (
//                 <tr key={app.id} className="border-b border-border last:border-0 hover:bg-secondary/20 transition-colors cursor-pointer" onClick={() => setSelectedAppId(app.id)}>
//                   <td className="px-4 py-3 text-xs font-mono text-accent">{app.id}</td>
//                   <td className="px-4 py-3">
//                     <div>
//                       <p className="text-xs font-semibold text-foreground">{app.applicantName}</p>
//                       <p className="text-[10px] text-muted-foreground">{app.companyName}</p>
//                     </div>
//                   </td>
//                   <td className="px-4 py-3 text-xs text-foreground">₹{(app.amount / 100000).toFixed(1)}L</td>
//                   <td className="px-4 py-3 text-xs text-foreground">{app.rate}%</td>
//                   <td className="px-4 py-3">
//                     <span className={cn("text-xs font-semibold", app.cibil >= 750 ? "text-accent" : app.cibil >= 700 ? "text-yellow-500" : "text-red-500")}>
//                       {app.cibil}
//                     </span>
//                   </td>
//                   <td className="px-4 py-3">
//                     {app.adminRating ? (
//                       <div className="flex items-center gap-1">
//                         <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
//                         <span className="text-xs font-semibold text-foreground">{app.adminRating}/5</span>
//                       </div>
//                     ) : (
//                       <span className="text-[10px] text-muted-foreground">Not rated</span>
//                     )}
//                   </td>
//                   <td className="px-4 py-3"><LoanStatusBadge status={app.status} /></td>
//                   <td className="px-4 py-3 text-[10px] text-muted-foreground">{fmtDate(app.appliedDate)}</td>
//                   <td className="px-4 py-3">
//                     <button title="View details" onClick={(e) => { e.stopPropagation(); setSelectedAppId(app.id) }} className="h-7 w-7 rounded-lg hover:bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
//                       <Eye className="h-3.5 w-3.5" />
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//         {filtered.length === 0 && <div className="py-12 text-center text-sm text-muted-foreground">No applications found</div>}

//         {/* Pagination */}
//         <div className="flex items-center justify-between border-t border-border px-4 py-3">
//           <p className="text-[10px] text-muted-foreground">Showing {filtered.length} of {apps.length}</p>
//           <div className="flex items-center gap-1">
//             <button onClick={() => setPage(Math.max(1, page - 1))} className="h-7 w-7 rounded-lg hover:bg-secondary flex items-center justify-center text-muted-foreground"><ChevronLeft className="h-3.5 w-3.5" /></button>
//             <span className="h-7 w-7 rounded-lg bg-accent/10 text-accent flex items-center justify-center text-xs font-medium">{page}</span>
//             <button onClick={() => setPage(page + 1)} className="h-7 w-7 rounded-lg hover:bg-secondary flex items-center justify-center text-muted-foreground"><ChevronRight className="h-3.5 w-3.5" /></button>
//           </div>
//         </div>
//       </div>

//       {action && selectedApp && (
//         <ConfirmationModal
//           open
//           onClose={() => setAction(null)}
//           onConfirm={() => { setAction(null); setSelectedAppId(null) }}
//           title={action === "approve" ? "Approve Application" : "Reject Application"}
//           description={action === "approve"
//             ? `Approve loan application ${selectedApp.id} for ${selectedApp.applicantName}?`
//             : `Reject loan application ${selectedApp.id} for ${selectedApp.applicantName}? This action cannot be undone.`
//           }
//           confirmText={action === "approve" ? "Approve" : "Reject"}
//           danger={action === "reject"}
//         />
//       )}
//     </div>
//   )
// }



"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { SearchFilterBar } from "@/components/shared/search-filter-bar"
import { LoanStatusBadge } from "@/components/shared/loan-status-badge"
import { ConfirmationModal } from "@/components/shared/confirmation-modal"
import { cn } from "@/lib/utils"
import { adminAPI } from "@/config/api"
import { useToast } from "@/hooks/use-toast"
import {
  ArrowLeft, Eye, CheckCircle2, XCircle, Download, ChevronLeft, ChevronRight,
  Mail, Phone, MapPin, CreditCard, Loader2
} from "lucide-react"

export function AdminApplications() {
  const { toast } = useToast()
  const [apps, setApps] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState("All")
  const [selectedApp, setSelectedApp] = useState<any | null>(null)
  const [page, setPage] = useState(1)

  // ✅ Fetch Real Data from Backend
  useEffect(() => {
    const fetchApps = async () => {
      setIsLoading(true)
      try {
        const response = await adminAPI.getDashboardData()
        if (response.data && response.data.applications) {
          setApps(response.data.applications)
        }
      } catch (error) {
        console.error("Failed to load applications", error)
        toast({ title: "Error", description: "Failed to load live applications", variant: "destructive" })
      } finally {
        setIsLoading(false)
      }
    }
    fetchApps()
  }, [toast])

  const filtered = apps.filter((a) => {
    const matchSearch = a.applicantName?.toLowerCase().includes(search.toLowerCase()) || a.id?.toLowerCase().includes(search.toLowerCase())
    if (filter !== "All") return matchSearch && a.status === filter.toLowerCase()
    return matchSearch
  })

  // ── Detail View ──
  if (selectedApp) {
    return (
      <div className="p-6 lg:p-8 space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
        <button onClick={() => setSelectedApp(null)} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to Applications
        </button>

        <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-accent/10 flex items-center justify-center text-lg font-bold text-accent">
              {selectedApp.applicantName ? selectedApp.applicantName.substring(0, 2).toUpperCase() : "US"}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>{selectedApp.applicantName}</h2>
                <LoanStatusBadge status={selectedApp.status} />
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">{selectedApp.id} &middot; Applied {selectedApp.appliedDate}</p>
            </div>
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-sm font-bold text-foreground mb-4">Application Details</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between border-b border-border/50 pb-2"><span className="text-muted-foreground">Amount Requested</span><span className="font-bold">₹{(selectedApp.amount / 100000).toFixed(1)}L</span></div>
              <div className="flex justify-between border-b border-border/50 pb-2"><span className="text-muted-foreground">CIBIL Score</span><span className="font-bold text-accent">{selectedApp.cibil}</span></div>
              <div className="flex justify-between border-b border-border/50 pb-2"><span className="text-muted-foreground">Email</span><span className="font-medium">{selectedApp.email}</span></div>
              <div className="flex justify-between border-b border-border/50 pb-2"><span className="text-muted-foreground">Phone</span><span className="font-medium">{selectedApp.phone}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Assigned NBFC</span><span className="font-bold">{selectedApp.nbfcName}</span></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ── Applications List ──
  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>Loan Applications</h1>
          <p className="text-xs text-muted-foreground mt-1">Live tracking of all user applications</p>
        </div>
        <Button variant="outline" className="h-9 gap-2 rounded-xl text-xs"><Download className="h-3.5 w-3.5" /> Export</Button>
      </div>

      <SearchFilterBar search={search} onSearchChange={setSearch} filters={["All", "Pending", "Approved", "Rejected", "Disbursed"]} activeFilter={filter} onFilterChange={setFilter} />

      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border bg-secondary/30">
                {["ID", "Applicant", "Amount", "CIBIL", "NBFC", "Status", "Applied", "Actions"].map((h) => (
                  <th key={h} className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                 <tr><td colSpan={8} className="py-12 text-center"><Loader2 className="h-6 w-6 animate-spin text-accent mx-auto" /></td></tr>
              ) : filtered.length === 0 ? (
                 <tr><td colSpan={8} className="py-12 text-center text-sm text-muted-foreground">No applications found in database</td></tr>
              ) : (
                filtered.map((app) => (
                  <tr key={app.id} className="border-b border-border last:border-0 hover:bg-secondary/20 transition-colors cursor-pointer" onClick={() => setSelectedApp(app)}>
                    <td className="px-4 py-3 text-xs font-mono text-accent">{app.id}</td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-xs font-semibold text-foreground">{app.applicantName}</p>
                        <p className="text-[10px] text-muted-foreground">{app.email}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs font-semibold text-foreground">₹{(app.amount / 100000).toFixed(1)}L</td>
                    <td className="px-4 py-3"><span className="text-xs font-bold text-accent">{app.cibil}</span></td>
                    <td className="px-4 py-3 text-xs font-medium text-foreground">{app.nbfcName}</td>
                    <td className="px-4 py-3"><LoanStatusBadge status={app.status} /></td>
                    <td className="px-4 py-3 text-[10px] text-muted-foreground">{app.appliedDate}</td>
                    <td className="px-4 py-3">
                      <button title="View details" className="h-7 w-7 rounded-lg hover:bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
                        <Eye className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}