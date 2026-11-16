import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import Simulation from '../models/Simulation.js';
import Product from '../models/Product.js';
import SystemConfig from '../models/SystemConfig.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const runAndSaveSimulation = async (req, res) => {
  try {
    const {
      nombre = 'Simulación Personalizada',
      scale = 1.0,
      plocal_mult = 1.0,
      lt_mult = 1.0,
      inflacion_anual = 0.0375,
      crecimiento_mensual = 0.01,
      reps = 300
    } = req.body;

    const [activeProducts, config] = await Promise.all([
      Product.find({ activo: true }),
      SystemConfig.findOne()
    ]);

    if (activeProducts.length === 0) {
      return res.status(400).json({ error: 'No hay productos activos para simular.' });
    }

    const payloadForPython = {
      scale,
      plocal_mult,
      lt_mult,
      inflacion_anual,
      crecimiento_mensual,
      reps,
      config: {
        iva: config?.iva ?? 0.16,
        incluir_iva: config?.incluirIvaEnPrecios ?? true,
        h_rate: config?.hRate ?? 0.25,
        k_order: config?.kOrder ?? 60,
        lam_t: config?.lamT ?? 1.1337,
        var_t: config?.varT ?? 1.8776,
        rev_mean: config?.revMean ?? 555.0,
        rev_max: config?.revMax ?? 3405.0,
        lt_local: config?.ltLocal ?? 1.0,
        lt_paq: [
          config?.ltPaqMin ?? 4.0,
          config?.ltPaqMode ?? 6.5,
          config?.ltPaqMax ?? 10.5
        ]
      },
      productos: activeProducts.map((p) => ({
        nombre: p.nombre,
        clase: p.clase,
        share: p.participacionVentas,
        precio: p.precioVenta,
        costo: p.costoUnitario,
        plocal: p.probLocal
      }))
    };

    const scriptPath = path.join(__dirname, '../python/sim_engine.py');
    const pythonCmd = process.env.PYTHON_CMD || 'python';
    const pyProcess = spawn(pythonCmd, [scriptPath]);

    pyProcess.on('error', (err) => {
      console.error('❌ No se pudo iniciar Python:', err.message);
      if (!res.headersSent) {
        return res.status(500).json({
          error: `No se encontró el comando "${pythonCmd}". Cambia PYTHON_CMD=py en server/.env`
        });
      }
    });

    pyProcess.stdin.write(JSON.stringify(payloadForPython));
    pyProcess.stdin.end();

    let stdoutData = '';
    let stderrData = '';
    pyProcess.stdout.on('data', (chunk) => { stdoutData += chunk.toString(); });
    pyProcess.stderr.on('data', (chunk) => { stderrData += chunk.toString(); });

    pyProcess.on('close', async (code) => {
      if (res.headersSent) return;
      if (code !== 0) {
        console.error('❌ Error en script Python:\n', stderrData);
        return res.status(500).json({
          error: `Error Python: ${stderrData.split('\n').filter(Boolean).pop() || 'Fallo en ejecución'}`
        });
      }

      try {
        const parsed = JSON.parse(stdoutData);
        const newSim = await Simulation.create({
          nombre,
          parametros: { scale, plocal_mult, lt_mult, inflacion_anual, crecimiento_mensual, reps, iva: config?.iva ?? 0.16 },
          chosen: parsed.chosen,
          results: parsed.results,
          proyeccion12Meses: parsed.proyeccion12Meses,
          trayectoriaDiaria: parsed.trayectoriaDiaria
        });
        res.status(201).json(newSim);
      } catch (err) {
        console.error('❌ Salida inválida de Python:', stdoutData);
        res.status(500).json({ error: 'Salida JSON inválida desde Python' });
      }
    });
  } catch (error) {
    console.error('❌ Error controlador:', error);
    res.status(500).json({ error: error.message });
  }
};

export const getLatestSimulation = async (req, res) => {
  const latest = await Simulation.findOne().sort({ createdAt: -1 });
  res.json(latest || null);
};

export const getSimulationHistory = async (req, res) => {
  const history = await Simulation.find({}, 'nombre parametros createdAt').sort({ createdAt: -1 }).limit(15);
  res.json(history);
};

export const getSimulationById = async (req, res) => {
  const sim = await Simulation.findById(req.params.id);
  if (!sim) return res.status(404).json({ error: 'No encontrada' });
  res.json(sim);
};