import React from 'react';
import { PageHeader } from '../../components/PageHeader';
import { Users, Star, MessageSquare } from 'lucide-react';

const mockReports = [
  { name: 'Abdul Rahman', role: 'JUNIOR SOFTWARE DEVELOPER', selfRating: 4.2, status: 'Pending Review', statusColor: 'bg-amber-50 text-amber-600 border-amber-200' },
  { name: 'Manoj P', role: 'JUNIOR SOFTWARE DEVELOPER', selfRating: 4.5, status: 'Reviewed', statusColor: 'bg-emerald-50 text-emerald-600 border-emerald-200' },
];

export const AppraisalManagerPage = () => {
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
                <th className="px-6 py-4 font-semibold text-center">Self-Rating</th>
                <th className="px-6 py-4 font-semibold text-center">Manager Rating</th>
                <th className="px-6 py-4 font-semibold text-center">Status</th>
                <th className="px-6 py-4 font-semibold text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {mockReports.map((row, i) => (
                <tr key={i} className="hover:bg-slate-50 dark:hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1 items-start">
                      <span className="font-medium text-slate-700 dark:text-slate-200">{row.name}</span>
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-bold uppercase border border-slate-200">{row.role}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-1 font-bold text-amber-500">
                      <Star className="h-4 w-4 fill-current" /> {row.selfRating}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {row.status === 'Reviewed' ? (
                       <div className="flex items-center justify-center gap-1 font-bold text-emerald-500">
                         <Star className="h-4 w-4 fill-current" /> 4.0
                       </div>
                    ) : (
                      <span className="text-slate-400 italic">Not rated</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-2.5 py-1 text-[11px] font-bold uppercase border rounded-full ${row.statusColor}`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button className="flex items-center justify-center gap-2 mx-auto px-4 py-1.5 bg-indigo-50 text-indigo-600 border border-indigo-200 rounded-md text-xs font-bold hover:bg-indigo-100 transition-colors">
                      <MessageSquare className="h-3.5 w-3.5" /> {row.status === 'Reviewed' ? 'Edit Review' : 'Start Review'}
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
