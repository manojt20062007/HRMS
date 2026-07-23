import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../components/PageHeader';
import { Calendar, ArrowLeft, Play, CheckCircle2, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const PayrollPage = () => {
  const navigate = useNavigate();
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();
  const [month, setMonth] = useState(currentMonth.toString());
  const [year, setYear] = useState(currentYear.toString());

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3001/api/payroll/records?month=${month}&year=${year}`, {
        headers: {  }
      });
      if (response.ok) {
        setRecords(await response.json());
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [month, year]);

  const handleGenerate = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/payroll/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ month: parseInt(month), year: parseInt(year) })
      });
      if (response.ok) {
        fetchRecords();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      const response = await fetch(`http://localhost:3001/api/payroll/records/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (response.ok) {
        fetchRecords();
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto pb-10">
      <div className="flex justify-between items-start mb-6">
        <PageHeader 
          title="Payroll Run" 
          breadcrumbs={['Payroll Management', 'Payroll Run']} 
        />
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-indigo-100 text-indigo-600 rounded-full text-sm font-semibold hover:bg-indigo-50 shadow-sm transition-colors mt-2"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
      </div>

      <div className="bg-white dark:bg-card border border-border shadow-sm rounded-xl overflow-hidden mt-2">
        <div className="p-4 border-b border-border flex justify-between items-center bg-slate-50/50">
          <div className="flex items-center gap-3">
            <select 
              className="px-3 py-2 bg-white border border-border rounded-md text-sm outline-none focus:border-indigo-500 shadow-sm font-medium text-slate-700"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
            >
              {[...Array(12)].map((_, i) => (
                <option key={i+1} value={i+1}>{new Date(0, i).toLocaleString('en', { month: 'long' })}</option>
              ))}
            </select>
            <select 
              className="px-3 py-2 bg-white border border-border rounded-md text-sm outline-none focus:border-indigo-500 shadow-sm font-medium text-slate-700"
              value={year}
              onChange={(e) => setYear(e.target.value)}
            >
              {[2024, 2025, 2026, 2027].map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
          <button 
            onClick={handleGenerate}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 shadow-sm transition-colors"
          >
            <Play className="h-4 w-4" /> Generate Payroll
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-600 dark:text-slate-300">
            <thead className="bg-[#f0f4f8] dark:bg-muted text-slate-700 dark:text-slate-200 font-semibold border-b border-border">
              <tr>
                <th className="px-6 py-4">Employee</th>
                <th className="px-6 py-4 text-right">Basic Pay</th>
                <th className="px-6 py-4 text-right">HRA</th>
                <th className="px-6 py-4 text-right">DA</th>
                <th className="px-6 py-4 text-right text-red-500">Deductions (PF+Tax)</th>
                <th className="px-6 py-4 text-right text-emerald-600">Net Pay</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr><td colSpan={8} className="px-6 py-8 text-center text-slate-500">Loading payroll data...</td></tr>
              ) : records.length === 0 ? (
                <tr><td colSpan={8} className="px-6 py-8 text-center text-slate-500">No payroll records for this period. Click 'Generate Payroll'.</td></tr>
              ) : (
                records.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50 dark:hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 text-left">
                      <div className="font-semibold text-slate-700">{row.employee?.firstName} {row.employee?.lastName}</div>
                      <div className="text-[11px] text-slate-500">{row.employee?.employeeIdString}</div>
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-700 text-right">₹{row.basicPay}</td>
                    <td className="px-6 py-4 text-slate-500 text-right">₹{row.hra}</td>
                    <td className="px-6 py-4 text-slate-500 text-right">₹{row.da}</td>
                    <td className="px-6 py-4 text-red-500 text-right font-medium">-₹{row.pf + row.taxes}</td>
                    <td className="px-6 py-4 font-bold text-emerald-600 text-right bg-emerald-50/30">₹{row.netPay}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2.5 py-1 text-[11px] font-bold uppercase border rounded-full ${
                        row.status === 'PAID' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' :
                        row.status === 'PROCESSED' ? 'bg-blue-50 text-blue-600 border-blue-200' :
                        'bg-slate-100 text-slate-600 border-slate-300'
                      }`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        {row.status !== 'PAID' && (
                          <button 
                            onClick={() => handleUpdateStatus(row.id, 'PAID')} 
                            className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors tooltip" 
                            title="Mark as Paid"
                          >
                            <CheckCircle2 className="h-4 w-4" />
                          </button>
                        )}
                        <button 
                          className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-50 text-slate-600 hover:bg-slate-100 transition-colors tooltip" 
                          title="Download Payslip"
                        >
                          <Download className="h-4 w-4" />
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
    </div>
  );
};
