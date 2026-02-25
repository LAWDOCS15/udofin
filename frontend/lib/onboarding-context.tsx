"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"
import type { OnboardingStep, UserProfile, UploadedDocument, UserRole } from "./types"

interface OnboardingState {
  step: OnboardingStep
  setStep: (step: OnboardingStep) => void
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

const defaultProfile: UserProfile = {
  fullName: "",
  dateOfBirth: "",
  address: "",
  employmentType: "",
  monthlyIncome: "",
  loanAmount: "",
  loanTenure: "",
  consentKYC: false,
  consentCBIL: false,
}

const OnboardingContext = createContext<OnboardingState | null>(null)

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [step, setStep] = useState<OnboardingStep>("landing")
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userRole, setUserRole] = useState<UserRole | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile>(defaultProfile)
  const [documents, setDocuments] = useState<UploadedDocument[]>([])
  const [completedSteps, setCompletedSteps] = useState<OnboardingStep[]>([])

  const updateProfile = useCallback((fields: Partial<UserProfile>) => {
    setUserProfile((prev) => ({ ...prev, ...fields }))
  }, [])

  const addDocument = useCallback((doc: UploadedDocument) => {
    setDocuments((prev) => [...prev, doc])
  }, [])

  const updateDocumentStatus = useCallback(
    (id: string, status: UploadedDocument["status"]) => {
      setDocuments((prev) =>
        prev.map((d) => (d.id === id ? { ...d, status } : d))
      )
    },
    []
  )

  const removeDocument = useCallback((id: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== id))
  }, [])

  const completeStep = useCallback((s: OnboardingStep) => {
    setCompletedSteps((prev) => (prev.includes(s) ? prev : [...prev, s]))
  }, [])

  const logout = useCallback(() => {
    setIsAuthenticated(false)
    setUserRole(null)
    setUserProfile(defaultProfile)
    setDocuments([])
    setCompletedSteps([])
    setStep("landing")
  }, [])

  return (
    <OnboardingContext.Provider
      value={{
        step,
        setStep,
        isAuthenticated,
        setIsAuthenticated,
        userRole,
        setUserRole,
        userProfile,
        updateProfile,
        documents,
        addDocument,
        updateDocumentStatus,
        removeDocument,
        completedSteps,
        completeStep,
        logout,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  )
}

export function useOnboarding() {
  const ctx = useContext(OnboardingContext)
  if (!ctx) throw new Error("useOnboarding must be inside OnboardingProvider")
  return ctx
}
