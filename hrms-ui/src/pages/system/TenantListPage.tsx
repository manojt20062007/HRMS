import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL, getBaseDomain } from '../../config';
import { Building2, Edit2, ShieldAlert, CheckCircle, XCircle } from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';

export const TenantListPage = () => {
  const [tenants, setTenants] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingTenant, setEditingTenant] = useState<any>(null);
  
  const [editForm, setEditForm] = useState({
    tenantLimit: 50,
    subscriptionDate: '',
    status: 'ACTIVE'
  });
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Security check
    const userStr = localStorage.getItem('hrms_user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        const hasUniversalAdmin = user.roles?.some((r: any) => r?.name === 'UNIVERSAL_ADMIN' || r === 'UNIVERSAL_ADMIN') 
          || user.role?.name === 'UNIVERSAL_ADMIN' 
          || user.roleName === 'UNIVERSAL_ADMIN'
          || user.role === 'UNIVERSAL_ADMIN';
          
        if (!hasUniversalAdmin) {
          navigate('/');
          return;
        }
      } catch (e) {
        navigate('/');
        return;
      }
    } else {
      navigate('/login');
      return;
    }

    fetchTenants();
  }, [navigate]);

  const fetchTenants = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/system/tenants`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('hrms_token')}`
        }
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to fetch');
      setTenants(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const openEditModal = (t: any) => {
    setEditingTenant(t);
    setEditForm({
      tenantLimit: t.tenantLimit || 50,
      subscriptionDate: t.subscriptionDate ? new Date(t.subscriptionDate).toISOString().split('T')[0] : '',
      status: t.status || 'ACTIVE'
    });
  };

  const handleSave = async () => {
    if (!editingTenant) return;
    setIsSaving(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/system/tenants/${editingTenant.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('hrms_token')}`
        },
        body: JSON.stringify(editForm)
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to update');
      
      // Update local state
      setTenants(prev => prev.map(t => t.id === editingTenant.id ? { ...t, ...editForm } : t));
      setEditingTenant(null);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className="p-8 text-center text-slate-500">Loading tenants...</div>;
  if (error) return <div className="p-8 text-center text-red-500">Error: {error}</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldAlert className="h-6 w-6 text-indigo-600" />
            Universal Admin - Tenant List
          </h1>
          <p className="text-slate-500 mt-1">Manage global SaaS tenants, limits, and subscriptions.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 text-sm font-medium text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
                <th className="px-6 py-4">Company Name</th>
                <th className="px-6 py-4">Domain</th>
                <th className="px-6 py-4">Limit</th>
                <th className="px-6 py-4">Subscription</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {tenants.map(t => (
                <tr key={t.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900 dark:text-white flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-slate-400" />
                    {t.name}
                  </td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                    <span className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-xs font-mono">
                      {t.domain}.{getBaseDomain()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                    {t.tenantLimit} users
                  </td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                    {t.subscriptionDate ? new Date(t.subscriptionDate).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="px-6 py-4">
                    {t.status === 'ACTIVE' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                        <CheckCircle className="h-3 w-3" /> Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400">
                        <XCircle className="h-3 w-3" /> Inactive
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => openEditModal(t)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-950/50 rounded-lg transition-colors"
                    >
                      <Edit2 className="h-4 w-4" /> Edit
                    </button>
                  </td>
                </tr>
              ))}
              {tenants.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    No tenants provisioned yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal using Radix UI Dialog */}
      <Dialog.Root open={!!editingTenant} onOpenChange={(open) => !open && setEditingTenant(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-in fade-in" />
          <Dialog.Content className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] bg-white dark:bg-slate-900 rounded-xl shadow-2xl p-6 w-full max-w-md z-50 border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 fade-in">
            <Dialog.Title className="text-xl font-bold text-slate-900 dark:text-white mb-4">
              Edit Tenant: {editingTenant?.name}
            </Dialog.Title>
            
            <div className="space-y-4 my-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Employee Limit</label>
                <input
                  type="number"
                  value={editForm.tenantLimit}
                  onChange={e => setEditForm({...editForm, tenantLimit: parseInt(e.target.value) || 0})}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Subscription Date</label>
                <input
                  type="date"
                  value={editForm.subscriptionDate}
                  onChange={e => setEditForm({...editForm, subscriptionDate: e.target.value})}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Status</label>
                <select
                  value={editForm.status}
                  onChange={e => setEditForm({...editForm, status: e.target.value})}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="INACTIVE">INACTIVE</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button 
                onClick={() => setEditingTenant(null)}
                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium transition-colors"
                disabled={isSaving}
              >
                Cancel
              </button>
              <button 
                onClick={handleSave}
                disabled={isSaving}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

    </div>
  );
};
