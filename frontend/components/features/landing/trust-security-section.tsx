"use client"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { ArrowRight, Shield, Lock, Clock, Users } from "lucide-react"
import { Reveal } from "./shared"

const trustItems = [
  { icon: Shield, title: "KYC Verified", desc: "Direct government API integration" },
  { icon: Lock, title: "AES-256 Encryption", desc: "Bank-grade data protection" },
  { icon: Clock, title: "Real-time Processing", desc: "Instant verification pipeline" },
  { icon: Users, title: "RBI Compliant", desc: "Fully regulated operations" },
]

export function TrustSecuritySection() {
  const router = useRouter()

  return (
    <section className="bg-background">
      <div className="mx-auto max-w-7xl px-6 py-28 lg:px-8 lg:py-36">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          <Reveal>
            <div>
              <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.25em] text-accent">Security</p>
              <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl" style={{ fontFamily: "var(--font-heading)" }}>
                Bank-grade security.
                <br />
                Lightning fast.
              </h2>
              <p className="mt-5 text-muted-foreground leading-relaxed">All data is encrypted end-to-end with AES-256. Documents are verified through secure government APIs and auto-deleted after processing.</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button className="h-12 gap-2 rounded-full bg-primary px-8 text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/10 transition-all" onClick={() => router.push("/auth")}>
                  Start Application <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Reveal>
          <div className="grid grid-cols-2 gap-4">
            {trustItems.map((item, i) => {
              const Icon = item.icon
              return (
                <Reveal key={item.title} delay={i * 80}>
                  <div className="group rounded-3xl border border-border bg-card p-6 transition-all duration-500 hover:border-foreground/8 hover:shadow-xl hover:shadow-foreground/3 hover:-translate-y-0.5 lg:p-7">
                    <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-secondary transition-all duration-500 group-hover:bg-accent/10">
                      <Icon className="h-5 w-5 text-foreground/50 transition-colors duration-500 group-hover:text-accent" />
                    </div>
                    <p className="text-sm font-bold text-foreground">{item.title}</p>
                    <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                  </div>
                </Reveal>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
