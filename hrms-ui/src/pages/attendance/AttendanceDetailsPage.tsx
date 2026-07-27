import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../components/PageHeader';
import { Calendar } from 'lucide-react';

export const AttendanceDetailsPage = () => {
  const [details, setDetails] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const currentMonth = new Date().toISOString().slice(0, 7);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      try {
        const userStr = localStorage.getItem('hrms_user');
        if (!userStr) return;
        const user = JSON.parse(userStr);
        const employeeId = user.employeeId;
        if (!employeeId) return;

        const response = await fetch(`http://localhost:3001/api/attendance?employeeId=${employeeId}&month=${selectedMonth}`);
        if (response.ok) {
          setDetails(await response.json());
        }
      } catch (error) {
        console.error('Failed to fetch attendance details', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [selectedMonth]);

  return (
    <div className="max-w-[1600px] mx-auto pb-10">
      <PageHeader 
        title="Attendance Details" 
        breadcrumbs={['Time & Attendance', 'Attendance Details']} 
      />

      <div className="bg-white dark:bg-card border border-border shadow-sm rounded-xl overflow-hidden mt-6">
        {/* Banner */}
        <div className="p-4 border-b border-border flex justify-end gap-3">
          <div className="relative">
            <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
            <input 
              type="month" 
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-40 pl-3 pr-9 py-1.5 bg-white dark:bg-card border border-border rounded-md text-sm outline-none focus:border-indigo-500 shadow-sm text-slate-700 cursor-pointer"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-center text-slate-600 dark:text-slate-300">
            <thead className="text-[12px] bg-[#F4F7FE] dark:bg-muted text-slate-700 dark:text-slate-200">
              <tr>
                <th className="px-6 py-4 font-semibold text-center">Date</th>
                <th className="px-6 py-4 font-semibold text-center">First In</th>
                <th className="px-6 py-4 font-semibold text-center">Last Out</th>
                <th className="px-6 py-4 font-semibold text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr><td colSpan={4} className="px-6 py-8 text-slate-500 text-center font-medium">Loading attendance details...</td></tr>
              ) : details.length === 0 ? (
                <tr><td colSpan={4} className="px-6 py-8 text-slate-500 text-center font-medium">No attendance records found for this month.</td></tr>
              ) : (
                details.map((row, i) => {
                  const inTime = row.checkIn ? new Date(row.checkIn).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '--:--';
                  const outTime = row.checkOut ? new Date(row.checkOut).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '--:--';
                  return (
                    <tr key={row.id} className="hover:bg-slate-50 dark:hover:bg-muted/30 transition-colors bg-white">
                      <td className="px-6 py-4 text-slate-500">{new Date(row.date).toLocaleDateString()}</td>
                      <td className="px-6 py-4 text-slate-500">{inTime}</td>
                      <td className="px-6 py-4 text-slate-500">{outTime}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[10px] font-bold tracking-wider 
                          ${row.status === 'PRESENT' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
