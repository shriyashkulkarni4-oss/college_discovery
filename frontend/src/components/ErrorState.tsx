import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  title?: string;
  description?: string;
  onRetry?: () => void;
}

export default function ErrorState({
  title = 'Something went wrong',
  description = 'An error occurred while loading the data.',
  onRetry,
}: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center px-4">
      <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-full mb-4">
        <AlertTriangle className="w-8 h-8 text-red-500" />
      </div>
      <h3 className="font-semibold text-lg mb-1" style={{ color: 'var(--text-primary)' }}>
        {title}
      </h3>
      <p className="text-sm mb-5 max-w-sm" style={{ color: 'var(--text-secondary)' }}>
        {description}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Try Again
        </button>
      )}
    </div>
  );
}
