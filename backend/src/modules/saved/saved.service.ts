import { prisma } from '../../config/database';
import { AppError } from '../../utils/response';

export async function saveCollege(userId: string, collegeId: string) {
  const college = await prisma.college.findFirst({
    where: { id: collegeId, isDeleted: false },
  });
  if (!college) throw new AppError('College not found', 404);

  const existing = await prisma.savedCollege.findFirst({
    where: { userId, collegeId },
  });
  if (existing) throw new AppError('College already saved', 409);

  return prisma.savedCollege.create({
    data: { userId, collegeId },
    include: {
      college: {
        select: {
          id: true, name: true, slug: true, state: true, city: true,
          fees: true, rating: true, ownershipType: true, naacGrade: true, imageUrl: true,
        },
      },
    },
  });
}

export async function unsaveCollege(userId: string, collegeId: string) {
  const saved = await prisma.savedCollege.findFirst({ where: { userId, collegeId } });
  if (!saved) throw new AppError('College not saved', 404);

  return prisma.savedCollege.delete({ where: { id: saved.id } });
}

export async function getSavedColleges(userId: string) {
  const saved = await prisma.savedCollege.findMany({
    where: { userId },
    include: {
      college: {
        select: {
          id: true, name: true, slug: true, state: true, city: true,
          fees: true, rating: true, ownershipType: true, naacGrade: true,
          establishedYear: true, placementAverage: true, imageUrl: true,
          _count: { select: { reviews: true } },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return saved;
}

export async function getSavedCollegeIds(userId: string): Promise<string[]> {
  const saved = await prisma.savedCollege.findMany({
    where: { userId },
    select: { collegeId: true },
  });
  return saved.map((s) => s.collegeId);
}
