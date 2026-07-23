import React, { useState, useEffect } from 'react';
import { ArrowLeft, Edit, Trash2, RotateCcw, Save, MoreHorizontal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ClientMasterPage = () => {
  const navigate = useNavigate();
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/settings/clients', {
          headers: {  }
        });
        if (response.ok) {
          const data = await response.json();
          setClients(data);
        }
      } catch (error) {
        console.error('Failed to fetch clients', error);
      } finally {
        setLoading(false);
      }
    };
    fetchClients();
  }, []);

  return (
    <div className="max-w-[1600px] mx-auto pb-10">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1 tracking-tight">Client Master</h1>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-emerald-500 font-medium">Settings</span>
            <span className="text-slate-300">›</span>
            <span className="text-slate-500">Client Master</span>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <input type="text" value="Client-0006" readOnly className="w-full px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-lg text-sm text-slate-500 focus:outline-none cursor-not-allowed" />
          <input type="text" placeholder="Enter Client Name" className="w-full px-4 py-2.5 bg-white border border-border rounded-lg text-sm text-slate-700 focus:outline-none focus:border-indigo-500 transition-colors" />
          <input type="text" placeholder="Contact Person Name" className="w-full px-4 py-2.5 bg-white border border-border rounded-lg text-sm text-slate-700 focus:outline-none focus:border-indigo-500 transition-colors" />
          <input type="text" placeholder="Contact Person Mobile No" className="w-full px-4 py-2.5 bg-white border border-border rounded-lg text-sm text-slate-700 focus:outline-none focus:border-indigo-500 transition-colors" />
          
          <input type="text" placeholder="Contact Person Alternative No" className="w-full px-4 py-2.5 bg-white border border-border rounded-lg text-sm text-slate-700 focus:outline-none focus:border-indigo-500 transition-colors" />
          <input type="text" placeholder="Enter Email" className="w-full px-4 py-2.5 bg-white border border-border rounded-lg text-sm text-slate-700 focus:outline-none focus:border-indigo-500 transition-colors" />
          <input type="text" placeholder="Enter GST No" className="w-full px-4 py-2.5 bg-white border border-border rounded-lg text-sm text-slate-700 focus:outline-none focus:border-indigo-500 transition-colors" />
          <input type="text" placeholder="Client Code Ex: KY Tech - KYT" className="w-full px-4 py-2.5 bg-white border border-border rounded-lg text-sm text-slate-700 focus:outline-none focus:border-indigo-500 transition-colors" />
          
          <input type="text" placeholder="Enter Country" className="w-full px-4 py-2.5 bg-white border border-border rounded-lg text-sm text-slate-700 focus:outline-none focus:border-indigo-500 transition-colors" />
          <input type="text" placeholder="Enter state" className="w-full px-4 py-2.5 bg-white border border-border rounded-lg text-sm text-slate-700 focus:outline-none focus:border-indigo-500 transition-colors" />
          <input type="text" placeholder="Enter pincode" className="w-full px-4 py-2.5 bg-white border border-border rounded-lg text-sm text-slate-700 focus:outline-none focus:border-indigo-500 transition-colors" />
          <textarea placeholder="Enter Address" className="w-full px-4 py-2.5 bg-white border border-border rounded-lg text-sm text-slate-700 focus:outline-none focus:border-indigo-500 transition-colors resize-none h-[42px]"></textarea>
        </div>

        <div className="flex justify-center gap-4 mb-10">
          <button className="flex items-center gap-2 px-6 py-2.5 bg-white border border-indigo-200 text-indigo-600 rounded-full text-sm font-semibold hover:bg-indigo-50 transition-colors shadow-sm">
            <RotateCcw className="h-4 w-4" /> Clear
          </button>
          <button className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 border border-transparent text-white rounded-full text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-sm">
            <Save className="h-4 w-4" /> Submit
          </button>
        </div>

        {/* Table Section */}
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-sm text-left text-slate-600 dark:text-slate-300">
            <thead className="bg-[#f0f4f8] text-slate-700 font-bold">
              <tr>
                <th className="px-6 py-4 font-bold text-slate-800">Client Name <span className="text-slate-400 font-normal opacity-50 ml-1">↑↓</span></th>
                <th className="px-6 py-4 font-bold text-slate-800">Contact Person <span className="text-slate-400 font-normal opacity-50 ml-1">↑↓</span></th>
                <th className="px-6 py-4 font-bold text-slate-800">Email <span className="text-slate-400 font-normal opacity-50 ml-1">↑↓</span></th>
                <th className="px-6 py-4 font-bold text-slate-800">Phone <span className="text-slate-400 font-normal opacity-50 ml-1">↑↓</span></th>
                <th className="px-6 py-4 font-bold text-slate-800">Address <span className="text-slate-400 font-normal opacity-50 ml-1">↑↓</span></th>
                <th className="px-6 py-4 font-bold text-slate-800 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr><td colSpan={6} className="px-6 py-8 text-slate-500 text-center font-medium">Loading clients...</td></tr>
              ) : clients.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-8 text-slate-500 text-center font-medium">No clients found.</td></tr>
              ) : (
                clients.map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50/50">
                    <td className="px-6 py-4 text-slate-700 font-medium">{row.name}</td>
                    <td className="px-6 py-4 text-slate-500">{row.contactPerson || 'NA'}</td>
                    <td className="px-6 py-4 text-slate-500">{row.email || 'NA'}</td>
                    <td className="px-6 py-4 text-slate-500">{row.phone || 'NA'}</td>
                    <td className="px-6 py-4 text-slate-500">{row.address || 'NA'}</td>
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
          <div className="flex justify-between items-center text-sm text-slate-500 p-4 border-t border-border">
             <span>Showing 1 to {clients.length} of {clients.length} entries</span>
          </div>
        </div>
      </div>
    </div>
  );
};
