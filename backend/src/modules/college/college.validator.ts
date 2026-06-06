import { z } from 'zod';

export const CreateCollegeSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters').max(200),
  description: z.string().min(50, 'Description must be at least 50 characters'),
  state: z.string().min(2),
  city: z.string().min(2),
  fees: z.number().positive('Fees must be positive'),
  rating: z.number().min(0).max(5).default(0),
  ownershipType: z.enum(['GOVERNMENT', 'PRIVATE']),
  naacGrade: z
    .enum(['A_PLUS_PLUS', 'A_PLUS', 'A', 'B_PLUS_PLUS', 'B_PLUS', 'B', 'C', 'NOT_ACCREDITED'])
    .default('NOT_ACCREDITED'),
  establishedYear: z.number().int().min(1800).max(new Date().getFullYear()),
  placementAverage: z.number().min(0).default(0),
  placementHighest: z.number().min(0).default(0),
  topRecruiters: z.array(z.string()).default([]),
  imageUrl: z.string().url().optional(),
});

export const UpdateCollegeSchema = CreateCollegeSchema.partial();

export const CollegeQuerySchema = z.object({
  search: z.string().optional(),
  state: z.string().optional(),
  city: z.string().optional(),
  minFees: z.string().optional().transform((v) => (v ? parseFloat(v) : undefined)),
  maxFees: z.string().optional().transform((v) => (v ? parseFloat(v) : undefined)),
  minRating: z.string().optional().transform((v) => (v ? parseFloat(v) : undefined)),
  ownershipType: z.enum(['GOVERNMENT', 'PRIVATE']).optional(),
  naacGrade: z
    .enum(['A_PLUS_PLUS', 'A_PLUS', 'A', 'B_PLUS_PLUS', 'B_PLUS', 'B', 'C', 'NOT_ACCREDITED'])
    .optional(),
  minPlacement: z.string().optional().transform((v) => (v ? parseFloat(v) : undefined)),
  minYear: z.string().optional().transform((v) => (v ? parseInt(v, 10) : undefined)),
  maxYear: z.string().optional().transform((v) => (v ? parseInt(v, 10) : undefined)),
  sortBy: z
    .enum(['rating', 'fees', 'placement', 'newest', 'name'])
    .optional()
    .default('rating'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
  cursor: z.string().optional(),
  limit: z.string().optional().transform((v) => (v ? parseInt(v, 10) : 12)),
});

export type CreateCollegeInput = z.infer<typeof CreateCollegeSchema>;
export type UpdateCollegeInput = z.infer<typeof UpdateCollegeSchema>;
export type CollegeQueryInput = z.infer<typeof CollegeQuerySchema>;
