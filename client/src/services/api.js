const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

export const api = {
  async login(email, password) {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Error al iniciar sesión');
    return data;
  },

  // Configuración Global (IVA, costos, tiempos)
  async getConfig() {
    const res = await fetch(`${BASE_URL}/inventory/config`, { headers: getHeaders() });
    return res.json();
  },
  async updateConfig(payload) {
    const res = await fetch(`${BASE_URL}/inventory/config`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Error guardando configuración');
    return res.json();
  },

  // Productos CRUD
  async getInventory() {
    const res = await fetch(`${BASE_URL}/inventory`, { headers: getHeaders() });
    return res.json();
  },
  async createProduct(payload) {
    const res = await fetch(`${BASE_URL}/inventory`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Error creando producto');
    return data;
  },
  async updateProduct(id, payload) {
    const res = await fetch(`${BASE_URL}/inventory/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Error editando producto');
    return data;
  },
  async toggleProduct(id) {
    const res = await fetch(`${BASE_URL}/inventory/${id}/toggle`, {
      method: 'PATCH',
      headers: getHeaders()
    });
    return res.json();
  },
  async registerMovement(productId, tipo, cantidad, nota) {
    const res = await fetch(`${BASE_URL}/inventory/${productId}/movement`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ tipo, cantidad, nota })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Error registrando movimiento');
    return data;
  },
  async applyPolicies(chosen) {
    const res = await fetch(`${BASE_URL}/inventory/apply-policies`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ chosen })
    });
    return res.json();
  },

  // Simulaciones
  async getLatestSimulation() {
    const res = await fetch(`${BASE_URL}/simulations/latest`, { headers: getHeaders() });
    return res.json();
  },
  async getSimulationHistory() {
    const res = await fetch(`${BASE_URL}/simulations/history`, { headers: getHeaders() });
    return res.json();
  },
  async getSimulationById(id) {
    const res = await fetch(`${BASE_URL}/simulations/${id}`, { headers: getHeaders() });
    return res.json();
  },
  async runSimulation(payload) {
    const res = await fetch(`${BASE_URL}/simulations/run`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Error ejecutando simulación');
    return data;
  }
};