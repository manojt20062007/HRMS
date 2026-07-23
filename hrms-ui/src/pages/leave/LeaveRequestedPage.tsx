import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../components/PageHeader';
import { Calendar, Settings, Check, X } from 'lucide-react';

export const LeaveRequestedPage = () => {
  const [leaves, setLeaves] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLeaves = async () => {
    try {
      let url = 'http://localhost:3001/api/leave';
      
      const userStr = localStorage.getItem('hrms_user');
      if (userStr) {
        const user = JSON.parse(userStr);
        const roleName = user.role?.name;
        // HR, ADMIN, and SUPER_ADMIN get to see the global leave request list for approvals.
        // All other roles (like Managers) only see requests from employees who directly report to them.
        if (roleName !== 'HR' && roleName !== 'ADMIN' && roleName !== 'SUPER_ADMIN') {
          url += `?managerId=${user.employee?.id || 'none'}`;
        }
      }

      const response = await fetch(url, {
        headers: { 'x-tenant-id': 'pmj.com' }
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

  useEffect(() => {
    fetchLeaves();
  }, []);

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      const response = await fetch(`http://localhost:3001/api/leave/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'x-tenant-id': 'pmj.com' },
        body: JSON.stringify({ status })
      });
      if (response.ok) {
        fetchLeaves(); // Refresh the list
      }
    } catch (error) {
      console.error('Failed to update leave status', error);
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto pb-10">
      <PageHeader 
        title="Leave Requested List" 
        breadcrumbs={['Leave', 'Leave Requested List']} 
      />

      <div className="bg-white dark:bg-card border border-border shadow-sm rounded-xl overflow-hidden mt-6">
        {/* Banner with Gradient */}
        <div className="p-3 border-b border-border bg-gradient-to-r from-blue-100/50 to-emerald-100/50 dark:from-blue-900/20 dark:to-emerald-900/20 flex justify-end gap-3 items-center">
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
          <button className="p-2 bg-slate-500 hover:bg-slate-600 text-white rounded-md transition-colors shadow-sm ml-1">
            <Settings className="h-4 w-4" />
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-center text-slate-600 dark:text-slate-300">
            <thead className="text-[11px] uppercase bg-[#F4F7FE] dark:bg-muted text-slate-700 dark:text-slate-200">
              <tr>
                <th className="px-6 py-4 font-semibold text-left">Employee <span className="text-[10px] text-slate-400 inline-block ml-1">↑↓</span></th>
                <th className="px-4 py-4 font-semibold">Role <span className="text-[10px] text-slate-400 inline-block ml-1">↑↓</span></th>
                <th className="px-4 py-4 font-semibold">Date <span className="text-[10px] text-slate-400 inline-block ml-1">↑↓</span></th>
                <th className="px-4 py-4 font-semibold">Duration <span className="text-[10px] text-slate-400 inline-block ml-1">↑↓</span></th>
                <th className="px-4 py-4 font-semibold">Type <span className="text-[10px] text-slate-400 inline-block ml-1">↑↓</span></th>
                <th className="px-4 py-4 font-semibold">Attachment <span className="text-[10px] text-slate-400 inline-block ml-1">↑↓</span></th>
                <th className="px-4 py-4 font-semibold">Reason <span className="text-[10px] text-slate-400 inline-block ml-1">↑↓</span></th>
                <th className="px-4 py-4 font-semibold">Applied Date <span className="text-[10px] text-slate-400 inline-block ml-1">↑↓</span></th>
                <th className="px-4 py-4 font-semibold">Created By <span className="text-[10px] text-slate-400 inline-block ml-1">↑↓</span></th>
                <th className="px-4 py-4 font-semibold">Status <span className="text-[10px] text-slate-400 inline-block ml-1">↑↓</span></th>
                <th className="px-4 py-4 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr><td colSpan={11} className="px-6 py-8 text-slate-500 text-center font-medium">Loading leave requests...</td></tr>
              ) : leaves.length === 0 ? (
                <tr><td colSpan={11} className="px-6 py-8 text-slate-500 text-center font-medium">No leave requests found.</td></tr>
              ) : (
                leaves.map((row, i) => (
                  <tr key={row.id} className="hover:bg-slate-50/50">
                    <td className="px-6 py-4 text-left">
                      <div className="font-medium text-slate-700">{row.employee?.firstName} {row.employee?.lastName}</div>
                      <div className="text-xs text-slate-500">{row.employee?.employeeIdString}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-1 rounded inline-block">
                        {row.employee?.user?.role?.name || 'EMPLOYEE'}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 font-medium">{new Date(row.startDate).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-slate-500">1 day</td>
                    <td className="px-6 py-4 text-slate-500">{row.leaveType}</td>
                    <td className="px-6 py-4 text-slate-500">-</td>
                    <td className="px-6 py-4 text-slate-500">{row.reason}</td>
                    <td className="px-6 py-4 text-slate-500">{new Date(row.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-slate-500">Self</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex text-[10px] font-bold tracking-wider px-2 py-1 rounded-md bg-opacity-10 
                        ${row.status === 'PENDING' ? 'text-amber-600 bg-amber-500' : 
                          row.status === 'APPROVED' ? 'text-emerald-600 bg-emerald-500' : 'text-rose-600 bg-rose-500'}`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {row.status === 'PENDING' ? (
                        <div className="flex items-center justify-center gap-2">
                          <button onClick={() => handleUpdateStatus(row.id, 'APPROVED')} className="text-emerald-600 hover:bg-emerald-50 p-1.5 rounded transition-colors" title="Approve">
                            <Check className="h-4 w-4" />
                          </button>
                          <button onClick={() => handleUpdateStatus(row.id, 'REJECTED')} className="text-rose-600 hover:bg-rose-50 p-1.5 rounded transition-colors" title="Reject">
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400">Processed</span>
                      )}
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
            Showing 1 to {leaves.length} of {leaves.length} entries
          </div>
          <div className="flex items-center gap-1">
            <button className="px-3 py-1.5 border border-border bg-white rounded text-slate-500 hover:bg-slate-50 disabled:opacity-50">
              Previous
            </button>
            <button className="px-3 py-1.5 border border-teal-600 bg-teal-600 text-white rounded font-medium">
              1
            </button>
            <button className="px-3 py-1.5 border border-border bg-white rounded text-slate-500 hover:bg-slate-50 disabled:opacity-50">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
