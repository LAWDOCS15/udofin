// "use client"

// import { useOnboarding } from "@/lib/onboarding-context"
// import { Button } from "@/components/ui/button"
// import { Menu, X, ArrowUpRight, LogOut, Shield, Building2, Users } from "lucide-react"
// import { useState, useEffect } from "react"
// import { usePathname, useRouter } from "next/navigation"

// const ROLE_LABELS = { user: "Borrower", admin: "Super Admin", "nbfc-admin": "NBFC Admin" }
// const ROLE_ICONS = { user: Users, admin: Shield, "nbfc-admin": Building2 }

// export function Header() {
//   const pathname = usePathname()
//   const router = useRouter()
//   const { isAuthenticated, userRole, logout } = useOnboarding()
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
//   const [scrolled, setScrolled] = useState(false)

//   useEffect(() => {
//     const handleScroll = () => setScrolled(window.scrollY > 10)
//     window.addEventListener("scroll", handleScroll, { passive: true })
//     return () => window.removeEventListener("scroll", handleScroll)
//   }, [])

//   const isHero = pathname === "/"
//   const isDark = !scrolled && isHero
//   const isAdminView = pathname === "/admin" || pathname === "/nbfc-admin"
//   const headerBg = scrolled || !isHero
//     ? "bg-card/90 backdrop-blur-xl border-b border-border/50 shadow-[0_1px_3px_0_rgba(0,0,0,0.03)]"
//     : "bg-transparent border-b border-transparent"

//   const navItems = [
//     { key: "/", label: "Home", always: true },
//     { key: "/onboarding", label: "Apply", always: false, roles: ["user"] },
//     { key: "/dashboard", label: "Dashboard", always: false, roles: ["user"] },
//   ]

//   const handleLogout = () => {
//     logout()
//     router.push("/")
//   }

//   const RoleIcon = userRole ? ROLE_ICONS[userRole] : Users

//   return (
//     <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${headerBg}`}>
//       <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:h-[68px] lg:px-8">
//         {/* Logo */}
//         <button onClick={() => router.push("/")} className="flex items-center gap-2.5 transition-opacity hover:opacity-70">
//           <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent">
//             <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-accent-foreground">
//               <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//             </svg>
//           </div>
//           <span className={`text-base font-bold tracking-tight transition-colors ${isDark ? "text-primary-foreground" : "text-foreground"}`} style={{ fontFamily: "var(--font-heading)" }}>
//             FinLend
//           </span>
//         </button>

//         {/* Desktop Nav */}
//         <nav className="hidden items-center gap-1 md:flex">
//           {navItems.map((item) => {
//             const isActive = pathname === item.key
//             const disabled = !item.always && (!isAuthenticated || (item.roles && userRole && !item.roles.includes(userRole)))
//             return (
//               <button
//                 key={item.key}
//                 onClick={() => !disabled && router.push(item.key)}
//                 disabled={!!disabled}
//                 className={`rounded-full px-4 py-2 text-[13px] font-medium transition-all ${
//                   isActive
//                     ? isDark ? "text-primary-foreground bg-primary-foreground/8" : "text-foreground bg-foreground/5"
//                     : isDark ? "text-primary-foreground/50 hover:text-primary-foreground/80" : "text-muted-foreground hover:text-foreground"
//                 } ${disabled ? "cursor-not-allowed opacity-25" : ""}`}
//               >
//                 {item.label}
//               </button>
//             )
//           })}
//         </nav>

//         {/* Desktop Actions */}
//         <div className="hidden items-center gap-2.5 md:flex">
//           {isAuthenticated ? (
//             <div className="flex items-center gap-3">
//               <div className="flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-3 py-1.5">
//                 <RoleIcon className="h-3.5 w-3.5 text-accent" />
//                 <span className="text-[12px] font-medium text-foreground">{userRole ? ROLE_LABELS[userRole] : ""}</span>
//               </div>
//               <button onClick={handleLogout} className={`flex items-center gap-1.5 text-[13px] font-medium transition-colors ${isDark ? "text-primary-foreground/40 hover:text-primary-foreground/70" : "text-muted-foreground hover:text-foreground"}`}>
//                 <LogOut className="h-3.5 w-3.5" />
//                 Sign out
//               </button>
//             </div>
//           ) : (
//             <>
//               <button onClick={() => router.push("/auth")} className={`text-[13px] font-medium transition-colors ${isDark ? "text-primary-foreground/50 hover:text-primary-foreground/80" : "text-muted-foreground hover:text-foreground"}`}>
//                 Sign in
//               </button>
//               <Button size="sm" className="h-9 gap-1.5 rounded-full bg-primary px-5 text-[13px] font-semibold text-primary-foreground hover:bg-primary/90 shadow-sm" onClick={() => router.push("/auth")}>
//                 Get started <ArrowUpRight className="h-3.5 w-3.5" />
//               </Button>
//             </>
//           )}
//         </div>

//         {/* Mobile toggle */}
//         <button className={`flex items-center justify-center rounded-lg p-2 md:hidden ${isDark ? "text-primary-foreground/60" : "text-muted-foreground"}`} onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
//           {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
//         </button>
//       </div>

//       {/* Mobile Menu */}
//       {mobileMenuOpen && (
//         <div className="animate-fade-in border-t border-border/50 bg-card/95 backdrop-blur-xl md:hidden">
//           <nav className="flex flex-col gap-1 px-6 py-4">
//             {navItems.map((item) => {
//               const disabled = !item.always && !isAuthenticated
//               return (
//                 <button key={item.key} onClick={() => { if (!disabled) { router.push(item.key); setMobileMenuOpen(false) } }} disabled={disabled}
//                   className={`rounded-xl px-4 py-3 text-left text-sm font-medium transition-colors hover:bg-secondary ${pathname === item.key ? "bg-secondary text-foreground" : "text-muted-foreground"} ${disabled ? "cursor-not-allowed opacity-25" : ""}`}>
//                   {item.label}
//                 </button>
//               )
//             })}
//             <div className="mt-3 flex flex-col gap-2 border-t border-border pt-4">
//               {isAuthenticated ? (
//                 <button onClick={() => { handleLogout(); setMobileMenuOpen(false) }} className="w-full rounded-xl px-4 py-3 text-left text-sm font-medium text-muted-foreground hover:bg-secondary">
//                   Sign out
//                 </button>
//               ) : (
//                 <Button className="w-full rounded-xl bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => { router.push("/auth"); setMobileMenuOpen(false) }}>
//                   Get started
//                 </Button>
//               )}
//             </div>
//           </nav>
//         </div>
//       )}
//     </header>
//   )
// }


"use client"

import { useOnboarding } from "@/lib/onboarding-context"
import { Button } from "@/components/ui/button"
import { Menu, X, ArrowUpRight, LogOut, Shield, Building2, Users } from "lucide-react"
import { useState, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"

const ROLE_LABELS = { user: "Borrower", admin: "Super Admin", "nbfc-admin": "NBFC Admin" }
const ROLE_ICONS = { user: Users, admin: Shield, "nbfc-admin": Building2 }

export function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const { isAuthenticated, userRole, logout, userProfile, user } = useOnboarding()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const isHero = pathname === "/"
  const isDark = !scrolled && isHero
  const headerBg = scrolled || !isHero
    ? "bg-card/90 backdrop-blur-xl border-b border-border/50 shadow-[0_1px_3px_0_rgba(0,0,0,0.03)]"
    : "bg-transparent border-b border-transparent"

  const navItems = [
    { key: "/", label: "Home", always: true },
    { key: "/onboarding", label: "Apply", always: false, roles: ["user"] },
    { key: "/dashboard", label: "Dashboard", always: false, roles: ["user"] },
  ]

  const handleLogout = async () => {
    await logout()
  }

  const RoleIcon = userRole ? ROLE_ICONS[userRole] : Users

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${headerBg}`}>
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:h-[68px] lg:px-8">
        <button onClick={() => router.push("/")} className="flex items-center gap-2.5 transition-opacity hover:opacity-70">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-accent-foreground">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className={`text-base font-bold tracking-tight transition-colors ${isDark ? "text-primary-foreground" : "text-foreground"}`} style={{ fontFamily: "var(--font-heading)" }}>
            FinLend
          </span>
        </button>

        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => {
            const isActive = pathname === item.key
            const disabled = !item.always && (!isAuthenticated || (item.roles && userRole && !item.roles.includes(userRole)))
            return (
              <button
                key={item.key}
                onClick={() => !disabled && router.push(item.key)}
                disabled={!!disabled}
                className={`rounded-full px-4 py-2 text-[13px] font-medium transition-all ${
                  isActive
                    ? isDark ? "text-primary-foreground bg-primary-foreground/8" : "text-foreground bg-foreground/5"
                    : isDark ? "text-primary-foreground/50 hover:text-primary-foreground/80" : "text-muted-foreground hover:text-foreground"
                } ${disabled ? "cursor-not-allowed opacity-25" : ""}`}
              >
                {item.label}
              </button>
            )
          })}
        </nav>

        <div className="hidden items-center gap-2.5 md:flex">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-3 py-1.5">
                <RoleIcon className="h-3.5 w-3.5 text-accent" />
                <span className="text-[12px] font-medium text-foreground">
                  {userProfile?.fullName || user?.name || (userRole ? ROLE_LABELS[userRole] : "")}
                </span>
              </div>
              <button onClick={handleLogout} className={`flex items-center gap-1.5 text-[13px] font-medium transition-colors ${isDark ? "text-primary-foreground/40 hover:text-primary-foreground/70" : "text-muted-foreground hover:text-foreground"}`}>
                <LogOut className="h-3.5 w-3.5" />
                Sign out
              </button>
            </div>
          ) : (
            <>
              <button onClick={() => router.push("/auth")} className={`text-[13px] font-medium transition-colors ${isDark ? "text-primary-foreground/50 hover:text-primary-foreground/80" : "text-muted-foreground hover:text-foreground"}`}>
                Sign in
              </button>
              <Button size="sm" className="h-9 gap-1.5 rounded-full bg-primary px-5 text-[13px] font-semibold text-primary-foreground hover:bg-primary/90 shadow-sm" onClick={() => router.push("/auth")}>
                Get started <ArrowUpRight className="h-3.5 w-3.5" />
              </Button>
            </>
          )}
        </div>

        <button className={`flex items-center justify-center rounded-lg p-2 md:hidden ${isDark ? "text-primary-foreground/60" : "text-muted-foreground"}`} onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
    </header>
  )
}