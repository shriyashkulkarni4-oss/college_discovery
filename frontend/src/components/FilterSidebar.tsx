import { useState } from 'react';
import { Search, X, SlidersHorizontal, ChevronDown } from 'lucide-react';
import type { CollegeFilters, OwnershipType, NaacGrade } from '../types';
import { useDebounce } from '../hooks/useDebounce';

interface Props {
  filters: CollegeFilters;
  onFilterChange: (filters: CollegeFilters) => void;
  states: string[];
  isOpen: boolean;
  onToggle: () => void;
}

const NAAC_OPTIONS: { label: string; value: NaacGrade }[] = [
  { label: 'A++', value: 'A_PLUS_PLUS' },
  { label: 'A+', value: 'A_PLUS' },
  { label: 'A', value: 'A' },
  { label: 'B++', value: 'B_PLUS_PLUS' },
];

const RATING_OPTIONS = [
  { label: '4+ Stars', value: 4 },
  { label: '3+ Stars', value: 3 },
  { label: '2+ Stars', value: 2 },
  { label: '1+ Stars', value: 1 },
];

const SORT_OPTIONS = [
  { label: 'Highest Rated', value: 'rating', order: 'desc' },
  { label: 'Lowest Fees', value: 'fees', order: 'asc' },
  { label: 'Highest Placement', value: 'placement', order: 'desc' },
  { label: 'Newest', value: 'newest', order: 'desc' },
  { label: 'A-Z', value: 'name', order: 'asc' },
] as const;

export default function FilterSidebar({ filters, onFilterChange, states, isOpen, onToggle }: Props) {
  const update = (partial: Partial<CollegeFilters>) => {
    onFilterChange({ ...filters, ...partial });
  };

  const clearAll = () => {
    onFilterChange({ sortBy: 'rating', sortOrder: 'desc' });
  };

  const hasActiveFilters = Object.entries(filters).some(
    ([k, v]) => !['sortBy', 'sortOrder'].includes(k) && v !== undefined && v !== ''
  );

  return (
    <>
      {/* Mobile toggle button */}
      <button
        onClick={onToggle}
        className="lg:hidden flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition-colors hover:border-primary-500"
        style={{
          background: 'var(--bg-card)',
          borderColor: 'var(--border-color)',
          color: 'var(--text-primary)',
        }}
      >
        <SlidersHorizontal className="w-4 h-4" />
        Filters
        {hasActiveFilters && (
          <span className="w-2 h-2 bg-primary-600 rounded-full" />
        )}
      </button>

      {/* Sidebar */}
      <aside
        className={`${
          isOpen ? 'block' : 'hidden'
        } lg:block w-full lg:w-72 flex-shrink-0 space-y-4`}
      >
        <div
          className="rounded-2xl p-5 border space-y-5 sticky top-20"
          style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
              Filters
            </h3>
            {hasActiveFilters && (
              <button
                onClick={clearAll}
                className="text-xs text-primary-600 hover:underline"
              >
                Clear all
              </button>
            )}
          </div>

          {/* Sort */}
          <FilterSection title="Sort By">
            <div className="space-y-1.5">
              {SORT_OPTIONS.map((opt) => (
                <label key={opt.value} className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="radio"
                    name="sort"
                    className="accent-primary-600"
                    checked={filters.sortBy === opt.value && filters.sortOrder === opt.order}
                    onChange={() => update({ sortBy: opt.value, sortOrder: opt.order })}
                  />
                  <span className="text-sm group-hover:text-primary-600 transition-colors" style={{ color: 'var(--text-secondary)' }}>
                    {opt.label}
                  </span>
                </label>
              ))}
            </div>
          </FilterSection>

          {/* State */}
          <FilterSection title="State">
            <select
              value={filters.state ?? ''}
              onChange={(e) => update({ state: e.target.value || undefined, city: undefined })}
              className="w-full text-sm rounded-lg px-3 py-2 border focus:outline-none focus:ring-2 focus:ring-primary-500"
              style={{
                background: 'var(--bg-primary)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-primary)',
              }}
            >
              <option value="">All States</option>
              {states.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </FilterSection>

          {/* Rating */}
          <FilterSection title="Minimum Rating">
            <div className="space-y-1.5">
              {RATING_OPTIONS.map((opt) => (
                <label key={opt.value} className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="radio"
                    name="rating"
                    className="accent-primary-600"
                    checked={filters.minRating === opt.value}
                    onChange={() => update({ minRating: opt.value })}
                  />
                  <span className="text-sm group-hover:text-primary-600 transition-colors" style={{ color: 'var(--text-secondary)' }}>
                    {'⭐'.repeat(opt.value)} {opt.label}
                  </span>
                </label>
              ))}
              {filters.minRating && (
                <button onClick={() => update({ minRating: undefined })} className="text-xs text-primary-600 hover:underline mt-1">
                  Clear
                </button>
              )}
            </div>
          </FilterSection>

          {/* Ownership */}
          <FilterSection title="Ownership">
            <div className="flex gap-2">
              {(['GOVERNMENT', 'PRIVATE'] as OwnershipType[]).map((type) => (
                <button
                  key={type}
                  onClick={() =>
                    update({
                      ownershipType: filters.ownershipType === type ? undefined : type,
                    })
                  }
                  className={`flex-1 py-1.5 text-xs font-medium rounded-lg border transition-all ${
                    filters.ownershipType === type
                      ? 'bg-primary-600 text-white border-primary-600'
                      : 'hover:border-primary-500'
                  }`}
                  style={
                    filters.ownershipType !== type
                      ? { borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }
                      : {}
                  }
                >
                  {type === 'GOVERNMENT' ? 'Govt' : 'Private'}
                </button>
              ))}
            </div>
          </FilterSection>

          {/* NAAC Grade */}
          <FilterSection title="NAAC Grade">
            <div className="flex flex-wrap gap-2">
              {NAAC_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() =>
                    update({
                      naacGrade: filters.naacGrade === opt.value ? undefined : opt.value,
                    })
                  }
                  className={`px-3 py-1 text-xs font-bold rounded-lg border transition-all ${
                    filters.naacGrade === opt.value
                      ? 'bg-primary-600 text-white border-primary-600'
                      : 'hover:border-primary-500'
                  }`}
                  style={
                    filters.naacGrade !== opt.value
                      ? { borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }
                      : {}
                  }
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </FilterSection>

          {/* Fees Range */}
          <FilterSection title="Annual Fees Range">
            <div className="flex gap-2 items-center">
              <input
                type="number"
                placeholder="Min"
                value={filters.minFees ?? ''}
                onChange={(e) => update({ minFees: e.target.value ? Number(e.target.value) : undefined })}
                className="w-full text-xs rounded-lg px-2 py-2 border focus:outline-none focus:ring-2 focus:ring-primary-500"
                style={{
                  background: 'var(--bg-primary)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-primary)',
                }}
              />
              <span style={{ color: 'var(--text-muted)' }}>-</span>
              <input
                type="number"
                placeholder="Max"
                value={filters.maxFees ?? ''}
                onChange={(e) => update({ maxFees: e.target.value ? Number(e.target.value) : undefined })}
                className="w-full text-xs rounded-lg px-2 py-2 border focus:outline-none focus:ring-2 focus:ring-primary-500"
                style={{
                  background: 'var(--bg-primary)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-primary)',
                }}
              />
            </div>
          </FilterSection>

          {/* Placement */}
          <FilterSection title="Min Avg Package (₹/yr)">
            <input
              type="number"
              placeholder="e.g. 500000"
              value={filters.minPlacement ?? ''}
              onChange={(e) =>
                update({ minPlacement: e.target.value ? Number(e.target.value) : undefined })
              }
              className="w-full text-sm rounded-lg px-3 py-2 border focus:outline-none focus:ring-2 focus:ring-primary-500"
              style={{
                background: 'var(--bg-primary)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-primary)',
              }}
            />
          </FilterSection>
        </div>
      </aside>
    </>
  );
}

function FilterSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(true);

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full mb-2"
      >
        <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
          {title}
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 transition-transform ${open ? '' : '-rotate-90'}`}
          style={{ color: 'var(--text-muted)' }}
        />
      </button>
      {open && children}
    </div>
  );
}
