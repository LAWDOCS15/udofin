"use client"

import { useState, useRef, useCallback } from "react"
import { useOnboarding } from "@/lib/onboarding-context"
import type { UploadedDocument } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Upload, FileText, Camera, CreditCard, Fingerprint, X, CheckCircle2, AlertCircle, Loader2, ArrowRight, Shield, Lock } from "lucide-react"
import { cn } from "@/lib/utils"

const docTypes = [
  { type: "pan" as const, label: "PAN Card", description: "Permanent Account Number card", icon: CreditCard, accept: "image/*,.pdf", required: true },
  { type: "aadhar" as const, label: "Aadhaar Card", description: "Front and back of your Aadhaar", icon: Fingerprint, accept: "image/*,.pdf", required: true },
  { type: "selfie" as const, label: "Live Selfie", description: "Clear face photo for liveness check", icon: Camera, accept: "image/*", required: true },
  { type: "other" as const, label: "Supporting Docs", description: "Salary slips, bank statements, etc.", icon: FileText, accept: "image/*,.pdf,.doc,.docx", required: false },
]

function FileDropZone({ docType, onFile, uploaded }: { docType: (typeof docTypes)[number]; onFile: (file: File, type: UploadedDocument["type"]) => void; uploaded: boolean }) {
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const Icon = docType.icon

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) onFile(file, docType.type)
  }, [onFile, docType.type])

  return (
    <button
      type="button"
      className={cn(
        "group relative flex w-full flex-col items-center gap-4 rounded-2xl border-2 border-dashed p-8 text-center transition-all duration-300",
        uploaded ? "border-accent/30 bg-accent/3" : isDragging ? "border-primary bg-primary/3 shadow-lg" : "border-border hover:border-foreground/15 hover:bg-card hover:shadow-lg hover:shadow-foreground/3"
      )}
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
    >
      {docType.required && !uploaded && (
        <span className="absolute right-3 top-3 rounded-full bg-primary/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-primary">Required</span>
      )}
      <div className={cn("flex h-14 w-14 items-center justify-center rounded-2xl transition-all duration-300", uploaded ? "bg-accent/10" : "bg-secondary group-hover:bg-primary/10")}>
        {uploaded ? <CheckCircle2 className="h-6 w-6 text-accent" /> : <Icon className="h-6 w-6 text-muted-foreground transition-colors group-hover:text-primary" />}
      </div>
      <div>
        <p className="text-sm font-semibold text-foreground">{docType.label}</p>
        <p className="mt-1 text-xs text-muted-foreground">{docType.description}</p>
      </div>
      {!uploaded && (
        <div className="flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-[11px] font-medium text-muted-foreground transition-all group-hover:border-primary/20 group-hover:text-primary">
          <Upload className="h-3 w-3" />
          Click or drag to upload
        </div>
      )}
      {uploaded && <p className="text-xs font-semibold text-accent">Uploaded</p>}
      <input ref={inputRef} type="file" accept={docType.accept} className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) onFile(f, docType.type); if (inputRef.current) inputRef.current.value = "" }} aria-label={`Upload ${docType.label}`} />
    </button>
  )
}

function UploadedFileItem({ doc, onRemove }: { doc: UploadedDocument; onRemove: (id: string) => void }) {
  const cfg = { uploading: { icon: Loader2, cls: "text-muted-foreground", bg: "bg-secondary", label: "Uploading", spin: true }, uploaded: { icon: CheckCircle2, cls: "text-accent", bg: "bg-accent/10", label: "Uploaded", spin: false }, verified: { icon: CheckCircle2, cls: "text-accent", bg: "bg-accent/10", label: "Verified", spin: false }, error: { icon: AlertCircle, cls: "text-destructive", bg: "bg-destructive/10", label: "Error", spin: false } }
  const s = cfg[doc.status]
  const StatusIcon = s.icon
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 shadow-sm transition-all hover:shadow-md">
      <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg", s.bg)}>
        <StatusIcon className={cn("h-4 w-4", s.cls, s.spin && "animate-spin")} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-foreground">{doc.name}</p>
        <p className={cn("text-[11px]", s.cls)}>{s.label}</p>
      </div>
      <Badge variant="secondary" className="shrink-0 rounded-md text-[9px] uppercase tracking-wider">{doc.type}</Badge>
      <button onClick={() => onRemove(doc.id)} className="shrink-0 rounded-lg p-1.5 text-muted-foreground/50 transition-colors hover:bg-secondary hover:text-foreground" aria-label={`Remove ${doc.name}`}>
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}

export function DocumentUpload() {
  const { documents, addDocument, updateDocumentStatus, removeDocument, completeStep, setStep } = useOnboarding()

  const handleFile = useCallback((file: File, type: UploadedDocument["type"]) => {
    const id = crypto.randomUUID()
    addDocument({ id, name: file.name, type, status: "uploading", file })
    setTimeout(() => updateDocumentStatus(id, "uploaded"), 1500)
    setTimeout(() => updateDocumentStatus(id, "verified"), 3000)
  }, [addDocument, updateDocumentStatus])

  const hasRequired = documents.some((d) => d.type === "pan") && documents.some((d) => d.type === "aadhar") && documents.some((d) => d.type === "selfie")

  return (
    <div className="min-h-screen bg-background pt-16">
      <div className="mx-auto max-w-3xl px-6 py-12 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.2em] text-accent">Step 2 of 4</p>
          <h1 className="text-3xl font-bold tracking-tight text-foreground lg:text-4xl" style={{ fontFamily: "var(--font-heading)" }}>Upload your documents</h1>
          <p className="mt-3 text-muted-foreground leading-relaxed">
            Securely upload your identity documents for instant KYC verification. All files are encrypted end-to-end.
          </p>
        </div>

        <div className="flex flex-col gap-8">
          {/* Upload zones */}
          <div className="grid gap-4 sm:grid-cols-2">
            {docTypes.map((dt) => (
              <FileDropZone key={dt.type} docType={dt} onFile={handleFile} uploaded={documents.some((d) => d.type === dt.type)} />
            ))}
          </div>

          {/* Uploaded files */}
          {documents.length > 0 && (
            <div>
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>Uploaded Files</h3>
                <span className="text-[11px] text-muted-foreground">{documents.filter((d) => d.status === "verified").length}/{documents.length} verified</span>
              </div>
              <div className="flex flex-col gap-2.5">
                {documents.map((doc) => <UploadedFileItem key={doc.id} doc={doc} onRemove={removeDocument} />)}
              </div>
            </div>
          )}

          {/* Security notice */}
          <div className="flex items-start gap-4 rounded-2xl border border-border bg-card p-5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/10">
              <Lock className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Bank-grade encryption</p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                AES-256 encryption in transit and at rest. Documents verified through government APIs and auto-deleted after processing. We are ISO 27001 certified.
              </p>
            </div>
          </div>

          {/* Continue */}
          <div className="flex items-center justify-between rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="text-sm">
              {hasRequired ? (
                <span className="flex items-center gap-2 font-semibold text-accent"><CheckCircle2 className="h-4 w-4" />All required documents uploaded</span>
              ) : (
                <span className="text-muted-foreground">Upload PAN, Aadhaar, and selfie to proceed</span>
              )}
            </div>
            <Button className="gap-2 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 shadow-md" disabled={!hasRequired} onClick={() => { completeStep("documents"); setStep("verification") }}>
              Continue <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
