import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../components/PageHeader';
import { Plus, X } from 'lucide-react';

export const TravelExpensesPage = () => {
  const [expenses, setExpenses] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    employeeId: '',
    date: '',
    amount: '',
    description: ''
  });

  const fetchData = async () => {
    try {
      const [expRes, empRes] = await Promise.all([
        fetch('http://localhost:3001/api/travel', { headers: { 'x-tenant-id': 'pmj.com' } }),
        fetch('http://localhost:3001/api/employees', { headers: { 'x-tenant-id': 'pmj.com' } })
      ]);
      if (expRes.ok) setExpenses(await expRes.json());
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
      const response = await fetch('http://localhost:3001/api/travel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-tenant-id': 'pmj.com' },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        setIsModalOpen(false);
        setFormData({ employeeId: '', date: '', amount: '', description: '' });
        fetchData();
      }
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="max-w-[1600px] mx-auto pb-10">
      <PageHeader 
        title="Travel Expenses" 
        breadcrumbs={['Travel Management', 'Travel Expenses']} 
      />

      <div className="bg-white dark:bg-card border border-border shadow-sm rounded-xl overflow-hidden mt-6">
        {/* Banner with Gradient */}
        <div className="p-3 border-b border-border bg-gradient-to-r from-blue-100/50 to-emerald-100/50 dark:from-blue-900/20 dark:to-emerald-900/20 flex justify-end">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-1.5 bg-white border border-indigo-200 text-indigo-600 rounded-full text-sm font-semibold hover:bg-indigo-50 shadow-sm transition-colors"
          >
            <Plus className="h-4 w-4" /> Add Expense
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-center text-slate-600 dark:text-slate-300">
            <thead className="text-[11px] uppercase bg-[#F4F7FE] dark:bg-muted text-slate-700 dark:text-slate-200">
              <tr>
                <th className="px-6 py-4 font-semibold text-center">Date <span className="text-[10px] text-slate-400 inline-block ml-1">↑↓</span></th>
                <th className="px-6 py-4 font-semibold text-center">Amount (₹) <span className="text-[10px] text-slate-400 inline-block ml-1">↑↓</span></th>
                <th className="px-6 py-4 font-semibold text-center">Description <span className="text-[10px] text-slate-400 inline-block ml-1">↑↓</span></th>
                <th className="px-6 py-4 font-semibold text-center">Client <span className="text-[10px] text-slate-400 inline-block ml-1">↑↓</span></th>
                <th className="px-6 py-4 font-semibold text-center">Visit Type <span className="text-[10px] text-slate-400 inline-block ml-1">↑↓</span></th>
                <th className="px-6 py-4 font-semibold text-center">Attachment <span className="text-[10px] text-slate-400 inline-block ml-1">↑↓</span></th>
                <th className="px-6 py-4 font-semibold text-center">Status <span className="text-[10px] text-slate-400 inline-block ml-1">↑↓</span></th>
                <th className="px-6 py-4 font-semibold text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-[#f8fafc] dark:bg-muted/10">
              {loading ? (
                <tr><td colSpan={8} className="px-6 py-8 text-slate-500 text-center font-medium">Loading expenses...</td></tr>
              ) : expenses.length === 0 ? (
                <tr><td colSpan={8} className="px-6 py-8 text-slate-500 text-center font-medium">No travel expenses found.</td></tr>
              ) : (
                expenses.map((expense) => (
                  <tr key={expense.id} className="hover:bg-slate-50/50">
                    <td className="px-6 py-4 text-slate-600 font-medium">{new Date(expense.date).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-slate-700 font-bold">₹{expense.amount}</td>
                    <td className="px-6 py-4 text-slate-500">{expense.description}</td>
                    <td className="px-6 py-4 text-slate-500">-</td>
                    <td className="px-6 py-4 text-slate-500">-</td>
                    <td className="px-6 py-4 text-slate-500">-</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex text-[10px] font-bold tracking-wider px-2 py-1 rounded-md bg-opacity-10 
                        ${expense.status.includes('PENDING') ? 'text-amber-600 bg-amber-500' : 
                          expense.status === 'APPROVED' ? 'text-emerald-600 bg-emerald-500' : 'text-rose-600 bg-rose-500'}`}>
                        {expense.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button className="text-slate-400 hover:text-slate-600">...</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-border flex items-center justify-between text-sm text-slate-500">
          <div>
            Showing 1 to {expenses.length} of {expenses.length} entries
          </div>
          <div className="flex items-center gap-1">
            <button className="px-3 py-1.5 border border-border bg-white rounded text-slate-400 opacity-50 cursor-not-allowed">
              Previous
            </button>
            <button className="px-3 py-1.5 border border-border bg-white rounded text-slate-400 opacity-50 cursor-not-allowed">
              Next
            </button>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg border border-border overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-slate-50/50">
              <h2 className="text-lg font-bold text-slate-800">Add Travel Expense</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Employee</label>
                <select 
                  required
                  className="w-full px-3 py-2 bg-white border border-border rounded-md text-sm outline-none focus:border-indigo-500"
                  value={formData.employeeId}
                  onChange={(e) => setFormData({...formData, employeeId: e.target.value})}
                >
                  <option value="">Select Employee</option>
                  {employees.map(emp => (
                    <option key={emp.id} value={emp.id}>{emp.firstName} {emp.lastName}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Date</label>
                <input 
                  type="date" 
                  required
                  className="w-full px-3 py-2 bg-white border border-border rounded-md text-sm outline-none focus:border-indigo-500"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Amount (₹)</label>
                <input 
                  type="number" 
                  required
                  step="0.01"
                  className="w-full px-3 py-2 bg-white border border-border rounded-md text-sm outline-none focus:border-indigo-500"
                  value={formData.amount}
                  onChange={(e) => setFormData({...formData, amount: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Description</label>
                <textarea 
                  required
                  rows={3}
                  className="w-full px-3 py-2 bg-white border border-border rounded-md text-sm outline-none focus:border-indigo-500 resize-none"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>

              <div className="pt-4 border-t border-border flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border border-border bg-white text-slate-600 rounded-md text-sm font-medium hover:bg-slate-50 transition-colors">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm">
                  Save Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
