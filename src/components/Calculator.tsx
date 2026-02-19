"use client";

import { useMemo, useState } from "react";

type CalculatorInputs = {
  monthlyBill: number;
  inflationRatePct: number; 
  investReturnPct: number;
  years: number;
};

export default function Calculator() {
  const [inputs, setInputs] = useState<CalculatorInputs>({
    monthlyBill: 2400,
    inflationRatePct: 5,
    investReturnPct: 10,
    years: 25,
  });

  const results = useMemo(() => {
    const months = inputs.years * 12;
    const monthlyInflation = Math.pow(1 + inputs.inflationRatePct / 100, 1 / 12) - 1;
    const monthlyReturn = Math.pow(1 + inputs.investReturnPct / 100, 1 / 12) - 1;

    let wealth = 0;
    let monthlySaving = inputs.monthlyBill;
    for (let m = 0; m < months; m++) {
      wealth = wealth * (1 + monthlyReturn) + monthlySaving;
      monthlySaving = monthlySaving * (1 + monthlyInflation);
    }

    const totalSavedNominal = Array.from({ length: months }).reduce((acc: number, _, i) => {
      return acc + inputs.monthlyBill * Math.pow(1 + monthlyInflation, i);
    }, 0);

    return {
      wealth,
      totalSavedNominal,
    };
  }, [inputs]);

  function formatINR(n: number) {
    return n.toLocaleString("en-IN", { maximumFractionDigits: 0 });
  }

  return (
    <section id="calculator" className="bg-white text-black">
      <div className="mx-auto max-w-7xl px-4 lg:px-8 py-16 sm:py-20 sm:px-8 px-8">
        <div className="max-w-3xl">
          <h2 className="text-3xl sm:text-4xl font-bold">Savings & Wealth Calculator</h2>
          <p className="mt-2 text-black/70 text-sm">Assumptions are illustrative. Actual results vary by tariff, usage, and system size.</p>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <form className="space-y-5">
            <div>
              <label className="block text-sm font-medium">Starting monthly saving (₹)</label>
              <input
                type="number"
                value={inputs.monthlyBill}
                onChange={(e) => setInputs({ ...inputs, monthlyBill: Number(e.target.value) || 0 })}
                className="mt-2 w-full rounded-lg border border-black/10 px-3 py-2"
                min={0}
              />
              <p className="mt-1 text-xs text-black/50">Typical: ₹2,400/month</p>
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium">Electricity inflation (%/yr)</label>
                <input
                  type="number"
                  value={inputs.inflationRatePct}
                  onChange={(e) => setInputs({ ...inputs, inflationRatePct: Number(e.target.value) || 0 })}
                  className="mt-2 w-full rounded-lg border border-black/10 px-3 py-2"
                  min={0}
                  step={0.1}
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Invested return (%/yr)</label>
                <input
                  type="number"
                  value={inputs.investReturnPct}
                  onChange={(e) => setInputs({ ...inputs, investReturnPct: Number(e.target.value) || 0 })}
                  className="mt-2 w-full rounded-lg border border-black/10 px-3 py-2"
                  min={0}
                  step={0.1}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium">Years</label>
              <input
                type="number"
                value={inputs.years}
                onChange={(e) => setInputs({ ...inputs, years: Number(e.target.value) || 0 })}
                className="mt-2 w-full rounded-lg border border-black/10 px-3 py-2"
                min={1}
                max={30}
              />
            </div>


          </form>

          <div className="rounded-2xl border border-black/10 p-6 bg-slate-50">
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <p className="text-sm mt-6 text-black/60">Projected wealth in {inputs.years} years</p>
                <p className="mt-6 text-4xl font-bold">₹ {formatINR(results.wealth)}</p>
              </div>
              <div>
                <p className="text-sm mt-6 text-black/60">Total nominal savings contributed</p>
                <p className="mt-6 text-4xl font-bold">₹ {formatINR(results.totalSavedNominal)}</p>
              </div>
            </div>
            <p className="mt-14 text-xs text-black/60">Method: monthly savings grow with electricity inflation; savings are invested monthly at selected return; values are illustrative and not financial advice.</p>
          </div>
          <div className="pt-2">
              <a href="https://wa.me/+919910894406" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center rounded-full bg-emerald-500 hover:bg-emerald-600 text-white h-11 px-6 font-semibold">Talk to Us on WhatsApp</a>
            </div>
        </div>
      </div>
    </section>
  );
}


