import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../components/PageHeader';
import { Users, Star, MessageSquare, X, Save } from 'lucide-react';
import { getTenantHeader, API_BASE_URL } from '../../config';

export const AppraisalManagerPage = () => {
  const [appraisals, setAppraisals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Review Modal State
  const [showModal, setShowModal] = useState(false);
  const [selectedAppraisal, setSelectedAppraisal] = useState<any>(null);
  const [managerRating, setManagerRating] = useState<number>(0);
  const [managerComments, setManagerComments] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchAppraisals = async () => {
    try {
      const userStr = localStorage.getItem('hrms_user');
      if (!userStr) return;
      const user = JSON.parse(userStr);
      if (!user.employeeId) return;

      const response = await fetch(`${API_BASE_URL}/api/appraisals?managerId=${user.employeeId}`, {
        headers: getTenantHeader()
      });
      if (response.ok) {
        setAppraisals(await response.json());
      }
    } catch (error) {
      console.error('Failed to fetch appraisals', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppraisals();
  }, []);

  const openReviewModal = (appraisal: any) => {
    setSelectedAppraisal(appraisal);
    setManagerRating(appraisal.managerRating || 0);
    setManagerComments(appraisal.managerComments || '');
    setShowModal(true);
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (managerRating === 0 || !managerComments) {
      alert('Please provide a rating and comments.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/appraisals/${selectedAppraisal.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getTenantHeader()
        },
        body: JSON.stringify({
          managerRating,
          managerComments,
          status: 'PENDING_REVIEWER'
        })
      });

      if (response.ok) {
        setShowModal(false);
        fetchAppraisals();
      }
    } catch (error) {
      console.error('Failed to submit review', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    if (status === 'PENDING_MANAGER') return 'bg-amber-50 text-amber-600 border-amber-200';
    if (status === 'PENDING_REVIEWER') return 'bg-purple-50 text-purple-600 border-purple-200';
    if (status === 'PENDING_HR') return 'bg-blue-50 text-blue-600 border-blue-200';
    if (status === 'APPROVED') return 'bg-emerald-50 text-emerald-600 border-emerald-200';
    return 'bg-slate-50 text-slate-600 border-slate-200';
  };

  return (
    <div className="max-w-[1600px] mx-auto pb-10">
      <PageHeader 
        title="Manager Review" 
        breadcrumbs={['Performance Management', 'Appraisal Manager']} 
      />

      <div className="bg-white dark:bg-card border border-border shadow-sm rounded-xl overflow-hidden mt-6">
        {/* Banner */}
        <div className="p-4 border-b border-border bg-gradient-to-r from-blue-100/50 to-emerald-100/50 dark:from-blue-900/20 dark:to-emerald-900/20 flex justify-between items-center">
          <div className="flex items-center gap-2 text-indigo-900 dark:text-indigo-300 font-semibold">
            <Users className="h-5 w-5" /> Direct Reports Appraisals
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-600 dark:text-slate-300">
            <thead className="text-[11px] uppercase bg-[#F4F7FE] dark:bg-muted text-slate-700 dark:text-slate-200">
              <tr>
                <th className="px-6 py-4 font-semibold">Employee</th>
                <th className="px-6 py-4 font-semibold">Cycle</th>
                <th className="px-6 py-4 font-semibold text-center">Self-Rating</th>
                <th className="px-6 py-4 font-semibold text-center">Manager Rating</th>
                <th className="px-6 py-4 font-semibold text-center">Status</th>
                <th className="px-6 py-4 font-semibold text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-slate-500">Loading appraisals...</td></tr>
              ) : appraisals.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-slate-500">No appraisals pending your review.</td></tr>
              ) : (
                appraisals.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50 dark:hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1 items-start">
                        <span className="font-medium text-slate-700 dark:text-slate-200">{row.employee?.firstName} {row.employee?.lastName}</span>
                        <div className="flex gap-2">
                          <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-bold border border-slate-200">{row.employee?.employeeIdString}</span>
                          <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-bold uppercase border border-slate-200">{row.employee?.designation?.name || 'EMPLOYEE'}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-700 dark:text-slate-200">
                      {row.cycle?.name}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-1 font-bold text-amber-500">
                        <Star className="h-4 w-4 fill-current" /> {row.selfRating}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {row.managerRating ? (
                         <div className="flex items-center justify-center gap-1 font-bold text-emerald-500">
                           <Star className="h-4 w-4 fill-current" /> {row.managerRating}
                         </div>
                      ) : (
                        <span className="text-slate-400 italic">Not rated</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2.5 py-1 text-[11px] font-bold uppercase border rounded-full ${getStatusColor(row.status)}`}>
                        {row.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button 
                        onClick={() => openReviewModal(row)}
                        className="flex items-center justify-center gap-2 mx-auto px-4 py-1.5 bg-indigo-50 text-indigo-600 border border-indigo-200 rounded-md text-xs font-bold hover:bg-indigo-100 transition-colors"
                      >
                        <MessageSquare className="h-3.5 w-3.5" /> {row.managerRating ? 'Edit Review' : 'Start Review'}
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
      {showModal && selectedAppraisal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-card w-full max-w-2xl rounded-xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-4 border-b border-border">
              <div>
                <h3 className="font-bold text-lg text-slate-800 dark:text-white">Manager Review</h3>
                <p className="text-sm text-slate-500">{selectedAppraisal.employee?.firstName} {selectedAppraisal.employee?.lastName} - {selectedAppraisal.cycle?.name}</p>
              </div>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              {/* Employee's Self Review Section */}
              <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg border border-border">
                <h4 className="font-bold text-sm text-slate-700 dark:text-slate-300 mb-2">Employee's Self-Evaluation</h4>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-sm font-semibold">Self Rating:</span>
                  <div className="flex items-center gap-1 text-amber-500 font-bold text-sm">
                    <Star className="h-4 w-4 fill-current" /> {selectedAppraisal.selfRating} / 5
                  </div>
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400 whitespace-pre-wrap">
                  {selectedAppraisal.selfComments}
                </div>
              </div>

              {/* Manager's Review Form */}
              <form id="manager-review-form" onSubmit={handleReviewSubmit} className="space-y-4 border-t border-border pt-4">
                <div>
                  <h4 className="font-bold text-sm text-slate-700 dark:text-slate-300 mb-2">Your Rating</h4>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button 
                        key={star} 
                        type="button"
                        onClick={() => setManagerRating(star)}
                        className={`p-1.5 rounded-full transition-colors ${star <= managerRating ? 'text-amber-400' : 'text-slate-200 hover:text-amber-200'}`}
                      >
                        <Star className="h-8 w-8 fill-current" />
                      </button>
                    ))}
                    <span className="ml-4 text-sm font-bold text-slate-500">{managerRating} / 5</span>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-sm text-slate-700 dark:text-slate-300 mb-2">Manager Comments</h4>
                  <textarea 
                    rows={4}
                    value={managerComments}
                    onChange={(e) => setManagerComments(e.target.value)}
                    className="w-full p-3 bg-white dark:bg-card border border-border rounded-lg text-sm text-slate-700 outline-none focus:border-indigo-500 resize-none"
                    placeholder="Provide constructive feedback..."
                    required
                  />
                </div>
              </form>
            </div>

            <div className="p-4 border-t border-border flex justify-end gap-3 bg-slate-50 dark:bg-slate-900">
              <button 
                type="button"
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border border-border text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit"
                form="manager-review-form"
                disabled={isSubmitting || managerRating === 0}
                className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 shadow-sm transition-colors disabled:opacity-70"
              >
                <Save className="h-4 w-4" /> {isSubmitting ? 'Saving...' : 'Submit Review'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
