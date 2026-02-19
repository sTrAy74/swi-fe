'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { fetchProvider, ProviderDetailData } from '@/lib/api/providers';
import { createBooking, CreateBookingPayload } from '@/lib/api/bookings';
import { useAuth } from '@/components/providers/AuthProvider';
import { useToast } from '@/components/providers/ToastProvider';
import { getApiErrorMessage } from '@/lib/api/errors';
import Footer from '@/components/Footer';
import { absolutizeUrl } from '@/lib/utils/url';

export default function BookingPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { user } = useAuth();
  const toast = useToast();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [provider, setProvider] = useState<ProviderDetailData | null>(null);
  const [submitting, setSubmitting] = useState(false);
  
  const [selectedServices, setSelectedServices] = useState<number[]>([]);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [address, setAddress] = useState('');
  const [location, setLocation] = useState('');
  const [priceAtBooking, setPriceAtBooking] = useState('');
  const [notes, setNotes] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const isCustomer = user?.role === 'customer';

  useEffect(() => {
    if (user !== null && !isCustomer) {
      router.push('/services');
      return;
    }

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
  }, [id, user, isCustomer, router]);


  const handleServiceToggle = (serviceId: number) => {
    setSelectedServices((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (selectedServices.length === 0) {
      setFormError('Please select at least one service');
      return;
    }
    if (!date) {
      setFormError('Please select a date');
      return;
    }
    if (!time) {
      setFormError('Please select a time');
      return;
    }
    if (!address.trim()) {
      setFormError('Address is required');
      return;
    }
    if (!location.trim()) {
      setFormError('Location is required');
      return;
    }
    if (!priceAtBooking || parseFloat(priceAtBooking) <= 0) {
      setFormError('Please enter a valid price');
      return;
    }

    const dateTime = new Date(`${date}T${time}`);
    const isoDateTime = dateTime.toISOString();

    setSubmitting(true);
    try {
      const payload: CreateBookingPayload = {
        providerId: parseInt(id),
        services: selectedServices,
        date: isoDateTime,
        notes: notes.trim(),
        address: address.trim(),
        location: location.trim(),
        price_at_booking: parseFloat(priceAtBooking),
        payment_status: 'pending',
        current_status: 'requested',
      };

      await createBooking(payload);
      toast.show('Booking created successfully!', 'success');
      router.push('/dashboard/bookings');
    } catch (err: unknown) {
      const message = getApiErrorMessage(err, 'Failed to create booking');
      setFormError(message);
      toast.show(message, 'error');
    } finally {
      setSubmitting(false);
    }
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

  if (user === null) {
    return (
      <main className="pt-20 bg-white text-black min-h-screen">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-6 text-center">
            <p className="text-amber-800 font-medium mb-4">Please log in as a customer to book an appointment</p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => router.push(`/services/providers/${id}`)}
                className="px-4 py-2 text-emerald-600 hover:text-emerald-700 font-medium"
              >
                Back to Provider
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const coverPhotoUrl = absolutizeUrl(provider.cover_photo);
  const logoUrl = absolutizeUrl(provider.logo);

  const today = new Date().toISOString().split('T')[0];

  return (
    <main className="bg-white text-black min-h-screen">
      <div className="relative">
        {coverPhotoUrl ? (
          <Image
            src={coverPhotoUrl}
            alt={provider.business_name || provider.full_name}
            width={1200}
            height={256}
            className="w-full h-48 sm:h-64 object-cover"
            unoptimized
          />
        ) : (
          <div className="w-full h-48 sm:h-64 bg-gradient-to-br from-emerald-50 to-emerald-100 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 text-emerald-600/50">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m3-3h.75m-.75 3h.75m-9-3v12a2.25 2.25 0 002.25 2.25h9a2.25 2.25 0 002.25-2.25V9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 004.5 9v12z" />
            </svg>
          </div>
        )}

        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 via-black/40 to-transparent p-4 sm:p-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
              <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-xl bg-white border-4 border-white shadow-lg flex items-center justify-center overflow-hidden shrink-0">
                {logoUrl ? (
                  <Image 
                    src={logoUrl} 
                    alt={provider.business_name || provider.full_name} 
                    width={80}
                    height={80}
                    className="h-full w-full object-contain p-2"
                    unoptimized
                  />
                ) : (
                  <span className="text-xl font-semibold text-black/40">
                    {(provider.business_name || provider.full_name)?.slice(0, 2)?.toUpperCase()}
                  </span>
                )}
              </div>
              <div className="flex-1 text-white">
                <h1 className="text-xl sm:text-2xl font-bold mb-1">{provider.business_name || provider.full_name}</h1>
                <div className="flex flex-wrap items-center gap-3 text-sm">
                  <span className="flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 10.5-7.5 10.5S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                    </svg>
                    {provider.city}{provider.state ? `, ${provider.state}` : ''}
                  </span>
                  {provider.average_rating > 0 && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-white/20 backdrop-blur-sm px-2 py-1">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-amber-300">
                        <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                      </svg>
                      <span className="font-semibold">{provider.average_rating.toFixed(1)}</span>
                      <span className="text-white/80">({provider.total_reviews})</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">Book Appointment</h2>
          <p className="text-black/70">Fill in the details below to schedule your appointment</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {provider.services && provider.services.length > 0 && (
            <div>
              <label className="block text-sm font-medium mb-2 text-black">
                Select Services <span className="text-red-500">*</span>
              </label>
              <div className="space-y-3 rounded-xl border border-black/10 bg-white p-4">
                {provider.services.map((service) => (
                  <label
                    key={service.id}
                    className="flex items-start gap-3 p-3 rounded-lg border border-black/10 hover:border-emerald-500/50 hover:bg-emerald-50/50 cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={selectedServices.includes(service.id)}
                      onChange={() => handleServiceToggle(service.id)}
                      className="mt-1 h-4 w-4 rounded border-black/20 text-emerald-600 focus:ring-emerald-500 focus:ring-2"
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="font-medium text-black">{service.title}</div>
                          {service.price > 0 && (
                            <div className="text-sm text-emerald-600 font-semibold mt-1">
                              ₹{service.price.toLocaleString('en-IN')}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-black">
                Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={today}
                className="w-full rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-black"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-black">
                Time <span className="text-red-500">*</span>
              </label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-black"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-black">
              Address <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-black placeholder-slate-500"
              placeholder="123 Green Street, Bengaluru"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-black">
              Location <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-black placeholder-slate-500"
              placeholder="Bengaluru, Karnataka"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-black">
              Price at Booking <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={priceAtBooking}
              onChange={(e) => setPriceAtBooking(e.target.value)}
              min="0"
              step="0.01"
              className="w-full rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-black placeholder-slate-500"
              placeholder="12000"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-black">
              Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              className="w-full rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-black placeholder-slate-500"
              placeholder="Please come after 10 AM, parking available."
            />
          </div>

          {formError && (
            <div className="rounded-md border border-red-200 bg-red-50 p-4 text-red-800 text-sm">
              {formError}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link
              href={`/services/providers/${id}`}
              className="w-full sm:w-auto px-6 py-2.5 rounded-md border border-black/20 text-black font-medium hover:bg-black/5 text-center"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="w-full sm:w-auto rounded-md bg-emerald-600 text-white px-6 py-2.5 font-medium hover:bg-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? 'Creating Booking...' : 'Create Booking'}
            </button>
          </div>
        </form>
      </div>

      <Footer />
    </main>
  );
}

