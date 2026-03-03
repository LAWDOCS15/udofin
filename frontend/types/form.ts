// ─── Form Validation Types ──────────────────────────────────────────────────

export interface ValidationRule {
  required?: boolean
  minLength?: number
  maxLength?: number
  pattern?: RegExp
  custom?: (value: string) => boolean | string
  errorMessage?: string
}

export interface FormErrors {
  [field: string]: string | null
}
