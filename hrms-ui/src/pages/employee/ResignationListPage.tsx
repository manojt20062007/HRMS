import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ResignationListPage = () => {
  const navigate = useNavigate();
  const [resignations, setResignations] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    employeeId: '',
    resignationDate: '',
    lastWorkingDay: '',
    reason: ''
  });

  const fetchData = async () => {
    try {
      const [resigRes, empRes] = await Promise.all([
        fetch('http://localhost:3001/api/resignation', { headers: { 'x-tenant-id': 'pmj.com' } }),
        fetch('http://localhost:3001/api/employees', { headers: { 'x-tenant-id': 'pmj.com' } })
      ]);
      if (resigRes.ok) setResignations(await resigRes.json());
      if (empRes.ok) setEmployees(await empRes.json());
    } catch (error) {
      console.error('Failed to fetch data', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3001/api/resignation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-tenant-id': 'pmj.com' },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        setIsModalOpen(false);
        setFormData({ employeeId: '', resignationDate: '', lastWorkingDay: '', reason: '' });
        fetchData();
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto pb-10">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1 tracking-tight">Resignation List</h1>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-emerald-500 font-medium">Employee Management</span>
            <span className="text-slate-300">›</span>
            <span className="text-slate-500">Resignation List</span>
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
        
        {/* Header Bar */}
        <div className="flex items-center justify-end mb-6 mt-2 mr-2">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white text-indigo-600 rounded-full text-sm font-semibold border border-indigo-100 hover:bg-indigo-50 shadow-sm transition-colors"
          >
            <Plus className="h-4 w-4" /> Resignation
          </button>
        </div>

        {/* Table Section */}
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-sm text-center text-slate-600 dark:text-slate-300">
            <thead className="bg-[#f0f4f8] text-slate-700 font-bold border-b border-border">
              <tr>
                <th className="px-4 py-4 font-bold text-slate-800">Resignation Date <span className="text-slate-400 font-normal opacity-50 ml-1">↑↓</span></th>
                <th className="px-4 py-4 font-bold text-slate-800">Employee Name <span className="text-slate-400 font-normal opacity-50 ml-1">↑↓</span></th>
                <th className="px-4 py-4 font-bold text-slate-800">Department <span className="text-slate-400 font-normal opacity-50 ml-1">↑↓</span></th>
                <th className="px-4 py-4 font-bold text-slate-800">Designation <span className="text-slate-400 font-normal opacity-50 ml-1">↑↓</span></th>
                <th className="px-4 py-4 font-bold text-slate-800">Reporting Manager <span className="text-slate-400 font-normal opacity-50 ml-1">↑↓</span></th>
                <th className="px-4 py-4 font-bold text-slate-800">Notice Period (Days) <span className="text-slate-400 font-normal opacity-50 ml-1">↑↓</span></th>
                <th className="px-4 py-4 font-bold text-slate-800">Provisional Relieving Date <span className="text-slate-400 font-normal opacity-50 ml-1">↑↓</span></th>
                <th className="px-4 py-4 font-bold text-slate-800">Status <span className="text-slate-400 font-normal opacity-50 ml-1">↑↓</span></th>
                <th className="px-4 py-4 font-bold text-slate-800 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr><td colSpan={9} className="px-6 py-8 text-slate-500 text-center font-medium">Loading resignations...</td></tr>
              ) : resignations.length === 0 ? (
                <tr><td colSpan={9} className="px-6 py-8 text-slate-500 text-center font-medium">No resignations found.</td></tr>
              ) : (
                resignations.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-left font-medium text-slate-700">{new Date(row.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-left">
                      <div className="font-semibold text-slate-700">{row.employee?.firstName} {row.employee?.lastName}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">{row.employee?.employeeIdString}</div>
                    </td>
                    <td className="px-6 py-4 text-left text-slate-500">-</td>
                    <td className="px-6 py-4 text-left text-slate-500">-</td>
                    <td className="px-6 py-4 text-left text-slate-500">-</td>
                    <td className="px-6 py-4 text-center text-slate-500">60</td>
                    <td className="px-6 py-4 text-center font-medium text-slate-700">{new Date(row.lastWorkingDay).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center justify-center px-2 py-1 rounded text-[10px] font-bold tracking-wider 
                        ${row.status.includes('PENDING') ? 'bg-amber-100 text-amber-700' : 
                          row.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button className="text-blue-600 font-semibold text-xs hover:underline">View</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
      </div>
    </div>
  );
};
