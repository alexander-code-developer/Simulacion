import { useState } from 'react';
import { ShoppingCart, PackagePlus, AlertTriangle, MailCheck, Plus, Edit2, Power, X } from 'lucide-react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import SectionHeader from '../ui/SectionHeader';
import { api } from '../../services/api';
import { formatCurrency } from '../../utils/formatters';

export default function RealInventoryPanel({ products, config, onInventoryUpdated }) {
  const [quantities, setQuantities] = useState({});
  const [loadingId, setLoadingId] = useState(null);
  const [alertBanner, setAlertBanner] = useState(null);

  // Modal / Formulario para Nuevo Producto o Edición
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '', sku: '', clase: 'A', participacionVentas: 0.10,
    precioVenta: 200, costoUnitario: 140, probLocal: 0.80, stockActual: 10
  });

  const ivaMult = config?.incluirIvaEnPrecios ? (1 + (config?.iva ?? 0.16)) : 1;

  const openCreateModal = () => {
    setEditingProduct(null);
    setFormData({
      nombre: '', sku: '', clase: 'A', participacionVentas: 0.10,
      precioVenta: 200, costoUnitario: 140, probLocal: 0.80, stockActual: 10
    });
    setShowForm(true);
  };

  const openEditModal = (prod) => {
    setEditingProduct(prod);
    setFormData({
      nombre: prod.nombre,
      sku: prod.sku,
      clase: prod.clase,
      participacionVentas: prod.participacionVentas,
      precioVenta: prod.precioVenta,
      costoUnitario: prod.costoUnitario,
      probLocal: prod.probLocal,
      stockActual: prod.stockActual
    });
    setShowForm(true);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await api.updateProduct(editingProduct._id, formData);
      } else {
        await api.createProduct(formData);
      }
      setShowForm(false);
      onInventoryUpdated();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleToggleActive = async (prod) => {
    try {
      await api.toggleProduct(prod._id);
      onInventoryUpdated();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleMovement = async (productId, tipo) => {
    const qty = Number(quantities[productId] || 1);
    setLoadingId(productId);
    setAlertBanner(null);
    try {
      const res = await api.registerMovement(productId, tipo, qty);
      if (res.emailNotification?.sent) {
        setAlertBanner(`📧 ¡Correo enviado por Brevo al dueño! Se alcanzó el punto de reorden de ${res.product.nombre}. Pedir ${res.product.qOptimo} unidades.`);
      } else if (res.product.activo && res.product.stockActual <= res.product.ropOptimo && tipo === 'VENTA') {
        setAlertBanner(`⚠️ Stock crítico en ${res.product.nombre} (${res.product.stockActual} u. ≤ R=${res.product.ropOptimo}). Ordenar ${res.product.qOptimo} piezas a Auto Todo.`);
      }
      setQuantities({ ...quantities, [productId]: 1 });
      onInventoryUpdated();
    } catch (err) {
      alert(err.message);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="space-y-4">
      {alertBanner && (
        <div className="flex items-center gap-3 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm font-medium text-amber-900">
          <MailCheck className="h-5 w-5 shrink-0 text-amber-600" />
          <span>{alertBanner}</span>
        </div>
      )}

      {/* Formulario Desplegable para Agregar o Editar Refacción */}
      {showForm && (
        <Card className="border-blue-200 bg-blue-50/30 p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">
              {editingProduct ? `Editar Refacción: ${editingProduct.nombre}` : 'Agregar Nueva Refacción al Catálogo'}
            </h3>
            <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-700">
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSaveProduct} className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700">Nombre de la pieza</label>
              <input
                type="text" required value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700">Clase ABC</label>
              <select
                value={formData.clase}
                onChange={(e) => setFormData({ ...formData, clase: e.target.value })}
                className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
              >
                <option value="A">Clase A (Alta rotación - Meta 95%)</option>
                <option value="B">Clase B (Media rotación - Meta 90%)</option>
                <option value="C">Clase C (Bajo pedido - Meta 85%)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700">Precio Venta Base (sin IVA)</label>
              <input
                type="number" step="0.5" min="1" required value={formData.precioVenta}
                onChange={(e) => setFormData({ ...formData, precioVenta: Number(e.target.value) })}
                className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700">Costo Proveedor (sin IVA)</label>
              <input
                type="number" step="0.5" min="0.5" required value={formData.costoUnitario}
                onChange={(e) => setFormData({ ...formData, costoUnitario: Number(e.target.value) })}
                className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700">Participación en Ventas (0.10 = 10%)</label>
              <input
                type="number" step="0.01" min="0.01" max="1" required value={formData.participacionVentas}
                onChange={(e) => setFormData({ ...formData, participacionVentas: Number(e.target.value) })}
                className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700">Prob. Entrega Local 1 día (0 a 1)</label>
              <input
                type="number" step="0.05" min="0" max="1" required value={formData.probLocal}
                onChange={(e) => setFormData({ ...formData, probLocal: Number(e.target.value) })}
                className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700">Stock Actual en Bodega</label>
              <input
                type="number" min="0" required value={formData.stockActual}
                onChange={(e) => setFormData({ ...formData, stockActual: Number(e.target.value) })}
                className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
              />
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                className="w-full rounded-lg bg-navy-900 px-4 py-2 text-sm font-semibold text-white hover:bg-navy-800"
              >
                {editingProduct ? 'Guardar Cambios' : 'Registrar Producto'}
              </button>
            </div>
          </form>
        </Card>
      )}

      {/* Tabla Principal del Inventario Real */}
      <Card className="overflow-hidden">
        <div className="border-b border-slate-200 p-6">
          <SectionHeader
            title="Catálogo e Inventario Real en Bodega (MongoDB)"
            subtitle={`IVA actual: ${((config?.iva ?? 0.16) * 100).toFixed(0)}% · Los productos desactivados no entran a la simulación.`}
            action={
              <button
                onClick={openCreateModal}
                className="inline-flex items-center gap-1.5 rounded-lg bg-navy-900 px-4 py-2 text-xs font-semibold text-white hover:bg-navy-800"
              >
                <Plus className="h-4 w-4" /> Agregar Refacción
              </button>
            }
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs font-semibold uppercase text-slate-600">
              <tr>
                <th className="px-6 py-3.5">Refacción</th>
                <th className="px-3 py-3.5">Clase</th>
                <th className="px-3 py-3.5">Precio Público</th>
                <th className="px-3 py-3.5">% Ventas</th>
                <th className="px-3 py-3.5">Stock</th>
                <th className="px-3 py-3.5">Regla (R / Q)</th>
                <th className="px-3 py-3.5">Estado</th>
                <th className="px-6 py-3.5 text-right">Mostrador y Edición</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {products.map((p) => {
                const isLow = p.activo && p.stockActual <= p.ropOptimo;
                return (
                  <tr key={p._id} className={!p.activo ? 'bg-slate-100/70 opacity-60' : isLow ? 'bg-red-50/40' : 'hover:bg-slate-50'}>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-slate-900">{p.nombre}</p>
                      <span className="text-xs text-slate-400">{p.sku}</span>
                    </td>
                    <td className="px-3 py-4">
                      <Badge variant={p.clase === 'A' ? 'classA' : 'classB'}>Clase {p.clase}</Badge>
                    </td>
                    <td className="px-3 py-4">
                      <p className="font-medium text-slate-900">{formatCurrency(p.precioVenta * ivaMult)}</p>
                      <span className="text-[11px] text-slate-400">Base: {formatCurrency(p.precioVenta)}</span>
                    </td>
                    <td className="px-3 py-4 text-slate-600">{(p.participacionVentas * 100).toFixed(0)}%</td>
                    <td className="px-3 py-4 text-base font-bold text-slate-900">{p.stockActual} u.</td>
                    <td className="px-3 py-4 text-xs">
                      <span className="font-semibold text-blue-700">R ≤ {p.ropOptimo}</span> · Pedir <strong>{p.qOptimo}</strong>
                    </td>
                    <td className="px-3 py-4">
                      {!p.activo ? (
                        <Badge>Descontinuado</Badge>
                      ) : isLow ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-700">
                          <AlertTriangle className="h-3.5 w-3.5" /> Pedir {p.qOptimo} u.
                        </span>
                      ) : (
                        <Badge variant="success">Óptimo</Badge>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        {p.activo && (
                          <>
                            <input
                              type="number" min="1" max="100"
                              value={quantities[p._id] || 1}
                              onChange={(e) => setQuantities({ ...quantities, [p._id]: e.target.value })}
                              className="w-14 rounded-lg border border-slate-300 px-2 py-1 text-center text-xs"
                            />
                            <button
                              disabled={loadingId === p._id}
                              onClick={() => handleMovement(p._id, 'VENTA')}
                              className="inline-flex items-center gap-1 rounded-lg bg-slate-900 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-slate-800"
                              title="Registrar Venta"
                            >
                              <ShoppingCart className="h-3.5 w-3.5" /> Vender
                            </button>
                            <button
                              disabled={loadingId === p._id}
                              onClick={() => handleMovement(p._id, 'REPOSICION')}
                              className="inline-flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                              title="Surtir Inventario"
                            >
                              <PackagePlus className="h-3.5 w-3.5" /> Surtir
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => openEditModal(p)}
                          className="rounded-lg border border-slate-200 p-1.5 text-slate-600 hover:bg-slate-100"
                          title="Editar precio, costo o participación"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleToggleActive(p)}
                          className={`rounded-lg border p-1.5 ${p.activo ? 'border-slate-200 text-slate-600 hover:bg-red-50 hover:text-red-600' : 'border-emerald-200 bg-emerald-50 text-emerald-700'}`}
                          title={p.activo ? 'Descontinuar producto (ya no se vende)' : 'Reactivar producto'}
                        >
                          <Power className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}