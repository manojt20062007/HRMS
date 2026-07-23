import React from 'react';
import { ArrowLeft, MoreHorizontal, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const mockAnnouncements = [
  { title: 'Office Location', desc: 'We could relocate by next month', date: '14-07-2026' },
  { title: 'annual Performance Review Schedule', desc: 'Annual performance reviews will begin on 5 October. Employees should complete their self-assessments before meeting with their managers', date: '10-07-2026' },
  { title: 'Employee Referral Bonus Program', desc: 'Refer qualified candidates for open positions and receive a referral bonus upon successful hiring and completion of the probation period.', date: '10-07-2026' },
];

export const HrAnnouncementListPage = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-[1600px] mx-auto pb-10">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1 tracking-tight">HR Announcement List</h1>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-emerald-500 font-medium">More Menu</span>
            <span className="text-slate-300">›</span>
            <span className="text-slate-500">HR Announcement List</span>
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
            <Plus className="h-4 w-4" /> HR Announcement
          </button>
        </div>

        {/* Table Section */}
        <div className="overflow-x-auto border-x border-b border-border rounded-b-xl">
          <table className="w-full text-sm text-center text-slate-600 dark:text-slate-300">
            <thead className="bg-[#f0f4f8] text-slate-700 font-bold border-b border-border">
              <tr>
                <th className="px-6 py-4 font-bold text-slate-800">Title <span className="text-slate-400 font-normal opacity-50 ml-1">↑↓</span></th>
                <th className="px-6 py-4 font-bold text-slate-800">Description <span className="text-slate-400 font-normal opacity-50 ml-1">↑↓</span></th>
                <th className="px-6 py-4 font-bold text-slate-800">Post Date <span className="text-slate-400 font-normal opacity-50 ml-1">↑↓</span></th>
                <th className="px-6 py-4 font-bold text-slate-800 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {mockAnnouncements.map((row, i) => (
                <tr key={i} className={i % 2 !== 0 ? 'bg-slate-50/50' : 'bg-white'}>
                  <td className="px-6 py-6 text-slate-500 font-medium w-[25%]">{row.title}</td>
                  <td className="px-6 py-6 text-slate-500 text-center">
                    <div className="max-w-[400px] whitespace-normal mx-auto leading-relaxed">
                      {row.desc}
                    </div>
                  </td>
                  <td className="px-6 py-6 text-slate-500">{row.date}</td>
                  <td className="px-6 py-6">
                    <div className="flex items-center justify-center">
                      <button className="text-blue-600 hover:bg-blue-50 p-1.5 rounded transition-colors">
                        <MoreHorizontal className="h-5 w-5" />
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
