// "use client"

// import { OnboardingProvider, useOnboarding } from "@/lib/onboarding-context"
// import { Header } from "@/components/header"
// import { ProgressStepper } from "@/components/progress-stepper"
// import { LandingPage } from "@/components/landing-page"
// import { AuthForm } from "@/components/auth-form"
// import { OnboardingChatbot } from "@/components/onboarding-chatbot"
// import { DocumentUpload } from "@/components/document-upload"
// import { VerificationScreen } from "@/components/verification-screen"
// import { LoanDashboard } from "@/components/loan-dashboard"
// import { AdminPanelV2 } from "@/components/admin-panel-v2"
// import { NBFCAdminPanel } from "@/components/nbfc-admin-panel"

// function AppContent() {
//   const { step, userRole } = useOnboarding()

//   const showHeader = step !== "auth"
//   const showStepper = !["landing", "auth", "admin", "nbfc-admin"].includes(step)

//   return (
//     <div className="flex min-h-screen flex-col">
//       {showHeader && <Header />}
//       {showStepper && <ProgressStepper />}
//       <main className="flex-1">
//         <div key={step} className="animate-fade-in">
//           {step === "landing" && <LandingPage />}
//           {step === "auth" && <AuthForm />}
//           {step === "chatbot" && <OnboardingChatbot />}
//           {step === "documents" && <DocumentUpload />}
//           {step === "verification" && <VerificationScreen />}
//           {step === "dashboard" && <LoanDashboard />}
//           {step === "admin" && <AdminPanelV2 />}
//           {step === "nbfc-admin" && <NBFCAdminPanel />}
//         </div>
//       </main>
//     </div>
//   )
// }



// export default function Page() {
//   return (
//     <OnboardingProvider>
//       <AppContent />
//     </OnboardingProvider>
//   )
// }


"use client"

import { useEffect, useState } from "react"
import { OnboardingProvider, useOnboarding } from "@/lib/onboarding-context"
import { Header } from "@/components/header"
import { ProgressStepper } from "@/components/progress-stepper"
import { LandingPage } from "@/components/landing-page"
import { AuthForm } from "@/components/auth-form"
import { OnboardingChatbot } from "@/components/onboarding-chatbot"
import { DocumentUpload } from "@/components/document-upload"
import { VerificationScreen } from "@/components/verification-screen"
import { LoanDashboard } from "@/components/loan-dashboard"
import { AdminDashboard } from "@/components/admin-dashboard" 
import { NBFCAdminPanel } from "@/components/nbfc-admin-panel"

function AppContent() {
  const { step } = useOnboarding()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null;

  const showHeader = step !== "auth"
  const showStepper = !["landing", "auth", "admin", "nbfc-admin"].includes(step)

  return (
    <div className="flex min-h-screen flex-col">
      {showHeader && <Header />}
      {showStepper && <ProgressStepper />}
      <main className="flex-1">
        <div key={step} className="animate-fade-in">
          {step === "landing" && <LandingPage />}
          {step === "auth" && <AuthForm />}
          {step === "chatbot" && <OnboardingChatbot />}
          {step === "documents" && <DocumentUpload />}
          {step === "verification" && <VerificationScreen />}
          {step === "dashboard" && <LoanDashboard />}
          {step === "admin" && <AdminDashboard />}
          {step === "nbfc-admin" && <NBFCAdminPanel />}
        </div>
      </main>
    </div>
  )
}

export default function Page() {
  return (
    <OnboardingProvider>
      <AppContent />
    </OnboardingProvider>
  )
}