import HeroSection from "@/components/modules/home/hero-section";
import FeaturesSection from "@/components/modules/home/features-section";
import HowItWorksSection from "@/components/modules/home/how-it-works-section";
import StatsSection from "@/components/modules/home/stats-section";
import CtaSection from "@/components/modules/home/cta-section";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <StatsSection />
      <CtaSection />
    </>
  );
}
