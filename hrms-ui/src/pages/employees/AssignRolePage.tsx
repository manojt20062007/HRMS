import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../components/PageHeader';
import { RotateCcw, Save, Check, X } from 'lucide-react';

export const AssignRolePage = () => {
  const [employees, setEmployees] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
  const [selectedRoleId, setSelectedRoleId] = useState('');
  const [selectedReportingId, setSelectedReportingId] = useState('');
  
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    const headers = { 'x-tenant-id': 'pmj.com' };
    try {
      const [empRes, rolesRes] = await Promise.all([
        fetch('http://localhost:3001/api/employees', { headers }),
        fetch('http://localhost:3001/api/roles', { headers }),
      ]);
      if (empRes.ok && rolesRes.ok) {
        setEmployees(await empRes.json());
        setRoles(await rolesRes.json());
      }
    } catch (error) {
      console.error('Failed to load data', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async () => {
    if (!selectedEmployeeId || !selectedRoleId) {
      alert('Please select an employee and a role.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(`http://localhost:3001/api/employees/${selectedEmployeeId}/assign-role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-tenant-id': 'pmj.com'
        },
        body: JSON.stringify({
          roleId: selectedRoleId,
          reportingToId: selectedReportingId || null
        })
      });
      if (res.ok) {
        alert('Role and Reporting Manager assigned successfully!');
        // Reset form
        setSelectedEmployeeId('');
        setSelectedRoleId('');
        setSelectedReportingId('');
        // Refresh grid
        await fetchData();
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to assign role');
      }
    } catch (e) {
      alert('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClear = () => {
    setSelectedEmployeeId('');
    setSelectedRoleId('');
    setSelectedReportingId('');
  };

  return (
    <div className="max-w-[1600px] mx-auto">
      <PageHeader 
        title="Assign Role" 
        breadcrumbs={['User Management', 'Assign Role']} 
      />

      <div className="bg-white dark:bg-card border border-border shadow-sm rounded-xl p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Emp Name <span className="text-red-500">*</span></label>
            <select 
              value={selectedEmployeeId}
              onChange={e => setSelectedEmployeeId(e.target.value)}
              className="w-full text-sm border border-border rounded-md px-3 py-2 bg-transparent outline-none focus:border-indigo-500"
            >
              <option value="">Select Employee</option>
              {employees.map(emp => (
                <option key={emp.id} value={emp.id}>{emp.firstName} {emp.lastName} ({emp.personalEmail})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Role <span className="text-red-500">*</span></label>
            <select 
              value={selectedRoleId}
              onChange={e => setSelectedRoleId(e.target.value)}
              className="w-full text-sm border border-border rounded-md px-3 py-2 bg-transparent outline-none focus:border-indigo-500"
            >
              <option value="">Select Role</option>
              {roles.map(role => (
                <option key={role.id} value={role.id}>{role.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Reporting To</label>
            <select 
              value={selectedReportingId}
              onChange={e => setSelectedReportingId(e.target.value)}
              className="w-full text-sm border border-border rounded-md px-3 py-2 bg-transparent outline-none focus:border-indigo-500"
            >
              <option value="">Select Reporting Manager</option>
              {employees
                .filter(emp => emp.id !== selectedEmployeeId) // Prevent self-reporting
                .map(emp => (
                  <option key={emp.id} value={emp.id}>{emp.firstName} {emp.lastName}</option>
                ))
              }
            </select>
          </div>
        </div>
        <div className="flex justify-center gap-4 mt-8">
          <button 
            onClick={handleClear}
            className="flex items-center gap-2 px-6 py-2 bg-white dark:bg-card border border-border rounded-full text-sm font-medium text-indigo-600 hover:bg-slate-50 transition-colors shadow-sm"
          >
            <RotateCcw className="h-4 w-4" /> Clear
          </button>
          <button 
            onClick={handleSubmit}
            disabled={submitting}
            className="flex items-center gap-2 px-6 py-2 bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800 rounded-full text-sm font-medium text-indigo-600 hover:bg-indigo-100 transition-colors shadow-sm disabled:opacity-50"
          >
            <Save className="h-4 w-4" /> {submitting ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-card border border-border shadow-sm rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-600 dark:text-slate-300">
            <thead className="text-xs bg-[#F4F7FE] dark:bg-muted text-slate-700 dark:text-slate-200">
              <tr>
                <th className="px-6 py-4 font-semibold">Employee Name</th>
                <th className="px-6 py-4 font-semibold">Employee Email</th>
                <th className="px-6 py-4 font-semibold text-center">Assigned Role</th>
                <th className="px-6 py-4 font-semibold">Reporting Manager</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr><td colSpan={4} className="px-6 py-8 text-center text-slate-500">Loading data...</td></tr>
              ) : employees.length === 0 ? (
                <tr><td colSpan={4} className="px-6 py-8 text-center text-slate-500">No employees found.</td></tr>
              ) : (
                employees.map((emp) => {
                  const reportingManager = employees.find(e => e.id === emp.reportingToId);
                  return (
                    <tr key={emp.id} className="hover:bg-slate-50 dark:hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4 font-medium text-slate-700 dark:text-slate-200">{emp.firstName} {emp.lastName}</td>
                      <td className="px-6 py-4">{emp.personalEmail || emp.user?.email || 'N/A'}</td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-block px-2.5 py-1 bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-[11px] font-bold rounded-full">
                          {emp.user?.role?.name || 'EMPLOYEE'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {reportingManager ? `${reportingManager.firstName} ${reportingManager.lastName}` : <span className="text-slate-400 italic">—</span>}
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
