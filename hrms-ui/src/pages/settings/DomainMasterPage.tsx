import React, { useState, useEffect } from 'react';
import { ArrowLeft, Edit, Trash2, RotateCcw, Save, MoreHorizontal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const DomainMasterPage = () => {
  const navigate = useNavigate();
  const [domains, setDomains] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDomains = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/settings/domains', {
          headers: { 'x-tenant-id': 'pmj.com' }
        });
        if (response.ok) {
          const data = await response.json();
          setDomains(data);
        }
      } catch (error) {
        console.error('Failed to fetch domains', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDomains();
  }, []);

  return (
    <div className="max-w-[1600px] mx-auto pb-10">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1 tracking-tight">Domain Master</h1>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-emerald-500 font-medium">Source Maintenance</span>
            <span className="text-slate-300">›</span>
            <span className="text-slate-500">Domain Master</span>
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
            <label className="block text-sm font-semibold text-slate-700 mb-2">Domain Name <span className="text-red-500">*</span></label>
            <input type="text" placeholder="Enter Domain Name" className="w-full px-4 py-2.5 bg-white border border-border rounded-lg text-sm text-slate-700 focus:outline-none focus:border-indigo-500 transition-colors" />
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
                <th className="px-6 py-4 font-bold text-slate-800 text-left pl-10 w-[45%]">Source Name <span className="text-slate-400 font-normal opacity-50 ml-1">↑↓</span></th>
                <th className="px-6 py-4 font-bold text-slate-800 text-center w-[45%]">Status <span className="text-slate-400 font-normal opacity-50 ml-1">↑↓</span></th>
                <th className="px-6 py-4 font-bold text-slate-800 text-center w-[10%]">Action <span className="text-slate-400 font-normal opacity-50 ml-1">↑↓</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr><td colSpan={3} className="px-6 py-8 text-slate-500 text-center font-medium">Loading domains...</td></tr>
              ) : domains.length === 0 ? (
                <tr><td colSpan={3} className="px-6 py-8 text-slate-500 text-center font-medium">No domains found.</td></tr>
              ) : (
                domains.map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50/50">
                    <td className="px-6 py-4 text-slate-500 text-left pl-10 font-medium w-[45%]">{row.name}</td>
                    <td className="px-6 py-4 text-center w-[45%]">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider bg-emerald-50 text-emerald-600 border border-emerald-100">
                        {row.status || 'ACTIVE'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center w-[10%]">
                      <button className="text-blue-600 hover:bg-blue-50 p-1.5 rounded transition-colors inline-block">
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          <div className="flex justify-between items-center text-sm text-slate-500 p-4 border-t border-border">
             <span>Showing 1 to {domains.length} of {domains.length} entries</span>
          </div>
        </div>
      </div>
    </div>
  );
};
