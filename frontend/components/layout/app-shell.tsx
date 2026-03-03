"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { Header } from "./header"
import { ProgressStepper } from "./progress-stepper"

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const showHeader = pathname !== "/auth"
  const showStepper = ["/onboarding", "/documents", "/verification", "/dashboard"].includes(pathname)

  return (
    <div className="flex min-h-screen flex-col">
      {showHeader && <Header />}
      {showStepper && <ProgressStepper />}
      <main className="flex-1">
        <div key={pathname} className="animate-fade-in">
          {children}
        </div>
      </main>
    </div>
  )
}
