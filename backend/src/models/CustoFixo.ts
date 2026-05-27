import { Schema, model } from 'mongoose';

const CustoFixoSchema = new Schema({
  nome: { type: String, required: true },
  valor: { type: Number, required: true }
}, {
  timestamps: true
});

export default model('CustoFixo', CustoFixoSchema);
