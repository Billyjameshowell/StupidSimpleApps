import { Star } from "lucide-react";

const testimonials = [
  {
    quote: "A pleasure to work with. Very responsive. Highly recommended!",
    author: "Gerry F.",
    role: "Owner, Service Advisor Training",
  },
  {
    quote:
      "Billy has been so great to work with at Reading Futures! He is responsive to questions and SUPER creative when problem-solving. He's built several tools for our organization to use, and we get great feedback on them from our clients.",
    author: "Cary",
    role: "Site Lead, Reading Futures",
  },
];

export default function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-24 bg-[#0f172a] text-white">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="text-center mb-20">
          <span className="inline-block px-4 py-1 bg-[#1e293b] text-[#38bdf8] rounded-full text-sm font-semibold tracking-wide uppercase">
            Client Success Stories
          </span>
          <h2 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
            What Our Clients Say
          </h2>
          <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
            We replace complexity with clarity—simple, custom solutions that
            scale with you.
          </p>
        </div>

        <div className="grid gap-10 sm:grid-cols-1 md:grid-cols-2">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="group relative bg-[#1e293b] border border-[#334155] rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-shadow duration-300"
            >
              <div className="absolute top-6 left-6 text-5xl text-[#38bdf8] font-serif leading-none opacity-20 group-hover:opacity-30">
                “
              </div>
              <div className="mb-4 ml-6 text-[#38bdf8] flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-5 w-5 fill-[#38bdf8] text-[#38bdf8]"
                  />
                ))}
              </div>
              <p className="ml-6 text-lg text-white relative z-10 leading-relaxed">
                {testimonial.quote}
              </p>
              <div className="mt-6 ml-6 flex items-center">
                <div className="w-12 h-12 bg-gradient-to-tr from-[#0ea5e9] to-[#38bdf8] rounded-full shadow-md mr-4 flex items-center justify-center text-white font-bold text-lg">
                  {testimonial.author.charAt(0)}
                </div>
                <div>
                  <div className="font-semibold text-white">
                    {testimonial.author}
                  </div>
                  <div className="text-sm text-gray-400">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
