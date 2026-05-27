import { Router, Request, Response } from 'express';
import Material from '../models/Material';
import Produto from '../models/Produto';

const router = Router();

// GET /api/materiais -> Listar todos os insumos
router.get('/', async (_req: Request, res: Response): Promise<any> => {
  try {
    const docs = await Material.find().sort({ createdAt: -1 });
    const mapped = docs.map(doc => ({
      id: doc._id.toString(),
      nome: doc.nome,
      precoTotal: doc.precoTotal,
      quantidadeTotal: doc.quantidadeTotal,
      unidadeMedida: doc.unidadeMedida,
      precoUnitario: doc.precoUnitario
    }));
    return res.json(mapped);
  } catch (error: any) {
    return res.status(500).json({ error: 'Erro ao carregar materiais.', details: error.message });
  }
});

// POST /api/materiais -> Criar ou atualizar insumo
router.post('/', async (req: Request, res: Response): Promise<any> => {
  try {
    const { id, nome, precoTotal, quantidadeTotal, unidadeMedida, precoUnitario } = req.body;

    if (!nome || precoTotal === undefined || quantidadeTotal === undefined || !unidadeMedida || precoUnitario === undefined) {
      return res.status(400).json({ error: 'Campos obrigatórios ausentes.' });
    }

    if (id) {
      // Atualização
      const doc = await Material.findByIdAndUpdate(id, {
        nome,
        precoTotal,
        quantidadeTotal,
        unidadeMedida,
        precoUnitario
      }, { new: true });

      if (!doc) return res.status(404).json({ error: 'Insumo não encontrado para editar.' });

      return res.json({
        id: doc._id.toString(),
        nome: doc.nome,
        precoTotal: doc.precoTotal,
        quantidadeTotal: doc.quantidadeTotal,
        unidadeMedida: doc.unidadeMedida,
        precoUnitario: doc.precoUnitario
      });
    } else {
      // Criação
      const newDoc = new Material({
        nome,
        precoTotal,
        quantidadeTotal,
        unidadeMedida,
        precoUnitario
      });
      await newDoc.save();

      return res.json({
        id: newDoc._id.toString(),
        nome: newDoc.nome,
        precoTotal: newDoc.precoTotal,
        quantidadeTotal: newDoc.quantidadeTotal,
        unidadeMedida: newDoc.unidadeMedida,
        precoUnitario: newDoc.precoUnitario
      });
    }
  } catch (error: any) {
    return res.status(500).json({ error: 'Erro ao salvar material.', details: error.message });
  }
});

// DELETE /api/materiais/:id -> Excluir insumo
router.delete('/:id', async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;

    // Verificar se o material está em uso em algum produto cadastrado
    const emUso = await Produto.findOne({ 'materiaisUsados.materialId': id });
    if (emUso) {
      return res.status(400).json({ 
        error: 'Este insumo não pode ser excluído porque está associado à receita do produto: ' + emUso.nome 
      });
    }

    const doc = await Material.findByIdAndDelete(id);
    if (!doc) return res.status(404).json({ error: 'Insumo não encontrado para deletar.' });

    return res.json({ success: true, message: 'Insumo excluído com sucesso.' });
  } catch (error: any) {
    return res.status(500).json({ error: 'Erro ao deletar material.', details: error.message });
  }
});

export default router;
