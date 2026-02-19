export default function Hero() {
  return (
    <section className="relative" aria-label="Hero">
      <div className="absolute inset-0 overflow-hidden">
        <video
          className="h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster="/pexels-photo-433308.avif"
          
        >
          <source src="/15046856-uhd_4096_2160_24fps.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/60" />
      </div>
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-28 sm:py-36  px-8 text-white">
        <div className="max-w-2xl">
          <h1 className="text-4xl sm:text-5xl font-bold leading-tight">Turn Your Roof into a Wealth Generator</h1>
          <p className="mt-4 text-lg sm:text-xl text-white/90">Get ₹1.08 lakh subsidy directly from the Government and start earning from sunlight.</p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <a
              href="/services"
              className="inline-flex items-center justify-center rounded-full bg-emerald-500 hover:bg-emerald-600 text-white h-12 px-6 font-semibold shadow-lg"
            >
              Check Services
            </a>
            <a href="https://shop.solarwealthindia.com/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white h-12 px-6 font-semibold">
              Visit Shop
            </a>
          </div>
          <p className="mt-3 text-xs text-white/60">Eligibility and subsidy amounts depend on scheme rules. Terms apply.</p>
        </div>
      </div>
    </section>
  );
}


