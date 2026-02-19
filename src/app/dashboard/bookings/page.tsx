'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { fetchMyBookings, BookingItem } from '@/lib/api/bookings';
import { useAuth } from '@/components/providers/AuthProvider';
import { useToast } from '@/components/providers/ToastProvider';
import { getApiErrorMessage } from '@/lib/api/errors';
import ReviewModal from '@/components/dashboard/ReviewModal';

export default function DashboardBookingsPage() {
  const { user } = useAuth();
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [selectedBookingForReview, setSelectedBookingForReview] = useState<BookingItem | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);

    fetchMyBookings(controller.signal)
      .then((res) => {
        setBookings(res.bookings || []);
      })
      .catch((e: unknown) => {
        if (e && typeof e === 'object' && 'name' in e && e.name === 'AbortError') return;
        const message = getApiErrorMessage(e, 'Failed to load bookings');
        setError(message);
        toast.show(message, 'error');
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [toast]);

  const loadBookings = () => {
    const controller = new AbortController();
    setLoading(true);

    fetchMyBookings(controller.signal)
      .then((res) => {
        setBookings(res.bookings || []);
      })
      .catch((e: unknown) => {
        if (e && typeof e === 'object' && 'name' in e && e.name === 'AbortError') return;
        const message = getApiErrorMessage(e, 'Failed to load bookings');
        setError(message);
        toast.show(message, 'error');
      })
      .finally(() => setLoading(false));
  };

  const handleReviewSuccess = () => {
    loadBookings();
  };

  const isCustomer = user?.role === 'customer';

  const getStatusBadge = (status: BookingItem['current_status']) => {
    const isCompleted = status === 'completed';
    return (
      <span
        className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${
          isCompleted
            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
            : 'bg-amber-100 text-amber-800 border border-amber-200'
        }`}
      >
        {isCompleted ? (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
              <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
            </svg>
            Completed
          </>
        ) : (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Ongoing
          </>
        )}
      </span>
    );
  };

  const getPaymentStatusBadge = (status: string) => {
    const isPaid = status === 'paid' || status === 'completed';
    return (
      <span
        className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${
          isPaid
            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
            : 'bg-slate-100 text-slate-800 border border-slate-200'
        }`}
      >
        {status === 'paid' ? 'Paid' : 'Pending'}
      </span>
    );
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-6">Bookings</h1>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse rounded-xl border border-black/10 bg-white p-6">
                <div className="h-6 bg-black/10 rounded w-1/4 mb-4" />
                <div className="h-4 bg-black/10 rounded w-1/2 mb-2" />
                <div className="h-4 bg-black/10 rounded w-1/3" />
              </div>
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-6">Bookings</h1>
          <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
            <p className="text-red-800 font-medium">{error}</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold mb-6">Bookings</h1>

        {bookings.length === 0 ? (
          <div className="rounded-xl border border-black/10 bg-white p-8 text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-12 h-12 text-black/30 mx-auto mb-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z"
              />
            </svg>
            <p className="text-black/70">No bookings found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => {
              const otherParty = isCustomer ? booking.provider : booking.customer;
              const bookingDate = new Date(booking.date);
              const isCompleted = booking.current_status === 'completed';

              return (
                <div
                  key={booking.id}
                  className="rounded-xl border border-black/10 bg-white p-6 hover:border-black/20 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div>
                          <h3 className="text-lg font-semibold text-black mb-1">
                            Booking #{booking.id}
                          </h3>
                          <p className="text-sm text-black/60">
                            Scheduled: {bookingDate.toLocaleDateString('en-IN', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}{' '}
                            at {bookingDate.toLocaleTimeString('en-IN', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2 shrink-0">
                          {getStatusBadge(booking.current_status)}
                          {getPaymentStatusBadge(booking.payment_status)}
                        </div>
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <span className="text-black/60 font-medium">
                            {isCustomer ? 'Provider:' : 'Customer:'}
                          </span>
                          <span className="text-black">
                            {otherParty.business_name || otherParty.full_name}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-black/60 font-medium">Location:</span>
                          <span className="text-black">{booking.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-black/60 font-medium">Address:</span>
                          <span className="text-black">{booking.address}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-black/60 font-medium">Price:</span>
                          <span className="text-black font-semibold">
                            ₹{Number(booking.price_at_booking).toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {booking.services && booking.services.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm font-medium text-black/60 mb-2">Services:</p>
                      <div className="flex flex-wrap gap-2">
                        {booking.services.map((service) => (
                          <span
                            key={service.id}
                            className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 px-3 py-1 text-xs font-medium"
                          >
                            {service.title}
                            {service.price > 0 && (
                              <span className="text-emerald-600">
                                (₹{service.price.toLocaleString('en-IN')})
                              </span>
                            )}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {booking.notes && (
                    <div className="mb-4">
                      <p className="text-sm font-medium text-black/60 mb-1">Notes:</p>
                      <p className="text-sm text-black/70 bg-black/5 rounded-md p-3">
                        {booking.notes}
                      </p>
                    </div>
                  )}

                  {isCompleted && isCustomer && (
                    <div className="pt-4 border-t border-black/10">
                      <button
                        onClick={() => setSelectedBookingForReview(booking)}
                        className="inline-flex items-center gap-2 rounded-md bg-emerald-600 text-white px-4 py-2 text-sm font-medium hover:bg-emerald-700 transition-colors"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="w-4 h-4"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Leave Review
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {selectedBookingForReview && (
        <ReviewModal
          open={!!selectedBookingForReview}
          onClose={() => setSelectedBookingForReview(null)}
          providerName={selectedBookingForReview.provider.business_name || selectedBookingForReview.provider.full_name}
          bookingId={selectedBookingForReview.id}
          onSuccess={handleReviewSuccess}
        />
      )}
    </DashboardLayout>
  );
}
