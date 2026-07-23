import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../components/PageHeader';
import { Calendar } from 'lucide-react';

export const OverallAttendancePage = () => {
  const [attendance, setAttendance] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/attendance', {
          headers: { 'x-tenant-id': 'pmj.com' }
        });
        if (response.ok) {
          setAttendance(await response.json());
        }
      } catch (error) {
        console.error('Failed to fetch attendance', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAttendance();
  }, []);
  return (
    <div className="max-w-[1600px] mx-auto pb-10">
      <PageHeader 
        title="Over All Attendance" 
        breadcrumbs={['Attendance Management', 'Over All Attendance']} 
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
            <tbody className="divide-y divide-border bg-[#f8fafc] dark:bg-muted/10">
              {loading ? (
                <tr><td colSpan={6} className="px-6 py-8 text-slate-500 text-center font-medium">Loading attendance...</td></tr>
              ) : attendance.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-8 text-slate-500 text-center font-medium">No attendance records found.</td></tr>
              ) : (
                attendance.map((record, i) => {
                  const inTime = record.checkIn ? new Date(record.checkIn).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '--:--';
                  const outTime = record.checkOut ? new Date(record.checkOut).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '--:--';
                  return (
                    <tr key={record.id} className="hover:bg-slate-50 transition-colors bg-white">
                      <td className="px-6 py-4 text-slate-500 font-semibold">{record.employee?.employeeIdString}</td>
                      <td className="px-6 py-4 text-slate-700 font-medium">{record.employee?.firstName} {record.employee?.lastName}</td>
                      <td className="px-6 py-4 text-slate-500">{new Date(record.date).toLocaleDateString()}</td>
                      <td className="px-6 py-4 text-slate-500">{inTime}</td>
                      <td className="px-6 py-4 text-slate-500">{outTime}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[10px] font-bold tracking-wider 
                          ${record.status === 'PRESENT' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                          {record.status}
                        </span>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
          <div className="flex justify-between items-center text-sm text-slate-500 p-4 border-t border-border bg-white">
             <span>Showing 1 to {attendance.length} of {attendance.length} entries</span>
          </div>
        </div>
      </div>
    </div>
  );
};
