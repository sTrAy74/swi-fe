'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { fetchProvider, ProviderDetailData } from '@/lib/api/providers';
import { useAuth } from '@/components/providers/AuthProvider';
import Footer from '@/components/Footer';
import { absolutizeUrl } from '@/lib/utils/url';

export default function ProviderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [provider, setProvider] = useState<ProviderDetailData | null>(null);
  const { user } = useAuth();
  const isCustomer = user?.role === 'customer';
  const [showAllPortfolio, setShowAllPortfolio] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    if (!id) return;
    const controller = new AbortController();

    fetchProvider(id, controller.signal)
      .then((res) => setProvider(res.data))
      .catch((e: unknown) => {
        if (e && typeof e === 'object' && 'name' in e && e.name === 'AbortError') return;
        const message = e && typeof e === 'object' && 'message' in e && typeof e.message === 'string' 
          ? e.message 
          : 'Failed to load provider details';
        setError(message);
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [id]);

  const extractText = (desc: unknown[]): string => {
    if (!Array.isArray(desc)) return '';
    return desc
      .map((item: unknown) => {
        if (item && typeof item === 'object' && 'type' in item && item.type === 'paragraph' && 'children' in item && Array.isArray(item.children)) {
          return item.children.map((child: unknown) => {
            if (child && typeof child === 'object' && 'text' in child && typeof child.text === 'string') {
              return child.text;
            }
            return '';
          }).join('');
        }
        return '';
      })
      .filter(Boolean)
      .join(' ');
  };

  if (loading) {
    return (
      <main className="pt-20 bg-white text-black min-h-screen">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <div className="animate-pulse">
            <div className="h-64 bg-black/10 rounded-xl mb-6" />
            <div className="h-8 bg-black/10 rounded w-1/3 mb-4" />
            <div className="h-4 bg-black/10 rounded w-2/3" />
          </div>
        </div>
      </main>
    );
  }

  if (error || !provider) {
    return (
      <main className="pt-20 bg-white text-black min-h-screen">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
            <p className="text-red-800 font-medium">{error || 'Provider not found'}</p>
            <button
              onClick={() => router.push('/services')}
              className="mt-4 text-emerald-600 hover:text-emerald-700 font-medium"
            >
              Back to Services
            </button>
          </div>
        </div>
      </main>
    );
  }

  const coverPhotoUrl = absolutizeUrl(provider.cover_photo);
  const logoUrl = absolutizeUrl(provider.logo);
  const email = provider.user?.username || '';

  return (
    <main className="bg-white text-black min-h-screen">
      <div className="relative">
        {coverPhotoUrl ? (
          <Image
            src={coverPhotoUrl}
            alt={provider.business_name || provider.full_name}
            width={1200}
            height={320}
            className="w-full h-64 sm:h-80 object-cover"
            unoptimized
          />
        ) : (
          <div className="w-full h-64 sm:h-80 bg-gradient-to-br from-emerald-50 to-emerald-100 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 text-emerald-600/50">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m3-3h.75m-.75 3h.75m-9-3v12a2.25 2.25 0 002.25 2.25h9a2.25 2.25 0 002.25-2.25V9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 004.5 9v12z" />
            </svg>
          </div>
        )}

        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 via-black/40 to-transparent p-3 sm:px-6">
          <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-3 sm:gap-4">
              <div className="h-14 w-14 sm:h-24 sm:w-24 rounded-lg sm:rounded-xl bg-white border-2 sm:border-4 border-white shadow-lg flex items-center justify-center overflow-hidden shrink-0">
                {logoUrl ? (
                  <Image 
                    src={logoUrl} 
                    alt={provider.business_name || provider.full_name} 
                    width={96}
                    height={96}
                    className="h-full w-full object-contain p-1 sm:p-2"
                    unoptimized
                  />
                ) : (
                  <span className="text-lg sm:text-2xl font-semibold text-black/40">
                    {(provider.business_name || provider.full_name)?.slice(0, 2)?.toUpperCase()}
                  </span>
                )}
              </div>
              <div className="flex-1 text-white min-w-0">
                <h1 className="text-xl sm:text-3xl font-bold mb-1 leading-tight">{provider.business_name || provider.full_name}</h1>
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-base">
                  <span className="flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3 sm:w-4 sm:h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 10.5-7.5 10.5S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                    </svg>
                    {provider.city}{provider.state ? `, ${provider.state}` : ''}
                  </span>
                  {provider.average_rating > 0 && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-white/20 backdrop-blur-sm px-1.5 sm:px-2 py-0.5 sm:py-1">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 sm:w-4 sm:h-4 text-amber-300">
                        <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                      </svg>
                      <span className="font-semibold text-xs sm:text-sm">{provider.average_rating.toFixed(1)}</span>
                      <span className="text-white/80 text-xs sm:text-sm">({provider.total_reviews})</span>
                    </span>
                  )}
                  {provider.experience_years > 0 && (
                    <span className="flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3 sm:w-4 sm:h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-1.5-1.5v-9a1.5 1.5 0 011.5-1.5h10.5a1.5 1.5 0 011.5 1.5v9a1.5 1.5 0 01-1.5 1.5H8.25z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 7.5V6.75A2.25 2.25 0 0111.25 4.5h0A2.25 2.25 0 0113.5 6.75V7.5M9 12h9" />
                      </svg>
                      <span className="text-xs sm:text-base">{provider.experience_years} {provider.experience_years === 1 ? 'year' : 'years'} experience</span>
                    </span>
                  )}
                </div>
              </div>
              {isCustomer ? (
                <Link
                  href={`/services/providers/${id}/book`}
                  className="rounded-md bg-emerald-600 text-white px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base font-semibold hover:bg-emerald-700 transition-colors shrink-0 w-full sm:w-auto text-center"
                >
                  Book Now
                </Link>
              ) : (
                <button
                  type="button"
                  disabled
                  title="Available for customers only"
                  className="rounded-md bg-black/10 text-black/50 px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base font-semibold cursor-not-allowed shrink-0 w-full sm:w-auto text-center"
                >
                  Book Now
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {provider.about && (
              <section>
                <h2 className="text-xl font-bold mb-4">About</h2>
                <p className="text-black/70 leading-relaxed whitespace-pre-line">{provider.about}</p>
              </section>
            )}

            {provider.services && provider.services.length > 0 && (
              <section>
                <h2 className="text-xl font-bold mb-4">Services</h2>
                <div className="space-y-4">
                  {provider.services.map((service) => (
                    <div key={service.id} className="rounded-xl border border-black/10 bg-white p-5">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <h3 className="font-semibold text-lg text-black">{service.title}</h3>
                        {service.price > 0 && (
                          <span className="text-emerald-600 font-bold text-lg shrink-0">₹{service.price.toLocaleString('en-IN')}</span>
                        )}
                      </div>
                      {service.description && (
                        <p className="text-black/70 text-sm leading-relaxed">{extractText(service.description)}</p>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            <section>
              <h2 className="text-xl font-bold mb-4">Portfolio</h2>
              {provider.portfolio_images && provider.portfolio_images.length > 0 ? (
                <>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {(showAllPortfolio ? provider.portfolio_images : provider.portfolio_images.slice(0, 7)).map((item: unknown, idx: number) => {
                      const imageUrl = absolutizeUrl(item);
                      
                      if (!imageUrl) return null;
                      
                      const actualIndex = idx;
                      
                      const itemId = item && typeof item === 'object' && 'id' in item && typeof item.id === 'number' 
                        ? item.id 
                        : idx;
                      
                      return (
                        <div 
                          key={itemId} 
                          className="relative group cursor-pointer"
                          onClick={() => {
                            setSelectedImageIndex(actualIndex);
                            setGalleryOpen(true);
                          }}
                        >
                          <Image
                            src={imageUrl}
                            alt={`Portfolio ${idx + 1}`}
                            width={300}
                            height={300}
                            className="w-full aspect-square object-cover rounded-lg border border-black/10 hover:border-black/20 transition-colors"
                            unoptimized
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-white">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6" />
                            </svg>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  {!showAllPortfolio && provider.portfolio_images.length > 7 && (
                    <div className="mt-6 text-center">
                      <button
                        onClick={() => setShowAllPortfolio(true)}
                        className="inline-flex items-center gap-2 rounded-md bg-emerald-600 text-white px-6 py-2.5 text-sm font-semibold hover:bg-emerald-700 transition-colors"
                      >
                        View More ({provider.portfolio_images.length - 7} more)
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="rounded-xl border border-black/10 bg-white p-12 text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-black/20 mx-auto mb-3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6.75a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6.75v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                  </svg>
                  <p className="text-black/50">No portfolio images available</p>
                </div>
              )}
            </section>

            <section>
              <h2 className="text-xl font-bold mb-4">
                Reviews ({provider.total_reviews})
              </h2>
              {provider.reviews && provider.reviews.length > 0 ? (
                <div className="space-y-4">
                  {provider.reviews.map((review, idx) => (
                    <div key={review.id || idx} className="rounded-xl border border-black/10 bg-white p-5">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-medium text-black">
                            {review.user?.username || 'Anonymous'}
                          </p>
                          {review.createdAt && (
                            <p className="text-xs text-black/50 mt-0.5">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                        {review.rating != null && (
                          <div className="inline-flex items-center gap-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <svg
                                key={i}
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill={i < review.rating! ? 'currentColor' : 'none'}
                                className={`w-4 h-4 ${i < review.rating! ? 'text-amber-500' : 'text-black/20'}`}
                              >
                                <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                              </svg>
                            ))}
                          </div>
                        )}
                      </div>
                      {review.comment && <p className="text-black/70 text-sm mt-2">{review.comment}</p>}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border border-black/10 bg-white p-8 text-center">
                  <p className="text-black/50">No reviews yet. Be the first to review!</p>
                </div>
              )}
            </section>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <div className="rounded-xl border border-black/10 bg-white p-5">
                <h3 className="font-semibold text-lg mb-4">Contact Information</h3>
                <div className="space-y-4">
                  {provider.phone_number && (
                    <div>
                      <p className="text-xs text-black/50 mb-1">Phone</p>
                      <a
                        href={`tel:${provider.phone_number}`}
                        className="text-black font-medium hover:text-emerald-600 transition-colors flex items-center gap-2"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                        </svg>
                        {provider.phone_number}
                      </a>
                    </div>
                  )}
                  {email && (
                    <div>
                      <p className="text-xs text-black/50 mb-1">Email</p>
                      <a
                        href={`mailto:${email}`}
                        className="text-black font-medium hover:text-emerald-600 transition-colors flex items-center gap-2 break-all"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 shrink-0">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                        </svg>
                        {email}
                      </a>
                    </div>
                  )}
                  <div>
                    <p className="text-xs text-black/50 mb-1">Address</p>
                    <p className="text-black/70 text-sm leading-relaxed">
                      {provider.address || `${provider.city}${provider.state ? `, ${provider.state}` : ''}`}
                      {provider.pincode && ` - ${provider.pincode}`}
                    </p>
                  </div>
                </div>
              </div>

              {provider.certifications && provider.certifications.length > 0 && (
                <div className="rounded-xl border border-black/10 bg-white p-5">
                  <h3 className="font-semibold text-lg mb-4">Certifications</h3>
                  <div className="space-y-3">
                    {provider.certifications.map((cert) => {
                      const certUrl = absolutizeUrl(cert);
                      return (
                        <a
                          key={cert.id}
                          href={certUrl || '#'}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-sm text-black/70 hover:text-emerald-600 transition-colors group"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 group-hover:text-emerald-600">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                          </svg>
                          <span className="truncate">{cert.name}</span>
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {galleryOpen && provider.portfolio_images && provider.portfolio_images.length > 0 && (
        <PortfolioGallery
          images={provider.portfolio_images}
          currentIndex={selectedImageIndex}
          onClose={() => setGalleryOpen(false)}
          onNavigate={(index) => setSelectedImageIndex(index)}
        />
      )}

      <Footer />
    </main>
  );
}

function PortfolioGallery({ 
  images, 
  currentIndex, 
  onClose, 
  onNavigate 
}: { 
  images: unknown[]; 
  currentIndex: number; 
  onClose: () => void; 
  onNavigate: (index: number) => void;
}) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && currentIndex > 0) onNavigate(currentIndex - 1);
      if (e.key === 'ArrowRight' && currentIndex < images.length - 1) onNavigate(currentIndex + 1);
    }
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [currentIndex, images.length, onClose, onNavigate]);

  const currentImageUrl = absolutizeUrl(images[currentIndex]);
  const hasPrevious = currentIndex > 0;
  const hasNext = currentIndex < images.length - 1;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 rounded-full bg-white/10 hover:bg-white/20 text-white p-2 transition-colors"
        aria-label="Close gallery"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>

      {hasPrevious && (
        <button
          onClick={() => onNavigate(currentIndex - 1)}
          className="absolute left-4 z-10 rounded-full bg-white/10 hover:bg-white/20 text-white p-3 transition-colors"
          aria-label="Previous image"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
      )}

      {hasNext && (
        <button
          onClick={() => onNavigate(currentIndex + 1)}
          className="absolute right-4 z-10 rounded-full bg-white/10 hover:bg-white/20 text-white p-3 transition-colors"
          aria-label="Next image"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      )}

      <div className="relative w-full h-full flex items-center justify-center p-4 sm:p-8">
        {currentImageUrl ? (
          <div className="relative w-full h-full max-w-7xl max-h-[90vh] flex items-center justify-center">
            <Image
              src={currentImageUrl}
              alt={`Portfolio image ${currentIndex + 1}`}
              width={1200}
              height={1200}
              className="max-w-full max-h-full object-contain rounded-lg"
              unoptimized
              priority
            />
          </div>
        ) : null}
      </div>

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 rounded-full bg-white/10 backdrop-blur-sm text-white px-4 py-2 text-sm font-medium">
        {currentIndex + 1} / {images.length}
      </div>

      {images.length > 1 && (
        <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 z-10 flex gap-2 max-w-[90vw] overflow-x-auto px-4 py-2 bg-black/50 rounded-lg backdrop-blur-sm">
          {images.map((item: unknown, idx: number) => {
            const thumbUrl = absolutizeUrl(item);
            if (!thumbUrl) return null;
            return (
              <button
                key={idx}
                onClick={() => onNavigate(idx)}
                className={`relative w-16 h-16 rounded overflow-hidden border-2 transition-all shrink-0 ${
                  idx === currentIndex ? 'border-emerald-500' : 'border-white/30 hover:border-white/50'
                }`}
              >
                <Image
                  src={thumbUrl}
                  alt={`Thumbnail ${idx + 1}`}
                  width={64}
                  height={64}
                  className="w-full h-full object-cover"
                  unoptimized
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

