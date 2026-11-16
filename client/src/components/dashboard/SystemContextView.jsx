import Card from '../ui/Card';
import SectionHeader from '../ui/SectionHeader';
import { Store, Wrench, Truck, Car } from 'lucide-react';

export default function SystemContextView() {
  const blocks = [
    {
      title: 'El Negocio Modelado (Actopan, Hidalgo)',
      desc: 'Mini refaccionaria familiar operada desde casa en horario abierto sin días de cierre. Calibrada con 413 tickets pagados del POS (julio 2025 – octubre 2026) con media de 1.13 tickets/día.',
      icon: Store
    },
    {
      title: 'Frontera: Taller Mecánico Familiar',
      desc: 'El taller contiguo de la misma familia queda fuera de la simulación como entorno del sistema, ya que maneja su propia mano de obra, órdenes de reparación y contabilidad independiente.',
      icon: Wrench
    },
    {
      title: 'Abastecimiento: Auto Todo',
      desc: 'Surtido dual: 1 día cuando hay existencia en almacén local (80% prob. en Clase A) y distribución Triangular(4, 6.5, 10.5 días) cuando se envía por paquetería Estafeta.',
      icon: Truck
    },
    {
      title: 'Parque Vehicular Local',
      desc: 'Dominado por compactos de uso diario (Chevrolet Chevy, Captiva, Aveo, Nissan Tsuru, Ford Fiesta) y pick-ups de trabajo (Ram, Nissan D21, NP300, Chevrolet C1500).',
      icon: Car
    }
  ];

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <SectionHeader
          title="Definición del Sistema y Frontera del Modelo"
          subtitle="Resumen metodológico del Avance 2 · Simulación de eventos discretos a 365 días"
        />
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {blocks.map((b, i) => {
            const Icon = b.icon;
            return (
              <div key={i} className="flex gap-4 rounded-xl border border-slate-100 bg-slate-50/70 p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-navy-900 text-white">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{b.title}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-slate-600">{b.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}