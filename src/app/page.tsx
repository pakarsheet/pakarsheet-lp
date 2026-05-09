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
      <Hero />
      <Reveal>
        <SocialProof />
      </Reveal>
      <Reveal>
        <StatsCounter />
      </Reveal>
      <Reveal>
        <HowItWorks />
      </Reveal>
      <Reveal>
        <DetailedFeatures />
      </Reveal>
      <Reveal>
        <Features />
      </Reveal>
      <Reveal>
        <Comparison />
      </Reveal>
      <Reveal>
        <Testimonials />
      </Reveal>
      <Reveal>
        <FAQ />
      </Reveal>
      <Reveal>
        <Pricing />
      </Reveal>
      <Reveal>
        <CTA />
      </Reveal>
    </>
  );
}
