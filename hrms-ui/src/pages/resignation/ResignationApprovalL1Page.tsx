import React, { useState, useEffect } from 'react';
import { ArrowLeft, Check, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ResignationApprovalL1Page = () => {
  const navigate = useNavigate();
  const [resignations, setResignations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchResignations = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/resignation?status=PENDING_L1', {
        headers: { 'x-tenant-id': 'pmj.com' }
      });
      if (response.ok) {
        setResignations(await response.json());
      }
    } catch (error) {
      console.error('Failed to fetch resignations', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResignations();
  }, []);

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      const response = await fetch(`http://localhost:3001/api/resignation/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'x-tenant-id': 'pmj.com' },
        body: JSON.stringify({ status })
      });
      if (response.ok) {
        fetchResignations();
      }
    } catch (error) {
      console.error('Failed to update status', error);
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto pb-10">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1 tracking-tight">Resignation Approval L1</h1>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-emerald-500 font-medium">Resignation</span>
            <span className="text-slate-300">›</span>
            <span className="text-slate-500">Resignation Approval L1</span>
          </div>
        </div>
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-indigo-100 text-indigo-600 rounded-full text-sm font-semibold hover:bg-indigo-50 shadow-sm transition-colors mt-2"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
      </div>

      <div className="bg-white dark:bg-card border border-border shadow-sm rounded-xl overflow-hidden mt-2 p-5 pt-8">
        
        {/* Table Section */}
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-sm text-center text-slate-600 dark:text-slate-300">
            <thead className="bg-[#f0f4f8] text-slate-700 font-bold border-b border-border">
              <tr>
                <th className="px-4 py-4 font-bold text-slate-800">Resignation Date <span className="text-slate-400 font-normal opacity-50 ml-1">↑↓</span></th>
                <th className="px-4 py-4 font-bold text-slate-800">Employee Name <span className="text-slate-400 font-normal opacity-50 ml-1">↑↓</span></th>
                <th className="px-4 py-4 font-bold text-slate-800">Department <span className="text-slate-400 font-normal opacity-50 ml-1">↑↓</span></th>
                <th className="px-4 py-4 font-bold text-slate-800">Designation <span className="text-slate-400 font-normal opacity-50 ml-1">↑↓</span></th>
                <th className="px-4 py-4 font-bold text-slate-800">Reporting Manager <span className="text-slate-400 font-normal opacity-50 ml-1">↑↓</span></th>
                <th className="px-4 py-4 font-bold text-slate-800">Notice Period (Days) <span className="text-slate-400 font-normal opacity-50 ml-1">↑↓</span></th>
                <th className="px-4 py-4 font-bold text-slate-800">Provisional Relieving Date <span className="text-slate-400 font-normal opacity-50 ml-1">↑↓</span></th>
                <th className="px-4 py-4 font-bold text-slate-800">Reason <span className="text-slate-400 font-normal opacity-50 ml-1">↑↓</span></th>
                <th className="px-4 py-4 font-bold text-slate-800 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-[#f8fafc]">
              {loading ? (
                <tr><td colSpan={9} className="px-6 py-8 text-slate-500 text-center font-medium">Loading approvals...</td></tr>
              ) : resignations.length === 0 ? (
                <tr><td colSpan={9} className="px-6 py-8 text-slate-500 text-center font-medium">No pending L1 approvals.</td></tr>
              ) : (
                resignations.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-left font-medium text-slate-700">{new Date(row.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-left">
                      <div className="font-semibold text-slate-700">{row.employee?.firstName} {row.employee?.lastName}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">{row.employee?.employeeIdString}</div>
                    </td>
                    <td className="px-6 py-4 text-left text-slate-500">-</td>
                    <td className="px-6 py-4 text-left text-slate-500">-</td>
                    <td className="px-6 py-4 text-left text-slate-500">-</td>
                    <td className="px-6 py-4 text-center text-slate-500">60</td>
                    <td className="px-6 py-4 text-center font-medium text-slate-700">{new Date(row.lastWorkingDay).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-center text-slate-500">{row.reason}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => handleUpdateStatus(row.id, 'PENDING_L2')} className="text-emerald-600 hover:bg-emerald-50 p-1.5 rounded transition-colors" title="Approve to L2">
                          <Check className="h-4 w-4" />
                        </button>
                        <button onClick={() => handleUpdateStatus(row.id, 'REJECTED')} className="text-rose-600 hover:bg-rose-50 p-1.5 rounded transition-colors" title="Reject">
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Footer */}
        <div className="flex items-center justify-between mt-4 text-sm text-slate-500">
          <div>Showing 1 to {resignations.length} of {resignations.length} entries</div>
          <div className="flex items-center gap-1">
            <button className="px-3 py-1.5 border border-slate-200 rounded text-slate-400 cursor-not-allowed">Previous</button>
            <button className="px-3 py-1.5 border border-slate-200 rounded text-slate-400 cursor-not-allowed">Next</button>
          </div>
        </div>

      </div>
    </div>
  );
};
