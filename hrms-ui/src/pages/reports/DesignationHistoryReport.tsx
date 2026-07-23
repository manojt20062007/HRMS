import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../components/PageHeader';
import { Briefcase } from 'lucide-react';

export const DesignationHistoryReport = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:3001/api/reports/designation-history', { headers: { 'x-tenant-id': 'pmj.com' } })
      .then(res => res.json())
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-[1600px] mx-auto pb-10">
      <PageHeader title="Designation History Report" breadcrumbs={['Reports', 'Designation History']} />

      <div className="bg-white dark:bg-card border border-border shadow-sm rounded-xl overflow-hidden mt-6">
        <div className="p-4 border-b border-border bg-gradient-to-r from-blue-100/50 to-indigo-100/50 flex items-center gap-2 font-semibold">
          <Briefcase className="h-5 w-5" /> Current Designations
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-600 dark:text-slate-300">
            <thead className="bg-[#f0f4f8] text-slate-700 font-semibold border-b border-border">
              <tr>
                <th className="px-6 py-4">Employee</th>
                <th className="px-6 py-4">Department</th>
                <th className="px-6 py-4">Current Designation</th>
                <th className="px-6 py-4">Date of Joining</th>
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
                    <td className="px-6 py-4">{row.department || '-'}</td>
                    <td className="px-6 py-4 font-bold text-indigo-600">{row.designation || '-'}</td>
                    <td className="px-6 py-4">{row.dateOfJoining ? new Date(row.dateOfJoining).toLocaleDateString() : '-'}</td>
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
