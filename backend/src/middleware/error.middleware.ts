import { Request, Response, NextFunction } from 'express';
import { AppError, sendError } from '../utils/response';
import { ZodError } from 'zod';

export function errorMiddleware(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  console.error('Error:', err);

  if (err instanceof AppError) {
    sendError(res, err.message, err.statusCode, err.errors);
    return;
  }

  if (err instanceof ZodError) {
    sendError(res, 'Validation error', 400, err.flatten().fieldErrors);
    return;
  }

  // Prisma unique constraint error
  if ((err as { code?: string }).code === 'P2002') {
    sendError(res, 'Resource already exists', 409);
    return;
  }

  // Prisma record not found
  if ((err as { code?: string }).code === 'P2025') {
    sendError(res, 'Resource not found', 404);
    return;
  }

  sendError(res, 'Internal server error', 500);
}
