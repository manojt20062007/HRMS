import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Settings, CalendarDays, Briefcase, UserX, Clock, Calendar, MoreHorizontal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const LeaveTimeSettingsPage = () => {
  const navigate = useNavigate();
  const [leaves, setLeaves] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/settings/leave-settings', {
          headers: { 'x-tenant-id': 'pmj.com' }
        });
        if (response.ok) {
          const data = await response.json();
          setLeaves(data);
        }
      } catch (error) {
        console.error('Failed to fetch leave settings', error);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaves();
  }, []);

  return (
    <div className="max-w-[1600px] mx-auto pb-10">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1 tracking-tight">Leave & Time Settings</h1>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-emerald-500 font-medium">Settings</span>
            <span className="text-slate-300">›</span>
            <span className="text-slate-500">Leave & Time Settings</span>
          </div>
        </div>
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-indigo-100 text-indigo-600 rounded-full text-sm font-semibold hover:bg-indigo-50 shadow-sm transition-colors mt-2"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 mt-2">
        {/* Left Sidebar Menu */}
        <div className="w-full lg:w-[280px] flex-shrink-0">
          <div className="bg-white dark:bg-card border border-border shadow-sm rounded-xl p-4 flex flex-col items-center">
            <div className="h-12 w-12 bg-slate-50 rounded-full flex items-center justify-center border border-border mb-6 mt-2">
              <Settings className="h-6 w-6 text-slate-700" />
            </div>
            
            <div className="w-full flex flex-col gap-2">
              <button className="w-full flex items-center gap-3 px-4 py-3 bg-[#a584f2] text-white rounded-lg font-medium shadow-sm transition-colors text-sm">
                <CalendarDays className="h-5 w-5" /> Leave Type
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-3 bg-transparent text-slate-600 hover:bg-slate-50 rounded-lg font-medium transition-colors text-sm">
                <Briefcase className="h-5 w-5" /> Office Timing
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-3 bg-transparent text-slate-600 hover:bg-slate-50 rounded-lg font-medium transition-colors text-sm">
                <UserX className="h-5 w-5" /> Formal Attire
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-3 bg-transparent text-slate-600 hover:bg-slate-50 rounded-lg font-medium transition-colors text-sm">
                <Clock className="h-5 w-5" /> Permission
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-3 bg-transparent text-slate-600 hover:bg-slate-50 rounded-lg font-medium transition-colors text-sm">
                <Calendar className="h-5 w-5" /> Holidays
              </button>
            </div>
          </div>
        </div>

        {/* Right Content Area */}
        <div className="flex-1 min-w-0">
          <div className="bg-white dark:bg-card border border-border shadow-sm rounded-xl overflow-hidden p-5 min-h-[500px]">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-[15px] font-bold text-slate-800 uppercase tracking-wide">LEAVE TYPE</h2>
              <button className="flex items-center gap-2 px-4 py-2 bg-white text-indigo-600 rounded-full text-sm font-semibold border border-indigo-100 hover:bg-indigo-50 shadow-sm transition-colors">
                <Plus className="h-4 w-4" /> Add Leave Type
              </button>
            </div>

            <div className="overflow-x-auto rounded-lg border border-border">
              <table className="w-full text-sm text-center text-slate-600 dark:text-slate-300">
                <thead className="bg-[#f0f4f8] text-slate-700 font-bold">
                  <tr>
                    <th className="px-6 py-4 font-bold text-slate-800 text-left">Name <span className="text-slate-400 font-normal opacity-50 ml-1">↑↓</span></th>
                    <th className="px-6 py-4 font-bold text-slate-800">Type <span className="text-slate-400 font-normal opacity-50 ml-1">↑↓</span></th>
                    <th className="px-6 py-4 font-bold text-slate-800">Leave (Monthly) <span className="text-slate-400 font-normal opacity-50 ml-1">↑↓</span></th>
                    <th className="px-6 py-4 font-bold text-slate-800">Leave Category <span className="text-slate-400 font-normal opacity-50 ml-1">↑↓</span></th>
                    <th className="px-6 py-4 font-bold text-slate-800">Applicable Dates <span className="text-slate-400 font-normal opacity-50 ml-1">↑↓</span></th>
                    <th className="px-6 py-4 font-bold text-slate-800">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {loading ? (
                    <tr><td colSpan={6} className="px-6 py-8 text-slate-500 text-center font-medium">Loading leave types...</td></tr>
                  ) : leaves.length === 0 ? (
                    <tr><td colSpan={6} className="px-6 py-8 text-slate-500 text-center font-medium">No leave types found.</td></tr>
                  ) : (
                    leaves.map((row, i) => (
                      <tr key={i} className="hover:bg-slate-50/50">
                        <td className="px-6 py-4 text-slate-500 text-left font-medium">{row.leaveName}</td>
                        <td className="px-6 py-4 text-slate-500 text-center">{row.type || 'Yearly'}</td>
                        <td className="px-6 py-4 text-slate-600 font-bold text-center">{row.totalLeave}</td>
                        <td className="px-6 py-4 text-slate-500 text-center">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            row.isCarryForward ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                          }`}>
                            {row.isCarryForward ? 'Yes' : 'No'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-500 text-center">Dates</td>
                        <td className="px-6 py-4 text-center">
                          <button className="text-blue-600 hover:bg-blue-50 p-1.5 rounded transition-colors inline-block">
                            <MoreHorizontal className="h-4 w-4" />
                          </button>
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
    </div>
  );
};
