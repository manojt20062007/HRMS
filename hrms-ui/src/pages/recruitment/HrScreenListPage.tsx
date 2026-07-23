import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../components/PageHeader';
import { PhoneCall, Play, XCircle } from 'lucide-react';

export const HrScreenListPage = () => {
  const [candidates, setCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCandidates = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/recruitment/candidates?status=HR_SCREEN', {
        headers: {  }
      });
      if (response.ok) {
        setCandidates(await response.json());
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      const response = await fetch(`http://localhost:3001/api/recruitment/candidates/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (response.ok) {
        fetchCandidates();
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto pb-10">
      <PageHeader 
        title="HR Screen List" 
        breadcrumbs={['Recruitment', 'HR Screen List']} 
      />

      <div className="bg-white dark:bg-card border border-border shadow-sm rounded-xl overflow-hidden mt-6">
        <div className="p-4 border-b border-border bg-gradient-to-r from-blue-100/50 to-indigo-100/50 dark:from-blue-900/20 dark:to-indigo-900/20 flex items-center gap-2 text-indigo-900 dark:text-indigo-300 font-semibold">
          <PhoneCall className="h-5 w-5" /> Pending HR Screening
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-600 dark:text-slate-300">
            <thead className="text-[11px] uppercase bg-[#F4F7FE] dark:bg-muted text-slate-700 dark:text-slate-200">
              <tr>
                <th className="px-6 py-4 font-semibold">Candidate Name</th>
                <th className="px-6 py-4 font-semibold">Phone</th>
                <th className="px-6 py-4 font-semibold">Applied Role</th>
                <th className="px-6 py-4 font-semibold text-center">Status</th>
                <th className="px-6 py-4 font-semibold text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-500">Loading candidates...</td></tr>
              ) : candidates.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-500">No candidates pending HR screen</td></tr>
              ) : (
                candidates.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50 dark:hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-800 dark:text-slate-200">{row.firstName} {row.lastName}</td>
                    <td className="px-6 py-4">{row.phone}</td>
                    <td className="px-6 py-4">{row.staffingRequest?.designation}</td>
                    <td className="px-6 py-4 text-center">
                      <span className="px-2.5 py-1 text-[11px] font-bold uppercase border rounded-full bg-blue-50 text-blue-600 border-blue-200">
                        {row.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => handleUpdateStatus(row.id, 'INTERVIEW_PANEL')} className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors tooltip" title="Move to Interview Panel">
                          <Play className="h-4 w-4 fill-current" />
                        </button>
                        <button onClick={() => handleUpdateStatus(row.id, 'REJECTED')} className="flex items-center justify-center w-8 h-8 rounded-full bg-red-50 text-red-600 hover:bg-red-100 transition-colors tooltip" title="Reject">
                          <XCircle className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
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
