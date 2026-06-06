import { prisma } from '../../config/database';

export async function getDashboardStats() {
  const [totalColleges, totalCourses, totalReviews, totalUsers] = await Promise.all([
    prisma.college.count({ where: { isDeleted: false } }),
    prisma.course.count(),
    prisma.review.count(),
    prisma.user.count({ where: { role: 'USER' } }),
  ]);

  const recentColleges = await prisma.college.findMany({
    where: { isDeleted: false },
    orderBy: { createdAt: 'desc' },
    take: 5,
    select: { id: true, name: true, city: true, state: true, rating: true, createdAt: true },
  });

  const recentReviews = await prisma.review.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5,
    include: {
      user: { select: { name: true } },
      college: { select: { name: true } },
    },
  });

  return {
    stats: { totalColleges, totalCourses, totalReviews, totalUsers },
    recentColleges,
    recentReviews,
  };
}

export async function getAllUsers(page: number = 1, limit: number = 20) {
  const skip = (page - 1) * limit;
  const [users, total] = await Promise.all([
    prisma.user.findMany({
      select: {
        id: true, name: true, email: true, role: true, createdAt: true,
        _count: { select: { reviews: true, savedColleges: true } },
      },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.user.count(),
  ]);

  return { users, total, page, limit };
}
