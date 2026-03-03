"use client"

import { useState, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard, FileText, Calendar, PlusCircle, FolderOpen, User,
  Bell, HelpCircle, ChevronLeft, ChevronRight, LogOut, Menu, X
} from "lucide-react"
import { useOnboarding } from "@/lib/onboarding-context"

type NavItem = { path: string; label: string; icon: React.ReactNode; badge?: number }

const NAV_ITEMS: NavItem[] = [
  { path: "/user", label: "Dashboard", icon: <LayoutDashboard className="h-4 w-4" /> },
  { path: "/user/loans", label: "My Loans", icon: <FileText className="h-4 w-4" /> },
  { path: "/user/emi", label: "EMI Calendar", icon: <Calendar className="h-4 w-4" /> },
  { path: "/user/apply", label: "Apply for Loan", icon: <PlusCircle className="h-4 w-4" /> },
  { path: "/user/documents", label: "Documents", icon: <FolderOpen className="h-4 w-4" /> },
  { path: "/user/profile", label: "Profile", icon: <User className="h-4 w-4" /> },
  { path: "/user/notifications", label: "Notifications", icon: <Bell className="h-4 w-4" />, badge: 2 },
  { path: "/user/support", label: "Support", icon: <HelpCircle className="h-4 w-4" /> },
]

interface UserShellProps {
  children: React.ReactNode
}

export function UserShell({ children }: UserShellProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { logout } = useOnboarding()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  // Close mobile menu on resize
  useEffect(() => {
    const handler = () => { if (window.innerWidth >= 768) setMobileOpen(false) }
    window.addEventListener("resize", handler)
    return () => window.removeEventListener("resize", handler)
  }, [])

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) document.body.style.overflow = "hidden"
    else document.body.style.overflow = ""
    return () => { document.body.style.overflow = "" }
  }, [mobileOpen])

  const handleNav = (path: string) => {
    router.push(path)
  }

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const SidebarContent = ({ isMobile = false }: { isMobile?: boolean }) => (
    <>
      <div className="flex items-center justify-between px-4 py-4 border-b border-border">
        {(!collapsed || isMobile) && (
          <span className="text-sm font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>
            My Account
          </span>
        )}
        {!isMobile && (
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="h-7 w-7 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
          >
            {collapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronLeft className="h-3.5 w-3.5" />}
          </button>
        )}
        {isMobile && (
          <button
            onClick={() => setMobileOpen(false)}
            className="h-7 w-7 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
      <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-1">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.path
          return (
            <button
              key={item.path}
              onClick={() => handleNav(item.path)}
              className={cn(
                "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150 relative",
                isActive
                  ? "bg-accent/10 text-accent"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground",
              )}
              title={collapsed && !isMobile ? item.label : undefined}
            >
              <span className="shrink-0">{item.icon}</span>
              {(!collapsed || isMobile) && <span>{item.label}</span>}
              {item.badge && item.badge > 0 && (
                <span className={cn(
                  "flex items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white",
                  collapsed && !isMobile ? "absolute -right-0.5 -top-0.5 h-4 w-4" : "ml-auto h-4 min-w-[16px] px-1",
                )}>
                  {item.badge}
                </span>
              )}
              {isActive && (!collapsed || isMobile) && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r-full bg-accent" />
              )}
            </button>
          )
        })}
      </nav>
      <div className="border-t border-border px-2 py-3">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          {(!collapsed || isMobile) && <span>Sign Out</span>}
        </button>
      </div>
    </>
  )

  return (
    <div className="flex min-h-screen bg-background pt-16">
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden animate-in fade-in duration-150"
          onClick={() => setMobileOpen(false)} />
      )}

      {/* Mobile Sidebar */}
      <aside className={cn(
        "fixed left-0 top-16 z-50 flex h-[calc(100vh-4rem)] w-64 flex-col border-r border-border bg-card md:hidden transition-transform duration-300",
        mobileOpen ? "translate-x-0" : "-translate-x-full",
      )}>
        <SidebarContent isMobile />
      </aside>

      {/* Desktop Sidebar */}
      <aside className={cn(
        "hidden md:flex fixed left-0 top-16 z-30 h-[calc(100vh-4rem)] flex-col border-r border-border bg-card transition-all duration-300",
        collapsed ? "w-16" : "w-60",
      )}>
        <SidebarContent />
      </aside>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed left-4 top-[4.5rem] z-30 flex h-9 w-9 items-center justify-center rounded-xl bg-card border border-border shadow-sm md:hidden"
      >
        <Menu className="h-4 w-4 text-foreground" />
      </button>

      {/* Main Content */}
      <main className={cn(
        "flex-1 transition-all duration-300",
        "md:ml-60",
        collapsed && "md:ml-16",
      )}>
        <div className="animate-in fade-in duration-300">
          {children}
        </div>
      </main>
    </div>
  )
}
