import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { compareColleges } from '../api/compare';
import { useCompareStore } from '../store/compareStore';
import CompareTable from '../components/CompareTable';
import CollegeCard from '../components/CollegeCard';
import EmptyState from '../components/EmptyState';
import ErrorState from '../components/ErrorState';
import { getColleges } from '../api/colleges';
import { X, BarChart2, Search as SearchIcon } from 'lucide-react';
import type { CollegeCard as CollegeCardType } from '../types';

export default function Compare() {
  const { colleges: compareList, addCollege, removeCollege, clearAll } = useCompareStore();
  const [searchQ, setSearchQ] = useState('');

  const { data: compareData, isLoading, isError } = useQuery({
    queryKey: ['compare', compareList.map((c) => c.id).join(',')],
    queryFn: () => compareColleges(compareList.map((c) => c.id)),
    enabled: compareList.length >= 2,
    staleTime: 1000 * 60 * 5,
  });

  const { data: searchData } = useQuery({
    queryKey: ['college-search-compare', searchQ],
    queryFn: () => getColleges({ search: searchQ, limit: 6 }),
    enabled: searchQ.length >= 2,
    staleTime: 1000 * 60,
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold mb-1" style={{ color: 'var(--text-primary)' }}>
          Compare Colleges
        </h1>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          Select up to 3 colleges to compare side by side
        </p>
      </div>

      {/* Selected colleges chips */}
      <div className="flex flex-wrap gap-3 mb-6">
        {compareList.map((college) => (
          <div key={college.id} className="flex items-center gap-2 px-3 py-1.5 rounded-xl border text-sm font-medium" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
            <span style={{ color: 'var(--text-primary)' }} className="max-w-40 truncate">{college.name}</span>
            <button onClick={() => removeCollege(college.id)} className="text-red-400 hover:text-red-600 transition-colors">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
        {compareList.length === 0 && (
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No colleges added yet. Search below to add.</p>
        )}
        {compareList.length > 0 && (
          <button onClick={clearAll} className="text-xs text-red-500 hover:underline px-2">
            Clear all
          </button>
        )}
      </div>

      {/* Search to add more */}
      {compareList.length < 3 && (
        <div className="mb-8">
          <div className="relative max-w-md">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-muted)' }} />
            <input
              type="text"
              value={searchQ}
              onChange={(e) => setSearchQ(e.target.value)}
              placeholder="Search colleges to add..."
              className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border focus:outline-none focus:ring-2 focus:ring-primary-500"
              style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
            />
          </div>

          {searchData && searchQ.length >= 2 && (
            <div className="mt-2 rounded-xl border overflow-hidden max-w-md" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
              {searchData.items.length === 0 ? (
                <p className="px-4 py-3 text-sm" style={{ color: 'var(--text-muted)' }}>No colleges found</p>
              ) : (
                searchData.items.map((college) => {
                  const alreadyAdded = compareList.some((c) => c.id === college.id);
                  return (
                    <button
                      key={college.id}
                      disabled={alreadyAdded}
                      onClick={() => {
                        if (!alreadyAdded) { addCollege(college); setSearchQ(''); }
                      }}
                      className={`w-full text-left px-4 py-3 text-sm border-b last:border-0 transition-colors ${
                        alreadyAdded ? 'opacity-50 cursor-not-allowed' : 'hover:bg-surface-50 dark:hover:bg-surface-900'
                      }`}
                      style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                    >
                      <div className="font-medium">{college.name}</div>
                      <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                        {college.city}, {college.state} · {alreadyAdded ? 'Already added' : 'Click to add'}
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          )}
        </div>
      )}

      {/* Compare Table or Empty State */}
      {compareList.length < 2 ? (
        <EmptyState
          title="Add at least 2 colleges"
          description="Use the search above to find and add colleges you want to compare."
          action={
            <Link to="/colleges" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-600 text-white text-sm font-semibold hover:bg-primary-700 transition-colors">
              <BarChart2 className="w-4 h-4" /> Browse Colleges
            </Link>
          }
        />
      ) : isLoading ? (
        <div className="rounded-2xl border overflow-hidden animate-pulse" style={{ borderColor: 'var(--border-color)' }}>
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-14 border-b" style={{ borderColor: 'var(--border-color)', background: i % 2 === 0 ? 'var(--bg-card)' : 'transparent' }} />
          ))}
        </div>
      ) : isError ? (
        <ErrorState title="Failed to load comparison" description="Please try again." />
      ) : compareData ? (
        <CompareTable colleges={compareData} />
      ) : null}
    </div>
  );
}
