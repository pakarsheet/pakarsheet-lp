import { Hero } from "@/components/Hero";
import { SocialProof } from "@/components/SocialProof";
import { StatsCounter } from "@/components/StatsCounter";
import { HowItWorks } from "@/components/HowItWorks";
import { Comparison } from "@/components/Comparison";
import { DetailedFeatures } from "@/components/DetailedFeatures";
import { Features } from "@/components/Features";
import { Testimonials } from "@/components/Testimonials";
import { FAQ } from "@/components/FAQ";
import { Pricing } from "@/components/Pricing";
import { CTA } from "@/components/CTA";

import { Reveal } from "@/components/Reveal";

export default function Home() {
  return (
    <>
      <Reveal delay={0.1}>
        <Hero />
      </Reveal>
      <Reveal delay={0.15}>
        <SocialProof />
      </Reveal>
      <Reveal delay={0.2}>
        <StatsCounter />
      </Reveal>
      <Reveal delay={0.25}>
        <HowItWorks />
      </Reveal>
      <Reveal delay={0.3}>
        <DetailedFeatures />
      </Reveal>
      <Reveal delay={0.35}>
        <Features />
      </Reveal>
      <Reveal delay={0.4}>
        <Comparison />
      </Reveal>
      <Reveal delay={0.45}>
        <Testimonials />
      </Reveal>
      <Reveal delay={0.5}>
        <FAQ />
      </Reveal>
      <Reveal delay={0.55}>
        <Pricing />
      </Reveal>
      <Reveal delay={0.6}>
        <CTA />
      </Reveal>
    </>
  );
}
