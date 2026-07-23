import React from 'react';
import { PageHeader } from '../../components/PageHeader';
import { Plus, Target, Calendar as CalendarIcon, MoreHorizontal } from 'lucide-react';

const mockObjectives = [
  { id: 'OBJ-2026-01', title: 'Complete Frontend Migration', weightage: '40%', deadline: '30 Sep, 2026', status: 'Submitted', statusColor: 'bg-blue-50 text-blue-600 border-blue-200' },
  { id: 'OBJ-2026-02', title: 'Achieve 95% Code Coverage', weightage: '30%', deadline: '15 Oct, 2026', status: 'Draft', statusColor: 'bg-slate-50 text-slate-600 border-slate-200' },
  { id: 'OBJ-2026-03', title: 'Mentor 2 Junior Devs', weightage: '30%', deadline: '31 Dec, 2026', status: 'Approved', statusColor: 'bg-emerald-50 text-emerald-600 border-emerald-200' },
];

export const ObjectiveUserPage = () => {
  return (
    <div className="max-w-[1600px] mx-auto pb-10">
      <PageHeader 
        title="My Objectives" 
        breadcrumbs={['Performance Management', 'Objective User List']} 
      />

      <div className="bg-white dark:bg-card border border-border shadow-sm rounded-xl overflow-hidden mt-6">
        {/* Banner with Gradient */}
        <div className="p-4 border-b border-border bg-gradient-to-r from-blue-100/50 to-emerald-100/50 dark:from-blue-900/20 dark:to-emerald-900/20 flex justify-between items-center">
          <div className="flex items-center gap-2 text-indigo-900 dark:text-indigo-300 font-semibold">
            <Target className="h-5 w-5" /> FY 2026 Goals
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 shadow-sm transition-colors">
            <Plus className="h-4 w-4" /> Add Objective
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-600 dark:text-slate-300">
            <thead className="text-[11px] uppercase bg-[#F4F7FE] dark:bg-muted text-slate-700 dark:text-slate-200">
              <tr>
                <th className="px-6 py-4 font-semibold">Objective ID</th>
                <th className="px-6 py-4 font-semibold">Title</th>
                <th className="px-6 py-4 font-semibold text-center">Weightage</th>
                <th className="px-6 py-4 font-semibold text-center">Deadline</th>
                <th className="px-6 py-4 font-semibold text-center">Status</th>
                <th className="px-6 py-4 font-semibold text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {mockObjectives.map((obj, i) => (
                <tr key={i} className="hover:bg-slate-50 dark:hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4 font-medium text-indigo-600">{obj.id}</td>
                  <td className="px-6 py-4 font-medium text-slate-700 dark:text-slate-200">{obj.title}</td>
                  <td className="px-6 py-4 text-center font-bold">{obj.weightage}</td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-1.5 text-slate-500">
                      <CalendarIcon className="h-3.5 w-3.5" /> {obj.deadline}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-2.5 py-1 text-[11px] font-bold uppercase border rounded-full ${obj.statusColor}`}>
                      {obj.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button className="text-slate-400 hover:text-indigo-600 p-1.5 rounded transition-colors inline-block">
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Footer Summary */}
        <div className="p-4 bg-slate-50 dark:bg-muted/10 border-t border-border flex justify-end gap-6 text-sm">
          <div className="text-slate-500">Total Weightage: <span className="font-bold text-slate-700 dark:text-slate-200">100%</span></div>
        </div>
      </div>
    </div>
  );
};
