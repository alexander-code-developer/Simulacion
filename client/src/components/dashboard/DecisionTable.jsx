import Card from '../ui/Card';
import Badge from '../ui/Badge';
import SectionHeader from '../ui/SectionHeader';
import { formatCurrency, formatPercent, formatNumber } from '../../utils/formatters';

export default function DecisionTable({ results, escenario }) {
  const qrRows = results.filter((r) => r.Escenario === escenario && r.Politica === '(Q,R)');
  const activeQr = qrRows.length > 0 ? qrRows : results.filter((r) => r.Politica === '(Q,R)');

  const monthlyRows = results.filter((r) => r.Escenario === escenario && r.Politica === 'Periódica mensual');

  return (
    <Card className="overflow-hidden">
      <div className="border-b border-slate-200 p-6">
        <SectionHeader
          title="Recetario de Control de Inventario por Familia"
          subtitle="La fórmula clásica sobredimensiona el inventario entre 5 y 10 veces. Usa los parámetros simulados."
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs font-semibold uppercase text-slate-600">
            <tr>
              <th className="px-6 py-3.5">Familia de Refacción</th>
              <th className="px-4 py-3.5">Clase</th>
              <th className="px-4 py-3.5">Demanda/día</th>
              <th className="px-4 py-3.5">ROP Fórmula</th>
              <th className="bg-blue-50/70 px-4 py-3.5 text-navy-900">Punto Reorden (R)</th>
              <th className="bg-blue-50/70 px-4 py-3.5 text-navy-900">Cant. a Pedir (Q)</th>
              <th className="px-4 py-3.5">Nivel S (Mensual)</th>
              <th className="px-4 py-3.5">Nivel Servicio</th>
              <th className="px-4 py-3.5">Costo Anual</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {activeQr.map((row, idx) => {
              const parsedParam = typeof row.Param === 'string' ? JSON.parse(row.Param) : row.Param;
              const mMatch = monthlyRows.find((m) => m.Producto === row.Producto);
              const mParam = mMatch ? (typeof mMatch.Param === 'string' ? JSON.parse(mMatch.Param) : mMatch.Param) : { S: '-' };

              return (
                <tr key={idx} className="transition hover:bg-slate-50/80">
                  <td className="px-6 py-4 font-semibold text-slate-900">{row.Producto}</td>
                  <td className="px-4 py-4">
                    <Badge variant={row.Clase === 'A' ? 'classA' : 'classB'}>
                      Clase {row.Clase}
                    </Badge>
                  </td>
                  <td className="px-4 py-4 text-slate-600">{formatNumber(row.mu, 2)} u/d</td>
                  <td className="px-4 py-4 text-slate-400 line-through">{Math.round(row.rop_doc)} u</td>
                  <td className="bg-blue-50/30 px-4 py-4 font-bold text-blue-700">
                    Pedir si ≤ {parsedParam.R} u
                  </td>
                  <td className="bg-blue-50/30 px-4 py-4 font-bold text-blue-700">
                    {parsedParam.Q} piezas
                  </td>
                  <td className="px-4 py-4 text-slate-700">{mParam.S} u</td>
                  <td className="px-4 py-4 font-semibold text-emerald-600">
                    {formatPercent(row.fill, 1)}
                  </td>
                  <td className="px-4 py-4 font-medium text-slate-900">
                    {formatCurrency(row.total)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}