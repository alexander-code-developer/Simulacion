import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Product from '../models/Product.js';
import SystemConfig from '../models/SystemConfig.js';

export const seedInitialData = async () => {
  const adminEmail = process.env.ADMIN_EMAIL || 'dueno@refaccionaria.mx';
  if (!(await User.findOne({ email: adminEmail }))) {
    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin123', 10);
    await User.create({ nombre: 'Dueño Refaccionaria Actopan', email: adminEmail, password: hashedPassword });
  }

  if ((await SystemConfig.countDocuments()) === 0) {
    await SystemConfig.create({});
    console.log('⚙️ Configuración global (IVA 16%, K=$60, H=25%) inicializada');
  }

  if ((await Product.countDocuments()) === 0) {
    await Product.insertMany([
      { nombre: 'Aceite de motor (1 L)', sku: 'ACE-001', clase: 'A', activo: true, participacionVentas: 0.24, precioVenta: 140, costoUnitario: 98, probLocal: 0.80, stockActual: 18, ropOptimo: 10, qOptimo: 41, sMensual: 45 },
      { nombre: 'Filtro de aceite', sku: 'FIL-002', clase: 'A', activo: true, participacionVentas: 0.14, precioVenta: 110, costoUnitario: 71.5, probLocal: 0.80, stockActual: 12, ropOptimo: 7, qOptimo: 42, sMensual: 35 },
      { nombre: 'Balatas delanteras', sku: 'BAL-003', clase: 'A', activo: true, participacionVentas: 0.18, precioVenta: 480, costoUnitario: 336, probLocal: 0.80, stockActual: 5, ropOptimo: 2, qOptimo: 10, sMensual: 12 },
      { nombre: 'Bujías (pieza)', sku: 'BUJ-004', clase: 'A', activo: true, participacionVentas: 0.10, precioVenta: 75, costoUnitario: 48.75, probLocal: 0.80, stockActual: 14, ropOptimo: 7, qOptimo: 52, sMensual: 37 },
      { nombre: 'Amortiguador delantero', sku: 'AMO-005', clase: 'B', activo: true, participacionVentas: 0.12, precioVenta: 850, costoUnitario: 612, probLocal: 0.10, stockActual: 4, ropOptimo: 2, qOptimo: 5, sMensual: 6 },
      { nombre: 'Disco de freno', sku: 'DIS-006', clase: 'B', activo: true, participacionVentas: 0.08, precioVenta: 720, costoUnitario: 518.4, probLocal: 0.10, stockActual: 3, ropOptimo: 1, qOptimo: 5, sMensual: 5 }
    ]);
    console.log('📦 Catálogo inicial cargado en MongoDB');
  }
};