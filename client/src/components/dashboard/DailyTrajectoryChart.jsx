import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
  ReferenceLine
} from 'recharts';
import Card from '../ui/Card';
import SectionHeader from '../ui/SectionHeader';

export default function DailyTrajectoryChart({ trayectoria = [] }) {
  if (!trayectoria || trayectoria.length === 0) return null;

  const ropValue = trayectoria[0]?.ROP || 10;

  return (
    <Card className="p-6">
      <SectionHeader
        title="Comportamiento Diario de Existencias (Aceite de Motor · 120 Días)"
        subtitle="Comparación visual (diente de sierra) entre Política Continua (Q,R) y Revisión Mensual"
      />
      <div className="h-[320px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={trayectoria} margin={{ top: 10, right: 15, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="dia" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Legend />
            <ReferenceLine
              y={ropValue}
              stroke="#d97706"
              strokeDasharray="4 4"
              label={{
                value: `ROP (${ropValue})`,
                position: 'insideTopRight',
                fontSize: 11,
                fill: '#d97706'
              }}
            />
            <Line
              type="stepAfter"
              dataKey="QR"
              stroke="#162b4d"
              strokeWidth={2}
              dot={false}
              name="Existencias (Q,R)"
            />
            <Line
              type="stepAfter"
              dataKey="Mensual"
              stroke="#0d9488"
              strokeWidth={1.8}
              dot={false}
              name="Existencias Periódica Mensual"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}