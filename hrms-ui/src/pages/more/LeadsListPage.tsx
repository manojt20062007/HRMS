import React from 'react';
import { ArrowLeft, MoreHorizontal, Plus, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const mockLeads = [
  { company: 'Dairylink', person: 'Angel', desig: 'Sales head', mobile: '9840559620', email: 'sales@dl.com', address: 'Crescent' },
  { company: 'ky tech', person: 'praveen', desig: 'software trainee', mobile: '9875634567', email: 'praveen@gamil.com', address: '' },
  { company: 'nowell', person: 'ajith', desig: 'CTO', mobile: '7998765345', email: 'ajith@gmail.com', address: '' },
  { company: 'sla tech', person: 'vishwa', desig: 'HR', mobile: '9876345678', email: 'vishwa@gmail.com', address: '' },
  { company: 'sodtgel', person: 'kumar', desig: 'developer', mobile: '7898745764', email: 'kumar@gmail.com', address: '' },
  { company: 'softsave', person: 'mani', desig: 'HR', mobile: '9874562345', email: 'mani@gmail.com', address: '' },
  { company: 'tech soft', person: 'raj', desig: 'admin', mobile: '8899767689', email: 'raj@gmail.com', address: 'no 889 vivekanada st' },
];

export const LeadsListPage = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-[1600px] mx-auto pb-10">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1 tracking-tight">Leads</h1>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-emerald-500 font-medium">Leads</span>
            <span className="text-slate-300">›</span>
            <span className="text-slate-500">Leads</span>
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
        <div className="h-14 bg-gradient-to-r from-[#9db7d3] to-[#a2dfc8] rounded-t-xl px-4 flex items-center justify-end gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white text-indigo-600 rounded-full text-sm font-semibold hover:bg-slate-50 shadow-sm transition-colors">
            <Plus className="h-4 w-4" /> Add Lead
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white text-indigo-600 rounded-full text-sm font-semibold hover:bg-slate-50 shadow-sm transition-colors">
            <Download className="h-4 w-4" /> Export to Excel
          </button>
        </div>

        {/* Table Section */}
        <div className="overflow-x-auto border-x border-b border-border rounded-b-xl">
          <table className="w-full text-sm text-center text-slate-600 dark:text-slate-300">
            <thead className="bg-[#f0f4f8] text-slate-700 font-bold border-b border-border">
              <tr>
                <th className="px-4 py-4 font-bold text-slate-800">Company Name <span className="text-slate-400 font-normal opacity-50 ml-1">↑↓</span></th>
                <th className="px-4 py-4 font-bold text-slate-800">Person Name <span className="text-slate-400 font-normal opacity-50 ml-1">↑↓</span></th>
                <th className="px-4 py-4 font-bold text-slate-800">Designation <span className="text-slate-400 font-normal opacity-50 ml-1">↑↓</span></th>
                <th className="px-4 py-4 font-bold text-slate-800">Mobile Number <span className="text-slate-400 font-normal opacity-50 ml-1">↑↓</span></th>
                <th className="px-4 py-4 font-bold text-slate-800">Email Address <span className="text-slate-400 font-normal opacity-50 ml-1">↑↓</span></th>
                <th className="px-4 py-4 font-bold text-slate-800">Address <span className="text-slate-400 font-normal opacity-50 ml-1">↑↓</span></th>
                <th className="px-4 py-4 font-bold text-slate-800">Remarks <span className="text-slate-400 font-normal opacity-50 ml-1">↑↓</span></th>
                <th className="px-4 py-4 font-bold text-slate-800 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {mockLeads.map((row, i) => (
                <tr key={i} className={i % 2 === 0 ? 'bg-slate-50/50' : 'bg-white'}>
                  <td className="px-4 py-5 text-slate-500 font-medium">{row.company}</td>
                  <td className="px-4 py-5 text-slate-500">{row.person}</td>
                  <td className="px-4 py-5 text-slate-500">{row.desig}</td>
                  <td className="px-4 py-5 text-slate-500">{row.mobile}</td>
                  <td className="px-4 py-5 text-slate-500">{row.email}</td>
                  <td className="px-4 py-5 text-slate-500">{row.address}</td>
                  <td className="px-4 py-5 text-slate-500"></td>
                  <td className="px-4 py-5">
                    <div className="flex items-center justify-center">
                      <button className="text-blue-600 hover:bg-blue-50 p-1.5 rounded transition-colors font-bold text-lg leading-none mt-1">
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
