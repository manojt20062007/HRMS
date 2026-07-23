import React, { useState, useEffect } from 'react';
import { Users, UserCheck, Bell, ClipboardList, Clock, Briefcase, BellOff, ArrowLeft } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const pieData = [
  { name: 'KVM', value: 1, color: '#3B82F6' },
  { name: 'Other', value: 3, color: '#10B981' }
];

export const DashboardPage = () => {
  const [employees, setEmployees] = useState<any[]>([]);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/employees', {
          headers: {  }
        });
        if (response.ok) {
          const data = await response.json();
          setEmployees(data);
        }
      } catch (error) {
        console.error('Failed to fetch employees', error);
      }
    };
    fetchEmployees();
  }, []);

  const kpis = [
    { title: 'TOTAL STAFF', subtitle: 'Registered employees', value: employees.length.toString(), change: '+10%', icon: Users },
    { title: 'PRESENT TODAY', subtitle: 'Marked in attendance', value: '0', badge: 'ACTIVE', icon: UserCheck },
    { title: 'ABSENT TODAY', subtitle: 'Missing from duty', value: '0', badge: 'TODAY', icon: Bell },
    { title: 'ON LEAVE', subtitle: 'Approved leave status', value: '0', badge: 'LEAVE', icon: ClipboardList },
    { title: 'PERMISSIONS', subtitle: 'Short time-out approved', value: '0', badge: 'HOURS', icon: Clock },
    { title: 'ON-DUTY', subtitle: 'Outside client visits', value: '0', badge: 'FIELD', icon: Briefcase },
  ];

  const teamActivity = employees.slice(0, 5).map(emp => ({
    name: `${emp.firstName} ${emp.lastName}`,
    status: 'Pending'
  }));

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-border/40">
        <h2 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-white">Dashboard</h2>
        <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-card border border-border shadow-sm rounded-full text-sm font-medium text-indigo-600 hover:bg-slate-50 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {kpis.map((kpi, index) => (
          <div key={index} className="bg-white dark:bg-card rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-border flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
              <div className="h-12 w-12 rounded-2xl bg-[#F4F7FE] dark:bg-muted flex items-center justify-center text-indigo-600">
                <kpi.icon className="h-6 w-6 stroke-[1.5]" />
              </div>
              <div className="flex flex-col items-end">
                <h3 className="text-3xl font-bold text-slate-900 dark:text-white">{kpi.value}</h3>
                {kpi.change && (
                  <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full mt-1">
                    {kpi.change}
                  </span>
                )}
                {kpi.badge && (
                  <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full mt-1 tracking-wider uppercase">
                    {kpi.badge}
                  </span>
                )}
              </div>
            </div>
            <div>
              <p className="text-[13px] font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide">{kpi.title}</p>
              <p className="text-[12px] text-slate-500 mt-0.5">{kpi.subtitle}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Widgets Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
        {/* Projects by Client */}
        <div className="bg-white dark:bg-card rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-border h-[400px] flex flex-col">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-[13px] font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide">PROJECTS BY CLIENT</h3>
              <p className="text-[12px] text-slate-500 mt-0.5">Overview of project distributions</p>
            </div>
            <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-wider">
              ANALYTICS
            </span>
          </div>
          
          <div className="mb-4">
            <select className="w-48 text-sm border border-border rounded-md px-3 py-1.5 bg-transparent outline-none">
              <option>-- Select Client --</option>
            </select>
          </div>

          <div className="flex-1 min-h-0 relative">
             <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            {/* Custom Legend to match image */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center gap-2">
               <span className="font-bold text-xs">KVM: 1</span>
               <div className="w-8 h-px bg-slate-300"></div>
            </div>
          </div>
        </div>

        {/* Recent Notification */}
        <div className="bg-white dark:bg-card rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-border h-[400px] flex flex-col">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-[13px] font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide">RECENT NOTIFICATION</h3>
              <p className="text-[12px] text-slate-500 mt-0.5">Latest status updates</p>
            </div>
            <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-wider">
              ALERTS
            </span>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
            <BellOff className="h-10 w-10 mb-3 opacity-20" />
            <p className="text-sm font-medium">No notifications available</p>
          </div>
        </div>

        {/* Yesterday Team Activity */}
        <div className="bg-white dark:bg-card rounded-2xl overflow-hidden shadow-sm border border-slate-100 dark:border-border h-[400px] flex flex-col">
          <div className="p-6 pb-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-[13px] font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide">YESTERDAY TEAM ACTIVITY</h3>
                <p className="text-[12px] text-slate-500 mt-0.5">Task submission status</p>
              </div>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-wider">
                TASKS
              </span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#F4F7FE] dark:bg-muted/50 text-slate-600 dark:text-slate-400">
                <tr>
                  <th className="px-6 py-3 font-semibold text-xs uppercase">Name</th>
                  <th className="px-6 py-3 font-semibold text-xs uppercase text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-border">
                {teamActivity.map((user, i) => (
                  <tr key={i} className="hover:bg-slate-50 dark:hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                          <UserCheck className="h-4 w-4" />
                        </div>
                        <span className="font-medium text-blue-600 dark:text-blue-400 cursor-pointer hover:underline">{user.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold bg-red-50 text-red-500 border border-red-100 dark:border-red-900/30">
                        {user.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
