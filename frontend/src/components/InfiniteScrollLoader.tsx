import { useEffect } from 'react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { Loader2 } from 'lucide-react';

interface Props {
  onVisible: () => void;
  isLoading: boolean;
  hasMore: boolean;
}

export default function InfiniteScrollLoader({ onVisible, isLoading, hasMore }: Props) {
  const [ref, isIntersecting] = useIntersectionObserver({ rootMargin: '200px' });

  useEffect(() => {
    if (isIntersecting && hasMore && !isLoading) {
      onVisible();
    }
  }, [isIntersecting, hasMore, isLoading, onVisible]);

  if (!hasMore) {
    return (
      <div className="text-center py-8" style={{ color: 'var(--text-muted)' }}>
        <p className="text-sm">You've seen all colleges</p>
      </div>
    );
  }

  return (
    <div ref={ref} className="flex justify-center py-8">
      {isLoading && (
        <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-muted)' }}>
          <Loader2 className="w-4 h-4 animate-spin" />
          Loading more...
        </div>
      )}
    </div>
  );
}
