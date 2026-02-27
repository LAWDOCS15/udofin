// "use client"

// import { useState } from "react"
// import { useOnboarding } from "@/lib/onboarding-context"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Eye, EyeOff, Mail, Lock, Phone, User, ArrowLeft, ArrowRight, Loader2, Shield, Users, Building2 } from "lucide-react"
// import { DEMO_CREDENTIALS, type AuthMode, type UserRole } from "@/lib/types"
// import { cn } from "@/lib/utils"

// const ROLE_CONFIG = {
//   user: {
//     label: "Borrower",
//     icon: Users,
//     color: "bg-blue-500",
//     lightColor: "bg-blue-50 border-blue-200 text-blue-700",
//     desc: "Apply for loans & track status",
//     email: "user@finlend.ai",
//     password: "user1234",
//   },
//   admin: {
//     label: "Super Admin",
//     icon: Shield,
//     color: "bg-violet-500",
//     lightColor: "bg-violet-50 border-violet-200 text-violet-700",
//     desc: "Full platform management",
//     email: "admin@finlend.ai",
//     password: "admin1234",
//   },
//   "nbfc-admin": {
//     label: "NBFC Admin",
//     icon: Building2,
//     color: "bg-emerald-500",
//     lightColor: "bg-emerald-50 border-emerald-200 text-emerald-700",
//     desc: "Manage your NBFC & loans",
//     email: "nbfc@finlend.ai",
//     password: "nbfc1234",
//   },
// }

// // Added backend URL
// const API_BASE_URL = "http://localhost:5000/api/auth"

// export function AuthForm() {
//   const { setStep, setIsAuthenticated, setUserRole, completeStep, updateProfile } = useOnboarding()
//   const [mode, setMode] = useState<AuthMode>("register") // Changed default to register
//   const [selectedRole, setSelectedRole] = useState<UserRole>("user")
//   const [showPassword, setShowPassword] = useState(false)
//   const [loading, setLoading] = useState(false)
//   const [formErrors, setFormErrors] = useState<Record<string, string>>({})
//   const [loginError, setLoginError] = useState("")

//   // --- NEW STATES FOR OTP & FORGOT PASSWORD ---
//   const [subStep, setSubStep] = useState<"none" | "verify-otp" | "forgot-password" | "reset-password">("none")
//   const [tempData, setTempData] = useState({ email: "", name: "" })

//   const validateForm = (formData: FormData): boolean => {
//     const errors: Record<string, string> = {}
    
//     if (subStep === "none") {
//       const email = formData.get("email") as string
//       const password = formData.get("password") as string
//       if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Please enter a valid email"
//       if (!password || password.length < 6) errors.password = "Password must be at least 6 characters"
//       if (mode === "register") {
//         const name = formData.get("name") as string
//         if (!name || name.trim().length < 2) errors.name = "Name is required"
//       }
//     } else if (subStep === "verify-otp") {
//       const otp = formData.get("otp") as string
//       if (!otp || otp.length < 5) errors.otp = "Please enter a valid OTP"
//     } else if (subStep === "forgot-password") {
//       const email = formData.get("email") as string
//       if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Please enter a valid email"
//     } else if (subStep === "reset-password") {
//       const otp = formData.get("otp") as string
//       const newPassword = formData.get("newPassword") as string
//       if (!otp || otp.length < 5) errors.otp = "Please enter a valid OTP"
//       if (!newPassword || newPassword.length < 6) errors.newPassword = "Password must be at least 6 characters"
//     }

//     setFormErrors(errors)
//     return Object.keys(errors).length === 0
//   }

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault()
//     const formData = new FormData(e.currentTarget)
//     if (!validateForm(formData)) return
    
//     setLoginError("")
//     setLoading(true)

//     try {
//       // 1. NORMAL LOGIN OR REGISTER
//       if (subStep === "none") {
//         if (mode === "login") {
//           const email = formData.get("email") as string
//           const password = formData.get("password") as string

//           // Call API: Login
//           const res = await fetch(`${API_BASE_URL}/login`, {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ email, password })
//           })
//           const data = await res.json()
          
//           if (!res.ok) throw new Error(data.message || "Invalid credentials.")

//           setIsAuthenticated(true)
//           setUserRole(selectedRole) // Assuming role stays based on UI selection
//           completeStep("auth")
//           if (selectedRole === "admin") setStep("admin")
//           else if (selectedRole === "nbfc-admin") setStep("nbfc-admin")
//           else setStep("chatbot")

//         } else {
//           // Call API: Register
//           const name = formData.get("name") as string
//           const email = formData.get("email") as string
//           const password = formData.get("password") as string

//           const res = await fetch(`${API_BASE_URL}/register`, {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ name, email, password })
//           })
//           const data = await res.json()
          
//           if (!res.ok) throw new Error(data.message || "Registration failed")
          
//           setTempData({ email, name })
//           setSubStep("verify-otp") // Open OTP Form
//         }
//       } 
//       // 2. VERIFY REGISTER OTP
//       else if (subStep === "verify-otp") {
//         const otp = formData.get("otp") as string
//         const res = await fetch(`${API_BASE_URL}/verify-email`, {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ email: tempData.email, otp })
//         })
//         const data = await res.json()
        
//         if (!res.ok) throw new Error(data.message || "Invalid OTP")

//         setIsAuthenticated(true)
//         setUserRole("user")
//         updateProfile({ fullName: tempData.name })
//         completeStep("auth")
//         setStep("chatbot")
//       }
//       // 3. REQUEST FORGOT PASSWORD OTP
//       else if (subStep === "forgot-password") {
//         const email = formData.get("email") as string
//         const res = await fetch(`${API_BASE_URL}/forgot-password`, {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ email })
//         })
//         const data = await res.json()
        
//         if (!res.ok) throw new Error(data.message || "Failed to send reset email")

//         setTempData({ ...tempData, email })
//         setSubStep("reset-password") // Move to Reset form
//       }
//       // 4. VERIFY OTP & SET NEW PASSWORD
//       else if (subStep === "reset-password") {
//         const otp = formData.get("otp") as string
//         const newPassword = formData.get("newPassword") as string
//         const res = await fetch(`${API_BASE_URL}/reset-password`, {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ email: tempData.email, otp, newPassword })
//         })
//         const data = await res.json()
        
//         if (!res.ok) throw new Error(data.message || "Failed to reset password")

//         // Success - go back to login
//         setSubStep("none")
//         setMode("login")
//         setLoginError("Password reset successful. Please log in.")
//       }
//     } catch (err: any) {
//       setLoginError(err.message)
//     } finally {
//       setLoading(false)
//     }
//   }

//   // Handle Mode Change (Reset steps)
//   const handleModeSwitch = (m: AuthMode) => {
//     setMode(m)
//     setSubStep("none")
//     setFormErrors({})
//     setLoginError("")
//   }

//   const config = ROLE_CONFIG[selectedRole]

//   // Dynamic Titles
//   const getTitle = () => {
//     if (subStep === "verify-otp") return "Verify your email"
//     if (subStep === "forgot-password") return "Forgot Password"
//     if (subStep === "reset-password") return "Reset Password"
//     return mode === "login" ? "Welcome back" : "Create account"
//   }

//   const getSubtitle = () => {
//     if (subStep === "verify-otp") return `We sent an OTP to ${tempData.email}`
//     if (subStep === "forgot-password") return "Enter your email to receive an OTP."
//     if (subStep === "reset-password") return "Enter the OTP sent to your email and a new password."
//     return mode === "login" ? "Sign in to your account." : "Start your loan application in minutes."
//   }

//   return (
//     <div className="flex min-h-screen bg-primary">
      
//       {/* Left branding (Unchanged) */}
//       <div className="relative hidden flex-1 flex-col justify-between p-10 lg:flex">
//         <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_20%_80%,rgba(100,180,130,0.08),transparent)]" />
//         <div className="relative">
//           <button onClick={() => setStep("landing")} className="flex items-center gap-2.5 transition-opacity hover:opacity-70">
//             <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent">
//               <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-accent-foreground">
//                 <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//               </svg>
//             </div>
//             <span className="text-lg font-bold text-primary-foreground" style={{ fontFamily: "var(--font-heading)" }}>FinLend</span>
//           </button>
//         </div>
//         <div className="relative max-w-md">
//           <h2 className="text-4xl font-bold leading-tight text-primary-foreground" style={{ fontFamily: "var(--font-heading)" }}>
//             Smart lending<br />starts here.
//           </h2>
//           <p className="mt-4 text-sm leading-relaxed text-primary-foreground/35">
//             AI-powered loan applications with instant verification, personalized offers, and bank-grade security. Join 50,000+ borrowers who chose the smarter way.
//           </p>
//           <div className="mt-8 flex items-center gap-6 border-t border-primary-foreground/5 pt-8">
//             {[
//               { value: "< 5 min", label: "Approval time" },
//               { value: "50K+", label: "Loans approved" },
//               { value: "4.8/5", label: "User rating" },
//             ].map((s) => (
//               <div key={s.label}>
//                 <p className="text-lg font-bold text-primary-foreground" style={{ fontFamily: "var(--font-heading)" }}>{s.value}</p>
//                 <p className="text-[11px] text-primary-foreground/25">{s.label}</p>
//               </div>
//             ))}
//           </div>

//           {/* Credentials hint */}
//           <div className="mt-10 rounded-2xl border border-primary-foreground/8 bg-primary-foreground/4 p-5">
//             <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-primary-foreground/30">Demo Credentials</p>
//             <div className="flex flex-col gap-3">
//               {(Object.entries(ROLE_CONFIG) as [UserRole, typeof ROLE_CONFIG[UserRole]][]).map(([role, cfg]) => (
//                 <div key={role} className="flex items-start gap-3">
//                   <div className={cn("mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md", cfg.color)}>
//                     <cfg.icon className="h-3 w-3 text-white" />
//                   </div>
//                   <div>
//                     <p className="text-xs font-semibold text-primary-foreground/60">{cfg.label}</p>
//                     <p className="font-mono text-[11px] text-primary-foreground/30">{cfg.email} · {cfg.password}</p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//         <p className="relative text-[11px] text-primary-foreground/15">© 2026 FinLend Technologies Pvt. Ltd.</p>
//       </div>

//       {/* Right form */}
//       <div className="flex w-full flex-col justify-center px-6 py-12 lg:max-w-[520px] lg:px-16">
//         <button
//           onClick={() => subStep === "none" ? setStep("landing") : setSubStep("none")}
//           className="mb-10 flex items-center gap-2 self-start text-sm text-primary-foreground/30 transition-colors hover:text-primary-foreground/60"
//         >
//           <ArrowLeft className="h-4 w-4" />Back
//         </button>

//         <div className="w-full max-w-sm mx-auto lg:mx-0">
//           <div className="mb-6">
//             <h1 className="text-2xl font-bold text-primary-foreground" style={{ fontFamily: "var(--font-heading)" }}>
//               {getTitle()}
//             </h1>
//             <p className="mt-2 text-sm text-primary-foreground/35">
//               {getSubtitle()}
//             </p>
//           </div>

//           {/* Mode toggle - Only show on main steps */}
//           {subStep === "none" && (
//             <div className="mb-6 flex rounded-xl border border-primary-foreground/8 bg-primary-foreground/4 p-1">
//               {/* Changed order to ["register", "login"] */}
//               {(["register", "login"] as AuthMode[]).map((m) => (
//                 <button
//                   key={m}
//                   onClick={() => handleModeSwitch(m)}
//                   className={cn(
//                     "flex-1 rounded-lg py-2.5 text-sm font-medium transition-all",
//                     mode === m
//                       ? "bg-primary-foreground text-primary shadow-sm"
//                       : "text-primary-foreground/40 hover:text-primary-foreground/60"
//                   )}
//                 >
//                   {m === "login" ? "Sign In" : "Register"}
//                 </button>
//               ))}
//             </div>
//           )}

//           {/* Role selector — only on normal login */}
//           {mode === "login" && subStep === "none" && (
//             <div className="mb-5">
//               <p className="mb-2.5 text-xs font-medium text-primary-foreground/30 uppercase tracking-wider">Login as</p>
//               <div className="grid grid-cols-3 gap-2">
//                 {(Object.entries(ROLE_CONFIG) as [UserRole, typeof ROLE_CONFIG[UserRole]][]).map(([role, cfg]) => (
//                   <button
//                     key={role}
//                     onClick={() => { setSelectedRole(role); setLoginError("") }}
//                     className={cn(
//                       "flex flex-col items-center gap-1.5 rounded-xl border p-3 text-center transition-all",
//                       selectedRole === role
//                         ? "border-accent bg-accent/10 shadow-sm shadow-accent/10"
//                         : "border-primary-foreground/8 bg-primary-foreground/3 hover:bg-primary-foreground/6"
//                     )}
//                   >
//                     <div className={cn("flex h-8 w-8 items-center justify-center rounded-lg", cfg.color)}>
//                       <cfg.icon className="h-4 w-4 text-white" />
//                     </div>
//                     <span className={cn("text-[11px] font-semibold leading-tight", selectedRole === role ? "text-accent" : "text-primary-foreground/40")}>
//                       {cfg.label}
//                     </span>
//                   </button>
//                 ))}
//               </div>
//             </div>
//           )}

//           <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
            
//             {/* --- INITIAL LOGIN / REGISTER FIELDS --- */}
//             {subStep === "none" && (
//               <>
//                 {mode === "register" && (
//                   <div>
//                     <div className="relative">
//                       <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-primary-foreground/20" />
//                       <Input name="name" placeholder="Full name" className={cn("h-12 rounded-xl border-primary-foreground/8 bg-primary-foreground/4 pl-11 text-sm text-primary-foreground placeholder:text-primary-foreground/20 focus:border-accent", formErrors.name && "border-destructive/50")} />
//                     </div>
//                     {formErrors.name && <p className="mt-1.5 text-[11px] text-destructive">{formErrors.name}</p>}
//                   </div>
//                 )}
//                 <div>
//                   <div className="relative">
//                     <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-primary-foreground/20" />
//                     <Input
//                       name="email"
//                       type="email"
//                       placeholder={mode === "login" ? config.email : "Email address"}
//                       className={cn("h-12 rounded-xl border-primary-foreground/8 bg-primary-foreground/4 pl-11 text-sm text-primary-foreground placeholder:text-primary-foreground/20 focus:border-accent", formErrors.email && "border-destructive/50")}
//                     />
//                   </div>
//                   {formErrors.email && <p className="mt-1.5 text-[11px] text-destructive">{formErrors.email}</p>}
//                 </div>
//                 <div>
//                   <div className="relative">
//                     <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-primary-foreground/20" />
//                     <Input
//                       name="password"
//                       type={showPassword ? "text" : "password"}
//                       placeholder={mode === "login" ? config.password : "Create password"}
//                       className={cn("h-12 rounded-xl border-primary-foreground/8 bg-primary-foreground/4 pl-11 pr-11 text-sm text-primary-foreground placeholder:text-primary-foreground/20 focus:border-accent", formErrors.password && "border-destructive/50")}
//                     />
//                     <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-primary-foreground/20 hover:text-primary-foreground/50">
//                       {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
//                     </button>
//                   </div>
//                   {formErrors.password && <p className="mt-1.5 text-[11px] text-destructive">{formErrors.password}</p>}
//                 </div>

//                 {/* FORGOT PASSWORD LINK (Only on Login) */}
//                 {mode === "login" && (
//                   <div className="flex justify-end mt-1">
//                     <button 
//                       type="button" 
//                       onClick={() => setSubStep("forgot-password")} 
//                       className="text-xs font-medium text-accent hover:text-accent/80 transition-colors"
//                     >
//                       Forgot password?
//                     </button>
//                   </div>
//                 )}
//               </>
//             )}

//             {/* --- OTP FIELD (For Register Verification) --- */}
//             {subStep === "verify-otp" && (
//               <div>
//                 <div className="relative">
//                   <Shield className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-primary-foreground/20" />
//                   <Input name="otp" placeholder="Enter 6-digit OTP" className={cn("h-12 rounded-xl border-primary-foreground/8 bg-primary-foreground/4 pl-11 text-sm tracking-widest text-primary-foreground placeholder:tracking-normal placeholder:text-primary-foreground/20 focus:border-accent", formErrors.otp && "border-destructive/50")} />
//                 </div>
//                 {formErrors.otp && <p className="mt-1.5 text-[11px] text-destructive">{formErrors.otp}</p>}
//               </div>
//             )}

//             {/* --- FORGOT PASSWORD (Email Field) --- */}
//             {subStep === "forgot-password" && (
//               <div>
//                 <div className="relative">
//                   <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-primary-foreground/20" />
//                   <Input name="email" type="email" placeholder="Enter your email" defaultValue={tempData.email} className={cn("h-12 rounded-xl border-primary-foreground/8 bg-primary-foreground/4 pl-11 text-sm text-primary-foreground placeholder:text-primary-foreground/20 focus:border-accent", formErrors.email && "border-destructive/50")} />
//                 </div>
//                 {formErrors.email && <p className="mt-1.5 text-[11px] text-destructive">{formErrors.email}</p>}
//               </div>
//             )}

//             {/* --- RESET PASSWORD (OTP + New Password) --- */}
//             {subStep === "reset-password" && (
//               <>
//                 <div>
//                   <div className="relative">
//                     <Shield className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-primary-foreground/20" />
//                     <Input name="otp" placeholder="Enter OTP" className={cn("h-12 rounded-xl border-primary-foreground/8 bg-primary-foreground/4 pl-11 text-sm tracking-widest text-primary-foreground placeholder:tracking-normal placeholder:text-primary-foreground/20 focus:border-accent", formErrors.otp && "border-destructive/50")} />
//                   </div>
//                   {formErrors.otp && <p className="mt-1.5 text-[11px] text-destructive">{formErrors.otp}</p>}
//                 </div>
//                 <div>
//                   <div className="relative">
//                     <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-primary-foreground/20" />
//                     <Input name="newPassword" type={showPassword ? "text" : "password"} placeholder="New Password" className={cn("h-12 rounded-xl border-primary-foreground/8 bg-primary-foreground/4 pl-11 pr-11 text-sm text-primary-foreground placeholder:text-primary-foreground/20 focus:border-accent", formErrors.newPassword && "border-destructive/50")} />
//                     <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-primary-foreground/20 hover:text-primary-foreground/50">
//                       {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
//                     </button>
//                   </div>
//                   {formErrors.newPassword && <p className="mt-1.5 text-[11px] text-destructive">{formErrors.newPassword}</p>}
//                 </div>
//               </>
//             )}

//             {/* --- ERROR MESSAGE --- */}
//             {loginError && (
//               <div className="rounded-xl border border-destructive/20 bg-destructive/8 px-4 py-3">
//                 <p className="text-xs text-destructive">{loginError}</p>
//               </div>
//             )}

//             {/* --- DYNAMIC SUBMIT BUTTON --- */}
//             <Button
//               type="submit"
//               className="mt-1 h-12 gap-2 rounded-xl bg-primary-foreground text-primary font-semibold hover:bg-primary-foreground/90 transition-all shadow-lg shadow-primary-foreground/10"
//               disabled={loading}
//             >
//               {loading ? (
//                 <><Loader2 className="h-4 w-4 animate-spin" /> Processing...</>
//               ) : (
//                 <>
//                   {subStep === "none" && (mode === "login" ? "Sign In" : "Create Account")}
//                   {subStep === "verify-otp" && "Verify OTP"}
//                   {subStep === "forgot-password" && "Send Reset Link"}
//                   {subStep === "reset-password" && "Set New Password"}
//                   <ArrowRight className="h-4 w-4" />
//                 </>
//               )}
//             </Button>
//           </form>

//           {/* Quick fill hint (Only on normal login) */}
//           {mode === "login" && subStep === "none" && (
//             <div className="mt-5 rounded-xl border border-primary-foreground/5 bg-primary-foreground/3 p-4">
//               <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-primary-foreground/20">{config.label} Credentials</p>
//               <p className="font-mono text-xs text-primary-foreground/40">{config.email} / {config.password}</p>
//             </div>
//           )}

//           <p className="mt-6 text-center text-[11px] text-primary-foreground/15">
//             By continuing, you agree to our Terms of Service and Privacy Policy.
//           </p>
//         </div>
//       </div>
//     </div>
//   )
// }


// "use client"

// import { useState } from "react"
// import { useOnboarding } from "@/lib/onboarding-context"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Eye, EyeOff, Mail, Lock, User, ArrowLeft, ArrowRight, Loader2, Shield, Users, Building2 } from "lucide-react"
// import { type AuthMode, type UserRole } from "@/lib/types"
// import { cn } from "@/lib/utils"
// import { useToast } from "@/components/SimpleToast" 

// const ROLE_CONFIG = {
//   user: {
//     label: "Borrower",
//     icon: Users,
//     color: "bg-blue-500",
//     lightColor: "bg-blue-50 border-blue-200 text-blue-700",
//   },
//   admin: {
//     label: "Super Admin",
//     icon: Shield,
//     color: "bg-violet-500",
//     lightColor: "bg-violet-50 border-violet-200 text-violet-700",
//   },
//   "nbfc-admin": {
//     label: "NBFC Admin",
//     icon: Building2,
//     color: "bg-emerald-500",
//     lightColor: "bg-emerald-50 border-emerald-200 text-emerald-700",
//   },
// }

// const API_BASE_URL = "http://localhost:5000/api/auth"

// export function AuthForm() {
//   const { setStep, setIsAuthenticated, setUserRole, completeStep, updateProfile } = useOnboarding()
//   const { showToast } = useToast()

//   const [mode, setMode] = useState<AuthMode>("register")
//   // By default, everyone will log in as a standard "user" now since the selection buttons are gone.
//   const [selectedRole, setSelectedRole] = useState<UserRole>("user") 
//   const [showPassword, setShowPassword] = useState(false)
//   const [loading, setLoading] = useState(false)
//   const [formErrors, setFormErrors] = useState<Record<string, string>>({})

//   const [subStep, setSubStep] = useState<"none" | "verify-otp" | "forgot-password" | "verify-reset-otp" | "enter-new-password">("none")
//   const [tempData, setTempData] = useState({ email: "", name: "", otp: "" })

//   const validateForm = (formData: FormData): boolean => {
//     const errors: Record<string, string> = {}
    
//     if (subStep === "none") {
//       const email = formData.get("email") as string
//       const password = formData.get("password") as string
//       if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Please enter a valid email"
//       if (!password || password.length < 6) errors.password = "Password must be at least 6 characters"
//       if (mode === "register") {
//         const name = formData.get("name") as string
//         if (!name || name.trim().length < 2) errors.name = "Name is required"
//       }
//     } else if (subStep === "verify-otp" || subStep === "verify-reset-otp") {
//       const otp = formData.get("otp") as string
//       if (!otp || otp.length < 5) errors.otp = "Please enter a valid OTP"
//     } else if (subStep === "forgot-password") {
//       const email = formData.get("email") as string
//       if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Please enter a valid email"
//     } else if (subStep === "enter-new-password") {
//       const newPassword = formData.get("newPassword") as string
//       if (!newPassword || newPassword.length < 6) errors.newPassword = "Password must be at least 6 characters"
//     }

//     setFormErrors(errors)
//     return Object.keys(errors).length === 0
//   }

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault()
//     const formData = new FormData(e.currentTarget)
//     if (!validateForm(formData)) return
    
//     setLoading(true)

//     try {
//       if (subStep === "none") {
//         if (mode === "login") {
//           const email = formData.get("email") as string
//           const password = formData.get("password") as string

//           const res = await fetch(`${API_BASE_URL}/login`, {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             credentials: "include",
//             body: JSON.stringify({ email, password })
//           })
//           const data = await res.json()
          
//           if (!res.ok) throw new Error(data.message || "Invalid credentials.")

//           showToast("Login successful!", "success")

//           setIsAuthenticated(true)
//           setUserRole(selectedRole)
//           completeStep("auth")
//           if (selectedRole === "admin") setStep("admin")
//           else if (selectedRole === "nbfc-admin") setStep("nbfc-admin")
//           else setStep("chatbot")

//         } else {
//           const name = formData.get("name") as string
//           const email = formData.get("email") as string
//           const password = formData.get("password") as string

//           const res = await fetch(`${API_BASE_URL}/register`, {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             credentials: "include",
//             body: JSON.stringify({ name, email, password })
//           })
//           const data = await res.json()
          
//           if (!res.ok) throw new Error(data.message || "Registration failed")
          
//           setTempData({ ...tempData, email, name })
//           setSubStep("verify-otp")
//           showToast("OTP sent to your email!", "success")
//         }
//       } 
//       else if (subStep === "verify-otp") {
//         const otp = formData.get("otp") as string
//         const res = await fetch(`${API_BASE_URL}/verify-email`, {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           credentials: "include",
//           body: JSON.stringify({ email: tempData.email, otp })
//         })
//         const data = await res.json()
        
//         if (!res.ok) throw new Error(data.message || "Invalid OTP")

//         setIsAuthenticated(true)
//         setUserRole("user")
//         updateProfile({ fullName: tempData.name })
//         completeStep("auth")
//         setStep("chatbot")
//       }
//       else if (subStep === "forgot-password") {
//         const email = formData.get("email") as string
//         const res = await fetch(`${API_BASE_URL}/forgot-password`, {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           credentials: "include",
//           body: JSON.stringify({ email })
//         })
//         const data = await res.json()
        
//         if (!res.ok) throw new Error(data.message || "Failed to send reset email")

//         setTempData({ ...tempData, email })
//         setSubStep("verify-reset-otp")
//         showToast("Password reset OTP sent to your email.", "success")
//       }
//       else if (subStep === "verify-reset-otp") {
//         const otp = formData.get("otp") as string
//         setTempData({ ...tempData, otp }) 
//         setSubStep("enter-new-password")
//       }
//       else if (subStep === "enter-new-password") {
//         const newPassword = formData.get("newPassword") as string
//         const res = await fetch(`${API_BASE_URL}/reset-password`, {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           credentials: "include",
//           body: JSON.stringify({ email: tempData.email, otp: tempData.otp, newPassword })
//         })
//         const data = await res.json()
        
//         if (!res.ok) throw new Error(data.message || "Failed to reset password")

//         setSubStep("none")
//         setMode("login")
//         showToast("Password reset successful. Please log in.", "success")
//       }
//     } catch (err: any) {
//       showToast(err.message, "error") 
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleModeSwitch = (m: AuthMode) => {
//     setMode(m)
//     setSubStep("none")
//     setFormErrors({})
//   }

//   const getTitle = () => {
//     if (subStep === "verify-otp" || subStep === "verify-reset-otp") return "Verify your email"
//     if (subStep === "forgot-password") return "Forgot Password"
//     if (subStep === "enter-new-password") return "Reset Password"
//     return mode === "login" ? "Welcome back" : "Create account"
//   }

//   const getSubtitle = () => {
//     if (subStep === "verify-otp" || subStep === "verify-reset-otp") return `We sent an OTP to ${tempData.email}`
//     if (subStep === "forgot-password") return "Enter your email to receive an OTP."
//     if (subStep === "enter-new-password") return "Create a new secure password."
//     return mode === "login" ? "Sign in to your account." : "Start your loan application in minutes."
//   }

//   return (
//     <div className="flex min-h-screen bg-primary">
      
//       <div className="relative hidden flex-1 flex-col justify-between p-10 lg:flex">
//         <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_20%_80%,rgba(100,180,130,0.08),transparent)]" />
//         <div className="relative">
//           <button onClick={() => setStep("landing")} className="flex items-center gap-2.5 transition-opacity hover:opacity-70">
//             <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent">
//               <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-accent-foreground">
//                 <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//               </svg>
//             </div>
//             <span className="text-lg font-bold text-primary-foreground" style={{ fontFamily: "var(--font-heading)" }}>FinLend</span>
//           </button>
//         </div>
//         <div className="relative max-w-md">
//           <h2 className="text-4xl font-bold leading-tight text-primary-foreground" style={{ fontFamily: "var(--font-heading)" }}>
//             Smart lending<br />starts here.
//           </h2>
//           <p className="mt-4 text-sm leading-relaxed text-primary-foreground/35">
//             AI-powered loan applications with instant verification, personalized offers, and bank-grade security. Join 50,000+ borrowers who chose the smarter way.
//           </p>
//           <div className="mt-8 flex items-center gap-6 border-t border-primary-foreground/5 pt-8">
//             {[
//               { value: "< 5 min", label: "Approval time" },
//               { value: "50K+", label: "Loans approved" },
//               { value: "4.8/5", label: "User rating" },
//             ].map((s) => (
//               <div key={s.label}>
//                 <p className="text-lg font-bold text-primary-foreground" style={{ fontFamily: "var(--font-heading)" }}>{s.value}</p>
//                 <p className="text-[11px] text-primary-foreground/25">{s.label}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//         <p className="relative text-[11px] text-primary-foreground/15">© 2026 FinLend Technologies Pvt. Ltd.</p>
//       </div>

//       <div className="flex w-full flex-col justify-center px-6 py-12 lg:max-w-[520px] lg:px-16">
//         <button
//           onClick={() => subStep === "none" ? setStep("landing") : setSubStep("none")}
//           className="mb-10 flex items-center gap-2 self-start text-sm text-primary-foreground/30 transition-colors hover:text-primary-foreground/60"
//         >
//           <ArrowLeft className="h-4 w-4" />Back
//         </button>

//         <div className="w-full max-w-sm mx-auto lg:mx-0">
//           <div className="mb-6">
//             <h1 className="text-2xl font-bold text-primary-foreground" style={{ fontFamily: "var(--font-heading)" }}>
//               {getTitle()}
//             </h1>
//             <p className="mt-2 text-sm text-primary-foreground/35">
//               {getSubtitle()}
//             </p>
//           </div>

//           {subStep === "none" && (
//             <div className="mb-6 flex rounded-xl border border-primary-foreground/8 bg-primary-foreground/4 p-1">
//               {(["register", "login"] as AuthMode[]).map((m) => (
//                 <button
//                   key={m}
//                   onClick={() => handleModeSwitch(m)}
//                   className={cn(
//                     "flex-1 rounded-lg py-2.5 text-sm font-medium transition-all",
//                     mode === m
//                       ? "bg-primary-foreground text-primary shadow-sm"
//                       : "text-primary-foreground/40 hover:text-primary-foreground/60"
//                   )}
//                 >
//                   {m === "login" ? "Sign In" : "Register"}
//                 </button>
//               ))}
//             </div>
//           )}

//           <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
            
//             {subStep === "none" && (
//               <>
//                 {mode === "register" && (
//                   <div>
//                     <div className="relative">
//                       <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-primary-foreground/20" />
//                       <Input name="name" placeholder="Full name" className={cn("h-12 rounded-xl border-primary-foreground/8 bg-primary-foreground/4 pl-11 text-sm text-primary-foreground placeholder:text-primary-foreground/20 focus:border-accent", formErrors.name && "border-destructive/50")} />
//                     </div>
//                     {formErrors.name && <p className="mt-1.5 text-[11px] text-destructive">{formErrors.name}</p>}
//                   </div>
//                 )}
//                 <div>
//                   <div className="relative">
//                     <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-primary-foreground/20" />
//                     <Input
//                       name="email"
//                       type="email"
//                       placeholder="Email address"
//                       className={cn("h-12 rounded-xl border-primary-foreground/8 bg-primary-foreground/4 pl-11 text-sm text-primary-foreground placeholder:text-primary-foreground/20 focus:border-accent", formErrors.email && "border-destructive/50")}
//                     />
//                   </div>
//                   {formErrors.email && <p className="mt-1.5 text-[11px] text-destructive">{formErrors.email}</p>}
//                 </div>
//                 <div>
//                   <div className="relative">
//                     <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-primary-foreground/20" />
//                     <Input
//                       name="password"
//                       type={showPassword ? "text" : "password"}
//                       placeholder={mode === "login" ? "Enter password" : "Create password"}
//                       className={cn("h-12 rounded-xl border-primary-foreground/8 bg-primary-foreground/4 pl-11 pr-11 text-sm text-primary-foreground placeholder:text-primary-foreground/20 focus:border-accent", formErrors.password && "border-destructive/50")}
//                     />
//                     <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-primary-foreground/20 hover:text-primary-foreground/50">
//                       {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
//                     </button>
//                   </div>
//                   {formErrors.password && <p className="mt-1.5 text-[11px] text-destructive">{formErrors.password}</p>}
//                 </div>

//                 {mode === "login" && (
//                   <div className="flex justify-end mt-1">
//                     <button 
//                       type="button" 
//                       onClick={() => setSubStep("forgot-password")} 
//                       className="text-xs font-medium text-accent hover:text-accent/80 transition-colors"
//                     >
//                       Forgot password?
//                     </button>
//                   </div>
//                 )}
//               </>
//             )}

//             {(subStep === "verify-otp" || subStep === "verify-reset-otp") && (
//               <div>
//                 <div className="relative">
//                   <Shield className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-primary-foreground/20" />
//                   <Input name="otp" placeholder="Enter 6-digit OTP" className={cn("h-12 rounded-xl border-primary-foreground/8 bg-primary-foreground/4 pl-11 text-sm tracking-widest text-primary-foreground placeholder:tracking-normal placeholder:text-primary-foreground/20 focus:border-accent", formErrors.otp && "border-destructive/50")} />
//                 </div>
//                 {formErrors.otp && <p className="mt-1.5 text-[11px] text-destructive">{formErrors.otp}</p>}
//               </div>
//             )}

//             {subStep === "forgot-password" && (
//               <div>
//                 <div className="relative">
//                   <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-primary-foreground/20" />
//                   <Input name="email" type="email" placeholder="Enter your email" defaultValue={tempData.email} className={cn("h-12 rounded-xl border-primary-foreground/8 bg-primary-foreground/4 pl-11 text-sm text-primary-foreground placeholder:text-primary-foreground/20 focus:border-accent", formErrors.email && "border-destructive/50")} />
//                 </div>
//                 {formErrors.email && <p className="mt-1.5 text-[11px] text-destructive">{formErrors.email}</p>}
//               </div>
//             )}

//             {subStep === "enter-new-password" && (
//               <div>
//                 <div className="relative">
//                   <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-primary-foreground/20" />
//                   <Input name="newPassword" type={showPassword ? "text" : "password"} placeholder="New Password" className={cn("h-12 rounded-xl border-primary-foreground/8 bg-primary-foreground/4 pl-11 pr-11 text-sm text-primary-foreground placeholder:text-primary-foreground/20 focus:border-accent", formErrors.newPassword && "border-destructive/50")} />
//                   <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-primary-foreground/20 hover:text-primary-foreground/50">
//                     {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
//                   </button>
//                 </div>
//                 {formErrors.newPassword && <p className="mt-1.5 text-[11px] text-destructive">{formErrors.newPassword}</p>}
//               </div>
//             )}

//             <Button
//               type="submit"
//               className="mt-1 h-12 gap-2 rounded-xl bg-primary-foreground text-primary font-semibold hover:bg-primary-foreground/90 transition-all shadow-lg shadow-primary-foreground/10"
//               disabled={loading}
//             >
//               {loading ? (
//                 <><Loader2 className="h-4 w-4 animate-spin" /> Processing...</>
//               ) : (
//                 <>
//                   {subStep === "none" && (mode === "login" ? "Sign In" : "Create Account")}
//                   {(subStep === "verify-otp" || subStep === "verify-reset-otp") && "Verify OTP"}
//                   {subStep === "forgot-password" && "Send Reset Link"}
//                   {subStep === "enter-new-password" && "Set New Password"}
//                   <ArrowRight className="h-4 w-4" />
//                 </>
//               )}
//             </Button>
//           </form>

//           <p className="mt-6 text-center text-[11px] text-primary-foreground/15">
//             By continuing, you agree to our Terms of Service and Privacy Policy.
//           </p>
//         </div>
//       </div>
//     </div>
//   )
// }



"use client"

import { useState, useEffect } from "react"
import { useOnboarding } from "@/lib/onboarding-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Eye, EyeOff, Mail, Lock, User, ArrowLeft, ArrowRight, Loader2, Shield, Phone, MessageSquare, Clock3 } from "lucide-react"
import { type AuthMode } from "@/lib/types"
import { cn } from "@/lib/utils"
import { useToast } from "@/components/SimpleToast" 

const API_BASE_URL = "http://localhost:5000/api/auth"

export function AuthForm() {
  const { setStep, setIsAuthenticated, setUserRole, completeStep, updateProfile } = useOnboarding()
  const { showToast } = useToast()

  const [mode, setMode] = useState<AuthMode>("login")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  
  // OTP method choice state
  const [otpMethod, setOtpMethod] = useState<"email" | "sms">("email")

  const [subStep, setSubStep] = useState<"none" | "verify-otp" | "forgot-password" | "verify-reset-otp" | "enter-new-password" | "verify-login-otp">("none")
  const [tempData, setTempData] = useState({ email: "", name: "", otp: "" })

  // new state for OTP countdown timer
  const [countdown, setCountdown] = useState(60)

  // new effect to handle OTP countdown
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if ((subStep === "verify-otp" || subStep === "verify-reset-otp" || subStep === "verify-login-otp") && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer); 
  }, [subStep, countdown]);

  const validateForm = (formData: FormData): boolean => {
    const errors: Record<string, string> = {}
    
    if (subStep === "none") {
      const email = formData.get("email") as string
      const password = formData.get("password") as string
      
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Please enter a valid email"
      if (!password || password.length < 6) errors.password = "Password must be at least 6 characters"
      
      if (mode === "register") {
        const name = formData.get("name") as string
        const phoneNumber = formData.get("phoneNumber") as string

        if (!name || name.trim().length < 2) errors.name = "Name is required"
        if (!phoneNumber || phoneNumber.length < 10) errors.phoneNumber = "Please enter a valid phone number"
      }
    } 
    else if (subStep === "verify-otp" || subStep === "verify-reset-otp" || subStep === "verify-login-otp") {
      const otp = formData.get("otp") as string
      if (!otp || otp.length < 5) errors.otp = "Please enter a valid OTP"
      if (countdown === 0) errors.otp = "OTP has expired. Please go back and try again." // Expiry validation
    } 
    else if (subStep === "forgot-password") {
      const email = formData.get("email") as string
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Please enter a valid email"
    } 
    else if (subStep === "enter-new-password") {
      const newPassword = formData.get("newPassword") as string
      const confirmPassword = formData.get("confirmPassword") as string
      
      if (!newPassword || newPassword.length < 6) errors.newPassword = "Password must be at least 6 characters"
      if (newPassword !== confirmPassword) errors.confirmPassword = "Passwords do not match" 
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    if (!validateForm(formData)) return
    
    setLoading(true)

    try {
      if (subStep === "none") {
        if (mode === "login") {
          const email = formData.get("email") as string
          const password = formData.get("password") as string

          const res = await fetch(`${API_BASE_URL}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ email, password, otpMethod }) 
          })
          const data = await res.json()
          
          if (!res.ok) throw new Error(data.message || "Invalid credentials.")

          if (data.requiresOtp) {
            setTempData({ ...tempData, email })
            setSubStep("verify-login-otp")
            setCountdown(60) 
            showToast(`OTP sent to your ${otpMethod.toUpperCase()}!`, "success")
            setLoading(false)
            return;
          }

          showToast("Login successful!", "success")
          const rawRole = data.user?.role || "BORROWER";
          const formattedRole = rawRole.toUpperCase().replace(" ", "_");
          setIsAuthenticated(true)
          
          setTimeout(() => {
             if (formattedRole === "SUPER_ADMIN") {
               setUserRole("admin")
               setStep("admin")
             } else if (formattedRole === "NBFC_ADMIN") {
               setUserRole("nbfc-admin")
               setStep("nbfc-admin")
             } else {
               setUserRole("user")
               setStep("chatbot")
             }
          }, 50);
          completeStep("auth")

        } else {
          const name = formData.get("name") as string
          const email = formData.get("email") as string
          const phoneNumber = formData.get("phoneNumber") as string
          const password = formData.get("password") as string

          const res = await fetch(`${API_BASE_URL}/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ name, email, phoneNumber, password, otpMethod })
          })
          const data = await res.json()
          
          if (!res.ok) throw new Error(data.message || "Registration failed")
          
          setTempData({ ...tempData, email, name })
          setSubStep("verify-otp")
          setCountdown(60) 
          showToast(`OTP sent to your ${otpMethod.toUpperCase()}!`, "success")
        }
      } 
      else if (subStep === "verify-login-otp") {
        const otp = formData.get("otp") as string
        const res = await fetch(`${API_BASE_URL}/verify-login-otp`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ email: tempData.email, otp })
        })
        const data = await res.json()
        
        if (!res.ok) throw new Error(data.message || "Invalid OTP or Expired")

        showToast("Login successful!", "success")
        setIsAuthenticated(true)

        const rawRole = data.user?.role || "BORROWER";
        const formattedRole = rawRole.toUpperCase().replace(" ", "_");
        
        setTimeout(() => {
           if (formattedRole === "SUPER_ADMIN") {
             setUserRole("admin")
             setStep("admin")
           } else if (formattedRole === "NBFC_ADMIN") {
             setUserRole("nbfc-admin")
             setStep("nbfc-admin")
           } else {
             setUserRole("user")
             setStep("chatbot")
           }
        }, 50);
        completeStep("auth")
      }
      else if (subStep === "verify-otp") {
        const otp = formData.get("otp") as string
        const res = await fetch(`${API_BASE_URL}/verify-email`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ email: tempData.email, otp })
        })
        const data = await res.json()
        
        if (!res.ok) throw new Error(data.message || "Invalid OTP or Expired")

        setIsAuthenticated(true)
        setUserRole("user")
        updateProfile({ fullName: tempData.name })
        completeStep("auth")
        setStep("chatbot")
      }
      else if (subStep === "forgot-password") {
        const email = formData.get("email") as string
        const res = await fetch(`${API_BASE_URL}/forgot-password`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ email })
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.message || "Failed to send reset email")
        setTempData({ ...tempData, email })
        setSubStep("verify-reset-otp")
        setCountdown(60) 
        showToast("Password reset OTP sent to your email.", "success")
      }
      else if (subStep === "verify-reset-otp") {
        const otp = formData.get("otp") as string
        setTempData({ ...tempData, otp }) 
        setSubStep("enter-new-password")
      }
      else if (subStep === "enter-new-password") {
        const newPassword = formData.get("newPassword") as string
        const confirmPassword = formData.get("confirmPassword") as string
        const res = await fetch(`${API_BASE_URL}/reset-password`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ email: tempData.email, otp: tempData.otp, newPassword, confirmPassword })
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.message || "Failed to reset password")
        setSubStep("none")
        setMode("login")
        showToast("Password reset successful. Please log in.", "success")
      }
    } catch (err: any) {
      showToast(err.message, "error") 
    } finally {
      setLoading(false)
    }
  }

  const handleModeSwitch = (m: AuthMode) => {
    setMode(m)
    setSubStep("none")
    setFormErrors({})
  }

  const getTitle = () => {
    if (subStep === "verify-login-otp") return "2-Step Verification"
    if (subStep === "verify-otp" || subStep === "verify-reset-otp") return "Verify OTP"
    if (subStep === "forgot-password") return "Forgot Password"
    if (subStep === "enter-new-password") return "Reset Password"
    return mode === "login" ? "Welcome back" : "Create account"
  }

  const getSubtitle = () => {
    if (subStep === "verify-login-otp" || subStep === "verify-otp" || subStep === "verify-reset-otp") return `We sent an OTP to ${tempData.email}`
    if (subStep === "forgot-password") return "Enter your email to receive an OTP."
    if (subStep === "enter-new-password") return "Create a new secure password."
    return mode === "login" ? "Sign in to your account." : "Start your loan application in minutes."
  }

  return (
    <div className="flex min-h-screen bg-primary">
      
      <div className="relative hidden flex-1 flex-col justify-between p-10 lg:flex">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_20%_80%,rgba(100,180,130,0.08),transparent)]" />
        <div className="relative">
          <button onClick={() => setStep("landing")} className="flex items-center gap-2.5 transition-opacity hover:opacity-70">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-accent-foreground">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="text-lg font-bold text-primary-foreground" style={{ fontFamily: "var(--font-heading)" }}>FinLend</span>
          </button>
        </div>
        <div className="relative max-w-md">
          <h2 className="text-4xl font-bold leading-tight text-primary-foreground" style={{ fontFamily: "var(--font-heading)" }}>
            Smart lending<br />starts here.
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-primary-foreground/35">
            AI-powered loan applications with instant verification, personalized offers, and bank-grade security. Join 50,000+ borrowers who chose the smarter way.
          </p>
          <div className="mt-8 flex items-center gap-6 border-t border-primary-foreground/5 pt-8">
            {[
              { value: "< 5 min", label: "Approval time" },
              { value: "50K+", label: "Loans approved" },
              { value: "4.8/5", label: "User rating" },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-lg font-bold text-primary-foreground" style={{ fontFamily: "var(--font-heading)" }}>{s.value}</p>
                <p className="text-[11px] text-primary-foreground/25">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
        <p className="relative text-[11px] text-primary-foreground/15">© 2026 FinLend Technologies Pvt. Ltd.</p>
      </div>

      <div className="flex w-full flex-col justify-center px-6 py-12 lg:max-w-[520px] lg:px-16">
        <button
          onClick={() => {
            if(subStep === "none") setStep("landing")
            else { setSubStep("none"); setCountdown(60); }
          }}
          className="mb-10 flex items-center gap-2 self-start text-sm text-primary-foreground/30 transition-colors hover:text-primary-foreground/60"
        >
          <ArrowLeft className="h-4 w-4" />Back
        </button>

        <div className="w-full max-w-sm mx-auto lg:mx-0">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-primary-foreground" style={{ fontFamily: "var(--font-heading)" }}>
              {getTitle()}
            </h1>
            <p className="mt-2 text-sm text-primary-foreground/35">
              {getSubtitle()}
            </p>
          </div>

          {subStep === "none" && (
            <div className="mb-6 flex rounded-xl border border-primary-foreground/8 bg-primary-foreground/4 p-1">
              {(["login", "register"] as AuthMode[]).map((m) => (
                <button
                  key={m}
                  onClick={() => handleModeSwitch(m)}
                  className={cn(
                    "flex-1 rounded-lg py-2.5 text-sm font-medium transition-all",
                    mode === m
                      ? "bg-primary-foreground text-primary shadow-sm"
                      : "text-primary-foreground/40 hover:text-primary-foreground/60"
                  )}
                >
                  {m === "login" ? "Sign In" : "Register"}
                </button>
              ))}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
            
            {subStep === "none" && (
              <>
                {mode === "register" && (
                  <>
                    <div>
                      <div className="relative">
                        <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-primary-foreground/20" />
                        <Input name="name" placeholder="Full name" className={cn("h-12 rounded-xl border-primary-foreground/8 bg-primary-foreground/4 pl-11 text-sm text-primary-foreground placeholder:text-primary-foreground/20 focus:border-accent", formErrors.name && "border-destructive/50")} />
                      </div>
                      {formErrors.name && <p className="mt-1.5 text-[11px] text-destructive">{formErrors.name}</p>}
                    </div>
                    <div>
                      <div className="relative">
                        <Phone className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-primary-foreground/20" />
                        <Input name="phoneNumber" type="tel" placeholder="Phone number (+91...)" className={cn("h-12 rounded-xl border-primary-foreground/8 bg-primary-foreground/4 pl-11 text-sm text-primary-foreground placeholder:text-primary-foreground/20 focus:border-accent", formErrors.phoneNumber && "border-destructive/50")} />
                      </div>
                      {formErrors.phoneNumber && <p className="mt-1.5 text-[11px] text-destructive">{formErrors.phoneNumber}</p>}
                    </div>
                  </>
                )}
                
                <div>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-primary-foreground/20" />
                    <Input
                      name="email"
                      type="email"
                      placeholder="Email address"
                      className={cn("h-12 rounded-xl border-primary-foreground/8 bg-primary-foreground/4 pl-11 text-sm text-primary-foreground placeholder:text-primary-foreground/20 focus:border-accent", formErrors.email && "border-destructive/50")}
                    />
                  </div>
                  {formErrors.email && <p className="mt-1.5 text-[11px] text-destructive">{formErrors.email}</p>}
                </div>

                <div>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-primary-foreground/20" />
                    <Input
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder={mode === "login" ? "Enter password" : "Create password"}
                      className={cn("h-12 rounded-xl border-primary-foreground/8 bg-primary-foreground/4 pl-11 pr-11 text-sm text-primary-foreground placeholder:text-primary-foreground/20 focus:border-accent", formErrors.password && "border-destructive/50")}
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-primary-foreground/20 hover:text-primary-foreground/50">
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {formErrors.password && <p className="mt-1.5 text-[11px] text-destructive">{formErrors.password}</p>}
                </div>

                {/* OTP Choice UI */}
                <div className="mt-2 flex items-center justify-between rounded-xl border border-primary-foreground/8 bg-primary-foreground/4 p-3">
                  <span className="text-xs font-medium text-primary-foreground/60 flex items-center gap-1.5">
                    <Shield className="h-3.5 w-3.5" /> Receive OTP via:
                  </span>
                  <div className="flex rounded-lg border border-primary-foreground/10 bg-primary-foreground/5 p-0.5">
                    <button type="button" onClick={() => setOtpMethod("email")} className={cn("flex items-center gap-1.5 px-3 py-1 text-[10px] uppercase tracking-wider font-semibold rounded-md transition-all", otpMethod === "email" ? "bg-primary-foreground text-primary shadow-sm" : "text-primary-foreground/40 hover:text-primary-foreground/70")}>
                      <Mail className="h-3 w-3" /> Email
                    </button>
                    <button type="button" onClick={() => setOtpMethod("sms")} className={cn("flex items-center gap-1.5 px-3 py-1 text-[10px] uppercase tracking-wider font-semibold rounded-md transition-all", otpMethod === "sms" ? "bg-primary-foreground text-primary shadow-sm" : "text-primary-foreground/40 hover:text-primary-foreground/70")}>
                      <MessageSquare className="h-3 w-3" /> SMS
                    </button>
                  </div>
                </div>

                {/* Forgot password */}
                {mode === "login" && (
                  <div className="flex justify-end mt-1">
                    <button 
                      type="button" 
                      onClick={() => setSubStep("forgot-password")} 
                      className="text-xs font-medium text-accent hover:text-accent/80 transition-colors"
                    >
                      Forgot password?
                    </button>
                  </div>
                )}
              </>
            )}

            {/* ✅ OTP Input Box with Live Countdown */}
            {(subStep === "verify-otp" || subStep === "verify-reset-otp" || subStep === "verify-login-otp") && (
              <div>
                <div className="relative">
                  <Shield className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-primary-foreground/20" />
                  <Input 
                    name="otp" 
                    placeholder="Enter 6-digit OTP" 
                    disabled={countdown === 0} // Disable input if expired
                    className={cn("h-12 rounded-xl border-primary-foreground/8 bg-primary-foreground/4 pl-11 text-sm tracking-widest text-primary-foreground placeholder:tracking-normal placeholder:text-primary-foreground/20 focus:border-accent disabled:opacity-50", formErrors.otp && "border-destructive/50")} 
                  />
                </div>
                {formErrors.otp && <p className="mt-1.5 text-[11px] text-destructive">{formErrors.otp}</p>}
                
                {/* Timer text */}
                <div className="mt-2 flex items-center justify-end text-xs">
                  {countdown > 0 ? (
                    <span className="flex items-center gap-1.5 text-primary-foreground/50">
                      <Clock3 className="h-3 w-3" />
                      Expires in 00:{countdown.toString().padStart(2, '0')}
                    </span>
                  ) : (
                    <span className="text-destructive font-medium">OTP Expired.</span>
                  )}
                </div>
              </div>
            )}

            {subStep === "forgot-password" && (
              <div>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-primary-foreground/20" />
                  <Input name="email" type="email" placeholder="Enter your email" defaultValue={tempData.email} className={cn("h-12 rounded-xl border-primary-foreground/8 bg-primary-foreground/4 pl-11 text-sm text-primary-foreground placeholder:text-primary-foreground/20 focus:border-accent", formErrors.email && "border-destructive/50")} />
                </div>
                {formErrors.email && <p className="mt-1.5 text-[11px] text-destructive">{formErrors.email}</p>}
              </div>
            )}

            {subStep === "enter-new-password" && (
              <>
                <div>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-primary-foreground/20" />
                    <Input name="newPassword" type={showPassword ? "text" : "password"} placeholder="New Password" className={cn("h-12 rounded-xl border-primary-foreground/8 bg-primary-foreground/4 pl-11 pr-11 text-sm text-primary-foreground placeholder:text-primary-foreground/20 focus:border-accent", formErrors.newPassword && "border-destructive/50")} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-primary-foreground/20 hover:text-primary-foreground/50">
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {formErrors.newPassword && <p className="mt-1.5 text-[11px] text-destructive">{formErrors.newPassword}</p>}
                </div>
                <div>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-primary-foreground/20" />
                    <Input name="confirmPassword" type={showPassword ? "text" : "password"} placeholder="Confirm New Password" className={cn("h-12 rounded-xl border-primary-foreground/8 bg-primary-foreground/4 pl-11 pr-11 text-sm text-primary-foreground placeholder:text-primary-foreground/20 focus:border-accent", formErrors.confirmPassword && "border-destructive/50")} />
                  </div>
                  {formErrors.confirmPassword && <p className="mt-1.5 text-[11px] text-destructive">{formErrors.confirmPassword}</p>}
                </div>
              </>
            )}

            <Button
              type="submit"
              className="mt-2 h-12 gap-2 rounded-xl bg-primary-foreground text-primary font-semibold hover:bg-primary-foreground/90 transition-all shadow-lg shadow-primary-foreground/10 disabled:opacity-50"
              disabled={loading || countdown === 0 && (subStep === "verify-otp" || subStep === "verify-reset-otp" || subStep === "verify-login-otp")}
            >
              {loading ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Processing...</>
              ) : (
                <>
                  {subStep === "none" && (mode === "login" ? "Sign In" : "Create Account")}
                  {(subStep === "verify-otp" || subStep === "verify-reset-otp" || subStep === "verify-login-otp") && "Verify OTP"}
                  {subStep === "forgot-password" && "Send Reset Link"}
                  {subStep === "enter-new-password" && "Set New Password"}
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          <p className="mt-6 text-center text-[11px] text-primary-foreground/15">
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  )
}