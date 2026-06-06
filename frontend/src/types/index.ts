// ─── Enums ────────────────────────────────────────────────────────────────────

export type Role = 'USER' | 'ADMIN';
export type OwnershipType = 'GOVERNMENT' | 'PRIVATE';
export type NaacGrade = 'A_PLUS_PLUS' | 'A_PLUS' | 'A' | 'B_PLUS_PLUS' | 'B_PLUS' | 'B' | 'C' | 'NOT_ACCREDITED';

// ─── User ─────────────────────────────────────────────────────────────────────

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  createdAt: string;
  updatedAt?: string;
}

// ─── College ──────────────────────────────────────────────────────────────────

export interface College {
  id: string;
  name: string;
  slug: string;
  description?: string;
  state: string;
  city: string;
  fees: number;
  rating: number;
  ownershipType: OwnershipType;
  naacGrade: NaacGrade;
  establishedYear: number;
  placementAverage: number;
  placementHighest: number;
  topRecruiters?: string[];
  imageUrl?: string;
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
  courses?: Course[];
  reviews?: Review[];
  similar?: CollegeCard[];
  _count?: { reviews: number; courses: number };
}

export interface CollegeCard {
  id: string;
  name: string;
  slug: string;
  state: string;
  city: string;
  fees: number;
  rating: number;
  ownershipType: OwnershipType;
  naacGrade: NaacGrade;
  establishedYear?: number;
  placementAverage?: number;
  imageUrl?: string;
  _count?: { reviews: number; courses: number };
}

// ─── Course ───────────────────────────────────────────────────────────────────

export interface Course {
  id: string;
  collegeId: string;
  courseName: string;
  duration: string;
  fees: number;
}

// ─── Review ───────────────────────────────────────────────────────────────────

export interface Review {
  id: string;
  collegeId: string;
  userId: string;
  rating: number;
  comment: string;
  createdAt: string;
  user?: { id: string; name: string };
  college?: { id: string; name: string };
}

// ─── Saved College ────────────────────────────────────────────────────────────

export interface SavedCollege {
  id: string;
  userId: string;
  collegeId: string;
  createdAt: string;
  college: CollegeCard;
}

// ─── API Responses ────────────────────────────────────────────────────────────

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface PaginatedColleges {
  items: CollegeCard[];
  nextCursor: string | null;
  hasMore: boolean;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface DashboardStats {
  stats: {
    totalColleges: number;
    totalCourses: number;
    totalReviews: number;
    totalUsers: number;
  };
  recentColleges: CollegeCard[];
  recentReviews: Review[];
}

// ─── Filter & Query ───────────────────────────────────────────────────────────

export interface CollegeFilters {
  search?: string;
  state?: string;
  city?: string;
  minFees?: number;
  maxFees?: number;
  minRating?: number;
  ownershipType?: OwnershipType;
  naacGrade?: NaacGrade;
  minPlacement?: number;
  minYear?: number;
  maxYear?: number;
  sortBy?: 'rating' | 'fees' | 'placement' | 'newest' | 'name';
  sortOrder?: 'asc' | 'desc';
}

// ─── Naac Grade Display ───────────────────────────────────────────────────────

export const NAAC_GRADE_LABELS: Record<NaacGrade, string> = {
  A_PLUS_PLUS: 'A++',
  A_PLUS: 'A+',
  A: 'A',
  B_PLUS_PLUS: 'B++',
  B_PLUS: 'B+',
  B: 'B',
  C: 'C',
  NOT_ACCREDITED: 'N/A',
};
