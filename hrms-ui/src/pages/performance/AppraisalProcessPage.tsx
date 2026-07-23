import React from 'react';
import { PageHeader } from '../../components/PageHeader';
import { Settings, Play, Pause, Check } from 'lucide-react';

const mockCycles = [
  { name: 'H2 2026 Review Cycle', status: 'Active', statusColor: 'bg-emerald-50 text-emerald-600 border-emerald-200', startDate: '01 Nov, 2026', endDate: '31 Dec, 2026', stage: 'Self-Review' },
  { name: 'H1 2026 Review Cycle', status: 'Completed', statusColor: 'bg-slate-50 text-slate-600 border-slate-200', startDate: '01 May, 2026', endDate: '30 Jun, 2026', stage: 'Closed' },
];

export const AppraisalProcessPage = () => {
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
          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 shadow-sm transition-colors">
            Start New Cycle
          </button>
        </div>

        {/* Timeline/Cards */}
        <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6 bg-slate-50/50 dark:bg-muted/10">
          {mockCycles.map((cycle, i) => (
            <div key={i} className="bg-white dark:bg-card border border-border rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">{cycle.name}</h3>
                  <p className="text-sm text-slate-500 mt-1">
                    {cycle.startDate} - {cycle.endDate}
                  </p>
                </div>
                <span className={`px-3 py-1 text-xs font-bold uppercase border rounded-full ${cycle.statusColor}`}>
                  {cycle.status}
                </span>
              </div>
              
              <div className="mt-6 mb-2">
                <div className="flex justify-between text-xs font-semibold text-slate-500 mb-2">
                  <span>Current Stage</span>
                  <span className="text-indigo-600">{cycle.stage}</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                  <div className={`h-2 rounded-full ${cycle.status === 'Completed' ? 'w-full bg-slate-400' : 'w-1/3 bg-indigo-500'}`}></div>
                </div>
              </div>
              
              {cycle.status === 'Active' && (
                <div className="mt-6 pt-4 border-t border-slate-100 flex gap-3">
                  <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 text-slate-600 rounded-md text-sm font-semibold hover:bg-slate-50 transition-colors">
                    <Pause className="h-4 w-4" /> Pause
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-md text-sm font-semibold hover:bg-emerald-100 transition-colors ml-auto">
                    Advance Stage <Play className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
