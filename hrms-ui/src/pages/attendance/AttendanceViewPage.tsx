import React from 'react';
import { PageHeader } from '../../components/PageHeader';
import { Calendar } from 'lucide-react';

export const AttendanceViewPage = () => {
  return (
    <div className="max-w-[1600px] mx-auto pb-10">
      <PageHeader 
        title="Attendance" 
        breadcrumbs={['Attendance Details', 'Attendance']} 
      />

      <div className="bg-white dark:bg-card border border-border shadow-sm rounded-xl overflow-hidden mt-6">
        {/* Banner */}
        <div className="p-4 border-b border-border flex justify-end gap-3">
          <div className="relative">
            <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
            <input 
              type="text" 
              defaultValue="dd-mm-yyyy"
              className="w-40 pl-3 pr-9 py-1.5 bg-white dark:bg-card border border-border rounded-md text-sm outline-none focus:border-indigo-500 shadow-sm text-slate-500 cursor-pointer"
              readOnly
            />
          </div>
          <button className="px-4 py-1.5 bg-white border border-border rounded-md text-sm text-slate-700 hover:bg-slate-50 shadow-sm transition-colors">
            Select
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-center text-slate-600 dark:text-slate-300">
            <thead className="text-[12px] bg-[#F4F7FE] dark:bg-muted text-slate-700 dark:text-slate-200">
              <tr>
                <th className="px-6 py-4 font-semibold text-center">Employee Id</th>
                <th className="px-6 py-4 font-semibold text-center">Employee Name</th>
                <th className="px-6 py-4 font-semibold text-center">Date</th>
                <th className="px-6 py-4 font-semibold text-center">First In</th>
                <th className="px-6 py-4 font-semibold text-center">Last Out</th>
                <th className="px-6 py-4 font-semibold text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {/* Empty state - as shown in the screenshot */}
              <tr>
                <td colSpan={6} className="px-6 py-10"></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
