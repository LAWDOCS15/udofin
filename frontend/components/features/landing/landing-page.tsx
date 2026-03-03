"use client";

import { HeroSection } from "./hero-section";
import { HowItWorksSection } from "./how-it-works-section";
import { GuideFeaturesSection } from "./emi-calculator-section";
import { TrustSecuritySection } from "./trust-security-section";
import { CTASection } from "./cta-section";
import { Footer } from "./footer";

export function LandingPage() {
  return (
    <div className="flex flex-col">
      <HeroSection />
      <HowItWorksSection />
      <GuideFeaturesSection />
      <TrustSecuritySection />
      <CTASection />
      <Footer />
    </div>
  );
}
