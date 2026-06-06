export default function CollegeSkeleton() {
  return (
    <div
      className="rounded-2xl overflow-hidden border animate-pulse"
      style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
    >
      {/* Image placeholder */}
      <div className="h-44 bg-surface-200 dark:bg-surface-800" />

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Title */}
        <div className="space-y-1.5">
          <div className="h-4 bg-surface-200 dark:bg-surface-800 rounded-md w-4/5" />
          <div className="h-4 bg-surface-200 dark:bg-surface-800 rounded-md w-3/5" />
        </div>

        {/* Location */}
        <div className="h-3 bg-surface-200 dark:bg-surface-800 rounded-md w-2/5" />

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 pt-3 border-t" style={{ borderColor: 'var(--border-color)' }}>
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <div className="h-3 w-3 bg-surface-200 dark:bg-surface-800 rounded" />
              <div className="h-3 bg-surface-200 dark:bg-surface-800 rounded w-12" />
              <div className="h-2.5 bg-surface-200 dark:bg-surface-800 rounded w-8" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
