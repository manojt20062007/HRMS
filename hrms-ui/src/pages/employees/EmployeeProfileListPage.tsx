import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../components/PageHeader';
import { Search, MoreHorizontal, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const EmployeeProfileListPage = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/employees', {
          headers: {
            
          }
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
    fetchEmployees();
  }, []);

  return (
    <div className="max-w-[1600px] mx-auto pb-10">
      <PageHeader 
        title="Employee Profile List" 
        breadcrumbs={['User Management', 'Employee Profile List']} 
      />

      <div className="bg-white dark:bg-card border border-border shadow-sm rounded-xl overflow-hidden">
        {/* Search Banner with Gradient */}
        <div className="p-4 border-b border-border bg-gradient-to-r from-blue-100/50 to-emerald-100/50 dark:from-blue-900/20 dark:to-emerald-900/20 flex flex-wrap items-center justify-end gap-4">
          <div className="relative w-64 bg-white dark:bg-card rounded-full overflow-hidden shadow-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search..." 
              className="w-full pl-9 pr-4 py-2 border-none outline-none text-sm bg-transparent"
            />
          </div>
          <button 
            onClick={() => navigate('/employees/new')}
            className="flex items-center gap-2 px-5 py-2 bg-white dark:bg-card border border-indigo-200 text-indigo-600 rounded-full text-sm font-semibold hover:bg-indigo-50 shadow-sm transition-colors"
          >
            <Plus className="h-4 w-4" /> Add Details
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-center text-slate-600 dark:text-slate-300">
            <thead className="text-xs bg-[#F4F7FE] dark:bg-muted text-slate-700 dark:text-slate-200">
              <tr>
                <th className="px-6 py-4 font-semibold text-center">Employee Id <span className="text-[10px] text-slate-400 inline-block ml-1">↑↓</span></th>
                <th className="px-6 py-4 font-semibold text-center">Employee Name <span className="text-[10px] text-slate-400 inline-block ml-1">↑↓</span></th>
                <th className="px-6 py-4 font-semibold text-center">Employee Description <span className="text-[10px] text-slate-400 inline-block ml-1">↑↓</span></th>
                <th className="px-6 py-4 font-semibold text-center">Skills <span className="text-[10px] text-slate-400 inline-block ml-1">↑↓</span></th>
                <th className="px-6 py-4 font-semibold text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500">Loading employees...</td>
                </tr>
              ) : employees.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500">No employees found.</td>
                </tr>
              ) : (
                employees.map((prof, i) => (
                  <tr key={i} className="hover:bg-slate-50 dark:hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-700 dark:text-slate-200">{prof.employeeIdString || prof.id.split('-')[0]}</td>
                    <td className="px-6 py-4">{prof.firstName} {prof.lastName}</td>
                    <td className="px-6 py-4">{prof.designation || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-pre-wrap">{prof.qualifications?.[0]?.degree || 'N/A'}</td>
                    <td className="px-6 py-4">
                      <button className="text-blue-600 hover:bg-blue-50 p-1.5 rounded transition-colors inline-block">
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

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
