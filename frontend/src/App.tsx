import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useThemeStore } from './store/themeStore';

// Layouts
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';

// Guards
import ProtectedRoute from './routes/ProtectedRoute';
import AdminRoute from './routes/AdminRoute';

// Pages
import Home from './pages/Home';
import Colleges from './pages/Colleges';
import CollegeDetail from './pages/CollegeDetail';
import Compare from './pages/Compare';
import Saved from './pages/Saved';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import CollegeManagement from './pages/admin/CollegeManagement';
import ReviewManagement from './pages/admin/ReviewManagement';
import UserManagement from './pages/admin/UserManagement';

export default function App() {
  // Initialize theme on mount
  const { theme, setTheme } = useThemeStore();
  useEffect(() => {
    setTheme(theme);
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* Main layout */}
        <Route element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="colleges" element={<Colleges />} />
          <Route path="college/:id" element={<CollegeDetail />} />
          <Route path="compare" element={<Compare />} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />

          {/* Protected */}
          <Route
            path="saved"
            element={
              <ProtectedRoute>
                <Saved />
              </ProtectedRoute>
            }
          />
          <Route
            path="profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Admin layout */}
        <Route
          path="admin"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="colleges" element={<CollegeManagement />} />
          <Route path="reviews" element={<ReviewManagement />} />
          <Route path="users" element={<UserManagement />} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
