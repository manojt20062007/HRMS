import React from 'react';
import { Edit, RotateCcw, Save } from 'lucide-react';

const mockProjects = [
  { client: 'KVM PROJECTS', id: 'Project-KVM-0004', name: 'CRM', status: 'Approved', category: 'Development', pm: 'Unknown', tl: 'Unknown', ms: '', start: '2026-07-15', end: '06/10/2026', hasHistory: false },
  { client: 'LNT', id: 'Project-LNTJOHN-0001', name: 'ERP Software', status: 'In Progress', category: 'Development', pm: 'Unknown', tl: 'Unknown', ms: '', start: '2026-07-04', end: '31/07/2026', hasHistory: true },
  { client: 'LNT', id: 'Project-LNTJOHN-0002', name: 'HRMS', status: 'In Progress', category: 'Development', pm: 'Unknown', tl: 'Unknown', ms: '', start: '2026-05-01', end: '31/08/2026', hasHistory: true },
];

export const ProjectListPage = () => {
  return (
    <div className="max-w-[1600px] mx-auto pb-10">
      {/* Keeping breadcrumb area empty if not present, but let's add it for consistency */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1 tracking-tight">Projects List</h1>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-emerald-500 font-medium">Project Management</span>
            <span className="text-slate-300">›</span>
            <span className="text-slate-500">Projects List</span>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-card border border-border shadow-sm rounded-xl overflow-hidden mt-2 p-5">
        
        {/* Centered Buttons */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <button className="flex items-center gap-2 px-5 py-2 bg-red-500 text-white rounded-full text-sm font-semibold hover:bg-red-600 shadow-sm transition-colors">
            <RotateCcw className="h-4 w-4" /> Clear
          </button>
          <button className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white rounded-full text-sm font-semibold hover:bg-blue-700 shadow-sm transition-colors">
            <Save className="h-4 w-4" /> Submit
          </button>
        </div>

        {/* Table Section */}
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-sm text-center text-slate-600 dark:text-slate-300">
            <thead className="bg-[#f0f4f8] text-slate-700 font-bold border-b border-border">
              <tr>
                <th className="px-4 py-4 font-bold text-slate-800">Client Name <span className="text-slate-400 font-normal opacity-50 ml-1">↑↓</span></th>
                <th className="px-4 py-4 font-bold text-slate-800">Project ID <span className="text-slate-400 font-normal opacity-50 ml-1">↑↓</span></th>
                <th className="px-4 py-4 font-bold text-slate-800">Project Name <span className="text-slate-400 font-normal opacity-50 ml-1">↑↓</span></th>
                <th className="px-4 py-4 font-bold text-slate-800">Project Status <span className="text-slate-400 font-normal opacity-50 ml-1">↑↓</span></th>
                <th className="px-4 py-4 font-bold text-slate-800">Project Category <span className="text-slate-400 font-normal opacity-50 ml-1">↑↓</span></th>
                <th className="px-4 py-4 font-bold text-slate-800">Project Manager History <span className="text-slate-400 font-normal opacity-50 ml-1">↑↓</span></th>
                <th className="px-4 py-4 font-bold text-slate-800">Team Lead History <span className="text-slate-400 font-normal opacity-50 ml-1">↑↓</span></th>
                <th className="px-4 py-4 font-bold text-slate-800">Milestones & Deliverables History <span className="text-slate-400 font-normal opacity-50 ml-1">↑↓</span></th>
                <th className="px-4 py-4 font-bold text-slate-800">Start Date <span className="text-slate-400 font-normal opacity-50 ml-1">↑↓</span></th>
                <th className="px-4 py-4 font-bold text-slate-800">End Date History <span className="text-slate-400 font-normal opacity-50 ml-1">↑↓</span></th>
                <th className="px-4 py-4 font-bold text-slate-800 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {mockProjects.map((row, i) => (
                <tr key={i} className={i % 2 === 0 ? 'bg-slate-50/50' : 'bg-white'}>
                  <td className="px-4 py-6 text-slate-500 font-medium">
                    <div className="w-[100px] mx-auto text-left whitespace-normal leading-relaxed">{row.client}</div>
                  </td>
                  <td className="px-4 py-6 text-slate-500">
                    <div className="w-[100px] mx-auto text-left whitespace-normal leading-relaxed">{row.id}</div>
                  </td>
                  <td className="px-4 py-6 text-slate-500">{row.name}</td>
                  <td className="px-4 py-6 text-slate-500">{row.status}</td>
                  <td className="px-4 py-6 text-slate-500">{row.category}</td>
                  <td className="px-4 py-6 text-slate-500">
                    <div className="flex items-center justify-center gap-1.5">
                      {row.pm}
                      {row.hasHistory && <RotateCcw className="h-3.5 w-3.5 text-indigo-500" />}
                    </div>
                  </td>
                  <td className="px-4 py-6 text-slate-500">
                    <div className="flex items-center justify-center gap-1.5">
                      {row.tl}
                      {row.hasHistory && <RotateCcw className="h-3.5 w-3.5 text-indigo-500" />}
                    </div>
                  </td>
                  <td className="px-4 py-6 text-slate-500">{row.ms}</td>
                  <td className="px-4 py-6 text-slate-500">{row.start}</td>
                  <td className="px-4 py-6 text-slate-500">{row.end}</td>
                  <td className="px-4 py-6">
                    <div className="flex items-center justify-center">
                      <button className="text-blue-600 hover:bg-blue-50 p-1.5 rounded transition-colors border border-blue-600">
                        <Edit className="h-4 w-4" />
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
          <div>Showing 1 to 3 of 3 entries</div>
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
