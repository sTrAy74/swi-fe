import Image from "next/image";

export default function Knowledge() {
  return (
    <section id="knowledge" className="relative bg-white text-black">
      <div className="absolute inset-0 overflow-hidden">
        <Image
          src="/pexels-photo-371917.jpeg"
          alt="Solar education webinar"
          fill
          className="object-cover"
          sizes="100vw"
          priority={false}
        />
        <div className="absolute inset-0 bg-gray-900/85" />
      </div>
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="max-w-3xl">
          <h2 className="text-3xl sm:text-4xl text-white/90 font-bold">Understand before you install.</h2>
          <p className="mt-4 text-white/80">We believe in education before action. That’s why SolarWealthIndia hosts free daily webinars with experts who explain:</p>
          <ul className="mt-4 list-disc pl-6 text-white/80 space-y-2">
            <li>How subsidies work</li>
            <li>What system size fits your home</li>
            <li>How much you’ll actually save</li>
            <li>How to find the right installer and financier</li>
          </ul>
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <a href="https://wa.me/+919910894406" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center rounded-full bg-emerald-500 hover:bg-emerald-600 text-white h-12 px-9 font-semibold">Talk to Us on WhatsApp</a>
          </div>
        </div>
      </div>
    </section>
  );
}