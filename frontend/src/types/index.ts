export interface User {
  email: string;
  isLoggedIn: boolean;
}

export interface Material {
  id: string;
  nome: string;
  precoTotal: number;
  quantidadeTotal: number;
  unidadeMedida: 'g' | 'ml' | 'un';
  precoUnitario: number;
}

export interface MaterialUsado {
  materialId: string;
  quantidadeNecessaria: number;
}

export interface Produto {
  id: string;
  nome: string;
  descricao: string;
  tempoProducao: number; // em minutos
  margemLucro: number; // em %
  materiaisUsados: MaterialUsado[];
  rendimento: number; // quantidade de unidades produzidas por lote/barra
}

export interface CustoFixo {
  id: string;
  nome: string;
  valor: number;
}

export interface ConfiguracaoTempo {
  proLabore: number;
  horasTrabalhoMes: number;
}
