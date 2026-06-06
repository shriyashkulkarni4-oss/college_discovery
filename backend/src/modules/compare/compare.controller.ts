import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../config/database';
import { AppError, sendSuccess } from '../../utils/response';

export async function compareColleges(req: Request, res: Response, next: NextFunction) {
  try {
    const idsParam = req.query.ids as string;
    if (!idsParam) throw new AppError('Please provide college IDs', 400);

    const ids = idsParam.split(',').map((id) => id.trim()).filter(Boolean);

    if (ids.length < 2) throw new AppError('Please provide at least 2 college IDs', 400);
    if (ids.length > 3) throw new AppError('You can compare up to 3 colleges', 400);

    const colleges = await prisma.college.findMany({
      where: { id: { in: ids }, isDeleted: false },
      include: {
        courses: {
          orderBy: { courseName: 'asc' },
        },
        _count: { select: { reviews: true } },
      },
    });

    if (colleges.length !== ids.length) {
      throw new AppError('One or more colleges not found', 404);
    }

    // Return in the same order as requested
    const ordered = ids.map((id) => colleges.find((c) => c.id === id)!);

    sendSuccess(res, ordered);
  } catch (err) {
    next(err);
  }
}
