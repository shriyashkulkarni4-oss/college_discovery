import apiClient from './client';
import type { ApiResponse, DashboardStats, User } from '../types';

export async function getDashboardStats(): Promise<DashboardStats> {
  const res = await apiClient.get<ApiResponse<DashboardStats>>('/admin/stats');
  return res.data.data;
}

export async function getAllUsers(page: number = 1, limit: number = 20): Promise<{
  users: User[];
  total: number;
  page: number;
  limit: number;
}> {
  const res = await apiClient.get<ApiResponse<{
    users: User[];
    total: number;
    page: number;
    limit: number;
  }>>(`/admin/users?page=${page}&limit=${limit}`);
  return res.data.data;
}
