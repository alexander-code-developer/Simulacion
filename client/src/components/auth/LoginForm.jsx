import { useState } from 'react';
import { Wrench, Lock, Mail, Loader2, LogIn } from 'lucide-react';
import { api } from '../../services/api';

export default function LoginForm({ onLoginSuccess }) {
  const [email, setEmail] = useState('dueno@refaccionaria.mx');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = await api.login(email, password);
      onLoginSuccess(data.user, data.token);
    } catch (err) {
      setError(err.message || 'No se pudo conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-md">
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 text-white" style={{ backgroundColor: '#0f172a', color: '#ffffff' }}>
            <Wrench className="h-6 w-6" />
          </div>
          <h1 className="mt-4 text-xl font-bold text-slate-900">
            Refaccionaria Automotriz Actopan
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            Acceso al Sistema de Inventario Real y Simulación Monte Carlo
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-xs font-medium text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700">
              Correo electrónico
            </label>
            <div className="relative mt-1">
              <Mail className="absolute top-2.5 left-3 h-4 w-4 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white py-2 pr-3 pl-9 text-sm text-slate-900 focus:border-blue-600 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700">
              Contraseña
            </label>
            <div className="relative mt-1">
              <Lock className="absolute top-2.5 left-3 h-4 w-4 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white py-2 pr-3 pl-9 text-sm text-slate-900 focus:border-blue-600 focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{ backgroundColor: '#0f172a', color: '#ffffff' }}
            className="mt-3 flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <LogIn className="h-4 w-4" />
            )}
            {loading ? 'Verificando acceso...' : 'Ingresar al Sistema'}
          </button>
        </form>
      </div>
    </div>
  );
}