"use client";

import Link from 'next/link';
import Image from 'next/image';
import { memo } from 'react';

export interface ProviderItem {
  id: number | string;
  name: string;
  city: string;
  state?: string;
  experience_years?: number;
  avg_rating?: number | null;
  certifications?: string[] | { id: number; name: string }[];
  services?: { id: number; title: string }[];
  image?: string;
  about?: string;
  address?: string;
  pincode?: string;
  latitude?: number | null;
  longitude?: number | null;
}

function ProviderCard({ provider }: { provider: ProviderItem }) {
  return (
    <div className="rounded-xl border border-black/10 bg-white overflow-hidden flex flex-col h-full transition-all hover:border-black/20 hover:shadow-sm">
      <div className="p-6 pb-5 flex items-start gap-5">
        <div className="h-16 w-16 rounded-lg bg-black/5 flex items-center justify-center overflow-hidden border border-black/10 shrink-0">
        {provider.image ? (
            <Image 
              src={provider.image} 
              alt={provider.name || 'Provider'} 
              width={64}
              height={64}
              className="h-full w-full object-contain p-2"
              unoptimized
              onError={(e) => {
                if (process.env.NODE_ENV === 'development') {
                }
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
        ) : (
            <span className="text-lg font-semibold text-black/40" aria-label={`Initials for ${provider.name || 'Provider'}`}>
              {provider.name?.slice(0, 2)?.toUpperCase()}
            </span>
          )}
        </div>
        <div className="flex-1 min-w-0 flex flex-col gap-2">
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-semibold text-black text-lg leading-snug flex-1 break-words">
              {provider.name || 'Unnamed Provider'}
            </h3>
            <div className="shrink-0 mt-0.5">
              {provider.avg_rating != null ? (
                <span className="inline-flex items-center gap-1 rounded-full border border-amber-300 bg-amber-50 text-amber-800 px-2.5 py-1 text-xs font-semibold">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5"><path d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l1.519 3.649a1.2 1.2 0 001.01.737l3.967.292c1.164.086 1.636 1.546.75 2.293l-3.02 2.52a1.2 1.2 0 00-.39 1.224l.944 3.84c.283 1.154-.96 2.06-1.96 1.45l-3.395-2.06a1.2 1.2 0 00-1.243 0l-3.395 2.06c-1 .61-2.243-.296-1.96-1.45l.944-3.84a1.2 1.2 0 00-.39-1.224l-3.02-2.52c-.886-.747-.414-2.207.75-2.293l3.967-.292a1.2 1.2 0 001.01-.737l1.519-3.649z"/></svg>
                  {Number(provider.avg_rating).toFixed(1)}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-full border border-black/10 bg-black/5 text-black/50 px-2.5 py-1 text-xs font-medium">
                  No rating
                </span>
              )}
            </div>
          </div>
          <div className="text-sm text-black/60">
            {provider.city || 'Location not specified'}{provider.state ? `, ${provider.state}` : ''}
          </div>
        </div>
      </div>

      <div className="px-6 pb-5 flex-1 flex flex-col gap-5">
        <div>
          {provider.about ? (
            <p className="text-sm text-black/70 line-clamp-3 leading-relaxed">
              {provider.about}
            </p>
          ) : (
            <p className="text-sm text-black/40 line-clamp-3 leading-relaxed">No description provided.</p>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {provider.services && provider.services.length > 0 ? (
            provider.services.slice(0, 4).map((s) => (
              <span key={s.id} className="text-xs rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 px-3 py-1.5 font-medium">
                {s.title}
              </span>
            ))
          ) : (
            <span className="text-sm text-black/30">No services listed</span>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 text-sm text-black/60 mt-auto pt-2 border-t border-black/5">
          <span className="inline-flex items-center gap-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-1.5-1.5v-9a1.5 1.5 0 011.5-1.5h10.5a1.5 1.5 0 011.5 1.5v9a1.5 1.5 0 01-1.5 1.5H8.25z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 7.5V6.75A2.25 2.25 0 0111.25 4.5h0A2.25 2.25 0 0113.5 6.75V7.5M9 12h9" />
            </svg>
            {provider.experience_years != null ? (
              <span>{provider.experience_years} {provider.experience_years === 1 ? 'year' : 'years'} experience</span>
            ) : (
              <span className="text-black/40">Experience not specified</span>
            )}
          </span>
          {provider.address && (
            <span className="inline-flex items-center gap-1.5 truncate">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 shrink-0">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 10.5-7.5 10.5S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
              </svg>
              <span className="truncate">{provider.address}</span>
            </span>
          )}
        </div>
      </div>

      <div className="px-6 pb-6 pt-0 flex items-center">
        <Link
          href={`/services/providers/${provider.id}`}
          className="inline-flex items-center justify-center w-full rounded-md bg-emerald-600 text-white py-3 text-base font-semibold hover:bg-emerald-700 transition-colors"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}

export default memo(ProviderCard);


