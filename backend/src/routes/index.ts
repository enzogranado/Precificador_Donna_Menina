import { Router } from 'express';
import healthRouter from './health';
import precificacaoRouter from './precificacao';
import materiaisRouter from './materiais';
import custosFixosRouter from './custosFixos';
import configTempoRouter from './configTempo';
import produtosRouter from './produtos';
import authRouter from './auth';

const router = Router();

router.use('/health', healthRouter);
router.use('/precificacao', precificacaoRouter);
router.use('/materiais', materiaisRouter);
router.use('/custosfixos', custosFixosRouter);
router.use('/configtempo', configTempoRouter);
router.use('/produtos', produtosRouter);
router.use('/auth', authRouter);

export default router;
