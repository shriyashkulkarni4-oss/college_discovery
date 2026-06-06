import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getSavedIds, saveCollege, unsaveCollege } from '../api/saved';
import { useAuthStore } from '../store/authStore';

export function useSaved() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const queryClient = useQueryClient();

  const { data: savedIds = [], isLoading } = useQuery({
    queryKey: ['saved-ids'],
    queryFn: getSavedIds,
    enabled: isAuthenticated,
    staleTime: 1000 * 60,
  });

  const saveMutation = useMutation({
    mutationFn: saveCollege,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saved-ids'] });
      queryClient.invalidateQueries({ queryKey: ['saved'] });
    },
  });

  const unsaveMutation = useMutation({
    mutationFn: unsaveCollege,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saved-ids'] });
      queryClient.invalidateQueries({ queryKey: ['saved'] });
    },
  });

  const isSaved = (id: string) => savedIds.includes(id);

  const toggleSave = (id: string) => {
    if (isSaved(id)) {
      unsaveMutation.mutate(id);
    } else {
      saveMutation.mutate(id);
    }
  };

  return {
    savedIds,
    isSaved,
    toggleSave,
    isLoading,
    isSaving: saveMutation.isPending || unsaveMutation.isPending,
  };
}
