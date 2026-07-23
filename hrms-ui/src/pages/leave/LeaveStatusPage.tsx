import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../components/PageHeader';
import { Calendar } from 'lucide-react';

export const LeaveStatusPage = () => {
  const [leaves, setLeaves] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        let url = 'http://localhost:3001/api/leave';
        const userStr = localStorage.getItem('hrms_user');
        if (userStr) {
          const user = JSON.parse(userStr);
          const roleName = user.role?.name;
          if (roleName !== 'HR' && user.employee?.id) {
            url += `?requesterId=${user.employee.id}`;
          }
        }
        const response = await fetch(url, {
          headers: {  }
        });
        if (response.ok) {
          setLeaves(await response.json());
        }
      } catch (error) {
        console.error('Failed to fetch leaves', error);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaves();
  }, []);
  return (
    <div className="max-w-[1600px] mx-auto pb-10">
      <PageHeader
        title="Leave Status List"
        breadcrumbs={['Leave', 'Leave Status List']}
      />

      <div className="bg-white dark:bg-card border border-border shadow-sm rounded-xl overflow-hidden mt-6">
        {/* Banner */}
        <div className="p-4 border-b border-border flex justify-end gap-3">
          <div className="relative">
            <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              defaultValue="July, 2026"
              className="w-40 pl-3 pr-9 py-1.5 bg-white dark:bg-card border border-border rounded-md text-sm outline-none focus:border-indigo-500 shadow-sm text-slate-700 cursor-pointer"
              readOnly
            />
          </div>
          <select className="w-24 px-3 py-1.5 bg-white dark:bg-card border border-border rounded-md text-sm outline-none focus:border-indigo-500 shadow-sm text-slate-700">
            <option>All</option>
          </select>
          <select className="w-24 px-3 py-1.5 bg-white dark:bg-card border border-border rounded-md text-sm outline-none focus:border-indigo-500 shadow-sm text-slate-700">
            <option>All</option>
          </select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-center text-slate-600 dark:text-slate-300">
            <thead className="text-xs bg-[#F4F7FE] dark:bg-muted text-slate-700 dark:text-slate-200">
              <tr>
                <th className="px-6 py-4 font-semibold text-center">Employee <span className="text-[10px] text-slate-400 inline-block ml-1">↑↓</span></th>
                <th className="px-6 py-4 font-semibold text-center">Date & Time <span className="text-[10px] text-slate-400 inline-block ml-1">↑↓</span></th>
                <th className="px-6 py-4 font-semibold text-center">Leave Duration <span className="text-[10px] text-slate-400 inline-block ml-1">↑↓</span></th>
                <th className="px-6 py-4 font-semibold text-center">Leave Type <span className="text-[10px] text-slate-400 inline-block ml-1">↑↓</span></th>
                <th className="px-6 py-4 font-semibold text-center">Attachment <span className="text-[10px] text-slate-400 inline-block ml-1">↑↓</span></th>
                <th className="px-6 py-4 font-semibold text-center">Reason <span className="text-[10px] text-slate-400 inline-block ml-1">↑↓</span></th>
                <th className="px-6 py-4 font-semibold text-center">Status <span className="text-[10px] text-slate-400 inline-block ml-1">↑↓</span></th>
                <th className="px-6 py-4 font-semibold text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-[#f8fafc] dark:bg-muted/10">
              {loading ? (
                <tr><td colSpan={8} className="px-6 py-8 text-slate-500 text-center font-medium">Loading leaves...</td></tr>
              ) : leaves.length === 0 ? (
                <tr><td colSpan={8} className="px-6 py-8 text-slate-500 text-center font-medium">No leaves requested.</td></tr>
              ) : (
                leaves.map((row, i) => (
                  <tr key={row.id} className="hover:bg-slate-50/50 text-left">
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-700 text-center">{row.employee?.firstName} {row.employee?.lastName}</div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 font-medium text-center">{new Date(row.startDate).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-slate-500 text-center">1 day</td>
                    <td className="px-6 py-4 text-slate-500 text-center">{row.leaveType}</td>
                    <td className="px-6 py-4 text-slate-500 text-center">-</td>
                    <td className="px-6 py-4 text-slate-500 text-center">{row.reason}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex text-[10px] font-bold tracking-wider px-2 py-1 rounded-md bg-opacity-10 
                        ${row.status === 'PENDING' ? 'text-amber-600 bg-amber-500' :
                          row.status === 'APPROVED' ? 'text-emerald-600 bg-emerald-500' : 'text-rose-600 bg-rose-500'}`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button className="text-slate-400 hover:text-slate-600 p-1 rounded transition-colors">
                        ...
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-border flex items-center justify-between text-sm text-slate-500">
          <div>
            Showing 0 to 0 of 0 entries
          </div>
          <div className="flex items-center gap-1">
            <button className="px-3 py-1.5 border border-border bg-white rounded text-slate-400 opacity-50 cursor-not-allowed">
              Previous
            </button>
            <button className="px-3 py-1.5 border border-border bg-white rounded text-slate-400 opacity-50 cursor-not-allowed">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
