import Product from '../models/Product.js';
import SystemConfig from '../models/SystemConfig.js';
import { sendLowStockAlert } from '../services/brevoService.js';

// --- CONFIGURACIÓN GLOBAL (IVA, Costo pedido, Tasa mantener, etc.) ---
export const getSystemConfig = async (req, res) => {
  try {
    let config = await SystemConfig.findOne();
    if (!config) config = await SystemConfig.create({});
    res.json(config);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateSystemConfig = async (req, res) => {
  try {
    let config = await SystemConfig.findOne();
    if (!config) config = new SystemConfig();
    Object.assign(config, req.body);
    await config.save();
    res.json(config);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// --- CRUD DE PRODUCTOS ---
export const getInventory = async (req, res) => {
  try {
    const products = await Product.find().sort({ activo: -1, clase: 1, nombre: 1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    const {
      nombre, sku, clase, participacionVentas,
      precioVenta, costoUnitario, probLocal, stockActual
    } = req.body;

    const product = await Product.create({
      nombre,
      sku: sku || `REF-${Date.now().toString().slice(-4)}`,
      clase: clase || 'A',
      activo: true,
      participacionVentas: Number(participacionVentas),
      precioVenta: Number(precioVenta),
      costoUnitario: Number(costoUnitario),
      probLocal: Number(probLocal),
      stockActual: Number(stockActual || 0),
      ropOptimo: 2,
      qOptimo: 10,
      sMensual: 15
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const product = await Product.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
    if (!product) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const toggleProductActive = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Producto no encontrado' });
    product.activo = !product.activo;
    await product.save();
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// --- MOVIMIENTOS DE INVENTARIO (VENTA / REPOSICIÓN) ---
export const registerMovement = async (req, res) => {
  try {
    const { id } = req.params;
    const { tipo, cantidad, nota = '' } = req.body;
    const qty = Number(cantidad);

    if (!qty || qty <= 0) return res.status(400).json({ error: 'Cantidad inválida' });

    const [product, config] = await Promise.all([
      Product.findById(id),
      SystemConfig.findOne()
    ]);

    if (!product) return res.status(404).json({ error: 'Producto no encontrado' });

    const ivaRate = config?.iva ?? 0.16;
    const precioFinal = config?.incluirIvaEnPrecios
      ? product.precioVenta * (1 + ivaRate)
      : product.precioVenta;
    const ivaMonto = config?.incluirIvaEnPrecios
      ? product.precioVenta * ivaRate
      : 0;

    let emailNotification = null;

    if (tipo === 'VENTA') {
      if (product.stockActual < qty) {
        return res.status(400).json({ error: `Stock insuficiente (disponible: ${product.stockActual} u.)` });
      }
      product.stockActual -= qty;
      product.movimientos.unshift({
        tipo: 'VENTA',
        cantidad: -qty,
        precioAplicado: precioFinal,
        ivaCalculado: ivaMonto * qty,
        nota: nota || 'Venta en mostrador'
      });

      if (product.activo && product.stockActual <= product.ropOptimo && !product.alertaEnviada) {
        emailNotification = await sendLowStockAlert(product, config);
        product.alertaEnviada = true;
      }
    } else if (tipo === 'REPOSICION') {
      product.stockActual += qty;
      product.movimientos.unshift({
        tipo: 'REPOSICION',
        cantidad: qty,
        precioAplicado: product.costoUnitario,
        ivaCalculado: product.costoUnitario * ivaRate * qty,
        nota: nota || 'Surtimiento proveedor'
      });

      if (product.stockActual > product.ropOptimo) {
        product.alertaEnviada = false;
      }
    }

    await product.save();
    res.json({ product, emailNotification });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const applySimulationPolicies = async (req, res) => {
  try {
    const { chosen } = req.body;
    const products = await Product.find({ activo: true });

    for (const prod of products) {
      if (chosen[prod.nombre]) {
        prod.ropOptimo = chosen[prod.nombre].QR.R;
        prod.qOptimo = chosen[prod.nombre].QR.Q;
        prod.sMensual = chosen[prod.nombre].P30.S;
        prod.alertaEnviada = prod.stockActual <= prod.ropOptimo;
        await prod.save();
      }
    }

    const updated = await Product.find().sort({ activo: -1, clase: 1, nombre: 1 });
    res.json({ message: 'Parámetros óptimos sincronizados', products: updated });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};