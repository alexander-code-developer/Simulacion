import { useState, useEffect } from 'react';
import { Settings, Save } from 'lucide-react';
import Card from '../ui/Card';
import SectionHeader from '../ui/SectionHeader';
import { api } from '../../services/api';

export default function ConfigPanel({ config, onConfigSaved }) {
  const [form, setForm] = useState(config || {});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (config) setForm(config);
  }, [config]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updated = await api.updateConfig({
        ...form,
        iva: Number(form.iva),
        hRate: Number(form.hRate),
        kOrder: Number(form.kOrder),
        revMean: Number(form.revMean),
        ltLocal: Number(form.ltLocal),
        ltPaqMax: Number(form.ltPaqMax)
      });
      onConfigSaved(updated);
      alert('✅ Variables globales actualizadas en MongoDB. La próxima simulación usará estos nuevos valores.');
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (!config) return null;

  return (
    <Card className="p-6">
      <SectionHeader
        title="Variables Financieras y Operativas Globales (MongoDB)"
        subtitle="Si sube el IVA, cambia el costo de flete o cambian los tiempos de Auto Todo, ajústalo aquí."
      />

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700">IVA Aplicable (Ej. 0.16 = 16%)</label>
          <input
            type="number" step="0.01" min="0" max="0.5"
            value={form.iva ?? 0.16}
            onChange={(e) => setForm({ ...form, iva: e.target.value })}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700">Aplicar IVA en Precios/Simulación</label>
          <select
            value={form.incluirIvaEnPrecios ? 'true' : 'false'}
            onChange={(e) => setForm({ ...form, incluirIvaEnPrecios: e.target.value === 'true' })}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          >
            <option value="true">Sí (Precios con IVA incluido)</option>
            <option value="false">No (Precios netos sin IVA)</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700">Costo por Pedido / Flete (MXN)</label>
          <input
            type="number" step="1" min="0"
            value={form.kOrder ?? 60}
            onChange={(e) => setForm({ ...form, kOrder: e.target.value })}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700">Tasa Mantener Inventario (0.25 = 25%)</label>
          <input
            type="number" step="0.01" min="0.01" max="1"
            value={form.hRate ?? 0.25}
            onChange={(e) => setForm({ ...form, hRate: e.target.value })}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700">Venta Diaria Promedio Local (MXN)</label>
          <input
            type="number" step="1" min="1"
            value={form.revMean ?? 555}
            onChange={(e) => setForm({ ...form, revMean: e.target.value })}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700">Entrega Local Auto Todo (días)</label>
          <input
            type="number" step="0.5" min="0.5"
            value={form.ltLocal ?? 1}
            onChange={(e) => setForm({ ...form, ltLocal: e.target.value })}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700">Entrega Máx. Paquetería (días)</label>
          <input
            type="number" step="0.5" min="1"
            value={form.ltPaqMax ?? 10.5}
            onChange={(e) => setForm({ ...form, ltPaqMax: e.target.value })}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
        </div>

        <div className="flex items-end">
          <button
            type="submit"
            disabled={saving}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-navy-900 px-4 py-2 text-sm font-semibold text-white hover:bg-navy-800"
          >
            <Save className="h-4 w-4" /> {saving ? 'Guardando...' : 'Guardar Variables'}
          </button>
        </div>
      </form>
    </Card>
  );
}