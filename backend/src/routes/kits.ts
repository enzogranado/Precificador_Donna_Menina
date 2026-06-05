import { Router, Request, Response } from 'express';
import Kit from '../models/Kit';

const router = Router();

// GET /api/kits -> Listar todos os kits
router.get('/', async (_req: Request, res: Response): Promise<any> => {
  try {
    const docs = await Kit.find().sort({ createdAt: -1 });
    const mapped = docs.map(doc => ({
      id: doc._id.toString(),
      nome: doc.nome,
      descricao: doc.descricao,
      margemLucroKit: doc.margemLucroKit || 0,
      produtos: doc.produtos.map(p => ({
        produtoId: p.produtoId,
        quantidade: p.quantidade
      }))
    }));
    return res.json(mapped);
  } catch (error: any) {
    return res.status(500).json({ error: 'Erro ao carregar kits.', details: error.message });
  }
});

// POST /api/kits -> Criar ou atualizar kit
router.post('/', async (req: Request, res: Response): Promise<any> => {
  try {
    const { id, nome, descricao, margemLucroKit, produtos } = req.body;

    if (!nome || margemLucroKit === undefined || !produtos) {
      return res.status(400).json({ error: 'Campos obrigatórios ausentes.' });
    }

    if (id) {
      // Atualizar existente
      const doc = await Kit.findByIdAndUpdate(id, {
        nome,
        descricao: descricao || '',
        margemLucroKit,
        produtos
      }, { new: true });

      if (!doc) return res.status(404).json({ error: 'Kit não encontrado para atualizar.' });

      return res.json({
        id: doc._id.toString(),
        nome: doc.nome,
        descricao: doc.descricao,
        margemLucroKit: doc.margemLucroKit,
        produtos: doc.produtos.map(p => ({
          produtoId: p.produtoId,
          quantidade: p.quantidade
        }))
      });
    } else {
      // Criar novo
      const newDoc = new Kit({
        nome,
        descricao: descricao || '',
        margemLucroKit,
        produtos
      });
      await newDoc.save();

      return res.json({
        id: newDoc._id.toString(),
        nome: newDoc.nome,
        descricao: newDoc.descricao,
        margemLucroKit: newDoc.margemLucroKit,
        produtos: newDoc.produtos.map(p => ({
          produtoId: p.produtoId,
          quantidade: p.quantidade
        }))
      });
    }
  } catch (error: any) {
    return res.status(500).json({ error: 'Erro ao salvar kit.', details: error.message });
  }
});

// DELETE /api/kits/:id -> Excluir kit
router.delete('/:id', async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const doc = await Kit.findByIdAndDelete(id);

    if (!doc) return res.status(404).json({ error: 'Kit não encontrado para excluir.' });

    return res.json({ success: true, message: 'Kit excluído com sucesso.' });
  } catch (error: any) {
    return res.status(500).json({ error: 'Erro ao deletar kit.', details: error.message });
  }
});

export default router;
