import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, Briefcase } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ProjectMasterPage = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    status: 'ACTIVE'
  });

  const fetchProjects = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/projects', {
        headers: { 'x-tenant-id': 'pmj.com' }
      });
      if (response.ok) {
        setProjects(await response.json());
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3001/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-tenant-id': 'pmj.com' },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        setFormData({ name: '', description: '', startDate: '', endDate: '', status: 'ACTIVE' });
        fetchProjects();
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto pb-10">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1 tracking-tight">Project Management</h1>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-emerald-500 font-medium">Projects</span>
            <span className="text-slate-300">›</span>
            <span className="text-slate-500">Project Master</span>
          </div>
        </div>
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-indigo-100 text-indigo-600 rounded-full text-sm font-semibold hover:bg-indigo-50 shadow-sm transition-colors mt-2"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
      </div>

      <div className="bg-white dark:bg-card border border-border shadow-sm rounded-xl overflow-hidden mt-2">
        <div className="p-4 border-b border-border bg-gradient-to-r from-blue-100/50 to-indigo-100/50 dark:from-blue-900/20 dark:to-indigo-900/20 flex items-center gap-2 text-indigo-900 dark:text-indigo-300 font-semibold">
          <Briefcase className="h-5 w-5" /> Add New Project
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 border-b border-border bg-slate-50/50">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-sm font-semibold text-slate-700">Project Name <span className="text-red-500">*</span></label>
              <input 
                type="text" required
                className="w-full px-3 py-2 bg-white border border-border rounded-md text-sm outline-none focus:border-indigo-500 shadow-sm"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700">Status <span className="text-red-500">*</span></label>
              <select 
                className="w-full px-3 py-2 bg-white border border-border rounded-md text-sm outline-none focus:border-indigo-500 shadow-sm"
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
              >
                <option value="ACTIVE">Active</option>
                <option value="COMPLETED">Completed</option>
                <option value="ON_HOLD">On Hold</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700">Start Date</label>
              <input 
                type="date" 
                className="w-full px-3 py-2 bg-white border border-border rounded-md text-sm outline-none focus:border-indigo-500 shadow-sm"
                value={formData.startDate}
                onChange={(e) => setFormData({...formData, startDate: e.target.value})}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700">End Date</label>
              <input 
                type="date" 
                className="w-full px-3 py-2 bg-white border border-border rounded-md text-sm outline-none focus:border-indigo-500 shadow-sm"
                value={formData.endDate}
                onChange={(e) => setFormData({...formData, endDate: e.target.value})}
              />
            </div>

            <div className="space-y-1.5 md:col-span-3">
              <label className="text-sm font-semibold text-slate-700">Description</label>
              <input 
                type="text" 
                className="w-full px-3 py-2 bg-white border border-border rounded-md text-sm outline-none focus:border-indigo-500 shadow-sm"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <button type="submit" className="flex items-center gap-2 px-5 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 shadow-sm transition-colors">
              <Save className="h-4 w-4" /> Save Project
            </button>
          </div>
        </form>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-600 dark:text-slate-300">
            <thead className="bg-[#f0f4f8] dark:bg-muted text-slate-700 dark:text-slate-200 font-semibold border-b border-border">
              <tr>
                <th className="px-6 py-4">Project Name</th>
                <th className="px-6 py-4">Description</th>
                <th className="px-6 py-4 text-center">Start Date</th>
                <th className="px-6 py-4 text-center">End Date</th>
                <th className="px-6 py-4 text-center">Assigned Employees</th>
                <th className="px-6 py-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-slate-500">Loading projects...</td></tr>
              ) : projects.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-slate-500">No projects found.</td></tr>
              ) : (
                projects.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50 dark:hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-800 dark:text-slate-200">{row.name}</td>
                    <td className="px-6 py-4 text-slate-500">{row.description || '-'}</td>
                    <td className="px-6 py-4 text-center text-slate-500">{row.startDate ? new Date(row.startDate).toLocaleDateString() : '-'}</td>
                    <td className="px-6 py-4 text-center text-slate-500">{row.endDate ? new Date(row.endDate).toLocaleDateString() : '-'}</td>
                    <td className="px-6 py-4 text-center font-bold text-indigo-600">{row.employees?.length || 0}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2.5 py-1 text-[11px] font-bold uppercase border rounded-full ${
                        row.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' :
                        row.status === 'COMPLETED' ? 'bg-blue-50 text-blue-600 border-blue-200' :
                        'bg-amber-50 text-amber-600 border-amber-200'
                      }`}>
                        {row.status}
                      </span>
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
