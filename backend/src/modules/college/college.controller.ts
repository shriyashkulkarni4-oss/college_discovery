import { Request, Response, NextFunction } from 'express';
import { CollegeQuerySchema, CreateCollegeSchema, UpdateCollegeSchema } from './college.validator';
import * as collegeService from './college.service';
import { sendSuccess } from '../../utils/response';

export async function getColleges(req: Request, res: Response, next: NextFunction) {
  try {
    const query = CollegeQuerySchema.parse(req.query);
    const result = await collegeService.getColleges(query);
    sendSuccess(res, result);
  } catch (err) {
    next(err);
  }
}

export async function getCollegeById(req: Request, res: Response, next: NextFunction) {
  try {
    const college = await collegeService.getCollegeById(req.params.id as string);
    sendSuccess(res, college);
  } catch (err) {
    next(err);
  }
}

export async function createCollege(req: Request, res: Response, next: NextFunction) {
  try {
    const data = CreateCollegeSchema.parse(req.body);
    const college = await collegeService.createCollege(data);
    sendSuccess(res, college, 'College created successfully', 201);
  } catch (err) {
    next(err);
  }
}

export async function updateCollege(req: Request, res: Response, next: NextFunction) {
  try {
    const data = UpdateCollegeSchema.parse(req.body);
    const college = await collegeService.updateCollege(req.params.id as string, data);
    sendSuccess(res, college, 'College updated successfully');
  } catch (err) {
    next(err);
  }
}

export async function deleteCollege(req: Request, res: Response, next: NextFunction) {
  try {
    await collegeService.deleteCollege(req.params.id as string);
    sendSuccess(res, null, 'College deleted successfully');
  } catch (err) {
    next(err);
  }
}

export async function getStates(req: Request, res: Response, next: NextFunction) {
  try {
    const states = await collegeService.getStates();
    sendSuccess(res, states);
  } catch (err) {
    next(err);
  }
}

export async function getCities(req: Request, res: Response, next: NextFunction) {
  try {
    const cities = await collegeService.getCities(req.query.state as string | undefined);
    sendSuccess(res, cities);
  } catch (err) {
    next(err);
  }
}
