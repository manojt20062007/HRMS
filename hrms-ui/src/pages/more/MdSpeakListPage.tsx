import React from 'react';
import { ArrowLeft, MoreHorizontal, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const mockMdSpeaks = [
  { title: 'Employee Wellness Initiative', desc: 'Our employees are our greatest asset. We are introducing new wellness programs to support your health and work-life balance' },
  { title: 'Festival Greetings', desc: 'Wishing you and your families a joyful and prosperous festive season. Thank you for making our organization a great place to work' },
  { title: 'Quarterly Performance Update', desc: 'I am pleased to share that we exceeded our quarterly targets thanks to your exceptional efforts. Lets continue this momentum' },
  { title: 'Safety First', desc: 'Safety remains our top priority. Please follow all workplace safety guidelines and participate in scheduled safety training' },
];

export const MdSpeakListPage = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-[1600px] mx-auto pb-10">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1 tracking-tight">MD Speak List</h1>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-emerald-500 font-medium">More Menu</span>
            <span className="text-slate-300">›</span>
            <span className="text-slate-500">MD Speak List</span>
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
        {/* Plain Header Bar */}
        <div className="flex items-center justify-end mb-6 mt-2 mr-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-white text-indigo-600 rounded-full text-sm font-semibold border border-indigo-100 hover:bg-indigo-50 shadow-sm transition-colors">
            <Plus className="h-4 w-4" /> MD Speak
          </button>
        </div>

        {/* Table Section */}
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-sm text-center text-slate-600 dark:text-slate-300">
            <thead className="bg-[#f0f4f8] text-slate-700 font-bold border-b border-border">
              <tr>
                <th className="px-6 py-4 font-bold text-slate-800 w-[25%]">Title <span className="text-slate-400 font-normal opacity-50 ml-1">↑↓</span></th>
                <th className="px-6 py-4 font-bold text-slate-800 w-[60%]">Description <span className="text-slate-400 font-normal opacity-50 ml-1">↑↓</span></th>
                <th className="px-6 py-4 font-bold text-slate-800 text-center w-[15%]">Action <span className="text-slate-400 font-normal opacity-50 ml-1">↑↓</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {mockMdSpeaks.map((row, i) => (
                <tr key={i} className={i % 2 === 0 ? 'bg-slate-50/50' : 'bg-white'}>
                  <td className="px-6 py-6 text-slate-500 font-medium">{row.title}</td>
                  <td className="px-6 py-6 text-slate-500 text-center">
                    <div className="max-w-[700px] whitespace-normal mx-auto leading-relaxed">
                      {row.desc}
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex items-center justify-center">
                      <button className="text-blue-600 hover:bg-blue-50 p-1.5 rounded transition-colors mt-1 font-bold text-lg leading-none">
                        ...
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
