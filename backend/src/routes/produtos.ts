import { Router, Request, Response } from 'express';
import Produto from '../models/Produto';

const router = Router();

// GET /api/produtos -> Listar todos os produtos e suas receitas
router.get('/', async (_req: Request, res: Response): Promise<any> => {
  try {
    const docs = await Produto.find().sort({ createdAt: -1 });
    const mapped = docs.map(doc => ({
      id: doc._id.toString(),
      nome: doc.nome,
      descricao: doc.descricao,
      tempoProducao: doc.tempoProducao,
      margemLucro: doc.margemLucro,
      rendimento: doc.rendimento || 1,
      precoVendaManual: (doc as any).precoVendaManual,
      materiaisUsados: doc.materiaisUsados.map(mu => ({
        materialId: mu.materialId,
        quantidadeNecessaria: mu.quantidadeNecessaria
      }))
    }));
    return res.json(mapped);
  } catch (error: any) {
    return res.status(500).json({ error: 'Erro ao carregar produtos.', details: error.message });
  }
});

// POST /api/produtos -> Criar ou atualizar produto e receita
router.post('/', async (req: Request, res: Response): Promise<any> => {
  try {
    const { id, nome, descricao, tempoProducao, margemLucro, rendimento, materiaisUsados, precoVendaManual } = req.body;

    if (!nome || tempoProducao === undefined || margemLucro === undefined || !materiaisUsados) {
      return res.status(400).json({ error: 'Campos obrigatórios ausentes.' });
    }

    if (id) {
      // Editar existente
      const doc = await Produto.findByIdAndUpdate(id, {
        nome,
        descricao: descricao || '',
        tempoProducao,
        margemLucro,
        rendimento: rendimento || 1,
        precoVendaManual: precoVendaManual === undefined ? null : precoVendaManual,
        materiaisUsados
      }, { new: true });

      if (!doc) return res.status(404).json({ error: 'Produto não encontrado para atualizar.' });

      return res.json({
        id: doc._id.toString(),
        nome: doc.nome,
        descricao: doc.descricao,
        tempoProducao: doc.tempoProducao,
        margemLucro: doc.margemLucro,
        rendimento: doc.rendimento,
        precoVendaManual: (doc as any).precoVendaManual,
        materiaisUsados: doc.materiaisUsados.map(mu => ({
          materialId: mu.materialId,
          quantidadeNecessaria: mu.quantidadeNecessaria
        }))
      });
    } else {
      // Criar novo
      const newDoc = new Produto({
        nome,
        descricao: descricao || '',
        tempoProducao,
        margemLucro,
        rendimento: rendimento || 1,
        precoVendaManual: precoVendaManual === undefined ? null : precoVendaManual,
        materiaisUsados
      });
      await newDoc.save();

      return res.json({
        id: newDoc._id.toString(),
        nome: newDoc.nome,
        descricao: newDoc.descricao,
        tempoProducao: newDoc.tempoProducao,
        margemLucro: newDoc.margemLucro,
        rendimento: newDoc.rendimento,
        precoVendaManual: (newDoc as any).precoVendaManual,
        materiaisUsados: newDoc.materiaisUsados.map(mu => ({
          materialId: mu.materialId,
          quantidadeNecessaria: mu.quantidadeNecessaria
        }))
      });
    }
  } catch (error: any) {
    return res.status(500).json({ error: 'Erro ao salvar produto.', details: error.message });
  }
});

// DELETE /api/produtos/:id -> Excluir receita
router.delete('/:id', async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const doc = await Produto.findByIdAndDelete(id);

    if (!doc) return res.status(404).json({ error: 'Produto não encontrado para excluir.' });

    return res.json({ success: true, message: 'Produto excluído com sucesso.' });
  } catch (error: any) {
    return res.status(500).json({ error: 'Erro ao deletar produto.', details: error.message });
  }
});

export default router;
