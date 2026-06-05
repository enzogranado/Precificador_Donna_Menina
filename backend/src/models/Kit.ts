import { Schema, model } from 'mongoose';

const ProdutoNoKitSchema = new Schema({
  produtoId: { type: String, required: true },
  quantidade: { type: Number, required: true }
}, { _id: false });

const KitSchema = new Schema({
  nome: { type: String, required: true },
  descricao: { type: String, default: '' },
  margemLucroKit: { type: Number, required: true, default: 0 },
  produtos: [ProdutoNoKitSchema]
}, {
  timestamps: true
});

export default model('Kit', KitSchema);
