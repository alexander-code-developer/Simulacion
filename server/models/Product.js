import mongoose from 'mongoose';

const movementSchema = new mongoose.Schema({
  tipo: { type: String, enum: ['VENTA', 'REPOSICION', 'AJUSTE'], required: true },
  cantidad: { type: Number, required: true },
  precioAplicado: Number,
  ivaCalculado: Number,
  nota: String,
  fecha: { type: Date, default: Date.now }
}, { _id: false });

const productSchema = new mongoose.Schema({
  nombre: { type: String, required: true, unique: true },
  sku: { type: String, default: '' },
  clase: { type: String, enum: ['A', 'B', 'C'], required: true, default: 'A' },
  activo: { type: Boolean, default: true }, // Si deja de venderse, pasa a false
  participacionVentas: { type: Number, required: true, min: 0.01, max: 1 }, // Ej: 0.24 (24%)
  precioVenta: { type: Number, required: true, min: 1 }, // Precio base sin IVA o neto según config
  costoUnitario: { type: Number, required: true, min: 0.1 },
  probLocal: { type: Number, required: true, min: 0, max: 1 }, // 0.80 Clase A, 0.10 Clase B
  stockActual: { type: Number, required: true, default: 0 },
  ropOptimo: { type: Number, required: true, default: 5 },
  qOptimo: { type: Number, required: true, default: 10 },
  sMensual: { type: Number, required: true, default: 15 },
  alertaEnviada: { type: Boolean, default: false },
  movimientos: [movementSchema]
}, { timestamps: true });

export default mongoose.model('Product', productSchema);