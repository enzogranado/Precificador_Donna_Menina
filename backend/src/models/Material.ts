import { Schema, model } from 'mongoose';

const MaterialSchema = new Schema({
  nome: { type: String, required: true },
  precoTotal: { type: Number, required: true },
  quantidadeTotal: { type: Number, required: true },
  unidadeMedida: { type: String, enum: ['g', 'ml', 'un'], required: true },
  precoUnitario: { type: Number, required: true }
}, {
  timestamps: true
});

export default model('Material', MaterialSchema);
