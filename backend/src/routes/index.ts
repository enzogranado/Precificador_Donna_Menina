import { Router } from 'express';
import healthRouter from './health';
import precificacaoRouter from './precificacao';

const router = Router();

router.use('/health', healthRouter);
router.use('/precificacao', precificacaoRouter);

export default router;
