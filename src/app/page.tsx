import { Hero } from "@/components/Hero";
import { SocialProof } from "@/components/SocialProof";
import { StatsCounter } from "@/components/StatsCounter";
import { HowItWorks } from "@/components/HowItWorks";
import { NeuralGraph } from "@/components/NeuralGraph";
import { Comparison } from "@/components/Comparison";
import { DetailedFeatures } from "@/components/DetailedFeatures";
import { Features } from "@/components/Features";
import { ProductTeaser } from "@/components/ProductTeaser";
import { Testimonials } from "@/components/Testimonials";
import { FAQ } from "@/components/FAQ";
import { Pricing } from "@/components/Pricing";
import { RequestForm } from "@/components/RequestForm";
import { CTA } from "@/components/CTA";
import { FloatingWhatsAppButton } from "@/components/FloatingWhatsAppButton";

import { Reveal } from "@/components/Reveal";

export default function Home() {
  return (
    <>
      {/* 1. Hero — first impression, big & bold */}
      <Hero />

      {/* 2. Trust signals — right after hero */}
      <Reveal>
        <SocialProof />
      </Reveal>

      {/* 3. Stats — credibility */}
      <Reveal>
        <StatsCounter />
      </Reveal>

      {/* 4. How it works — reduce friction */}
      <Reveal>
        <HowItWorks />
      </Reveal>

      {/* 5. Features (detailed rows) — show depth */}
      <Reveal>
        <Features />
      </Reveal>

      {/* 6. Capabilities grid — supporting detail */}
      <Reveal>
        <DetailedFeatures />
      </Reveal>

      {/* 7. Architecture diagram — show how it all connects */}
      <Reveal>
        <NeuralGraph />
      </Reveal>

      {/* 8. Comparison — handle objections */}
      <Reveal>
        <Comparison />
      </Reveal>

      {/* 9. Product preview — show what they're buying */}
      <Reveal>
        <ProductTeaser />
      </Reveal>

      {/* 10. Testimonials — social proof */}
      <Reveal>
        <Testimonials />
      </Reveal>

      {/* 11. Pricing — conversion */}
      <Reveal>
        <Pricing />
      </Reveal>

      {/* 12. FAQ — remove last objections */}
      <Reveal>
        <FAQ />
      </Reveal>

      {/* 13. Request form — capture demand */}
      <Reveal>
        <RequestForm />
      </Reveal>

      {/* 14. Final CTA */}
      <Reveal>
        <CTA />
      </Reveal>

      <FloatingWhatsAppButton />
    </>
  );
}
