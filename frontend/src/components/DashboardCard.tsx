import { TrendingUp, LucideIcon } from 'lucide-react';

interface Props {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color?: 'blue' | 'purple' | 'green' | 'amber';
  subtitle?: string;
}

const COLOR_MAP = {
  blue: 'from-blue-500 to-blue-600',
  purple: 'from-purple-500 to-purple-600',
  green: 'from-emerald-500 to-emerald-600',
  amber: 'from-amber-500 to-amber-600',
};

export default function DashboardCard({ title, value, icon, color = 'blue', subtitle }: Props) {
  return (
    <div
      className="rounded-2xl p-5 border relative overflow-hidden transition-all hover:shadow-lg hover:-translate-y-0.5"
      style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
    >
      {/* Background gradient accent */}
      <div
        className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${COLOR_MAP[color]} opacity-10 rounded-bl-full`}
      />

      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>
            {title}
          </p>
          <p className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
            {typeof value === 'number' ? value.toLocaleString('en-IN') : value}
          </p>
          {subtitle && (
            <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
              {subtitle}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-xl bg-gradient-to-br ${COLOR_MAP[color]}`}>
          <div className="text-white">{icon}</div>
        </div>
      </div>
    </div>
  );
}
