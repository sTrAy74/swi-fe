export default function Process() {
  return (
    <section id="process" className="bg-slate-50 text-black">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20 px-8">
        <div className="max-w-3xl">
          <h2 className="text-3xl sm:text-4xl font-bold">Simple steps to get started</h2>
        </div>
        <ol className="mt-8 grid gap-6 sm:grid-cols-3">
          <li className="rounded-xl bg-white p-6 border border-black/10">
            <p className="text-sm text-black/60">Step 1</p>
            <p className="mt-1 text-lg font-semibold">Share your latest electricity bill.</p>
          </li>
          <li className="rounded-xl bg-white p-6 border border-black/10">
            <p className="text-sm text-black/60">Step 2</p>
            <p className="mt-1 text-lg font-semibold">Join our expert webinar.</p>
          </li>
          <li className="rounded-xl bg-white p-6 border border-black/10">
            <p className="text-sm text-black/60">Step 3</p>
            <p className="mt-1 text-lg  font-semibold">Get a transparent estimate and subsidy guidance.</p>
          </li>
        </ol>
        <p className="mt-6 text-sm text-black/60">We simplify solar - so you can start earning effortlessly.</p>
      </div>
    </section>
  );
}


