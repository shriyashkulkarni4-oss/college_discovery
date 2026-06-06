import { Request, Response, NextFunction } from 'express';
import * as adminService from './admin.service';
import { sendSuccess } from '../../utils/response';

export async function getDashboardStats(req: Request, res: Response, next: NextFunction) {
  try {
    const stats = await adminService.getDashboardStats();
    sendSuccess(res, stats);
  } catch (err) {
    next(err);
  }
}

export async function getAllUsers(req: Request, res: Response, next: NextFunction) {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const result = await adminService.getAllUsers(page, limit);
    sendSuccess(res, result);
  } catch (err) {
    next(err);
  }
}
