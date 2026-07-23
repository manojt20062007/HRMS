import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../components/PageHeader';
import { Clock } from 'lucide-react';

export const LeaveBalanceReport = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:3001/api/reports/leave-balance', { headers: {  } })
      .then(res => res.json())
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-[1600px] mx-auto pb-10">
      <PageHeader title="Leave Balance Report" breadcrumbs={['Reports', 'Leave Balance']} />

      <div className="bg-white dark:bg-card border border-border shadow-sm rounded-xl overflow-hidden mt-6">
        <div className="p-4 border-b border-border bg-gradient-to-r from-blue-100/50 to-indigo-100/50 flex items-center gap-2 font-semibold">
          <Clock className="h-5 w-5" /> Leave Balances (Yearly)
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-600 dark:text-slate-300">
            <thead className="bg-[#f0f4f8] text-slate-700 font-semibold border-b border-border">
              <tr>
                <th className="px-6 py-4">Employee</th>
                <th className="px-6 py-4 text-center">Total Allotted Leaves</th>
                <th className="px-6 py-4 text-center text-red-500">Leaves Taken</th>
                <th className="px-6 py-4 text-center text-emerald-600">Balance Available</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr><td colSpan={4} className="px-6 py-8 text-center">Loading...</td></tr>
              ) : data.length === 0 ? (
                <tr><td colSpan={4} className="px-6 py-8 text-center">No records found.</td></tr>
              ) : (
                data.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-800">
                      {row.firstName} {row.lastName}
                      <div className="text-[11px] text-slate-500">{row.employeeIdString}</div>
                    </td>
                    <td className="px-6 py-4 text-center font-semibold text-slate-600">{row.totalLeaves}</td>
                    <td className="px-6 py-4 text-center font-bold text-red-500">{row.takenLeaves}</td>
                    <td className="px-6 py-4 text-center font-bold text-emerald-600 bg-emerald-50/30">{row.balanceLeaves}</td>
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
