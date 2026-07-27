import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../components/PageHeader';
import { Plus, Target, Calendar as CalendarIcon, MoreHorizontal, X, Check } from 'lucide-react';
import { getTenantHeader, API_BASE_URL } from '../../config';

export const ObjectiveUserPage = () => {
  const [objectives, setObjectives] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [weightage, setWeightage] = useState('');
  const [deadline, setDeadline] = useState(new Date().toISOString().split('T')[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchObjectives = async () => {
    try {
      const userStr = localStorage.getItem('hrms_user');
      if (!userStr) return;
      const user = JSON.parse(userStr);
      if (!user.employeeId) return;

      const response = await fetch(`${API_BASE_URL}/api/objectives?employeeId=${user.employeeId}`, {
        headers: getTenantHeader()
      });
      if (response.ok) {
        setObjectives(await response.json());
      }
    } catch (error) {
      console.error('Failed to fetch objectives', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchObjectives();
  }, []);

  const handleAddObjective = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !weightage || !deadline) return;

    setIsSubmitting(true);
    try {
      const userStr = localStorage.getItem('hrms_user');
      if (!userStr) return;
      const user = JSON.parse(userStr);
      
      const payload = {
        employeeId: user.employeeId,
        title,
        weightage: parseFloat(weightage),
        deadline
      };

      const response = await fetch(`${API_BASE_URL}/api/objectives`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getTenantHeader()
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        setTitle('');
        setWeightage('');
        setShowModal(false);
        fetchObjectives();
      }
    } catch (error) {
      console.error('Failed to add objective', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/objectives/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getTenantHeader()
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (response.ok) {
        fetchObjectives();
      }
    } catch (error) {
      console.error('Failed to update objective status', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this objective?')) return;
    try {
      const response = await fetch(`${API_BASE_URL}/api/objectives/${id}`, {
        method: 'DELETE',
        headers: getTenantHeader()
      });
      if (response.ok) {
        fetchObjectives();
      }
    } catch (error) {
      console.error('Failed to delete objective', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DRAFT': return 'bg-slate-50 text-slate-600 border-slate-200';
      case 'SUBMITTED': return 'bg-blue-50 text-blue-600 border-blue-200';
      case 'APPROVED': return 'bg-emerald-50 text-emerald-600 border-emerald-200';
      case 'REJECTED': return 'bg-rose-50 text-rose-600 border-rose-200';
      default: return 'bg-slate-50 text-slate-600 border-slate-200';
    }
  };

  const totalWeightage = objectives.reduce((acc, curr) => acc + (curr.weightage || 0), 0);

  return (
    <div className="max-w-[1600px] mx-auto pb-10">
      <PageHeader 
        title="My Objectives" 
        breadcrumbs={['Performance Management', 'Objective User List']} 
      />

      <div className="bg-white dark:bg-card border border-border shadow-sm rounded-xl overflow-hidden mt-6">
        {/* Banner with Gradient */}
        <div className="p-4 border-b border-border bg-gradient-to-r from-blue-100/50 to-emerald-100/50 dark:from-blue-900/20 dark:to-emerald-900/20 flex justify-between items-center">
          <div className="flex items-center gap-2 text-indigo-900 dark:text-indigo-300 font-semibold">
            <Target className="h-5 w-5" /> FY 2026 Goals
          </div>
          <button 
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 shadow-sm transition-colors"
          >
            <Plus className="h-4 w-4" /> Add Objective
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-600 dark:text-slate-300">
            <thead className="text-[11px] uppercase bg-[#F4F7FE] dark:bg-muted text-slate-700 dark:text-slate-200">
              <tr>
                <th className="px-6 py-4 font-semibold">Title</th>
                <th className="px-6 py-4 font-semibold text-center">Weightage</th>
                <th className="px-6 py-4 font-semibold text-center">Deadline</th>
                <th className="px-6 py-4 font-semibold text-center">Status</th>
                <th className="px-6 py-4 font-semibold text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-500">Loading objectives...</td></tr>
              ) : objectives.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-500">No objectives found. Click 'Add Objective' to create one.</td></tr>
              ) : (
                objectives.map((obj) => (
                  <tr key={obj.id} className="hover:bg-slate-50 dark:hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-700 dark:text-slate-200">{obj.title}</td>
                    <td className="px-6 py-4 text-center font-bold text-indigo-600">{obj.weightage}%</td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-1.5 text-slate-500">
                        <CalendarIcon className="h-3.5 w-3.5" /> {new Date(obj.deadline).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2.5 py-1 text-[11px] font-bold uppercase border rounded-full ${getStatusColor(obj.status)}`}>
                        {obj.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {obj.status === 'DRAFT' && (
                          <button 
                            onClick={() => handleUpdateStatus(obj.id, 'SUBMITTED')}
                            className="px-2 py-1 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded text-xs font-semibold transition-colors"
                          >
                            Submit
                          </button>
                        )}
                        <button 
                          onClick={() => handleDelete(obj.id)}
                          className="px-2 py-1 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded text-xs font-semibold transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Footer Summary */}
        <div className="p-4 bg-slate-50 dark:bg-muted/10 border-t border-border flex justify-end gap-6 text-sm">
          <div className="text-slate-500">Total Weightage: <span className={`font-bold ${totalWeightage === 100 ? 'text-emerald-600' : totalWeightage > 100 ? 'text-rose-600' : 'text-slate-700 dark:text-slate-200'}`}>{totalWeightage}%</span></div>
        </div>
      </div>

      {/* Add Objective Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-card w-full max-w-md rounded-xl shadow-xl overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-border">
              <h3 className="font-bold text-lg text-slate-800 dark:text-white">Create New Objective</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleAddObjective} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Objective Title</label>
                <input 
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Complete Q3 Certification"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Weightage (%)</label>
                  <input 
                    type="number"
                    min="1"
                    max="100"
                    value={weightage}
                    onChange={(e) => setWeightage(e.target.value)}
                    placeholder="e.g. 25"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Deadline</label>
                  <input 
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                    required
                  />
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border border-border text-slate-600 rounded-lg font-medium hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-70"
                >
                  {isSubmitting ? 'Saving...' : <><Check className="h-4 w-4" /> Save Objective</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
