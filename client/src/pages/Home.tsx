import HeroSection from "@/components/HeroSection";
import ClientsSection from "@/components/ClientsSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import AboutSection from "@/components/AboutSection";
import ContactSection from "@/components/ContactSection";
import SavingsCalculator from "@/components/SavingsCalculator";

export default function Home() {
  return (
    <>
      <HeroSection />
      <ClientsSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <AboutSection />
      <ContactSection />
    </>
  );
}