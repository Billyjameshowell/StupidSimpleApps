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
        ogTitle="Stupid Simple Apps | App Development Solutions"
        ogDescription="Custom, straightforward app solutions with clear pricing: one-time project fee plus $250/month. No complexity, just apps that work."
        ogImage="/og-image.png"
        twitterTitle="Stupid Simple Apps | Build Without Complexity"
        twitterDescription="Get custom apps built without excessive features or per-user costs. One-time project fee plus $250/month for maintenance."
        twitterImage="/og-image.png"
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