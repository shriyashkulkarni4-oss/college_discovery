import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAllReviews, deleteReview } from '../../api/compare';
import { Trash2, Star, AlertTriangle, MessageSquare } from 'lucide-react';
import ErrorState from '../../components/ErrorState';
import type { Review } from '../../types';

export default function ReviewManagement() {
  const [page, setPage] = useState(1);
  const [deleteConfirm, setDeleteConfirm] = useState<Review | null>(null);
  const queryClient = useQueryClient();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['admin-reviews', page],
    queryFn: () => getAllReviews(page, 20),
    staleTime: 1000 * 30,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-reviews'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
      setDeleteConfirm(null);
    },
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold" style={{ color: 'var(--text-primary)' }}>Review Management</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
          Moderate student reviews · {data?.total ?? 0} total
        </p>
      </div>

      {isError ? (
        <ErrorState onRetry={refetch} />
      ) : (
        <div className="rounded-2xl border overflow-hidden" style={{ borderColor: 'var(--border-color)' }}>
          <table className="w-full">
            <thead style={{ background: 'var(--bg-card)', borderBottom: '1px solid var(--border-color)' }}>
              <tr>
                {['Student', 'College', 'Rating', 'Comment', 'Date', ''].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: 'var(--border-color)' }}>
              {isLoading
                ? [...Array(8)].map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      {[...Array(6)].map((_, j) => (
                        <td key={j} className="px-4 py-4">
                          <div className="h-3 bg-surface-200 dark:bg-surface-800 rounded w-20" />
                        </td>
                      ))}
                    </tr>
                  ))
                : (data?.reviews ?? []).map((review) => (
                    <tr key={review.id} className="hover:bg-surface-50 dark:hover:bg-surface-900 transition-colors" style={{ background: 'var(--bg-card)' }}>
                      <td className="px-4 py-3 text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                        {review.user?.name}
                      </td>
                      <td className="px-4 py-3 text-sm max-w-32 truncate" style={{ color: 'var(--text-secondary)' }}>
                        {review.college?.name}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-0.5">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span className="text-sm font-bold text-amber-600">{review.rating}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs max-w-64 truncate" style={{ color: 'var(--text-secondary)' }}>
                        {review.comment}
                      </td>
                      <td className="px-4 py-3 text-xs" style={{ color: 'var(--text-muted)' }}>
                        {new Date(review.createdAt).toLocaleDateString('en-IN')}
                      </td>
                      <td className="px-4 py-3">
                        <button onClick={() => setDeleteConfirm(review)}
                          className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950 text-red-500 transition-colors">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>

          {!isLoading && (data?.reviews ?? []).length === 0 && (
            <div className="text-center py-12" style={{ color: 'var(--text-muted)' }}>No reviews found</div>
          )}

          {/* Pagination */}
          {data && data.pages > 1 && (
            <div className="flex items-center justify-between p-4 border-t" style={{ borderColor: 'var(--border-color)', background: 'var(--bg-card)' }}>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                Page {data.page} of {data.pages}
              </p>
              <div className="flex gap-2">
                <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
                  className="px-3 py-1.5 rounded-lg border text-xs font-medium disabled:opacity-40" style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}>
                  Previous
                </button>
                <button onClick={() => setPage((p) => Math.min(data.pages, p + 1))} disabled={page >= data.pages}
                  className="px-3 py-1.5 rounded-lg border text-xs font-medium disabled:opacity-40" style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}>
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="rounded-2xl border p-6 max-w-sm w-full" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-xl">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>Delete Review?</h3>
            </div>
            <p className="text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>
              Delete review by <strong>{deleteConfirm.user?.name}</strong>?
            </p>
            <p className="text-xs mb-5 italic line-clamp-2" style={{ color: 'var(--text-muted)' }}>"{deleteConfirm.comment}"</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-2 rounded-xl border text-sm font-medium" style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}>Cancel</button>
              <button onClick={() => deleteMutation.mutate(deleteConfirm.id)} disabled={deleteMutation.isPending}
                className="flex-1 py-2 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 disabled:opacity-60">
                {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
