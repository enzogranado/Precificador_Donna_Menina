import { Router, Request, Response } from 'express';
import ConfiguracaoTempo from '../models/ConfiguracaoTempo';

const router = Router();

// GET /api/configtempo -> Obter a única configuração ativa
router.get('/', async (_req: Request, res: Response): Promise<any> => {
  try {
    let doc = await ConfiguracaoTempo.findOne();
    
    // Se não existir, criar uma inicial mockada
    if (!doc) {
      doc = new ConfiguracaoTempo({
        proLabore: 2500,
        horasTrabalhoMes: 120
      });
      await doc.save();
    }

    return res.json({
      proLabore: doc.proLabore,
      horasTrabalhoMes: doc.horasTrabalhoMes
    });
  } catch (error: any) {
    return res.status(500).json({ error: 'Erro ao carregar parâmetros de tempo.', details: error.message });
  }
});

// POST /api/configtempo -> Salvar ou atualizar configuração
router.post('/', async (req: Request, res: Response): Promise<any> => {
  try {
    const { proLabore, horasTrabalhoMes } = req.body;

    if (proLabore === undefined || horasTrabalhoMes === undefined) {
      return res.status(400).json({ error: 'Campos obrigatórios ausentes.' });
    }

    let doc = await ConfiguracaoTempo.findOne();

    if (doc) {
      doc.proLabore = proLabore;
      doc.horasTrabalhoMes = horasTrabalhoMes;
      await doc.save();
    } else {
      doc = new ConfiguracaoTempo({ proLabore, horasTrabalhoMes });
      await doc.save();
    }

    return res.json({
      proLabore: doc.proLabore,
      horasTrabalhoMes: doc.horasTrabalhoMes
    });
  } catch (error: any) {
    return res.status(500).json({ error: 'Erro ao salvar parâmetros de tempo.', details: error.message });
  }
});

export default router;
