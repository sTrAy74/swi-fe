"use client";

export default function Pagination({ page, totalPages, onPageChange }: { page: number; totalPages: number; onPageChange: (p: number) => void; }) {
  function go(p: number) {
    if (p < 1 || p > totalPages) return;
    onPageChange(p);
  }
  const pages = getWindowedPages(page, totalPages);
  return (
    <div className="flex items-center justify-center gap-1">
      <button className="px-3 py-2 rounded-md border border-black/10 text-sm hover:bg-black/5 disabled:opacity-50 text-black" onClick={() => go(page - 1)} disabled={page === 1}>Prev</button>
      {pages.map((p, idx) => p === '...' ? (
        <span key={`e${idx}`} className="px-2 text-black/40">…</span>
      ) : (
        <button key={p} onClick={() => go(p as number)} className={`px-3 py-2 rounded-md border text-sm hover:bg-black/5 text-black ${p === page ? 'bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-600' : 'border-black/10'}`}>{p}</button>
      ))}
      <button className="px-3 py-2 rounded-md border border-black/10 text-sm hover:bg-black/5 disabled:opacity-50 text-black" onClick={() => go(page + 1)} disabled={page === totalPages}>Next</button>
    </div>
  );
}

function getWindowedPages(current: number, total: number): (number | '...')[] {
  const pages: number[] = [];
  const delta = 1;
  const left = Math.max(2, current - delta);
  const right = Math.min(total - 1, current + delta);
  pages.push(1);
  for (let i = left; i <= right; i++) pages.push(i);
  if (total > 1) pages.push(total);
  const unique = Array.from(new Set(pages.filter((p) => p >= 1 && p <= total))).sort((a, b) => a - b);
  const result: (number | '...')[] = [];
  for (let i = 0; i < unique.length; i++) {
    if (i > 0 && unique[i] - unique[i - 1] > 1) result.push('...');
    result.push(unique[i]);
  }
  return result;
}


