import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from 'recharts';
import Card from '../ui/Card';
import SectionHeader from '../ui/SectionHeader';
import { MONTHLY_PROJECTION_DATA } from '../../utils/mockData';
import { formatCurrency } from '../../utils/formatters';

export default function SalesProjectionChart() {
  return (
    <Card className="p-6">
      <SectionHeader
        title="Proyección de Ventas a 12 Meses (Con Inflación y Crecimiento)"
        subtitle="Mediana anual: Base $221,344 · Pesimista $167,310 · Optimista $283,594 MXN"
      />
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={MONTHLY_PROJECTION_DATA} margin={{ top: 10, right: 15, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="mes" tick={{ fontSize: 12 }} />
            <YAxis tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 12 }} />
            <Tooltip formatter={(val) => formatCurrency(val)} />
            <Legend />
            <Line type="monotone" dataKey="Optimista" stroke="#0d9488" strokeWidth={2.5} dot={{ r: 3 }} />
            <Line type="monotone" dataKey="Base" stroke="#162b4d" strokeWidth={2.5} dot={{ r: 3 }} />
            <Line type="monotone" dataKey="Pesimista" stroke="#94a3b8" strokeWidth={2} dot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}