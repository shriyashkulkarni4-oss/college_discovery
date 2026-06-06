import { Link, useNavigate } from 'react-router-dom';
import {
  MapPin,
  Star,
  BookOpen,
  TrendingUp,
  Bookmark,
  BookmarkCheck,
  BarChart2,
  Building2,
} from 'lucide-react';
import type { CollegeCard as CollegeCardType } from '../types';
import { NAAC_GRADE_LABELS } from '../types';
import { useAuth } from '../hooks/useAuth';
import { useSaved } from '../hooks/useSaved';
import { useCompareStore } from '../store/compareStore';

interface Props {
  college: CollegeCardType;
}

function formatFees(fees: number): string {
  if (fees >= 100000) return `₹${(fees / 100000).toFixed(1)}L/yr`;
  return `₹${fees.toLocaleString('en-IN')}/yr`;
}

function formatPackage(pkg: number): string {
  if (pkg >= 100000) return `₹${(pkg / 100000).toFixed(1)}L`;
  return `₹${pkg.toLocaleString('en-IN')}`;
}

export default function CollegeCard({ college }: Props) {
  const { isAuthenticated } = useAuth();
  const { isSaved, toggleSave, isSaving } = useSaved();
  const { addCollege, removeCollege, isInCompare } = useCompareStore();
  const navigate = useNavigate();

  const saved = isSaved(college.id);
  const inCompare = isInCompare(college.id);

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    toggleSave(college.id);
  };

  const handleCompare = (e: React.MouseEvent) => {
    e.preventDefault();
    if (inCompare) {
      removeCollege(college.id);
    } else {
      const added = addCollege(college);
      if (!added) {
        alert('You can compare up to 3 colleges. Remove one first.');
      }
    }
  };

  const naacLabel = NAAC_GRADE_LABELS[college.naacGrade];
  const naacColor = college.naacGrade === 'A_PLUS_PLUS'
    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
    : college.naacGrade === 'A_PLUS' || college.naacGrade === 'A'
    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
    : 'bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-400';

  return (
    <Link
      to={`/college/${college.id}`}
      className="group block rounded-2xl overflow-hidden border transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5"
      style={{
        background: 'var(--bg-card)',
        borderColor: 'var(--border-color)',
      }}
    >
      {/* Image */}
      <div className="relative h-44 overflow-hidden bg-gradient-to-br from-primary-100 to-accent-100 dark:from-primary-950 dark:to-accent-950">
        {college.imageUrl ? (
          <img
            src={college.imageUrl}
            alt={college.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Building2 className="w-16 h-16 text-primary-300" />
          </div>
        )}

        {/* Overlay badges */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

        <div className="absolute top-3 left-3 flex gap-2">
          <span
            className={`text-xs font-bold px-2 py-0.5 rounded-full ${naacColor}`}
          >
            NAAC {naacLabel}
          </span>
          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-white/90 dark:bg-black/60 text-surface-700 dark:text-surface-200">
            {college.ownershipType === 'GOVERNMENT' ? 'Govt' : 'Private'}
          </span>
        </div>

        {/* Action buttons */}
        <div className="absolute top-3 right-3 flex gap-1.5">
          <button
            onClick={handleSave}
            disabled={isSaving}
            title={saved ? 'Remove from saved' : 'Save college'}
            className="p-1.5 rounded-full bg-white/90 dark:bg-black/60 hover:scale-110 transition-transform shadow"
          >
            {saved ? (
              <BookmarkCheck className="w-4 h-4 text-primary-600" />
            ) : (
              <Bookmark className="w-4 h-4 text-surface-600" />
            )}
          </button>
          <button
            onClick={handleCompare}
            title={inCompare ? 'Remove from compare' : 'Add to compare'}
            className={`p-1.5 rounded-full bg-white/90 dark:bg-black/60 hover:scale-110 transition-transform shadow ${
              inCompare ? 'ring-2 ring-primary-500' : ''
            }`}
          >
            <BarChart2 className={`w-4 h-4 ${inCompare ? 'text-primary-600' : 'text-surface-600'}`} />
          </button>
        </div>

        {/* Rating badge at bottom */}
        <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-amber-500 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow">
          <Star className="w-3 h-3 fill-current" />
          {college.rating.toFixed(1)}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3
          className="font-semibold text-base line-clamp-2 group-hover:text-primary-600 transition-colors mb-1.5"
          style={{ color: 'var(--text-primary)' }}
        >
          {college.name}
        </h3>

        <div className="flex items-center gap-1 text-xs mb-3" style={{ color: 'var(--text-secondary)' }}>
          <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
          <span>
            {college.city}, {college.state}
          </span>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-2 pt-3 border-t" style={{ borderColor: 'var(--border-color)' }}>
          <Stat
            icon={<BookOpen className="w-3.5 h-3.5" />}
            label="Fees"
            value={formatFees(college.fees)}
          />
          <Stat
            icon={<TrendingUp className="w-3.5 h-3.5" />}
            label="Avg Pkg"
            value={college.placementAverage ? formatPackage(college.placementAverage) : 'N/A'}
          />
          <Stat
            icon={<Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />}
            label="Rating"
            value={`${college.rating.toFixed(1)}/5`}
          />
        </div>
      </div>
    </Link>
  );
}

function Stat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex flex-col items-center text-center gap-0.5">
      <div className="flex items-center gap-0.5 text-primary-600" style={{ color: 'var(--text-muted)' }}>
        {icon}
      </div>
      <span className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>
        {value}
      </span>
      <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
        {label}
      </span>
    </div>
  );
}
