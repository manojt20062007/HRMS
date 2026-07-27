import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../components/PageHeader';
import { Calendar, Clock, FileText, Plus, Check } from 'lucide-react';
import { getTenantHeader, API_BASE_URL } from '../../config';

export const WorklogEntryPage = () => {
  const [worklogs, setWorklogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [hours, setHours] = useState('');
  const [description, setDescription] = useState('');

  const fetchWorklogs = async () => {
    try {
      const userStr = localStorage.getItem('hrms_user');
      if (!userStr) return;
      const user = JSON.parse(userStr);
      if (!user.employeeId) return;

      const response = await fetch(`${API_BASE_URL}/api/worklog?employeeId=${user.employeeId}`, {
        headers: getTenantHeader()
      });
      if (response.ok) {
        setWorklogs(await response.json());
      }
    } catch (error) {
      console.error('Failed to fetch worklogs', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorklogs();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !hours || !description) return;

    try {
      const userStr = localStorage.getItem('hrms_user');
      if (!userStr) return;
      const user = JSON.parse(userStr);
      
      const payload = {
        employeeId: user.employeeId,
        date,
        hours: parseFloat(hours),
        description
      };

      const response = await fetch(`${API_BASE_URL}/api/worklog`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getTenantHeader()
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        setHours('');
        setDescription('');
        fetchWorklogs();
      }
    } catch (error) {
      console.error('Failed to submit worklog', error);
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto pb-10">
      <PageHeader 
        title="Worklog Entry" 
        breadcrumbs={['Worklog & Travel', 'Work Log Entry']} 
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* Entry Form */}
        <div className="lg:col-span-1 bg-white dark:bg-card border border-border shadow-sm rounded-xl p-6 h-fit">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Add New Entry</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input 
                  type="date" 
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Hours Worked</label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input 
                  type="number" 
                  step="0.1"
                  min="0"
                  max="24"
                  value={hours}
                  onChange={(e) => setHours(e.target.value)}
                  placeholder="e.g. 8.5"
                  className="w-full pl-10 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Description</label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <textarea 
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the tasks completed..."
                  className="w-full pl-10 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all resize-none"
                  required
                />
              </div>
            </div>

            <button 
              type="submit"
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 shadow-sm transition-all"
            >
              <Plus className="h-4 w-4" /> Submit Entry
            </button>
          </form>
        </div>

        {/* History Table */}
        <div className="lg:col-span-2 bg-white dark:bg-card border border-border shadow-sm rounded-xl overflow-hidden">
          <div className="p-4 border-b border-border bg-slate-50/50">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white">Recent Worklogs</h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-slate-600 dark:text-slate-300">
              <thead className="text-[12px] bg-[#F4F7FE] dark:bg-muted text-slate-700 dark:text-slate-200 uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4 font-semibold">Date</th>
                  <th className="px-6 py-4 font-semibold">Hours</th>
                  <th className="px-6 py-4 font-semibold">Description</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {loading ? (
                  <tr><td colSpan={4} className="px-6 py-8 text-center text-slate-500">Loading worklogs...</td></tr>
                ) : worklogs.length === 0 ? (
                  <tr><td colSpan={4} className="px-6 py-8 text-center text-slate-500">No worklogs found. Start logging your work!</td></tr>
                ) : (
                  worklogs.map(log => (
                    <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-700">{new Date(log.date).toLocaleDateString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap"><span className="px-2.5 py-1 bg-slate-100 text-slate-700 font-bold rounded text-xs">{log.hours} hrs</span></td>
                      <td className="px-6 py-4 max-w-xs truncate" title={log.description}>{log.description}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wider uppercase
                          ${log.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-700' : 
                            log.status === 'REJECTED' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'}`}>
                          {log.status}
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
    </div>
  );
};
