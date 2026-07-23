import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../components/PageHeader';
import { Briefcase, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const StaffingRequestPage = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    requestedById: '',
    designation: '',
    department: 'Engineering',
    positions: 1,
    experience: '0-2 Years (Junior)',
    budget: '',
    justification: ''
  });

  useEffect(() => {
    fetch('http://localhost:3001/api/employees', { headers: { 'x-tenant-id': 'pmj.com' } })
      .then(res => res.json())
      .then(data => setEmployees(data))
      .catch(console.error);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3001/api/recruitment/staffing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-tenant-id': 'pmj.com' },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        navigate('/recruitment/staffing-list-rm'); // Go to first stage of approval
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto pb-10">
      <PageHeader 
        title="Staffing Request" 
        breadcrumbs={['Recruitment', 'Staffing Request']} 
      />

      <div className="bg-white dark:bg-card border border-border shadow-sm rounded-xl overflow-hidden mt-6 max-w-4xl">
        <div className="p-4 border-b border-border bg-gradient-to-r from-blue-100/50 to-emerald-100/50 dark:from-blue-900/20 dark:to-emerald-900/20 flex justify-between items-center">
          <div className="flex items-center gap-2 text-indigo-900 dark:text-indigo-300 font-semibold">
            <Briefcase className="h-5 w-5" /> New Requisition Form
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 bg-slate-50/50 dark:bg-muted/10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">Requested By <span className="text-red-500">*</span></label>
              <select 
                required
                className="w-full px-4 py-2 bg-white dark:bg-card border border-border rounded-lg focus:outline-none focus:border-indigo-500 shadow-sm text-slate-600"
                value={formData.requestedById}
                onChange={(e) => setFormData({...formData, requestedById: e.target.value})}
              >
                <option value="">Select Employee</option>
                {employees.map(emp => (
                  <option key={emp.id} value={emp.id}>{emp.firstName} {emp.lastName}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">Job Title / Designation <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                required
                className="w-full px-4 py-2 bg-white dark:bg-card border border-border rounded-lg focus:outline-none focus:border-indigo-500 shadow-sm" 
                placeholder="e.g. Senior Frontend Engineer" 
                value={formData.designation}
                onChange={(e) => setFormData({...formData, designation: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">Department <span className="text-red-500">*</span></label>
              <select 
                className="w-full px-4 py-2 bg-white dark:bg-card border border-border rounded-lg focus:outline-none focus:border-indigo-500 shadow-sm text-slate-600"
                value={formData.department}
                onChange={(e) => setFormData({...formData, department: e.target.value})}
              >
                <option value="Engineering">Engineering</option>
                <option value="Design">Design</option>
                <option value="Sales">Sales</option>
                <option value="Marketing">Marketing</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">Number of Positions <span className="text-red-500">*</span></label>
              <input 
                type="number" 
                required
                min="1"
                className="w-full px-4 py-2 bg-white dark:bg-card border border-border rounded-lg focus:outline-none focus:border-indigo-500 shadow-sm" 
                value={formData.positions}
                onChange={(e) => setFormData({...formData, positions: parseInt(e.target.value)})}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">Required Experience <span className="text-red-500">*</span></label>
              <select 
                className="w-full px-4 py-2 bg-white dark:bg-card border border-border rounded-lg focus:outline-none focus:border-indigo-500 shadow-sm text-slate-600"
                value={formData.experience}
                onChange={(e) => setFormData({...formData, experience: e.target.value})}
              >
                <option value="0-2 Years (Junior)">0-2 Years (Junior)</option>
                <option value="3-5 Years (Mid-Level)">3-5 Years (Mid-Level)</option>
                <option value="5-8 Years (Senior)">5-8 Years (Senior)</option>
                <option value="8+ Years (Lead/Staff)">8+ Years (Lead/Staff)</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">Budget (₹)</label>
              <input 
                type="number" 
                required
                className="w-full px-4 py-2 bg-white dark:bg-card border border-border rounded-lg focus:outline-none focus:border-indigo-500 shadow-sm" 
                placeholder="e.g. 1500000" 
                value={formData.budget}
                onChange={(e) => setFormData({...formData, budget: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">Justification & Core Responsibilities <span className="text-red-500">*</span></label>
            <textarea 
              rows={5} 
              required
              className="w-full px-4 py-3 bg-white dark:bg-card border border-border rounded-lg focus:outline-none focus:border-indigo-500 shadow-sm resize-none" 
              placeholder="Explain why this role is needed and what they will be working on..."
              value={formData.justification}
              onChange={(e) => setFormData({...formData, justification: e.target.value})}
            />
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={() => navigate(-1)} className="px-5 py-2.5 bg-white border border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 transition-colors shadow-sm">
              Cancel
            </button>
            <button type="submit" className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors shadow-sm">
              <Send className="h-4 w-4" /> Submit Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
