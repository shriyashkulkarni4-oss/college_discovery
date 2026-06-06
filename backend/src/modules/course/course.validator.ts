import { z } from 'zod';

export const CreateCourseSchema = z.object({
  collegeId: z.string().min(1),
  courseName: z.string().min(2).max(200),
  duration: z.string().min(1).max(50),
  fees: z.number().positive(),
});

export const UpdateCourseSchema = CreateCourseSchema.omit({ collegeId: true }).partial();

export type CreateCourseInput = z.infer<typeof CreateCourseSchema>;
export type UpdateCourseInput = z.infer<typeof UpdateCourseSchema>;
