import { Request, Response, NextFunction } from 'express';
import { CreateCourseSchema, UpdateCourseSchema } from './course.validator';
import * as courseService from './course.service';
import { sendSuccess } from '../../utils/response';

export async function createCourse(req: Request, res: Response, next: NextFunction) {
  try {
    const data = CreateCourseSchema.parse(req.body);
    const course = await courseService.createCourse(data);
    sendSuccess(res, course, 'Course created', 201);
  } catch (err) {
    next(err);
  }
}

export async function updateCourse(req: Request, res: Response, next: NextFunction) {
  try {
    const data = UpdateCourseSchema.parse(req.body);
    const course = await courseService.updateCourse(req.params.id as string, data);
    sendSuccess(res, course, 'Course updated');
  } catch (err) {
    next(err);
  }
}

export async function deleteCourse(req: Request, res: Response, next: NextFunction) {
  try {
    await courseService.deleteCourse(req.params.id as string);
    sendSuccess(res, null, 'Course deleted');
  } catch (err) {
    next(err);
  }
}
