import { Wrench, Package, BarChart3, PlayCircle, Info } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, escenario, setEscenario }) {
  const tabs = [
    { id: 'inventario', label: 'Inventario Real y Catálogo', icon: Package },
    { id: 'resultados', label: 'Resultados y Predicciones', icon: BarChart3 },
    { id: 'simulador', label: 'Simulador Monte Carlo', icon: PlayCircle },
    { id: 'sistema', label: 'Contexto del Negocio', icon: Info }
  ];

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur-xs">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-navy-900 text-white shadow-xs">
              <Wrench className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-base font-bold text-slate-900 sm:text-lg">
                Refaccionaria Automotriz Actopan
              </h1>
              <p className="text-xs text-slate-500">
                Simulación Monte Carlo de Inventarios · ITSOEH
              </p>
            </div>
          </div>

          {activeTab === 'resultados' && (
            <div className="flex items-center gap-2">
              <span className="hidden text-xs font-medium text-slate-500 sm:inline">Escenario:</span>
              <div className="inline-flex rounded-lg bg-slate-100 p-1">
                {['Pesimista', 'Base', 'Optimista'].map((esc) => (
                  <button
                    key={esc}
                    onClick={() => setEscenario(esc)}
                    className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                      escenario === esc
                        ? 'bg-white text-navy-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {esc}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <nav className="-mb-px flex space-x-6 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 whitespace-nowrap border-b-2 py-3 text-sm font-medium transition ${
                  active
                    ? 'border-navy-900 text-navy-900'
                    : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700'
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}