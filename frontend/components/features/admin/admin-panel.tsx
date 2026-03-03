"use client";

import { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  FileText,
  Building2,
  BarChart3,
  Settings,
  Shield,
  HeadphonesIcon,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Bell,
  Menu,
  X,
} from "lucide-react";
import { AdminDashboardView } from "./admin-dashboard-view";
import { AdminUsers } from "./admin-users";
import { AdminApplications } from "./admin-applications";
import { AdminNbfcManagement } from "./admin-nbfc-management";
import { AdminReports } from "./admin-reports";
import { AdminSettings } from "./admin-settings";
import { AdminAuditLogs } from "./admin-audit-logs";
import { AdminSupportTickets } from "./admin-support-tickets";

type Tab =
  | "dashboard"
  | "users"
  | "applications"
  | "nbfc"
  | "reports"
  | "settings"
  | "audit"
  | "support";

const NAV: { id: Tab; label: string; icon: React.ReactNode; badge?: number }[] =
  [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard className="h-4 w-4" />,
    },
    { id: "users", label: "Users", icon: <Users className="h-4 w-4" /> },
    {
      id: "applications",
      label: "Applications",
      icon: <FileText className="h-4 w-4" />,
      badge: 3,
    },
    {
      id: "nbfc",
      label: "NBFC Partners",
      icon: <Building2 className="h-4 w-4" />,
    },
    {
      id: "reports",
      label: "Reports",
      icon: <BarChart3 className="h-4 w-4" />,
    },
    {
      id: "settings",
      label: "Settings",
      icon: <Settings className="h-4 w-4" />,
    },
    { id: "audit", label: "Audit Logs", icon: <Shield className="h-4 w-4" /> },
    {
      id: "support",
      label: "Support Tickets",
      icon: <HeadphonesIcon className="h-4 w-4" />,
    },
  ];

export function AdminPanel() {
  const [tab, setTab] = useState<Tab>("dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [transitioning, setTransitioning] = useState(false);

  // Close mobile menu on resize
  useEffect(() => {
    const handler = () => {
      if (window.innerWidth >= 768) setMobileOpen(false);
    };
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  // Lock scroll on mobile menu
  useEffect(() => {
    if (mobileOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const handleTabChange = useCallback(
    (newTab: Tab) => {
      if (newTab === tab) return;
      setTransitioning(true);
      setTimeout(() => {
        setTab(newTab);
        setMobileOpen(false);
        // Short delay then show content
        requestAnimationFrame(() => setTransitioning(false));
      }, 100);
    },
    [tab],
  );

  const renderContent = () => {
    switch (tab) {
      case "dashboard":
        return <AdminDashboardView />;
      case "users":
        return <AdminUsers />;
      case "applications":
        return <AdminApplications />;
      case "nbfc":
        return <AdminNbfcManagement />;
      case "reports":
        return <AdminReports />;
      case "settings":
        return <AdminSettings />;
      case "audit":
        return <AdminAuditLogs />;
      case "support":
        return <AdminSupportTickets />;
    }
  };

  const SidebarContent = ({ isMobile = false }: { isMobile?: boolean }) => (
    <>
      <div className="flex items-center justify-between px-4 py-4 border-b border-border">
        {(!collapsed || isMobile) && (
          <span
            className="text-sm font-bold text-foreground"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Admin Panel
          </span>
        )}
        {!isMobile && (
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="h-7 w-7 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
          >
            {collapsed ? (
              <ChevronRight className="h-3.5 w-3.5" />
            ) : (
              <ChevronLeft className="h-3.5 w-3.5" />
            )}
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
        {NAV.map((item) => (
          <button
            key={item.id}
            onClick={() => handleTabChange(item.id)}
            title={collapsed && !isMobile ? item.label : undefined}
            className={cn(
              "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150 relative",
              tab === item.id
                ? "bg-accent/10 text-accent"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground",
            )}
          >
            <span className="shrink-0">{item.icon}</span>
            {(!collapsed || isMobile) && <span>{item.label}</span>}
            {item.badge && item.badge > 0 && (
              <span
                className={cn(
                  "flex items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white",
                  collapsed && !isMobile
                    ? "absolute -right-0.5 -top-0.5 h-4 w-4"
                    : "ml-auto h-4 min-w-[16px] px-1",
                )}
              >
                {item.badge}
              </span>
            )}
            {tab === item.id && (!collapsed || isMobile) && (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r-full bg-accent" />
            )}
          </button>
        ))}
      </nav>
      <div className="border-t border-border px-2 py-3">
        <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors">
          <LogOut className="h-4 w-4" />
          {(!collapsed || isMobile) && <span>Logout</span>}
        </button>
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen bg-background pt-16">
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden animate-in fade-in duration-150"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-16 z-50 flex h-[calc(100vh-4rem)] w-64 flex-col border-r border-border bg-card md:hidden transition-transform duration-300",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <SidebarContent isMobile />
      </aside>

      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden md:flex fixed left-0 top-16 z-30 h-[calc(100vh-4rem)] flex-col border-r border-border bg-card transition-all duration-300",
          collapsed ? "w-16" : "w-60",
        )}
      >
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
      <main
        className={cn(
          "flex-1 transition-all duration-300",
          collapsed ? "md:ml-16" : "md:ml-60",
        )}
      >
        <div
          className={cn(
            "transition-all duration-200",
            transitioning
              ? "opacity-0 translate-y-1"
              : "opacity-100 translate-y-0",
          )}
        >
          {renderContent()}
        </div>
      </main>
    </div>
  );
}
