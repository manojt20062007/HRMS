import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../components/PageHeader';
import { Calendar, Settings, FileSpreadsheet, Clock, Check } from 'lucide-react';

export const DailyAttendancePage = () => {
  const [employees, setEmployees] = useState<any[]>([]);
  const [attendance, setAttendance] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Use today's date formatted as YYYY-MM-DD for the input
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const fetchData = async () => {
    try {
      const [empRes, attRes] = await Promise.all([
        fetch('http://localhost:3001/api/employees', { headers: { 'x-tenant-id': 'pmj.com' } }),
        fetch(`http://localhost:3001/api/attendance?date=${selectedDate}`, { headers: { 'x-tenant-id': 'pmj.com' } })
      ]);
      
      if (empRes.ok) setEmployees(await empRes.json());
      if (attRes.ok) setAttendance(await attRes.json());
    } catch (error) {
      console.error('Failed to fetch data', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedDate]);

  const handleMarkAttendance = async (employeeId: string, type: string, status: string) => {
    try {
      const response = await fetch('http://localhost:3001/api/attendance/mark', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-tenant-id': 'pmj.com' },
        body: JSON.stringify({ employeeId, type, status })
      });
      if (response.ok) {
        fetchData();
      }
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="max-w-[1600px] mx-auto pb-24 relative">
      <PageHeader 
        title="Attendance" 
        breadcrumbs={['Time & Attendance', 'Attendance']} 
      />

      <div className="bg-white dark:bg-card border border-border shadow-sm rounded-xl overflow-hidden mt-6">
        {/* Banner with Gradient */}
        <div className="p-3 border-b border-border bg-gradient-to-r from-blue-100/50 to-emerald-100/50 dark:from-blue-900/20 dark:to-emerald-900/20 flex flex-wrap justify-end gap-3 items-center">
          <div className="relative">
            <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
            <input 
              type="date" 
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-40 pl-3 pr-9 py-1.5 bg-white dark:bg-card border border-border rounded-md text-sm outline-none focus:border-indigo-500 shadow-sm text-slate-700 cursor-pointer"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-1.5 bg-white border border-indigo-200 text-indigo-600 rounded-full text-sm font-semibold hover:bg-indigo-50 shadow-sm transition-colors">
            <FileSpreadsheet className="h-4 w-4" /> Import Excel
          </button>
          <button className="p-1.5 bg-slate-500 hover:bg-slate-600 text-white rounded-md transition-colors shadow-sm ml-1">
            <Settings className="h-4 w-4" />
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-center text-slate-600 dark:text-slate-300">
            <thead className="text-[12px] bg-[#F4F7FE] dark:bg-muted text-slate-700 dark:text-slate-200">
              <tr>
                <th className="px-6 py-4 font-semibold text-left">Employee <span className="text-[10px] text-slate-400 inline-block ml-1">↑↓</span></th>
                <th className="px-4 py-4 font-semibold">Formal Attire <span className="text-[10px] text-slate-400 inline-block ml-1">↑↓</span></th>
                <th className="px-4 py-4 font-semibold">First In <span className="text-[10px] text-slate-400 inline-block ml-1">↑↓</span></th>
                <th className="px-4 py-4 font-semibold">Last Out <span className="text-[10px] text-slate-400 inline-block ml-1">↑↓</span></th>
                <th className="px-4 py-4 font-semibold">Leave Status <span className="text-[10px] text-slate-400 inline-block ml-1">↑↓</span></th>
                <th className="px-4 py-4 font-semibold">Status <span className="text-[10px] text-slate-400 inline-block ml-1">↑↓</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr><td colSpan={6} className="px-6 py-8 text-slate-500 text-center font-medium">Loading attendance...</td></tr>
              ) : employees.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-8 text-slate-500 text-center font-medium">No employees found.</td></tr>
              ) : (
                employees.map((emp, i) => {
                  const record = attendance.find(a => a.employeeId === emp.id);
                  const inTime = record?.checkIn ? new Date(record.checkIn).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '--:--';
                  const outTime = record?.checkOut ? new Date(record.checkOut).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '--:--';
                  const status = record?.status || 'ABSENT';

                  return (
                    <tr key={emp.id} className={`${i % 2 !== 0 ? 'bg-blue-50/30' : 'bg-white'} hover:bg-slate-50 transition-colors`}>
                      <td className="px-6 py-4 text-left">
                        <div className="flex flex-col gap-1 items-start">
                          <span className="font-medium text-slate-700">{emp.firstName} {emp.lastName}</span>
                          <div className="flex gap-2">
                            <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full text-[10px] font-bold border border-slate-200">{emp.employeeIdString}</span>
                            <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-[10px] font-bold uppercase border border-blue-100">ROLE</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                        </label>
                      </td>
                      <td className="px-4 py-4 text-slate-600 font-medium">{inTime}</td>
                      <td className="px-4 py-4 text-slate-600 font-medium">{outTime}</td>
                      <td className="px-4 py-4 text-slate-500">-</td>
                      <td className="px-4 py-4">
                        <select 
                          value={status} 
                          onChange={(e) => {
                            if (!record) {
                              handleMarkAttendance(emp.id, 'CHECK_IN', e.target.value);
                            }
                          }}
                          className={`w-28 px-2 py-1.5 border rounded-md text-xs font-semibold focus:outline-none 
                            ${status === 'PRESENT' ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-rose-200 bg-rose-50 text-rose-700'}`}
                        >
                          <option value="PRESENT">Present</option>
                          <option value="ABSENT">Absent</option>
                          <option value="HALF_DAY">Half Day</option>
                        </select>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-border flex items-center justify-start text-sm text-slate-500">
          Showing 1 to 4 of 4 entries
        </div>
      </div>

      {/* Floating Submit Button */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
        <button className="flex items-center gap-2 px-8 py-2.5 bg-white text-indigo-600 border border-indigo-200 rounded-full text-sm font-semibold hover:bg-indigo-50 shadow-[0_4px_14px_0_rgba(0,0,0,0.1)] transition-all">
          <span className="flex items-center justify-center w-5 h-5 bg-indigo-600 rounded text-white"><Check className="w-3 h-3 stroke-[3]" /></span>
          Submit Attendance
        </button>
      </div>
    </div>
  );
};
