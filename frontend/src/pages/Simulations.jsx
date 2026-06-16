import { useEffect, useState } from 'react';
import api from '../api/client';

const STATUS_COLORS = {
  PENDING: 'bg-slate-100 text-slate-600',
  RUNNING: 'bg-amber-100 text-amber-700',
  COMPLETED: 'bg-emerald-100 text-emerald-700',
  FAILED: 'bg-rose-100 text-rose-700'
};

export default function Simulations() {
  const [simulations, setSimulations] = useState([]);
  const [genomes, setGenomes] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ genomeId: '', drugCompound: '', iterations: 1000 });

  const load = async () => {
    const [sims, gs] = await Promise.all([api.get('/simulations'), api.get('/genomes')]);
    setSimulations(sims.data);
    setGenomes(gs.data);
  };

  useEffect(() => {
    load();
    const interval = setInterval(load, 4000);
    return () => clearInterval(interval);
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    await api.post('/simulations', form);
    setShowForm(false);
    setForm({ genomeId: '', drugCompound: '', iterations: 1000 });
    load();
  };

  return (
    <div>
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Drug Discovery Simulations</h1>
          <p className="text-slate-500 text-sm mt-1">
            {simulations.length} simulations · auto-refreshes
          </p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          {showForm ? 'Cancel' : '+ New Simulation'}
        </button>
      </header>

      {showForm && (
        <div className="card p-6 mb-6">
          <h3 className="font-semibold mb-4">Start New Simulation</h3>
          <form onSubmit={submit} className="space-y-3">
            <select
              value={form.genomeId}
              onChange={(e) => setForm({ ...form, genomeId: e.target.value })}
              className="input"
              required
            >
              <option value="">Select genome...</option>
              {genomes.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name} ({g.species})
                </option>
              ))}
            </select>
            <input
              placeholder="Drug compound (e.g., Olaparib)"
              value={form.drugCompound}
              onChange={(e) => setForm({ ...form, drugCompound: e.target.value })}
              className="input"
              required
            />
            <input
              type="number"
              placeholder="Iterations"
              value={form.iterations}
              onChange={(e) => setForm({ ...form, iterations: parseInt(e.target.value) })}
              className="input"
              min="100"
              max="100000"
            />
            <button type="submit" className="btn-primary">Start Simulation</button>
          </form>
        </div>
      )}

      <div className="space-y-3">
        {simulations.map((s) => (
          <div key={s.id} className="card p-5">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="font-semibold">{s.drugCompound}</h3>
                <p className="text-sm text-slate-500 mt-1">
                  Target: {s.genome.name} ({s.genome.species}) · {s.iterations.toLocaleString()} iterations
                </p>
              </div>
              <span className={`badge ${STATUS_COLORS[s.status]}`}>{s.status}</span>
            </div>
            {s.result && (
              <div className="mt-3 p-3 bg-slate-50 rounded-lg text-sm font-mono">
                {s.result}
              </div>
            )}
            <div className="text-xs text-slate-500 mt-2">
              Requested by {s.requestedBy.fullName}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
