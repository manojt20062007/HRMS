import React from 'react';
import { ArrowLeft, Edit, Trash2, RotateCcw, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const mockSources = [
  { id: 1, name: 'GH INDUCTION' },
  { id: 2, name: 'Company Career' },
  { id: 3, name: 'LinkedIn' },
  { id: 4, name: 'Naukri' },
  { id: 5, name: 'Indeed' },
  { id: 6, name: 'Campus Recruitment' },
  { id: 7, name: 'Job Fair' },
];

export const SourceOfPanelMasterPage = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-[1600px] mx-auto pb-10">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1 tracking-tight">Source Of Pannel Master</h1>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-emerald-500 font-medium">Source Maintenance</span>
            <span className="text-slate-300">›</span>
            <span className="text-slate-500">Source Of Pannel Master</span>
          </div>
        </div>
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-indigo-100 text-indigo-600 rounded-full text-sm font-semibold hover:bg-indigo-50 shadow-sm transition-colors mt-2"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
      </div>

      <div className="bg-white dark:bg-card border border-border shadow-sm rounded-xl overflow-hidden mt-2 p-6">
        {/* Form Section */}
        <div className="flex flex-col md:flex-row items-end gap-6 mb-10">
          <div className="flex-1 max-w-md">
            <label className="block text-sm font-semibold text-slate-700 mb-2">Source Name <span className="text-red-500">*</span></label>
            <input type="text" placeholder="Enter Source Name" className="w-full px-4 py-2.5 bg-white border border-border rounded-lg text-sm text-slate-700 focus:outline-none focus:border-indigo-500 transition-colors" />
          </div>
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 px-6 py-2.5 bg-white border border-indigo-200 text-indigo-600 rounded-full text-sm font-semibold hover:bg-indigo-50 transition-colors shadow-sm">
              <RotateCcw className="h-4 w-4" /> Clear
            </button>
            <button className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 border border-transparent text-white rounded-full text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-sm">
              <Save className="h-4 w-4" /> Save
            </button>
          </div>
        </div>

        {/* Table Section */}
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-sm text-center text-slate-600 dark:text-slate-300">
            <thead className="bg-[#f0f4f8] text-slate-700 font-bold">
              <tr>
                <th className="px-6 py-4 font-bold text-slate-800 text-left pl-8 w-[100px]">#</th>
                <th className="px-6 py-4 font-bold text-slate-800 text-left">Source Name <span className="text-slate-400 font-normal opacity-50 ml-1">↑↓</span></th>
                <th className="px-6 py-4 font-bold text-slate-800 text-right pr-8">Action <span className="text-slate-400 font-normal opacity-50 ml-1">↑↓</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {mockSources.map((row, i) => (
                <tr key={i} className="hover:bg-slate-50/50">
                  <td className="px-6 py-4 text-slate-500 text-left pl-8">{row.id}</td>
                  <td className="px-6 py-4 text-slate-600 font-medium text-left">{row.name}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end pr-8 gap-3">
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
