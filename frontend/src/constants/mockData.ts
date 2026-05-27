import type { Material, CustoFixo, ConfiguracaoTempo, Produto } from '../types';

export const INGREDIENTES_MOCK: Material[] = [
  { id: 'mat-1', nome: 'Cera de Coco Refinada', precoTotal: 58.00, quantidadeTotal: 1000, unidadeMedida: 'g', precoUnitario: 0.058 },
  { id: 'mat-2', nome: 'Essência Concentrada de Flor de Cerejeira', precoTotal: 48.00, quantidadeTotal: 100, unidadeMedida: 'ml', precoUnitario: 0.48 },
  { id: 'mat-3', nome: 'Essência de Capim Limão e Alecrim', precoTotal: 42.00, quantidadeTotal: 100, unidadeMedida: 'ml', precoUnitario: 0.42 },
  { id: 'mat-4', nome: 'Pavio de Algodão Encerado', precoTotal: 16.00, quantidadeTotal: 50, unidadeMedida: 'un', precoUnitario: 0.32 },
  { id: 'mat-5', nome: 'Pote de Vidro Porta-Vela Premium', precoTotal: 72.00, quantidadeTotal: 12, unidadeMedida: 'un', precoUnitario: 6.00 },
  { id: 'mat-6', nome: 'Glicerina Bidestilada Transparente', precoTotal: 36.00, quantidadeTotal: 1000, unidadeMedida: 'g', precoUnitario: 0.036 },
  { id: 'mat-7', nome: 'Corante Orgânico Vermelho Líquido', precoTotal: 12.00, quantidadeTotal: 30, unidadeMedida: 'ml', precoUnitario: 0.40 },
  { id: 'mat-8', nome: 'Flores de Calêndula Desidratadas', precoTotal: 15.00, quantidadeTotal: 100, unidadeMedida: 'g', precoUnitario: 0.15 }
];

export const CUSTOS_FIXOS_MOCK: CustoFixo[] = [
  { id: 'fix-1', nome: 'Assinatura do Canva Pro', valor: 34.90 },
  { id: 'fix-2', nome: 'Energia e Água do Ateliê', valor: 140.00 },
  { id: 'fix-3', nome: 'Embalagens e Laços Mensais', valor: 120.00 }
];

export const CONFIG_TEMPO_MOCK: ConfiguracaoTempo = {
  proLabore: 2500.00,
  horasTrabalhoMes: 120
};

export const PRODUTOS_MOCK: Produto[] = [
  {
    id: 'prod-1',
    nome: 'Vela Aromática Flor de Cerejeira 150g',
    descricao: 'Vela de cera de coco feita à mão no pote de vidro porta-vela premium com aroma relaxante.',
    tempoProducao: 25,
    margemLucro: 45,
    rendimento: 1,
    materiaisUsados: [
      { materialId: 'mat-1', quantidadeNecessaria: 140 }, // Cera de Coco
      { materialId: 'mat-2', quantidadeNecessaria: 15 },  // Essência Flor Cerejeira
      { materialId: 'mat-4', quantidadeNecessaria: 1 },   // Pavio
      { materialId: 'mat-5', quantidadeNecessaria: 1 }    // Pote
    ]
  },
  {
    id: 'prod-2',
    nome: 'Sabonete Glicerinado de Calêndula & Mel',
    descricao: 'Sabonete artesanal botânico enriquecido com flores secas de calêndula altamente hidratante.',
    tempoProducao: 15,
    margemLucro: 40,
    rendimento: 8,
    materiaisUsados: [
      { materialId: 'mat-6', quantidadeNecessaria: 90 },  // Glicerina
      { materialId: 'mat-3', quantidadeNecessaria: 5 },   // Essência Capim Limão
      { materialId: 'mat-8', quantidadeNecessaria: 3 },   // Calêndula Desidratada
      { materialId: 'mat-7', quantidadeNecessaria: 0.5 }  // Corante
    ]
  }
];
