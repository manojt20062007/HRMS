import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../components/PageHeader';
import { ShieldCheck, Star, MessageSquare, X, Save } from 'lucide-react';
import { getTenantHeader, API_BASE_URL } from '../../config';

export const AppraisalReviewerPage = () => {
  const [appraisals, setAppraisals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [selectedAppraisal, setSelectedAppraisal] = useState<any>(null);
  const [reviewerRating, setReviewerRating] = useState<number>(0);
  const [reviewerComments, setReviewerComments] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchAppraisals = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/appraisals?status=PENDING_REVIEWER`, {
        headers: getTenantHeader()
      });
      if (response.ok) {
        setAppraisals(await response.json());
      }
    } catch (error) {
      console.error('Failed to fetch reviewer appraisals', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppraisals();
  }, []);

  const openModal = (appraisal: any) => {
    setSelectedAppraisal(appraisal);
    setReviewerRating(appraisal.reviewerRating || appraisal.managerRating || 0); // Default to manager's rating
    setReviewerComments(appraisal.reviewerComments || '');
    setShowModal(true);
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (reviewerRating === 0 || !reviewerComments) {
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
          reviewerRating,
          reviewerComments,
          status: 'PENDING_HR'
        })
      });

      if (response.ok) {
        setShowModal(false);
        fetchAppraisals();
      }
    } catch (error) {
      console.error('Failed to submit reviewer appraisal', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto pb-10">
      <PageHeader 
        title="Appraisal Reviewer" 
        breadcrumbs={['Performance Management', 'Appraisal Reviewer']} 
      />

      <div className="bg-white dark:bg-card border border-border shadow-sm rounded-xl overflow-hidden mt-6">
        <div className="p-4 border-b border-border bg-gradient-to-r from-blue-100/50 to-emerald-100/50 dark:from-blue-900/20 dark:to-emerald-900/20 flex justify-between items-center">
          <div className="flex items-center gap-2 text-indigo-900 dark:text-indigo-300 font-semibold">
            <ShieldCheck className="h-5 w-5" /> Secondary Approval Queue
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-600 dark:text-slate-300">
            <thead className="text-[11px] uppercase bg-[#F4F7FE] dark:bg-muted text-slate-700 dark:text-slate-200">
              <tr>
                <th className="px-6 py-4 font-semibold">Employee</th>
                <th className="px-6 py-4 font-semibold">Cycle</th>
                <th className="px-6 py-4 font-semibold text-center">Self Rating</th>
                <th className="px-6 py-4 font-semibold text-center">Manager Rating</th>
                <th className="px-6 py-4 font-semibold text-center">Status</th>
                <th className="px-6 py-4 font-semibold text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-slate-500">Loading pending reviews...</td></tr>
              ) : appraisals.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-slate-500">No appraisals pending your review.</td></tr>
              ) : (
                appraisals.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50 dark:hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1 items-start">
                        <span className="font-medium text-slate-700 dark:text-slate-200">{row.employee?.firstName} {row.employee?.lastName}</span>
                        <span className="text-[11px] font-bold text-slate-400">{row.employee?.designation?.name || 'EMPLOYEE'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-700 dark:text-slate-200">
                      {row.cycle?.name}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-1 font-bold text-slate-400">
                        <Star className="h-4 w-4 fill-current" /> {row.selfRating}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-1 font-bold text-amber-500">
                        <Star className="h-5 w-5 fill-current" /> {row.managerRating}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="px-2.5 py-1 text-[11px] font-bold uppercase border rounded-full bg-purple-50 text-purple-600 border-purple-200">
                        {row.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button 
                        onClick={() => openModal(row)}
                        className="flex items-center justify-center gap-2 mx-auto px-4 py-1.5 bg-indigo-50 text-indigo-600 border border-indigo-200 rounded-md text-xs font-bold hover:bg-indigo-100 transition-colors"
                      >
                        <MessageSquare className="h-3.5 w-3.5" /> Review File
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reviewer Modal */}
      {showModal && selectedAppraisal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-card w-full max-w-2xl rounded-xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-4 border-b border-border">
              <div>
                <h3 className="font-bold text-lg text-slate-800 dark:text-white">Secondary Review</h3>
                <p className="text-sm text-slate-500">{selectedAppraisal.employee?.firstName} {selectedAppraisal.employee?.lastName}</p>
              </div>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg border border-border">
                  <span className="text-xs font-bold text-slate-500 uppercase">Self Rating</span>
                  <div className="flex items-center gap-1 text-slate-700 mt-1">
                    <Star className="h-4 w-4 fill-current text-amber-500" /> {selectedAppraisal.selfRating} / 5
                  </div>
                </div>
                <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg border border-indigo-100 dark:border-indigo-800">
                  <span className="text-xs font-bold text-indigo-500 uppercase">Manager Rating</span>
                  <div className="flex items-center gap-1 text-indigo-700 mt-1 font-bold">
                    <Star className="h-4 w-4 fill-current" /> {selectedAppraisal.managerRating} / 5
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg border border-border">
                <h4 className="font-bold text-sm text-slate-700 dark:text-slate-300 mb-2">Manager's Comments</h4>
                <div className="text-sm text-slate-600 dark:text-slate-400 whitespace-pre-wrap">
                  {selectedAppraisal.managerComments}
                </div>
              </div>

              <div className="space-y-4 border-t border-border pt-4">
                <form id="reviewer-form" onSubmit={handleReviewSubmit} className="space-y-4">
                  <div>
                    <h4 className="font-bold text-sm text-slate-700 dark:text-slate-300 mb-2">Secondary Reviewer Rating</h4>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button 
                          key={star} 
                          type="button"
                          onClick={() => setReviewerRating(star)}
                          className={`p-1.5 rounded-full transition-colors ${star <= reviewerRating ? 'text-amber-400' : 'text-slate-200 hover:text-amber-200'}`}
                        >
                          <Star className="h-8 w-8 fill-current" />
                        </button>
                      ))}
                      <span className="ml-4 text-sm font-bold text-slate-500">{reviewerRating} / 5</span>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-bold text-sm text-slate-700 dark:text-slate-300 mb-2">Reviewer Comments</h4>
                    <textarea 
                      rows={4}
                      value={reviewerComments}
                      onChange={(e) => setReviewerComments(e.target.value)}
                      className="w-full p-3 bg-white dark:bg-card border border-border rounded-lg text-sm text-slate-700 outline-none focus:border-indigo-500 resize-none"
                      placeholder="Add secondary reviewer insights..."
                      required
                    />
                  </div>
                </form>
              </div>

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
                form="reviewer-form"
                disabled={isSubmitting || reviewerRating === 0}
                className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 shadow-sm transition-colors disabled:opacity-70"
              >
                <Save className="h-4 w-4" /> {isSubmitting ? 'Saving...' : 'Submit to HR'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
