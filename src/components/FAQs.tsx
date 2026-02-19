"use client";

import { useState } from "react";

const faqs = [
  {
    q: "Who is eligible for the ₹1.08 lakh subsidy?",
    a: "Eligibility depends on PM Suryaghar Yojana rules, location, and system size. We guide you through the application to confirm eligibility before installation.",
  },
  {
    q: "How much can I actually save per month?",
    a: "A typical homeowner saves about ₹2,400/month, varying by tariff, usage, and system size. We'll estimate your savings from your electricity bill.",
  },
  {
    q: "What is net metering?",
    a: "Net metering credits you for surplus energy sent to the grid, offsetting your consumption from the distribution company (DISCOM).",
  },
  {
    q: "How long is the payback period?",
    a: "Often 3–5 years after subsidy, depending on usage and tariffs. The rest of the lifespan is largely savings.",
  },
  {
    q: "What maintenance is required?",
    a: "Periodic cleaning and basic checks. Panels often carry 25-year performance warranties; inverters usually 5–10 years.",
  },
  {
    q: "What roof do I need?",
    a: "Most concrete or metal roofs with adequate sunlight work. We'll guide system size based on space and orientation.",
  },
];

export default function FAQs() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faqs" className="bg-white text-black">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20 px-8">
        <div className="max-w-3xl">
          <h2 className="text-3xl sm:text-4xl font-bold">FAQs</h2>
        </div>
        <div className="mt-8 divide-y divide-black/10 rounded-xl border border-black/10 bg-white">
          {faqs.map((f, i) => (
            <div key={i} className="p-5">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full text-left flex items-center justify-between"
              >
                <span className="text-base font-semibold">{f.q}</span>
                <span className="ml-4 text-black/40">{open === i ? "−" : "+"}</span>
              </button>
              {open === i && (
                <p className="mt-2 text-black/70 text-sm">{f.a}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


