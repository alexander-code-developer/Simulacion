import { useState } from 'react';
import { Play, Loader2, AlertCircle } from 'lucide-react';
import Card from '../ui/Card';
import SectionHeader from '../ui/SectionHeader';

export default function LiveSimulatorForm({ onRun, running, error }) {
  const [nombre, setNombre] = useState('Escenario Actopan 2026');
  const [scale, setScale] = useState(1.0);
  const [plocalMult, setPlocalMult] = useState(1.0);
  const [ltMult, setLtMult] = useState(1.0);
  const [inflacionAnual, setInflacionAnual] = useState(0.0375);
  const [crecimientoMensual, setCrecimientoMensual] = useState(0.01);
  const [reps, setReps] = useState(300);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onRun({
      nombre,
      scale: Number(scale),
      plocal_mult: Number(plocalMult),
      lt_mult: Number(ltMult),
      inflacion_anual: Number(inflacionAnual),
      crecimiento_mensual: Number(crecimientoMensual),
      reps: Number(reps)
    });
  };

  return (
    <Card className="p-6">
      <SectionHeader
        title="Motor de Simulación Monte Carlo en Vivo"
        subtitle="Ajusta los parámetros operativos y financieros para optimizar R, Q y S en Python."
      />

      {error && (
        <div className="mb-5 flex items-center gap-2 rounded-lg border border-red-300 bg-red-50 p-3.5 text-xs font-medium text-red-800">
          <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700">Etiqueta de Corrida</label>
            <input
              type="text"
              required
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="flex justify-between text-xs font-semibold text-slate-700">
              <span>Demanda (Clientes)</span>
              <span className="font-bold text-blue-600">{scale}x</span>
            </label>
            <input
              type="range" min="0.5" max="1.8" step="0.1"
              value={scale}
              onChange={(e) => setScale(e.target.value)}
              className="mt-3 w-full cursor-pointer accent-blue-600"
            />
            <span className="text-[11px] text-slate-500">0.8x Pesimista · 1.2x Optimista</span>
          </div>

          <div>
            <label className="flex justify-between text-xs font-semibold text-slate-700">
              <span>Surtido Local Auto Todo</span>
              <span className="font-bold text-blue-600">{plocalMult}x</span>
            </label>
            <input
              type="range" min="0.5" max="1.25" step="0.05"
              value={plocalMult}
              onChange={(e) => setPlocalMult(e.target.value)}
              className="mt-3 w-full cursor-pointer accent-blue-600"
            />
            <span className="text-[11px] text-slate-500">Probabilidad entrega 1 día</span>
          </div>

          <div>
            <label className="flex justify-between text-xs font-semibold text-slate-700">
              <span>Retraso Paquetería Estafeta</span>
              <span className="font-bold text-blue-600">{ltMult}x</span>
            </label>
            <input
              type="range" min="0.8" max="1.6" step="0.1"
              value={ltMult}
              onChange={(e) => setLtMult(e.target.value)}
              className="mt-3 w-full cursor-pointer accent-blue-600"
            />
            <span className="text-[11px] text-slate-500">1.0x Normal · 1.3x Retraso</span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700">Inflación Anual Proyectada</label>
            <input
              type="number" step="0.0025" min="0" max="0.30"
              value={inflacionAnual}
              onChange={(e) => setInflacionAnual(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none"
            />
            <span className="text-[11px] text-slate-500">0.0375 = 3.75% (INEGI Base)</span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700">Réplicas Monte Carlo</label>
            <select
              value={reps}
              onChange={(e) => setReps(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none"
            >
              <option value={100}>100 réplicas (~2 seg)</option>
              <option value={300}>300 réplicas (~5 seg)</option>
              <option value={600}>600 réplicas (Completa)</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end border-t border-slate-200 pt-4">
          <button
            type="submit"
            disabled={running}
            className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:opacity-50"
          >
            {running ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
            {running ? 'Simulando 365 días en Python...' : 'Correr Simulación y Guardar'}
          </button>
        </div>
      </form>
    </Card>
  );
}