import React from 'react';
import { ArrowLeft, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const PolicyListPage = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-[1600px] mx-auto pb-10">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1 tracking-tight">Policy List</h1>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-emerald-500 font-medium">Policy Settings</span>
            <span className="text-slate-300">›</span>
            <span className="text-slate-500">Policy List</span>
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
        <div className="flex justify-end items-center mb-6">
          <button className="flex items-center gap-2 px-4 py-2 bg-white text-indigo-600 rounded-full text-sm font-semibold border border-indigo-100 hover:bg-indigo-50 shadow-sm transition-colors">
            <Plus className="h-4 w-4" /> Add Policy
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-center text-slate-600 dark:text-slate-300">
            <thead className="bg-[#f0f4f8] text-slate-700 font-bold border-b border-border">
              <tr>
                <th className="px-6 py-4 font-bold text-slate-800">Title <span className="text-slate-400 font-normal opacity-50 ml-1">↑↓</span></th>
                <th className="px-6 py-4 font-bold text-slate-800 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="bg-slate-50/50">
              <tr>
                <td colSpan={2} className="px-6 py-8 text-center text-slate-400 font-medium">
                  No data available in table
                </td>
              </tr>
            </tbody>
          </table>
          <div className="flex justify-between items-center text-sm text-slate-500 p-4 border-t border-border mt-2">
             <span>Showing 0 to 0 of 0 entries</span>
             <div className="flex gap-1">
               <button className="px-3 py-1.5 border border-border bg-white rounded text-slate-400 cursor-not-allowed">Previous</button>
               <button className="px-3 py-1.5 border border-border bg-white rounded text-slate-400 cursor-not-allowed">Next</button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
