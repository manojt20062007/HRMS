import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Shield, Check, X, ChevronDown, ChevronUp, Trash2, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// All application pages grouped by module
const ALL_PAGES = [
  {
    module: 'Dashboard',
    pages: [
      { key: 'dashboard', label: 'Dashboard', path: '/' },
    ]
  },
  {
    module: 'Employees',
    pages: [
      { key: 'employees/all', label: 'All Employees', path: 'employees/all' },
      { key: 'employees/new', label: 'Add Employee', path: 'employees/new' },
      { key: 'employees/assign-role', label: 'Assign Role', path: 'employees/assign-role' },
      { key: 'employees/assign-project', label: 'Assign Project', path: 'employees/assign-project' },
    ]
  },
  {
    module: 'Leave & Attendance',
    pages: [
      { key: 'leave/holidays', label: 'Holidays', path: 'leave/holidays' },
      { key: 'leave/status', label: 'Leave Status', path: 'leave/status' },
      { key: 'leave/requested', label: 'Leave Requested', path: 'leave/requested' },
      { key: 'leave/request', label: 'Apply Leave', path: 'leave/request' },
      { key: 'attendance/daily', label: 'Daily Attendance', path: 'attendance/daily' },
      { key: 'attendance/overall', label: 'Overall Attendance', path: 'attendance/overall' },
      { key: 'attendance/details', label: 'Attendance Details', path: 'attendance/details' },
    ]
  },
  {
    module: 'Travel',
    pages: [
      { key: 'travel/expenses', label: 'Travel Expenses', path: 'travel/expenses' },
      { key: 'travel/l1', label: 'Travel Approval L1', path: 'travel/l1' },
      { key: 'travel/l2', label: 'Travel Approval L2', path: 'travel/l2' },
    ]
  },
  {
    module: 'Performance',
    pages: [
      { key: 'performance/objective-user', label: 'Objectives (User)', path: 'performance/objective-user' },
      { key: 'performance/objective-manager', label: 'Objectives (Manager)', path: 'performance/objective-manager' },
      { key: 'performance/appraisal-process', label: 'Appraisal Process', path: 'performance/appraisal-process' },
      { key: 'performance/appraisal-user', label: 'Appraisal (User)', path: 'performance/appraisal-user' },
      { key: 'performance/appraisal-manager', label: 'Appraisal (Manager)', path: 'performance/appraisal-manager' },
      { key: 'performance/appraisal-reviewer', label: 'Appraisal (Reviewer)', path: 'performance/appraisal-reviewer' },
      { key: 'performance/appraisal-hr', label: 'Appraisal (HR)', path: 'performance/appraisal-hr' },
    ]
  },
  {
    module: 'Recruitment',
    pages: [
      { key: 'recruitment/staffing-request', label: 'Staffing Request', path: 'recruitment/staffing-request' },
      { key: 'recruitment/staffing-list', label: 'Staffing List', path: 'recruitment/staffing-list' },
      { key: 'recruitment/hrscreen', label: 'HR Screen', path: 'recruitment/hrscreen' },
      { key: 'recruitment/resume-bank', label: 'Resume Bank', path: 'recruitment/resume-bank' },
      { key: 'recruitment/interview-panel', label: 'Interview Panel', path: 'recruitment/interview-panel' },
      { key: 'recruitment/caf', label: 'CAF', path: 'recruitment/caf' },
    ]
  },
  {
    module: 'Payroll',
    pages: [
      { key: 'payroll', label: 'Payroll', path: 'payroll' },
    ]
  },
  {
    module: 'Reports',
    pages: [
      { key: 'reports/designation', label: 'Designation History', path: 'reports/designation' },
      { key: 'reports/login', label: 'Login Report', path: 'reports/login' },
      { key: 'reports/leave', label: 'Leave Report', path: 'reports/leave' },
      { key: 'reports/attendance', label: 'Attendance Report', path: 'reports/attendance' },
      { key: 'reports/leave-balance', label: 'Leave Balance', path: 'reports/leave-balance' },
      { key: 'reports/permission', label: 'Permission Report', path: 'reports/permission' },
    ]
  },
  {
    module: 'Settings',
    pages: [
      { key: 'settings/role', label: 'Roles', path: 'settings/role' },
      { key: 'settings/leave', label: 'Leave Settings', path: 'settings/leave' },
      { key: 'settings/client/list', label: 'Client Master', path: 'settings/client/list' },
      { key: 'settings/employee/designation', label: 'Designation Settings', path: 'settings/employee/designation' },
      { key: 'settings/employee/department', label: 'Department Settings', path: 'settings/employee/department' },
    ]
  },
];

// Build initial permissions object: { [pageKey]: { canRead: false, canWrite: false } }
const buildDefaultPermissions = (existing?: any[]) => {
  const perms: Record<string, { canRead: boolean; canWrite: boolean }> = {};
  ALL_PAGES.forEach(group => {
    group.pages.forEach(p => {
      const found = existing?.find((e: any) => e.pageName === p.key);
      perms[p.key] = {
        canRead: found?.canRead ?? false,
        canWrite: found?.canWrite ?? false,
      };
    });
  });
  return perms;
};

// Permission row for a single page
const PermRow = ({
  page,
  perms,
  onChange,
}: {
  page: { key: string; label: string };
  perms: { canRead: boolean; canWrite: boolean };
  onChange: (key: string, field: 'canRead' | 'canWrite', val: boolean) => void;
}) => (
  <tr className="hover:bg-slate-50 border-b border-slate-100 last:border-0">
    <td className="px-4 py-2.5 text-sm text-slate-700">{page.label}</td>
    <td className="px-4 py-2.5 text-center">
      <input
        type="checkbox"
        checked={perms.canRead}
        onChange={e => onChange(page.key, 'canRead', e.target.checked)}
        className="w-4 h-4 accent-indigo-600 cursor-pointer"
      />
    </td>
    <td className="px-4 py-2.5 text-center">
      <input
        type="checkbox"
        checked={perms.canWrite}
        onChange={e => onChange(page.key, 'canWrite', e.target.checked)}
        className="w-4 h-4 accent-indigo-600 cursor-pointer"
      />
    </td>
  </tr>
);

// Collapsible module section
const ModuleSection = ({
  module,
  pages,
  perms,
  onChange,
}: {
  module: string;
  pages: { key: string; label: string }[];
  perms: Record<string, { canRead: boolean; canWrite: boolean }>;
  onChange: (key: string, field: 'canRead' | 'canWrite', val: boolean) => void;
}) => {
  const [open, setOpen] = useState(true);
  const allRead = pages.every(p => perms[p.key]?.canRead);
  const allWrite = pages.every(p => perms[p.key]?.canWrite);

  const toggleAll = (field: 'canRead' | 'canWrite', val: boolean) => {
    pages.forEach(p => onChange(p.key, field, val));
  };

  return (
    <div className="mb-3 border border-slate-200 rounded-xl overflow-hidden">
      {/* Module Header */}
      <div
        className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-slate-100 to-slate-50 cursor-pointer select-none"
        onClick={() => setOpen(o => !o)}
      >
        <div className="flex items-center gap-2">
          {open ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
          <span className="font-semibold text-slate-800 text-sm">{module}</span>
          <span className="text-xs text-slate-400">({pages.length} pages)</span>
        </div>
        <div className="flex items-center gap-6 text-xs font-semibold text-slate-500 mr-2">
          <label className="flex items-center gap-1.5 cursor-pointer" onClick={e => e.stopPropagation()}>
            <input type="checkbox" checked={allRead} onChange={e => toggleAll('canRead', e.target.checked)} className="w-4 h-4 accent-indigo-600" />
            All Read
          </label>
          <label className="flex items-center gap-1.5 cursor-pointer" onClick={e => e.stopPropagation()}>
            <input type="checkbox" checked={allWrite} onChange={e => toggleAll('canWrite', e.target.checked)} className="w-4 h-4 accent-indigo-600" />
            All Write
          </label>
        </div>
      </div>

      {open && (
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="px-4 py-2 text-left text-xs font-semibold text-slate-500">Page</th>
              <th className="px-4 py-2 text-center text-xs font-semibold text-indigo-600 w-24">Read</th>
              <th className="px-4 py-2 text-center text-xs font-semibold text-indigo-600 w-24">Write</th>
            </tr>
          </thead>
          <tbody>
            {pages.map(page => (
              <PermRow key={page.key} page={page} perms={perms[page.key] || { canRead: false, canWrite: false }} onChange={onChange} />
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export const RolePage = () => {
  const navigate = useNavigate();
  const [roles, setRoles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Add role state
  const [isAdding, setIsAdding] = useState(false);
  const [newRoleName, setNewRoleName] = useState('');
  const [saving, setSaving] = useState(false);
  const [addError, setAddError] = useState('');

  // Permission editor state
  const [editingRoleId, setEditingRoleId] = useState<string | null>(null);
  const [editingRoleName, setEditingRoleName] = useState('');
  const [permissions, setPermissions] = useState<Record<string, { canRead: boolean; canWrite: boolean }>>({});
  const [savingPerms, setSavingPerms] = useState(false);

  const fetchRoles = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:3001/api/roles', {
        headers: { 'x-tenant-id': 'pmj.com' }
      });
      if (res.ok) setRoles(await res.json());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRoles(); }, []);

  const handleAddRole = async () => {
    if (!newRoleName.trim()) return;
    setSaving(true);
    setAddError('');
    try {
      const res = await fetch('http://localhost:3001/api/roles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-tenant-id': 'pmj.com' },
        body: JSON.stringify({ name: newRoleName.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create role');
      setNewRoleName('');
      setIsAdding(false);
      await fetchRoles();
    } catch (e: any) {
      setAddError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const openPermissionEditor = (role: any) => {
    setEditingRoleId(role.id);
    setEditingRoleName(role.name);
    setPermissions(buildDefaultPermissions(role.permissions));
  };

  const handlePermChange = (key: string, field: 'canRead' | 'canWrite', val: boolean) => {
    setPermissions(prev => ({
      ...prev,
      [key]: { ...prev[key], [field]: val }
    }));
  };

  const handleSavePermissions = async () => {
    if (!editingRoleId) return;
    setSavingPerms(true);
    try {
      const permsArray = Object.entries(permissions)
        .filter(([, v]) => v.canRead || v.canWrite)
        .map(([pageName, v]) => ({ pageName, canRead: v.canRead, canWrite: v.canWrite }));

      const res = await fetch(`http://localhost:3001/api/roles/${editingRoleId}/permissions`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'x-tenant-id': 'pmj.com' },
        body: JSON.stringify({ permissions: permsArray }),
      });
      if (!res.ok) throw new Error('Failed to save permissions');
      setEditingRoleId(null);
      await fetchRoles();
      alert(`Permissions saved for role "${editingRoleName}"!`);
    } catch (e: any) {
      alert(e.message || 'Error saving permissions');
    } finally {
      setSavingPerms(false);
    }
  };

  const handleDeleteRole = async (id: string, name: string) => {
    if (!window.confirm(`Delete role "${name}"? This cannot be undone.`)) return;
    try {
      const res = await fetch(`http://localhost:3001/api/roles/${id}`, {
        method: 'DELETE',
        headers: { 'x-tenant-id': 'pmj.com' },
      });
      if (res.ok) await fetchRoles();
      else alert('Failed to delete role');
    } catch { alert('Network error'); }
  };

  return (
    <div className="max-w-[1600px] mx-auto pb-10">

      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 mb-1 tracking-tight">Role Management</h1>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-emerald-500 font-medium">Settings</span>
            <span className="text-slate-300">›</span>
            <span className="text-slate-500">Role Management</span>
          </div>
        </div>
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 px-4 py-2 bg-white border border-indigo-100 text-indigo-600 rounded-full text-sm font-semibold hover:bg-indigo-50 shadow-sm transition-colors mt-2">
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_1.6fr] gap-6">

        {/* LEFT — Role List */}
        <div className="bg-white border border-border shadow-sm rounded-xl overflow-hidden">
          {/* Header bar */}
          <div className="h-14 bg-gradient-to-r from-[#9db7d3] to-[#a2dfc8] px-4 flex items-center justify-between">
            <div className="flex items-center gap-2 text-white font-semibold text-sm">
              <Shield className="h-4 w-4" />
              Roles
            </div>
            <button
              onClick={() => { setIsAdding(true); setNewRoleName(''); setAddError(''); }}
              className="flex items-center gap-2 px-4 py-2 bg-white text-indigo-600 rounded-full text-sm font-semibold hover:bg-slate-50 shadow-sm transition-colors"
            >
              <Plus className="h-4 w-4" /> Create Role
            </button>
          </div>

          {/* Inline Add Form */}
          {isAdding && (
            <div className="p-4 bg-indigo-50 border-b border-indigo-100 space-y-2">
              <label className="text-xs font-semibold text-slate-600">Role Name <span className="text-red-500">*</span></label>
              <div className="flex gap-2">
                <input
                  type="text"
                  autoFocus
                  value={newRoleName}
                  onChange={e => setNewRoleName(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleAddRole()}
                  placeholder="e.g. MANAGER, HR, ACCOUNTANT"
                  className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:border-indigo-500 bg-white uppercase"
                />
                <button
                  onClick={handleAddRole}
                  disabled={saving || !newRoleName.trim()}
                  className="flex items-center gap-1 px-4 py-2 bg-[#0d9488] text-white rounded-lg text-sm font-medium hover:bg-teal-700 disabled:opacity-50"
                >
                  <Check className="h-4 w-4" /> {saving ? 'Saving...' : 'Save'}
                </button>
                <button onClick={() => setIsAdding(false)} className="px-3 py-2 border border-slate-300 text-slate-500 rounded-lg text-sm hover:bg-slate-100">
                  <X className="h-4 w-4" />
                </button>
              </div>
              {addError && <p className="text-xs text-red-600">{addError}</p>}
            </div>
          )}

          {/* Role Table */}
          <table className="w-full text-sm">
            <thead className="bg-[#f0f4f8] border-b border-border">
              <tr>
                <th className="px-5 py-3 font-semibold text-slate-700 text-left">Role Name</th>
                <th className="px-5 py-3 font-semibold text-slate-700 text-center">Pages Allowed</th>
                <th className="px-5 py-3 font-semibold text-slate-700 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr><td colSpan={3} className="px-6 py-8 text-slate-500 text-center">Loading roles...</td></tr>
              ) : roles.length === 0 ? (
                <tr><td colSpan={3} className="px-6 py-8 text-slate-400 text-center">No roles yet. Click "Create Role" to add one.</td></tr>
              ) : (
                roles.map(role => (
                  <tr
                    key={role.id}
                    className={`hover:bg-slate-50 cursor-pointer transition-colors ${editingRoleId === role.id ? 'bg-indigo-50 border-l-4 border-l-indigo-500' : ''}`}
                  >
                    <td className="px-5 py-4 font-semibold text-slate-800">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold">
                          {role.name[0]}
                        </div>
                        {role.name}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-center">
                      <span className="inline-block px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-full">
                        {role.permissions?.length || 0} pages
                      </span>
                    </td>
                    <td className="px-5 py-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => openPermissionEditor(role)}
                          className="flex items-center gap-1 px-2.5 py-1 text-indigo-600 hover:bg-indigo-50 rounded-lg text-xs font-medium transition-colors"
                          title="Manage Permissions"
                        >
                          <Settings className="h-3.5 w-3.5" /> Permissions
                        </button>
                        <button
                          onClick={() => handleDeleteRole(role.id, role.name)}
                          className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Role"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* RIGHT — Permission Editor */}
        <div className="bg-white border border-border shadow-sm rounded-xl overflow-hidden">
          <div className="h-14 bg-gradient-to-r from-indigo-500 to-teal-500 px-4 flex items-center justify-between">
            <div className="text-white font-semibold text-sm">
              {editingRoleId
                ? <>Permissions for: <span className="bg-white/20 px-2 py-0.5 rounded-full ml-1">{editingRoleName}</span></>
                : 'Select a role to manage permissions'}
            </div>
            {editingRoleId && (
              <div className="flex gap-2">
                <button
                  onClick={() => setEditingRoleId(null)}
                  className="px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white rounded-lg text-xs font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSavePermissions}
                  disabled={savingPerms}
                  className="flex items-center gap-1.5 px-4 py-1.5 bg-white text-indigo-700 rounded-lg text-xs font-semibold hover:bg-indigo-50 disabled:opacity-60 transition-colors shadow"
                >
                  <Check className="h-3.5 w-3.5" />
                  {savingPerms ? 'Saving...' : 'Save Permissions'}
                </button>
              </div>
            )}
          </div>

          {!editingRoleId ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-3">
              <Shield className="w-12 h-12 opacity-30" />
              <p className="text-sm">Click the <strong className="text-slate-600">Permissions</strong> button on any role to configure page access.</p>
            </div>
          ) : (
            <div className="p-5 overflow-y-auto max-h-[70vh]">
              {/* Select All / Clear All */}
              <div className="flex gap-3 mb-4">
                <button
                  onClick={() => {
                    const all: Record<string, { canRead: boolean; canWrite: boolean }> = {};
                    ALL_PAGES.forEach(g => g.pages.forEach(p => { all[p.key] = { canRead: true, canWrite: true }; }));
                    setPermissions(all);
                  }}
                  className="px-3 py-1.5 text-xs font-medium bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition-colors"
                >
                  ✓ Grant All
                </button>
                <button
                  onClick={() => setPermissions(buildDefaultPermissions([]))}
                  className="px-3 py-1.5 text-xs font-medium bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                >
                  ✕ Clear All
                </button>
              </div>

              {ALL_PAGES.map(group => (
                <ModuleSection
                  key={group.module}
                  module={group.module}
                  pages={group.pages}
                  perms={permissions}
                  onChange={handlePermChange}
                />
              ))}

              <div className="flex justify-end mt-4">
                <button
                  onClick={handleSavePermissions}
                  disabled={savingPerms}
                  className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 disabled:opacity-60 transition-colors shadow-md"
                >
                  <Check className="h-4 w-4" />
                  {savingPerms ? 'Saving...' : 'Save Permissions'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
