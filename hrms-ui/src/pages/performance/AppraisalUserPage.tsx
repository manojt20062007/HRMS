import React from 'react';
import { PageHeader } from '../../components/PageHeader';
import { User, Star, Save } from 'lucide-react';

const mockQuestions = [
  { id: 1, text: 'How effectively did you meet your OKRs this cycle?', rating: 4 },
  { id: 2, text: 'How well did you collaborate with your team?', rating: 5 },
  { id: 3, text: 'What were your biggest challenges and how did you overcome them?', isText: true }
];

export const AppraisalUserPage = () => {
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
            <User className="h-5 w-5" /> H2 2026 Self-Evaluation Form
          </div>
          <span className="px-3 py-1 bg-white border border-border rounded-full text-xs font-bold text-slate-500 shadow-sm">
            Due: 31 Dec, 2026
          </span>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-8 bg-slate-50/30 dark:bg-muted/5">
          {mockQuestions.map((q) => (
            <div key={q.id} className="bg-white dark:bg-card border border-border p-5 rounded-xl shadow-sm">
              <h4 className="font-semibold text-slate-800 dark:text-slate-100 mb-4">{q.id}. {q.text}</h4>
              
              {!q.isText ? (
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button key={star} className={`p-1.5 rounded-full transition-colors ${star <= q.rating ? 'text-amber-400' : 'text-slate-200 hover:text-amber-200'}`}>
                      <Star className="h-8 w-8 fill-current" />
                    </button>
                  ))}
                  <span className="ml-4 text-sm font-bold text-slate-500">{q.rating} / 5</span>
                </div>
              ) : (
                <textarea 
                  rows={4}
                  className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-border rounded-lg text-sm text-slate-700 outline-none focus:border-indigo-500 resize-none"
                  placeholder="Enter your detailed answer here..."
                  defaultValue="I faced challenges with the new API integration, but overcame it by pair-programming with the senior backend dev."
                />
              )}
            </div>
          ))}
        </div>

        <div className="p-5 border-t border-border flex justify-end gap-3 bg-white dark:bg-card">
          <button className="px-6 py-2 border border-border text-slate-600 rounded-lg text-sm font-semibold hover:bg-slate-50 transition-colors">
            Save Draft
          </button>
          <button className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 shadow-sm transition-colors">
            <Save className="h-4 w-4" /> Submit Evaluation
          </button>
        </div>
      </div>
    </div>
  );
};
