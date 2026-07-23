import React from 'react';
import { ArrowLeft, Edit, Trash2, RotateCcw, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const mockModules = [
  { id: 1, project: 'CRM', module: 'leads ,meeting' },
  { id: 2, project: 'CRM', module: 'user management based on RABC' },
  { id: 3, project: 'HRMS', module: 'attendance and leave' },
  { id: 4, project: 'ERP Software', module: 'dashboard, settings' },
  { id: 5, project: 'HRMS', module: 'payroll ,settings' },
  { id: 6, project: 'BPM', module: 'dashboard' },
];

export const ModuleMasterPage = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-[1600px] mx-auto pb-10">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1 tracking-tight">Module Master</h1>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-emerald-500 font-medium">Project Management</span>
            <span className="text-slate-300">›</span>
            <span className="text-slate-500">Module Master</span>
          </div>
        </div>
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-indigo-100 text-indigo-600 rounded-full text-sm font-semibold hover:bg-indigo-50 shadow-sm transition-colors mt-2"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
      </div>

      <div className="bg-white dark:bg-card border border-border shadow-sm rounded-xl overflow-hidden mt-2 p-5">
        
        {/* Form Section */}
        <div className="flex flex-col md:flex-row items-end gap-6 mb-8 mt-2">
          <div className="w-full md:w-1/3 space-y-1.5">
            <label className="text-sm font-medium text-slate-700">Project <span className="text-red-500">*</span></label>
            <select className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-md text-sm text-slate-500 focus:outline-none focus:border-indigo-500">
              <option>-- Select Project --</option>
            </select>
          </div>
          <div className="w-full md:w-1/3 space-y-1.5">
            <label className="text-sm font-medium text-slate-700">Module Name <span className="text-red-500">*</span></label>
            <input type="text" className="w-full px-3 py-2 bg-white border border-slate-200 rounded-md text-sm text-slate-600 focus:outline-none focus:border-indigo-500" placeholder="Enter Module Name" />
          </div>
          <div className="flex items-center gap-3 w-full md:w-1/3 pb-[1px]">
            <button className="flex items-center gap-2 px-6 py-2 bg-white text-indigo-600 border border-indigo-100 rounded-full text-sm font-semibold hover:bg-indigo-50 shadow-sm transition-colors">
              <RotateCcw className="h-4 w-4" /> Clear
            </button>
            <button className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-full text-sm font-semibold hover:bg-indigo-700 shadow-sm transition-colors">
              <Save className="h-4 w-4" /> Save
            </button>
          </div>
        </div>

        {/* Table Section */}
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-sm text-center text-slate-600 dark:text-slate-300">
            <thead className="bg-[#f0f4f8] text-slate-700 font-bold border-b border-border">
              <tr>
                <th className="px-6 py-4 font-bold text-slate-800 w-[10%]"># <span className="text-slate-400 font-normal opacity-50 ml-1">↑↓</span></th>
                <th className="px-6 py-4 font-bold text-slate-800 w-[20%] text-left">Project <span className="text-slate-400 font-normal opacity-50 ml-1">↑↓</span></th>
                <th className="px-6 py-4 font-bold text-slate-800 w-[50%] text-left">Module <span className="text-slate-400 font-normal opacity-50 ml-1">↑↓</span></th>
                <th className="px-6 py-4 font-bold text-slate-800 text-center w-[20%]">Action <span className="text-slate-400 font-normal opacity-50 ml-1">↑↓</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {mockModules.map((row, i) => (
                <tr key={i} className={i % 2 === 0 ? 'bg-slate-50/50' : 'bg-white'}>
                  <td className="px-6 py-5 text-indigo-600 font-medium">{row.id}</td>
                  <td className="px-6 py-5 text-slate-500 text-left">{row.project}</td>
                  <td className="px-6 py-5 text-slate-500 text-left">{row.module}</td>
                  <td className="px-6 py-5">
                    <div className="flex items-center justify-center gap-3">
                      <button className="text-blue-600 hover:bg-blue-50 p-1.5 rounded transition-colors bg-white shadow-sm border border-slate-200">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="text-red-500 hover:bg-red-50 p-1.5 rounded transition-colors bg-white shadow-sm border border-slate-200">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Footer */}
        <div className="flex items-center justify-between mt-4 text-sm text-slate-500">
          <div>Showing 1 to 6 of 6 entries</div>
          <div className="flex items-center gap-1">
            <button className="px-3 py-1.5 border border-slate-200 rounded text-slate-400 cursor-not-allowed">Previous</button>
            <button className="px-3 py-1.5 bg-emerald-600 text-white rounded">1</button>
            <button className="px-3 py-1.5 border border-slate-200 rounded text-slate-400 cursor-not-allowed">Next</button>
          </div>
        </div>

      </div>
    </div>
  );
};
