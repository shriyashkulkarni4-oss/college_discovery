import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAllUsers } from '../../api/admin';
import { Users, Shield, User, Calendar } from 'lucide-react';
import ErrorState from '../../components/ErrorState';

export default function UserManagement() {
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['admin-users', page],
    queryFn: () => getAllUsers(page, 20),
    staleTime: 1000 * 60,
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold" style={{ color: 'var(--text-primary)' }}>User Management</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
          All registered users · {data?.total ?? 0} total
        </p>
      </div>

      {isError ? (
        <ErrorState onRetry={refetch} />
      ) : (
        <div className="rounded-2xl border overflow-hidden" style={{ borderColor: 'var(--border-color)' }}>
          <table className="w-full">
            <thead style={{ background: 'var(--bg-card)', borderBottom: '1px solid var(--border-color)' }}>
              <tr>
                {['User', 'Email', 'Role', 'Reviews', 'Saved', 'Joined'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: 'var(--border-color)' }}>
              {isLoading
                ? [...Array(10)].map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      {[...Array(6)].map((_, j) => (
                        <td key={j} className="px-4 py-4">
                          <div className="h-3 bg-surface-200 dark:bg-surface-800 rounded w-20" />
                        </td>
                      ))}
                    </tr>
                  ))
                : (data?.users ?? []).map((user) => (
                    <tr key={user.id} className="hover:bg-surface-50 dark:hover:bg-surface-900 transition-colors" style={{ background: 'var(--bg-card)' }}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-accent-400 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{user.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm" style={{ color: 'var(--text-secondary)' }}>{user.email}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
                          user.role === 'ADMIN'
                            ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
                            : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
                        }`}>
                          {user.role === 'ADMIN' ? <Shield className="w-3 h-3" /> : <User className="w-3 h-3" />}
                          {user.role}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                        {(user as any)._count?.reviews ?? 0}
                      </td>
                      <td className="px-4 py-3 text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                        {(user as any)._count?.savedColleges ?? 0}
                      </td>
                      <td className="px-4 py-3 text-xs" style={{ color: 'var(--text-muted)' }}>
                        {new Date(user.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short' })}
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>

          {!isLoading && (data?.users ?? []).length === 0 && (
            <div className="text-center py-12" style={{ color: 'var(--text-muted)' }}>No users found</div>
          )}

          {/* Pagination */}
          {data && Math.ceil(data.total / 20) > 1 && (
            <div className="flex items-center justify-between p-4 border-t" style={{ borderColor: 'var(--border-color)', background: 'var(--bg-card)' }}>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                Showing {(page - 1) * 20 + 1}–{Math.min(page * 20, data.total)} of {data.total}
              </p>
              <div className="flex gap-2">
                <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
                  className="px-3 py-1.5 rounded-lg border text-xs font-medium disabled:opacity-40" style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}>
                  Previous
                </button>
                <button onClick={() => setPage((p) => p + 1)} disabled={page * 20 >= data.total}
                  className="px-3 py-1.5 rounded-lg border text-xs font-medium disabled:opacity-40" style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}>
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
