import apiClient from './client';
import type { ApiResponse, AuthResponse, User } from '../types';

export async function signup(data: { name: string; email: string; password: string }) {
  const res = await apiClient.post<ApiResponse<AuthResponse>>('/auth/signup', data);
  return res.data.data;
}

export async function login(data: { email: string; password: string }) {
  const res = await apiClient.post<ApiResponse<AuthResponse>>('/auth/login', data);
  return res.data.data;
}

export async function refresh(refreshToken: string) {
  const res = await apiClient.post<ApiResponse<{ accessToken: string; refreshToken: string }>>(
    '/auth/refresh',
    { refreshToken }
  );
  return res.data.data;
}

export async function getMe() {
  const res = await apiClient.get<ApiResponse<User>>('/auth/me');
  return res.data.data;
}
