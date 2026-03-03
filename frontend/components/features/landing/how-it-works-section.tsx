"use client";

import { Bot, FileCheck, TrendingUp } from "lucide-react";
import { Reveal } from "./shared";

const steps = [
  {
    num: "01",
    title: "Talk to our AI",
    desc: "Answer quick questions in a natural conversation. No paper forms.",
    icon: Bot,
  },
  {
    num: "02",
    title: "Upload documents",
    desc: "Securely upload PAN, Aadhaar, and selfie. Verified in real time.",
    icon: FileCheck,
  },
  {
    num: "03",
    title: "Get your offers",
    desc: "Personalized loan offers from top lenders within minutes.",
    icon: TrendingUp,
  },
];

export function HowItWorksSection() {
  return (
    <section className="bg-background">
      <div className="mx-auto max-w-7xl px-6 py-28 lg:px-8 lg:py-36">
        <Reveal>
          <div className="mx-auto mb-16 max-w-2xl text-center lg:mb-20">
            <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.25em] text-accent">
              How it works
            </p>
            <h2
              className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Three steps to your loan
            </h2>
            <p className="mt-5 text-muted-foreground leading-relaxed">
              Our streamlined process gets you from application to approval
              faster than any traditional bank.
            </p>
          </div>
        </Reveal>

        <div className="grid gap-6 lg:grid-cols-3">
          {steps.map((s, i) => {
            const Icon = s.icon;
            return (
              <Reveal key={s.num} delay={i * 100}>
                <div className="group relative overflow-hidden rounded-3xl border border-border bg-card p-8 transition-all duration-500 hover:border-foreground/8 hover:shadow-2xl hover:shadow-foreground/4 hover:-translate-y-1 lg:p-10">
                  <span
                    className="pointer-events-none absolute -right-4 -top-6 text-[140px] font-bold leading-none text-foreground/[0.09] transition-colors duration-700 group-hover:text-accent/[0.1]"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {s.num}
                  </span>
                  <div className="relative">
                    <div className="mb-7 flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary transition-all duration-500 group-hover:bg-accent/10 group-hover:shadow-lg group-hover:shadow-accent/10">
                      <Icon className="h-6 w-6 text-muted-foreground transition-colors duration-500 group-hover:text-accent" />
                    </div>
                    <h3
                      className="mb-3 text-xl font-bold text-foreground"
                      style={{ fontFamily: "var(--font-heading)" }}
                    >
                      {s.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {s.desc}
                    </p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
