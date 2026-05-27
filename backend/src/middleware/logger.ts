import { Request, Response, NextFunction } from 'express';

export const loggerMiddleware = (req: Request, _res: Response, next: NextFunction) => {
  const timestamp = new Date().toISOString();
  console.log(`🚀 [${timestamp}] ${req.method} ${req.url}`);
  next();
};
