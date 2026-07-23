import React from 'react';
import { ArrowLeft, Edit, Trash2, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const mockAssets = [
  { employee: 'Alagappan', asset: 'jio wifi', from: '11-07-2026', to: '10-07-2026' },
  { employee: 'Alagappan', asset: 'jio wifi', from: '11-07-2026', to: '10-07-2026' },
  { employee: 'Alagappan', asset: 'jio wifi', from: '11-07-2026', to: '10-07-2026' },
  { employee: 'Dinesh', asset: 'dell mouse , Rolling chair', from: '09-07-2026', to: '30-07-2026' },
  { employee: 'Dinesh', asset: 'hp harddisk', from: '15-07-2026', to: '31-07-2026' },
  { employee: 'inba', asset: 'hp bag', from: '16-07-2026', to: '31-07-2026' },
  { employee: 'vigneshwaran', asset: 'Microsoft Microsoft License', from: '14-07-2026', to: '-' },
];

export const EmployeeAssetListPage = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-[1600px] mx-auto pb-10">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1 tracking-tight">Asset List</h1>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-emerald-500 font-medium">Asset Management</span>
            <span className="text-slate-300">›</span>
            <span className="text-slate-500">Asset List</span>
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
        <div className="h-14 bg-gradient-to-r from-[#9db7d3] to-[#a2dfc8] rounded-t-xl px-4 flex items-center justify-end">
          <button className="flex items-center gap-2 px-4 py-2 bg-white text-indigo-600 rounded-full text-sm font-semibold hover:bg-slate-50 shadow-sm transition-colors">
            <Plus className="h-4 w-4" /> Add Asset
          </button>
        </div>

        {/* Table Section */}
        <div className="overflow-x-auto border-x border-b border-border rounded-b-xl">
          <table className="w-full text-sm text-center text-slate-600 dark:text-slate-300">
            <thead className="bg-[#f0f4f8] text-slate-700 font-bold border-b border-border">
              <tr>
                <th className="px-6 py-4 font-bold text-slate-800">Employee <span className="text-slate-400 font-normal opacity-50 ml-1">↑↓</span></th>
                <th className="px-6 py-4 font-bold text-slate-800">Asset Name <span className="text-slate-400 font-normal opacity-50 ml-1">↑↓</span></th>
                <th className="px-6 py-4 font-bold text-slate-800">Effective From <span className="text-slate-400 font-normal opacity-50 ml-1">↑↓</span></th>
                <th className="px-6 py-4 font-bold text-slate-800">Effective To <span className="text-slate-400 font-normal opacity-50 ml-1">↑↓</span></th>
                <th className="px-6 py-4 font-bold text-slate-800 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {mockAssets.map((row, i) => (
                <tr key={i} className={i % 2 === 0 ? 'bg-slate-50/50' : 'bg-white'}>
                  <td className="px-6 py-5 text-slate-500 font-medium">{row.employee}</td>
                  <td className="px-6 py-5 text-slate-500">{row.asset}</td>
                  <td className="px-6 py-5 text-slate-500">{row.from}</td>
                  <td className="px-6 py-5 text-slate-500">{row.to}</td>
                  <td className="px-6 py-5">
                    <div className="flex items-center justify-center gap-3">
                      <button className="text-blue-600 hover:bg-blue-50 p-1.5 rounded transition-colors">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="text-slate-600 hover:bg-slate-100 p-1.5 rounded transition-colors">
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
