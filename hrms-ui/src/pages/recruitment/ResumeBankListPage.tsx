import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../components/PageHeader';
import { Database, Search, UploadCloud, X, Play } from 'lucide-react';

export const ResumeBankListPage = () => {
  const [candidates, setCandidates] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    staffingRequestId: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    resumeUrl: ''
  });

  const fetchData = async () => {
    try {
      const [candRes, reqRes] = await Promise.all([
        fetch('http://localhost:3001/api/recruitment/candidates?status=RESUME_BANK', { headers: {  } }),
        fetch('http://localhost:3001/api/recruitment/staffing?status=APPROVED', { headers: {  } })
      ]);
      if (candRes.ok) setCandidates(await candRes.json());
      if (reqRes.ok) setRequests(await reqRes.json());
    } catch (error) {
      console.error(error);
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
      const response = await fetch('http://localhost:3001/api/recruitment/candidates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        setIsModalOpen(false);
        setFormData({ staffingRequestId: '', firstName: '', lastName: '', email: '', phone: '', resumeUrl: '' });
        fetchData();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      const response = await fetch(`http://localhost:3001/api/recruitment/candidates/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (response.ok) {
        fetchData();
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto pb-10">
      <PageHeader 
        title="ResumeBank List" 
        breadcrumbs={['Recruitment', 'ResumeBank List']} 
      />

      <div className="bg-white dark:bg-card border border-border shadow-sm rounded-xl overflow-hidden mt-6">
        {/* Banner */}
        <div className="p-4 border-b border-border bg-gradient-to-r from-blue-100/50 to-indigo-100/50 dark:from-blue-900/20 dark:to-indigo-900/20 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 text-indigo-900 dark:text-indigo-300 font-semibold">
            <Database className="h-5 w-5" /> Central Resume Database
          </div>
          
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search by name..." 
                className="w-full pl-9 pr-4 py-2 bg-white dark:bg-card border border-border rounded-lg focus:outline-none focus:border-indigo-500 shadow-sm text-sm"
              />
            </div>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 shadow-sm transition-colors shrink-0"
            >
              <UploadCloud className="h-4 w-4" /> Add Candidate
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-600 dark:text-slate-300">
            <thead className="text-[11px] uppercase bg-[#F4F7FE] dark:bg-muted text-slate-700 dark:text-slate-200">
              <tr>
                <th className="px-6 py-4 font-semibold">Candidate Name</th>
                <th className="px-6 py-4 font-semibold">Email</th>
                <th className="px-6 py-4 font-semibold">Phone</th>
                <th className="px-6 py-4 font-semibold">Applied Role</th>
                <th className="px-6 py-4 font-semibold text-center">Status</th>
                <th className="px-6 py-4 font-semibold text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-slate-500">Loading candidates...</td></tr>
              ) : candidates.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-slate-500">No candidates in resume bank</td></tr>
              ) : (
                candidates.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50 dark:hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-800 dark:text-slate-200">{row.firstName} {row.lastName}</td>
                    <td className="px-6 py-4">{row.email}</td>
                    <td className="px-6 py-4">{row.phone}</td>
                    <td className="px-6 py-4">{row.staffingRequest?.designation}</td>
                    <td className="px-6 py-4 text-center">
                      <span className="px-2.5 py-1 text-[11px] font-bold uppercase border rounded-full bg-slate-50 text-slate-600 border-slate-200">
                        {row.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => handleUpdateStatus(row.id, 'HR_SCREEN')} className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors tooltip" title="Move to HR Screen">
                          <Play className="h-4 w-4 fill-current" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg border border-border overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-slate-50/50">
              <h2 className="text-lg font-bold text-slate-800">Add Candidate</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Staffing Request</label>
                <select 
                  required
                  className="w-full px-3 py-2 bg-white border border-border rounded-md text-sm outline-none focus:border-indigo-500"
                  value={formData.staffingRequestId}
                  onChange={(e) => setFormData({...formData, staffingRequestId: e.target.value})}
                >
                  <option value="">Select Request</option>
                  {requests.map(req => (
                    <option key={req.id} value={req.id}>{req.designation} (Req: {req.id.split('-')[0]})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">First Name</label>
                  <input 
                    type="text" required
                    className="w-full px-3 py-2 bg-white border border-border rounded-md text-sm outline-none focus:border-indigo-500"
                    value={formData.firstName}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Last Name</label>
                  <input 
                    type="text" required
                    className="w-full px-3 py-2 bg-white border border-border rounded-md text-sm outline-none focus:border-indigo-500"
                    value={formData.lastName}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Email</label>
                <input 
                  type="email" required
                  className="w-full px-3 py-2 bg-white border border-border rounded-md text-sm outline-none focus:border-indigo-500"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Phone</label>
                <input 
                  type="text" required
                  className="w-full px-3 py-2 bg-white border border-border rounded-md text-sm outline-none focus:border-indigo-500"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Resume Link</label>
                <input 
                  type="url" 
                  className="w-full px-3 py-2 bg-white border border-border rounded-md text-sm outline-none focus:border-indigo-500"
                  value={formData.resumeUrl}
                  onChange={(e) => setFormData({...formData, resumeUrl: e.target.value})}
                />
              </div>

              <div className="pt-4 border-t border-border flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border border-border bg-white text-slate-600 rounded-md text-sm font-medium hover:bg-slate-50 transition-colors">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm">
                  Add Candidate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
