import { Router, Request, Response } from 'express';

const router = Router();

router.get('/', (_req: Request, res: Response) => {
  return res.json({
    status: 'UP',
    message: 'Servidor de Precificação Donna Menina está rodando perfeitamente!',
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV
  });
});

export default router;
