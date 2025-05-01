import { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  canonicalUrl?: string;
}

export default function SEO({
  title = "Stupid Simple Apps | App Design Agency",
  description = "We build custom HubSpot dashboards that give revenue teams clarity with visual KPIs, pipeline forecasting, and quarterly pacing - all at a flat monthly fee.",
  ogTitle = "Stupid Simple Apps | Custom HubSpot Dashboards",
  ogDescription = "Clear visualizations of your revenue pipeline with custom HubSpot dashboards. One-time setup fee plus $250/month for maintenance.",
  ogImage = "/og-image.png",
  twitterTitle = "Custom HubSpot Dashboards | Stupid Simple Apps",
  twitterDescription = "Get clarity on your sales pipeline with custom HubSpot dashboards. Start with a one-time project fee, then just $250/month.",
  twitterImage = "/og-image.png",
  canonicalUrl = "https://stupidsimpleapps.com/"
}: SEOProps) {
  
  useEffect(() => {
    // Update meta tags when component mounts or props change
    document.title = title;
    
    // Primary meta tags
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', description);
    }
    
    const metaTitle = document.querySelector('meta[name="title"]');
    if (metaTitle) {
      metaTitle.setAttribute('content', title);
    }
    
    // OG meta tags
    const ogTitleTag = document.querySelector('meta[property="og:title"]');
    if (ogTitleTag) {
      ogTitleTag.setAttribute('content', ogTitle);
    }
    
    const ogDescriptionTag = document.querySelector('meta[property="og:description"]');
    if (ogDescriptionTag) {
      ogDescriptionTag.setAttribute('content', ogDescription);
    }
    
    const ogImageTag = document.querySelector('meta[property="og:image"]');
    if (ogImageTag) {
      ogImageTag.setAttribute('content', ogImage);
    }
    
    // Twitter meta tags
    const twitterTitleTag = document.querySelector('meta[property="twitter:title"]');
    if (twitterTitleTag) {
      twitterTitleTag.setAttribute('content', twitterTitle);
    }
    
    const twitterDescriptionTag = document.querySelector('meta[property="twitter:description"]');
    if (twitterDescriptionTag) {
      twitterDescriptionTag.setAttribute('content', twitterDescription);
    }
    
    const twitterImageTag = document.querySelector('meta[property="twitter:image"]');
    if (twitterImageTag) {
      twitterImageTag.setAttribute('content', twitterImage);
    }
    
    // Canonical URL
    const canonicalTag = document.querySelector('link[rel="canonical"]');
    if (canonicalTag) {
      canonicalTag.setAttribute('href', canonicalUrl);
    }
  }, [
    title,
    description,
    ogTitle,
    ogDescription,
    ogImage,
    twitterTitle,
    twitterDescription,
    twitterImage,
    canonicalUrl
  ]);
  
  return null;
}