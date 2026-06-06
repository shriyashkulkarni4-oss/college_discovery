import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getColleges, createCollege, updateCollege, deleteCollege } from '../../api/colleges';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Edit, Trash2, Search, X, GraduationCap, AlertTriangle } from 'lucide-react';
import ErrorState from '../../components/ErrorState';
import type { CollegeCard, OwnershipType, NaacGrade } from '../../types';

const CollegeSchema = z.object({
  name: z.string().min(3),
  description: z.string().min(50),
  state: z.string().min(2),
  city: z.string().min(2),
  fees: z.number().positive(),
  rating: z.number().min(0).max(5).optional(),
  ownershipType: z.enum(['GOVERNMENT', 'PRIVATE']),
  naacGrade: z.enum(['A_PLUS_PLUS', 'A_PLUS', 'A', 'B_PLUS_PLUS', 'B_PLUS', 'B', 'C', 'NOT_ACCREDITED']).optional(),
  establishedYear: z.number().int().min(1800).max(2025),
  placementAverage: z.number().min(0),
  placementHighest: z.number().min(0),
  imageUrl: z.string().url().optional().or(z.literal('')),
});

type CollegeFormData = z.infer<typeof CollegeSchema>;

export default function CollegeManagement() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCollege, setEditingCollege] = useState<CollegeCard | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<CollegeCard | null>(null);
  const queryClient = useQueryClient();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['admin-colleges', search, page],
    queryFn: () => getColleges({ search: search || undefined, limit: 10, sortBy: 'newest', sortOrder: 'desc' }),
    staleTime: 1000 * 30,
  });

  const createMutation = useMutation({
    mutationFn: createCollege,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-colleges'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
      setModalOpen(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CollegeCard> }) => updateCollege(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-colleges'] });
      setModalOpen(false);
      setEditingCollege(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCollege,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-colleges'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
      setDeleteConfirm(null);
    },
  });

  const colleges = data?.items ?? [];

  const openCreate = () => { setEditingCollege(null); setModalOpen(true); };
  const openEdit = (c: CollegeCard) => { setEditingCollege(c); setModalOpen(true); };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold" style={{ color: 'var(--text-primary)' }}>College Management</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Create, edit and manage college listings</p>
        </div>
        <button onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-600 text-white text-sm font-semibold hover:bg-primary-700 transition-colors">
          <Plus className="w-4 h-4" /> Add College
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-5 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-muted)' }} />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search colleges..."
          className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border focus:outline-none focus:ring-2 focus:ring-primary-500"
          style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }} />
      </div>

      {/* Table */}
      {isError ? (
        <ErrorState onRetry={refetch} />
      ) : (
        <div className="rounded-2xl border overflow-hidden" style={{ borderColor: 'var(--border-color)' }}>
          <table className="w-full">
            <thead style={{ background: 'var(--bg-card)', borderBottom: '1px solid var(--border-color)' }}>
              <tr>
                {['College', 'Location', 'Type', 'Rating', 'Fees', 'Actions'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: 'var(--border-color)' }}>
              {isLoading
                ? [...Array(5)].map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      {[...Array(6)].map((_, j) => (
                        <td key={j} className="px-4 py-4">
                          <div className="h-3 bg-surface-200 dark:bg-surface-800 rounded w-20" />
                        </td>
                      ))}
                    </tr>
                  ))
                : colleges.map((college) => (
                    <tr key={college.id} className="hover:bg-surface-50 dark:hover:bg-surface-900 transition-colors" style={{ background: 'var(--bg-card)' }}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {college.imageUrl ? (
                            <img src={college.imageUrl} alt="" className="w-8 h-8 rounded-lg object-cover" />
                          ) : (
                            <div className="w-8 h-8 rounded-lg bg-primary-100 dark:bg-primary-950 flex items-center justify-center">
                              <GraduationCap className="w-4 h-4 text-primary-600" />
                            </div>
                          )}
                          <span className="text-sm font-medium max-w-44 truncate" style={{ color: 'var(--text-primary)' }}>{college.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs" style={{ color: 'var(--text-secondary)' }}>{college.city}, {college.state}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${college.ownershipType === 'GOVERNMENT' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'}`}>
                          {college.ownershipType === 'GOVERNMENT' ? 'Govt' : 'Private'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm font-semibold text-amber-600">{college.rating.toFixed(1)}</td>
                      <td className="px-4 py-3 text-sm" style={{ color: 'var(--text-secondary)' }}>₹{(college.fees / 1000).toFixed(0)}K</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button onClick={() => openEdit(college)} className="p-1.5 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-950 text-primary-600 transition-colors">
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => setDeleteConfirm(college)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950 text-red-500 transition-colors">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
          {!isLoading && colleges.length === 0 && (
            <div className="text-center py-12" style={{ color: 'var(--text-muted)' }}>No colleges found</div>
          )}
        </div>
      )}

      {/* Create/Edit Modal */}
      {modalOpen && (
        <CollegeModal
          college={editingCollege}
          onClose={() => { setModalOpen(false); setEditingCollege(null); }}
          onSubmit={(formData) => {
            if (editingCollege) {
              updateMutation.mutate({ id: editingCollege.id, data: formData as any });
            } else {
              createMutation.mutate(formData as any);
            }
          }}
          isLoading={createMutation.isPending || updateMutation.isPending}
          error={(createMutation.error as any)?.response?.data?.message || (updateMutation.error as any)?.response?.data?.message}
        />
      )}

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="rounded-2xl border p-6 max-w-sm w-full" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-xl">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>Delete College?</h3>
            </div>
            <p className="text-sm mb-5" style={{ color: 'var(--text-secondary)' }}>
              Are you sure you want to delete <strong>{deleteConfirm.name}</strong>? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-2 rounded-xl border text-sm font-medium" style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}>
                Cancel
              </button>
              <button onClick={() => deleteMutation.mutate(deleteConfirm.id)} disabled={deleteMutation.isPending}
                className="flex-1 py-2 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 disabled:opacity-60 transition-colors">
                {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function CollegeModal({ college, onClose, onSubmit, isLoading, error }: {
  college: CollegeCard | null;
  onClose: () => void;
  onSubmit: (data: CollegeFormData) => void;
  isLoading: boolean;
  error?: string;
}) {
  const { register, handleSubmit, formState: { errors } } = useForm<CollegeFormData>({
    resolver: zodResolver(CollegeSchema),
    defaultValues: college ? {
      name: college.name,
      state: college.state,
      city: college.city,
      fees: college.fees,
      rating: college.rating,
      ownershipType: college.ownershipType,
      naacGrade: college.naacGrade,
      establishedYear: college.establishedYear,
      placementAverage: college.placementAverage ?? 0,
      placementHighest: 0,
      description: '',
    } : undefined,
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="rounded-2xl border w-full max-w-2xl my-4" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
        <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: 'var(--border-color)' }}>
          <h2 className="font-semibold" style={{ color: 'var(--text-primary)' }}>
            {college ? 'Edit College' : 'Add New College'}
          </h2>
          <button onClick={onClose}><X className="w-5 h-5" style={{ color: 'var(--text-muted)' }} /></button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-5 space-y-4">
          {error && <div className="px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 text-sm">{error}</div>}

          <style>{`
            .admin-input {
              width: 100%;
              padding: 0.5rem 0.75rem;
              border-radius: 0.625rem;
              border: 1px solid var(--border-color);
              background: var(--bg-primary);
              color: var(--text-primary);
              font-size: 0.875rem;
            }
            .admin-input:focus { outline: none; border-color: #6366f1; }
          `}</style>

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>College Name *</label>
              <input {...register('name')} className="admin-input" placeholder="Indian Institute of Technology..." />
              {errors.name && <p className="text-xs text-red-500 mt-0.5">{errors.name.message}</p>}
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Description *</label>
              <textarea {...register('description')} rows={3} className="admin-input resize-none" placeholder="Min 50 chars..." />
              {errors.description && <p className="text-xs text-red-500 mt-0.5">{errors.description.message}</p>}
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>State *</label>
              <input {...register('state')} className="admin-input" placeholder="Maharashtra" />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>City *</label>
              <input {...register('city')} className="admin-input" placeholder="Mumbai" />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Annual Fees (₹) *</label>
              <input {...register('fees', { valueAsNumber: true })} type="number" className="admin-input" placeholder="200000" />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Established Year *</label>
              <input {...register('establishedYear', { valueAsNumber: true })} type="number" className="admin-input" placeholder="1990" />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Ownership *</label>
              <select {...register('ownershipType')} className="admin-input">
                <option value="GOVERNMENT">Government</option>
                <option value="PRIVATE">Private</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>NAAC Grade</label>
              <select {...register('naacGrade')} className="admin-input">
                {['A_PLUS_PLUS', 'A_PLUS', 'A', 'B_PLUS_PLUS', 'B_PLUS', 'B', 'C', 'NOT_ACCREDITED'].map((g) => (
                  <option key={g} value={g}>{g.replace(/_/g, '+').replace('PLUS+', '+').replace('NOT+ACCREDITED', 'N/A')}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Avg Package (₹)</label>
              <input {...register('placementAverage', { valueAsNumber: true })} type="number" className="admin-input" placeholder="1000000" />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Highest Package (₹)</label>
              <input {...register('placementHighest', { valueAsNumber: true })} type="number" className="admin-input" placeholder="5000000" />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Image URL</label>
              <input {...register('imageUrl')} className="admin-input" placeholder="https://images.unsplash.com/..." />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl border text-sm font-medium" style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}>
              Cancel
            </button>
            <button type="submit" disabled={isLoading}
              className="flex-1 py-2.5 rounded-xl bg-primary-600 text-white text-sm font-semibold hover:bg-primary-700 disabled:opacity-60 transition-colors">
              {isLoading ? 'Saving...' : college ? 'Update College' : 'Create College'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
