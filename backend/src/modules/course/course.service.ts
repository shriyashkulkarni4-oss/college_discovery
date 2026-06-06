import { prisma } from '../../config/database';
import { AppError } from '../../utils/response';
import { CreateCourseInput, UpdateCourseInput } from './course.validator';

export async function createCourse(data: CreateCourseInput) {
  const college = await prisma.college.findFirst({
    where: { id: data.collegeId, isDeleted: false },
  });
  if (!college) throw new AppError('College not found', 404);

  return prisma.course.create({ data });
}

export async function updateCourse(id: string, data: UpdateCourseInput) {
  const course = await prisma.course.findUnique({ where: { id } });
  if (!course) throw new AppError('Course not found', 404);

  return prisma.course.update({ where: { id }, data });
}

export async function deleteCourse(id: string) {
  const course = await prisma.course.findUnique({ where: { id } });
  if (!course) throw new AppError('Course not found', 404);

  return prisma.course.delete({ where: { id } });
}

export async function getCoursesByCollege(collegeId: string) {
  return prisma.course.findMany({
    where: { collegeId },
    orderBy: { courseName: 'asc' },
  });
}
