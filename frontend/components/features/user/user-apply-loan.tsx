// "use client"

// import { useState, useRef } from "react"
// import { Button } from "@/components/ui/button"
// import { cn } from "@/lib/utils"
// import { ArrowRight, ArrowLeft, Check, User, Briefcase, FileText, Building2, IndianRupee, Upload, AlertCircle, X } from "lucide-react"

// type Step = { id: number; title: string; icon: React.ReactNode }

// const STEPS: Step[] = [
//   { id: 1, title: "Loan Details", icon: <IndianRupee className="h-4 w-4" /> },
//   { id: 2, title: "Personal Info", icon: <User className="h-4 w-4" /> },
//   { id: 3, title: "Employment", icon: <Briefcase className="h-4 w-4" /> },
//   { id: 4, title: "Documents", icon: <FileText className="h-4 w-4" /> },
//   { id: 5, title: "Review", icon: <Check className="h-4 w-4" /> },
// ]

// const LOAN_TYPES = ["Personal Loan", "Business Loan", "Home Loan", "Education Loan", "Vehicle Loan"]

// const DOC_FIELDS = [
//   { key: "aadhaarFront", label: "Aadhaar Card (Front)", accept: "image/*,.pdf" },
//   { key: "aadhaarBack", label: "Aadhaar Card (Back)", accept: "image/*,.pdf" },
//   { key: "panCard", label: "PAN Card", accept: "image/*,.pdf" },
//   { key: "incomeCert", label: "Income Certificate / Salary Slip", accept: ".pdf,image/*" },
//   { key: "bankStatement", label: "Bank Statement (6 months)", accept: ".pdf" },
//   { key: "photo", label: "Passport Photo", accept: "image/*" },
// ] as const

// type DocKey = (typeof DOC_FIELDS)[number]["key"]

// type FormData = {
//   loanType: string; amount: string; tenure: string; purpose: string
//   fullName: string; dob: string; gender: string; pan: string; aadhaar: string; email: string; phone: string; address: string; city: string; state: string; pincode: string
//   employmentType: string; companyName: string; designation: string; monthlyIncome: string; experience: string; bankName: string; accountNumber: string; ifsc: string
//   documents: Record<DocKey, File | null>
// }

// const initialData: FormData = {
//   loanType: "", amount: "", tenure: "", purpose: "",
//   fullName: "", dob: "", gender: "", pan: "", aadhaar: "", email: "", phone: "", address: "", city: "", state: "", pincode: "",
//   employmentType: "", companyName: "", designation: "", monthlyIncome: "", experience: "", bankName: "", accountNumber: "", ifsc: "",
//   documents: { aadhaarFront: null, aadhaarBack: null, panCard: null, incomeCert: null, bankStatement: null, photo: null },
// }

// export function UserApplyLoan() {
//   const [step, setStep] = useState(1)
//   const [form, setForm] = useState<FormData>(initialData)
//   const [submitted, setSubmitted] = useState(false)
//   const [errors, setErrors] = useState<Record<string, string>>({})
//   const [shakeStep, setShakeStep] = useState(false)
//   const docInputRefs = useRef<Record<string, HTMLInputElement | null>>({})

//   const update = (field: string, value: string) => {
//     setForm((p) => ({ ...p, [field]: value }))
//     if (errors[field]) setErrors((prev) => { const n = { ...prev }; delete n[field]; return n })
//   }

//   const updateDoc = (key: DocKey, file: File | null) => {
//     setForm((p) => ({ ...p, documents: { ...p.documents, [key]: file } }))
//     if (errors[`documents.${key}`]) setErrors((prev) => { const n = { ...prev }; delete n[`documents.${key}`]; return n })
//   }

//   const validateStep = (s: number): boolean => {
//     const newErrors: Record<string, string> = {}
//     if (s === 1) {
//       if (!form.loanType) newErrors.loanType = "Select a loan type"
//       if (!form.amount || Number(form.amount) < 10000) newErrors.amount = "Min ₹10,000"
//       if (!form.tenure || Number(form.tenure) < 3) newErrors.tenure = "Min 3 months"
//     } else if (s === 2) {
//       if (!form.fullName.trim()) newErrors.fullName = "Name is required"
//       if (!form.dob) newErrors.dob = "Date of birth is required"
//       if (!form.gender) newErrors.gender = "Select gender"
//       if (!form.pan || !/^[A-Z]{5}\d{4}[A-Z]$/.test(form.pan.toUpperCase())) newErrors.pan = "Invalid PAN format"
//       if (!form.aadhaar || form.aadhaar.replace(/\s/g, "").length !== 12) newErrors.aadhaar = "Enter 12-digit Aadhaar"
//       if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = "Invalid email"
//       if (!form.phone || form.phone.replace(/\D/g, "").length < 10) newErrors.phone = "Invalid phone number"
//     } else if (s === 3) {
//       if (!form.employmentType) newErrors.employmentType = "Select employment type"
//       if (!form.monthlyIncome || Number(form.monthlyIncome) < 5000) newErrors.monthlyIncome = "Min ₹5,000"
//       if (!form.bankName.trim()) newErrors.bankName = "Bank name is required"
//       if (!form.accountNumber.trim()) newErrors.accountNumber = "Account number is required"
//       if (!form.ifsc.trim()) newErrors.ifsc = "IFSC code is required"
//     } else if (s === 4) {
//       const docs = form.documents
//       if (!docs.aadhaarFront || !docs.aadhaarBack) newErrors["documents.aadhaar"] = "Both sides of Aadhaar required"
//       if (!docs.panCard) newErrors["documents.panCard"] = "PAN card is required"
//     }
//     setErrors(newErrors)
//     if (Object.keys(newErrors).length > 0) {
//       setShakeStep(true)
//       setTimeout(() => setShakeStep(false), 600)
//       return false
//     }
//     return true
//   }

//   const handleNext = () => {
//     if (validateStep(step)) setStep((s) => s + 1)
//   }

//   const handleSubmit = () => {
//     if (validateStep(step)) setSubmitted(true)
//   }

//   const inputClass = "h-10 w-full rounded-xl border border-border bg-secondary/30 px-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/30 transition-colors"
//   const errorInputClass = "h-10 w-full rounded-xl border border-red-500/50 bg-red-500/5 px-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500/30 transition-colors"
//   const labelClass = "text-[11px] font-semibold text-muted-foreground mb-1.5 block"
//   const selectClass = cn(inputClass, "appearance-none cursor-pointer")
//   const errorSelectClass = cn(errorInputClass, "appearance-none cursor-pointer")
//   const FieldError = ({ field }: { field: string }) => errors[field] ? <p className="text-[10px] text-red-500 mt-1 animate-in fade-in slide-in-from-top-1 duration-150">{errors[field]}</p> : null

//   if (submitted) {
//     return (
//       <div className="min-h-[60vh] bg-background flex items-center justify-center">
//         <div className="text-center p-10 rounded-3xl border border-accent/20 bg-card animate-in fade-in zoom-in-95 duration-300 shadow-lg">
//           <div className="mx-auto mb-5 h-16 w-16 rounded-full bg-accent/10 flex items-center justify-center animate-in zoom-in duration-500">
//             <Check className="h-8 w-8 text-accent" />
//           </div>
//           <h2 className="text-xl font-bold text-foreground mb-2" style={{ fontFamily: "var(--font-heading)" }}>Application Submitted!</h2>
//           <p className="text-sm text-muted-foreground mb-6">Your loan application has been received. We'll review it within 24-48 hours.</p>
//           <Button onClick={() => { setStep(1); setForm(initialData); setSubmitted(false) }} className="rounded-full bg-accent text-accent-foreground hover:bg-accent/90 text-sm font-semibold px-6">
//             Apply for Another Loan
//           </Button>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen bg-background">
//       {/* Header */}
//       <div className="border-b border-border bg-card">
//         <div className="px-6 py-6 lg:px-8">
//           <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>Apply for a Loan</h1>
//           <p className="text-xs text-muted-foreground mt-1">Complete all steps to submit your application</p>
//         </div>
//       </div>

//       {/* Stepper */}
//       <div className="px-6 lg:px-8 pt-6">
//         <div className="relative flex items-center justify-between rounded-2xl border border-border bg-card p-4 shadow-lg">
//           {STEPS.map((s, i) => (
//             <div key={s.id} className="flex items-center gap-2 z-10">
//               <div className={cn(
//                 "flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold transition-all",
//                 step > s.id ? "bg-accent text-accent-foreground" : step === s.id ? "bg-accent/15 text-accent ring-2 ring-accent/30" : "bg-secondary text-muted-foreground"
//               )}>
//                 {step > s.id ? <Check className="h-4 w-4" /> : s.icon}
//               </div>
//               <span className={cn("hidden sm:block text-xs font-medium", step >= s.id ? "text-foreground" : "text-muted-foreground")}>{s.title}</span>
//               {i < STEPS.length - 1 && <div className={cn("hidden sm:block w-8 h-0.5 mx-2", step > s.id ? "bg-accent" : "bg-border")} />}
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Form Body */}
//       <div className="px-6 py-6 lg:px-8">
//         <div className={cn("rounded-3xl border border-border bg-card p-6 shadow-sm transition-transform", shakeStep && "animate-[shake_0.5s_ease-in-out]")}>

//           {/* Step 1: Loan Details */}
//           {step === 1 && (
//             <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-200">
//               <h2 className="text-lg font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>Loan Details</h2>
//               <div className="grid gap-4 sm:grid-cols-2">
//                 <div>
//                   <label className={labelClass}>Loan Type *</label>
//                   <select value={form.loanType} onChange={(e) => update("loanType", e.target.value)} className={errors.loanType ? errorSelectClass : selectClass}>
//                     <option value="">Select loan type</option>
//                     {LOAN_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
//                   </select>
//                   <FieldError field="loanType" />
//                 </div>
//                 <div>
//                   <label className={labelClass}>Loan Amount (₹) *</label>
//                   <input type="number" value={form.amount} onChange={(e) => update("amount", e.target.value)} placeholder="e.g. 500000" className={errors.amount ? errorInputClass : inputClass} />
//                   <FieldError field="amount" />
//                 </div>
//                 <div>
//                   <label className={labelClass}>Tenure (months) *</label>
//                   <input type="number" value={form.tenure} onChange={(e) => update("tenure", e.target.value)} placeholder="e.g. 24" className={errors.tenure ? errorInputClass : inputClass} />
//                   <FieldError field="tenure" />
//                 </div>
//                 <div>
//                   <label className={labelClass}>Purpose</label>
//                   <input type="text" value={form.purpose} onChange={(e) => update("purpose", e.target.value)} placeholder="Why do you need this loan?" className={inputClass} />
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Step 2: Personal Info */}
//           {step === 2 && (
//             <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-200">
//               <h2 className="text-lg font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>Personal Information</h2>
//               <div className="grid gap-4 sm:grid-cols-2">
//                 <div className="sm:col-span-2">
//                   <label className={labelClass}>Full Name *</label>
//                   <input type="text" value={form.fullName} onChange={(e) => update("fullName", e.target.value)} placeholder="As per PAN card" className={errors.fullName ? errorInputClass : inputClass} />
//                   <FieldError field="fullName" />
//                 </div>
//                 <div>
//                   <label className={labelClass}>Date of Birth *</label>
//                   <input type="date" value={form.dob} onChange={(e) => update("dob", e.target.value)} className={errors.dob ? errorInputClass : inputClass} />
//                   <FieldError field="dob" />
//                 </div>
//                 <div>
//                   <label className={labelClass}>Gender *</label>
//                   <select value={form.gender} onChange={(e) => update("gender", e.target.value)} className={errors.gender ? errorSelectClass : selectClass}>
//                     <option value="">Select</option><option value="male">Male</option><option value="female">Female</option><option value="other">Other</option>
//                   </select>
//                   <FieldError field="gender" />
//                 </div>
//                 <div>
//                   <label className={labelClass}>PAN Number *</label>
//                   <input type="text" value={form.pan} onChange={(e) => update("pan", e.target.value)} placeholder="ABCDE1234F" className={errors.pan ? errorInputClass : inputClass} />
//                   <FieldError field="pan" />
//                 </div>
//                 <div>
//                   <label className={labelClass}>Aadhaar Number *</label>
//                   <input type="text" value={form.aadhaar} onChange={(e) => update("aadhaar", e.target.value)} placeholder="1234 5678 9012" className={errors.aadhaar ? errorInputClass : inputClass} />
//                   <FieldError field="aadhaar" />
//                 </div>
//                 <div>
//                   <label className={labelClass}>Email *</label>
//                   <input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="you@example.com" className={errors.email ? errorInputClass : inputClass} />
//                   <FieldError field="email" />
//                 </div>
//                 <div>
//                   <label className={labelClass}>Phone *</label>
//                   <input type="tel" value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="+91 98765 43210" className={errors.phone ? errorInputClass : inputClass} />
//                   <FieldError field="phone" />
//                 </div>
//                 <div className="sm:col-span-2"><label className={labelClass}>Address</label><input type="text" value={form.address} onChange={(e) => update("address", e.target.value)} placeholder="Full address" className={inputClass} /></div>
//                 <div><label className={labelClass}>City</label><input type="text" value={form.city} onChange={(e) => update("city", e.target.value)} placeholder="City" className={inputClass} /></div>
//                 <div><label className={labelClass}>State</label><input type="text" value={form.state} onChange={(e) => update("state", e.target.value)} placeholder="State" className={inputClass} /></div>
//                 <div><label className={labelClass}>PIN Code</label><input type="text" value={form.pincode} onChange={(e) => update("pincode", e.target.value)} placeholder="110001" className={inputClass} /></div>
//               </div>
//             </div>
//           )}

//           {/* Step 3: Employment */}
//           {step === 3 && (
//             <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-200">
//               <h2 className="text-lg font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>Employment & Bank Details</h2>
//               <div className="grid gap-4 sm:grid-cols-2">
//                 <div>
//                   <label className={labelClass}>Employment Type *</label>
//                   <select value={form.employmentType} onChange={(e) => update("employmentType", e.target.value)} className={errors.employmentType ? errorSelectClass : selectClass}>
//                     <option value="">Select</option><option value="salaried">Salaried</option><option value="self-employed">Self-Employed</option><option value="business">Business Owner</option>
//                   </select>
//                   <FieldError field="employmentType" />
//                 </div>
//                 <div><label className={labelClass}>Company / Business Name</label><input type="text" value={form.companyName} onChange={(e) => update("companyName", e.target.value)} placeholder="Company name" className={inputClass} /></div>
//                 <div><label className={labelClass}>Designation</label><input type="text" value={form.designation} onChange={(e) => update("designation", e.target.value)} placeholder="Your role" className={inputClass} /></div>
//                 <div>
//                   <label className={labelClass}>Monthly Income (₹) *</label>
//                   <input type="number" value={form.monthlyIncome} onChange={(e) => update("monthlyIncome", e.target.value)} placeholder="e.g. 50000" className={errors.monthlyIncome ? errorInputClass : inputClass} />
//                   <FieldError field="monthlyIncome" />
//                 </div>
//                 <div><label className={labelClass}>Experience (years)</label><input type="number" value={form.experience} onChange={(e) => update("experience", e.target.value)} placeholder="e.g. 5" className={inputClass} /></div>
//               </div>
//               <div className="border-t border-border pt-4">
//                 <h3 className="text-sm font-semibold text-foreground mb-3">Bank Details</h3>
//                 <div className="grid gap-4 sm:grid-cols-2">
//                   <div>
//                     <label className={labelClass}>Bank Name *</label>
//                     <input type="text" value={form.bankName} onChange={(e) => update("bankName", e.target.value)} placeholder="Bank name" className={errors.bankName ? errorInputClass : inputClass} />
//                     <FieldError field="bankName" />
//                   </div>
//                   <div>
//                     <label className={labelClass}>Account Number *</label>
//                     <input type="text" value={form.accountNumber} onChange={(e) => update("accountNumber", e.target.value)} placeholder="Account number" className={errors.accountNumber ? errorInputClass : inputClass} />
//                     <FieldError field="accountNumber" />
//                   </div>
//                   <div>
//                     <label className={labelClass}>IFSC Code *</label>
//                     <input type="text" value={form.ifsc} onChange={(e) => update("ifsc", e.target.value)} placeholder="SBIN0001234" className={errors.ifsc ? errorInputClass : inputClass} />
//                     <FieldError field="ifsc" />
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Step 4: Documents */}
//           {step === 4 && (
//             <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-200">
//               <h2 className="text-lg font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>Upload Documents</h2>
//               <div className="grid gap-3 sm:grid-cols-2">
//                 {DOC_FIELDS.map(({ key, label, accept }) => {
//                   const file = form.documents[key]
//                   return (
//                     <div key={key} className="relative">
//                       <input
//                         ref={(el) => { docInputRefs.current[key] = el }}
//                         type="file"
//                         accept={accept}
//                         className="hidden"
//                         onChange={(e) => {
//                           const f = e.target.files?.[0] || null
//                           updateDoc(key, f)
//                           e.target.value = ""
//                         }}
//                       />
//                       <div
//                         onClick={() => !file && docInputRefs.current[key]?.click()}
//                         className={cn(
//                           "flex items-center gap-3 rounded-2xl border-2 border-dashed p-4 transition-all",
//                           file ? "border-accent bg-accent/5" : "border-border hover:border-accent/30 cursor-pointer"
//                         )}
//                       >
//                         <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center shrink-0",
//                           file ? "bg-accent/15 text-accent" : "bg-secondary text-muted-foreground"
//                         )}>
//                           {file ? <Check className="h-5 w-5" /> : <Upload className="h-5 w-5" />}
//                         </div>
//                         <div className="flex-1 min-w-0">
//                           <p className="text-xs font-semibold text-foreground">{label}</p>
//                           <p className="text-[10px] text-muted-foreground truncate">
//                             {file ? file.name : "Click to upload"}
//                           </p>
//                         </div>
//                         {file && (
//                           <div className="flex gap-1">
//                             <button
//                               onClick={(e) => { e.stopPropagation(); docInputRefs.current[key]?.click() }}
//                               className="h-7 w-7 rounded-lg flex items-center justify-center hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
//                               title="Replace file"
//                             >
//                               <Upload className="h-3.5 w-3.5" />
//                             </button>
//                             <button
//                               onClick={(e) => { e.stopPropagation(); updateDoc(key, null) }}
//                               className="h-7 w-7 rounded-lg flex items-center justify-center hover:bg-red-500/10 transition-colors text-muted-foreground hover:text-red-500"
//                               title="Remove"
//                             >
//                               <X className="h-3.5 w-3.5" />
//                             </button>
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   )
//                 })}
//               </div>
//               {(errors["documents.aadhaar"] || errors["documents.panCard"]) && (
//                 <div className="flex items-center gap-2 rounded-xl bg-red-500/5 border border-red-500/20 p-3 animate-in fade-in slide-in-from-top-2 duration-200">
//                   <AlertCircle className="h-4 w-4 text-red-500 shrink-0" />
//                   <p className="text-[10px] text-red-500 font-medium">{errors["documents.aadhaar"] || errors["documents.panCard"]}</p>
//                 </div>
//               )}
//               <div className="flex items-center gap-2 rounded-xl bg-accent/5 border border-accent/10 p-3">
//                 <AlertCircle className="h-4 w-4 text-accent shrink-0" />
//                 <p className="text-[10px] text-muted-foreground">All documents must be clear and valid. Max file size: 5MB per document. Accepted: JPG, PNG, PDF.</p>
//               </div>
//             </div>
//           )}

//           {/* Step 5: Review */}
//           {step === 5 && (
//             <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-200">
//               <h2 className="text-lg font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>Review Application</h2>
//               {[
//                 { title: "Loan", items: [["Type", form.loanType], ["Amount", `₹${Number(form.amount).toLocaleString("en-IN")}`], ["Tenure", `${form.tenure} months`], ["Purpose", form.purpose || "—"]] },
//                 { title: "Personal", items: [["Name", form.fullName], ["DOB", form.dob], ["PAN", form.pan], ["Aadhaar", form.aadhaar], ["Email", form.email], ["Phone", form.phone]] },
//                 { title: "Employment", items: [["Type", form.employmentType], ["Company", form.companyName || "—"], ["Income", `₹${Number(form.monthlyIncome).toLocaleString("en-IN")}/mo`], ["Bank", form.bankName], ["IFSC", form.ifsc]] },
//               ].map((section) => (
//                 <div key={section.title} className="rounded-xl border border-border p-4">
//                   <h3 className="text-xs font-bold text-accent mb-2">{section.title}</h3>
//                   <div className="grid gap-x-6 gap-y-1 sm:grid-cols-3">
//                     {section.items.map(([k, v]) => (
//                       <div key={k} className="flex justify-between sm:flex-col py-0.5">
//                         <span className="text-[10px] text-muted-foreground">{k}</span>
//                         <span className="text-xs font-medium text-foreground">{v || "—"}</span>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               ))}
//               <div className="rounded-xl border border-border p-4">
//                 <h3 className="text-xs font-bold text-accent mb-2">Documents</h3>
//                 <div className="flex flex-wrap gap-2">
//                   {DOC_FIELDS.map(({ key, label }) => {
//                     const file = form.documents[key]
//                     return (
//                       <span key={key} className={cn("text-[10px] px-2.5 py-1 rounded-full font-medium", file ? "bg-accent/10 text-accent" : "bg-destructive/10 text-destructive")}>
//                         {label.split("(")[0].trim()} {file ? "✓" : "✗"}
//                       </span>
//                     )
//                   })}
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Navigation */}
//           <div className="mt-8 flex items-center justify-between border-t border-border pt-5">
//             <Button
//               variant="outline"
//               disabled={step === 1}
//               onClick={() => setStep((s) => s - 1)}
//               className="h-10 rounded-xl gap-2 text-sm"
//             >
//               <ArrowLeft className="h-4 w-4" /> Back
//             </Button>
//             {step < 5 ? (
//               <Button onClick={handleNext} className="h-10 rounded-xl bg-accent text-accent-foreground hover:bg-accent/90 gap-2 text-sm font-semibold">
//                 Next <ArrowRight className="h-4 w-4" />
//               </Button>
//             ) : (
//               <Button onClick={handleSubmit} className="h-10 rounded-xl bg-accent text-accent-foreground hover:bg-accent/90 gap-2 text-sm font-semibold shadow-lg shadow-accent/20">
//                 <Check className="h-4 w-4" /> Submit Application
//               </Button>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ArrowRight, ArrowLeft, Check, User, Briefcase, FileText, IndianRupee, Upload, AlertCircle, Loader2 } from "lucide-react"
import api from "@/config/axios"
import { useToast } from "@/hooks/use-toast"
import { API_BASE_URL } from "@/config/api"

type Step = { id: number; title: string; icon: React.ReactNode }

const STEPS: Step[] = [
  { id: 1, title: "Loan Details", icon: <IndianRupee className="h-4 w-4" /> },
  { id: 2, title: "Personal Info", icon: <User className="h-4 w-4" /> },
  { id: 3, title: "Employment", icon: <Briefcase className="h-4 w-4" /> },
  { id: 4, title: "Documents", icon: <FileText className="h-4 w-4" /> },
  { id: 5, title: "Review", icon: <Check className="h-4 w-4" /> },
]

const LOAN_TYPES = ["Personal Loan", "Business Loan", "Home Loan", "Education Loan", "Vehicle Loan"]

const DOC_FIELDS = [
  { key: "panCard", label: "PAN Card", accept: "image/*,.pdf" },
  { key: "aadhaarCard", label: "Aadhaar Card (Front & Back)", accept: "image/*,.pdf" },
  { key: "selfie", label: "Live Selfie / Photo", accept: "image/*" },
] as const

type DocKey = (typeof DOC_FIELDS)[number]["key"]

type FormDataState = {
  nbfcId: string;
  loanType: string; amount: string; tenure: string; purpose: string
  fullName: string; dob: string; gender: string; pan: string; aadhaar: string; email: string; phone: string; address: string; city: string; state: string; pincode: string
  employmentType: string; companyName: string; designation: string; monthlyIncome: string; experience: string; bankName: string; accountNumber: string; ifsc: string
  documents: Record<DocKey, File | null>
}

const initialData: FormDataState = {
  nbfcId: "", loanType: "", amount: "", tenure: "", purpose: "",
  fullName: "", dob: "", gender: "", pan: "", aadhaar: "", email: "", phone: "", address: "", city: "", state: "", pincode: "",
  employmentType: "", companyName: "", designation: "", monthlyIncome: "", experience: "", bankName: "", accountNumber: "", ifsc: "",
  documents: { aadhaarCard: null, panCard: null, selfie: null },
}

export function UserApplyLoan() {
  const router = useRouter()
  const { toast } = useToast()
  const [step, setStep] = useState(1)
  const [form, setForm] = useState<FormDataState>(initialData)
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [shakeStep, setShakeStep] = useState(false)
  const docInputRefs = useRef<Record<string, HTMLInputElement | null>>({})
  
  const [nbfcs, setNbfcs] = useState<{_id: string, name: string}[]>([])

  useEffect(() => {
    const fetchNbfcs = async () => {
      try {
        const res = await api.get("/api/applications/nbfcs")
        if (res.data?.nbfcs) setNbfcs(res.data.nbfcs)
      } catch (err) {
        console.error("Failed to fetch NBFCs")
      }
    }
    fetchNbfcs()
  }, [])

  const update = (field: string, value: string) => {
    setForm((p) => ({ ...p, [field]: value }))
    if (errors[field]) setErrors((prev) => { const n = { ...prev }; delete n[field]; return n })
  }

  const updateDoc = (key: DocKey, file: File | null) => {
    setForm((p) => ({ ...p, documents: { ...p.documents, [key]: file } }))
    if (errors[`documents.${key}`]) setErrors((prev) => { const n = { ...prev }; delete n[`documents.${key}`]; return n })
  }

  const validateStep = (s: number): boolean => {
    const newErrors: Record<string, string> = {}
    if (s === 1) {
      if (!form.nbfcId) newErrors.nbfcId = "Select a lending partner"
      if (!form.loanType) newErrors.loanType = "Select a loan type"
      if (!form.amount || Number(form.amount) < 10000) newErrors.amount = "Min ₹10,000"
      if (!form.tenure || Number(form.tenure) < 3) newErrors.tenure = "Min 3 months"
    } else if (s === 2) {
      if (!form.fullName.trim()) newErrors.fullName = "Name is required"
      if (!form.dob) newErrors.dob = "Date of birth is required"
      if (!form.pan) newErrors.pan = "PAN is required"
      if (!form.aadhaar) newErrors.aadhaar = "Aadhaar is required"
    } else if (s === 3) {
      if (!form.employmentType) newErrors.employmentType = "Select employment type"
      if (!form.monthlyIncome) newErrors.monthlyIncome = "Income required"
    } else if (s === 4) {
      const docs = form.documents
      if (!docs.aadhaarCard) newErrors["documents.aadhaarCard"] = "Aadhaar required"
      if (!docs.panCard) newErrors["documents.panCard"] = "PAN card required"
      if (!docs.selfie) newErrors["documents.selfie"] = "Selfie required"
    }
    setErrors(newErrors)
    if (Object.keys(newErrors).length > 0) {
      setShakeStep(true)
      setTimeout(() => setShakeStep(false), 600)
      return false
    }
    return true
  }

  const handleNext = () => {
    if (validateStep(step)) setStep((s) => s + 1)
  }

  const handleSubmit = async () => {
    if (!validateStep(step)) return;
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      
      formData.append("nbfcId", form.nbfcId);
      formData.append("panCard", form.documents.panCard as Blob);
      formData.append("aadhaarCard", form.documents.aadhaarCard as Blob);
      formData.append("selfie", form.documents.selfie as Blob);

      const { documents, nbfcId, ...restFormDetails } = form;
      const aiChatData = {
        requestedAmount: Number(form.amount),
        score: Math.floor(Math.random() * (850 - 650 + 1)) + 650,
        raw: restFormDetails
      };
      formData.append("aiChatData", JSON.stringify(aiChatData));

      const response = await fetch(`${API_BASE_URL}/api/applications/submit`, {
        method: "POST",
        credentials: "include", 
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to upload documents")
      }

      setSubmitted(true);
      toast({ title: "Success", description: "Application submitted successfully!" });
      
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Submission failed", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  }

  const inputClass = "h-10 w-full rounded-xl border border-border bg-secondary/30 px-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/30 transition-colors"
  const errorInputClass = "h-10 w-full rounded-xl border border-red-500/50 bg-red-500/5 px-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500/30 transition-colors"
  const labelClass = "text-[11px] font-semibold text-muted-foreground mb-1.5 block"
  const selectClass = cn(inputClass, "appearance-none cursor-pointer")
  const errorSelectClass = cn(errorInputClass, "appearance-none cursor-pointer")
  const FieldError = ({ field }: { field: string }) => errors[field] ? <p className="text-[10px] text-red-500 mt-1 animate-in fade-in slide-in-from-top-1 duration-150">{errors[field]}</p> : null

  if (submitted) {
    return (
      <div className="min-h-[60vh] bg-background flex items-center justify-center">
        <div className="text-center p-10 rounded-3xl border border-accent/20 bg-card animate-in fade-in zoom-in-95 duration-300 shadow-lg">
          <div className="mx-auto mb-5 h-16 w-16 rounded-full bg-accent/10 flex items-center justify-center animate-in zoom-in duration-500">
            <Check className="h-8 w-8 text-accent" />
          </div>
          <h2 className="text-xl font-bold text-foreground mb-2" style={{ fontFamily: "var(--font-heading)" }}>Application Submitted!</h2>
          <p className="text-sm text-muted-foreground mb-6">Your loan application has been sent to the NBFC. We'll notify you once reviewed.</p>
          <div className="flex gap-3 justify-center">
            <Button onClick={() => router.push("/user")} className="rounded-full bg-accent text-accent-foreground hover:bg-accent/90 text-sm font-semibold px-6">
              Go to Dashboard
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="border-b border-border bg-card">
        <div className="px-6 py-6 lg:px-8">
          <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>Apply for a Loan</h1>
          <p className="text-xs text-muted-foreground mt-1">Complete all steps to submit your application</p>
        </div>
      </div>

      <div className="px-6 lg:px-8 pt-6">
        <div className="relative flex items-center justify-between rounded-2xl border border-border bg-card p-4 shadow-sm mb-6 overflow-x-auto">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex items-center gap-2 z-10 shrink-0">
              <div className={cn(
                "flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold transition-all",
                step > s.id ? "bg-accent text-accent-foreground" : step === s.id ? "bg-accent/15 text-accent ring-2 ring-accent/30" : "bg-secondary text-muted-foreground"
              )}>
                {step > s.id ? <Check className="h-4 w-4" /> : s.icon}
              </div>
              <span className={cn("hidden sm:block text-xs font-medium", step >= s.id ? "text-foreground" : "text-muted-foreground")}>{s.title}</span>
              {i < STEPS.length - 1 && <div className={cn("w-4 sm:w-8 h-0.5 mx-1 sm:mx-2", step > s.id ? "bg-accent" : "bg-border")} />}
            </div>
          ))}
        </div>

        <div className={cn("rounded-3xl border border-border bg-card p-6 shadow-sm transition-transform max-w-4xl mx-auto", shakeStep && "animate-[shake_0.5s_ease-in-out]")}>
          
          {step === 1 && (
            <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-200">
              <h2 className="text-lg font-bold text-foreground">Loan Details</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className={labelClass}>Select NBFC Partner *</label>
                  <select value={form.nbfcId} onChange={(e) => update("nbfcId", e.target.value)} className={errors.nbfcId ? errorSelectClass : selectClass}>
                    <option value="">Select a lender</option>
                    {nbfcs.map((nbfc) => <option key={nbfc._id} value={nbfc._id}>{nbfc.name}</option>)}
                  </select>
                  <FieldError field="nbfcId" />
                </div>
                <div>
                  <label className={labelClass}>Loan Type *</label>
                  <select value={form.loanType} onChange={(e) => update("loanType", e.target.value)} className={errors.loanType ? errorSelectClass : selectClass}>
                    <option value="">Select loan type</option>
                    {LOAN_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                  <FieldError field="loanType" />
                </div>
                <div>
                  <label className={labelClass}>Loan Amount (₹) *</label>
                  <input type="number" value={form.amount} onChange={(e) => update("amount", e.target.value)} placeholder="e.g. 500000" className={errors.amount ? errorInputClass : inputClass} />
                  <FieldError field="amount" />
                </div>
                <div>
                  <label className={labelClass}>Tenure (months) *</label>
                  <input type="number" value={form.tenure} onChange={(e) => update("tenure", e.target.value)} placeholder="e.g. 24" className={errors.tenure ? errorInputClass : inputClass} />
                  <FieldError field="tenure" />
                </div>
                <div>
                  <label className={labelClass}>Purpose</label>
                  <input type="text" value={form.purpose} onChange={(e) => update("purpose", e.target.value)} placeholder="Why do you need this loan?" className={inputClass} />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-200">
              <h2 className="text-lg font-bold text-foreground">Personal Information</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className={labelClass}>Full Name *</label>
                  <input type="text" value={form.fullName} onChange={(e) => update("fullName", e.target.value)} placeholder="As per PAN card" className={errors.fullName ? errorInputClass : inputClass} />
                  <FieldError field="fullName" />
                </div>
                <div>
                  <label className={labelClass}>Date of Birth *</label>
                  <input type="date" value={form.dob} onChange={(e) => update("dob", e.target.value)} className={errors.dob ? errorInputClass : inputClass} />
                  <FieldError field="dob" />
                </div>
                <div>
                  <label className={labelClass}>Gender</label>
                  <select value={form.gender} onChange={(e) => update("gender", e.target.value)} className={selectClass}>
                    <option value="">Select</option><option value="male">Male</option><option value="female">Female</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>PAN Number *</label>
                  <input type="text" value={form.pan} onChange={(e) => update("pan", e.target.value)} placeholder="ABCDE1234F" className={errors.pan ? errorInputClass : inputClass} />
                  <FieldError field="pan" />
                </div>
                <div>
                  <label className={labelClass}>Aadhaar Number *</label>
                  <input type="text" value={form.aadhaar} onChange={(e) => update("aadhaar", e.target.value)} placeholder="1234 5678 9012" className={errors.aadhaar ? errorInputClass : inputClass} />
                  <FieldError field="aadhaar" />
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-200">
              <h2 className="text-lg font-bold text-foreground">Employment & Bank Details</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelClass}>Employment Type *</label>
                  <select value={form.employmentType} onChange={(e) => update("employmentType", e.target.value)} className={errors.employmentType ? errorSelectClass : selectClass}>
                    <option value="">Select</option><option value="salaried">Salaried</option><option value="self-employed">Self-Employed</option>
                  </select>
                  <FieldError field="employmentType" />
                </div>
                <div>
                  <label className={labelClass}>Monthly Income (₹) *</label>
                  <input type="number" value={form.monthlyIncome} onChange={(e) => update("monthlyIncome", e.target.value)} placeholder="e.g. 50000" className={errors.monthlyIncome ? errorInputClass : inputClass} />
                  <FieldError field="monthlyIncome" />
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-200">
              <h2 className="text-lg font-bold text-foreground">Upload Documents</h2>
              <div className="grid gap-3 sm:grid-cols-3">
                {DOC_FIELDS.map(({ key, label, accept }) => {
                  const file = form.documents[key]
                  return (
                    <div key={key} className="relative">
                      <input
                        ref={(el) => { docInputRefs.current[key] = el }}
                        type="file" accept={accept} className="hidden"
                        onChange={(e) => {
                          const f = e.target.files?.[0] || null
                          updateDoc(key, f)
                          e.target.value = ""
                        }}
                      />
                      <div
                        onClick={() => !file && docInputRefs.current[key]?.click()}
                        className={cn("flex flex-col items-center gap-3 rounded-2xl border-2 border-dashed p-6 text-center transition-all h-full", file ? "border-accent bg-accent/5" : "border-border hover:border-accent/30 cursor-pointer")}
                      >
                        <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center shrink-0", file ? "bg-accent/15 text-accent" : "bg-secondary text-muted-foreground")}>
                          {file ? <Check className="h-5 w-5" /> : <Upload className="h-5 w-5" />}
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-foreground">{label}</p>
                          <p className="text-[10px] text-muted-foreground mt-1 truncate px-2">{file ? file.name : "Click to upload"}</p>
                        </div>
                        {file && (
                          <div className="flex gap-2 mt-2">
                            <button onClick={(e) => { e.stopPropagation(); docInputRefs.current[key]?.click() }} className="text-xs text-accent hover:underline">Change</button>
                          </div>
                        )}
                        <FieldError field={`documents.${key}`} />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-200">
              <h2 className="text-lg font-bold text-foreground">Review Application</h2>
              <div className="rounded-xl border border-border p-5 bg-secondary/10">
                <div className="grid gap-4 sm:grid-cols-3">
                  <div><p className="text-[10px] text-muted-foreground">Loan Amount</p><p className="font-bold">₹{form.amount}</p></div>
                  <div><p className="text-[10px] text-muted-foreground">Tenure</p><p className="font-bold">{form.tenure} months</p></div>
                  <div><p className="text-[10px] text-muted-foreground">NBFC Partner</p><p className="font-bold">{nbfcs.find(n => n._id === form.nbfcId)?.name || 'Selected'}</p></div>
                </div>
              </div>
              <div className="rounded-xl border border-border p-5">
                 <p className="text-sm font-bold mb-3">Documents Attached</p>
                 <div className="flex gap-2">
                   <span className="text-xs bg-accent/10 text-accent px-3 py-1 rounded-full">PAN Card ✓</span>
                   <span className="text-xs bg-accent/10 text-accent px-3 py-1 rounded-full">Aadhaar ✓</span>
                   <span className="text-xs bg-accent/10 text-accent px-3 py-1 rounded-full">Selfie ✓</span>
                 </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="mt-8 flex items-center justify-between border-t border-border pt-5">
            <Button variant="outline" disabled={step === 1 || isSubmitting} onClick={() => setStep((s) => s - 1)} className="h-10 rounded-xl gap-2 text-sm">
              <ArrowLeft className="h-4 w-4" /> Back
            </Button>
            {step < 5 ? (
              <Button onClick={handleNext} className="h-10 rounded-xl bg-accent text-accent-foreground hover:bg-accent/90 gap-2 text-sm font-semibold">
                Next <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={isSubmitting} className="h-10 rounded-xl bg-accent text-accent-foreground hover:bg-accent/90 gap-2 text-sm font-semibold shadow-lg shadow-accent/20">
                {isSubmitting ? <><Loader2 className="h-4 w-4 animate-spin"/> Processing</> : <><Check className="h-4 w-4" /> Submit Application</>}
              </Button>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}