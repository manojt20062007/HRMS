import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/PageHeader';
import { Search, Plus, Pencil, Trash2 } from 'lucide-react';

export const AllEmployeesPage = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/employees', {
        headers: { 'x-tenant-id': 'pmj.com' }
      });
      if (response.ok) {
        const data = await response.json();
        setEmployees(data);
      }
    } catch (error) {
      console.error('Failed to fetch employees', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete employee "${name}"?\nThis action cannot be undone.`)) return;
    try {
      const res = await fetch(`http://localhost:3001/api/employees/${id}`, {
        method: 'DELETE',
        headers: { 'x-tenant-id': 'pmj.com' },
      });
      if (res.ok) {
        await fetchEmployees();
      } else {
        alert('Failed to delete employee. Please try again.');
      }
    } catch (e) {
      alert('Network error. Please try again.');
    }
  };
  return (
    <div className="max-w-[1600px] mx-auto">
      <PageHeader 
        title="All Employees" 
        breadcrumbs={['User Management', 'All Employees']} 
      />

      <div className="bg-white dark:bg-card border border-border shadow-sm rounded-xl overflow-hidden">
        {/* Search Banner */}
        <div className="p-4 border-b border-border bg-gradient-to-r from-blue-100/50 to-emerald-100/50 dark:from-blue-900/20 dark:to-emerald-900/20">
          <div className="flex justify-between items-center gap-3">
            <button
              onClick={() => navigate('/employees/new')}
              className="flex items-center gap-2 bg-[#0d9488] text-white px-4 py-2 rounded-md hover:bg-teal-700 transition-colors text-sm font-medium shadow-sm"
            >
              <Plus className="h-4 w-4" /> Add Employee
            </button>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="w-full pl-9 pr-4 py-2 bg-white dark:bg-card border border-border rounded-lg text-sm outline-none focus:border-indigo-500 shadow-sm"
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-600 dark:text-slate-300">
            <thead className="text-xs uppercase bg-[#F4F7FE] dark:bg-muted text-slate-700 dark:text-slate-200">
              <tr>
                <th className="px-6 py-4 font-semibold flex items-center gap-1 cursor-pointer">Name <span className="text-[10px] text-slate-400">↑↓</span></th>
                <th className="px-6 py-4 font-semibold">Employee ID <span className="text-[10px] text-slate-400">↑↓</span></th>
                <th className="px-6 py-4 font-semibold">Employment Status <span className="text-[10px] text-slate-400">↑↓</span></th>
                <th className="px-6 py-4 font-semibold">Department <span className="text-[10px] text-slate-400">↑↓</span></th>
                <th className="px-6 py-4 font-semibold">Designation <span className="text-[10px] text-slate-400">↑↓</span></th>
                <th className="px-6 py-4 font-semibold max-w-[200px]">Roles <span className="text-[10px] text-slate-400">↑↓</span></th>
                <th className="px-6 py-4 font-semibold">Joining Date <span className="text-[10px] text-slate-400">↑↓</span></th>
                <th className="px-6 py-4 font-semibold text-center">Status <span className="text-[10px] text-slate-400">↑↓</span></th>
                <th className="px-6 py-4 font-semibold text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr><td colSpan={9} className="px-6 py-8 text-center text-slate-500">Loading employees...</td></tr>
              ) : employees.length === 0 ? (
                <tr><td colSpan={9} className="px-6 py-8 text-center text-slate-500">No employees found.</td></tr>
              ) : (
                employees.map((emp, i) => (
                  <tr key={i} className="hover:bg-slate-50 dark:hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-700 dark:text-slate-200">{emp.firstName} {emp.lastName}</td>
                    <td className="px-6 py-4">{emp.employeeIdString || emp.id.split('-')[0]}</td>
                    <td className="px-6 py-4">{emp.employmentStatus || 'N/A'}</td>
                    <td className="px-6 py-4">{emp.department || 'N/A'}</td>
                    <td className="px-6 py-4">{emp.designation || 'N/A'}</td>
                    <td className="px-6 py-4 max-w-[200px] truncate" title={emp.user?.role?.name || 'EMPLOYEE'}>{emp.user?.role?.name || 'EMPLOYEE'}</td>
                    <td className="px-6 py-4">{emp.joiningDate ? new Date(emp.joiningDate).toLocaleDateString() : 'N/A'}</td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-block px-2.5 py-1 bg-green-100 text-green-700 text-[10px] font-bold rounded-full">ACTIVE</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => navigate(`/employees/${emp.id}/edit`)}
                          className="text-blue-600 hover:bg-blue-50 p-1.5 rounded transition-colors"
                          title="Edit Employee"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(emp.id, `${emp.firstName} ${emp.lastName}`)}
                          className="text-red-500 hover:bg-red-50 p-1.5 rounded transition-colors"
                          title="Delete Employee"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-border flex items-center justify-between text-sm text-slate-500">
          <div>
            Showing {employees.length > 0 ? 1 : 0} to {employees.length} of {employees.length} entries
          </div>
          <div className="flex items-center gap-1">
            <button className="px-3 py-1.5 border border-border bg-white rounded text-slate-500 hover:bg-slate-50 disabled:opacity-50">
              Previous
            </button>
            <button className="px-3 py-1.5 border border-teal-600 bg-teal-600 text-white rounded font-medium">
              1
            </button>
            <button className="px-3 py-1.5 border border-border bg-white rounded text-slate-500 hover:bg-slate-50 disabled:opacity-50">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
