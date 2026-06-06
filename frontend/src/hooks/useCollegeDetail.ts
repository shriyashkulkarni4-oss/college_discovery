import { useQuery } from '@tanstack/react-query';
import { getCollegeById } from '../api/colleges';

export function useCollegeDetail(id: string) {
  return useQuery({
    queryKey: ['college', id],
    queryFn: () => getCollegeById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
}
