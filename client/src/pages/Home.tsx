import HeroSection from "@/components/HeroSection";
import ClientsSection from "@/components/ClientsSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import AboutSection from "@/components/AboutSection";
import ContactSection from "@/components/ContactSection";
import SEO from "@/components/SEO";

export default function Home() {
  return (
    <>
      <SEO 
        title="Stupid Simple Apps | Custom App Design Agency"
        description="We build custom web apps that give your team clarity and control, with a straightforward pricing model - one-time project fee plus $250/month maintenance."
        canonicalUrl="https://stupidsimpleapps.com/"
      />
      <HeroSection />
      <ClientsSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <AboutSection />
      <ContactSection />
    </>
  );
}