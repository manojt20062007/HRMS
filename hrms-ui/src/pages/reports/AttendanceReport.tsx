import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../components/PageHeader';
import { Calendar } from 'lucide-react';

export const AttendanceReport = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:3001/api/reports/attendance', { headers: { 'x-tenant-id': 'pmj.com' } })
      .then(res => res.json())
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-[1600px] mx-auto pb-10">
      <PageHeader title="Attendance Report" breadcrumbs={['Reports', 'Attendance Report']} />

      <div className="bg-white dark:bg-card border border-border shadow-sm rounded-xl overflow-hidden mt-6">
        <div className="p-4 border-b border-border bg-gradient-to-r from-blue-100/50 to-indigo-100/50 flex items-center gap-2 font-semibold">
          <Calendar className="h-5 w-5" /> All Attendance Records
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-600 dark:text-slate-300">
            <thead className="bg-[#f0f4f8] text-slate-700 font-semibold border-b border-border">
              <tr>
                <th className="px-6 py-4">Employee</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Sign In</th>
                <th className="px-6 py-4">Sign Out</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr><td colSpan={5} className="px-6 py-8 text-center">Loading...</td></tr>
              ) : data.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-8 text-center">No records found.</td></tr>
              ) : (
                data.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-800">
                      {row.employee?.firstName} {row.employee?.lastName}
                      <div className="text-[11px] text-slate-500">{row.employee?.employeeIdString}</div>
                    </td>
                    <td className="px-6 py-4">{new Date(row.date).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 text-[11px] font-bold uppercase rounded-full ${row.status === 'PRESENT' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">{row.signInTime ? new Date(row.signInTime).toLocaleTimeString() : '-'}</td>
                    <td className="px-6 py-4">{row.signOutTime ? new Date(row.signOutTime).toLocaleTimeString() : '-'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
