import { Check } from "lucide-react";
import ContactForm from "./ContactForm";
import { CALENDLY_URL } from "@/constants";

export default function ContactSection() {
  return (
    <section id="contact" className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto bg-primary-50 rounded-2xl overflow-hidden shadow-xl border border-primary-200">
          <div className="grid md:grid-cols-2">
            <div className="p-8 lg:p-12">
              <div className="mb-8">
                <div className="inline-block px-3 py-1 bg-[#e0f2fe] text-[#0284c7] rounded-full text-sm font-medium mb-3">
                  Get Started
                </div>
                <h3 className="text-2xl font-bold text-primary-900 mb-4">
                  Ready for a Simpler Solution?
                </h3>
                <p className="text-primary-600">
                  Tell us about your needs and we'll schedule a free
                  consultation to see if we're a good fit.
                </p>
              </div>

              <ContactForm />
            </div>

            <div className="bg-[#0f172a] p-8 lg:p-12 text-white flex flex-col justify-between">
              <div>
                <h4 className="text-xl font-bold mb-6">
                  Why Clients Choose Us
                </h4>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <Check className="h-6 w-6 text-[#f97316] mr-3 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-100">
                      Custom apps designed around your specific workflow
                    </span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-6 w-6 text-[#f97316] mr-3 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-100">
                      Flat monthly fee with no per-user pricing
                    </span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-6 w-6 text-[#f97316] mr-3 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-100">
                      No bloated features you'll never use
                    </span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-6 w-6 text-[#f97316] mr-3 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-100">
                      Ongoing support and updates included
                    </span>
                  </li>
                </ul>
              </div>

              <div className="mt-8 pt-8 border-t border-[#334155]">
                <h4 className="text-lg font-medium mb-4">Have questions?</h4>
                <div className="flex items-center mb-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-[#38bdf8] mr-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <a
                    href="mailto:billy@stupid-simple-apps.com"
                    className="text-[#7dd3fc] hover:text-[#bae6fd] transition"
                  >
                    billy@stupid-simple-apps.com
                  </a>
                </div>
                
                <div className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-[#38bdf8] mr-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <a
                    href={CALENDLY_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#7dd3fc] hover:text-[#bae6fd] transition"
                  >
                    Schedule a call
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
