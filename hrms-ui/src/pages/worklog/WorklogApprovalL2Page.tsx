import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../components/PageHeader';
import { Check, X } from 'lucide-react';
import { getTenantHeader, API_BASE_URL } from '../../config';

export const WorklogApprovalL2Page = () => {
  const [worklogs, setWorklogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPendingWorklogs();
  }, []);

  const fetchPendingWorklogs = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/worklog?status=PENDING_L2`, {
        headers: getTenantHeader()
      });
      if (response.ok) {
        setWorklogs(await response.json());
      }
    } catch (error) {
      console.error('Failed to fetch pending L2 worklogs', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/worklog/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getTenantHeader()
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        fetchPendingWorklogs();
      }
    } catch (error) {
      console.error('Failed to update worklog status', error);
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto pb-10">
      <PageHeader 
        title="Worklog Approval (L2 / HR)" 
        breadcrumbs={['Worklog & Travel', 'Worklog Approval L2']} 
      />

      <div className="bg-white dark:bg-card border border-border shadow-sm rounded-xl overflow-hidden mt-6">
        <div className="p-4 border-b border-border bg-slate-50/50">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white">Final Approvals Required</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-600 dark:text-slate-300">
            <thead className="text-[12px] bg-[#F4F7FE] dark:bg-muted text-slate-700 dark:text-slate-200 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-semibold">Employee</th>
                <th className="px-6 py-4 font-semibold">Date</th>
                <th className="px-6 py-4 font-semibold">Hours</th>
                <th className="px-6 py-4 font-semibold">Description</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-500">Loading pending worklogs...</td></tr>
              ) : worklogs.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-500">No worklogs awaiting L2 approval.</td></tr>
              ) : (
                worklogs.map(log => (
                  <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-700">
                      {log.employee?.firstName} {log.employee?.lastName}
                      <div className="text-xs text-slate-400 font-normal">{log.employee?.employeeIdString}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{new Date(log.date).toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap"><span className="px-2.5 py-1 bg-slate-100 text-slate-700 font-bold rounded text-xs">{log.hours} hrs</span></td>
                    <td className="px-6 py-4 max-w-sm truncate" title={log.description}>{log.description}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleUpdateStatus(log.id, 'APPROVED')}
                          className="flex items-center gap-1 px-3 py-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-md text-sm font-medium transition-colors"
                        >
                          <Check className="h-4 w-4" /> Final Approve
                        </button>
                        <button 
                          onClick={() => handleUpdateStatus(log.id, 'REJECTED')}
                          className="flex items-center gap-1 px-3 py-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-md text-sm font-medium transition-colors"
                        >
                          <X className="h-4 w-4" /> Reject
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
