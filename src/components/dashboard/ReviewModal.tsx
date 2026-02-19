'use client';

import { useState } from 'react';
import Modal from '@/components/Modal';
import { useToast } from '@/components/providers/ToastProvider';
import { createReview, CreateReviewPayload } from '@/lib/api/bookings';
import { getApiErrorMessage } from '@/lib/api/errors';

interface ReviewModalProps {
  open: boolean;
  onClose: () => void;
  providerName: string;
  bookingId: number;
  onSuccess?: () => void;
}

export default function ReviewModal({ open, onClose, providerName, bookingId, onSuccess }: ReviewModalProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (rating === 0) {
      setError('Please select a rating');
      toast.show('Please select a rating', 'error');
      return;
    }
    
    if (!comment.trim()) {
      setError('Please write a comment');
      toast.show('Please write a comment', 'error');
      return;
    }

    setSubmitting(true);
    
    try {
      const payload: CreateReviewPayload = {
        booking: bookingId,
        rating,
        comment: comment.trim(),
      };

      await createReview(payload);
      toast.show('Review submitted successfully!', 'success');
      setRating(0);
      setComment('');
      setError(null);
      onSuccess?.();
      onClose();
    } catch (err: unknown) {
      const message = getApiErrorMessage(err, 'Failed to submit review');
      setError(message);
      toast.show(message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!submitting) {
      setRating(0);
      setComment('');
      onClose();
    }
  };

  return (
    <Modal open={open} onClose={handleClose} title="Leave a Review">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2 text-black">
            Rating <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                className="focus:outline-none"
                disabled={submitting}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill={star <= (hoveredRating || rating) ? 'currentColor' : 'none'}
                  stroke="currentColor"
                  className={`w-8 h-8 ${
                    star <= (hoveredRating || rating)
                      ? 'text-amber-400'
                      : 'text-black/20'
                  } transition-colors`}
                >
                  <path
                    fillRule="evenodd"
                    d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            ))}
          </div>
          {rating > 0 && (
            <p className="text-sm text-black/60 mt-2">
              {rating === 1 && 'Poor'}
              {rating === 2 && 'Fair'}
              {rating === 3 && 'Good'}
              {rating === 4 && 'Very Good'}
              {rating === 5 && 'Excellent'}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-black">
            Comment <span className="text-red-500">*</span>
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            className="w-full rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-black placeholder-slate-500"
            placeholder={`Share your experience with ${providerName}...`}
            required
            disabled={submitting}
          />
        </div>

        {error && (
          <div className="rounded-md border border-red-200 bg-red-50 p-3 text-red-800 text-sm">
            {error}
          </div>
        )}

        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={handleClose}
            disabled={submitting}
            className="flex-1 rounded-md border border-black/20 text-black px-4 py-2 font-medium hover:bg-black/5 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="flex-1 rounded-md bg-emerald-600 text-white px-4 py-2 font-medium hover:bg-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

