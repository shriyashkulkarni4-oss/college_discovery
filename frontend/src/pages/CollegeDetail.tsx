import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import {
  MapPin, Star, Building2, GraduationCap, TrendingUp, Award, Bookmark,
  BookmarkCheck, BarChart2, MessageSquare, ChevronLeft, Users
} from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCollegeDetail } from '../hooks/useCollegeDetail';
import { useSaved } from '../hooks/useSaved';
import { useAuth } from '../hooks/useAuth';
import { useCompareStore } from '../store/compareStore';
import { createReview } from '../api/compare';
import CollegeCard from '../components/CollegeCard';
import CollegeSkeleton from '../components/CollegeSkeleton';
import ErrorState from '../components/ErrorState';
import { NAAC_GRADE_LABELS } from '../types';

function formatCurrency(val: number): string {
  if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`;
  if (val >= 100000) return `₹${(val / 100000).toFixed(1)}L`;
  return `₹${val.toLocaleString('en-IN')}`;
}

const TABS = ['Overview', 'Courses', 'Placements', 'Reviews', 'Similar'] as const;
type Tab = (typeof TABS)[number];

export default function CollegeDetail() {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<Tab>('Overview');
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewError, setReviewError] = useState('');

  const { data: college, isLoading, isError, refetch } = useCollegeDetail(id!);
  const { isSaved, toggleSave } = useSaved();
  const { isAuthenticated, user } = useAuth();
  const { addCollege, removeCollege, isInCompare } = useCompareStore();
  const queryClient = useQueryClient();

  const saved = isSaved(id!);
  const inCompare = college ? isInCompare(college.id) : false;

  const reviewMutation = useMutation({
    mutationFn: createReview,
    onSuccess: () => {
      setReviewText('');
      setReviewRating(5);
      setReviewError('');
      queryClient.invalidateQueries({ queryKey: ['college', id] });
    },
    onError: (err: any) => {
      setReviewError(err?.response?.data?.message ?? 'Failed to submit review');
    },
  });

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewText.trim() || reviewText.length < 10) {
      setReviewError('Review must be at least 10 characters');
      return;
    }
    reviewMutation.mutate({ collegeId: id!, rating: reviewRating, comment: reviewText });
  };

  const handleCompare = () => {
    if (!college) return;
    if (inCompare) {
      removeCollege(college.id);
    } else {
      const card = {
        id: college.id, name: college.name, slug: college.slug,
        state: college.state, city: college.city, fees: college.fees,
        rating: college.rating, ownershipType: college.ownershipType,
        naacGrade: college.naacGrade, imageUrl: college.imageUrl,
      };
      if (!addCollege(card)) alert('Remove one college from compare first.');
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="h-72 rounded-3xl bg-surface-200 dark:bg-surface-800 animate-pulse mb-6" />
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => <div key={i} className="h-6 bg-surface-200 dark:bg-surface-800 rounded animate-pulse w-3/4" />)}
        </div>
      </div>
    );
  }

  if (isError || !college) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8">
        <ErrorState title="College not found" description="This college may have been removed or the link is incorrect." onRetry={refetch} />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      {/* Back */}
      <Link to="/colleges" className="inline-flex items-center gap-1 text-sm mb-5 hover:text-primary-600 transition-colors" style={{ color: 'var(--text-secondary)' }}>
        <ChevronLeft className="w-4 h-4" /> Back to Colleges
      </Link>

      {/* Hero Card */}
      <div className="rounded-3xl overflow-hidden border mb-6" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
        <div className="relative h-56 md:h-72 bg-gradient-to-br from-primary-900 to-accent-900">
          {college.imageUrl && (
            <img src={college.imageUrl} alt={college.name} className="w-full h-full object-cover opacity-60" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between">
            <div>
              <div className="flex gap-2 mb-2">
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-500 text-white">
                  NAAC {NAAC_GRADE_LABELS[college.naacGrade]}
                </span>
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-white/20 text-white backdrop-blur-sm">
                  {college.ownershipType === 'GOVERNMENT' ? 'Government' : 'Private'}
                </span>
              </div>
              <h1 className="text-xl md:text-3xl font-extrabold text-white">{college.name}</h1>
              <div className="flex items-center gap-1 text-white/80 text-sm mt-1">
                <MapPin className="w-4 h-4" /> {college.city}, {college.state}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <button onClick={() => toggleSave(id!)} title={saved ? 'Remove from saved' : 'Save'}
                className="p-2.5 rounded-xl bg-white/20 hover:bg-white/30 transition-colors backdrop-blur-sm">
                {saved ? <BookmarkCheck className="w-5 h-5 text-white" /> : <Bookmark className="w-5 h-5 text-white" />}
              </button>
              <button onClick={handleCompare} title={inCompare ? 'Remove from compare' : 'Compare'}
                className={`p-2.5 rounded-xl backdrop-blur-sm transition-colors ${inCompare ? 'bg-primary-600' : 'bg-white/20 hover:bg-white/30'}`}>
                <BarChart2 className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0" style={{ borderTop: '1px solid var(--border-color)', borderColor: 'var(--border-color)' }}>
          {[
            { label: 'Rating', value: `${college.rating.toFixed(1)}/5`, icon: <Star className="w-4 h-4 fill-amber-400 text-amber-400" /> },
            { label: 'Annual Fees', value: formatCurrency(college.fees), icon: <GraduationCap className="w-4 h-4 text-primary-600" /> },
            { label: 'Avg Package', value: formatCurrency(college.placementAverage), icon: <TrendingUp className="w-4 h-4 text-emerald-600" /> },
            { label: 'Est. Year', value: college.establishedYear, icon: <Building2 className="w-4 h-4 text-purple-600" /> },
          ].map((stat) => (
            <div key={stat.label} className="flex flex-col items-center py-4 px-2 text-center">
              <div className="mb-1">{stat.icon}</div>
              <div className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>{stat.value}</div>
              <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 overflow-x-auto pb-1 mb-6 border-b" style={{ borderColor: 'var(--border-color)' }}>
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg whitespace-nowrap transition-all ${
              activeTab === tab
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'hover:text-primary-600'
            }`}
            style={{ color: activeTab === tab ? undefined : 'var(--text-secondary)' }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'Overview' && (
        <div className="space-y-6 animate-fade-in">
          <div className="p-6 rounded-2xl border" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
            <h2 className="font-semibold text-lg mb-3">About {college.name}</h2>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{college.description}</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { label: 'Established', value: college.establishedYear },
              { label: 'Location', value: `${college.city}, ${college.state}` },
              { label: 'Ownership', value: college.ownershipType === 'GOVERNMENT' ? 'Government' : 'Private' },
              { label: 'NAAC Grade', value: NAAC_GRADE_LABELS[college.naacGrade] },
              { label: 'Total Reviews', value: (college.reviews?.length ?? 0) + (college._count?.reviews ?? 0) },
              { label: 'Total Courses', value: college.courses?.length ?? 0 },
            ].map((item) => (
              <div key={item.label} className="p-4 rounded-xl border" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
                <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>{item.label}</p>
                <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'Courses' && (
        <div className="animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(college.courses ?? []).map((course) => (
              <div key={course.id} className="p-4 rounded-xl border flex items-center justify-between" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
                <div>
                  <p className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>{course.courseName}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{course.duration}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-sm text-primary-600">{formatCurrency(course.fees)}</p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>per year</p>
                </div>
              </div>
            ))}
            {(!college.courses || college.courses.length === 0) && (
              <p className="col-span-2 text-center py-8" style={{ color: 'var(--text-muted)' }}>No courses listed yet.</p>
            )}
          </div>
        </div>
      )}

      {activeTab === 'Placements' && (
        <div className="animate-fade-in space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-6 rounded-2xl border text-center" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
              <TrendingUp className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
              <p className="text-3xl font-extrabold text-emerald-600">{formatCurrency(college.placementAverage)}</p>
              <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Average Package</p>
            </div>
            <div className="p-6 rounded-2xl border text-center" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
              <Award className="w-8 h-8 text-primary-500 mx-auto mb-2" />
              <p className="text-3xl font-extrabold text-primary-600">{formatCurrency(college.placementHighest)}</p>
              <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Highest Package</p>
            </div>
          </div>
          {(college.topRecruiters ?? []).length > 0 && (
            <div className="p-6 rounded-2xl border" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Users className="w-4 h-4" /> Top Recruiters
              </h3>
              <div className="flex flex-wrap gap-2">
                {(college.topRecruiters ?? []).map((recruiter) => (
                  <span key={recruiter} className="px-3 py-1.5 rounded-lg text-sm font-medium bg-primary-50 dark:bg-primary-950 text-primary-700 dark:text-primary-300 border border-primary-100 dark:border-primary-900">
                    {recruiter}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'Reviews' && (
        <div className="animate-fade-in space-y-5">
          {/* Write review */}
          {isAuthenticated ? (
            <form onSubmit={handleReviewSubmit} className="p-6 rounded-2xl border" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <MessageSquare className="w-4 h-4" /> Write a Review
              </h3>
              {/* Star rating */}
              <div className="flex gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button key={star} type="button" onClick={() => setReviewRating(star)}>
                    <Star className={`w-7 h-7 cursor-pointer transition-colors ${star <= reviewRating ? 'fill-amber-400 text-amber-400' : 'text-surface-300'}`} />
                  </button>
                ))}
              </div>
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                rows={4}
                placeholder="Share your experience at this college..."
                className="w-full rounded-xl px-4 py-3 text-sm border resize-none focus:outline-none focus:ring-2 focus:ring-primary-500"
                style={{ background: 'var(--bg-primary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
              />
              {reviewError && <p className="text-xs text-red-500 mt-1">{reviewError}</p>}
              <button type="submit" disabled={reviewMutation.isPending}
                className="mt-3 px-5 py-2 rounded-xl bg-primary-600 text-white text-sm font-semibold hover:bg-primary-700 disabled:opacity-50 transition-colors">
                {reviewMutation.isPending ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          ) : (
            <div className="p-6 rounded-2xl border text-center" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
              <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>Login to write a review</p>
              <Link to="/login" className="px-4 py-2 rounded-xl bg-primary-600 text-white text-sm font-semibold hover:bg-primary-700 transition-colors">
                Login
              </Link>
            </div>
          )}

          {/* Reviews list */}
          {(college.reviews ?? []).length === 0 ? (
            <p className="text-center py-8" style={{ color: 'var(--text-muted)' }}>No reviews yet. Be the first!</p>
          ) : (
            (college.reviews ?? []).map((review) => (
              <div key={review.id} className="p-5 rounded-2xl border" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{review.user?.name ?? 'Anonymous'}</p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{new Date(review.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                  </div>
                  <div className="flex items-center gap-0.5 bg-amber-50 dark:bg-amber-900/20 px-2 py-0.5 rounded-full">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span className="text-xs font-bold text-amber-600">{review.rating}</span>
                  </div>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{review.comment}</p>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'Similar' && (
        <div className="animate-fade-in">
          {(college.similar ?? []).length === 0 ? (
            <p className="text-center py-8" style={{ color: 'var(--text-muted)' }}>No similar colleges found.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {(college.similar ?? []).map((c) => (
                <CollegeCard key={c.id} college={c as any} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
