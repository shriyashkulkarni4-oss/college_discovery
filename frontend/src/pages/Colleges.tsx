import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getStates } from '../api/colleges';
import { useColleges } from '../hooks/useColleges';
import { useDebounce } from '../hooks/useDebounce';
import SearchBar from '../components/SearchBar';
import FilterSidebar from '../components/FilterSidebar';
import CollegeCard from '../components/CollegeCard';
import CollegeSkeleton from '../components/CollegeSkeleton';
import InfiniteScrollLoader from '../components/InfiniteScrollLoader';
import EmptyState from '../components/EmptyState';
import ErrorState from '../components/ErrorState';
import type { CollegeFilters } from '../types';
import { GraduationCap } from 'lucide-react';

export default function Colleges() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Read initial filters from URL
  const [filters, setFilters] = useState<CollegeFilters>({
    search: searchParams.get('search') ?? undefined,
    state: searchParams.get('state') ?? undefined,
    city: searchParams.get('city') ?? undefined,
    sortBy: (searchParams.get('sortBy') as CollegeFilters['sortBy']) ?? 'rating',
    sortOrder: (searchParams.get('sortOrder') as CollegeFilters['sortOrder']) ?? 'desc',
  });

  const [searchInput, setSearchInput] = useState(filters.search ?? '');
  const debouncedSearch = useDebounce(searchInput, 500);

  // Sync debounced search → filters
  useEffect(() => {
    setFilters((f) => ({ ...f, search: debouncedSearch || undefined }));
  }, [debouncedSearch]);

  // Sync filters → URL
  useEffect(() => {
    const params: Record<string, string> = {};
    Object.entries(filters).forEach(([k, v]) => {
      if (v !== undefined && v !== '') params[k] = String(v);
    });
    setSearchParams(params, { replace: true });
  }, [filters, setSearchParams]);

  const handleFilterChange = useCallback((newFilters: CollegeFilters) => {
    setFilters(newFilters);
    if (newFilters.search !== undefined) setSearchInput(newFilters.search);
  }, []);

  const { data: statesData } = useQuery({
    queryKey: ['states'],
    queryFn: getStates,
    staleTime: Infinity,
  });

  const {
    data,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    isError,
    refetch,
  } = useColleges(filters);

  const allColleges = data?.pages.flatMap((p) => p.items) ?? [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold mb-1" style={{ color: 'var(--text-primary)' }}>
          Explore Colleges
        </h1>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          {!isLoading && data
            ? `Showing results · infinite scroll to load more`
            : 'Finding the best colleges for you...'}
        </p>
      </div>

      {/* Search */}
      <div className="mb-4">
        <SearchBar
          value={searchInput}
          onChange={setSearchInput}
          placeholder="Search by college name, city, state, or course..."
        />
      </div>

      <div className="flex gap-6 items-start">
        {/* Filter sidebar */}
        <FilterSidebar
          filters={filters}
          onFilterChange={handleFilterChange}
          states={statesData ?? []}
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
        />

        {/* Results */}
        <div className="flex-1 min-w-0">
          {isError ? (
            <ErrorState
              title="Failed to load colleges"
              description="Please check your connection and try again."
              onRetry={() => refetch()}
            />
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {isLoading
                  ? [...Array(9)].map((_, i) => <CollegeSkeleton key={i} />)
                  : allColleges.map((college) => (
                      <CollegeCard key={college.id} college={college} />
                    ))}
              </div>

              {!isLoading && allColleges.length === 0 && (
                <EmptyState
                  title="No colleges found"
                  description="Try adjusting your search or filters to find more colleges."
                  action={
                    <button
                      onClick={() => {
                        setFilters({ sortBy: 'rating', sortOrder: 'desc' });
                        setSearchInput('');
                      }}
                      className="px-4 py-2 rounded-xl bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 transition-colors"
                    >
                      Clear Filters
                    </button>
                  }
                />
              )}

              {!isLoading && (
                <InfiniteScrollLoader
                  onVisible={() => fetchNextPage()}
                  isLoading={isFetchingNextPage}
                  hasMore={!!hasNextPage}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
