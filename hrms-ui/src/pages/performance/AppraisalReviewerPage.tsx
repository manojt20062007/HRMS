import React from 'react';
import { PageHeader } from '../../components/PageHeader';
import { ShieldCheck, Star } from 'lucide-react';

const mockReviews = [
  { name: 'Abdul Rahman', department: 'Engineering', manager: 'Tech Lead', selfRating: 4.2, mgrRating: 4.0, status: 'Pending Reviewer' }
];

export const AppraisalReviewerPage = () => {
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
                <th className="px-6 py-4 font-semibold text-center">Manager</th>
                <th className="px-6 py-4 font-semibold text-center">Self-Rating</th>
                <th className="px-6 py-4 font-semibold text-center">Mgr Rating</th>
                <th className="px-6 py-4 font-semibold text-center">Status</th>
                <th className="px-6 py-4 font-semibold text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {mockReviews.map((row, i) => (
                <tr key={i} className="hover:bg-slate-50 dark:hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1 items-start">
                      <span className="font-medium text-slate-700 dark:text-slate-200">{row.name}</span>
                      <span className="text-[11px] text-slate-400">{row.department}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">{row.manager}</td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-1 font-bold text-amber-500">
                      <Star className="h-4 w-4 fill-current" /> {row.selfRating}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-1 font-bold text-emerald-500">
                      <Star className="h-4 w-4 fill-current" /> {row.mgrRating}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-2.5 py-1 text-[11px] font-bold uppercase border rounded-full bg-amber-50 text-amber-600 border-amber-200`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button className="px-4 py-1.5 bg-indigo-600 text-white rounded-md text-xs font-bold hover:bg-indigo-700 transition-colors">
                      Review File
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
