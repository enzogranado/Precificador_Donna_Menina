import { Schema, model } from 'mongoose';

const ConfiguracaoTempoSchema = new Schema({
  proLabore: { type: Number, required: true, default: 2500 },
  horasTrabalhoMes: { type: Number, required: true, default: 120 }
}, {
  timestamps: true
});

export default model('ConfiguracaoTempo', ConfiguracaoTempoSchema);
