import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const quickLogin = (em) => {
    setEmail(em);
    setPassword('Password@123');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-navy-900 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white flex items-center justify-center gap-2">
            <span className="text-mint-400">⬢</span> GenomeX
          </h1>
          <p className="text-slate-400 mt-2">Drug Discovery Platform</p>
        </div>

        <div className="card p-8">
          <h2 className="text-xl font-semibold mb-6">Sign in</h2>

          {error && (
            <div className="mb-4 p-3 bg-rose-50 text-rose-700 text-sm rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
                required
              />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-200">
            <p className="text-xs text-slate-500 mb-3">Quick login (demo):</p>
            <div className="space-y-2">
              <button
                onClick={() => quickLogin('admin@genomex.io')}
                className="w-full text-left text-sm px-3 py-2 bg-slate-50 hover:bg-slate-100 rounded-lg"
              >
                <span className="font-medium">Admin</span>
                <span className="text-slate-500"> · admin@genomex.io</span>
              </button>
              <button
                onClick={() => quickLogin('scientist@genomex.io')}
                className="w-full text-left text-sm px-3 py-2 bg-slate-50 hover:bg-slate-100 rounded-lg"
              >
                <span className="font-medium">Scientist</span>
                <span className="text-slate-500"> · scientist@genomex.io</span>
              </button>
              <button
                onClick={() => quickLogin('researcher@genomex.io')}
                className="w-full text-left text-sm px-3 py-2 bg-slate-50 hover:bg-slate-100 rounded-lg"
              >
                <span className="font-medium">Researcher</span>
                <span className="text-slate-500"> · researcher@genomex.io</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
