import { Request, Response, NextFunction } from 'express';
import { SignupSchema, LoginSchema, RefreshSchema } from './auth.validator';
import * as authService from './auth.service';
import { sendSuccess } from '../../utils/response';

export async function signup(req: Request, res: Response, next: NextFunction) {
  try {
    const data = SignupSchema.parse(req.body);
    const result = await authService.signup(data);
    sendSuccess(res, result, 'Account created successfully', 201);
  } catch (err) {
    next(err);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const data = LoginSchema.parse(req.body);
    const result = await authService.login(data);
    sendSuccess(res, result, 'Login successful');
  } catch (err) {
    next(err);
  }
}

export async function refresh(req: Request, res: Response, next: NextFunction) {
  try {
    const { refreshToken } = RefreshSchema.parse(req.body);
    const result = await authService.refresh(refreshToken);
    sendSuccess(res, result, 'Token refreshed');
  } catch (err) {
    next(err);
  }
}

export async function getMe(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.userId;
    const user = await authService.getMe(userId);
    sendSuccess(res, user);
  } catch (err) {
    next(err);
  }
}
