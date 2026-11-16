import mongoose from 'mongoose';

const resultRowSchema = new mongoose.Schema({
  Producto: String,
  Clase: String,
  Politica: String,
  Param: String,
  Escenario: String,
  fill: Number,
  fill_p5: Number,
  so_days: Number,
  orders: Number,
  avg_inv: Number,
  inv_cap: Number,
  hold: Number,
  ordc: Number,
  lost: Number,
  total: Number,
  p_stockout: Number,
  mu: Number,
  lt_avg: Number,
  dmax: Number,
  ss_doc: Number,
  rop_doc: Number,
  eoq: Number
}, { _id: false });

const simulationSchema = new mongoose.Schema({
  nombre: { type: String, required: true, default: 'Corrida Estándar' },
  emailNotificacion: { type: String, default: '' },
  parametros: {
    scale: { type: Number, default: 1.0 },
    plocal_mult: { type: Number, default: 1.0 },
    lt_mult: { type: Number, default: 1.0 },
    reps: { type: Number, default: 300 }
  },
  chosen: { type: mongoose.Schema.Types.Mixed },
  results: [resultRowSchema],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Simulation', simulationSchema);