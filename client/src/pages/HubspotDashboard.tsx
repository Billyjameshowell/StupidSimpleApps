import React from "react";
import { Button } from "@/components/ui/button";
import { TALLY_FORM_URL } from "@/constants";
import Layout from "@/components/Layout";
import SEO from "@/components/SEO";

export default function HubspotDashboard() {
  return (
    <div className="flex flex-col min-h-screen">
      <SEO 
        title="Custom HubSpot Dashboards | Stupid Simple Apps"
        description="Get clear visualizations of your revenue pipeline with custom HubSpot dashboards. Quarterly pacing, pipeline forecasting, and visual KPIs."
        ogTitle="HubSpot Dashboard Solutions | Stupid Simple Apps"
        ogDescription="Transform your HubSpot data into clear, actionable dashboards. One-time project fee plus $250/month for maintenance."
        twitterTitle="Custom HubSpot Dashboard Solutions"
        twitterDescription="Get better insights from your HubSpot data with custom dashboards that show exactly what your revenue team needs to see."
        canonicalUrl="https://stupidsimpleapps.com/hubspot-dashboard"
      />
      {/* Hero Section */}
      <section className="pt-28 pb-16 md:pt-36 md:pb-24 bg-gradient-to-br from-white to-orange-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
              Custom HubSpot Visual Dashboards
            </h1>
            <p className="text-2xl md:text-3xl text-gray-700 font-light mb-10">
              Your pipeline. Crystal clear.
            </p>
            <Button
              asChild
              size="lg"
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-3 md:px-8 md:py-6 font-semibold text-base md:text-lg w-full sm:w-auto inline-flex items-center justify-center"
            >
              <a
                href={TALLY_FORM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center"
              >
                Let's make your HubSpot data usable
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

      {/* For Revenue Teams Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <div className="inline-block px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium mb-6">
              ✅ Built for Revenue Teams Who Need Answers Fast
            </div>
            <p className="text-xl md:text-2xl text-gray-700">
              Tired of messy reports and clunky filters in native HubSpot
              dashboards? We build custom interactive revenue dashboards that
              actually tell you where you're pacing—no digging required.
            </p>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <hr className="border-gray-200" />
      </div>

      {/* What You Get Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto mb-16">
            <div className="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-6">
              🔍 What You Get
            </div>

            {/* KPI Cards */}
            <div className="bg-white rounded-xl shadow-lg p-8 mb-14">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                📊 Visual KPI Cards (Embed Anywhere)
              </h3>
              <p className="text-lg text-gray-700 mb-6">Quickly track:</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">•</span>
                  <span className="text-gray-700">Booked Revenue vs Goal</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">•</span>
                  <span className="text-gray-700">
                    Weighted + Unweighted Pipeline Value
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">•</span>
                  <span className="text-gray-700">
                    Pacing to Goal by Quarter
                  </span>
                </li>
              </ul>
              <p className="text-lg text-gray-700 mb-8">
                → All embeddable on your site, Notion, or internal wiki.
              </p>
              <div className="bg-white p-4 rounded-lg shadow-md overflow-hidden">
                <img
                  src="/dashboard-screenshot-1.png"
                  alt="Share Embed visualization"
                  className="w-full rounded-md"
                />
              </div>
            </div>

            {/* Quarterly Pacing */}
            <div className="bg-white rounded-xl shadow-lg p-8 mb-14">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                📈 Quarterly Pacing & Pipeline Clarity
              </h3>
              <p className="text-lg text-gray-700 mb-6">
                View real-time revenue pacing by quarter. Drill into:
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">•</span>
                  <span className="text-gray-700">What's booked</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">•</span>
                  <span className="text-gray-700">
                    What's likely to close (weighted)
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">•</span>
                  <span className="text-gray-700">
                    What's possible (unweighted)
                  </span>
                </li>
              </ul>
              <div className="bg-white p-4 rounded-lg shadow-md overflow-hidden">
                <img
                  src="/dashboard-screenshot-2.png"
                  alt="Revenue Dashboard visualization"
                  className="w-full rounded-md"
                />
              </div>
            </div>

            {/* Built Inside HubSpot */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                🎯 Built Inside HubSpot
              </h3>
              <p className="text-lg text-gray-700 mb-6">
                No exports. No Frankensteining tools. We use custom properties
                and dashboards directly in your HubSpot portal so your team gets
                accurate, live insights—where they already work.
              </p>
              <div className="bg-white p-4 rounded-lg shadow-md overflow-hidden">
                <img
                  src="/dashboard-screenshot-3.png"
                  alt="HubSpot Dashboard integration"
                  className="w-full rounded-md"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <hr className="border-gray-200" />
      </div>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="inline-block px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium mb-6">
              ⚙️ How It Works
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold mb-4">
                  1
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Connect Portal
                </h3>
                <p className="text-gray-700">
                  We connect to your HubSpot portal (view-only or edit access)
                </p>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold mb-4">
                  2
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Share KPI Needs
                </h3>
                <p className="text-gray-700">
                  You tell us your KPIs and reporting needs
                </p>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold mb-4">
                  3
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Get Dashboard
                </h3>
                <p className="text-gray-700">
                  We deliver a fully interactive dashboard in 5–7 days
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-block px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium mb-6">
              💸 Pricing
            </div>
            <div className="flex flex-col md:flex-row md:space-x-8 justify-center">
              <div className="bg-white rounded-xl shadow-lg p-8 md:w-1/2 mb-8 md:mb-0">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  One-time Setup<span className="text-orange-500">*</span>
                </h3>
                <div className="text-3xl font-bold text-gray-900 mb-4">
                  One flat fee
                </div>
                <p className="text-gray-700 mb-4">
                  Includes full dashboard build + embed setup
                </p>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-8 md:w-1/2">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Monthly Maintenance
                </h3>
                <div className="text-3xl font-bold text-gray-900 mb-4">
                  $250/month
                </div>
                <p className="text-gray-700 mb-4">
                  Hosting, updates, ongoing tweaks
                </p>
              </div>
            </div>
            <div className="mt-10 text-center">
              <p className="text-sm text-gray-600 max-w-2xl mx-auto">
                <span className="font-semibold">*</span> We charge a one-time project fee for the initial dashboard build, then provide ongoing support, maintenance, and updates for the monthly fee. This lets you spread costs over time while ensuring your dashboards stay current and working perfectly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section id="contact" className="py-20 bg-orange-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              👋 Let's make your HubSpot data usable.
            </h2>
            <div className="inline-block">
              <Button
                asChild
                size="lg"
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 md:px-8 md:py-6 font-semibold text-base md:text-lg whitespace-normal"
              >
                <a
                  href={TALLY_FORM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center"
                >
                  Get Started
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 ml-2 flex-shrink-0"
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
        </div>
      </section>
    </div>
  );
}
