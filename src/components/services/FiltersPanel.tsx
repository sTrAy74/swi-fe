"use client";

import { useState } from "react";

export interface FiltersState {
  query: string;
  city: string;
  state: string;
  min_experience?: number;
  max_experience?: number;
  min_rating?: number;
  max_rating?: number;
  services?: 'Installation' | 'Consultation' | 'Maintenance' | '';
  sortBy?: string;
  order?: 'asc' | 'desc';
}

export default function FiltersPanel({ value, onChange }: { value: FiltersState; onChange: (next: Partial<FiltersState>) => void; }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-xl border border-black/10 bg-white">
      <div className="p-4 flex items-center justify-between lg:hidden">
        <h3 className="font-semibold text-black">Filters</h3>
        <button className="text-sm text-emerald-600 font-medium" onClick={() => setOpen((v) => !v)}>{open ? 'Hide' : 'Show'}</button>
      </div>
      <div className={`p-4 pt-0 lg:pt-4 ${open ? 'block' : 'hidden'} lg:block`}>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-1 text-black">City</label>
            <input value={value.city} onChange={(e) => onChange({ city: e.target.value })} placeholder="Bangalore" className="w-full rounded-md border border-black/10 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-black placeholder-black/40" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-black">State</label>
            <input value={value.state} onChange={(e) => onChange({ state: e.target.value })} placeholder="Karnataka" className="w-full rounded-md border border-black/10 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-black placeholder-black/40" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-black">Experience (years)</label>
            <div className="grid grid-cols-2 gap-2">
              <input type="number" min={0} value={value.min_experience ?? ''} onChange={(e) => onChange({ min_experience: e.target.value === '' ? undefined : Number(e.target.value) })} placeholder="Min" className="w-full rounded-md border border-black/10 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-black" />
              <input type="number" min={0} value={value.max_experience ?? ''} onChange={(e) => onChange({ max_experience: e.target.value === '' ? undefined : Number(e.target.value) })} placeholder="Max" className="w-full rounded-md border border-black/10 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-black" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-black">Rating</label>
            <div className="grid grid-cols-2 gap-2">
              <select value={value.min_rating ?? ''} onChange={(e) => onChange({ min_rating: e.target.value === '' ? undefined : Number(e.target.value) })} className="w-full rounded-md border border-black/10 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-black">
                <option value="">Min</option>
                {[3, 3.5, 4, 4.5].map((r) => (<option key={r} value={r}>{r}+</option>))}
              </select>
              <select value={value.max_rating ?? ''} onChange={(e) => onChange({ max_rating: e.target.value === '' ? undefined : Number(e.target.value) })} className="w-full rounded-md border border-black/10 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-black">
                <option value="">Max</option>
                {[3, 3.5, 4, 4.5, 5].map((r) => (<option key={r} value={r}>{r}</option>))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-black">Services</label>
            <select value={value.services ?? ''} onChange={(e) => onChange({ services: e.target.value as 'Installation' | 'Consultation' | 'Maintenance' | '' })} className="w-full rounded-md border border-black/10 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-black">
              <option value="">Any</option>
              <option value="Installation">Installation</option>
              <option value="Consultation">Consultation</option>
              <option value="Maintenance">Maintenance</option>
            </select>
          </div>
          <button className="w-full rounded-md border border-black/10 py-2 text-black hover:bg-black/5" onClick={() => onChange({ city: '', state: '', min_experience: undefined, max_experience: undefined, min_rating: undefined, max_rating: undefined, services: '' })}>Clear filters</button>
        </div>
      </div>
    </div>
  );
}


