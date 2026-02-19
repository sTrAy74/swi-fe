"use client";

import { FiltersState } from './FiltersPanel';

export default function SortBar({ value, onChange, total }: { value: FiltersState; onChange: (next: Partial<FiltersState>) => void; total: number; }) {
  function setSortBy(s: string) { onChange({ sortBy: s }); }
  function toggleOrder() { onChange({ order: value.order === 'asc' ? 'desc' : 'asc' }); }
  return (
    <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
      <div className="flex-1">
        <div className="relative">
          <span className="pointer-events-none absolute inset-y-0 left-3 inline-flex items-center text-black/40">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5"><path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 100 13.5 6.75 6.75 0 000-13.5zM2.25 10.5a8.25 8.25 0 1114.59 5.28l4.69 4.69a.75.75 0 11-1.06 1.06l-4.69-4.69A8.25 8.25 0 012.25 10.5z" clipRule="evenodd" /></svg>
          </span>
          <input
            value={value.query}
            onChange={(e) => onChange({ query: e.target.value })}
            placeholder="Search providers, city, tags"
            className="w-full rounded-md border border-black/10 bg-white text-black placeholder-black/40 px-10 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>
      <div className="flex items-center gap-2 text-sm">
        <span className="text-black/60 hidden sm:inline">{total} results</span>
        <select value={value.sortBy ?? ''} onChange={(e) => setSortBy(e.target.value)} className="rounded-md border border-black/10 bg-white text-black px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500">
          <option value="">Relevance</option>
          <option value="createdAt">Recently added</option>
          <option value="rating">Rating</option>
          <option value="reviews">Reviews</option>
        </select>
        <button onClick={toggleOrder} className="inline-flex items-center gap-1 rounded-md border border-black/10 bg-white text-black px-3 py-2 hover:bg-black/5">
          <span className="hidden sm:inline">{value.order === 'asc' ? 'Asc' : 'Desc'}</span>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4"><path d="M3 7h14a1 1 0 100-2H3a1 1 0 100 2zm0 6h10a1 1 0 100-2H3a1 1 0 100 2zm0 6h6a1 1 0 100-2H3a1 1 0 100 2z" /></svg>
        </button>
      </div>
    </div>
  );
}


