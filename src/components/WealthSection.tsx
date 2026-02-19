export default function WealthSection() {
  return (
    <section id="wealth" className="bg-white text-black">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20 px-8" >
        <div className="max-w-3xl">
          <h2 className="text-3xl sm:text-4xl font-bold">Your ₹87,000 investment can grow into ₹48 lakh in 25 years.</h2>
          <p className="mt-4 text-base text-black/70">Switching to solar means saving about ₹2,400 every month on your power bills. As electricity costs rise 5% per year, your savings grow steadily. If those monthly savings are invested at a 10% annual return, you build over ₹48 lakh in wealth in 25 years - all from your rooftop.</p>
          <p className="mt-2 text-sm font-semibold text-amber-600">Sunlight today. Wealth tomorrow.</p>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          <div className="rounded-xl border border-black/10 p-5">
            <p className="text-sm text-black/60">Monthly bill savings</p>
            <p className="mt-1 text-2xl font-bold">≈ ₹2,400</p>
          </div>
          <div className="rounded-xl border border-black/10 p-5">
            <p className="text-sm text-black/60">Electricity cost rise</p>
            <p className="mt-1 text-2xl font-bold">~5%/yr</p>
          </div>
          <div className="rounded-xl border border-black/10 p-5">
            <p className="text-sm text-black/60">Invested return</p>
            <p className="mt-1 text-2xl font-bold">~10%/yr</p>
          </div>
        </div>
        <div className="mt-8">
          <a href="#calculator" className="inline-flex items-center justify-center rounded-full bg-black text-white hover:bg-black/90 h-12 px-6 font-semibold">Estimate your savings →</a>
        </div>
      </div>
    </section>
  );
}


