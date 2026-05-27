import { Router, Request, Response } from 'express';
import CustoFixo from '../models/CustoFixo';

const router = Router();

// GET /api/custosfixos -> Listar todos os custos fixos
router.get('/', async (_req: Request, res: Response): Promise<any> => {
  try {
    const docs = await CustoFixo.find().sort({ createdAt: 1 });
    const mapped = docs.map(doc => ({
      id: doc._id.toString(),
      nome: doc.nome,
      valor: doc.valor
    }));
    return res.json(mapped);
  } catch (error: any) {
    return res.status(500).json({ error: 'Erro ao carregar despesas fixas.', details: error.message });
  }
});

// POST /api/custosfixos -> Cadastrar despesa
router.post('/', async (req: Request, res: Response): Promise<any> => {
  try {
    const { nome, valor } = req.body;

    if (!nome || valor === undefined || valor <= 0) {
      return res.status(400).json({ error: 'Campos obrigatórios ausentes ou inválidos.' });
    }

    const newDoc = new CustoFixo({ nome, valor });
    await newDoc.save();

    return res.json({
      id: newDoc._id.toString(),
      nome: newDoc.nome,
      valor: newDoc.valor
    });
  } catch (error: any) {
    return res.status(500).json({ error: 'Erro ao salvar despesa.', details: error.message });
  }
});

// DELETE /api/custosfixos/:id -> Deletar despesa
router.delete('/:id', async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const doc = await CustoFixo.findByIdAndDelete(id);

    if (!doc) return res.status(404).json({ error: 'Despesa não encontrada para excluir.' });

    return res.json({ success: true, message: 'Despesa excluída com sucesso.' });
  } catch (error: any) {
    return res.status(500).json({ error: 'Erro ao deletar despesa.', details: error.message });
  }
});

export default router;
