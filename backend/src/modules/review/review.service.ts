import { prisma } from '../../config/database';
import { AppError } from '../../utils/response';
import { CreateReviewInput } from './review.validator';

export async function createReview(userId: string, data: CreateReviewInput) {
  const college = await prisma.college.findFirst({
    where: { id: data.collegeId, isDeleted: false },
  });
  if (!college) throw new AppError('College not found', 404);

  const existing = await prisma.review.findFirst({
    where: { userId, collegeId: data.collegeId },
  });
  if (existing) throw new AppError('You have already reviewed this college', 409);

  const review = await prisma.review.create({
    data: { ...data, userId },
    include: {
      user: { select: { id: true, name: true } },
    },
  });

  // Update college rating
  const reviews = await prisma.review.findMany({
    where: { collegeId: data.collegeId },
    select: { rating: true },
  });
  const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

  await prisma.college.update({
    where: { id: data.collegeId },
    data: { rating: Math.round(avgRating * 10) / 10 },
  });

  return review;
}

export async function getReviewsByCollege(
  collegeId: string,
  page: number = 1,
  limit: number = 10
) {
  const skip = (page - 1) * limit;
  const [reviews, total] = await Promise.all([
    prisma.review.findMany({
      where: { collegeId },
      include: { user: { select: { id: true, name: true } } },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.review.count({ where: { collegeId } }),
  ]);

  return { reviews, total, page, limit, pages: Math.ceil(total / limit) };
}

export async function getAllReviews(page: number = 1, limit: number = 20) {
  const skip = (page - 1) * limit;
  const [reviews, total] = await Promise.all([
    prisma.review.findMany({
      include: {
        user: { select: { id: true, name: true } },
        college: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.review.count(),
  ]);

  return { reviews, total, page, limit, pages: Math.ceil(total / limit) };
}

export async function deleteReview(id: string) {
  const review = await prisma.review.findUnique({ where: { id } });
  if (!review) throw new AppError('Review not found', 404);

  await prisma.review.delete({ where: { id } });

  // Recalculate rating
  const reviews = await prisma.review.findMany({
    where: { collegeId: review.collegeId },
    select: { rating: true },
  });

  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  await prisma.college.update({
    where: { id: review.collegeId },
    data: { rating: Math.round(avgRating * 10) / 10 },
  });

  return true;
}
