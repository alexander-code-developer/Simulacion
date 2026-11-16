import mongoose from 'mongoose';

const systemConfigSchema = new mongoose.Schema({
  iva: { type: Number, default: 0.16 },                // 16% IVA México
  incluirIvaEnPrecios: { type: Boolean, default: true },
  hRate: { type: Number, default: 0.25 },              // 25% costo mantener anual
  kOrder: { type: Number, default: 60 },               // $60 MXN costo por pedido
  lamT: { type: Number, default: 1.1337 },             // Tickets promedio/día
  varT: { type: Number, default: 1.8776 },             // Varianza tickets/día
  revMean: { type: Number, default: 555.0 },           // Venta diaria promedio MXN
  revMax: { type: Number, default: 3405.0 },           // Venta máxima diaria MXN
  ltLocal: { type: Number, default: 1.0 },             // Entrega local (días)
  ltPaqMin: { type: Number, default: 4.0 },            // Paquetería mín
  ltPaqMode: { type: Number, default: 6.5 },           // Paquetería moda
  ltPaqMax: { type: Number, default: 10.5 }            // Paquetería máx
}, { timestamps: true });

export default mongoose.model('SystemConfig', systemConfigSchema);