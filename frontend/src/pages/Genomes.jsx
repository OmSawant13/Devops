import { useEffect, useState } from 'react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function Genomes() {
  const { user } = useAuth();
  const [genomes, setGenomes] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', species: '', sequence: '', description: '' });

  const canUpload = user?.role === 'ADMIN' || user?.role === 'SCIENTIST';

  const load = async () => {
    const res = await api.get('/genomes');
    setGenomes(res.data);
  };

  useEffect(() => {
    load();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    await api.post('/genomes', form);
    setShowForm(false);
    setForm({ name: '', species: '', sequence: '', description: '' });
    load();
  };

  return (
    <div>
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Genome Sequences</h1>
          <p className="text-slate-500 text-sm mt-1">{genomes.length} sequences in library</p>
        </div>
        {canUpload && (
          <button onClick={() => setShowForm(!showForm)} className="btn-primary">
            {showForm ? 'Cancel' : '+ Upload Sequence'}
          </button>
        )}
      </header>

      {showForm && (
        <div className="card p-6 mb-6">
          <h3 className="font-semibold mb-4">New Genome Sequence</h3>
          <form onSubmit={submit} className="space-y-3">
            <input
              placeholder="Name (e.g., BRCA1 Variant)"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="input"
              required
            />
            <input
              placeholder="Species (e.g., Homo sapiens)"
              value={form.species}
              onChange={(e) => setForm({ ...form, species: e.target.value })}
              className="input"
              required
            />
            <textarea
              placeholder="Sequence (ATCG...)"
              value={form.sequence}
              onChange={(e) => setForm({ ...form, sequence: e.target.value })}
              className="input font-mono text-sm"
              rows="4"
              required
            />
            <textarea
              placeholder="Description (optional)"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="input"
              rows="2"
            />
            <button type="submit" className="btn-primary">Upload</button>
          </form>
        </div>
      )}

      <div className="space-y-3">
        {genomes.map((g) => (
          <div key={g.id} className="card p-5">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{g.name}</h3>
                  <span className="badge bg-mint-50 text-mint-600">{g.species}</span>
                </div>
                {g.description && (
                  <p className="text-sm text-slate-600 mt-1">{g.description}</p>
                )}
                <div className="font-mono text-xs text-slate-500 mt-2 truncate">
                  {g.sequence.substring(0, 80)}...
                </div>
                <div className="text-xs text-slate-500 mt-2">
                  Uploaded by {g.uploadedBy.fullName} · {g._count.simulations} simulations
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
