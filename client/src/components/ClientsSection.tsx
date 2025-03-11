
import React from "react";

const clients = [
  { 
    name: "Service Advisors Training", 
    url: "https://serviceadvisortraining.com"
  },
  { 
    name: "Arena Club", 
    url: "https://arenaclub.com"
  },
  { 
    name: "Reading Futures, Inc.", 
    url: "https://readingfutures.com"
  },
  { 
    name: "Fashion Pass", 
    url: "https://fashionpass.com"
  }
];

export default function ClientsSection() {
  return (
    <section className="py-12 bg-white border-y border-primary-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <p className="text-primary-600 font-medium">Trusted by smart businesses everywhere</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 items-center justify-items-center">
          {clients.map((client, index) => (
            <a 
              key={index} 
              href={client.url}
              target="_blank"
              rel="noopener noreferrer"
              className="h-12 flex items-center hover:opacity-70 transition"
            >
              <div className="text-primary-700 font-bold text-xl">{client.name}</div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
