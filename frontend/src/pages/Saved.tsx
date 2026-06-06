import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { getSavedColleges } from '../api/saved';
import CollegeCard from '../components/CollegeCard';
import CollegeSkeleton from '../components/CollegeSkeleton';
import EmptyState from '../components/EmptyState';
import ErrorState from '../components/ErrorState';
import { Bookmark, Search } from 'lucide-react';

export default function Saved() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['saved'],
    queryFn: getSavedColleges,
    staleTime: 1000 * 30,
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 flex items-center gap-3">
        <div className="p-2 bg-primary-100 dark:bg-primary-950 rounded-xl">
          <Bookmark className="w-5 h-5 text-primary-600" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold" style={{ color: 'var(--text-primary)' }}>
            Saved Colleges
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            {data ? `${data.length} saved college${data.length !== 1 ? 's' : ''}` : '...'}
          </p>
        </div>
      </div>

      {isError ? (
        <ErrorState
          title="Failed to load saved colleges"
          description="Please try again later."
          onRetry={refetch}
        />
      ) : isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[...Array(6)].map((_, i) => <CollegeSkeleton key={i} />)}
        </div>
      ) : data && data.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {data.map((saved) => (
            <CollegeCard key={saved.id} college={saved.college as any} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No saved colleges"
          description="Save colleges you're interested in to compare and revisit them later."
          action={
            <Link
              to="/colleges"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-600 text-white text-sm font-semibold hover:bg-primary-700 transition-colors"
            >
              <Search className="w-4 h-4" />
              Browse Colleges
            </Link>
          }
        />
      )}
    </div>
  );
}
