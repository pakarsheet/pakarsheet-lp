import { Hero } from "@/components/Hero";
import { SocialProof } from "@/components/SocialProof";
import { StatsCounter } from "@/components/StatsCounter";
import { HowItWorks } from "@/components/HowItWorks";
import { NeuralGraph } from "@/components/NeuralGraph";
import { Comparison } from "@/components/Comparison";
import { DetailedFeatures } from "@/components/DetailedFeatures";
import { Features } from "@/components/Features";
import { Testimonials } from "@/components/Testimonials";
import { FAQ } from "@/components/FAQ";
import { Pricing } from "@/components/Pricing";
import { RequestForm } from "@/components/RequestForm";
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
        <NeuralGraph />
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
        <RequestForm />
      </Reveal>
      <Reveal>
        <CTA />
      </Reveal>
    </>
  );
}
