import React from 'react';
import { PageHeader } from '../../components/PageHeader';
import { RotateCcw, Save, FileSpreadsheet, RefreshCw, Edit, Trash2 } from 'lucide-react';

const mockProjects = [
  { name: 'Alagappan', project: 'ERP Software', start: '02-07-2026', end: '07-10-2026', status: 'In Progress' },
  { name: 'Alagappan', project: 'HRMS', start: '10-07-2026', end: '31-08-2026', status: 'In Progress' },
  { name: 'Dinesh', project: 'ERP Software', start: '02-07-2026', end: '07-10-2026', status: 'In Progress' },
];

export const AssignProjectPage = () => {
  return (
    <div className="max-w-[1600px] mx-auto">
      <PageHeader 
        title="Assign Project" 
        breadcrumbs={['User Management', 'Assign Project']} 
      />

      <div className="bg-white dark:bg-card border border-border shadow-sm rounded-xl p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Employee Name <span className="text-red-500">*</span></label>
            <select className="w-full text-sm border border-border rounded-md px-3 py-2 bg-transparent outline-none focus:border-indigo-500">
              <option>-- Select Employee Nam --</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Project Name <span className="text-red-500">*</span></label>
            <select className="w-full text-sm border border-border rounded-md px-3 py-2 bg-transparent outline-none focus:border-indigo-500">
              <option>-- Select Project Name --</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Percentage <span className="text-red-500">*</span></label>
            <input 
              type="text" 
              placeholder="Enter Percentage"
              className="w-full text-sm border border-border rounded-md px-3 py-2 bg-transparent outline-none focus:border-indigo-500" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Start Date <span className="text-red-500">*</span></label>
            <input 
              type="date" 
              className="w-full text-sm border border-border rounded-md px-3 py-2 bg-transparent outline-none focus:border-indigo-500 text-slate-500" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">End Date</label>
            <input 
              type="date" 
              className="w-full text-sm border border-border rounded-md px-3 py-2 bg-transparent outline-none focus:border-indigo-500 text-slate-500" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Remark</label>
            <input 
              type="text" 
              placeholder="Enter Remark"
              className="w-full text-sm border border-border rounded-md px-3 py-2 bg-transparent outline-none focus:border-indigo-500" 
            />
          </div>
        </div>
        
        <div className="flex justify-center gap-4 mt-8">
          <button className="flex items-center gap-2 px-6 py-2 bg-white dark:bg-card border border-border rounded-full text-sm font-medium text-indigo-600 hover:bg-slate-50 transition-colors shadow-sm">
            <RotateCcw className="h-4 w-4" /> Clear
          </button>
          <button className="flex items-center gap-2 px-6 py-2 bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800 rounded-full text-sm font-medium text-indigo-600 hover:bg-indigo-100 transition-colors shadow-sm">
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
            <button className="p-2 border border-border rounded-md hover:bg-slate-50 text-slate-500 transition-colors">
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-600 dark:text-slate-300">
            <thead className="text-xs bg-[#F4F7FE] dark:bg-muted text-slate-700 dark:text-slate-200">
              <tr>
                <th className="px-6 py-4 font-semibold">Employee Name <span className="text-[10px] text-slate-400">↑↓</span></th>
                <th className="px-6 py-4 font-semibold">Current Project <span className="text-[10px] text-slate-400">↑↓</span></th>
                <th className="px-6 py-4 font-semibold">Start Date <span className="text-[10px] text-slate-400">↑↓</span></th>
                <th className="px-6 py-4 font-semibold">End Date <span className="text-[10px] text-slate-400">↑↓</span></th>
                <th className="px-6 py-4 font-semibold">Project Status <span className="text-[10px] text-slate-400">↑↓</span></th>
                <th className="px-6 py-4 font-semibold text-center">Project History <span className="text-[10px] text-slate-400">↑↓</span></th>
                <th className="px-6 py-4 font-semibold text-center">Action <span className="text-[10px] text-slate-400">↑↓</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {mockProjects.map((proj, i) => (
                <tr key={i} className="hover:bg-slate-50 dark:hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-700 dark:text-slate-200">{proj.name}</td>
                  <td className="px-6 py-4">{proj.project}</td>
                  <td className="px-6 py-4">{proj.start}</td>
                  <td className="px-6 py-4">{proj.end}</td>
                  <td className="px-6 py-4">{proj.status}</td>
                  <td className="px-6 py-4 text-center">
                    <button className="flex items-center gap-1.5 mx-auto px-4 py-1.5 border border-indigo-100 text-indigo-600 bg-white rounded-full text-[13px] hover:bg-indigo-50 shadow-sm transition-colors">
                      <RefreshCw className="h-3.5 w-3.5" /> View History
                    </button>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button className="text-blue-600 hover:bg-blue-50 p-1.5 rounded transition-colors">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="text-red-600 hover:bg-red-50 p-1.5 rounded transition-colors">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
