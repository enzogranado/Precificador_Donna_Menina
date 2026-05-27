import { Schema, model } from 'mongoose';

const MaterialUsadoSchema = new Schema({
  materialId: { type: String, required: true },
  quantidadeNecessaria: { type: Number, required: true }
}, { _id: false });

const ProdutoSchema = new Schema({
  nome: { type: String, required: true },
  descricao: { type: String, default: '' },
  tempoProducao: { type: Number, required: true },
  margemLucro: { type: Number, required: true },
  rendimento: { type: Number, required: true, default: 1 },
  materiaisUsados: [MaterialUsadoSchema]
}, {
  timestamps: true
});

export default model('Produto', ProdutoSchema);
