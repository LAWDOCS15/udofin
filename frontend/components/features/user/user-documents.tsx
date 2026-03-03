"use client"

import { useState, useRef } from "react"
import { cn } from "@/lib/utils"
import { LoanStatusBadge } from "@/components/shared/loan-status-badge"
import { Button } from "@/components/ui/button"
import { Upload, FileText, Camera, CreditCard, Fingerprint, CheckCircle2, AlertCircle, X, Eye, RefreshCw, Trash2 } from "lucide-react"
import type { KYCDocument } from "@/types"

interface DocState extends KYCDocument {
  file?: File | null
}

const INITIAL_DOCS: DocState[] = [
  { id: "D1", type: "aadhaar", fileName: "aadhaar_front.jpg", status: "verified", uploadedAt: "2025-12-10" },
  { id: "D2", type: "pan", fileName: "pan_card.jpg", status: "verified", uploadedAt: "2025-12-10" },
  { id: "D3", type: "income_proof", fileName: "salary_slip_jan26.pdf", status: "pending", uploadedAt: "2026-02-01" },
  { id: "D4", type: "bank_statement", fileName: "hdfc_statement.pdf", status: "verified", uploadedAt: "2025-12-15" },
  { id: "D5", type: "address_proof", fileName: "", status: "pending", uploadedAt: "" },
  { id: "D6", type: "photo", fileName: "", status: "pending", uploadedAt: "" },
]

const DOC_ICONS: Record<string, React.ElementType> = {
  aadhaar: Fingerprint,
  pan: CreditCard,
  income_proof: FileText,
  bank_statement: FileText,
  address_proof: FileText,
  photo: Camera,
  other: FileText,
}

const DOC_LABELS: Record<string, string> = {
  aadhaar: "Aadhaar Card",
  pan: "PAN Card",
  income_proof: "Income Proof",
  bank_statement: "Bank Statement",
  address_proof: "Address Proof",
  photo: "Passport Photo",
  other: "Other Document",
}

const ACCEPT_MAP: Record<string, string> = {
  aadhaar: "image/*,.pdf",
  pan: "image/*,.pdf",
  income_proof: ".pdf,image/*",
  bank_statement: ".pdf",
  address_proof: "image/*,.pdf",
  photo: "image/*",
  other: "image/*,.pdf",
}

export function UserDocuments() {
  const [docs, setDocs] = useState<DocState[]>(INITIAL_DOCS)
  const [uploading, setUploading] = useState<string | null>(null)
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({})

  const verified = docs.filter((d) => d.status === "verified").length
  const total = docs.length

  const handleFileSelect = (docId: string, file: File) => {
    setUploading(docId)
    // Simulate upload delay
    setTimeout(() => {
      setDocs((prev) =>
        prev.map((d) =>
          d.id === docId
            ? { ...d, fileName: file.name, file, status: "pending" as const, uploadedAt: new Date().toISOString().split("T")[0] }
            : d,
        ),
      )
      setUploading(null)
    }, 1200)
  }

  const handleRemove = (docId: string) => {
    setDocs((prev) =>
      prev.map((d) =>
        d.id === docId ? { ...d, fileName: "", file: null, status: "pending" as const, uploadedAt: "" } : d,
      ),
    )
  }

  const triggerUpload = (docId: string) => {
    fileInputRefs.current[docId]?.click()
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card">
        <div className="px-6 py-6 lg:px-8">
          <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>My Documents</h1>
          <p className="text-xs text-muted-foreground mt-1">Upload, update, and manage your KYC documents</p>
        </div>
      </div>

      <div className="px-6 py-6 lg:px-8">
        {/* KYC Progress */}
        <div className="rounded-2xl border border-border bg-card p-6 mb-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>KYC Status</h2>
            <span className={cn(
              "text-xs font-semibold px-3 py-1 rounded-full",
              verified === total ? "bg-accent/15 text-accent" : "bg-yellow-500/15 text-yellow-600",
            )}>
              {verified}/{total} Verified
            </span>
          </div>
          <div className="h-2 rounded-full bg-secondary overflow-hidden">
            <div className="h-full rounded-full bg-accent transition-all duration-500" style={{ width: `${(verified / total) * 100}%` }} />
          </div>
          <p className="text-[10px] text-muted-foreground mt-2">
            {verified === total ? "All documents verified! Your KYC is complete." : `Upload and verify ${total - verified} more document(s) to complete KYC.`}
          </p>
        </div>

        {/* Documents Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {docs.map((doc) => {
            const Icon = DOC_ICONS[doc.type] || FileText
            const isUploading = uploading === doc.id

            return (
              <div key={doc.id} className="rounded-2xl border border-border bg-card p-5 flex flex-col gap-3 transition-all hover:shadow-sm">
                {/* Hidden file input */}
                <input
                  ref={(el) => { fileInputRefs.current[doc.id] = el }}
                  type="file"
                  accept={ACCEPT_MAP[doc.type] || "image/*,.pdf"}
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) handleFileSelect(doc.id, file)
                    e.target.value = ""
                  }}
                />

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-xl",
                      doc.status === "verified" ? "bg-accent/10" : "bg-secondary",
                    )}>
                      <Icon className={cn("h-5 w-5", doc.status === "verified" ? "text-accent" : "text-muted-foreground")} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{DOC_LABELS[doc.type]}</p>
                      <p className="text-[10px] text-muted-foreground truncate max-w-[140px]">
                        {doc.fileName || "Not uploaded"}
                      </p>
                    </div>
                  </div>
                  <LoanStatusBadge status={doc.status} />
                </div>

                {/* Upload Progress */}
                {isUploading && (
                  <div className="space-y-1.5 animate-in fade-in duration-200">
                    <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                      <div className="h-full bg-accent rounded-full animate-[progress_1.2s_ease-in-out]" style={{ width: "100%" }} />
                    </div>
                    <p className="text-[10px] text-accent font-medium">Uploading...</p>
                  </div>
                )}

                {/* Status & Actions */}
                {!isUploading && (
                  <>
                    {doc.status === "verified" && doc.fileName ? (
                      <div className="space-y-2">
                        <div className="flex items-center gap-1.5 text-[10px] text-accent">
                          <CheckCircle2 className="h-3 w-3" /> Verified on {doc.uploadedAt}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            onClick={() => triggerUpload(doc.id)}
                            className="h-7 rounded-lg text-[10px] gap-1 flex-1 border-border"
                          >
                            <RefreshCw className="h-3 w-3" /> Re-upload
                          </Button>
                          <Button variant="outline" className="h-7 rounded-lg text-[10px] gap-1 flex-1 border-border">
                            <Eye className="h-3 w-3" /> View
                          </Button>
                        </div>
                      </div>
                    ) : doc.fileName ? (
                      <div className="space-y-2">
                        <div className="flex items-center gap-1.5 text-[10px] text-yellow-600">
                          <AlertCircle className="h-3 w-3" /> Verification pending
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            onClick={() => triggerUpload(doc.id)}
                            className="h-7 rounded-lg text-[10px] gap-1 flex-1 border-border"
                          >
                            <RefreshCw className="h-3 w-3" /> Update
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => handleRemove(doc.id)}
                            className="h-7 rounded-lg text-[10px] gap-1 border-red-500/20 text-red-500 hover:bg-red-500/5"
                          >
                            <Trash2 className="h-3 w-3" /> Remove
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <Button
                        onClick={() => triggerUpload(doc.id)}
                        className="h-9 rounded-lg bg-accent text-accent-foreground hover:bg-accent/90 text-[11px] font-semibold gap-1.5 w-full"
                      >
                        <Upload className="h-3.5 w-3.5" /> Upload Document
                      </Button>
                    )}
                  </>
                )}
              </div>
            )
          })}
        </div>

        {/* Info */}
        <div className="mt-6 rounded-2xl border border-accent/15 bg-accent/5 p-4 flex items-start gap-3">
          <AlertCircle className="h-4 w-4 text-accent shrink-0 mt-0.5" />
          <div className="text-[11px] text-muted-foreground space-y-1">
            <p className="font-semibold text-foreground">Document Upload Guidelines</p>
            <p>Accepted formats: JPG, PNG, PDF. Max file size: 5MB per document.</p>
            <p>Ensure all documents are clear, readable, and up to date. Verified documents can still be re-uploaded if needed.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
