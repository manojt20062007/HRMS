import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../components/PageHeader';
import { Settings, Play, Pause, Check, X, Plus } from 'lucide-react';
import { getTenantHeader, API_BASE_URL } from '../../config';

export const AppraisalProcessPage = () => {
  const [cycles, setCycles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Form
  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchCycles = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/appraisals/cycles`, {
        headers: getTenantHeader()
      });
      if (response.ok) {
        setCycles(await response.json());
      }
    } catch (error) {
      console.error('Failed to fetch cycles', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCycles();
  }, []);

  const handleCreateCycle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !startDate || !endDate) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/appraisals/cycles`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getTenantHeader()
        },
        body: JSON.stringify({ name, startDate, endDate })
      });

      if (response.ok) {
        setShowModal(false);
        setName('');
        setStartDate('');
        setEndDate('');
        fetchCycles();
      }
    } catch (error) {
      console.error('Failed to create cycle', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateCycle = async (id: string, updates: any) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/appraisals/cycles/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getTenantHeader()
        },
        body: JSON.stringify(updates)
      });
      if (response.ok) {
        fetchCycles();
      }
    } catch (error) {
      console.error('Failed to update cycle', error);
    }
  };

  const advanceStage = (cycle: any) => {
    const stages = ['SELF_REVIEW', 'MANAGER_REVIEW', 'REVIEWER', 'HR_REVIEW', 'CLOSED'];
    const currentIndex = stages.indexOf(cycle.stage);
    if (currentIndex < stages.length - 1) {
      const nextStage = stages[currentIndex + 1];
      const status = nextStage === 'CLOSED' ? 'COMPLETED' : 'ACTIVE';
      handleUpdateCycle(cycle.id, { stage: nextStage, status });
    }
  };

  const getProgress = (stage: string, status: string) => {
    if (status === 'COMPLETED') return 'w-full bg-slate-400';
    switch (stage) {
      case 'SELF_REVIEW': return 'w-1/4 bg-indigo-500';
      case 'MANAGER_REVIEW': return 'w-2/4 bg-indigo-500';
      case 'REVIEWER': return 'w-3/4 bg-indigo-500';
      case 'HR_REVIEW': return 'w-[90%] bg-indigo-500';
      default: return 'w-0';
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto pb-10">
      <PageHeader 
        title="Appraisal Process" 
        breadcrumbs={['Performance Management', 'Appraisal Process']} 
      />

      <div className="bg-white dark:bg-card border border-border shadow-sm rounded-xl overflow-hidden mt-6">
        {/* Banner */}
        <div className="p-4 border-b border-border bg-gradient-to-r from-indigo-100/50 to-purple-100/50 dark:from-indigo-900/20 dark:to-purple-900/20 flex justify-between items-center">
          <div className="flex items-center gap-2 text-indigo-900 dark:text-indigo-300 font-semibold">
            <Settings className="h-5 w-5" /> Cycle Configurations
          </div>
          <button 
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 shadow-sm transition-colors"
          >
            <Plus className="h-4 w-4" /> Start New Cycle
          </button>
        </div>

        {/* Timeline/Cards */}
        <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6 bg-slate-50/50 dark:bg-muted/10 min-h-[400px]">
          {loading ? (
            <div className="col-span-full flex items-center justify-center text-slate-500">Loading cycles...</div>
          ) : cycles.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center text-slate-500 py-10">
              <Settings className="h-12 w-12 text-slate-300 mb-4" />
              <p>No appraisal cycles found. Start a new cycle to begin!</p>
            </div>
          ) : (
            cycles.map((cycle) => (
              <div key={cycle.id} className="bg-white dark:bg-card border border-border rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">{cycle.name}</h3>
                    <p className="text-sm text-slate-500 mt-1">
                      {new Date(cycle.startDate).toLocaleDateString()} - {new Date(cycle.endDate).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`px-3 py-1 text-xs font-bold uppercase border rounded-full ${
                    cycle.status === 'ACTIVE' ? 'bg-indigo-50 text-indigo-600 border-indigo-200' :
                    cycle.status === 'COMPLETED' ? 'bg-slate-50 text-slate-600 border-slate-200' :
                    'bg-amber-50 text-amber-600 border-amber-200'
                  }`}>
                    {cycle.status}
                  </span>
                </div>
                
                <div className="mt-auto mb-2 pt-4">
                  <div className="flex justify-between text-xs font-semibold text-slate-500 mb-2">
                    <span>Current Stage</span>
                    <span className="text-indigo-600">{cycle.stage.replace('_', ' ')}</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                    <div className={`h-2 rounded-full transition-all duration-500 ${getProgress(cycle.stage, cycle.status)}`}></div>
                  </div>
                </div>
                
                {cycle.status === 'ACTIVE' && (
                  <div className="mt-6 pt-4 border-t border-border flex gap-3">
                    <button 
                      onClick={() => handleUpdateCycle(cycle.id, { status: 'PAUSED' })}
                      className="flex items-center gap-2 px-4 py-2 border border-slate-200 text-slate-600 rounded-md text-sm font-semibold hover:bg-slate-50 transition-colors"
                    >
                      <Pause className="h-4 w-4" /> Pause
                    </button>
                    <button 
                      onClick={() => advanceStage(cycle)}
                      className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-md text-sm font-semibold hover:bg-emerald-100 transition-colors ml-auto"
                    >
                      Advance Stage <Play className="h-4 w-4" />
                    </button>
                  </div>
                )}
                {cycle.status === 'PAUSED' && (
                  <div className="mt-6 pt-4 border-t border-border flex gap-3">
                    <button 
                      onClick={() => handleUpdateCycle(cycle.id, { status: 'ACTIVE' })}
                      className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 border border-indigo-200 rounded-md text-sm font-semibold hover:bg-indigo-100 transition-colors"
                    >
                      <Play className="h-4 w-4" /> Resume
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-card w-full max-w-md rounded-xl shadow-xl overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-border">
              <h3 className="font-bold text-lg text-slate-800 dark:text-white">Start New Cycle</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleCreateCycle} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Cycle Name</label>
                <input 
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. H1 2026 Review Cycle"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Start Date</label>
                  <input 
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">End Date</label>
                  <input 
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
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
                  {isSubmitting ? 'Starting...' : <><Play className="h-4 w-4" /> Start Cycle</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
