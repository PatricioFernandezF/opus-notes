import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-parchment px-5">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-amber/[0.04] blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] rounded-full bg-amber/[0.03] blur-[100px]" />
      </div>

      <div className="w-full max-w-sm relative animate-fade-in">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center mb-5">
            <span className="text-4xl">&#9998;</span>
          </div>
          <h1 className="font-display text-4xl font-light tracking-tight text-ink">
            Opus <span className="font-semibold italic">Notes</span>
          </h1>
          <p className="text-ink-faint mt-2 text-sm tracking-wide uppercase">
            Tu cuaderno personal
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="bg-danger/10 border border-danger/20 text-danger px-4 py-2.5 rounded-lg text-sm animate-fade-in">
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="block text-xs text-ink-faint uppercase tracking-widest font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-parchment-card border border-border rounded-lg px-4 py-3 text-ink placeholder-ink-ghost focus:outline-none focus:border-amber-dim focus:ring-1 focus:ring-amber/20 transition-all duration-200"
              placeholder="tu@email.com"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs text-ink-faint uppercase tracking-widest font-medium">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-parchment-card border border-border rounded-lg px-4 py-3 text-ink placeholder-ink-ghost focus:outline-none focus:border-amber-dim focus:ring-1 focus:ring-amber/20 transition-all duration-200"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full group bg-amber/90 hover:bg-amber disabled:opacity-50 text-parchment font-semibold py-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 mt-2"
          >
            {loading ? (
              <span className="inline-block w-4 h-4 border-2 border-parchment/30 border-t-parchment rounded-full animate-spin" />
            ) : (
              <>
                Entrar
                <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
              </>
            )}
          </button>

          <div className="relative py-3">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-parchment px-3 text-ink-ghost">o</span>
            </div>
          </div>

          <p className="text-center text-sm text-ink-faint">
            ¿Primera vez?{' '}
            <Link to="/register" className="text-amber hover:text-ink transition-colors duration-200 underline underline-offset-4 decoration-amber-dim/40">
              Crear cuenta
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
