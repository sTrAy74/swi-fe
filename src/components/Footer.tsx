import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-black text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 px-8">
        <div className="grid gap-8 sm:grid-cols-3">
          <div>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded overflow-hidden shrink-0">
                <Image 
                  src="/favicon.png" 
                  alt="SolarWealthIndia Logo" 
                  width={32}
                  height={32}
                  className="h-full w-full object-contain"
                  unoptimized
                />
              </div>
              <span className="text-base font-semibold tracking-wide">SolarWealthIndia</span>
            </div>
            <p className="mt-3 text-sm text-white/70">Eligibility and savings depend on scheme rules and usage. Estimates are illustrative only.</p>
          </div>
          <div>
            <p className="text-sm font-semibold">Quick Links</p>
            <ul className="mt-3 space-y-2 text-sm text-white/80">
            <a href="/services" className="hover:text-white whitespace-nowrap">Services</a>
              <li><a href="#calculator" className="hover:text-white">Calculator</a></li>
              <li><a href="#faqs" className="hover:text-white">FAQs</a></li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold">Contact</p>
            <ul className="mt-3 space-y-2 text-sm text-white/80">
              <li><a href="https://wa.me/+919910894406" target="_blank" rel="noopener noreferrer" className="hover:text-white">WhatsApp us</a></li>
              <li><a href={`mailto:hello@solarwealthindia.com`} className="hover:text-white">hello@solarwealthindia.com</a></li>
            </ul>
          </div>
        </div>
        <p className="mt-8 text-xs text-white/50">© 2025 SolarWealthIndia. All rights reserved.</p>
      </div>
    </footer>
  );
}


