import { useState, useEffect, useCallback } from 'react';
import { simulationService } from '../services/api';
import { INITIAL_MOCK_SIMULATION } from '../utils/mockData';

export function useSimulation() {
  const [simulation, setSimulation] = useState(INITIAL_MOCK_SIMULATION);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState(null);
  const [isUsingMock, setIsUsingMock] = useState(true);

  const loadInitialData = useCallback(async () => {
    setLoading(true);
    try {
      const [latest, histList] = await Promise.all([
        simulationService.getLatest(),
        simulationService.getHistory()
      ]);
      if (latest && latest.results && latest.results.length > 0) {
        setSimulation(latest);
        setIsUsingMock(false);
      }
      if (Array.isArray(histList)) setHistory(histList);
    } catch {
      // Si el backend aún no está encendido, mantiene los datos reales precargados
      setIsUsingMock(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  const executeNewSimulation = async (params) => {
    setRunning(true);
    setError(null);
    try {
      const newSim = await simulationService.runSimulation(params);
      setSimulation(newSim);
      setIsUsingMock(false);
      const updatedHistory = await simulationService.getHistory();
      setHistory(updatedHistory);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setRunning(false);
    }
  };

  const selectFromHistory = async (id) => {
    setLoading(true);
    try {
      const sim = await simulationService.getById(id);
      setSimulation(sim);
      setIsUsingMock(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    simulation,
    history,
    loading,
    running,
    error,
    isUsingMock,
    executeNewSimulation,
    selectFromHistory
  };
}