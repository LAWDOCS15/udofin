export type OnboardingStep = "landing" | "auth" | "chatbot" | "documents" | "verification" | "dashboard" | "admin" | "nbfc-admin"

export type AuthMode = "login" | "register"

export type UserRole = "user" | "admin" | "nbfc-admin"

export interface LoginCredentials {
  email: string
  password: string
  role: UserRole
}

// Demo credentials
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
