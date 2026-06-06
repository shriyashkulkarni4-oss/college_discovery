import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  GraduationCap,
  MessageSquare,
  Users,
  ChevronLeft,
} from 'lucide-react';

const NAV_ITEMS = [
  { to: '/admin', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" />, end: true },
  { to: '/admin/colleges', label: 'Colleges', icon: <GraduationCap className="w-4 h-4" />, end: false },
  { to: '/admin/reviews', label: 'Reviews', icon: <MessageSquare className="w-4 h-4" />, end: false },
  { to: '/admin/users', label: 'Users', icon: <Users className="w-4 h-4" />, end: false },
];

export default function AdminSidebar() {
  return (
    <aside
      className="w-56 flex-shrink-0 min-h-screen border-r"
      style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
    >
      <div className="p-4 border-b" style={{ borderColor: 'var(--border-color)' }}>
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-gradient-to-br from-primary-600 to-accent-500 rounded-lg">
            <GraduationCap className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-bold gradient-text">Admin Panel</p>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>CollegeDiscover</p>
          </div>
        </div>
      </div>

      <nav className="p-3 space-y-1">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'hover:bg-surface-100 dark:hover:bg-surface-800'
              }`
            }
            style={({ isActive }) => (isActive ? {} : { color: 'var(--text-secondary)' })}
          >
            {item.icon}
            {item.label}
          </NavLink>
        ))}

        <div className="pt-4 mt-4 border-t" style={{ borderColor: 'var(--border-color)' }}>
          <NavLink
            to="/"
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors hover:bg-surface-100 dark:hover:bg-surface-800"
            style={{ color: 'var(--text-muted)' }}
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Site
          </NavLink>
        </div>
      </nav>
    </aside>
  );
}
