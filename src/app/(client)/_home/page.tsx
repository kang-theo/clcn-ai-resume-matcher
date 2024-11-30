import { Cta } from "@/components/layout/client/Cta";
import { FAQ } from "@/components/layout/client/FAQ";
import { Features } from "@/components/layout/client/Features";
import { Footer } from "@/components/layout/client/Footer";
import { Hero } from "@/components/layout/client/Hero";
import { HowItWorks } from "@/components/layout/client/HowItWorks";
import { Pricing } from "@/components/layout/client/Pricing";
import { Testimonials } from "@/components/layout/client/Testimonials";

export default function HomePage() {
  return (
    <>
      <Hero />
      <HowItWorks />
      <Features />
      <Testimonials />
      <Pricing />
      <FAQ />
      <Footer />
    </>
  );
}
