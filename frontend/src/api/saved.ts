import apiClient from './client';
import type { ApiResponse, SavedCollege } from '../types';

export async function getSavedColleges(): Promise<SavedCollege[]> {
  const res = await apiClient.get<ApiResponse<SavedCollege[]>>('/saved');
  return res.data.data;
}

export async function getSavedIds(): Promise<string[]> {
  const res = await apiClient.get<ApiResponse<string[]>>('/saved/ids');
  return res.data.data;
}

export async function saveCollege(collegeId: string): Promise<SavedCollege> {
  const res = await apiClient.post<ApiResponse<SavedCollege>>(`/saved/${collegeId}`);
  return res.data.data;
}

export async function unsaveCollege(collegeId: string): Promise<void> {
  await apiClient.delete(`/saved/${collegeId}`);
}
