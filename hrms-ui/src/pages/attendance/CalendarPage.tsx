import React, { useState, useEffect } from 'react';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const CalendarPage = () => {
  const navigate = useNavigate();
  const [attendance, setAttendance] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/attendance', {
          headers: { 'x-tenant-id': 'pmj.com' }
        });
        if (response.ok) {
          setAttendance(await response.json());
        }
      } catch (error) {
        console.error('Failed to fetch attendance', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAttendance();
  }, []);

  // Generate calendar days for the current month
  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const days = [];
    
    // Previous month padding
    const prevMonthDays = new Date(year, month, 0).getDate();
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({ date: prevMonthDays - i, type: 'empty', isInCurrentMonth: false, fullDate: new Date(year, month - 1, prevMonthDays - i) });
    }
    
    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      const isSunday = date.getDay() === 0;
      let type = 'empty';
      let label = '';
      let firstIn = 'NA';
      let lastOut = 'NA';

      if (isSunday) {
        type = 'off';
        label = 'Sunday Week Off';
      } else {
        // Find attendance record for this date (assuming we just show the first one found for demo, or we'd filter by an employeeId)
        const record = attendance.find(a => new Date(a.date).toDateString() === date.toDateString());
        if (record) {
          type = record.status.toLowerCase(); // 'present', 'absent', 'half_day'
          firstIn = record.checkIn ? new Date(record.checkIn).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'NA';
          lastOut = record.checkOut ? new Date(record.checkOut).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'NA';
        }
      }

      days.push({ date: i, type, label, firstIn, lastOut, isInCurrentMonth: true, fullDate: date });
    }
    
    // Next month padding to complete the grid (usually 42 cells total for a 6-week view)
    const remainingCells = 42 - days.length;
    for (let i = 1; i <= remainingCells; i++) {
      days.push({ date: i, type: 'empty', isInCurrentMonth: false, fullDate: new Date(year, month + 1, i) });
    }
    
    return days;
  };

  const days = getDaysInMonth();
  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  return (
    <div className="max-w-[1600px] mx-auto pb-10">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1 tracking-tight">Calendar</h1>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-emerald-500 font-medium">Attendance & Leave</span>
            <span className="text-slate-300">›</span>
            <span className="text-slate-500">Calendar</span>
          </div>
        </div>
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-indigo-100 text-indigo-600 rounded-full text-sm font-semibold hover:bg-indigo-50 shadow-sm transition-colors mt-2"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
      </div>

      <div className="bg-white dark:bg-card border border-border shadow-sm rounded-xl overflow-hidden mt-2">
        
        {/* Calendar Header */}
        <div className="p-6 flex items-center justify-between border-b border-border">
          <div className="flex items-center gap-2">
            <div className="flex rounded-md shadow-sm">
              <button className="px-3 py-1.5 bg-[#2c3e50] text-white rounded-l-md hover:bg-[#34495e] transition-colors border-r border-[#34495e]">
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button className="px-3 py-1.5 bg-[#2c3e50] text-white rounded-r-md hover:bg-[#34495e] transition-colors">
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
            <button className="px-4 py-1.5 bg-[#7f8c8d] text-white rounded-md text-sm font-medium hover:bg-[#95a5a6] transition-colors">
              today
            </button>
          </div>
          
          <h2 className="text-lg font-bold text-slate-800 uppercase tracking-wide">{monthName}</h2>
          
          <div className="flex rounded-md shadow-sm">
            <button className="px-4 py-1.5 bg-[#2c3e50] text-white rounded-l-md text-sm font-medium border-r border-[#34495e]">
              month
            </button>
            <button className="px-4 py-1.5 bg-[#34495e] text-slate-300 hover:text-white transition-colors text-sm font-medium border-r border-[#465e75]">
              week
            </button>
            <button className="px-4 py-1.5 bg-[#34495e] text-slate-300 hover:text-white transition-colors rounded-r-md text-sm font-medium">
              day
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="w-full border-b border-border">
          {/* Days Header */}
          <div className="grid grid-cols-7 border-b border-border bg-white">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="py-3 text-center font-bold text-emerald-600 border-r last:border-r-0 border-border">
                {day}
              </div>
            ))}
          </div>
          
          {/* Calendar Body */}
          <div className="grid grid-cols-7 bg-white">
            {days.map((day, i) => (
              <div key={i} className="min-h-[140px] border-r border-b last:border-r-0 border-border p-1 relative flex flex-col group hover:bg-slate-50 transition-colors">
                <div className={`text-right px-2 py-1 text-sm ${day.isInCurrentMonth ? 'text-emerald-500 font-medium' : 'text-slate-300'}`}>
                  {day.date}
                </div>
                
                <div className="flex-1 p-1">
                  {day.type === 'off' && (
                    <div className="bg-[#95a5a6] text-white text-xs font-bold text-center py-2 px-1 rounded shadow-sm h-full flex items-center justify-center">
                      {day.label}
                    </div>
                  )}
                  
                  {day.type === 'present' && (
                    <div className="bg-gradient-to-b from-[#4caf50] to-[#66bb6a] rounded shadow-sm h-full p-2 flex flex-col gap-1.5 items-center justify-center">
                      <span className="text-white text-xs font-bold tracking-wide">Present</span>
                      <div className="bg-white/90 text-[#2e7d32] text-[10px] font-bold px-2 py-1 rounded w-full text-center">First In: {day.firstIn}</div>
                      <div className="bg-white/90 text-[#2e7d32] text-[10px] font-bold px-2 py-1 rounded w-full text-center">Last Out: {day.lastOut}</div>
                    </div>
                  )}

                  {day.type === 'absent' && (
                    <div className="bg-gradient-to-b from-[#f44336] to-[#ef5350] rounded shadow-sm h-full p-2 flex flex-col gap-1.5 items-center justify-center">
                      <span className="text-white text-xs font-bold tracking-wide">Absent</span>
                      <div className="bg-white/90 text-[#c62828] text-[10px] font-bold px-2 py-1 rounded w-full text-center">First In: {day.firstIn}</div>
                      <div className="bg-white/90 text-[#c62828] text-[10px] font-bold px-2 py-1 rounded w-full text-center">Last Out: {day.lastOut}</div>
                    </div>
                  )}
                  
                  {day.type === 'half_day' && (
                    <div className="bg-gradient-to-b from-amber-400 to-amber-500 rounded shadow-sm h-full p-2 flex flex-col gap-1.5 items-center justify-center">
                      <span className="text-white text-xs font-bold tracking-wide">Half Day</span>
                      <div className="bg-white/90 text-amber-700 text-[10px] font-bold px-2 py-1 rounded w-full text-center">First In: {day.firstIn}</div>
                      <div className="bg-white/90 text-amber-700 text-[10px] font-bold px-2 py-1 rounded w-full text-center">Last Out: {day.lastOut}</div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
