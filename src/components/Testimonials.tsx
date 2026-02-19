export default function Testimonials() {
  return (
    <section className="bg-gray-50 text-black">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20 px-8">
        <div className="max-w-3xl">
          <h2 className="text-3xl sm:text-4xl font-bold">People like you are already earning from their rooftops.</h2>
        </div>
        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          <figure className="rounded-xl border border-black/10 p-6 bg-white">
            <blockquote className="text-black/80">“Subsidy came directly into my account within weeks!”</blockquote>
          </figure>
          <figure className="rounded-xl border border-black/10 p-6 bg-white">
            <blockquote className="text-black/80">“My ₹90,000 investment now saves me ₹2,400 every month.”</blockquote>
          </figure>
          <figure className="rounded-xl border border-black/10 p-6 bg-white">
            <blockquote className="text-black/80">“It feels good to power my home and my country.”</blockquote>
          </figure>
        </div>
      </div>
    </section>
  );
}


