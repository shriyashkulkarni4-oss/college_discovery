import { useAuthStore } from '../store/authStore';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Shield, Calendar, LogOut, Bookmark, Star } from 'lucide-react';

export default function Profile() {
  const user = useAuthStore((s) => s.user);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) return null;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      {/* Profile Card */}
      <div className="rounded-3xl border overflow-hidden shadow-sm mb-6" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
        {/* Header */}
        <div className="h-32 bg-gradient-to-br from-primary-600 to-accent-600 relative">
          <div className="absolute -bottom-10 left-6">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-400 to-accent-400 flex items-center justify-center border-4 border-white dark:border-surface-900 shadow-lg">
              <span className="text-2xl font-extrabold text-white">
                {user.name.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        <div className="pt-14 pb-6 px-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-xl font-extrabold" style={{ color: 'var(--text-primary)' }}>{user.name}</h1>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{user.email}</p>
              <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-bold ${
                user.role === 'ADMIN'
                  ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
                  : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
              }`}>
                {user.role}
              </span>
            </div>
            <button onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              style={{ borderColor: 'var(--border-color)' }}>
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>

          <div className="space-y-3">
            {[
              { icon: <Mail className="w-4 h-4" />, label: 'Email', value: user.email },
              { icon: <Shield className="w-4 h-4" />, label: 'Role', value: user.role },
              { icon: <Calendar className="w-4 h-4" />, label: 'Member since', value: new Date(user.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long' }) },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3 text-sm">
                <div className="text-primary-600">{item.icon}</div>
                <span style={{ color: 'var(--text-muted)' }}>{item.label}:</span>
                <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-2 gap-4">
        {[
          { label: 'Saved Colleges', icon: <Bookmark className="w-5 h-5" />, to: '/saved', color: 'from-blue-500 to-blue-600' },
          { label: 'Browse Colleges', icon: <Star className="w-5 h-5" />, to: '/colleges', color: 'from-purple-500 to-purple-600' },
        ].map((item) => (
          <button
            key={item.label}
            onClick={() => navigate(item.to)}
            className={`flex items-center gap-3 p-5 rounded-2xl bg-gradient-to-br ${item.color} text-white font-semibold hover:opacity-90 transition-all hover:-translate-y-0.5 shadow-lg`}
          >
            {item.icon} {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}
