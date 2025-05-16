import React from "react";
import { Button } from "@/components/ui/button";
import { TALLY_FORM_URL, HUBSPOT_CALENDLY_URL } from "@/constants";
import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import { Check, Calendar, BarChart2, Link as LinkIcon } from "lucide-react";

export default function HubspotDashboard() {
  return (
    <div className="flex flex-col min-h-screen">
      <SEO 
        title="Revenue Forecasting for Media Companies | Stupid Simple Apps"
        description="Custom HubSpot dashboards built specifically for media companies selling sponsorships, newsletters, podcasts and more. Flight-date based forecasting."
        ogTitle="HubSpot Dashboards for Media Companies | Stupid Simple Apps"
        ogDescription="Revenue forecasting for media companies — finally built for how you actually sell. Flight-date based forecasting that works."
        twitterTitle="Media Revenue Dashboards | Stupid Simple Apps"
        twitterDescription="Custom HubSpot dashboards designed for media companies that sell sponsorships, newsletters, podcasts, and display ads."
        canonicalUrl="https://stupidsimpleapps.com/hubspot-dashboard"
      />
      {/* Hero Section */}
      <section className="pt-28 pb-16 md:pt-36 md:pb-24 bg-gradient-to-br from-white to-orange-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
              REVENUE FORECASTING FOR MEDIA COMPANIES — FINALLY BUILT FOR HOW YOU ACTUALLY SELL.
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 mb-3">
              HubSpot dashboards weren't made for media.
              <span className="text-orange-600 font-medium"> We fix that.</span>
            </p>
            <p className="text-lg text-gray-700 mb-10">
              If your team sells sponsorships, newsletters, podcasts, or other media inventory — you already know HubSpot can't forecast revenue by flight date. It only reports by close date, which makes your pacing and revenue forecasting completely unreliable. Our custom dashboards embed directly into HubSpot—designed to let you finally see revenue the way your business actually earns it.
            </p>
            <Button
              asChild
              size="lg"
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-3 md:px-8 md:py-6 font-semibold text-base md:text-lg w-full sm:w-auto inline-flex items-center justify-center"
            >
              <a
                href={HUBSPOT_CALENDLY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center"
              >
                Book an Intro Call to Get Started!
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 ml-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Main Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-16">
              {/* Left Column */}
              <div>
                <h2 className="text-3xl font-bold text-orange-600 mb-10">
                  BUILT FOR MEDIA REVENUE TEAMS
                </h2>
                
                <div className="space-y-12">
                  {/* Feature 1 */}
                  <div className="flex gap-6">
                    <div className="flex-shrink-0 w-10 h-10 text-gray-600">
                      <Calendar className="w-10 h-10" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 mb-3">
                        Flight-Date-Based Forecasting
                      </h3>
                      <p className="text-gray-700">
                        Stop relying on close dates. Forecast revenue by flight date.
                      </p>
                    </div>
                  </div>
                
                  {/* Feature 2 */}
                  <div className="flex gap-6">
                    <div className="flex-shrink-0 w-10 h-10 text-gray-600">
                      <BarChart2 className="w-10 h-10" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 mb-3">
                        Visualize Revenue Over Time
                      </h3>
                      <p className="text-gray-700">
                        See pacing bars, calendar views, or waterfall charts—all tailored.
                      </p>
                    </div>
                  </div>
                
                  {/* Feature 3 */}
                  <div className="flex gap-6">
                    <div className="flex-shrink-0 w-10 h-10 text-gray-600">
                      <LinkIcon className="w-10 h-10" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 mb-3">
                        Embedded in HubSpot
                      </h3>
                      <p className="text-gray-700">
                        With Native Auth, no separate login, truly secure feed, fully secure/integrated.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Right Column */}
              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-8">
                  Designed for teams selling:
                </h2>
                <ul className="space-y-4 mb-12">
                  <li className="text-lg text-gray-700 font-medium">Newsletter Sponsorships</li>
                  <li className="text-lg text-gray-700 font-medium">Podcast Ad Slots</li>
                  <li className="text-lg text-gray-700 font-medium">Website Display</li>
                  <li className="text-lg text-gray-700 font-medium">Event Packages</li>
                  <li className="text-lg text-gray-700 font-medium">Custom Media Plans</li>
                </ul>
                
                <h2 className="text-3xl font-bold text-gray-800 mb-6">
                  WHAT YOU GET
                </h2>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <div className="mr-3 text-green-500">
                      <Check className="h-6 w-6" />
                    </div>
                    <span className="text-gray-700">Flight-date based revenue forecasting</span>
                  </li>
                  <li className="flex items-center">
                    <div className="mr-3 text-green-500">
                      <Check className="h-6 w-6" />
                    </div>
                    <span className="text-gray-700">Embeds inside HubSpot</span>
                  </li>
                  <li className="flex items-center">
                    <div className="mr-3 text-green-500">
                      <Check className="h-6 w-6" />
                    </div>
                    <span className="text-gray-700">Tailored to your campaign structures</span>
                  </li>
                  <li className="flex items-center">
                    <div className="mr-3 text-green-500">
                      <Check className="h-6 w-6" />
                    </div>
                    <span className="text-gray-700">Built-in filters (by rep, status, format, etc)</span>
                  </li>
                  <li className="flex items-center">
                    <div className="mr-3 text-green-500">
                      <Check className="h-6 w-6" />
                    </div>
                    <span className="text-gray-700">Fully mobile and desktop responsive</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">PRICING</h2>
            <div className="bg-white rounded-xl shadow-lg p-10 border border-gray-200">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 text-gray-600">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="3" y1="9" x2="21" y2="9"></line>
                      <line x1="9" y1="21" x2="9" y2="9"></line>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">One-Page Dashboard: <span className="text-gray-700">$5,000</span></h3>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 text-gray-600">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
                      <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                      <path d="M2 17l10 5 10-5M2 12l10 5 10-5"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Hosting: <span className="text-gray-700">$149/month</span></h3>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 text-gray-600">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="8" x2="12" y2="12"></line>
                      <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Ongoing Tweaks: <span className="text-gray-700">2 dev hours / month for $249/month</span></h3>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 text-gray-600">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                      <circle cx="9" cy="7" r="4"></circle>
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Additional Dashboards: <span className="text-gray-700">starting at $2,500 each</span></h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-20 bg-white border-t border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              BUILT FOR HOW MEDIA COMPANIES ACTUALLY WORK
            </h2>
            <p className="text-xl text-gray-700 mb-12">
              We work with lean sales teams at growing media companies to create the dashboards your CRM scheds has waiting for.
            </p>
            <Button
              asChild
              size="lg"
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-4 md:px-10 md:py-6 font-semibold text-lg md:text-xl rounded-lg"
            >
              <a
                href={HUBSPOT_CALENDLY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center"
              >
                Book an Intro Call to Get Started!
              </a>
            </Button>
            <p className="mt-6 text-sm text-gray-500">
              VISIT: stupid-simple-apps.com/hubspot-dashboard
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
