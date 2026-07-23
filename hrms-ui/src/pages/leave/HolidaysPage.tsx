import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../components/PageHeader';
import { Plus } from 'lucide-react';

export const HolidaysPage = () => {
  const [holidays, setHolidays] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [newHoliday, setNewHoliday] = useState({ name: '', date: '', type: 'Public Holiday' });

  const fetchHolidays = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/attendance/holidays', {
        headers: { 'x-tenant-id': 'pmj.com' }
      });
      if (response.ok) {
        setHolidays(await response.json());
      }
    } catch (error) {
      console.error('Failed to fetch holidays', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHolidays();
  }, []);

  const handleAddHoliday = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/attendance/holidays', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-tenant-id': 'pmj.com' },
        body: JSON.stringify(newHoliday)
      });
      if (response.ok) {
        setIsAdding(false);
        setNewHoliday({ name: '', date: '', type: 'Public Holiday' });
        fetchHolidays();
      }
    } catch (error) {
      console.error('Failed to add holiday', error);
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto pb-10">
      <PageHeader 
        title="Holiday List" 
        breadcrumbs={['Leave', 'Holiday List']} 
      />

      <div className="bg-white dark:bg-card border border-border shadow-sm rounded-xl overflow-hidden mt-6">
        {/* Banner */}
        <div className="p-4 border-b border-border bg-gradient-to-r from-blue-100/50 to-emerald-100/50 dark:from-blue-900/20 dark:to-emerald-900/20 flex justify-between items-center">
          <button 
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 bg-[#0d9488] text-white px-4 py-2 rounded-md hover:bg-teal-700 transition-colors text-sm font-medium shadow-sm"
          >
            <Plus className="h-4 w-4" /> Add Holiday
          </button>
          <input 
            type="number" 
            defaultValue={new Date().getFullYear()}
            className="w-32 px-3 py-1.5 bg-white dark:bg-card border border-border rounded-md text-sm outline-none focus:border-indigo-500 shadow-sm"
          />
        </div>

        {isAdding && (
          <div className="p-4 bg-slate-50 border-b border-border flex gap-4 items-end">
            <div className="flex-1">
              <label className="block text-xs font-medium text-slate-500 mb-1">Holiday Name</label>
              <input type="text" value={newHoliday.name} onChange={e => setNewHoliday({...newHoliday, name: e.target.value})} className="w-full px-3 py-2 border rounded-md text-sm" placeholder="e.g. Diwali" />
            </div>
            <div className="flex-1">
              <label className="block text-xs font-medium text-slate-500 mb-1">Date</label>
              <input type="date" value={newHoliday.date} onChange={e => setNewHoliday({...newHoliday, date: e.target.value})} className="w-full px-3 py-2 border rounded-md text-sm" />
            </div>
            <div className="flex-1">
              <label className="block text-xs font-medium text-slate-500 mb-1">Type</label>
              <select value={newHoliday.type} onChange={e => setNewHoliday({...newHoliday, type: e.target.value})} className="w-full px-3 py-2 border rounded-md text-sm">
                <option>Public Holiday</option>
                <option>Optional Holiday</option>
              </select>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setIsAdding(false)} className="px-4 py-2 border rounded-md text-sm">Cancel</button>
              <button onClick={handleAddHoliday} className="px-4 py-2 bg-[#0d9488] text-white rounded-md text-sm">Save</button>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-600 dark:text-slate-300">
            <thead className="text-xs bg-[#F4F7FE] dark:bg-muted text-slate-700 dark:text-slate-200">
              <tr>
                <th className="px-6 py-4 font-semibold">Holidays <span className="text-[10px] text-slate-400 inline-block ml-1">↑↓</span></th>
                <th className="px-6 py-4 font-semibold text-right">Date <span className="text-[10px] text-slate-400 inline-block ml-1">↑↓</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan={2} className="px-6 py-12 text-center text-slate-500">Loading holidays...</td>
                </tr>
              ) : holidays.length === 0 ? (
                <tr>
                  <td colSpan={2} className="px-6 py-12 text-center text-slate-500">
                    No holidays configured for the selected year.
                  </td>
                </tr>
              ) : (
                holidays.map((h: any) => (
                  <tr key={h.id} className="hover:bg-slate-50/50">
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-700">{h.name}</div>
                      <div className="text-xs text-slate-400 mt-0.5">{h.type}</div>
                    </td>
                    <td className="px-6 py-4 text-right text-slate-600 font-medium">
                      {new Date(h.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
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
