import { History, CheckCircle2 } from 'lucide-react';
import Card from '../ui/Card';
import SectionHeader from '../ui/SectionHeader';
import { formatDate } from '../../utils/formatters';

export default function HistoryDrawer({ history, currentId, onSelect }) {
  return (
    <Card className="p-6">
      <SectionHeader
        title="Historial de Corridas en MongoDB"
        subtitle="Selecciona cualquier simulación guardada anteriormente para inspeccionar sus resultados."
      />

      {history.length === 0 ? (
        <p className="text-sm text-slate-500">
          Aún no hay registros guardados en MongoDB. Corre una simulación arriba para crear el primero.
        </p>
      ) : (
        <div className="divide-y divide-slate-100">
          {history.map((item) => {
            const isSelected = item._id === currentId;
            return (
              <button
                key={item._id}
                onClick={() => onSelect(item._id)}
                className={`flex w-full items-center justify-between px-4 py-3 text-left transition hover:bg-slate-50 ${
                  isSelected ? 'bg-blue-50/50' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <History className="h-4 w-4 text-slate-400" />
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{item.nombre}</p>
                    <p className="text-xs text-slate-500">
                      Demanda: {item.parametros?.scale}x · Local: {item.parametros?.plocal_mult}x · {item.parametros?.reps} réplicas · {formatDate(item.createdAt)}
                    </p>
                  </div>
                </div>
                {isSelected && <CheckCircle2 className="h-5 w-5 text-blue-600" />}
              </button>
            );
          })}
        </div>
      )}
    </Card>
  );
}