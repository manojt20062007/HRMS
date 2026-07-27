import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../components/PageHeader';
import { User, Star, Save, Info, Check } from 'lucide-react';
import { getTenantHeader, API_BASE_URL } from '../../config';

export const AppraisalUserPage = () => {
  const [activeCycle, setActiveCycle] = useState<any>(null);
  const [appraisal, setAppraisal] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Form State
  const [selfRating, setSelfRating] = useState<number>(0);
  const [selfComments, setSelfComments] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchActiveCycleAndAppraisal();
  }, []);

  const fetchActiveCycleAndAppraisal = async () => {
    try {
      const userStr = localStorage.getItem('hrms_user');
      if (!userStr) return;
      const user = JSON.parse(userStr);
      if (!user.employeeId) return;

      // 1. Fetch active cycle
      const cycleResponse = await fetch(`${API_BASE_URL}/api/appraisals/cycles`, {
        headers: getTenantHeader()
      });
      if (!cycleResponse.ok) return;
      
      const cycles = await cycleResponse.json();
      const currentCycle = cycles.find((c: any) => c.status === 'ACTIVE');
      
      if (currentCycle) {
        setActiveCycle(currentCycle);
        
        // 2. Check if user already has an appraisal for this cycle
        const appraisalResponse = await fetch(`${API_BASE_URL}/api/appraisals?employeeId=${user.employeeId}`, {
          headers: getTenantHeader()
        });
        
        if (appraisalResponse.ok) {
          const appraisals = await appraisalResponse.json();
          const currentAppraisal = appraisals.find((a: any) => a.cycleId === currentCycle.id);
          
          if (currentAppraisal) {
            setAppraisal(currentAppraisal);
            setSelfRating(currentAppraisal.selfRating || 0);
            setSelfComments(currentAppraisal.selfComments || '');
          }
        }
      }
    } catch (error) {
      console.error('Failed to load appraisal data', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCycle || selfRating === 0) {
      alert('Please provide a rating before submitting.');
      return;
    }

    setIsSubmitting(true);
    try {
      const userStr = localStorage.getItem('hrms_user');
      if (!userStr) return;
      const user = JSON.parse(userStr);

      if (appraisal) {
        // Update existing (unlikely unless they were in DRAFT, but currently it creates as PENDING_MANAGER directly)
      } else {
        // Create new
        const response = await fetch(`${API_BASE_URL}/api/appraisals`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...getTenantHeader()
          },
          body: JSON.stringify({
            cycleId: activeCycle.id,
            employeeId: user.employeeId,
            selfRating,
            selfComments
          })
        });

        if (response.ok) {
          fetchActiveCycleAndAppraisal();
        } else {
          alert('Failed to submit appraisal.');
        }
      }
    } catch (error) {
      console.error('Failed to submit appraisal', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="p-10 text-center text-slate-500">Loading appraisal data...</div>;
  }

  return (
    <div className="max-w-[1600px] mx-auto pb-10">
      <PageHeader 
        title="Self Appraisal" 
        breadcrumbs={['Performance Management', 'Appraisal User']} 
      />

      <div className="bg-white dark:bg-card border border-border shadow-sm rounded-xl overflow-hidden mt-6">
        {/* Banner */}
        <div className="p-4 border-b border-border bg-gradient-to-r from-blue-100/50 to-emerald-100/50 dark:from-blue-900/20 dark:to-emerald-900/20 flex justify-between items-center">
          <div className="flex items-center gap-2 text-indigo-900 dark:text-indigo-300 font-semibold">
            <User className="h-5 w-5" /> {activeCycle ? activeCycle.name : 'No Active Cycle'}
          </div>
          {activeCycle && (
            <span className="px-3 py-1 bg-white border border-border rounded-full text-xs font-bold text-slate-500 shadow-sm">
              Due: {new Date(activeCycle.endDate).toLocaleDateString()}
            </span>
          )}
        </div>

        {!activeCycle ? (
           <div className="p-10 flex flex-col items-center justify-center text-slate-500">
             <Info className="h-12 w-12 text-slate-300 mb-4" />
             <p>There is currently no active appraisal cycle.</p>
           </div>
        ) : activeCycle.stage !== 'SELF_REVIEW' && !appraisal ? (
           <div className="p-10 flex flex-col items-center justify-center text-slate-500">
             <Info className="h-12 w-12 text-amber-300 mb-4" />
             <p>The self-review window for this cycle is currently closed.</p>
           </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {/* Form Body */}
            <div className="p-6 space-y-8 bg-slate-50/30 dark:bg-muted/5">
              
              {appraisal && (
                <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-lg flex items-center gap-2">
                  <Check className="h-5 w-5" />
                  <span className="font-medium text-sm">You have already submitted your self-appraisal for this cycle. It is currently in {appraisal.status.replace('_', ' ')}.</span>
                </div>
              )}

              <div className="bg-white dark:bg-card border border-border p-5 rounded-xl shadow-sm">
                <h4 className="font-semibold text-slate-800 dark:text-slate-100 mb-4">1. Overall Self Rating</h4>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button 
                      key={star} 
                      type="button"
                      disabled={!!appraisal}
                      onClick={() => setSelfRating(star)}
                      className={`p-1.5 rounded-full transition-colors ${star <= selfRating ? 'text-amber-400' : 'text-slate-200 hover:text-amber-200'} disabled:cursor-not-allowed`}
                    >
                      <Star className="h-8 w-8 fill-current" />
                    </button>
                  ))}
                  <span className="ml-4 text-sm font-bold text-slate-500">{selfRating} / 5</span>
                </div>
              </div>

              <div className="bg-white dark:bg-card border border-border p-5 rounded-xl shadow-sm">
                <h4 className="font-semibold text-slate-800 dark:text-slate-100 mb-4">2. Detailed Self Review & Achievements</h4>
                <textarea 
                  rows={6}
                  value={selfComments}
                  onChange={(e) => setSelfComments(e.target.value)}
                  disabled={!!appraisal}
                  className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-border rounded-lg text-sm text-slate-700 outline-none focus:border-indigo-500 resize-none disabled:bg-slate-100 disabled:text-slate-500"
                  placeholder="Detail your achievements, challenges overcome, and overall performance for this cycle..."
                  required
                />
              </div>

            </div>

            {!appraisal && (
              <div className="p-5 border-t border-border flex justify-end gap-3 bg-white dark:bg-card">
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 shadow-sm transition-colors disabled:opacity-70"
                >
                  <Save className="h-4 w-4" /> {isSubmitting ? 'Submitting...' : 'Submit Evaluation'}
                </button>
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  );
};
