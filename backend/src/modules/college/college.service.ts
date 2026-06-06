import { Prisma } from '@prisma/client';
import { prisma } from '../../config/database';
import { AppError } from '../../utils/response';
import { CreateCollegeInput, UpdateCollegeInput, CollegeQueryInput } from './college.validator';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

async function generateUniqueSlug(name: string, excludeId?: string): Promise<string> {
  const base = slugify(name);
  let slug = base;
  let counter = 1;

  while (true) {
    const existing = await prisma.college.findFirst({
      where: { slug, id: excludeId ? { not: excludeId } : undefined },
    });
    if (!existing) break;
    slug = `${base}-${counter++}`;
  }

  return slug;
}

export async function getColleges(query: CollegeQueryInput) {
  const {
    search,
    state,
    city,
    minFees,
    maxFees,
    minRating,
    ownershipType,
    naacGrade,
    minPlacement,
    minYear,
    maxYear,
    sortBy,
    sortOrder,
    cursor,
    limit,
  } = query;

  const pageSize = Math.min(limit ?? 12, 50);

  // Build where clause
  const where: Prisma.CollegeWhereInput = {
    isDeleted: false,
  };

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { city: { contains: search, mode: 'insensitive' } },
      { state: { contains: search, mode: 'insensitive' } },
      { courses: { some: { courseName: { contains: search, mode: 'insensitive' } } } },
    ];
  }

  if (state) where.state = { equals: state, mode: 'insensitive' };
  if (city) where.city = { equals: city, mode: 'insensitive' };
  if (ownershipType) where.ownershipType = ownershipType;
  if (naacGrade) where.naacGrade = naacGrade;

  if (minFees !== undefined || maxFees !== undefined) {
    where.fees = {};
    if (minFees !== undefined) where.fees = { ...where.fees as object, gte: minFees };
    if (maxFees !== undefined) where.fees = { ...where.fees as object, lte: maxFees };
  }

  if (minRating !== undefined) {
    where.rating = { gte: minRating };
  }

  if (minPlacement !== undefined) {
    where.placementAverage = { gte: minPlacement };
  }

  if (minYear !== undefined || maxYear !== undefined) {
    where.establishedYear = {};
    if (minYear !== undefined) where.establishedYear = { ...where.establishedYear as object, gte: minYear };
    if (maxYear !== undefined) where.establishedYear = { ...where.establishedYear as object, lte: maxYear };
  }

  // Build orderBy
  let orderBy: Prisma.CollegeOrderByWithRelationInput = {};

  switch (sortBy) {
    case 'rating':
      orderBy = { rating: sortOrder as Prisma.SortOrder };
      break;
    case 'fees':
      orderBy = { fees: sortOrder as Prisma.SortOrder };
      break;
    case 'placement':
      orderBy = { placementAverage: sortOrder as Prisma.SortOrder };
      break;
    case 'newest':
      orderBy = { establishedYear: sortOrder as Prisma.SortOrder };
      break;
    case 'name':
      orderBy = { name: sortOrder as Prisma.SortOrder };
      break;
    default:
      orderBy = { rating: 'desc' };
  }

  // Cursor-based pagination
  const colleges = await prisma.college.findMany({
    where,
    orderBy,
    take: pageSize + 1,
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    select: {
      id: true,
      name: true,
      slug: true,
      state: true,
      city: true,
      fees: true,
      rating: true,
      ownershipType: true,
      naacGrade: true,
      establishedYear: true,
      placementAverage: true,
      placementHighest: true,
      imageUrl: true,
      _count: { select: { reviews: true, courses: true } },
    },
  });

  const hasMore = colleges.length > pageSize;
  const items = hasMore ? colleges.slice(0, pageSize) : colleges;
  const nextCursor = hasMore ? items[items.length - 1]?.id : null;

  return { items, nextCursor, hasMore };
}

export async function getCollegeById(id: string) {
  const college = await prisma.college.findFirst({
    where: { id, isDeleted: false },
    include: {
      courses: true,
      reviews: {
        include: {
          user: { select: { id: true, name: true } },
        },
        orderBy: { createdAt: 'desc' },
        take: 20,
      },
    },
  });

  if (!college) {
    throw new AppError('College not found', 404);
  }

  // Get similar colleges
  const similar = await prisma.college.findMany({
    where: {
      id: { not: id },
      isDeleted: false,
      OR: [
        { state: college.state },
        { ownershipType: college.ownershipType },
        { rating: { gte: college.rating - 0.5, lte: college.rating + 0.5 } },
      ],
    },
    select: {
      id: true,
      name: true,
      slug: true,
      state: true,
      city: true,
      fees: true,
      rating: true,
      ownershipType: true,
      naacGrade: true,
      imageUrl: true,
    },
    take: 4,
  });

  return { ...college, similar };
}

export async function createCollege(data: CreateCollegeInput) {
  const slug = await generateUniqueSlug(data.name);

  return prisma.college.create({
    data: {
      ...data,
      slug,
      fees: data.fees,
      placementAverage: data.placementAverage,
      placementHighest: data.placementHighest,
    },
  });
}

export async function updateCollege(id: string, data: UpdateCollegeInput) {
  const college = await prisma.college.findFirst({ where: { id, isDeleted: false } });
  if (!college) throw new AppError('College not found', 404);

  let slug = college.slug;
  if (data.name && data.name !== college.name) {
    slug = await generateUniqueSlug(data.name, id);
  }

  return prisma.college.update({
    where: { id },
    data: { ...data, slug },
  });
}

export async function deleteCollege(id: string) {
  const college = await prisma.college.findFirst({ where: { id, isDeleted: false } });
  if (!college) throw new AppError('College not found', 404);

  return prisma.college.update({
    where: { id },
    data: { isDeleted: true },
  });
}

export async function getStates() {
  const states = await prisma.college.findMany({
    where: { isDeleted: false },
    select: { state: true },
    distinct: ['state'],
    orderBy: { state: 'asc' },
  });
  return states.map((s) => s.state);
}

export async function getCities(state?: string) {
  const cities = await prisma.college.findMany({
    where: { isDeleted: false, ...(state ? { state } : {}) },
    select: { city: true },
    distinct: ['city'],
    orderBy: { city: 'asc' },
  });
  return cities.map((c) => c.city);
}
