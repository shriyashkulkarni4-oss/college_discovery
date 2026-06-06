import { SearchX } from 'lucide-react';

interface Props {
  title?: string;
  description?: string;
  action?: React.ReactNode;
}

export default function EmptyState({
  title = 'Nothing here yet',
  description = 'No results found.',
  action,
}: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center px-4">
      <div className="p-4 bg-surface-100 dark:bg-surface-800 rounded-full mb-4">
        <SearchX className="w-8 h-8" style={{ color: 'var(--text-muted)' }} />
      </div>
      <h3 className="font-semibold text-lg mb-1" style={{ color: 'var(--text-primary)' }}>
        {title}
      </h3>
      <p className="text-sm mb-5 max-w-sm" style={{ color: 'var(--text-secondary)' }}>
        {description}
      </p>
      {action}
    </div>
  );
}
