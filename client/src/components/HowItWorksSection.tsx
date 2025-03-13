import { ChevronRight, Check } from "lucide-react";
import SavingsCalculator from "./SavingsCalculator";

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-20 bg-primary-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-900 mb-4">
            How We Build Your App
          </h2>
          <p className="text-lg text-primary-600 max-w-2xl mx-auto">
            A straightforward process from idea to launch, with ongoing support
            at one flat monthly rate.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <div className="bg-white rounded-xl p-6 shadow-md border border-primary-200 relative">
            <div className="w-12 h-12 rounded-full bg-[#e0f2fe] text-[#0ea5e9] flex items-center justify-center text-xl font-bold mb-5">
              1
            </div>
            <h3 className="text-xl font-bold text-primary-900 mb-3">
              Discovery Call
            </h3>
            <p className="text-primary-600">
              We learn about your specific needs and pain points to understand
              exactly what you need to get done.
            </p>
            <div className="absolute top-6 right-6 text-[#0ea5e9]">
              <ChevronRight className="h-6 w-6" />
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-white rounded-xl p-6 shadow-md border border-primary-200 relative">
            <div className="w-12 h-12 rounded-full bg-[#e0f2fe] text-[#0ea5e9] flex items-center justify-center text-xl font-bold mb-5">
              2
            </div>
            <h3 className="text-xl font-bold text-primary-900 mb-3">
              Custom Design
            </h3>
            <p className="text-primary-600">
              We design and build your app with only the features you need,
              focusing on simplicity and getting things done.
            </p>
            <div className="absolute top-6 right-6 text-[#0ea5e9]">
              <ChevronRight className="h-6 w-6" />
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-white rounded-xl p-6 shadow-md border border-primary-200 relative">
            <div className="w-12 h-12 rounded-full bg-[#e0f2fe] text-[#0ea5e9] flex items-center justify-center text-xl font-bold mb-5">
              3
            </div>
            <h3 className="text-xl font-bold text-primary-900 mb-3">
              Flat-Fee Support
            </h3>
            <p className="text-primary-600">
              We maintain and update your app for a predictable monthly fee of $250* — no
              matter how many people use it.
            </p>
            <p className="text-primary-500 text-xs mt-2">
              *Flat fee could be higher or lower depending on the complexity of your app. New feature buildouts will be billed at a discounted rate.
            </p>
            <div className="absolute top-6 right-6 text-[#0ea5e9]">
              <Check className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="mt-16 bg-white rounded-xl p-8 shadow-md border border-primary-200">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold text-primary-900 mb-4">
                Why Our Approach Works
              </h3>
              <p className="text-primary-600 mb-6">
                Traditional SaaS pricing charges per user, which means your
                costs keep growing as your team grows. Our flat monthly fee
                model saves you money and keeps costs predictable. Consider the
                costs when you factor in multiple SaaS subscriptions per team
                member.
              </p>
              <ul className="space-y-4">
                <li className="flex">
                  <div className="h-6 w-6 text-[#f97316] mr-3 flex-shrink-0">
                    <Check className="h-6 w-6" />
                  </div>
                  <div>
                    <span className="font-medium text-primary-900">
                      Only pay for what you need
                    </span>
                    <p className="text-primary-600 text-sm">
                      No wasted features or bloated costs.
                    </p>
                  </div>
                </li>
                <li className="flex">
                  <div className="h-6 w-6 text-[#f97316] mr-3 flex-shrink-0">
                    <Check className="h-6 w-6" />
                  </div>
                  <div>
                    <span className="font-medium text-primary-900">
                      Grow without penalty
                    </span>
                    <p className="text-primary-600 text-sm">
                      Add as many users as you want without increasing your
                      cost.
                    </p>
                  </div>
                </li>
                <li className="flex">
                  <div className="h-6 w-6 text-[#f97316] mr-3 flex-shrink-0">
                    <Check className="h-6 w-6" />
                  </div>
                  <div>
                    <span className="font-medium text-primary-900">
                      Ongoing support included
                    </span>
                    <p className="text-primary-600 text-sm">
                      No extra charges for simple updates or help when you need it.
                    </p>
                  </div>
                </li>
              </ul>
            </div>
            <div className="space-y-6">
              <div className="bg-[#f8fafc] p-6 rounded-xl border border-primary-200">
                <h4 className="text-xl font-bold text-primary-900 mb-4">
                  Traditional SaaS Costs
                </h4>
                <p className="text-primary-600 mb-4">
                  For a team of 20 people using multiple tools:
                </p>
                <div className="space-y-2">
                  <div className="bg-white rounded-lg p-4 border border-primary-200">
                    <div className="flex justify-between">
                      <div>
                        <div className="text-primary-900 font-medium">
                          Project Management
                        </div>
                        <div className="text-xs text-primary-500">
                          $15/user/month
                        </div>
                      </div>
                      <div className="font-bold text-primary-900">$300/mo</div>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-primary-200">
                    <div className="flex justify-between">
                      <div>
                        <div className="text-primary-900 font-medium">
                          CRM Software
                        </div>
                        <div className="text-xs text-primary-500">
                          $25/user/month
                        </div>
                      </div>
                      <div className="font-bold text-primary-900">$450/mo</div>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-primary-200">
                    <div className="flex justify-between">
                      <div>
                        <div className="text-primary-900 font-medium">CMS</div>
                        <div className="text-xs text-primary-500">
                          $20/user/month
                        </div>
                      </div>
                      <div className="font-bold text-primary-900">$400/mo</div>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-primary-200 mt-3">
                    <div className="flex justify-between items-center">
                      <div className="text-primary-900 font-medium">
                        Total Monthly Cost
                      </div>
                      <div className="font-bold text-lg text-primary-900">
                        $1150/mo
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-[#ebf8ff] p-6 rounded-xl border border-[#90cdf4]">
                <h4 className="text-xl font-bold text-[#2b6cb0] mb-4">
                  Our Approach
                </h4>
                <div className="bg-white rounded-lg p-4 border border-[#90cdf4]">
                  <div className="flex justify-between items-center">
                    <div className="text-[#2b6cb0] font-medium">
                      One Flat Monthly Fee
                    </div>
                    <div className="font-bold text-lg text-[#2b6cb0]">
                      $750/mo
                    </div>
                  </div>
                  <div className="text-[#4299e1] text-sm mt-1">
                    No matter how many users
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-[#90cdf4]">
                  <div className="flex justify-between items-center text-[#2b6cb0]">
                    <div className="font-medium">
                      Annual savings vs. traditional SaaS
                    </div>
                    <div className="font-bold text-lg">
                      ${(1150 - 750) * 12}/year
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16">
          <SavingsCalculator />
        </div>
      </div>
    </section>
  );
}
