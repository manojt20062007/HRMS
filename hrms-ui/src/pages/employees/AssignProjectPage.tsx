import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../components/PageHeader';
import { RotateCcw, Save, FileSpreadsheet, RefreshCw, Trash2 } from 'lucide-react';

export const AssignProjectPage = () => {
  const [employees, setEmployees] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    employeeId: '',
    projectId: '',
    role: '',
    startDate: '',
    endDate: '',
    remark: ''
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [empRes, projRes] = await Promise.all([
        fetch('http://localhost:3001/api/employees'),
        fetch('http://localhost:3001/api/projects')
      ]);
      
      if (empRes.ok) setEmployees(await empRes.json());
      if (projRes.ok) setProjects(await projRes.json());
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAssign = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!formData.employeeId || !formData.projectId) {
      alert('Please select both an employee and a project.');
      return;
    }

    const roleString = formData.role || formData.remark || 'Assigned';

    try {
      const response = await fetch(`http://localhost:3001/api/projects/${formData.projectId}/employees`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ employeeId: formData.employeeId, role: roleString })
      });
      if (response.ok) {
        setFormData({ employeeId: '', projectId: '', role: '', startDate: '', endDate: '', remark: '' });
        fetchData();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to assign project');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (projectId: string, employeeId: string) => {
    if (!window.confirm('Remove this assignment?')) return;
    try {
      const response = await fetch(`http://localhost:3001/api/projects/${projectId}/employees/${employeeId}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        fetchData();
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Flatten assignments from projects
  const assignments: any[] = [];
  projects.forEach(p => {
    if (p.employees && p.employees.length > 0) {
      p.employees.forEach((ep: any) => {
        assignments.push({
          projectId: p.id,
          employeeId: ep.employeeId,
          projectName: p.name,
          employeeName: ep.employee ? `${ep.employee.firstName} ${ep.employee.lastName}` : 'Unknown',
          role: ep.role,
          projectStart: p.startDate ? new Date(p.startDate).toLocaleDateString() : 'N/A',
          projectEnd: p.endDate ? new Date(p.endDate).toLocaleDateString() : 'N/A',
          status: p.status
        });
      });
    }
  });

  return (
    <div className="max-w-[1600px] mx-auto pb-10">
      <PageHeader 
        title="Assign Project" 
        breadcrumbs={['User Management', 'Assign Project']} 
      />

      <div className="bg-white dark:bg-card border border-border shadow-sm rounded-xl p-6 mb-6">
        <form onSubmit={handleAssign} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Employee Name <span className="text-red-500">*</span></label>
            <select 
              required
              className="w-full text-sm border border-border rounded-md px-3 py-2 bg-transparent outline-none focus:border-indigo-500"
              value={formData.employeeId}
              onChange={(e) => setFormData({...formData, employeeId: e.target.value})}
            >
              <option value="">-- Select Employee --</option>
              {employees.map(emp => (
                <option key={emp.id} value={emp.id}>{emp.firstName} {emp.lastName}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Project Name <span className="text-red-500">*</span></label>
            <select 
              required
              className="w-full text-sm border border-border rounded-md px-3 py-2 bg-transparent outline-none focus:border-indigo-500"
              value={formData.projectId}
              onChange={(e) => setFormData({...formData, projectId: e.target.value})}
            >
              <option value="">-- Select Project --</option>
              {projects.map(proj => (
                <option key={proj.id} value={proj.id}>{proj.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Percentage / Role</label>
            <input 
              type="text" 
              placeholder="e.g. 100% or Dev"
              className="w-full text-sm border border-border rounded-md px-3 py-2 bg-transparent outline-none focus:border-indigo-500" 
              value={formData.role}
              onChange={(e) => setFormData({...formData, role: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Start Date</label>
            <input 
              type="date" 
              className="w-full text-sm border border-border rounded-md px-3 py-2 bg-transparent outline-none focus:border-indigo-500 text-slate-500" 
              value={formData.startDate}
              onChange={(e) => setFormData({...formData, startDate: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">End Date</label>
            <input 
              type="date" 
              className="w-full text-sm border border-border rounded-md px-3 py-2 bg-transparent outline-none focus:border-indigo-500 text-slate-500" 
              value={formData.endDate}
              onChange={(e) => setFormData({...formData, endDate: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Remark</label>
            <input 
              type="text" 
              placeholder="Enter Remark"
              className="w-full text-sm border border-border rounded-md px-3 py-2 bg-transparent outline-none focus:border-indigo-500" 
              value={formData.remark}
              onChange={(e) => setFormData({...formData, remark: e.target.value})}
            />
          </div>
        </form>
        
        <div className="flex justify-center gap-4 mt-8">
          <button 
            type="button"
            onClick={() => setFormData({ employeeId: '', projectId: '', role: '', startDate: '', endDate: '', remark: '' })}
            className="flex items-center gap-2 px-6 py-2 bg-white dark:bg-card border border-border rounded-full text-sm font-medium text-indigo-600 hover:bg-slate-50 transition-colors shadow-sm"
          >
            <RotateCcw className="h-4 w-4" /> Clear
          </button>
          <button 
            type="button"
            onClick={() => handleAssign()}
            className="flex items-center gap-2 px-6 py-2 bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800 rounded-full text-sm font-medium text-indigo-600 hover:bg-indigo-100 transition-colors shadow-sm"
          >
            <Save className="h-4 w-4" /> Assign
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-card border border-border shadow-sm rounded-xl overflow-hidden">
        <div className="p-4 border-b border-border flex flex-wrap items-center justify-between gap-4">
          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 border border-indigo-100 dark:border-indigo-800 rounded-full text-sm font-medium hover:bg-indigo-100 transition-colors">
            <FileSpreadsheet className="h-4 w-4" /> Export to Excel
          </button>
          
          <div className="flex items-center gap-3 text-sm">
            <span className="font-semibold text-slate-700 dark:text-slate-300">Date Range:</span>
            <span className="text-slate-500">From</span>
            <input type="date" className="border border-border rounded-md px-2 py-1.5 outline-none focus:border-indigo-500 text-slate-500" />
            <span className="text-slate-500">To</span>
            <input type="date" className="border border-border rounded-md px-2 py-1.5 outline-none focus:border-indigo-500 text-slate-500" />
            <button onClick={fetchData} className="p-2 border border-border rounded-md hover:bg-slate-50 text-slate-500 transition-colors">
              <RefreshCw className={loading ? "h-4 w-4 animate-spin" : "h-4 w-4"} />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-600 dark:text-slate-300">
            <thead className="text-xs bg-[#F4F7FE] dark:bg-muted text-slate-700 dark:text-slate-200">
              <tr>
                <th className="px-6 py-4 font-semibold">Employee Name</th>
                <th className="px-6 py-4 font-semibold">Project Name</th>
                <th className="px-6 py-4 font-semibold">Start Date</th>
                <th className="px-6 py-4 font-semibold">End Date</th>
                <th className="px-6 py-4 font-semibold">Project Status</th>
                <th className="px-6 py-4 font-semibold text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {assignments.map((assignment, i) => (
                <tr key={i} className="hover:bg-slate-50 dark:hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-700 dark:text-slate-200">{assignment.employeeName}</td>
                  <td className="px-6 py-4">{assignment.projectName} {assignment.role ? `(${assignment.role})` : ''}</td>
                  <td className="px-6 py-4">{assignment.projectStart}</td>
                  <td className="px-6 py-4">{assignment.projectEnd}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      assignment.status === 'ACTIVE' ? 'bg-green-100 text-green-700' :
                      assignment.status === 'COMPLETED' ? 'bg-blue-100 text-blue-700' :
                      'bg-orange-100 text-orange-700'
                    }`}>
                      {assignment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button 
                      onClick={() => handleDelete(assignment.projectId, assignment.employeeId)}
                      className="text-red-600 hover:bg-red-50 p-1.5 rounded transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {assignments.length === 0 && !loading && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                    No project assignments found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
