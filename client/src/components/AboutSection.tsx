export default function AboutSection() {
  return (
    <section id="about" className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <div className="absolute inset-0 bg-[#0ea5e9] rounded-3xl -rotate-3 opacity-20"></div>
            <div className="relative overflow-hidden rounded-3xl shadow-xl">
              <img 
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2670&auto=format&fit=crop"
                alt="Team collaborating on software" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div className="space-y-6">
            <div className="inline-block px-3 py-1 bg-[#e0f2fe] text-[#0284c7] rounded-full text-sm font-medium">
              About Us
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-primary-900">We Believe in Simplicity</h2>
            <p className="text-lg text-primary-600">
              We started Stupid Simple Apps because we were tired of seeing businesses struggle with complicated software that did way more than they needed — at a premium price.
            </p>
            <p className="text-lg text-primary-600">
              Our philosophy is straightforward: figure out exactly what you need to accomplish, build an app that does precisely that, and charge a predictable fee without penalizing growth.
            </p>
            <div className="grid md:grid-cols-2 gap-4 mt-8">
              <div className="bg-primary-50 p-4 rounded-lg border border-primary-200">
                <div className="text-2xl font-bold text-[#0ea5e9] mb-1">50+</div>
                <div className="text-primary-700">Custom apps built</div>
              </div>
              <div className="bg-primary-50 p-4 rounded-lg border border-primary-200">
                <div className="text-2xl font-bold text-[#0ea5e9] mb-1">3.5x</div>
                <div className="text-primary-700">Average ROI for clients</div>
              </div>
              <div className="bg-primary-50 p-4 rounded-lg border border-primary-200">
                <div className="text-2xl font-bold text-[#0ea5e9] mb-1">24hrs</div>
                <div className="text-primary-700">Average support response</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
