import apiClient from './client';
import type { ApiResponse, College, Review } from '../types';

export async function compareColleges(ids: string[]): Promise<College[]> {
  const res = await apiClient.get<ApiResponse<College[]>>(
    `/compare?ids=${ids.join(',')}`
  );
  return res.data.data;
}

export async function createReview(data: {
  collegeId: string;
  rating: number;
  comment: string;
}): Promise<Review> {
  const res = await apiClient.post<ApiResponse<Review>>('/reviews', data);
  return res.data.data;
}

export async function deleteReview(id: string) {
  const res = await apiClient.delete<ApiResponse<null>>(`/reviews/${id}`);
  return res.data;
}

export async function getAllReviews(page: number = 1, limit: number = 20) {
  const res = await apiClient.get<ApiResponse<{
    reviews: Review[];
    total: number;
    page: number;
    limit: number;
    pages: number;
  }>>(`/reviews?page=${page}&limit=${limit}`);
  return res.data.data;
}
