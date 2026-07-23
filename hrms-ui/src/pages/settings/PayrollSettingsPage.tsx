import React, { useState, useEffect } from 'react';
import { ArrowLeft, MoreHorizontal, Edit } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const PayrollSettingsPage = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEmp, setSelectedEmp] = useState<any>(null);
  const [formData, setFormData] = useState({
    basicPay: 0,
    hra: 0,
    da: 0,
    pf: 0,
    taxes: 0
  });

  const fetchEmployees = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/employees', {
        headers: {  }
      });
      if (response.ok) {
        const data = await response.json();
        // For each employee, also fetch their salary component
        const empsWithSalary = await Promise.all(data.map(async (emp: any) => {
          const salRes = await fetch(`http://localhost:3001/api/payroll/salary-components/${emp.id}`, {
            headers: {  }
          });
          const salData = await salRes.json();
          return { ...emp, salary: salData };
        }));
        setEmployees(empsWithSalary);
      }
    } catch (error) {
      console.error('Failed to fetch data', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const openModal = (emp: any) => {
    setSelectedEmp(emp);
    setFormData({
      basicPay: emp.salary?.basicPay || 0,
      hra: emp.salary?.hra || 0,
      da: emp.salary?.da || 0,
      pf: emp.salary?.pf || 0,
      taxes: emp.salary?.taxes || 0
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:3001/api/payroll/salary-components/${selectedEmp.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        setIsModalOpen(false);
        fetchEmployees();
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto pb-10">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1 tracking-tight">Payroll Settings</h1>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-emerald-500 font-medium">Settings</span>
            <span className="text-slate-300">›</span>
            <span className="text-slate-500">Payroll Settings</span>
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
        <div className="overflow-x-auto rounded-lg border border-border pb-4">
          <table className="w-full text-sm text-center text-slate-600 dark:text-slate-300">
            <thead className="bg-[#f0f4f8] text-slate-700 font-bold border-b border-border">
              <tr>
                <th className="px-4 py-4 font-bold text-slate-800 text-left">Employee Name</th>
                <th className="px-4 py-4 font-bold text-slate-800">Basic Pay</th>
                <th className="px-4 py-4 font-bold text-slate-800">HRA</th>
                <th className="px-4 py-4 font-bold text-slate-800">DA</th>
                <th className="px-4 py-4 font-bold text-slate-800">PF</th>
                <th className="px-4 py-4 font-bold text-slate-800">Taxes</th>
                <th className="px-4 py-4 font-bold text-slate-800">Net Pay Estimate</th>
                <th className="px-4 py-4 font-bold text-slate-800 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr><td colSpan={8} className="px-6 py-8 text-slate-500 text-center font-medium">Loading payroll settings...</td></tr>
              ) : employees.length === 0 ? (
                <tr><td colSpan={8} className="px-6 py-8 text-slate-500 text-center font-medium">No employees found.</td></tr>
              ) : (
                employees.map((emp) => {
                  const s = emp.salary;
                  const net = s ? (s.basicPay + s.hra + s.da - s.pf - s.taxes) : 0;
                  return (
                    <tr key={emp.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 text-left">
                        <div className="font-semibold text-slate-700">{emp.firstName} {emp.lastName}</div>
                        <div className="text-[11px] text-slate-500">{emp.employeeIdString}</div>
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-700">₹{s?.basicPay || 0}</td>
                      <td className="px-6 py-4 text-slate-500">₹{s?.hra || 0}</td>
                      <td className="px-6 py-4 text-slate-500">₹{s?.da || 0}</td>
                      <td className="px-6 py-4 text-slate-500">₹{s?.pf || 0}</td>
                      <td className="px-6 py-4 text-slate-500">₹{s?.taxes || 0}</td>
                      <td className="px-6 py-4 font-bold text-indigo-600">₹{net}</td>
                      <td className="px-6 py-4 text-center">
                        <button 
                          onClick={() => openModal(emp)}
                          className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-50 text-slate-600 hover:bg-slate-100 transition-colors tooltip mx-auto" 
                          title="Edit Salary"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && selectedEmp && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg border border-border overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-slate-50/50">
              <h2 className="text-lg font-bold text-slate-800">Edit Salary for {selectedEmp.firstName}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <ArrowLeft className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Basic Pay (₹)</label>
                  <input 
                    type="number" required
                    className="w-full px-3 py-2 bg-white border border-border rounded-md text-sm outline-none focus:border-indigo-500"
                    value={formData.basicPay}
                    onChange={(e) => setFormData({...formData, basicPay: parseFloat(e.target.value) || 0})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">HRA (₹)</label>
                  <input 
                    type="number" required
                    className="w-full px-3 py-2 bg-white border border-border rounded-md text-sm outline-none focus:border-indigo-500"
                    value={formData.hra}
                    onChange={(e) => setFormData({...formData, hra: parseFloat(e.target.value) || 0})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">DA (₹)</label>
                  <input 
                    type="number" required
                    className="w-full px-3 py-2 bg-white border border-border rounded-md text-sm outline-none focus:border-indigo-500"
                    value={formData.da}
                    onChange={(e) => setFormData({...formData, da: parseFloat(e.target.value) || 0})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">PF (₹)</label>
                  <input 
                    type="number" required
                    className="w-full px-3 py-2 bg-white border border-border rounded-md text-sm outline-none focus:border-indigo-500"
                    value={formData.pf}
                    onChange={(e) => setFormData({...formData, pf: parseFloat(e.target.value) || 0})}
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Taxes (₹)</label>
                  <input 
                    type="number" required
                    className="w-full px-3 py-2 bg-white border border-border rounded-md text-sm outline-none focus:border-indigo-500"
                    value={formData.taxes}
                    onChange={(e) => setFormData({...formData, taxes: parseFloat(e.target.value) || 0})}
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-border flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border border-border bg-white text-slate-600 rounded-md text-sm font-medium hover:bg-slate-50 transition-colors">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
