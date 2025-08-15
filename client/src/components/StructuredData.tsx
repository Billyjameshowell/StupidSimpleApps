import { useEffect } from 'react';

interface StructuredDataProps {
  data: Record<string, any>;
}

export default function StructuredData({ data }: StructuredDataProps) {
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(data);
    document.head.appendChild(script);

    return () => {
      // Cleanup: remove the script when component unmounts
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, [data]);

  return null;
}

// Organization Schema Data
export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Stupid Simple Apps",
  "description": "Custom web app development agency specializing in simple, effective business applications",
  "url": "https://stupidsimpleapps.com",
  "logo": "https://stupidsimpleapps.com/stupidSimpleAppsLogo.png",
  "sameAs": [
    "https://x.com/billyjhowell",
    "https://www.linkedin.com/in/billy-howell-ab5253107",
    "https://github.com/billyjameshowell"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "sales",
    "availableLanguage": "English"
  },
  "service": {
    "@type": "Service",
    "name": "Custom Web Application Development",
    "description": "We build custom web apps with straightforward pricing - one-time project fee plus $250/month maintenance.",
    "provider": {
      "@type": "Organization",
      "name": "Stupid Simple Apps"
    },
    "serviceType": "Web Application Development"
  },
  "founder": {
    "@type": "Person",
    "name": "Billy Howell"
  }
};

// Software Application Schema for HubSpot Dashboard Page
export const hubspotDashboardSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "HubSpot Revenue Forecasting Dashboards",
  "description": "Custom HubSpot dashboard development for media companies with flight-date based revenue forecasting",
  "applicationCategory": "BusinessApplication",
  "operatingSystem": "Web Browser",
  "offers": {
    "@type": "Offer",
    "description": "Custom HubSpot dashboard development for media companies",
    "priceSpecification": {
      "@type": "UnitPriceSpecification",
      "priceCurrency": "USD",
      "price": "250",
      "unitCode": "MON"
    }
  },
  "targetAudience": {
    "@type": "Audience",
    "audienceType": "Media Companies"
  },
  "featureList": [
    "Flight-date based revenue forecasting",
    "Media inventory tracking",
    "Sponsorship analytics",
    "Newsletter performance metrics",
    "Podcast revenue tracking"
  ],
  "provider": {
    "@type": "Organization",
    "name": "Stupid Simple Apps",
    "url": "https://stupidsimpleapps.com"
  }
};

// Service Schema for Homepage
export const webDevelopmentServiceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Custom Web Application Development Services",
  "description": "Professional custom web app development with simple pricing. No per-user costs, just effective business solutions.",
  "provider": {
    "@type": "Organization",
    "name": "Stupid Simple Apps",
    "url": "https://stupidsimpleapps.com"
  },
  "serviceType": "Web Development",
  "areaServed": "Worldwide",
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Web Development Services",
    "itemListElement": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Custom Web Application Development"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "HubSpot Dashboard Development"
        }
      }
    ]
  }
};