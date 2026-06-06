import { Link } from 'react-router-dom';
import { GraduationCap, Code2, MessageSquare, Briefcase } from 'lucide-react';

export default function Footer() {
  return (
    <footer
      className="border-t mt-auto py-12"
      style={{ borderColor: 'var(--border-color)', background: 'var(--bg-card)' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="p-1.5 bg-gradient-to-br from-primary-600 to-accent-500 rounded-lg">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-lg gradient-text">CollegeDiscover</span>
            </Link>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              India's premier college discovery platform helping students make informed decisions.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-sm mb-3">Explore</h4>
            <div className="flex flex-col gap-2">
              {['IITs', 'NITs', 'BITS & Private', 'Engineering Colleges', 'By State'].map((l) => (
                <Link key={l} to="/colleges" className="text-sm hover:text-primary-600 transition-colors" style={{ color: 'var(--text-secondary)' }}>
                  {l}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-3">Platform</h4>
            <div className="flex flex-col gap-2">
              {[
                { label: 'Compare Colleges', to: '/compare' },
                { label: 'Saved Colleges', to: '/saved' },
                { label: 'Login', to: '/login' },
                { label: 'Sign Up', to: '/signup' },
              ].map((l) => (
                <Link key={l.label} to={l.to} className="text-sm hover:text-primary-600 transition-colors" style={{ color: 'var(--text-secondary)' }}>
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-3">Connect</h4>
            <div className="flex gap-3">
              {[
                { icon: <Code2 className="w-4 h-4" />, label: 'GitHub' },
                { icon: <MessageSquare className="w-4 h-4" />, label: 'Twitter' },
                { icon: <Briefcase className="w-4 h-4" />, label: 'LinkedIn' },
              ].map((s) => (
                <button
                  key={s.label}
                  title={s.label}
                  className="p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {s.icon}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div
          className="mt-8 pt-6 border-t flex flex-col sm:flex-row justify-between items-center gap-2"
          style={{ borderColor: 'var(--border-color)' }}
        >
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            © 2025 CollegeDiscover. All rights reserved.
          </p>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            Data for informational purposes only.
          </p>
        </div>
      </div>
    </footer>
  );
}
