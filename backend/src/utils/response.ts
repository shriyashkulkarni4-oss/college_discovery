import { Response } from 'express';

export function sendSuccess<T>(
  res: Response,
  data: T,
  message: string = 'Success',
  statusCode: number = 200
) {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
}

export function sendError(
  res: Response,
  message: string = 'An error occurred',
  statusCode: number = 500,
  errors?: unknown
) {
  return res.status(statusCode).json({
    success: false,
    message,
    errors,
  });
}

export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
    public errors?: unknown
  ) {
    super(message);
    this.name = 'AppError';
  }
}
