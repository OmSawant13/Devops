import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { to: '/', label: 'Dashboard', icon: '⚡' },
    { to: '/genomes', label: 'Genomes', icon: '🧬' },
    { to: '/simulations', label: 'Simulations', icon: '🔬' }
  ];

  return (
    <div className="min-h-screen flex bg-slate-50">
      <aside className="w-64 bg-navy-900 text-white flex flex-col">
        <div className="p-6 border-b border-navy-800">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <span className="text-mint-400">⬢</span> GenomeX
          </h1>
          <p className="text-xs text-slate-400 mt-1">Drug Discovery Platform</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition ${
                  isActive
                    ? 'bg-navy-700 text-mint-400'
                    : 'text-slate-300 hover:bg-navy-800'
                }`
              }
            >
              <span>{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-navy-800">
          <div className="text-sm mb-2">
            <div className="font-medium">{user?.fullName}</div>
            <div className="text-xs text-slate-400">{user?.email}</div>
            <div className="text-xs text-mint-400 mt-1">{user?.role}</div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full text-left text-sm text-slate-400 hover:text-white py-2"
          >
            ↪ Sign out
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <div className="p-8 max-w-6xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
