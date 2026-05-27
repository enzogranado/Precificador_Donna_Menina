import { Router, Request, Response } from 'express';

const router = Router();

router.post('/calcular', (req: Request, res: Response): any => {
  try {
    const { custoProduto, custoEmbalagem, impostosPercentual, comissaoPercentual, margemLucroPercentual } = req.body;

    if (
      custoProduto === undefined ||
      custoEmbalagem === undefined ||
      impostosPercentual === undefined ||
      comissaoPercentual === undefined ||
      margemLucroPercentual === undefined
    ) {
      return res.status(400).json({ error: 'Parâmetros obrigatórios ausentes.' });
    }

    const custoTotalItem = Number(custoProduto) + Number(custoEmbalagem);
    
    // Fórmula de Markup / Divisor de Preço de Venda
    const somatorioPercentuais = Number(impostosPercentual) + Number(comissaoPercentual) + Number(margemLucroPercentual);
    
    if (somatorioPercentuais >= 100) {
      return res.status(400).json({ 
        error: 'A soma dos percentuais (impostos, comissão e margem de lucro) não pode ser igual ou maior que 100% no modelo Markup Divisor.' 
      });
    }

    const divisor = (100 - somatorioPercentuais) / 100;
    const precoVendaSugerido = custoTotalItem / divisor;
    
    const valorImposto = precoVendaSugerido * (Number(impostosPercentual) / 100);
    const valorComissao = precoVendaSugerido * (Number(comissaoPercentual) / 100);
    const lucroLiquido = precoVendaSugerido * (Number(margemLucroPercentual) / 100);

    return res.json({
      custoTotalItem,
      precoVendaSugerido: parseFloat(precoVendaSugerido.toFixed(2)),
      valorImposto: parseFloat(valorImposto.toFixed(2)),
      valorComissao: parseFloat(valorComissao.toFixed(2)),
      lucroLiquido: parseFloat(lucroLiquido.toFixed(2)),
      markup: parseFloat((precoVendaSugerido / (custoTotalItem || 1)).toFixed(2))
    });
  } catch (error: any) {
    return res.status(500).json({ error: 'Erro ao realizar cálculo de precificação.', details: error.message });
  }
});

export default router;
