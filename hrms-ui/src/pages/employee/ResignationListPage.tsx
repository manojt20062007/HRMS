import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getTenantHeader, API_BASE_URL } from '../../config';

export const ResignationListPage = () => {
  const navigate = useNavigate();
  const [resignations, setResignations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    resignationDate: '',
    lastWorkingDay: '',
    reason: ''
  });

  const fetchData = async () => {
    try {
      const userStr = localStorage.getItem('hrms_user');
      if (!userStr) return;
      const user = JSON.parse(userStr);
      if (!user.employeeId) return;

      const response = await fetch(`${API_BASE_URL}/api/resignation?employeeId=${user.employeeId}`, {
        headers: getTenantHeader()
      });
      if (response.ok) {
        setResignations(await response.json());
      }
    } catch (error) {
      console.error('Failed to fetch data', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userStr = localStorage.getItem('hrms_user');
      if (!userStr) return;
      const user = JSON.parse(userStr);

      const response = await fetch(`${API_BASE_URL}/api/resignation`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...getTenantHeader()
        },
        body: JSON.stringify({
          ...formData,
          employeeId: user.employeeId
        })
      });
      if (response.ok) {
        setIsModalOpen(false);
        setFormData({ resignationDate: '', lastWorkingDay: '', reason: '' });
        fetchData();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING_L1': return 'bg-amber-50 text-amber-600 border-amber-200';
      case 'PENDING_L2': return 'bg-blue-50 text-blue-600 border-blue-200';
      case 'APPROVED': return 'bg-emerald-50 text-emerald-600 border-emerald-200';
      case 'REJECTED': return 'bg-rose-50 text-rose-600 border-rose-200';
      default: return 'bg-slate-50 text-slate-600 border-slate-200';
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto pb-10">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1 tracking-tight">Resignation List</h1>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-emerald-500 font-medium">Employee Management</span>
            <span className="text-slate-300">›</span>
            <span className="text-slate-500">Resignation List</span>
          </div>
        </div>
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-indigo-100 text-indigo-600 rounded-full text-sm font-semibold hover:bg-indigo-50 shadow-sm transition-colors mt-2"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
      </div>

      <div className="bg-white dark:bg-card border border-border shadow-sm rounded-xl overflow-hidden mt-2 p-5">
        
        {/* Header Bar */}
        <div className="flex items-center justify-end mb-6 mt-2 mr-2">
          {resignations.length === 0 && (
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-full text-sm font-semibold hover:bg-indigo-700 shadow-sm transition-colors"
            >
              <Plus className="h-4 w-4" /> Submit Resignation
            </button>
          )}
        </div>

        {/* Table Section */}
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-sm text-center text-slate-600 dark:text-slate-300">
            <thead className="bg-[#f0f4f8] text-slate-700 font-bold border-b border-border">
              <tr>
                <th className="px-4 py-4 font-bold text-slate-800">Resignation Date</th>
                <th className="px-4 py-4 font-bold text-slate-800">Last Working Day</th>
                <th className="px-4 py-4 font-bold text-slate-800">Reason</th>
                <th className="px-4 py-4 font-bold text-slate-800">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-slate-500">Loading data...</td>
                </tr>
              ) : resignations.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-slate-500">No resignation request submitted.</td>
                </tr>
              ) : (
                resignations.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3">{new Date(row.resignationDate).toLocaleDateString()}</td>
                    <td className="px-4 py-3 font-semibold">{new Date(row.lastWorkingDay).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-left max-w-xs truncate" title={row.reason}>{row.reason}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2.5 py-1 text-[11px] font-bold uppercase border rounded-full ${getStatusColor(row.status)}`}>
                        {row.status.replace('_', ' ')}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>

      {/* Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-card w-full max-w-lg rounded-xl shadow-xl overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-border bg-slate-50">
              <h3 className="font-bold text-lg text-slate-800">Submit Resignation</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Resignation Date <span className="text-red-500">*</span></label>
                  <input 
                    type="date"
                    required
                    value={formData.resignationDate}
                    onChange={(e) => setFormData({...formData, resignationDate: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-indigo-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Expected Last Day <span className="text-red-500">*</span></label>
                  <input 
                    type="date"
                    required
                    value={formData.lastWorkingDay}
                    onChange={(e) => setFormData({...formData, lastWorkingDay: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-indigo-500 outline-none"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Reason for Resignation <span className="text-red-500">*</span></label>
                <textarea 
                  required
                  rows={4}
                  value={formData.reason}
                  onChange={(e) => setFormData({...formData, reason: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-indigo-500 outline-none resize-none"
                  placeholder="Please state your reason for resigning..."
                />
              </div>
              
              <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
