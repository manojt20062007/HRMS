import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../components/PageHeader';
import { Calendar, Search, Plus } from 'lucide-react';

export const LeaveRequestPage = () => {
  const [leaves, setLeaves] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);

  // New Leave Form State
  const [employeeId, setEmployeeId] = useState('');
  const [leaveType, setLeaveType] = useState('Casual Leave');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');

  const [currentUser, setCurrentUser] = useState<any>(null);

  const fetchData = async () => {
    try {
      const userStr = localStorage.getItem('hrms_user');
      let userObj: any = null;
      if (userStr) {
        userObj = JSON.parse(userStr);
        setCurrentUser(userObj);
      }

      let leaveUrl = 'http://localhost:3001/api/leave';
      const roleName = userObj?.role?.name;
      // If not HR or Admin, only show requester's own leave requests
      if (roleName !== 'HR' && roleName !== 'SUPER_ADMIN' && userObj?.employee?.id) {
        leaveUrl += `?requesterId=${userObj.employee.id}`;
      }

      const [leaveRes, empRes] = await Promise.all([
        fetch(leaveUrl, { headers: {  } }),
        fetch('http://localhost:3001/api/employees', { headers: {  } })
      ]);

      if (leaveRes.ok) setLeaves(await leaveRes.json());
      if (empRes.ok) {
        const emps = await empRes.json();
        setEmployees(emps);

        // Default employee selection to self
        if (userObj?.employee?.id) {
          setEmployeeId(userObj.employee.id);
        } else if (emps.length > 0) {
          setEmployeeId(emps[0].id);
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleApplyLeave = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/leave', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ employeeId, leaveType, startDate, endDate, reason })
      });
      if (response.ok) {
        setIsAdding(false);
        setReason('');
        setStartDate('');
        setEndDate('');
        fetchData();
      }
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="max-w-[1600px] mx-auto pb-10">
      <PageHeader
        title="Leave Request List"
        breadcrumbs={['Leave', 'Leave Request List']}
      />

      <div className="bg-white dark:bg-card border border-border shadow-sm rounded-xl overflow-hidden mt-6">
        {/* Banner with Gradient */}
        <div className="p-3 border-b border-border bg-gradient-to-r from-blue-100/50 to-emerald-100/50 dark:from-blue-900/20 dark:to-emerald-900/20 flex flex-wrap justify-end gap-3 items-center">
          <div className="relative flex-grow max-w-xs ml-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search Leave..."
              className="w-full pl-9 pr-3 py-1.5 bg-white dark:bg-card border border-border rounded-md text-sm outline-none focus:border-indigo-500 shadow-sm text-slate-700"
            />
          </div>
          <select className="w-24 px-3 py-1.5 bg-white dark:bg-card border border-border rounded-md text-sm outline-none focus:border-indigo-500 shadow-sm text-slate-700">
            <option>All</option>
          </select>
          <div className="relative">
            <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              defaultValue="July, 2026"
              className="w-40 pl-3 pr-9 py-1.5 bg-white dark:bg-card border border-border rounded-md text-sm outline-none focus:border-indigo-500 shadow-sm text-slate-700 cursor-pointer"
              readOnly
            />
          </div>
          <button onClick={() => setIsAdding(true)} className="flex items-center gap-2 bg-[#0d9488] text-white px-4 py-1.5 rounded-md hover:bg-teal-700 transition-colors text-sm font-medium shadow-sm">
            <Plus className="h-4 w-4" /> Apply Leave
          </button>
        </div>

        {isAdding && (
          <div className="p-4 bg-slate-50 border-b border-border flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-xs font-medium text-slate-500 mb-1">Employee</label>
              {currentUser?.role?.name !== 'HR' && currentUser?.role?.name !== 'SUPER_ADMIN' ? (
                <div className="w-full px-3 py-2 border rounded-md text-sm bg-slate-100 text-slate-700 font-medium">
                  {currentUser?.employee ? `${currentUser.employee.firstName} ${currentUser.employee.lastName}` : 'Loading...'}
                </div>
              ) : (
                <select value={employeeId} onChange={e => setEmployeeId(e.target.value)} className="w-full px-3 py-2 border rounded-md text-sm">
                  {employees.map(emp => (
                    <option key={emp.id} value={emp.id}>{emp.firstName} {emp.lastName}</option>
                  ))}
                </select>
              )}
            </div>
            <div className="flex-1 min-w-[150px]">
              <label className="block text-xs font-medium text-slate-500 mb-1">Leave Type</label>
              <select value={leaveType} onChange={e => setLeaveType(e.target.value)} className="w-full px-3 py-2 border rounded-md text-sm">
                <option>Casual Leave</option>
                <option>Sick Leave</option>
                <option>Annual Leave</option>
              </select>
            </div>
            <div className="flex-1 min-w-[150px]">
              <label className="block text-xs font-medium text-slate-500 mb-1">Start Date</label>
              <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full px-3 py-2 border rounded-md text-sm" />
            </div>
            <div className="flex-1 min-w-[150px]">
              <label className="block text-xs font-medium text-slate-500 mb-1">End Date</label>
              <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="w-full px-3 py-2 border rounded-md text-sm" />
            </div>
            <div className="flex-1 min-w-[200px]">
              <label className="block text-xs font-medium text-slate-500 mb-1">Reason</label>
              <input type="text" value={reason} onChange={e => setReason(e.target.value)} className="w-full px-3 py-2 border rounded-md text-sm" placeholder="Reason..." />
            </div>
            <div className="flex gap-2">
              <button onClick={() => setIsAdding(false)} className="px-4 py-2 border rounded-md text-sm">Cancel</button>
              <button onClick={handleApplyLeave} className="px-4 py-2 bg-[#0d9488] text-white rounded-md text-sm">Apply</button>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-center text-slate-600 dark:text-slate-300">
            <thead className="text-[11px] uppercase bg-[#F4F7FE] dark:bg-muted text-slate-700 dark:text-slate-200">
              <tr>
                <th className="px-6 py-4 font-semibold text-left">Employee <span className="text-[10px] text-slate-400 inline-block ml-1">↑↓</span></th>
                <th className="px-4 py-4 font-semibold">Date & Time <span className="text-[10px] text-slate-400 inline-block ml-1">↑↓</span></th>
                <th className="px-4 py-4 font-semibold">Leave Duration <span className="text-[10px] text-slate-400 inline-block ml-1">↑↓</span></th>
                <th className="px-4 py-4 font-semibold">Leave Type <span className="text-[10px] text-slate-400 inline-block ml-1">↑↓</span></th>
                <th className="px-4 py-4 font-semibold">Attachment <span className="text-[10px] text-slate-400 inline-block ml-1">↑↓</span></th>
                <th className="px-4 py-4 font-semibold">Reason <span className="text-[10px] text-slate-400 inline-block ml-1">↑↓</span></th>
                <th className="px-4 py-4 font-semibold">Applied Date <span className="text-[10px] text-slate-400 inline-block ml-1">↑↓</span></th>
                <th className="px-4 py-4 font-semibold">Status <span className="text-[10px] text-slate-400 inline-block ml-1">↑↓</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr><td colSpan={10} className="px-6 py-8 text-slate-500 text-center font-medium">Loading leaves...</td></tr>
              ) : leaves.length === 0 ? (
                <tr><td colSpan={10} className="px-6 py-8 text-slate-500 text-center font-medium">No leaves requested.</td></tr>
              ) : (
                leaves.map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50/50">
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-700">{row.employee?.firstName} {row.employee?.lastName}</div>
                      <div className="text-xs text-slate-500">{row.employee?.employeeIdString}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-1 rounded inline-block">ROLE</div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 font-medium">{new Date(row.startDate).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-slate-500">1 day</td>
                    <td className="px-6 py-4 text-slate-500">{row.leaveType}</td>
                    <td className="px-6 py-4 text-slate-500">-</td>
                    <td className="px-6 py-4 text-slate-500">{row.reason}</td>
                    <td className="px-6 py-4 text-slate-500">{new Date(row.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
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
          <div className="flex justify-between items-center text-sm text-slate-500 p-4 border-t border-border">
            <span>Showing 1 to {leaves.length} of {leaves.length} entries</span>
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
    </div>
  );
};
