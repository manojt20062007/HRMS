import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../components/PageHeader';
import { Target, CheckCircle2, XCircle } from 'lucide-react';
import { getTenantHeader, API_BASE_URL } from '../../config';

export const ObjectiveManagerPage = () => {
  const [groupedObjectives, setGroupedObjectives] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  const fetchObjectives = async () => {
    try {
      const userStr = localStorage.getItem('hrms_user');
      if (!userStr) return;
      const user = JSON.parse(userStr);
      if (!user.employeeId) return;

      const response = await fetch(`${API_BASE_URL}/api/objectives?managerId=${user.employeeId}`, {
        headers: getTenantHeader()
      });
      
      if (response.ok) {
        const data = await response.json();
        
        // Group by employee
        const grouped: Record<string, any> = {};
        
        data.forEach((obj: any) => {
          if (!obj.employee) return;
          const empId = obj.employeeId;
          
          if (!grouped[empId]) {
            grouped[empId] = {
              employeeId: empId,
              empName: `${obj.employee.firstName} ${obj.employee.lastName}`,
              empIdString: obj.employee.employeeIdString,
              role: obj.employee.designation?.name || 'EMPLOYEE',
              objectives: [],
              totalWeightage: 0,
              status: obj.status // Using the most recent or common status
            };
          }
          
          grouped[empId].objectives.push(obj);
          grouped[empId].totalWeightage += (obj.weightage || 0);
          
          // Determine overall status based on highest precedence
          // SUBMITTED > DRAFT > APPROVED
          if (obj.status === 'SUBMITTED') {
            grouped[empId].status = 'SUBMITTED';
          }
        });
        
        setGroupedObjectives(Object.values(grouped));
      }
    } catch (error) {
      console.error('Failed to fetch manager objectives', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchObjectives();
  }, []);

  const handleBatchUpdate = async (employeeId: string, newStatus: string) => {
    if (!window.confirm(`Are you sure you want to ${newStatus === 'APPROVED' ? 'approve' : 'reject'} this employee's goals?`)) return;
    try {
      const response = await fetch(`${API_BASE_URL}/api/objectives/employee/${employeeId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getTenantHeader()
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (response.ok) {
        fetchObjectives();
      }
    } catch (error) {
      console.error('Failed to update employee objectives', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DRAFT': return 'bg-slate-50 text-slate-600 border-slate-200';
      case 'SUBMITTED': return 'bg-amber-50 text-amber-600 border-amber-200';
      case 'APPROVED': return 'bg-emerald-50 text-emerald-600 border-emerald-200';
      case 'REJECTED': return 'bg-rose-50 text-rose-600 border-rose-200';
      default: return 'bg-slate-50 text-slate-600 border-slate-200';
    }
  };

  // Filter the rows
  const displayRows = groupedObjectives.filter(row => {
    if (filter === 'All') return true;
    if (filter === 'Pending' && row.status === 'SUBMITTED') return true;
    if (filter === 'Approved' && row.status === 'APPROVED') return true;
    return false;
  });

  return (
    <div className="max-w-[1600px] mx-auto pb-10">
      <PageHeader 
        title="Objectives Manager Approval" 
        breadcrumbs={['Performance Management', 'Objectives Manager Approval']} 
      />

      <div className="bg-white dark:bg-card border border-border shadow-sm rounded-xl overflow-hidden mt-6">
        {/* Banner */}
        <div className="p-4 border-b border-border bg-gradient-to-r from-blue-100/50 to-emerald-100/50 dark:from-blue-900/20 dark:to-emerald-900/20 flex justify-between items-center">
          <div className="flex items-center gap-2 text-indigo-900 dark:text-indigo-300 font-semibold">
            <Target className="h-5 w-5" /> Team Goal Submissions
          </div>
          <select 
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-32 px-3 py-1.5 bg-white dark:bg-card border border-border rounded-md text-sm outline-none focus:border-indigo-500 shadow-sm text-slate-700"
          >
            <option value="All">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
          </select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-600 dark:text-slate-300">
            <thead className="text-[11px] uppercase bg-[#F4F7FE] dark:bg-muted text-slate-700 dark:text-slate-200">
              <tr>
                <th className="px-6 py-4 font-semibold">Employee</th>
                <th className="px-6 py-4 font-semibold text-center">Total Objectives</th>
                <th className="px-6 py-4 font-semibold text-center">Overall Weightage</th>
                <th className="px-6 py-4 font-semibold text-center">Status</th>
                <th className="px-6 py-4 font-semibold text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-500">Loading team objectives...</td></tr>
              ) : displayRows.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-500">No submissions found matching the criteria.</td></tr>
              ) : (
                displayRows.map((row) => (
                  <tr key={row.employeeId} className="hover:bg-slate-50 dark:hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1 items-start">
                        <span className="font-medium text-slate-700 dark:text-slate-200">{row.empName}</span>
                        <div className="flex gap-2">
                          <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-bold border border-slate-200">{row.empIdString}</span>
                          <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-bold uppercase border border-slate-200">{row.role}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center font-bold text-slate-700 dark:text-slate-300">{row.objectives.length}</td>
                    <td className="px-6 py-4 text-center font-bold text-indigo-600">{row.totalWeightage}%</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2.5 py-1 text-[11px] font-bold uppercase border rounded-full ${getStatusColor(row.status)}`}>
                        {row.status === 'SUBMITTED' ? 'PENDING REVIEW' : row.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        {row.status === 'SUBMITTED' && (
                          <>
                            <button 
                              onClick={() => handleBatchUpdate(row.employeeId, 'APPROVED')}
                              className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors tooltip" 
                              title="Approve"
                            >
                              <CheckCircle2 className="h-5 w-5" />
                            </button>
                            <button 
                              onClick={() => handleBatchUpdate(row.employeeId, 'REJECTED')}
                              className="flex items-center justify-center w-8 h-8 rounded-full bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors tooltip" 
                              title="Reject"
                            >
                              <XCircle className="h-5 w-5" />
                            </button>
                          </>
                        )}
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
