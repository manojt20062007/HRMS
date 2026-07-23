import React from 'react';
import { PageHeader } from '../../components/PageHeader';
import { Target, CheckCircle2, XCircle } from 'lucide-react';

const mockApprovals = [
  { empName: 'Abdul Rahman', empId: 'KY_001', role: 'JUNIOR SOFTWARE DEVELOPER', totalObjs: 3, weightage: '100%', status: 'Pending Review', statusColor: 'bg-amber-50 text-amber-600 border-amber-200' },
  { empName: 'Manoj P', empId: 'KY_003', role: 'JUNIOR SOFTWARE DEVELOPER', totalObjs: 4, weightage: '100%', status: 'Approved', statusColor: 'bg-emerald-50 text-emerald-600 border-emerald-200' },
];

export const ObjectiveManagerPage = () => {
  return (
    <div className="max-w-[1600px] mx-auto pb-10">
      <PageHeader 
        title="Objectives Manager Approval" 
        breadcrumbs={['Performance Management', 'Objectives Manager Approval']} 
      />

      <div className="bg-white dark:bg-card border border-border shadow-sm rounded-xl overflow-hidden mt-6">
        {/* Banner */}
        <div className="p-4 border-b border-border bg-gradient-to-r from-blue-100/50 to-emerald-100/50 dark:from-blue-900/20 dark:to-emerald-900/20 flex justify-between items-center">
          <div className="flex items-center gap-2 text-indigo-900 dark:text-indigo-300 font-semibold">
            <Target className="h-5 w-5" /> Team Goal Submissions
          </div>
          <select className="w-32 px-3 py-1.5 bg-white dark:bg-card border border-border rounded-md text-sm outline-none focus:border-indigo-500 shadow-sm text-slate-700">
            <option>All Status</option>
            <option>Pending</option>
            <option>Approved</option>
          </select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-600 dark:text-slate-300">
            <thead className="text-[11px] uppercase bg-[#F4F7FE] dark:bg-muted text-slate-700 dark:text-slate-200">
              <tr>
                <th className="px-6 py-4 font-semibold">Employee</th>
                <th className="px-6 py-4 font-semibold text-center">Total Objectives</th>
                <th className="px-6 py-4 font-semibold text-center">Overall Weightage</th>
                <th className="px-6 py-4 font-semibold text-center">Status</th>
                <th className="px-6 py-4 font-semibold text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {mockApprovals.map((row, i) => (
                <tr key={i} className="hover:bg-slate-50 dark:hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1 items-start">
                      <span className="font-medium text-slate-700 dark:text-slate-200">{row.empName}</span>
                      <div className="flex gap-2">
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-bold border border-slate-200">{row.empId}</span>
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-bold uppercase border border-slate-200">{row.role}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center font-bold text-slate-700 dark:text-slate-300">{row.totalObjs}</td>
                  <td className="px-6 py-4 text-center font-bold">{row.weightage}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-2.5 py-1 text-[11px] font-bold uppercase border rounded-full ${row.statusColor}`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors tooltip" title="Approve">
                        <CheckCircle2 className="h-5 w-5" />
                      </button>
                      <button className="flex items-center justify-center w-8 h-8 rounded-full bg-red-50 text-red-600 hover:bg-red-100 transition-colors tooltip" title="Reject">
                        <XCircle className="h-5 w-5" />
                      </button>
                    </div>
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
