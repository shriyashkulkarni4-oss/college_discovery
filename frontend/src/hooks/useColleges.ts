import { useInfiniteQuery } from '@tanstack/react-query';
import { getColleges } from '../api/colleges';
import type { CollegeFilters } from '../types';

export function useColleges(filters: CollegeFilters) {
  return useInfiniteQuery({
    queryKey: ['colleges', filters],
    queryFn: ({ pageParam }) =>
      getColleges({ ...filters, cursor: pageParam as string | undefined, limit: 12 }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    staleTime: 1000 * 60 * 2,
  });
}
