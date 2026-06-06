import apiClient from './client';
import type {
  ApiResponse,
  College,
  CollegeFilters,
  PaginatedColleges,
  Course,
} from '../types';

export async function getColleges(
  filters: CollegeFilters & { cursor?: string; limit?: number }
): Promise<PaginatedColleges> {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.set(key, String(value));
    }
  });
  const res = await apiClient.get<ApiResponse<PaginatedColleges>>(
    `/colleges?${params.toString()}`
  );
  return res.data.data;
}

export async function getCollegeById(id: string): Promise<College> {
  const res = await apiClient.get<ApiResponse<College>>(`/colleges/${id}`);
  return res.data.data;
}

export async function getStates(): Promise<string[]> {
  const res = await apiClient.get<ApiResponse<string[]>>('/colleges/states');
  return res.data.data;
}

export async function getCities(state?: string): Promise<string[]> {
  const params = state ? `?state=${encodeURIComponent(state)}` : '';
  const res = await apiClient.get<ApiResponse<string[]>>(`/colleges/cities${params}`);
  return res.data.data;
}

export async function createCollege(data: Partial<College>) {
  const res = await apiClient.post<ApiResponse<College>>('/colleges', data);
  return res.data.data;
}

export async function updateCollege(id: string, data: Partial<College>) {
  const res = await apiClient.put<ApiResponse<College>>(`/colleges/${id}`, data);
  return res.data.data;
}

export async function deleteCollege(id: string) {
  const res = await apiClient.delete<ApiResponse<null>>(`/colleges/${id}`);
  return res.data;
}

export async function createCourse(data: {
  collegeId: string;
  courseName: string;
  duration: string;
  fees: number;
}): Promise<Course> {
  const res = await apiClient.post<ApiResponse<Course>>('/courses', data);
  return res.data.data;
}

export async function updateCourse(
  id: string,
  data: { courseName?: string; duration?: string; fees?: number }
): Promise<Course> {
  const res = await apiClient.put<ApiResponse<Course>>(`/courses/${id}`, data);
  return res.data.data;
}

export async function deleteCourse(id: string) {
  const res = await apiClient.delete<ApiResponse<null>>(`/courses/${id}`);
  return res.data;
}
