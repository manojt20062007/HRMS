import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../components/PageHeader';
import { UserCheck, Play } from 'lucide-react';

export const StaffingListExecutorPage = () => {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/recruitment/staffing?status=APPROVED', {
        headers: { 'x-tenant-id': 'pmj.com' }
      });
      if (response.ok) {
        setRequests(await response.json());
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      const response = await fetch(`http://localhost:3001/api/recruitment/staffing/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'x-tenant-id': 'pmj.com' },
        body: JSON.stringify({ status })
      });
      if (response.ok) {
        fetchRequests();
      }
    } catch (error) {
      console.error('Failed to update status', error);
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto pb-10">
      <PageHeader 
        title="Staffing List Executor" 
        breadcrumbs={['Recruitment', 'Staffing List Executor']} 
      />

      <div className="bg-white dark:bg-card border border-border shadow-sm rounded-xl overflow-hidden mt-6">
        <div className="p-4 border-b border-border bg-gradient-to-r from-blue-100/50 to-emerald-100/50 dark:from-blue-900/20 dark:to-emerald-900/20 flex justify-between items-center">
          <div className="flex items-center gap-2 text-indigo-900 dark:text-indigo-300 font-semibold">
            <UserCheck className="h-5 w-5" /> Execute Approved Staffing
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-600 dark:text-slate-300">
            <thead className="text-[11px] uppercase bg-[#F4F7FE] dark:bg-muted text-slate-700 dark:text-slate-200">
              <tr>
                <th className="px-6 py-4 font-semibold">Req ID</th>
                <th className="px-6 py-4 font-semibold">Role</th>
                <th className="px-6 py-4 font-semibold">Department</th>
                <th className="px-6 py-4 font-semibold">Requester</th>
                <th className="px-6 py-4 font-semibold text-center">Status</th>
                <th className="px-6 py-4 font-semibold text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-slate-500">Loading requests...</td></tr>
              ) : requests.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-slate-500">No approved requests to execute</td></tr>
              ) : (
                requests.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50 dark:hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 font-bold text-indigo-600">{row.id.split('-')[0]}</td>
                    <td className="px-6 py-4 font-medium text-slate-800 dark:text-slate-200">{row.designation}</td>
                    <td className="px-6 py-4 text-slate-500">{row.department}</td>
                    <td className="px-6 py-4 font-medium">{row.requestedBy?.firstName} {row.requestedBy?.lastName}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2.5 py-1 text-[11px] font-bold uppercase border rounded-full bg-emerald-50 text-emerald-600 border-emerald-200`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => handleUpdateStatus(row.id, 'EXECUTED')} className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors tooltip" title="Execute">
                          <Play className="h-4 w-4 fill-current" />
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
