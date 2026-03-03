// ─── Onboarding / Auth Flow Types ───────────────────────────────────────────

export type OnboardingStep =
  | "landing"
  | "auth"
  | "onboarding"
  | "documents"
  | "verification"
  | "dashboard"
  | "admin"
  | "nbfc-admin"

/** Map a Next.js pathname to its OnboardingStep name */
export function stepFromPathname(pathname: string): OnboardingStep {
  const clean = pathname.replace(/^\/+/, "")
  if (!clean) return "landing"
  return clean as OnboardingStep
}

/** Map an OnboardingStep to its Next.js route path */
export function pathFromStep(step: OnboardingStep): string {
  return step === "landing" ? "/" : `/${step}`
}

export type AuthMode = "login" | "register"

export type UserRole = "user" | "admin" | "nbfc-admin"

export interface LoginCredentials {
  email: string
  password: string
  role: UserRole
}

export const DEMO_CREDENTIALS: LoginCredentials[] = [
  { email: "user@finlend.ai", password: "user1234", role: "user" },
  { email: "admin@finlend.ai", password: "admin1234", role: "admin" },
  { email: "nbfc@finlend.ai", password: "nbfc1234", role: "nbfc-admin" },
]

export interface UserProfile {
  fullName: string
  dateOfBirth: string
  address: string
  employmentType: string
  monthlyIncome: string
  loanAmount: string
  loanTenure: string
  consentKYC: boolean
  consentCBIL: boolean
}

export interface ChatMessage {
  id: string
  role: "bot" | "user"
  content: string
  options?: string[]
  type?: "text" | "options" | "consent" | "input"
  field?: keyof UserProfile
}

export interface UploadedDocument {
  id: string
  name: string
  type: "pan" | "aadhar" | "selfie" | "other"
  status: "uploading" | "uploaded" | "verified" | "error"
  file?: File
  preview?: string
}

export type ConversationStage =
  | "greeting"
  | "fullName"
  | "dateOfBirth"
  | "address"
  | "employmentType"
  | "monthlyIncome"
  | "loanAmount"
  | "loanTenure"
  | "consentKYC"
  | "consentCBIL"
  | "summary"
  | "complete"

export interface OnboardingState {
  isAuthenticated: boolean
  setIsAuthenticated: (v: boolean) => void
  userRole: UserRole | null
  setUserRole: (role: UserRole | null) => void
  userProfile: UserProfile
  updateProfile: (fields: Partial<UserProfile>) => void
  documents: UploadedDocument[]
  addDocument: (doc: UploadedDocument) => void
  updateDocumentStatus: (id: string, status: UploadedDocument["status"]) => void
  removeDocument: (id: string) => void
  completedSteps: OnboardingStep[]
  completeStep: (step: OnboardingStep) => void
  logout: () => void
}
