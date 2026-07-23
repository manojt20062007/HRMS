import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  Menu, X, Bell, LayoutDashboard, Users, Calendar,
  Target, Briefcase, BarChart2, DollarSign, Settings, Grid, ChevronDown, LogOut
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { cn } from '../lib/utils';

const navCategories = [
  {
    name: 'Dashboard',
    path: '/',
    icon: LayoutDashboard,
    isDropdown: false
  },
  {
    name: 'User Management',
    icon: Users,
    isDropdown: true,
    children: [
      { name: 'All Employees', path: '/employees/all' },
      { name: 'Assign Role', path: '/employees/assign-role' },
      { name: 'Assign Project', path: '/employees/assign-project' },
      { name: 'Resignation List', path: '/employee/resignation-list' }
    ]
  },
  {
    name: 'Attendance & Leave',
    icon: Calendar,
    isDropdown: true,
    children: [
      {
        name: 'Leave',

        subChildren: [
          { name: 'Leave Status', path: '/leave/status' },
          { name: 'Leave Requested', path: '/leave/requested' },
          { name: 'Leave Request', path: '/leave/request' },
          { name: 'Holidays', path: '/leave/holidays' },
        ]
      },
      {
        name: 'Attendance Management',

        subChildren: [
          { name: 'Attendance', path: '/attendance/daily' },
          { name: 'Over All Attendance', path: '/attendance/overall' },
          { name: 'Attendance Details', path: '/attendance/details' },
          { name: 'Calendar', path: '/attendance/calendar' }
        ]
      },
      {
        name: 'Worklog Management',

        subChildren: [
          { name: 'Work Log', path: '/worklog/entry' },
          { name: 'Worklog Approval L1', path: '/worklog/l1' },
          { name: 'Worklog Approval L2', path: '/worklog/l2' },
        ]
      },
      {
        name: 'Travel Management',

        subChildren: [
          { name: 'Travel Expenses', path: '/travel/expenses' },
          { name: 'Travel Expenses Approval L1', path: '/travel/l1' },
          { name: 'Travel Expenses Approval L2', path: '/travel/l2' },
        ]
      },
      { name: 'Calendar', path: '/calendar' },
      {
        name: 'Resignation',

        subChildren: [
          { name: 'Resignation', path: '/resignation/apply' },
          { name: 'Resignation L1', path: '/resignation/l1' },
          { name: 'Resignation L2', path: '/resignation/l2' },
          { name: 'Resignation L3', path: '/resignation/l3' },
        ]
      }
    ]
  },
  {
    name: 'Performance Management',
    icon: Target,
    isDropdown: true,
    children: [
      { name: 'Objective User List', path: '/performance/objective-user' },
      { name: 'Objectives Manager Approval', path: '/performance/objective-manager' },
      { name: 'Appraisal Process', path: '/performance/appraisal-process' },
      { name: 'Appraisal User', path: '/performance/appraisal-user' },
      { name: 'Appraisal Manager', path: '/performance/appraisal-manager' },
      { name: 'Appraisal Reviewer', path: '/performance/appraisal-reviewer' },
      { name: 'Appraisal HR Approval', path: '/performance/appraisal-hr' }
    ]
  },
  {
    name: 'Resignation',
    icon: LogOut,
    isDropdown: true,
    children: [
      { name: 'Resignation Approval L1', path: '/resignation/approval-l1' },
      { name: 'Resignation Approval L2', path: '/resignation/approval-l2' }
    ]
  },
  {
    name: 'Recruitment',
    icon: Briefcase,
    isDropdown: true,
    children: [
      { name: 'Staffing Request', path: '/recruitment/staffing-request' },
      { name: 'Staffing Request List', path: '/recruitment/staffing-list' },
      { name: 'Staffing Request List RM', path: '/recruitment/staffing-list-rm' },
      { name: 'Staffing Request List HR Manager', path: '/recruitment/staffing-list-hr' },
      { name: 'Staffing Request List CTO', path: '/recruitment/staffing-list-cto' },
      { name: 'Staffing Request List CEO', path: '/recruitment/staffing-list-ceo' },
      { name: 'Staffing Request List Executor', path: '/recruitment/staffing-list-executor' },
      { name: 'HrScreen List', path: '/recruitment/hrscreen' },
      { name: 'ResumeBank List', path: '/recruitment/resume-bank' },
      { name: 'Interview Panel', path: '/recruitment/interview-panel' },
      { name: 'CAF List', path: '/recruitment/caf' }
    ]
  },
  {
    name: 'Reports',
    icon: BarChart2,
    isDropdown: true,
    children: [
      { name: 'Designation History', path: '/reports/designation' },
      { name: 'Login Report', path: '/reports/login' },
      { name: 'Leave Report', path: '/reports/leave' },
      { name: 'Attendance Report', path: '/reports/attendance' },
      { name: 'Leave Balance', path: '/reports/leave-balance' },
      { name: 'Permission Report', path: '/reports/permission' }
    ]
  },
  {
    name: 'Payroll',
    path: '/payroll',
    icon: DollarSign,
    isDropdown: false
  },
  {
    name: 'Settings',
    icon: Settings,
    isDropdown: true,
    children: [
      { name: 'Role', path: '/settings/role' },
      { name: 'Leave & Time', path: '/settings/leave' },
      {
        name: 'Invoice Client Master',

        subChildren: [
          { name: 'Client List', path: '/settings/client/list' },

        ]
      },
      {
        name: 'Employee Configuration',

        subChildren: [
          { name: 'Designation', path: '/settings/employee/designation' },
          { name: 'Department', path: '/settings/employee/department' },
          { name: 'Employee Visit Master', path: '/settings/employee/visit' }
        ]
      },
      { name: 'Payroll Settings', path: '/settings/payroll-settings' },
      { name: 'Policy Settings', path: '/settings/policy' }
    ]
  },
  {
    name: 'More Menu',
    icon: Grid,
    isDropdown: true,
    children: [
      { name: 'MD Speak', path: '/more/md-speak' },
      { name: 'HR Announcement', path: '/more/hr-announcement' },
      {
        name: 'Source Maintance',

        subChildren: [
          { name: 'Domain Master', path: '/settings/source/domain' },
          { name: 'Source Of Pannel Master', path: '/settings/source/panel' }
        ]
      },
      {
        name: 'Leads',
        subChildren: [
          { name: 'Lead List', path: '/more/leads/list' },
          { name: 'UK Leads List', path: '/more/leads/uk-list' }
        ]
      },
      {
        name: 'Asset Management',
        path: '/more/assets',
        subChildren: [
          { name: 'Asset Master', path: '/more/assets/master' },
          { name: 'Employee Asset', path: '/more/assets/list' }
        ]
      },
      {
        name: 'Project Management',
        subChildren: [
          { name: 'Project Master', path: '/more/projects/master' },
          { name: 'Projects List', path: '/more/projects/list' },
          { name: 'Process Master', path: '/more/projects/process' },
          { name: 'Module Master', path: '/more/projects/module' }
        ]
      },
    ]
  }
];

// Helper to check page permission
const checkPermission = (path: string | undefined): boolean => {
  if (!path) return false;
  if (path === '/') return true; // Everyone can see dashboard index

  // Get user details
  const userStr = localStorage.getItem('hrms_user');
  if (!userStr) return false;

  try {
    const user = JSON.parse(userStr);
    // Super Admins bypass all checks
    if (user.role?.name === 'SUPER_ADMIN') return true;

    // Standardize path key to match matrix page names (remove starting slash)
    const pageKey = path.startsWith('/') ? path.substring(1) : path;
    
    // Check permission list
    const hasRead = user.role?.permissions?.some(
      (p: any) => p.pageName === pageKey && p.canRead
    );
    return !!hasRead;
  } catch {
    return false;
  }
};

export const DashboardLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  // Filter categories and children based on permissions
  const filteredNavCategories = navCategories
    .map(cat => {
      if (!cat.isDropdown) {
        return checkPermission(cat.path) ? cat : null;
      }
      
      // Filter direct children
      const filteredChildren = cat.children?.map(child => {
        // If it has sub-children
        if (child.subChildren) {
          const filteredSubs = child.subChildren.filter(sub => checkPermission(sub.path));
          if (filteredSubs.length > 0) {
            return { ...child, subChildren: filteredSubs };
          }
          return null;
        }
        // Normal child
        return checkPermission(child.path) ? child : null;
      }).filter(Boolean);

      if (filteredChildren && filteredChildren.length > 0) {
        return { ...cat, children: filteredChildren };
      }
      return null;
    })
    .filter(Boolean) as typeof navCategories;

  return (
    <div className="min-h-screen bg-[#F4F7FE] dark:bg-background flex flex-col font-sans">
      {/* Top Navigation */}
      <header className="sticky top-0 z-40 w-full bg-white dark:bg-card border-b border-border shadow-sm">
        <div className="w-full flex h-14 items-center justify-between px-4 lg:px-8">
          <div className="flex items-center gap-4">
            <button
              onClick={toggleMobileMenu}
              className="lg:hidden p-2 text-muted-foreground hover:text-foreground"
            >
              <Menu className="h-6 w-6" />
            </button>

            <div className="flex items-center gap-2 font-bold text-xl tracking-tight text-primary cursor-pointer" onClick={() => navigate('/')}>
              {/*<div className="h-8 w-8 bg-indigo-600 rounded-md flex items-center justify-center shadow-md">*/}

              {/*</div>*/}
              <span className="hidden sm:inline-block text-indigo-900 dark:text-white">
                {(() => {
                  const hostname = window.location.hostname;
                  if (hostname === 'localhost' || hostname === '127.0.0.1') {
                    // Default to PMJ on localhost
                    return 'PMJ HRMS';
                  }
                  const parts = hostname.split('.');
                  if (parts.length > 2) {
                    let subdomain = parts[0].toLowerCase();
                    if (subdomain.includes('-')) {
                      subdomain = subdomain.split('-')[0];
                    }
                    return `${subdomain.toUpperCase()} HRMS`;
                  }
                  return 'PMJ HRMS';
                })()}
              </span>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center ml-4 gap-1">
              {filteredNavCategories.map((cat, i) => {
                if (!cat.isDropdown) {
                  return (
                    <NavLink
                      key={i}
                      to={cat.path!}
                      className={({ isActive }) =>
                        cn(
                          "px-2.5 py-1.5 rounded-md text-[13px] font-medium transition-colors flex flex-row items-center gap-2 whitespace-nowrap flex-shrink-0",
                          isActive ? "bg-[#C0A3FF] text-slate-900" : "text-slate-700 hover:bg-[#C0A3FF] hover:text-slate-900"
                        )
                      }
                    >
                      <cat.icon className="h-4 w-4 flex-shrink-0" />
                      <span>{cat.name}</span>
                    </NavLink>
                  );
                }

                return (
                  <div key={i} className="relative group">
                    <button className="px-2.5 py-1.5 rounded-md text-[13px] font-medium text-slate-700 transition-colors group-hover:bg-[#C0A3FF] group-hover:text-slate-900 flex flex-row items-center gap-1.5 outline-none whitespace-nowrap flex-shrink-0">
                      <cat.icon className="h-4 w-4 flex-shrink-0" />
                      <span>{cat.name}</span>
                      <ChevronDown className="h-3 w-3 opacity-50 flex-shrink-0" />
                    </button>

                    <div className="absolute left-0 top-full pt-1 hidden group-hover:block z-50">
                      <div className="min-w-[220px] bg-white border border-border rounded-xl shadow-xl p-1.5 animate-fade-in">
                        {cat.children?.map((child, j) => (
                          <div key={j} className="relative group/subitem">
                            <NavLink
                              to={child.path || '#'}
                              className={({ isActive }) => cn(
                                "flex items-center justify-between px-3 py-2 text-[13px] rounded-lg cursor-pointer outline-none transition-colors group/link relative",
                                isActive && !child.subChildren ? "text-indigo-600 font-semibold bg-indigo-50" : "text-slate-700 hover:bg-[#E3D4FF] hover:text-slate-900 group-hover/subitem:bg-[#E3D4FF] group-hover/subitem:text-slate-900"
                              )}
                            >
                              <div className="flex items-center gap-2.5">
                                <div className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-slate-300 group-hover/subitem:bg-slate-800 transition-colors" />
                                <span className="whitespace-nowrap">{child.name}</span>
                              </div>
                              {child.subChildren && (
                                <ChevronDown className="h-3 w-3 opacity-50" />
                              )}
                            </NavLink>

                            {child.subChildren && (
                              <div className="absolute left-full top-0 pl-1 hidden group-hover/subitem:block z-50">
                                <div className="min-w-[200px] bg-white border border-border rounded-xl shadow-xl p-1.5 animate-fade-in">
                                  {child.subChildren.map((sub: any, k) => (
                                    <NavLink
                                      key={k}
                                      to={sub.path}
                                      className={({ isActive }) => cn(
                                        "block px-3 py-2 text-[13px] rounded-lg cursor-pointer outline-none hover:bg-slate-50 transition-colors group/sublink relative",
                                        isActive ? "text-indigo-600 font-semibold bg-indigo-50" : "text-slate-700"
                                      )}
                                    >
                                      <div className="flex items-center gap-2.5">
                                        <div className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-slate-300 group-hover/sublink:bg-[#C0A3FF] transition-colors" />
                                        <span className="whitespace-nowrap">{sub.name}</span>
                                      </div>
                                    </NavLink>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <button className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-full hover:bg-slate-100 dark:hover:bg-muted transition-colors relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500"></span>
            </button>

            {/* Profile Dropdown */}
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <button className="h-8 w-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold border border-indigo-200 focus:outline-none hover:bg-indigo-200 transition-colors">
                  {(() => {
                    const userStr = localStorage.getItem('hrms_user');
                    if (userStr) {
                      try {
                        const u = JSON.parse(userStr);
                        return u.email?.substring(0, 1).toUpperCase() || 'U';
                      } catch {
                        return 'U';
                      }
                    }
                    return 'U';
                  })()}
                </button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Portal>
                <DropdownMenu.Content
                  align="end"
                  sideOffset={8}
                  className="min-w-[200px] bg-white dark:bg-card border border-border rounded-xl shadow-lg p-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                >
                  <div className="px-3 py-2 border-b border-border mb-1">
                    <p className="text-xs text-slate-400">Signed in as</p>
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">
                      {(() => {
                        const userStr = localStorage.getItem('hrms_user');
                        if (userStr) {
                          try {
                            return JSON.parse(userStr).email;
                          } catch {
                            return 'User';
                          }
                        }
                        return 'User';
                      })()}
                    </p>
                  </div>
                  <DropdownMenu.Item
                    onClick={() => {
                      localStorage.removeItem('hrms_token');
                      localStorage.removeItem('hrms_user');
                      navigate('/login');
                    }}
                    className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg cursor-pointer focus:outline-none transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggleMobileMenu}
              className="fixed inset-0 z-50 bg-black/40 lg:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', bounce: 0, duration: 0.3 }}
              className="fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-card border-r border-border lg:hidden overflow-y-auto pb-20"
            >
              <div className="p-4 flex items-center justify-between border-b border-border sticky top-0 bg-white dark:bg-card">
                <span className="font-bold text-lg text-indigo-900 dark:text-white">HRMS Menu</span>
                <button onClick={toggleMobileMenu} className="p-2 text-slate-500 hover:text-slate-900">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="p-3 flex flex-col gap-1">
                {filteredNavCategories.map((cat, i) => (
                  <div key={i} className="mb-2">
                    {cat.isDropdown ? (
                      <div>
                        <div className="flex items-center gap-3 px-3 py-2 text-[14px] font-semibold text-slate-800 dark:text-slate-200 uppercase tracking-wider mt-4 mb-1">
                          <cat.icon className="h-4 w-4" />
                          {cat.name}
                        </div>
                        <div className="flex flex-col ml-4 border-l-2 border-slate-100 dark:border-slate-800 pl-2">
                          {cat.children?.map((child, j) => (
                            <NavLink
                              key={j}
                              to={child.path || '#'}
                              onClick={() => setIsMobileMenuOpen(false)}
                              className={({ isActive }) => cn(
                                "py-2 px-3 text-[14px] rounded-md transition-colors",
                                isActive ? "text-indigo-600 font-medium bg-indigo-50 dark:bg-muted dark:text-indigo-400" : "text-slate-600 hover:text-slate-900 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-muted"
                              )}
                            >
                              {child.name}
                            </NavLink>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <NavLink
                        to={cat.path!}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={({ isActive }) => cn(
                          "flex items-center gap-3 px-3 py-3 rounded-md text-[14px] font-medium transition-colors mt-2",
                          isActive ? "bg-indigo-50 text-indigo-700 dark:bg-muted dark:text-white" : "text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-muted"
                        )}
                      >
                        <cat.icon className="h-5 w-5" />
                        {cat.name}
                      </NavLink>
                    )}
                  </div>
                ))}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <main className="flex-1 overflow-x-hidden">
        <div className="w-full p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
