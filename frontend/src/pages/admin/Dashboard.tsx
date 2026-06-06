import { useQuery } from '@tanstack/react-query';
import { getDashboardStats } from '../../api/admin';
import DashboardCard from '../../components/DashboardCard';
import ErrorState from '../../components/ErrorState';
import { GraduationCap, BookOpen, MessageSquare, Users, Star, MapPin } from 'lucide-react';

export default function AdminDashboard() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: getDashboardStats,
    staleTime: 1000 * 60,
  });

  if (isError) {
    return <ErrorState title="Failed to load dashboard" onRetry={refetch} />;
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold" style={{ color: 'var(--text-primary)' }}>
          Dashboard
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
          Welcome back, Admin 👋
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {isLoading ? (
          [...Array(4)].map((_, i) => (
            <div key={i} className="h-32 rounded-2xl animate-pulse" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }} />
          ))
        ) : (
          <>
            <DashboardCard
              title="Total Colleges"
              value={data?.stats.totalColleges ?? 0}
              icon={<GraduationCap className="w-5 h-5" />}
              color="blue"
              subtitle="Active listings"
            />
            <DashboardCard
              title="Total Courses"
              value={data?.stats.totalCourses ?? 0}
              icon={<BookOpen className="w-5 h-5" />}
              color="purple"
              subtitle="Across all colleges"
            />
            <DashboardCard
              title="Total Reviews"
              value={data?.stats.totalReviews ?? 0}
              icon={<MessageSquare className="w-5 h-5" />}
              color="amber"
              subtitle="Student reviews"
            />
            <DashboardCard
              title="Total Users"
              value={data?.stats.totalUsers ?? 0}
              icon={<Users className="w-5 h-5" />}
              color="green"
              subtitle="Registered students"
            />
          </>
        )}
      </div>

      {/* Recent Colleges & Reviews */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Colleges */}
        <div className="rounded-2xl border" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
          <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: 'var(--border-color)' }}>
            <h2 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>Recent Colleges</h2>
          </div>
          <div className="divide-y" style={{ borderColor: 'var(--border-color)' }}>
            {isLoading
              ? [...Array(5)].map((_, i) => (
                  <div key={i} className="p-4 flex items-center gap-3 animate-pulse">
                    <div className="w-10 h-10 rounded-xl bg-surface-200 dark:bg-surface-800 flex-shrink-0" />
                    <div className="flex-1 space-y-1.5">
                      <div className="h-3 bg-surface-200 dark:bg-surface-800 rounded w-3/4" />
                      <div className="h-2.5 bg-surface-200 dark:bg-surface-800 rounded w-1/2" />
                    </div>
                  </div>
                ))
              : (data?.recentColleges ?? []).map((college) => (
                  <div key={college.id} className="p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-100 to-accent-100 dark:from-primary-950 dark:to-accent-950 flex items-center justify-center flex-shrink-0">
                      <GraduationCap className="w-5 h-5 text-primary-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>{college.name}</p>
                      <p className="text-xs flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
                        <MapPin className="w-3 h-3" /> {college.city}, {college.state}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 text-xs font-bold text-amber-600">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      {college.rating?.toFixed(1)}
                    </div>
                  </div>
                ))}
          </div>
        </div>

        {/* Recent Reviews */}
        <div className="rounded-2xl border" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
          <div className="p-4 border-b" style={{ borderColor: 'var(--border-color)' }}>
            <h2 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>Recent Reviews</h2>
          </div>
          <div className="divide-y" style={{ borderColor: 'var(--border-color)' }}>
            {isLoading
              ? [...Array(5)].map((_, i) => (
                  <div key={i} className="p-4 animate-pulse space-y-1.5">
                    <div className="h-3 bg-surface-200 dark:bg-surface-800 rounded w-2/3" />
                    <div className="h-2.5 bg-surface-200 dark:bg-surface-800 rounded w-full" />
                  </div>
                ))
              : (data?.recentReviews ?? []).map((review) => (
                  <div key={review.id} className="p-4">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>
                        {review.user?.name} → {review.college?.name}
                      </p>
                      <div className="flex items-center gap-0.5">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span className="text-xs font-bold text-amber-600">{review.rating}</span>
                      </div>
                    </div>
                    <p className="text-xs line-clamp-2" style={{ color: 'var(--text-muted)' }}>{review.comment}</p>
                  </div>
                ))}
          </div>
        </div>
      </div>
    </div>
  );
}
