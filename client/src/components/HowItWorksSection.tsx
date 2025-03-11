import { ChevronRight, Check } from "lucide-react";
import SavingsCalculator from "./SavingsCalculator";

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-20 bg-primary-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-900 mb-4">How We Build Your App</h2>
          <p className="text-lg text-primary-600 max-w-2xl mx-auto">
            A straightforward process from idea to launch, with ongoing support at one flat monthly rate.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <div className="bg-white rounded-xl p-6 shadow-md border border-primary-200 relative">
            <div className="w-12 h-12 rounded-full bg-[#e0f2fe] text-[#0ea5e9] flex items-center justify-center text-xl font-bold mb-5">1</div>
            <h3 className="text-xl font-bold text-primary-900 mb-3">Discovery Call</h3>
            <p className="text-primary-600">
              We learn about your specific needs and pain points to understand exactly what you need to get done.
            </p>
            <div className="absolute top-6 right-6 text-[#0ea5e9]">
              <ChevronRight className="h-6 w-6" />
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-white rounded-xl p-6 shadow-md border border-primary-200 relative">
            <div className="w-12 h-12 rounded-full bg-[#e0f2fe] text-[#0ea5e9] flex items-center justify-center text-xl font-bold mb-5">2</div>
            <h3 className="text-xl font-bold text-primary-900 mb-3">Custom Design</h3>
            <p className="text-primary-600">
              We design and build your app with only the features you need, focusing on simplicity and getting things done.
            </p>
            <div className="absolute top-6 right-6 text-[#0ea5e9]">
              <ChevronRight className="h-6 w-6" />
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-white rounded-xl p-6 shadow-md border border-primary-200 relative">
            <div className="w-12 h-12 rounded-full bg-[#e0f2fe] text-[#0ea5e9] flex items-center justify-center text-xl font-bold mb-5">3</div>
            <h3 className="text-xl font-bold text-primary-900 mb-3">Flat-Fee Support</h3>
            <p className="text-primary-600">
              We maintain and update your app for a predictable monthly fee — no matter how many people use it.
            </p>
            <div className="absolute top-6 right-6 text-[#0ea5e9]">
              <Check className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="mt-16 bg-white rounded-xl p-8 shadow-md border border-primary-200">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold text-primary-900 mb-4">Why Our Approach Works</h3>
              <p className="text-primary-600 mb-6">
                Traditional SaaS pricing charges per user, which means your costs keep growing as your team grows. Our flat monthly fee model saves you money and keeps costs predictable.  Consider the costs when you factor in multiple SaaS subscriptions per team member.
              </p>
              <ul className="space-y-4">
                <li className="flex">
                  <div className="h-6 w-6 text-[#f97316] mr-3 flex-shrink-0">
                    <Check className="h-6 w-6" />
                  </div>
                  <div>
                    <span className="font-medium text-primary-900">Only pay for what you need</span>
                    <p className="text-primary-600 text-sm">No wasted features or bloated costs.</p>
                  </div>
                </li>
                <li className="flex">
                  <div className="h-6 w-6 text-[#f97316] mr-3 flex-shrink-0">
                    <Check className="h-6 w-6" />
                  </div>
                  <div>
                    <span className="font-medium text-primary-900">Grow without penalty</span>
                    <p className="text-primary-600 text-sm">Add users without increasing your monthly cost.</p>
                  </div>
                </li>
                <li className="flex">
                  <div className="h-6 w-6 text-[#f97316] mr-3 flex-shrink-0">
                    <Check className="h-6 w-6" />
                  </div>
                  <div>
                    <span className="font-medium text-primary-900">Ongoing improvements</span>
                    <p className="text-primary-600 text-sm">We keep enhancing your app based on your feedback.</p>
                  </div>
                </li>
              </ul>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-[#f97316] rounded-xl rotate-2 opacity-10"></div>
              <div className="bg-primary-50 p-6 rounded-xl border border-primary-200 relative">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-bold text-primary-900">Multiple SaaS Subscriptions</h4>
                    <div className="text-primary-400 text-sm">Per-user pricing adds up</div>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-primary-200">
                    <div className="flex justify-between">
                      <div>
                        <div className="text-primary-900 font-medium">Project Management</div>
                        <div className="text-xs text-primary-500">$15 per user × 10 users</div>
                      </div>
                      <div className="font-bold text-primary-900">$150/mo</div>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-primary-200">
                    <div className="flex justify-between">
                      <div>
                        <div className="text-primary-900 font-medium">CRM Software</div>
                        <div className="text-xs text-primary-500">$25 per user × 10 users</div>
                      </div>
                      <div className="font-bold text-primary-900">$250/mo</div>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-primary-200">
                    <div className="flex justify-between">
                      <div>
                        <div className="text-primary-900 font-medium">Workflow Automation</div>
                        <div className="text-xs text-primary-500">$20 per user × 10 users</div>
                      </div>
                      <div className="font-bold text-primary-900">$200/mo</div>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-primary-200">
                    <div className="flex justify-between">
                      <div>
                        <div className="text-primary-900 font-medium">Premium Features</div>
                        <div className="text-xs text-primary-500">Add-ons and upgrades</div>
                      </div>
                      <div className="font-bold text-primary-900">$300/mo</div>
                    </div>
                  </div>
                  <div className="bg-primary-50 p-4 rounded-lg border border-primary-200">
                    <div className="flex justify-between">
                      <div>
                        <div className="text-primary-900 font-medium font-bold">Total Monthly Cost</div>
                        <div className="text-xs text-primary-500">For 10 team members</div>
                      </div>
                      <div className="font-bold text-primary-900">$900/mo</div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-primary-300">
                  <div className="flex justify-between items-center">
                    <h4 className="font-bold text-primary-900">Our Approach</h4>
                    <div className="text-primary-400 text-sm">One flat monthly fee</div>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-primary-200 mt-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-primary-900 font-medium">Custom App</div>
                        <div className="text-xs text-primary-500">Unlimited users</div>
                      </div>
                      <div className="font-bold text-[#0ea5e9] text-xl">$750/mo</div>
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