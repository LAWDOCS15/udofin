import { CheckCircle2 } from "lucide-react";

const footerColumns = [
  {
    heading: "Product",
    items: [
      "Personal Loans",
      "Business Loans",
      "Credit Score",
      "EMI Calculator",
    ],
  },
  { heading: "Company", items: ["About Us", "Careers", "Blog", "Contact"] },
  {
    heading: "Legal",
    items: ["Privacy Policy", "Terms of Service", "Compliance"],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-6 py-14 lg:px-8">
        <div className="flex flex-col gap-10 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-xs">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="text-primary-foreground"
                >
                  <path
                    d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <span
                className="text-base font-bold text-foreground"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                FinLend
              </span>
            </div>
            <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
              AI-powered lending platform making credit accessible, transparent,
              and instant for everyone.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-10 text-sm sm:grid-cols-3">
            {footerColumns.map((col) => (
              <div key={col.heading}>
                <p className="mb-3.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground/40">
                  {col.heading}
                </p>
                <div className="flex flex-col gap-2.5">
                  {col.items.map((l) => (
                    <span
                      key={l}
                      className="text-muted-foreground transition-colors hover:text-foreground cursor-pointer"
                    >
                      {l}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-border pt-8 sm:flex-row">
          <p className="text-xs text-muted-foreground/50">
            {"2026 FinLend Technologies Pvt. Ltd. All rights reserved."}
          </p>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-accent" />
            <span className="text-xs text-muted-foreground/50">
              RBI Registered NBFC Partner
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
