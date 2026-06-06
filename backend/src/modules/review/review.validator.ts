import { z } from 'zod';

export const CreateReviewSchema = z.object({
  collegeId: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  comment: z.string().min(10, 'Review must be at least 10 characters').max(2000),
});

export type CreateReviewInput = z.infer<typeof CreateReviewSchema>;
