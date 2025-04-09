
import { Star } from "lucide-react";

const testimonials = [
  {
    quote: "A pleasure to work with. Very responsive. Highly reccomended!",
    author: "Gerry F.",
    role: "Owner, Service Advisor Training"
  },
  {
    quote: "Billy has been so great to work with at Reading Futures! He is responsive to questions and SUPER creative when problem-solving. He's built several tools for our organization to use, and we get great feedback on them from our clients.",
    author: "Cary",
    role: "Site Lead, Reading Futures"
  }
];

export default function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-20 bg-[#0f172a] text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-block px-3 py-1 bg-[#1e293b] text-[#38bdf8] rounded-full text-sm font-medium mb-4">
            Client Success Stories
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">What Our Clients Say</h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            We've helped businesses of all sizes replace complex software with simple, tailored solutions.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-[#1e293b] rounded-xl p-6 border border-[#334155] shadow-lg relative">
              <div className="absolute -top-4 -left-4 w-8 h-8 flex items-center justify-center text-4xl text-[#38bdf8]">"</div>
              <div className="mb-4 text-[#38bdf8] flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-current" />
                ))}
              </div>
              <p className="text-white mb-6">
                {testimonial.quote}
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-[#0ea5e9] rounded-full mr-4 flex items-center justify-center text-white font-bold">
                  {testimonial.author.charAt(0)}
                </div>
                <div>
                  <div className="font-medium text-white">{testimonial.author}</div>
                  <div className="text-sm text-gray-300">{testimonial.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
