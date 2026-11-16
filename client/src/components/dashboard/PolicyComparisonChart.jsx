import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from 'recharts';
import Card from '../ui/Card';
import SectionHeader from '../ui/SectionHeader';
import { formatCurrency } from '../../utils/formatters';

export default function PolicyComparisonChart({ results, escenario }) {
  const rowsByEsc = results.filter((r) => r.Escenario === escenario);
  const activeRows = rowsByEsc.length > 0 ? rowsByEsc : results;

  const policies = ['(Q,R)', 'Periódica mensual', 'Periódica quincenal', 'Periódica semanal'];

  const data = policies.map((pol) => {
    const subset = activeRows.filter((r) => r.Politica === pol);
    return {
      name: pol,
      Mantener: Math.round(subset.reduce((acc, r) => acc + r.hold, 0)),
      Pedir: Math.round(subset.reduce((acc, r) => acc + r.ordc, 0)),
      Desabasto: Math.round(subset.reduce((acc, r) => acc + r.lost, 0))
    };
  });

  return (
    <Card className="p-6">
      <SectionHeader
        title="Composición del Costo Anual por Política"
        subtitle={`Suma de las 6 familias · Escenario ${escenario} (MXN)`}
      />
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 15, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tickFormatter={(v) => `$${v.toLocaleString()}`} tick={{ fontSize: 12 }} />
            <Tooltip formatter={(val) => formatCurrency(val)} />
            <Legend />
            <Bar dataKey="Mantener" stackId="cost" fill="#162b4d" name="Mantener inventario (25%)" />
            <Bar dataKey="Pedir" stackId="cost" fill="#d97706" name="Colocar pedidos ($60 c/u)" />
            <Bar dataKey="Desabasto" stackId="cost" fill="#94a3b8" name="Margen perdido por desabasto" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}