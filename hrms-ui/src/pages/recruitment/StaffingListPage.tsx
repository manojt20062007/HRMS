import React from 'react';
import { PageHeader } from '../../components/PageHeader';
import { ListFilter, Eye } from 'lucide-react';

const mockRequests = [
  { id: 'REQ-001', role: 'Senior Frontend Engineer', dept: 'Engineering', requester: 'Abdul Rahman', status: 'Pending RM Approval', statusColor: 'bg-amber-50 text-amber-600 border-amber-200', date: '21 Jul, 2026' },
  { id: 'REQ-002', role: 'Product Designer', dept: 'Design', requester: 'Manoj P', status: 'Approved (Executor)', statusColor: 'bg-emerald-50 text-emerald-600 border-emerald-200', date: '18 Jul, 2026' },
];

export const StaffingListPage = () => {
  return (
    <div className="max-w-[1600px] mx-auto pb-10">
      <PageHeader 
        title="Staffing Request List" 
        breadcrumbs={['Recruitment', 'Staffing Request List']} 
      />

      <div className="bg-white dark:bg-card border border-border shadow-sm rounded-xl overflow-hidden mt-6">
        <div className="p-4 border-b border-border bg-gradient-to-r from-blue-100/50 to-emerald-100/50 dark:from-blue-900/20 dark:to-emerald-900/20 flex justify-between items-center">
          <div className="flex items-center gap-2 text-indigo-900 dark:text-indigo-300 font-semibold">
            <ListFilter className="h-5 w-5" /> All Requisitions Overview
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-600 dark:text-slate-300">
            <thead className="text-[11px] uppercase bg-[#F4F7FE] dark:bg-muted text-slate-700 dark:text-slate-200">
              <tr>
                <th className="px-6 py-4 font-semibold">Req ID</th>
                <th className="px-6 py-4 font-semibold">Role</th>
                <th className="px-6 py-4 font-semibold">Department</th>
                <th className="px-6 py-4 font-semibold">Requester</th>
                <th className="px-6 py-4 font-semibold text-center">Date</th>
                <th className="px-6 py-4 font-semibold text-center">Status</th>
                <th className="px-6 py-4 font-semibold text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {mockRequests.map((row, i) => (
                <tr key={i} className="hover:bg-slate-50 dark:hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4 font-bold text-indigo-600">{row.id}</td>
                  <td className="px-6 py-4 font-medium text-slate-800 dark:text-slate-200">{row.role}</td>
                  <td className="px-6 py-4 text-slate-500">{row.dept}</td>
                  <td className="px-6 py-4 font-medium">{row.requester}</td>
                  <td className="px-6 py-4 text-center text-slate-500">{row.date}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-2.5 py-1 text-[11px] font-bold uppercase border rounded-full ${row.statusColor}`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button className="text-slate-400 hover:text-indigo-600 p-1.5 rounded transition-colors inline-block tooltip" title="View Details">
                      <Eye className="h-4 w-4" />
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
