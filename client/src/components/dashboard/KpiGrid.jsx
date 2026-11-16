import { ShoppingBag, Truck, Percent, Wallet } from 'lucide-react';
import Card from '../ui/Card';
import { formatCurrency, formatPercent } from '../../utils/formatters';

export default function KpiGrid({ results, escenario }) {
  const qrRows = results.filter((r) => r.Escenario === escenario && r.Politica === '(Q,R)');
  const fallbackRows = qrRows.length > 0 ? qrRows : results.filter((r) => r.Politica === '(Q,R)');

  const avgFill = fallbackRows.reduce((acc, r) => acc + r.fill, 0) / (fallbackRows.length || 1);
  const totalCost = fallbackRows.reduce((acc, r) => acc + r.total, 0);
  const totalOrders = Math.round(fallbackRows.reduce((acc, r) => acc + r.orders, 0));
  const totalCapital = fallbackRows.reduce((acc, r) => acc + r.inv_cap, 0);

  const kpis = [
    {
      label: 'Nivel de Servicio (Q,R)',
      value: formatPercent(avgFill, 1),
      detail: 'Meta: ≥95% Clase A · ≥90% Clase B',
      icon: Percent,
      iconBg: 'bg-emerald-50 text-emerald-600'
    },
    {
      label: 'Costo Operativo Anual',
      value: formatCurrency(totalCost),
      detail: `${totalOrders} pedidos/año · Ahorro 51% vs fórmula`,
      icon: Wallet,
      iconBg: 'bg-blue-50 text-blue-600'
    },
    {
      label: 'Capital en Inventario',
      value: formatCurrency(totalCapital),
      detail: '68% menos capital detenido vs fórmula ($40,192)',
      icon: ShoppingBag,
      iconBg: 'bg-indigo-50 text-indigo-600'
    },
    {
      label: 'Tiempo Entrega Auto Todo',
      value: '1 d / 7 d',
      detail: 'Local 1 día · Paquetería Estafeta hasta 10.5 d',
      icon: Truck,
      iconBg: 'bg-amber-50 text-amber-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {kpis.map((item, idx) => {
        const Icon = item.icon;
        return (
          <Card key={idx} className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                {item.label}
              </span>
              <span className={`rounded-lg p-2 ${item.iconBg}`}>
                <Icon className="h-4 w-4" />
              </span>
            </div>
            <p className="mt-3 text-2xl font-bold text-slate-900">{item.value}</p>
            <p className="mt-1 text-xs text-slate-500">{item.detail}</p>
          </Card>
        );
      })}
    </div>
  );
}