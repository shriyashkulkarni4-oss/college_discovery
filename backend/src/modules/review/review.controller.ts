import { Request, Response, NextFunction } from 'express';
import { CreateReviewSchema } from './review.validator';
import * as reviewService from './review.service';
import { sendSuccess } from '../../utils/response';

export async function createReview(req: Request, res: Response, next: NextFunction) {
  try {
    const data = CreateReviewSchema.parse(req.body);
    const review = await reviewService.createReview(req.user!.userId, data);
    sendSuccess(res, review, 'Review submitted', 201);
  } catch (err) {
    next(err);
  }
}

export async function getReviewsByCollege(req: Request, res: Response, next: NextFunction) {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const result = await reviewService.getReviewsByCollege(req.params.collegeId as string, page, limit);
    sendSuccess(res, result);
  } catch (err) {
    next(err);
  }
}

export async function getAllReviews(req: Request, res: Response, next: NextFunction) {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const result = await reviewService.getAllReviews(page, limit);
    sendSuccess(res, result);
  } catch (err) {
    next(err);
  }
}

export async function deleteReview(req: Request, res: Response, next: NextFunction) {
  try {
    await reviewService.deleteReview(req.params.id as string);
    sendSuccess(res, null, 'Review deleted');
  } catch (err) {
    next(err);
  }
}
