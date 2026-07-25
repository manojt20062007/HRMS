import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Building2, Globe, Database, ArrowRight, Server } from 'lucide-react';
import { API_BASE_URL, getBaseDomain } from '../../config';

export const CreateTenantPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    domain: '',
    schemaName: '',
    tenantLimit: 50,
    subscriptionDate: new Date().toISOString().split('T')[0]
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
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
        }
      } catch (e) {
        navigate('/');
      }
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/system/tenants`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Important: Super admin auth token goes here in reality
          'Authorization': `Bearer ${localStorage.getItem('hrms_token')}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create tenant');
      }

      setSuccess(data);
      setFormData({ name: '', domain: '', schemaName: '', tenantLimit: 50, subscriptionDate: new Date().toISOString().split('T')[0] });
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Provision New Tenant</h1>
        <p className="text-slate-500 mt-1">Create a new isolated environment for a company</p>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Company Name</label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. ENL Corporation"
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-slate-900 dark:border-slate-700 dark:text-white"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Tenant Prefix (Domain)</label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  required
                  value={formData.domain}
                  onChange={e => {
                    const val = e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '');
                    setFormData({ ...formData, domain: val, schemaName: val ? `schema_${val}` : '' });
                  }}
                  placeholder="e.g. enl"
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-slate-900 dark:border-slate-700 dark:text-white"
                />
              </div>
              <p className="text-xs text-slate-500">Users will login via <strong>{formData.domain || 'prefix'}.{getBaseDomain()}</strong></p>
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Database Schema Name</label>
              <div className="relative">
                <Database className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  required
                  value={formData.schemaName}
                  onChange={e => setFormData({ ...formData, schemaName: e.target.value })}
                  placeholder="e.g. schema_enl"
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-slate-900 dark:border-slate-700 dark:text-white"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Employee Limit</label>
              <input
                type="number"
                required
                min="1"
                value={formData.tenantLimit}
                onChange={e => setFormData({ ...formData, tenantLimit: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-slate-900 dark:border-slate-700 dark:text-white"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Subscription Date</label>
              <input
                type="date"
                required
                value={formData.subscriptionDate}
                onChange={e => setFormData({ ...formData, subscriptionDate: e.target.value })}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-slate-900 dark:border-slate-700 dark:text-white"
              />
            </div>
          </div>

          {error && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
              {error}
            </motion.div>
          )}

          {success && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 rounded-lg bg-green-50 border border-green-200 space-y-2">
              <h3 className="text-green-800 font-medium flex items-center gap-2">
                <Server className="h-5 w-5" />
                Tenant Provisioned Successfully!
              </h3>
              <p className="text-green-700 text-sm">
                The database schema <strong>{success.tenant.schemaName}</strong> has been created and migrated.
              </p>
              <p className="text-green-700 text-sm">
                Default Admin Login: <strong>{success.defaultAdmin}</strong> / <strong>admin123</strong>
              </p>
            </motion.div>
          )}

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              {isLoading ? (
                <>Provisioning Environment...</>
              ) : (
                <>
                  Create Tenant
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
