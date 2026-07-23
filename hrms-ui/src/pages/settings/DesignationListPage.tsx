import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Pencil, Trash2, Check, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const DesignationListPage = () => {
  const navigate = useNavigate();
  const [designations, setDesignations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Add form state
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [saving, setSaving] = useState(false);

  // Edit state
  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editDesc, setEditDesc] = useState('');

  const fetchDesignations = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/settings/designations', {
        headers: {  }
      });
      if (response.ok) {
        setDesignations(await response.json());
      }
    } catch (error) {
      console.error('Failed to fetch designations', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDesignations();
  }, []);

  const handleAdd = async () => {
    if (!newName.trim()) return;
    setSaving(true);
    try {
      const res = await fetch('http://localhost:3001/api/settings/designations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName.trim(), description: newDesc.trim() }),
      });
      if (res.ok) {
        setNewName('');
        setNewDesc('');
        setIsAdding(false);
        await fetchDesignations();
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to add designation');
      }
    } catch (e) {
      alert('Network error. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async (id: string) => {
    if (!editName.trim()) return;
    try {
      const res = await fetch(`http://localhost:3001/api/settings/designations/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editName.trim(), description: editDesc.trim() }),
      });
      if (res.ok) {
        setEditId(null);
        await fetchDesignations();
      }
    } catch (e) {
      alert('Network error. Please try again.');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Delete designation "${name}"?`)) return;
    try {
      const res = await fetch(`http://localhost:3001/api/settings/designations/${id}`, {
        method: 'DELETE',
        headers: {  },
      });
      if (res.ok) {
        await fetchDesignations();
      }
    } catch (e) {
      alert('Network error. Please try again.');
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto pb-10">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1 tracking-tight">Designation List</h1>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-emerald-500 font-medium">Employee Configuration</span>
            <span className="text-slate-300">›</span>
            <span className="text-slate-500">Designation List</span>
          </div>
        </div>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-indigo-100 text-indigo-600 rounded-full text-sm font-semibold hover:bg-indigo-50 shadow-sm transition-colors mt-2"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
      </div>

      <div className="bg-white dark:bg-card border border-border shadow-sm rounded-xl overflow-hidden mt-2">
        {/* Gradient Header Bar */}
        <div className="h-14 bg-gradient-to-r from-[#9db7d3] to-[#a2dfc8] px-4 flex items-center justify-end">
          <button
            onClick={() => { setIsAdding(true); setNewName(''); setNewDesc(''); }}
            className="flex items-center gap-2 px-4 py-2 bg-white text-indigo-600 rounded-full text-sm font-semibold hover:bg-slate-50 shadow-sm transition-colors"
          >
            <Plus className="h-4 w-4" /> Add Designation
          </button>
        </div>

        {/* Inline Add Form */}
        {isAdding && (
          <div className="p-4 bg-indigo-50 border-b border-indigo-100 flex flex-wrap gap-3 items-end">
            <div className="flex-1 min-w-[180px]">
              <label className="block text-xs font-semibold text-slate-600 mb-1">Designation Name <span className="text-red-500">*</span></label>
              <input
                type="text"
                autoFocus
                value={newName}
                onChange={e => setNewName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAdd()}
                placeholder="e.g. Software Engineer"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:border-indigo-500 bg-white"
              />
            </div>
            <div className="flex-[2] min-w-[240px]">
              <label className="block text-xs font-semibold text-slate-600 mb-1">Description</label>
              <input
                type="text"
                value={newDesc}
                onChange={e => setNewDesc(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAdd()}
                placeholder="Optional description"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:border-indigo-500 bg-white"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleAdd}
                disabled={saving || !newName.trim()}
                className="flex items-center gap-2 px-4 py-2 bg-[#0d9488] text-white rounded-lg text-sm font-medium hover:bg-teal-700 disabled:opacity-50 transition-colors"
              >
                <Check className="h-4 w-4" /> {saving ? 'Saving...' : 'Save'}
              </button>
              <button
                onClick={() => setIsAdding(false)}
                className="px-4 py-2 border border-slate-300 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-100 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Table Section */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-slate-600 dark:text-slate-300">
            <thead className="bg-[#f0f4f8] text-slate-700 font-bold border-b border-border">
              <tr>
                <th className="px-6 py-4 font-bold text-slate-800 text-left">Designation <span className="text-slate-400 font-normal opacity-50 ml-1">↑↓</span></th>
                <th className="px-6 py-4 font-bold text-slate-800 text-left">Description <span className="text-slate-400 font-normal opacity-50 ml-1">↑↓</span></th>
                <th className="px-6 py-4 font-bold text-slate-800 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr><td colSpan={3} className="px-6 py-8 text-slate-500 text-center font-medium">Loading designations...</td></tr>
              ) : designations.length === 0 ? (
                <tr><td colSpan={3} className="px-6 py-8 text-slate-500 text-center font-medium">No designations found. Click "Add Designation" to create one.</td></tr>
              ) : (
                designations.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/50">
                    <td className="px-6 py-4 text-slate-700 font-medium">
                      {editId === row.id ? (
                        <input
                          type="text"
                          value={editName}
                          onChange={e => setEditName(e.target.value)}
                          className="px-2 py-1 border border-indigo-400 rounded-lg text-sm outline-none w-full"
                        />
                      ) : (
                        row.name
                      )}
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {editId === row.id ? (
                        <input
                          type="text"
                          value={editDesc}
                          onChange={e => setEditDesc(e.target.value)}
                          className="px-2 py-1 border border-indigo-400 rounded-lg text-sm outline-none w-full"
                        />
                      ) : (
                        row.description || <span className="text-slate-400 italic">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {editId === row.id ? (
                          <>
                            <button onClick={() => handleUpdate(row.id)} className="text-emerald-600 hover:bg-emerald-50 p-1.5 rounded transition-colors" title="Save">
                              <Check className="h-4 w-4" />
                            </button>
                            <button onClick={() => setEditId(null)} className="text-slate-500 hover:bg-slate-100 p-1.5 rounded transition-colors" title="Cancel">
                              <X className="h-4 w-4" />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => { setEditId(row.id); setEditName(row.name); setEditDesc(row.description || ''); }}
                              className="text-blue-600 hover:bg-blue-50 p-1.5 rounded transition-colors"
                              title="Edit"
                            >
                              <Pencil className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(row.id, row.name)}
                              className="text-red-500 hover:bg-red-50 p-1.5 rounded transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <div className="flex justify-between items-center text-sm text-slate-500 p-4 border-t border-border">
            <span>Showing {designations.length} of {designations.length} entries</span>
            <div className="flex gap-1">
              <button className="px-3 py-1.5 border border-border bg-white rounded text-slate-400 cursor-not-allowed">Previous</button>
              <button className="px-3 py-1.5 border border-[#0d9488] bg-[#0d9488] text-white rounded">1</button>
              <button className="px-3 py-1.5 border border-border bg-white rounded text-slate-400 cursor-not-allowed">Next</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
