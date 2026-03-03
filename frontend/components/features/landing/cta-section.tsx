"use client"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { ArrowUpRight } from "lucide-react"
import { Reveal } from "./shared"

export function CTASection() {
  const router = useRouter()

  return (
    <section className="bg-primary">
      <div className="mx-auto max-w-3xl px-6 py-28 text-center lg:px-8 lg:py-36">
        <Reveal>
          <h2 className="text-balance text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl lg:text-5xl" style={{ fontFamily: "var(--font-heading)" }}>
            Ready to get funded?
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-primary-foreground/35 leading-relaxed">
            Join 50,000+ borrowers who got their loans approved in minutes.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Button size="lg" className="group h-14 gap-2.5 rounded-full bg-primary-foreground px-10 text-base font-semibold text-primary shadow-2xl shadow-primary-foreground/10 transition-all hover:bg-primary-foreground/90 hover:gap-3.5" onClick={() => router.push("/auth")}>
              Start Application
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
