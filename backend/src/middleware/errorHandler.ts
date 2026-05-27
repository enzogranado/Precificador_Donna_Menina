import { Request, Response, NextFunction } from 'express';

export const errorHandlerMiddleware = (err: any, _req: Request, res: Response, _next: NextFunction): any => {
  console.error('❌ Unhandled Exception:', err);
  return res.status(500).json({
    error: 'Erro interno do servidor ao realizar a operação.',
    details: err.message || err
  });
};
