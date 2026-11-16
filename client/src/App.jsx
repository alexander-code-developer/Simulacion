import { useState, useEffect, useCallback } from 'react';
import { api } from './services/api';
import { useAuth } from './hooks/useAuth';
import LoginForm from './components/auth/LoginForm';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import KpiGrid from './components/dashboard/KpiGrid';
import PolicyComparisonChart from './components/dashboard/PolicyComparisonChart';
import SalesProjectionChart from './components/dashboard/SalesProjectionChart';
import DailyTrajectoryChart from './components/dashboard/DailyTrajectoryChart';
import DecisionTable from './components/dashboard/DecisionTable';
import SystemContextView from './components/dashboard/SystemContextView';
import RealInventoryPanel from './components/inventory/RealInventoryPanel';
import ConfigPanel from './components/inventory/ConfigPanel';
import LiveSimulatorForm from './components/simulator/LiveSimulatorForm';
import HistoryDrawer from './components/simulator/HistoryDrawer';
import { Play, LogOut, CheckCircle, Loader2 } from 'lucide-react';

export default function App() {
  const { user, checkingAuth, loginSuccess, logout } = useAuth();

  const [activeTab, setActiveTab] = useState('inventario');
  const [escenario, setEscenario] = useState('Base');

  const [products, setProducts] = useState([]);
  const [config, setConfig] = useState(null);
  const [simulation, setSimulation] = useState(null);
  const [history, setHistory] = useState([]);

  const [loadingData, setLoadingData] = useState(false);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState(null);

  const loadAllFromDB = useCallback(async () => {
    if (!user) return;
    setLoadingData(true);
    try {
      const [invData, cfgData, latestSim, histData] = await Promise.all([
        api.getInventory(),
        api.getConfig(),
        api.getLatestSimulation(),
        api.getSimulationHistory()
      ]);

      if (Array.isArray(invData)) setProducts(invData);
      if (cfgData) setConfig(cfgData);
      if (latestSim && latestSim.results) setSimulation(latestSim);
      if (Array.isArray(histData)) setHistory(histData);
    } catch (err) {
      console.error('Error cargando datos de MongoDB:', err);
      if (err.message?.includes('401') || err.message?.includes('Token')) {
        logout();
      }
    } finally {
      setLoadingData(false);
    }
  }, [user, logout]);

  useEffect(() => {
    loadAllFromDB();
  }, [loadAllFromDB]);

  const handleRunSimulation = async (params) => {
    setRunning(true);
    setError(null);
    try {
      const newSim = await api.runSimulation(params);
      setSimulation(newSim);
      const hist = await api.getSimulationHistory();
      if (Array.isArray(hist)) setHistory(hist);
      setActiveTab('resultados');
    } catch (err) {
      setError(err.message);
    } finally {
      setRunning(false);
    }
  };

  const handleApplyPoliciesToRealInventory = async () => {
    if (!simulation?.chosen) return;
    try {
      const res = await api.applyPolicies(simulation.chosen);
      if (res.products) setProducts(res.products);
      alert('✅ Los puntos de reorden (R) y cantidades (Q) óptimos se aplicaron al inventario real en MongoDB.');
    } catch (err) {
      alert(err.message);
    }
  };

  // Pantalla de carga mientras verifica JWT inicial
  if (checkingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <Loader2 className="h-8 w-8 animate-spin text-navy-900" />
      </div>
    );
  }

  // Si no hay sesión JWT válida, mostrar Login
  if (!user) {
    return <LoginForm onLoginSuccess={loginSuccess} />;
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      {/* Barra superior de sesión activa */}
      <div className="border-b border-slate-800 bg-navy-900 px-4 py-2 text-xs text-slate-200 sm:px-6">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <span>
            Sesión activa: <strong>{user.nombre}</strong> ({user.email})
          </span>
          <button
            onClick={logout}
            className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-slate-300 transition hover:bg-slate-800 hover:text-white"
          >
            <LogOut className="h-3.5 w-3.5" /> Cerrar sesión
          </button>
        </div>
      </div>

      {/* Navegación principal */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        escenario={escenario}
        setEscenario={setEscenario}
      />

      {/* Contenido Dinámico */}
      <main className="mx-auto w-full max-w-7xl flex-1 space-y-6 px-4 py-8 sm:px-6">
        {loadingData && products.length === 0 ? (
          <div className="flex items-center justify-center py-20 text-sm text-slate-500">
            <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Cargando datos reales desde MongoDB...
          </div>
        ) : (
          <>
            {/* PESTAÑA 1: Inventario Real + CRUD Productos + Configuración Global (IVA/Costos) */}
            {activeTab === 'inventario' && (
              <div className="space-y-6">
                <RealInventoryPanel
                  products={products}
                  config={config}
                  onInventoryUpdated={loadAllFromDB}
                />
                <ConfigPanel
                  config={config}
                  onConfigSaved={(newCfg) => setConfig(newCfg)}
                />
              </div>
            )}

            {/* PESTAÑA 2: Resultados Monte Carlo y Predicciones */}
            {activeTab === 'resultados' && (
              !simulation ? (
                <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center">
                  <h3 className="text-base font-bold text-slate-900">
                    Aún no hay simulaciones ejecutadas en MongoDB
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Corre la primera simulación Monte Carlo usando los productos activos y el IVA actual de tu catálogo.
                  </p>
                  <button
                    onClick={() =>
                      handleRunSimulation({
                        nombre: 'Corrida Base Actopan',
                        scale: 1.0,
                        plocal_mult: 1.0,
                        lt_mult: 1.0,
                        inflacion_anual: 0.0375,
                        crecimiento_mensual: 0.01,
                        reps: 300
                      })
                    }
                    disabled={running}
                    className="mt-5 inline-flex items-center gap-2 rounded-lg bg-navy-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-navy-800 disabled:opacity-50"
                  >
                    {running ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
                    {running ? 'Simulando 365 días en Python...' : 'Ejecutar Primera Simulación'}
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-5 py-3.5 shadow-xs">
                    <div className="text-xs">
                      <span className="text-slate-500">Simulación en pantalla: </span>
                      <strong className="text-slate-900">{simulation.nombre}</strong>
                      <span className="ml-2 text-slate-400">
                        ({simulation.parametros?.reps} réplicas · IVA {((simulation.parametros?.iva ?? 0.16) * 100).toFixed(0)}%)
                      </span>
                    </div>
                    <button
                      onClick={handleApplyPoliciesToRealInventory}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-emerald-700"
                    >
                      <CheckCircle className="h-4 w-4" /> Aplicar estos R y Q al Inventario Real
                    </button>
                  </div>

                  <KpiGrid results={simulation.results} escenario={escenario} />

                  <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <PolicyComparisonChart results={simulation.results} escenario={escenario} />
                    <SalesProjectionChart proyeccion={simulation.proyeccion12Meses} />
                  </div>

                  <DailyTrajectoryChart trayectoria={simulation.trayectoriaDiaria} />
                  <DecisionTable results={simulation.results} escenario={escenario} />
                </>
              )
            )}

            {/* PESTAÑA 3: Simulador Interactivo + Historial MongoDB */}
            {activeTab === 'simulador' && (
              <div className="space-y-6">
                <LiveSimulatorForm
                  onRun={handleRunSimulation}
                  running={running}
                  error={error}
                />
                <HistoryDrawer
                  history={history}
                  currentId={simulation?._id}
                  onSelect={async (id) => {
                    const sim = await api.getSimulationById(id);
                    if (sim) {
                      setSimulation(sim);
                      setActiveTab('resultados');
                    }
                  }}
                />
              </div>
            )}

            {/* PESTAÑA 4: Contexto Metodológico del Negocio */}
            {activeTab === 'sistema' && <SystemContextView />}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}