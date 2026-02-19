'use client';

import { Suspense, useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import FiltersPanel, { FiltersState } from '@/components/services/FiltersPanel';
import SortBar from '@/components/services/SortBar';
import ProviderCard, { ProviderItem } from '@/components/services/ProviderCard';
import Pagination from '@/components/services/Pagination';
import Footer from '@/components/Footer';
import { fetchProviders, ProvidersListResponse } from '@/lib/api/providers';
import { absolutizeUrl } from '@/lib/utils/url';
import { useAuthModal } from '@/components/providers/AuthModalProvider';

function ServicesPageContent() {
  const [filters, setFilters] = useState<FiltersState>({
    query: '',
    city: '',
    state: '',
    min_experience: undefined,
    max_experience: undefined,
    min_rating: undefined,
    max_rating: undefined,
    services: '' as 'Installation' | 'Consultation' | 'Maintenance' | '',
    sortBy: 'createdAt',
    order: 'desc',
  });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<ProvidersListResponse | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { openLogin } = useAuthModal();

  const scrollToSearch = () => {
    const element = document.getElementById('search-providers');
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };
  const scrollToProviders = () => {
    const element = document.getElementById('become-providers');
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    if (!searchParams) return;
    const qp = new URLSearchParams(searchParams.toString());
    setFilters((prev) => ({
      ...prev,
      query: qp.get('search') || '',
      city: qp.get('city') || '',
      state: qp.get('state') || '',
      min_experience: qp.get('min_experience') ? Number(qp.get('min_experience')) : undefined,
      max_experience: qp.get('max_experience') ? Number(qp.get('max_experience')) : undefined,
      min_rating: qp.get('min_rating') ? Number(qp.get('min_rating')) : undefined,
      max_rating: qp.get('max_rating') ? Number(qp.get('max_rating')) : undefined,
      services: (qp.get('services') as 'Installation' | 'Consultation' | 'Maintenance' | '') || '',
      sortBy: qp.get('sortBy') || 'createdAt',
      order: (qp.get('order') as 'asc' | 'desc') || 'desc',
    }));
    setPage(qp.get('page') ? Number(qp.get('page')) : 1);
    setPageSize(qp.get('pageSize') ? Number(qp.get('pageSize')) : 10);
  }, [searchParams]);

  useEffect(() => {
    const qp = new URLSearchParams();
    if (filters.query) qp.set('search', filters.query);
    if (filters.city) qp.set('city', filters.city);
    if (filters.state) qp.set('state', filters.state);
    if (filters.min_experience != null) qp.set('min_experience', String(filters.min_experience));
    if (filters.max_experience != null) qp.set('max_experience', String(filters.max_experience));
    if (filters.min_rating != null) qp.set('min_rating', String(filters.min_rating));
    if (filters.max_rating != null) qp.set('max_rating', String(filters.max_rating));
    if (filters.services) qp.set('services', String(filters.services));
    if (filters.sortBy) qp.set('sortBy', String(filters.sortBy));
    if (filters.order) qp.set('order', String(filters.order));
    if (page !== 1) qp.set('page', String(page));
    if (pageSize !== 10) qp.set('pageSize', String(pageSize));
    const query = qp.toString();
    const newUrl = `${pathname}${query ? `?${query}` : ''}`;
    
    if (window.location.pathname + window.location.search !== newUrl) {
      window.history.replaceState(null, '', newUrl);
    }
  }, [filters, page, pageSize, pathname]);


  useEffect(() => {
    const controller = new AbortController();
    abortRef.current?.abort();
    abortRef.current = controller;
    setLoading(true);
    setError(null);

    const handle = setTimeout(() => {
      fetchProviders({
        page,
        pageSize,
        search: filters.query || undefined,
        city: filters.city || undefined,
        state: filters.state || undefined,
        min_experience: filters.min_experience,
        max_experience: filters.max_experience,
        min_rating: filters.min_rating,
        max_rating: filters.max_rating,
        service: filters.services || undefined,
        sortBy: filters.sortBy || undefined,
        order: filters.order || undefined,
      }, controller.signal)
        .then((res) => setResponse(res))
        .catch((e: unknown) => {
          if (e && typeof e === 'object' && 'name' in e && e.name === 'AbortError') return;
          const message = e && typeof e === 'object' && 'message' in e && typeof e.message === 'string'
            ? e.message
            : 'Failed to load providers';
          setError(message);
        })
        .finally(() => setLoading(false));
    }, 300);

    return () => {
      clearTimeout(handle);
      controller.abort();
    };
  }, [filters, page, pageSize]);

  const providers: ProviderItem[] = useMemo(() => {
    if (!response) return [];
    
    return response.data.map((p) => ({
      id: p.id,
      name: p.business_name || p.full_name,
      city: p.city,
      state: p.state,
      address: p.address,
      pincode: p.pincode,
      about: p.about,
      latitude: p.latitude,
      longitude: p.longitude,
      experience_years: p.experience_years,
      avg_rating: p.avg_rating,
      services: p.services?.map((s) => ({ id: s.id, title: s.title })),
      image: absolutizeUrl(p.logo || p.cover_photo || undefined),
    }));
  }, [response]);

  const onFiltersChangeMemo = useCallback((next: Partial<FiltersState>) => {
    setPage(1);
    setFilters((prev: FiltersState) => ({ ...prev, ...next }));
  }, []);

  const total = response?.meta.total || 0;
  const totalPages = response?.meta.totalPages || 1;

  return (
    <main className="bg-white text-black">
      <section className="relative" aria-label="Hero">
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src="/pexels-kindelmedia-9800008.jpg"
            alt="Solar panel carport structure"
            fill
            className="object-cover"
            priority
            unoptimized
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-28 sm:py-36">
          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white">Powering India with Trusted Solar Experts</h1>
            <p className="mt-4 text-lg sm:text-xl text-white/90">Connect with verified, certified solar professionals across India. Find the perfect installer for your rooftop solar project.</p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <button
                onClick={scrollToSearch}
                className="inline-flex items-center justify-center rounded-full bg-emerald-600 hover:bg-emerald-700 text-white h-12 px-8 font-semibold shadow-lg transition-colors"
              >
                Find Providers
              </button>
              <button
                onClick={scrollToProviders}
                className="inline-flex items-center justify-center rounded-full border-2 border-white hover:bg-white/10 text-white h-12 px-8 font-semibold transition-colors"
              >
                Become a Provider
              </button>
            </div>
            <button
              onClick={() => {
                const element = document.getElementById('how-it-works');
                if (element) {
                  const headerOffset = 80;
                  const elementPosition = element.getBoundingClientRect().top;
                  const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                  window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
                }
              }}
              className="mt-4 text-sm text-white/80 hover:text-white font-medium"
            >
              How it works →
            </button>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="max-w-3xl mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold">What We Offer</h2>
            <p className="mt-4 text-black/70">Comprehensive solar services to power your home and business.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="rounded-xl border border-black/10 bg-white p-6">
              <h3 className="text-xl font-semibold text-black mb-2">Installation & Design</h3>
              <p className="text-sm text-black/70">Professional rooftop solar system installation with custom design solutions.</p>
            </div>
            <div className="rounded-xl border border-black/10 bg-white p-6">
              <h3 className="text-xl font-semibold text-black mb-2">Maintenance & Repairs</h3>
              <p className="text-sm text-black/70">Regular maintenance and prompt repair services to keep your system running efficiently.</p>
            </div>
            <div className="rounded-xl border border-black/10 bg-white p-6">
              <h3 className="text-xl font-semibold text-black mb-2">Energy Audit & Consultation</h3>
              <p className="text-sm text-black/70">Expert energy assessments and personalized consultation for optimal solar solutions.</p>
            </div>
            <div className="rounded-xl border border-black/10 bg-white p-6">
              <h3 className="text-xl font-semibold text-black mb-2">Smart Monitoring / Upgrades</h3>
              <p className="text-sm text-black/70">Advanced monitoring systems and upgrade services for enhanced performance.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="max-w-3xl mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold">Why Choose SolarWealthIndia</h2>
            <p className="mt-4 text-black/70">We&apos;ve built India&apos;s most trusted platform connecting customers with verified solar professionals. Every provider on our platform is certified, experienced, and committed to quality.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="rounded-xl border border-black/10 bg-white p-6">
              <h3 className="text-lg font-semibold text-black mb-2">Verified & Certified Providers</h3>
              <p className="text-sm text-black/70">All providers are verified with valid certifications and licenses.</p>
            </div>
            <div className="rounded-xl border border-black/10 bg-white p-6">
              <h3 className="text-lg font-semibold text-black mb-2">Transparent Pricing</h3>
              <p className="text-sm text-black/70">Clear, upfront pricing with no hidden costs or surprises.</p>
            </div>
            <div className="rounded-xl border border-black/10 bg-white p-6">
              <h3 className="text-lg font-semibold text-black mb-2">Consistent Quality Standards</h3>
              <p className="text-sm text-black/70">Rigorous quality checks ensure every installation meets our high standards.</p>
            </div>
            <div className="rounded-xl border border-black/10 bg-white p-6">
              <h3 className="text-lg font-semibold text-black mb-2">Pan-India Network</h3>
              <p className="text-sm text-black/70">Access to qualified providers across all major cities and regions.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="max-w-3xl mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold">How It Works</h2>
            <p className="mt-4 text-black/70">Finding the right solar provider is simple and straightforward.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 text-2xl font-bold mb-4">1</div>
              <h3 className="text-xl font-semibold text-black mb-2">Enter your solar requirements</h3>
              <p className="text-sm text-black/70">Tell us your location, system size, and specific needs.</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 text-2xl font-bold mb-4">2</div>
              <h3 className="text-xl font-semibold text-black mb-2">Get matched to verified providers</h3>
              <p className="text-sm text-black/70">We&apos;ll show you qualified providers in your area.</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 text-2xl font-bold mb-4">3</div>
              <h3 className="text-xl font-semibold text-black mb-2">Compare and book easily</h3>
              <p className="text-sm text-black/70">Review profiles, compare options, and book directly.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="max-w-3xl">
            <h2 className="text-3xl sm:text-4xl font-bold">Grow With Solar Wealth</h2>
            <p className="mt-4 text-black/70">Join India&apos;s leading solar service provider platform and connect with customers looking for your expertise. Build your reputation, grow your business, and be part of India&apos;s clean energy revolution.</p>
            <ul className="mt-6 space-y-3">
              <li className="flex items-start gap-3">
                <svg className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-black/80">Receive verified customer leads</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-black/80">Access business tools & dashboard</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-black/80">Build reputation through certifications</span>
              </li>
            </ul>
            <div className="mt-8">
              <Link
                href="/services/register"
                className="inline-flex items-center justify-center rounded-full bg-emerald-600 hover:bg-emerald-700 text-white h-12 px-8 font-semibold transition-colors"
              >
                Become a Provider
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      <section id="search-providers" className="bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="max-w-3xl mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold">Find Your Solar Provider</h2>
            <p className="mt-2 text-black/70">Search, filter, and compare verified installers by experience, rating, and services.</p>
          </div>
          <div className="mb-8">
            <SortBar value={filters} onChange={onFiltersChangeMemo} total={total} />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <aside className="lg:col-span-3 lg:sticky lg:top-24 h-max">
              <FiltersPanel value={filters} onChange={onFiltersChangeMemo} />
            </aside>
            <div className="lg:col-span-9">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
                {loading && (
                  <div className="col-span-full rounded-xl border border-black/10 bg-white p-8 text-center text-black/70">Loading providers…</div>
                )}
                {error && !loading && (
                  <div className="col-span-full rounded-xl border border-black/10 bg-white p-8 text-center text-red-700">{error}</div>
                )}
                {!loading && !error && providers.map((p) => (
                  <ProviderCard key={p.id} provider={p} />
                ))}
                {!loading && !error && providers.length === 0 && (
                  <div className="col-span-full rounded-xl border border-black/10 bg-white p-8 text-center text-black/70">
                    No providers match your filters. Try clearing some filters.
                  </div>
                )}
              </div>
              <div className="mt-8">
                <div className="flex items-center justify-between gap-4">
                  <div className="text-sm text-black/70">Page size
                    <select value={pageSize} onChange={(e) => setPageSize(Number(e.target.value))} className="ml-2 rounded-md border border-black/10 bg-white text-black px-2 py-1 focus:outline-none focus:ring-2 focus:ring-emerald-500">
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                      <option value={50}>50</option>
                    </select>
                  </div>
                  <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="max-w-3xl mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold">Success Stories</h2>
            <p className="mt-4 text-black/70">Hear from customers and providers who are part of the SolarWealthIndia community.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <figure className="rounded-xl border border-black/10 bg-white p-6">
              <blockquote className="text-black/80 mb-4">&quot;Found the perfect installer through the platform. Professional service and great support!&quot;</blockquote>
              <figcaption className="text-sm font-medium text-black">Rajesh Kumar, Bangalore</figcaption>
            </figure>
            <figure className="rounded-xl border border-black/10 bg-white p-6">
              <blockquote className="text-black/80 mb-4">&quot;The platform has helped me grow my business significantly. Quality leads and easy management.&quot;</blockquote>
              <figcaption className="text-sm font-medium text-black">Sunil Solar Solutions, Mumbai</figcaption>
            </figure>
            <figure className="rounded-xl border border-black/10 bg-white p-6">
              <blockquote className="text-black/80 mb-4">&quot;Transparent pricing and verified providers made my decision easy. Highly recommended!&quot;</blockquote>
              <figcaption className="text-sm font-medium text-black">Priya Sharma, Delhi</figcaption>
            </figure>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="max-w-3xl mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold">Frequently Asked Questions</h2>
          </div>
          <ServicesFAQ />
        </div>
      </section>

      <section id="become-providers" className="bg-slate-900 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold">Ready to Go Solar?</h2>
          <p className="mt-4 text-white/80">Join thousands of customers and providers building India&apos;s solar future.</p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={openLogin}
              className="inline-flex items-center justify-center rounded-full bg-emerald-500 hover:bg-emerald-600 text-white h-12 px-8 font-semibold transition-colors"
            >
              Login as Provider
            </button>
            <Link
              href="/services/register"
              className="inline-flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white h-12 px-8 font-semibold transition-colors"
            >
              Become a Provider
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

function ServicesFAQ() {
  const [open, setOpen] = useState<number | null>(0);
  
  const faqs = [
    {
      q: "How are providers verified?",
      a: "All providers on our platform undergo a thorough verification process including certification checks, license validation, and experience verification. We ensure every provider meets our quality standards before they can join the platform.",
    },
    {
      q: "Is the service free?",
      a: "Yes, searching and browsing providers is completely free for customers. You only pay for the services you book directly with providers. Provider registration and platform access may have associated fees.",
    },
    {
      q: "How long does installation take?",
      a: "Installation timelines vary based on system size and complexity, typically ranging from 2-7 days. Once you book a provider, they will provide you with a detailed timeline for your specific project.",
    },
    {
      q: "What areas are covered?",
      a: "Our platform has providers across all major cities and regions in India. Use the location filters to find providers in your specific area. We&apos;re continuously expanding our network.",
    },
    {
      q: "How can I register as a provider?",
      a: "Click on &apos;Become a Provider&apos; button and complete the registration form. You&apos;ll need to provide business details, certifications, and service information. Our team will review your application and get back to you within 2-3 business days.",
    },
  ];

  return (
    <div className="divide-y divide-black/10 rounded-xl border border-black/10 bg-white">
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
  );
}

export default function ServicesPage() {
  return (
    <Suspense fallback={
      <main className="pt-20 bg-white text-black min-h-screen">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <div className="animate-pulse">
            <div className="h-8 bg-black/10 rounded w-1/3 mb-4" />
            <div className="h-4 bg-black/10 rounded w-2/3" />
          </div>
        </div>
      </main>
    }>
      <ServicesPageContent />
    </Suspense>
  );
}


