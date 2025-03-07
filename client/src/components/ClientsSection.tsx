const clients = [
  { name: "ACME Inc." },
  { name: "TechCorp" },
  { name: "Globex" },
  { name: "Initech" },
  { name: "Umbrella" },
  { name: "Massive" },
];

export default function ClientsSection() {
  return (
    <section className="py-12 bg-white border-y border-primary-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <p className="text-primary-600 font-medium">Trusted by smart businesses everywhere</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center justify-items-center">
          {clients.map((client, index) => (
            <div 
              key={index} 
              className="h-12 flex items-center grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition"
            >
              <div className="text-primary-400 font-bold text-xl">{client.name}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
