import { Request, Response, NextFunction } from 'express';
import * as savedService from './saved.service';
import { sendSuccess } from '../../utils/response';

export async function saveCollege(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await savedService.saveCollege(req.user!.userId, req.params.collegeId as string);
    sendSuccess(res, result, 'College saved', 201);
  } catch (err) {
    next(err);
  }
}

export async function unsaveCollege(req: Request, res: Response, next: NextFunction) {
  try {
    await savedService.unsaveCollege(req.user!.userId, req.params.collegeId as string);
    sendSuccess(res, null, 'College removed from saved');
  } catch (err) {
    next(err);
  }
}

export async function getSavedColleges(req: Request, res: Response, next: NextFunction) {
  try {
    const saved = await savedService.getSavedColleges(req.user!.userId);
    sendSuccess(res, saved);
  } catch (err) {
    next(err);
  }
}

export async function getSavedIds(req: Request, res: Response, next: NextFunction) {
  try {
    const ids = await savedService.getSavedCollegeIds(req.user!.userId);
    sendSuccess(res, ids);
  } catch (err) {
    next(err);
  }
}
