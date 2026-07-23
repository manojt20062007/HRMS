import React from 'react';
import { ArrowLeft, MoreHorizontal, Plus, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const mockUkLeads = [
  { company: 'avaon soft', person: 'RAMESH', website: 'Website Link', linkedin: 'LinkedIn Link', desig: 'CO', personal: '9876345678', office: '7890345678', email: 'ramesh@gmailcom' },
  { company: 'cctech', person: 'AKASH', website: 'Website Link', linkedin: 'LinkedIn Link', desig: 'develpoer', personal: '7890456789', office: '9876543456', email: 'akash@gmailcom' },
  { company: 'embird', person: 'ARUN', website: 'Website Link', linkedin: 'LinkedIn Link', desig: 'CTO', personal: '9876345678', office: '9876543765', email: 'arun@gmail.com' },
  { company: 'GBR solution', person: 'SANKER', website: 'Website Link', linkedin: 'LinkedIn Link', desig: 'HR', personal: '7894567894', office: '8764958974', email: 'sanker@gamil.com' },
  { company: 'HCI tech', person: 'NIVEDHA', website: 'Website Link', linkedin: 'LinkedIn Link', desig: 'CMA', personal: '8987690098', office: '9876545678', email: 'nive@gamil.com' },
  { company: 'PLATFORM3 SOLUTIONS', person: 'SIVA', website: 'Website Link', linkedin: 'LinkedIn Link', desig: 'developer', personal: '9876542345', office: '9854568768', email: 'siva@gamil.com' },
];

export const UkLeadsListPage = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-[1600px] mx-auto pb-10">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1 tracking-tight">UK Leads List</h1>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-emerald-500 font-medium">Leads</span>
            <span className="text-slate-300">›</span>
            <span className="text-slate-500">UK Leads List</span>
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
        <div className="flex items-center justify-end gap-3 mb-6 mt-2 mr-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-white text-indigo-600 rounded-full text-sm font-semibold border border-indigo-100 hover:bg-indigo-50 shadow-sm transition-colors">
            <Download className="h-4 w-4" /> Export to Excel
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white text-indigo-600 rounded-full text-sm font-semibold border border-indigo-100 hover:bg-indigo-50 shadow-sm transition-colors">
            <Plus className="h-4 w-4" /> Add Lead
          </button>
        </div>

        {/* Table Section */}
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-sm text-center text-slate-600 dark:text-slate-300">
            <thead className="bg-[#f0f4f8] text-slate-700 font-bold border-b border-border">
              <tr>
                <th className="px-4 py-4 font-bold text-slate-800">Company Name <span className="text-slate-400 font-normal opacity-50 ml-1">↑↓</span></th>
                <th className="px-4 py-4 font-bold text-slate-800">Reachout Person <span className="text-slate-400 font-normal opacity-50 ml-1">↑↓</span></th>
                <th className="px-4 py-4 font-bold text-slate-800">Website <span className="text-slate-400 font-normal opacity-50 ml-1">↑↓</span></th>
                <th className="px-4 py-4 font-bold text-slate-800">Linkedin <span className="text-slate-400 font-normal opacity-50 ml-1">↑↓</span></th>
                <th className="px-4 py-4 font-bold text-slate-800">Designation <span className="text-slate-400 font-normal opacity-50 ml-1">↑↓</span></th>
                <th className="px-4 py-4 font-bold text-slate-800">Personal Number <span className="text-slate-400 font-normal opacity-50 ml-1">↑↓</span></th>
                <th className="px-4 py-4 font-bold text-slate-800">Office Number <span className="text-slate-400 font-normal opacity-50 ml-1">↑↓</span></th>
                <th className="px-4 py-4 font-bold text-slate-800">Email ID <span className="text-slate-400 font-normal opacity-50 ml-1">↑↓</span></th>
                <th className="px-4 py-4 font-bold text-slate-800">Remarks <span className="text-slate-400 font-normal opacity-50 ml-1">↑↓</span></th>
                <th className="px-4 py-4 font-bold text-slate-800 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {mockUkLeads.map((row, i) => (
                <tr key={i} className={i % 2 === 0 ? 'bg-slate-50/50' : 'bg-white'}>
                  <td className="px-4 py-5 text-slate-500 font-medium">{row.company}</td>
                  <td className="px-4 py-5 text-slate-500">{row.person}</td>
                  <td className="px-4 py-5">
                    <a href="#" className="text-blue-500 hover:underline">{row.website}</a>
                  </td>
                  <td className="px-4 py-5">
                    <a href="#" className="text-blue-500 hover:underline">{row.linkedin}</a>
                  </td>
                  <td className="px-4 py-5 text-slate-500">{row.desig}</td>
                  <td className="px-4 py-5 text-slate-500">{row.personal}</td>
                  <td className="px-4 py-5 text-slate-500">{row.office}</td>
                  <td className="px-4 py-5 text-slate-500">{row.email}</td>
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
