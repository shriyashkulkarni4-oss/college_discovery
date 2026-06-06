import { Link } from 'react-router-dom';
import { MapPin, Star, TrendingUp, Trash2, X } from 'lucide-react';
import type { College } from '../types';
import { NAAC_GRADE_LABELS } from '../types';
import { useCompareStore } from '../store/compareStore';

interface Props {
  colleges: College[];
}

function formatCurrency(val: number): string {
  if (val >= 100000) return `₹${(val / 100000).toFixed(1)}L`;
  return `₹${val.toLocaleString('en-IN')}`;
}

type Row = {
  label: string;
  key: string;
  render: (college: College) => React.ReactNode;
};

const ROWS: Row[] = [
  {
    label: 'Location',
    key: 'location',
    render: (c) => (
      <span className="flex items-center gap-1">
        <MapPin className="w-3.5 h-3.5" />
        {c.city}, {c.state}
      </span>
    ),
  },
  {
    label: 'Ownership',
    key: 'ownership',
    render: (c) => (
      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${
        c.ownershipType === 'GOVERNMENT'
          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
          : 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
      }`}>
        {c.ownershipType === 'GOVERNMENT' ? 'Government' : 'Private'}
      </span>
    ),
  },
  {
    label: 'NAAC Grade',
    key: 'naac',
    render: (c) => (
      <span className="font-bold text-primary-600">{NAAC_GRADE_LABELS[c.naacGrade]}</span>
    ),
  },
  {
    label: 'Rating',
    key: 'rating',
    render: (c) => (
      <span className="flex items-center gap-1 font-semibold">
        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
        {c.rating.toFixed(1)} / 5
      </span>
    ),
  },
  {
    label: 'Annual Fees',
    key: 'fees',
    render: (c) => <span className="font-semibold">{formatCurrency(c.fees)}</span>,
  },
  {
    label: 'Established',
    key: 'established',
    render: (c) => c.establishedYear,
  },
  {
    label: 'Avg Package',
    key: 'avgPkg',
    render: (c) => (
      <span className="flex items-center gap-1 font-semibold text-emerald-600">
        <TrendingUp className="w-3.5 h-3.5" />
        {formatCurrency(c.placementAverage)}
      </span>
    ),
  },
  {
    label: 'Highest Package',
    key: 'highPkg',
    render: (c) => <span className="font-semibold">{formatCurrency(c.placementHighest)}</span>,
  },
  {
    label: 'Top Recruiters',
    key: 'recruiters',
    render: (c) => (
      <div className="flex flex-wrap gap-1">
        {(c.topRecruiters ?? []).slice(0, 3).map((r) => (
          <span key={r} className="text-xs bg-surface-100 dark:bg-surface-800 px-1.5 py-0.5 rounded">
            {r}
          </span>
        ))}
        {(c.topRecruiters ?? []).length > 3 && (
          <span className="text-xs text-surface-500">+{(c.topRecruiters ?? []).length - 3}</span>
        )}
      </div>
    ),
  },
  {
    label: 'Courses',
    key: 'courses',
    render: (c) => (
      <div className="space-y-0.5">
        {(c.courses ?? []).slice(0, 3).map((course) => (
          <div key={course.id} className="text-xs truncate max-w-48">{course.courseName}</div>
        ))}
        {(c.courses ?? []).length > 3 && (
          <span className="text-xs text-surface-500">+{(c.courses ?? []).length - 3} more</span>
        )}
      </div>
    ),
  },
];

export default function CompareTable({ colleges }: Props) {
  const { removeCollege } = useCompareStore();

  return (
    <div className="overflow-x-auto rounded-2xl border" style={{ borderColor: 'var(--border-color)' }}>
      <table className="w-full min-w-[600px]">
        <thead>
          <tr style={{ background: 'var(--bg-card)' }}>
            <th className="p-4 text-left text-sm font-semibold" style={{ color: 'var(--text-muted)' }}>
              Feature
            </th>
            {colleges.map((college) => (
              <th key={college.id} className="p-4 text-center" style={{ borderLeft: '1px solid var(--border-color)' }}>
                <div className="relative">
                  <button
                    onClick={() => removeCollege(college.id)}
                    className="absolute -top-1 -right-1 p-0.5 rounded-full bg-red-100 text-red-500 hover:bg-red-200 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                  {college.imageUrl && (
                    <img
                      src={college.imageUrl}
                      alt={college.name}
                      className="w-16 h-12 object-cover rounded-lg mx-auto mb-2"
                    />
                  )}
                  <Link
                    to={`/college/${college.id}`}
                    className="text-sm font-semibold hover:text-primary-600 transition-colors line-clamp-2"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {college.name}
                  </Link>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {ROWS.map((row, idx) => (
            <tr
              key={row.key}
              className="transition-colors hover:bg-surface-50 dark:hover:bg-surface-900"
              style={{
                background: idx % 2 === 0 ? 'transparent' : 'rgba(0,0,0,0.01)',
                borderTop: '1px solid var(--border-color)',
              }}
            >
              <td className="p-4 text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                {row.label}
              </td>
              {colleges.map((college) => (
                <td
                  key={college.id}
                  className="p-4 text-sm text-center"
                  style={{
                    borderLeft: '1px solid var(--border-color)',
                    color: 'var(--text-primary)',
                  }}
                >
                  {row.render(college)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
