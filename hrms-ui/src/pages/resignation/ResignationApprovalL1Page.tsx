import React, { useState, useEffect } from 'react';
import { ShieldAlert, X, Check, Eye } from 'lucide-react';
import { getTenantHeader, API_BASE_URL } from '../../config';

export const ResignationApprovalL1Page = () => {
  const [resignations, setResignations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal
  const [showModal, setShowModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [comments, setComments] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchResignations = async () => {
    try {
      const userStr = localStorage.getItem('hrms_user');
      if (!userStr) return;
      const user = JSON.parse(userStr);
      if (!user.employeeId) return;

      const response = await fetch(`${API_BASE_URL}/api/resignation?status=PENDING_L1&managerId=${user.employeeId}`, {
        headers: getTenantHeader()
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

  const openModal = (request: any) => {
    setSelectedRequest(request);
    setComments('');
    setShowModal(true);
  };

  const handleAction = async (status: 'PENDING_L2' | 'REJECTED') => {
    if (!selectedRequest) return;
    
    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/resignation/${selectedRequest.id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getTenantHeader()
        },
        body: JSON.stringify({ 
          status, 
          managerComments: comments,
          managerApproval: status === 'PENDING_L2'
        })
      });
      if (response.ok) {
        setShowModal(false);
        fetchResignations();
      }
    } catch (error) {
      console.error('Failed to update resignation', error);
    } finally {
      setIsSubmitting(false);
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
            <span className="text-slate-500">Manager Approval</span>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-card border border-border shadow-sm rounded-xl overflow-hidden mt-2 p-5">
        
        {/* Header Bar */}
        <div className="flex items-center justify-start mb-6 mt-2 ml-2">
          <div className="flex items-center gap-2 text-indigo-900 dark:text-indigo-300 font-semibold">
            <ShieldAlert className="h-5 w-5" /> Team Resignation Queue
          </div>
        </div>

        {/* Table Section */}
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-sm text-center text-slate-600 dark:text-slate-300">
            <thead className="bg-[#f0f4f8] text-slate-700 font-bold border-b border-border">
              <tr>
                <th className="px-4 py-4 font-bold text-slate-800">Date Submitted</th>
                <th className="px-4 py-4 font-bold text-slate-800">Employee</th>
                <th className="px-4 py-4 font-bold text-slate-800">Designation</th>
                <th className="px-4 py-4 font-bold text-slate-800">Requested Last Day</th>
                <th className="px-4 py-4 font-bold text-slate-800">Status</th>
                <th className="px-4 py-4 font-bold text-slate-800 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-slate-500">Loading pending requests...</td>
                </tr>
              ) : resignations.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-slate-500">No resignation requests pending your review.</td>
                </tr>
              ) : (
                resignations.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3">{new Date(row.resignationDate).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-left">
                      <div className="font-semibold text-slate-800">{row.employee?.firstName} {row.employee?.lastName}</div>
                      <div className="text-xs text-slate-400">{row.employee?.employeeIdString}</div>
                    </td>
                    <td className="px-4 py-3">{row.employee?.designation?.name || 'EMPLOYEE'}</td>
                    <td className="px-4 py-3 font-semibold text-rose-600">{new Date(row.lastWorkingDay).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      <span className="px-2.5 py-1 text-[11px] font-bold uppercase border rounded-full bg-amber-50 text-amber-600 border-amber-200">
                        {row.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button 
                        onClick={() => openModal(row)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-semibold hover:bg-indigo-100 transition-colors border border-indigo-200"
                      >
                        <Eye className="h-3.5 w-3.5" /> Review
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review Modal */}
      {showModal && selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-card w-full max-w-lg rounded-xl shadow-xl overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-border bg-slate-50">
              <h3 className="font-bold text-lg text-slate-800">Review Resignation (L1)</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              
              {/* Employee Info Block */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-xs font-bold text-slate-400 uppercase">Employee</div>
                    <div className="font-semibold text-slate-800 text-base">{selectedRequest.employee?.firstName} {selectedRequest.employee?.lastName}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-bold text-slate-400 uppercase">Requested Last Day</div>
                    <div className="font-bold text-rose-600">{new Date(selectedRequest.lastWorkingDay).toLocaleDateString()}</div>
                  </div>
                </div>
                
                <div>
                  <div className="text-xs font-bold text-slate-400 uppercase mb-1">Reason Provided</div>
                  <div className="text-sm text-slate-700 bg-white p-3 rounded border border-slate-100 whitespace-pre-wrap">
                    {selectedRequest.reason}
                  </div>
                </div>
              </div>

              {/* Manager Actions */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Manager Comments (Optional)</label>
                <textarea 
                  rows={3}
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-indigo-500 outline-none resize-none"
                  placeholder="Add notes for HR review..."
                />
              </div>
              
              <div className="pt-2 flex justify-end gap-3 border-t border-slate-100">
                <button 
                  onClick={() => handleAction('REJECTED')}
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-rose-50 border border-rose-200 text-rose-600 rounded-lg text-sm font-semibold hover:bg-rose-100 transition-colors disabled:opacity-70 flex items-center gap-2"
                >
                  <X className="h-4 w-4" /> Reject Request
                </button>
                <button 
                  onClick={() => handleAction('PENDING_L2')}
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-70 flex items-center gap-2 shadow-sm"
                >
                  <Check className="h-4 w-4" /> Approve & Forward to HR
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
