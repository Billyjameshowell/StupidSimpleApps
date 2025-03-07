import HeroSection from "@/components/HeroSection";
import ClientsSection from "@/components/ClientsSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import AboutSection from "@/components/AboutSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import ContactSection from "@/components/ContactSection";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <ClientsSection />
      <HowItWorksSection />
      <AboutSection />
      <TestimonialsSection />
      <ContactSection />
    </main>
  );
}
