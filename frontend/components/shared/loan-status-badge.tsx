"use client";

import { cn } from "@/lib/utils";

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-yellow-500/15 text-yellow-600 border-yellow-500/20",
  approved: "bg-accent/15 text-accent border-accent/20",
  disbursed: "bg-blue-500/15 text-blue-500 border-blue-500/20",
  rejected: "bg-red-500/15 text-red-500 border-red-500/20",
  running: "bg-accent/15 text-accent border-accent/20",
  completed: "bg-blue-500/15 text-blue-500 border-blue-500/20",
  overdue: "bg-red-500/15 text-red-600 border-red-500/20",
  "pending-emi": "bg-amber-500/15 text-amber-600 border-amber-500/20",
  "under-review": "bg-violet-500/15 text-violet-600 border-violet-500/20",
  paid: "bg-accent/15 text-accent border-accent/20",
  upcoming: "bg-yellow-500/15 text-yellow-600 border-yellow-500/20",
  active: "bg-accent/15 text-accent border-accent/20",
  inactive: "bg-secondary text-muted-foreground border-border",
  suspended: "bg-red-500/15 text-red-500 border-red-500/20",
  blocked: "bg-red-500/15 text-red-500 border-red-500/20",
  verified: "bg-accent/15 text-accent border-accent/20",
  open: "bg-yellow-500/15 text-yellow-600 border-yellow-500/20",
  "in-progress": "bg-blue-500/15 text-blue-500 border-blue-500/20",
  resolved: "bg-accent/15 text-accent border-accent/20",
  closed: "bg-secondary text-muted-foreground border-border",
  failed: "bg-red-500/15 text-red-500 border-red-500/20",
};

interface LoanStatusBadgeProps {
  status: string;
  className?: string;
}

export function LoanStatusBadge({ status, className }: LoanStatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-block px-2.5 py-1 rounded-full text-[10px] font-semibold capitalize border",
        STATUS_STYLES[status] ||
          "bg-secondary text-muted-foreground border-border",
        className,
      )}
    >
      {status.replace(/-/g, " ")}
    </span>
  );
}
