import React from "react";

// Just use text for now - it looks cleaner and loads instantly
const companies = [
  "Amazon",
  "Netflix",
  "Mashable",
  "Atlassian",
  "Forbes",
];

const ClientsSection = () => {
  return (
    <section className="py-20 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <p className="text-sm font-semibold tracking-widest text-gray-400 uppercase mb-8">
          Trusted by Industry Leaders
        </p>
        
        {/* Logo Row - Using Text as Placeholders */}
        <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 opacity-60">
          {companies.map((company) => (
            <h3 key={company} className="text-2xl md:text-3xl font-bold text-gray-400 hover:text-blue-900 transition-colors cursor-default">
              {company}
            </h3>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ClientsSection