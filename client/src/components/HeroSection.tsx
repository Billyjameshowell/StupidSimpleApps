import { Button } from "@/components/ui/button";
import { CALENDLY_URL } from "@/constants";

export default function HeroSection() {
  return (
    <section className="pt-28 pb-16 md:pt-36 md:pb-24 bg-gradient-to-br from-white to-primary-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-block px-3 py-1 bg-[#fff7ed] text-[#ea580c] rounded-full text-sm font-medium">
              Stupid Simple Approach
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary-900 leading-tight">
              Custom Apps <span className="text-[#0ea5e9]">Without</span> The
              Complexity
            </h1>
            <p className="text-lg md:text-xl text-primary-600 max-w-lg">
              We build tailored apps for businesses who want to get stuff done
              without excessive features or per-user costs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                asChild
                size="lg"
                className="bg-[#0ea5e9] hover:bg-[#0284c7] text-white px-6 py-3 font-semibold"
              >
                <a
                  href={CALENDLY_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Get Started
                </a>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-primary-300 hover:border-primary-400 bg-white hover:bg-primary-50 text-primary-800 px-6 py-3 font-semibold"
              >
                <a href="#how-it-works">How It Works</a>
              </Button>
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-[#0ea5e9] rounded-3xl rotate-3 opacity-20"></div>
            <div className="relative bg-white p-6 rounded-3xl shadow-xl border border-primary-200">
              <img
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2600&auto=format&fit=crop"
                alt="Simple app interface on a phone"
                className="rounded-lg w-full h-full object-cover shadow-md"
              />
              <div className="absolute -bottom-5 -right-5 bg-white rounded-2xl p-4 shadow-lg border border-primary-200">
                <div className="flex items-center space-x-2">
                  <div className="w-10 h-10 bg-[#f97316] rounded-full flex items-center justify-center text-white font-bold">
                    $
                  </div>
                  <div>
                    <p className="text-sm text-primary-600 font-medium">
                      Flat Monthly Fee
                    </p>
                    <p className="text-primary-900 font-bold">
                      No Per-User Costs
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
