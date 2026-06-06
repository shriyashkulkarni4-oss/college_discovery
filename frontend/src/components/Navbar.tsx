import { Link, useNavigate } from 'react-router-dom';
import {
  GraduationCap,
  Search,
  BookmarkCheck,
  BarChart2,
  LogIn,
  LogOut,
  Sun,
  Moon,
  User,
  Shield,
  Menu,
  X,
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useThemeStore } from '../store/themeStore';
import { useCompareStore } from '../store/compareStore';

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { toggle, resolvedTheme } = useThemeStore();
  const compareCount = useCompareStore((s) => s.colleges.length);
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileOpen(false);
  };

  return (
    <header
      className="sticky top-0 z-50 border-b backdrop-blur-md transition-colors"
      style={{ background: 'var(--navbar-bg)', borderColor: 'var(--border-color)' }}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="p-1.5 bg-gradient-to-br from-primary-600 to-accent-500 rounded-lg group-hover:scale-105 transition-transform">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg gradient-text hidden sm:block">CollegeDiscover</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            <NavLink to="/colleges" icon={<Search className="w-4 h-4" />} label="Explore" />
            <NavLink to="/compare" icon={<BarChart2 className="w-4 h-4" />} label="Compare" badge={compareCount > 0 ? compareCount : undefined} />
            {isAuthenticated && (
              <NavLink to="/saved" icon={<BookmarkCheck className="w-4 h-4" />} label="Saved" />
            )}
            {isAdmin && (
              <NavLink to="/admin" icon={<Shield className="w-4 h-4" />} label="Admin" />
            )}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggle}
              title="Toggle theme"
              className="p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
            >
              {resolvedTheme === 'dark' ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </button>

            {isAuthenticated ? (
              <div className="hidden md:flex items-center gap-2">
                <Link
                  to="/profile"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
                >
                  <User className="w-4 h-4" />
                  <span className="max-w-24 truncate">{user?.name?.split(' ')[0]}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link
                  to="/login"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
                >
                  <LogIn className="w-4 h-4" />
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-1.5 rounded-lg text-sm font-semibold bg-primary-600 text-white hover:bg-primary-700 transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden py-3 border-t animate-fade-in" style={{ borderColor: 'var(--border-color)' }}>
            <div className="flex flex-col gap-1">
              <MobileNavLink to="/colleges" label="Explore Colleges" onClick={() => setMobileOpen(false)} />
              <MobileNavLink to="/compare" label={`Compare${compareCount > 0 ? ` (${compareCount})` : ''}`} onClick={() => setMobileOpen(false)} />
              {isAuthenticated && <MobileNavLink to="/saved" label="Saved Colleges" onClick={() => setMobileOpen(false)} />}
              {isAdmin && <MobileNavLink to="/admin" label="Admin Dashboard" onClick={() => setMobileOpen(false)} />}
              {isAuthenticated ? (
                <>
                  <MobileNavLink to="/profile" label={`Profile (${user?.name})`} onClick={() => setMobileOpen(false)} />
                  <button
                    onClick={handleLogout}
                    className="text-left px-3 py-2 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <MobileNavLink to="/login" label="Login" onClick={() => setMobileOpen(false)} />
                  <MobileNavLink to="/signup" label="Sign Up" onClick={() => setMobileOpen(false)} />
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}

function NavLink({
  to,
  icon,
  label,
  badge,
}: {
  to: string;
  icon: React.ReactNode;
  label: string;
  badge?: number;
}) {
  return (
    <Link
      to={to}
      className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
    >
      {icon}
      {label}
      {badge !== undefined && (
        <span className="absolute -top-1 -right-1 w-4 h-4 text-xs bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">
          {badge}
        </span>
      )}
    </Link>
  );
}

function MobileNavLink({
  to,
  label,
  onClick,
}: {
  to: string;
  label: string;
  onClick?: () => void;
}) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="block px-3 py-2 rounded-lg text-sm font-medium hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
    >
      {label}
    </Link>
  );
}
