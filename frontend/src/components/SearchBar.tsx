import { Search, X } from 'lucide-react';
import { useState } from 'react';
import { useDebounce } from '../hooks/useDebounce';
import { useNavigate } from 'react-router-dom';

interface Props {
  value?: string;
  onChange?: (val: string) => void;
  placeholder?: string;
  autoNavigate?: boolean;
  size?: 'sm' | 'lg';
}

export default function SearchBar({
  value,
  onChange,
  placeholder = 'Search colleges, cities, states, or courses...',
  autoNavigate = false,
  size = 'sm',
}: Props) {
  const [localValue, setLocalValue] = useState(value ?? '');
  const navigate = useNavigate();

  const handleChange = (val: string) => {
    setLocalValue(val);
    onChange?.(val);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (autoNavigate) {
      navigate(`/colleges?search=${encodeURIComponent(localValue)}`);
    }
  };

  const isLarge = size === 'lg';

  return (
    <form onSubmit={handleSubmit} className="relative w-full">
      <div className="relative">
        <Search
          className={`absolute left-4 top-1/2 -translate-y-1/2 ${
            isLarge ? 'w-5 h-5' : 'w-4 h-4'
          } text-surface-400`}
        />
        <input
          type="text"
          value={onChange ? (value ?? '') : localValue}
          onChange={(e) => handleChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full ${
            isLarge ? 'pl-12 pr-12 py-4 text-base rounded-2xl' : 'pl-10 pr-10 py-2.5 text-sm rounded-xl'
          } border focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all`}
          style={{
            background: 'var(--bg-card)',
            borderColor: 'var(--border-color)',
            color: 'var(--text-primary)',
          }}
        />
        {(onChange ? value : localValue) && (
          <button
            type="button"
            onClick={() => handleChange('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 hover:text-primary-600 transition-colors"
          >
            <X className={isLarge ? 'w-5 h-5' : 'w-4 h-4'} style={{ color: 'var(--text-muted)' }} />
          </button>
        )}
      </div>
    </form>
  );
}
