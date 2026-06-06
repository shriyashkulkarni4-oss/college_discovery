import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../store/authStore';
import * as authApi from '../api/auth';

export function useAuth() {
  const store = useAuthStore();
  const queryClient = useQueryClient();

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      store.setAuth(data.user, data.accessToken, data.refreshToken);
    },
  });

  const signupMutation = useMutation({
    mutationFn: authApi.signup,
    onSuccess: (data) => {
      store.setAuth(data.user, data.accessToken, data.refreshToken);
    },
  });

  const logout = () => {
    store.logout();
    queryClient.clear();
  };

  return {
    user: store.user,
    isAuthenticated: store.isAuthenticated,
    isAdmin: store.user?.role === 'ADMIN',
    login: loginMutation,
    signup: signupMutation,
    logout,
  };
}
