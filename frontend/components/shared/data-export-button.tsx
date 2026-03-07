// "use client";

// import { Download } from "lucide-react";
// import { Button } from "@/components/ui/button";

// interface DataExportButtonProps {
//   onExport: (format: "csv" | "pdf") => void;
//   label?: string;
// }

// export function DataExportButton({
//   onExport,
//   label = "Export",
// }: DataExportButtonProps) {
//   return (
//     <div className="flex gap-1.5">
//       <Button
//         variant="ghost"
//         onClick={() => onExport("csv")}
//         className="h-9 gap-2 rounded-xl border border-border text-xs text-muted-foreground hover:bg-secondary"
//       >
//         <Download className="h-3.5 w-3.5" /> CSV
//       </Button>
//       <Button
//         variant="ghost"
//         onClick={() => onExport("pdf")}
//         className="h-9 gap-2 rounded-xl border border-border text-xs text-muted-foreground hover:bg-secondary"
//       >
//         <Download className="h-3.5 w-3.5" /> PDF
//       </Button>
//     </div>
//   );
// }


"use client";

import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataExportButtonProps } from "@/types"; // Jo interface humne types file mein banaya tha

export function DataExportButton({
  onExportCSV,
  onExportPDF,
}: DataExportButtonProps) {
  return (
    <div className="flex gap-1.5">
      <Button
        variant="ghost"
        onClick={onExportCSV} // ✨ onExport("csv") ki jagah direct function use kiya
        className="h-9 gap-2 rounded-xl border border-border text-xs text-muted-foreground hover:bg-secondary"
      >
        <Download className="h-3.5 w-3.5" /> CSV
      </Button>
      <Button
        variant="ghost"
        onClick={onExportPDF} // ✨ onExport("pdf") ki jagah direct function use kiya
        className="h-9 gap-2 rounded-xl border border-border text-xs text-muted-foreground hover:bg-secondary"
      >
        <Download className="h-3.5 w-3.5" /> PDF
      </Button>
    </div>
  );
}