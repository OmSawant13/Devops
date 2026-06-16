import { useEffect, useState } from 'react';
import api from '../api/client';

export default function Dashboard() {
  const [stats, setStats] = useState({ genomes: 0, simulations: 0, running: 0, completed: 0 });

  useEffect(() => {
    const load = async () => {
      try {
        const [genomes, sims] = await Promise.all([
          api.get('/genomes'),
          api.get('/simulations')
        ]);
        setStats({
          genomes: genomes.data.length,
          simulations: sims.data.length,
          running: sims.data.filter((s) => s.status === 'RUNNING' || s.status === 'PENDING').length,
          completed: sims.data.filter((s) => s.status === 'COMPLETED').length
        });
      } catch (e) {
        console.error(e);
      }
    };
    load();
  }, []);

  const cards = [
    { label: 'Genome Sequences', value: stats.genomes, color: 'text-mint-600' },
    { label: 'Total Simulations', value: stats.simulations, color: 'text-blue-600' },
    { label: 'Running', value: stats.running, color: 'text-amber-600' },
    { label: 'Completed', value: stats.completed, color: 'text-emerald-600' }
  ];

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-slate-500 text-sm mt-1">
          Real-time overview of drug discovery operations
        </p>
      </header>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((c) => (
          <div key={c.label} className="card p-5">
            <div className="text-sm text-slate-500">{c.label}</div>
            <div className={`text-3xl font-bold mt-2 ${c.color}`}>{c.value}</div>
          </div>
        ))}
      </div>

      <div className="card p-6">
        <h2 className="font-semibold mb-4">Platform Capabilities</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="flex gap-3">
            <span className="text-mint-500">⬢</span>
            <div>
              <div className="font-medium">Genomic Analytics</div>
              <div className="text-slate-500">DNA sequence storage & analysis</div>
            </div>
          </div>
          <div className="flex gap-3">
            <span className="text-mint-500">⬢</span>
            <div>
              <div className="font-medium">Molecular Simulations</div>
              <div className="text-slate-500">AI-driven drug-target binding</div>
            </div>
          </div>
          <div className="flex gap-3">
            <span className="text-mint-500">⬢</span>
            <div>
              <div className="font-medium">Compliance Audit</div>
              <div className="text-slate-500">FDA/HIPAA traceability logs</div>
            </div>
          </div>
          <div className="flex gap-3">
            <span className="text-mint-500">⬢</span>
            <div>
              <div className="font-medium">Multi-tenant RBAC</div>
              <div className="text-slate-500">Role-based scientist access</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
