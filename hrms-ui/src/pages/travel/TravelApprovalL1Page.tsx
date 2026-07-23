import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../components/PageHeader';
import { Check, X } from 'lucide-react';

export const TravelApprovalL1Page = () => {
  const [expenses, setExpenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchExpenses = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/travel?status=PENDING_L1', {
        headers: {  }
      });
      if (response.ok) {
        setExpenses(await response.json());
      }
    } catch (error) {
      console.error('Failed to fetch expenses', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      const response = await fetch(`http://localhost:3001/api/travel/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (response.ok) {
        fetchExpenses();
      }
    } catch (error) {
      console.error('Failed to update status', error);
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto pb-10">
      <PageHeader 
        title="Travel Expense Approval L1" 
        breadcrumbs={['Travel Expense Management', 'Travel Expense Approval L1']} 
      />

      <div className="bg-white dark:bg-card border border-border shadow-sm rounded-xl overflow-hidden mt-6">
        {/* Table */}
        <div className="overflow-x-auto p-4">
          <table className="w-full text-sm text-center text-slate-600 dark:text-slate-300 border border-border rounded-lg overflow-hidden">
            <thead className="text-[12px] bg-[#F4F7FE] dark:bg-muted text-slate-700 dark:text-slate-200 border-b border-border">
              <tr>
                <th className="px-6 py-4 font-semibold text-left">Project <span className="text-[10px] text-slate-400 inline-block ml-1">↑↓</span></th>
                <th className="px-6 py-4 font-semibold text-center">Employee <span className="text-[10px] text-slate-400 inline-block ml-1">↑↓</span></th>
                <th className="px-6 py-4 font-semibold text-center">Travel Date <span className="text-[10px] text-slate-400 inline-block ml-1">↑↓</span></th>
                <th className="px-6 py-4 font-semibold text-center">Amount <span className="text-[10px] text-slate-400 inline-block ml-1">↑↓</span></th>
                <th className="px-6 py-4 font-semibold text-left">Description <span className="text-[10px] text-slate-400 inline-block ml-1">↑↓</span></th>
                <th className="px-6 py-4 font-semibold text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr><td colSpan={6} className="px-6 py-8 text-slate-500 text-center font-medium">Loading approvals...</td></tr>
              ) : expenses.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-8 text-slate-500 text-center font-medium">No pending approvals.</td></tr>
              ) : (
                expenses.map((expense) => (
                  <tr key={expense.id} className="hover:bg-slate-50 dark:hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 text-left text-slate-500">-</td>
                    <td className="px-6 py-4 text-slate-500">{expense.employee?.firstName} {expense.employee?.lastName}</td>
                    <td className="px-6 py-4 text-slate-500">{new Date(expense.date).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-slate-700 font-bold">₹{expense.amount}</td>
                    <td className="px-6 py-4 text-left text-slate-500">{expense.description}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => handleUpdateStatus(expense.id, 'PENDING_L2')} className="text-emerald-600 hover:bg-emerald-50 p-1.5 rounded transition-colors" title="Approve">
                          <Check className="h-4 w-4" />
                        </button>
                        <button onClick={() => handleUpdateStatus(expense.id, 'REJECTED')} className="text-rose-600 hover:bg-rose-50 p-1.5 rounded transition-colors" title="Reject">
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-4 pb-4 flex items-center justify-between text-sm text-slate-500">
          <div>
            Showing 1 to {expenses.length} of {expenses.length} entries
          </div>
          <div className="flex items-center gap-1">
            <button className="px-3 py-1.5 border border-border bg-white rounded text-slate-500 hover:bg-slate-50 disabled:opacity-50">
              Previous
            </button>
            <button className="px-3 py-1.5 border border-teal-600 bg-teal-600 text-white rounded font-medium">
              1
            </button>
            <button className="px-3 py-1.5 border border-border bg-white rounded text-slate-500 hover:bg-slate-50 disabled:opacity-50">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
