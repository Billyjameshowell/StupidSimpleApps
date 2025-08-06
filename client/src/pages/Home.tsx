import HeroSection from "@/components/HeroSection";
import ClientsSection from "@/components/ClientsSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import AboutSection from "@/components/AboutSection";
import ContactSection from "@/components/ContactSection";
import SEO from "@/components/SEO";
import StructuredData, { organizationSchema, webDevelopmentServiceSchema } from "@/components/StructuredData";

export default function Home() {
  return (
    <>
      <SEO 
        title="Custom Web App Development Agency | Stupid Simple Apps"
        description="Custom web application development services with simple pricing. We build tailored business apps without complexity - one-time fee plus $250/month."
        ogTitle="Custom Web App Development Services | Stupid Simple Apps"
        ogDescription="Professional custom web application development for businesses. Simple pricing model with no per-user costs - just effective solutions."
        ogImage="/og-image.png"
        twitterTitle="Custom Web App Development | Stupid Simple Apps"
        twitterDescription="Get custom web applications built for your business needs. Straightforward pricing, no complexity, just results."
        twitterImage="/og-image.png"
        canonicalUrl="https://stupidsimpleapps.com/"
      />
      <StructuredData data={organizationSchema} />
      <StructuredData data={webDevelopmentServiceSchema} />
      <HeroSection />
      <ClientsSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <AboutSection />
      <ContactSection />
    </>
  );
}