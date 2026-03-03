// "use client"

// import { createContext, useContext, useState, useCallback, type ReactNode } from "react"
// import type { OnboardingStep, UserProfile, UploadedDocument, UserRole, OnboardingState } from "@/types"

// const defaultProfile: UserProfile = {
//   fullName: "",
//   dateOfBirth: "",
//   address: "",
//   employmentType: "",
//   monthlyIncome: "",
//   loanAmount: "",
//   loanTenure: "",
//   consentKYC: false,
//   consentCBIL: false,
// }

// const OnboardingContext = createContext<OnboardingState | null>(null)

// export function OnboardingProvider({ children }: { children: ReactNode }) {
//   const [isAuthenticated, setIsAuthenticated] = useState(false)
//   const [userRole, setUserRole] = useState<UserRole | null>(null)
//   const [userProfile, setUserProfile] = useState<UserProfile>(defaultProfile)
//   const [documents, setDocuments] = useState<UploadedDocument[]>([])
//   const [completedSteps, setCompletedSteps] = useState<OnboardingStep[]>([])

//   const updateProfile = useCallback((fields: Partial<UserProfile>) => {
//     setUserProfile((prev) => ({ ...prev, ...fields }))
//   }, [])

//   const addDocument = useCallback((doc: UploadedDocument) => {
//     setDocuments((prev) => [...prev, doc])
//   }, [])

//   const updateDocumentStatus = useCallback(
//     (id: string, status: UploadedDocument["status"]) => {
//       setDocuments((prev) =>
//         prev.map((d) => (d.id === id ? { ...d, status } : d))
//       )
//     },
//     []
//   )

//   const removeDocument = useCallback((id: string) => {
//     setDocuments((prev) => prev.filter((d) => d.id !== id))
//   }, [])

//   const completeStep = useCallback((s: OnboardingStep) => {
//     setCompletedSteps((prev) => (prev.includes(s) ? prev : [...prev, s]))
//   }, [])

//   const logout = useCallback(() => {
//     setIsAuthenticated(false)
//     setUserRole(null)
//     setUserProfile(defaultProfile)
//     setDocuments([])
//     setCompletedSteps([])
//     // Navigation is handled by the component calling logout()
//   }, [])

//   return (
//     <OnboardingContext.Provider
//       value={{
//         isAuthenticated,
//         setIsAuthenticated,
//         userRole,
//         setUserRole,
//         userProfile,
//         updateProfile,
//         documents,
//         addDocument,
//         updateDocumentStatus,
//         removeDocument,
//         completedSteps,
//         completeStep,
//         logout,
//       }}
//     >
//       {children}
//     </OnboardingContext.Provider>
//   )
// }

// export function useOnboarding() {
//   const ctx = useContext(OnboardingContext)
//   if (!ctx) throw new Error("useOnboarding must be inside OnboardingProvider")
//   return ctx
// }

"use client"

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react"
import { useRouter, usePathname } from "next/navigation"
import type { OnboardingStep, UserProfile, UploadedDocument, UserRole } from "@/types"
import { authAPI } from "@/config/api"
import { useToast } from "@/components/shared/simple-toast" // ✅ Added for Logout notification

export interface OnboardingState {
  isAuthenticated: boolean
  setIsAuthenticated: (v: boolean) => void
  userRole: UserRole | null
  setUserRole: (role: UserRole | null) => void
  
  user: any | null
  setUser: (user: any | null) => void

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
  fullName: "", dateOfBirth: "", address: "", employmentType: "",
  monthlyIncome: "", loanAmount: "", loanTenure: "", consentKYC: false, consentCBIL: false,
}

const OnboardingContext = createContext<OnboardingState | null>(null)

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { showToast } = useToast() // ✅ Initialize Toast

  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userRole, setUserRole] = useState<UserRole | null>(null)
  const [user, setUser] = useState<any | null>(null)
  
  const [userProfile, setUserProfile] = useState<UserProfile>(defaultProfile)
  const [documents, setDocuments] = useState<UploadedDocument[]>([])
  const [completedSteps, setCompletedSteps] = useState<OnboardingStep[]>([])

  const updateProfile = useCallback((fields: Partial<UserProfile>) => {
    setUserProfile((prev) => ({ ...prev, ...fields }))
  }, [])

  const addDocument = useCallback((doc: UploadedDocument) => {
    setDocuments((prev) => [...prev, doc])
  }, [])

  const updateDocumentStatus = useCallback((id: string, status: UploadedDocument["status"]) => {
    setDocuments((prev) => prev.map((d) => (d.id === id ? { ...d, status } : d)))
  }, [])

  const removeDocument = useCallback((id: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== id))
  }, [])

  const completeStep = useCallback((s: OnboardingStep) => {
    setCompletedSteps((prev) => (prev.includes(s) ? prev : [...prev, s]))
  }, [])

  const logout = useCallback(async () => {
    try {
      await authAPI.logout();
      showToast("Logged out successfully!", "success") // ✅ Added Logout Toast
    } catch (err) {
      console.error("Logout failed", err);
    }
    setIsAuthenticated(false)
    setUserRole(null)
    setUser(null)
    setUserProfile(defaultProfile)
    setDocuments([])
    setCompletedSteps([])
    router.push("/")
  }, [router, showToast])

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await authAPI.me();
        const data = response.data;
        
        const rawRole = data.user.role;
        const formattedRole = rawRole.toUpperCase().replace(" ", "_");

        setIsAuthenticated(true);
        setUser(data.user);
        updateProfile({ fullName: data.user.name });

        if (formattedRole === "SUPER_ADMIN") setUserRole("admin");
        else if (formattedRole === "NBFC_ADMIN") setUserRole("nbfc-admin");
        else setUserRole("user");

        if (pathname === "/auth" || pathname === "/") {
          if (formattedRole === "SUPER_ADMIN") router.push("/admin");
          else if (formattedRole === "NBFC_ADMIN") router.push("/nbfc-admin");
          else router.push("/user"); 
        }
      } catch (error) {
        setIsAuthenticated(false);
        setUserRole(null);
        setUser(null);
      }
    };

    checkSession();
  }, [pathname, router, updateProfile]);

  return (
    <OnboardingContext.Provider
      value={{
        isAuthenticated, setIsAuthenticated,
        userRole, setUserRole,
        user, setUser,
        userProfile, updateProfile,
        documents, addDocument, updateDocumentStatus, removeDocument,
        completedSteps, completeStep, logout,
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