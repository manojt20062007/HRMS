import React from 'react';
import { ArrowLeft, Edit, Trash2, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const mockProcesses = [
  { sno: 1, id: 'P-002', desc: 'bpm project frontend is completed' },
  { sno: 2, id: 'P-003', desc: 'BPM project in testing stage' },
  { sno: 3, id: 'P-004', desc: 'HRMS doucmentation is ready' },
  { sno: 4, id: 'P-005', desc: 'ERP software in testing' },
  { sno: 5, id: 'P-006', desc: 'ERP software is on live' },
  { sno: 6, id: 'P-007', desc: 'requrimenets analysis fro the CRM project' },
  { sno: 7, id: 'P-008', desc: 'Gathering the Requirement for HRMS' },
];

export const ProcessMasterListPage = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-[1600px] mx-auto pb-10">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1 tracking-tight">Process Master List</h1>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-emerald-500 font-medium">Project Management</span>
            <span className="text-slate-300">›</span>
            <span className="text-slate-500">Process Master List</span>
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
        
        {/* Gradient Header Bar */}
        <div className="flex items-center justify-end gap-3 mb-6 mt-2 mr-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-white text-indigo-600 rounded-full text-sm font-semibold border border-indigo-100 hover:bg-indigo-50 shadow-sm transition-colors">
            <Plus className="h-4 w-4" /> Add Process
          </button>
        </div>

        {/* Table Section */}
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-sm text-center text-slate-600 dark:text-slate-300">
            <thead className="bg-[#f0f4f8] text-slate-700 font-bold border-b border-border">
              <tr>
                <th className="px-6 py-4 font-bold text-slate-800 w-[15%]">S No <span className="text-slate-400 font-normal opacity-50 ml-1">↑↓</span></th>
                <th className="px-6 py-4 font-bold text-slate-800 w-[20%]">Process ID <span className="text-slate-400 font-normal opacity-50 ml-1">↑↓</span></th>
                <th className="px-6 py-4 font-bold text-slate-800 text-center w-[50%]">Description <span className="text-slate-400 font-normal opacity-50 ml-1">↑↓</span></th>
                <th className="px-6 py-4 font-bold text-slate-800 text-center w-[15%]">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {mockProcesses.map((row, i) => (
                <tr key={i} className={i % 2 === 0 ? 'bg-slate-50/50' : 'bg-white'}>
                  <td className="px-6 py-5 text-indigo-600 font-medium">{row.sno}</td>
                  <td className="px-6 py-5 text-slate-500">{row.id}</td>
                  <td className="px-6 py-5 text-slate-500 text-center">{row.desc}</td>
                  <td className="px-6 py-5">
                    <div className="flex items-center justify-center gap-3">
                      <button className="text-blue-600 hover:bg-blue-50 p-1.5 rounded transition-colors">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="text-red-500 hover:bg-red-50 p-1.5 rounded transition-colors">
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
          <div>Showing 1 to 7 of 7 entries</div>
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
