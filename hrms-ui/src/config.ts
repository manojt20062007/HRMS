// API configurations for Development and Production
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Resolves tenant name from subdomain (e.g., pmj.pmj.vercel.app -> pmj.com)
export const getTenantId = (): string => {
  const hostname = window.location.hostname; // e.g. pmj.pmj.vercel.app or localhost
  
  // If running on localhost or IP address, look at localStorage or fallback
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return localStorage.getItem('hrms_tenant_dev') || 'pmj.com';
  }

  // Split hostname parts
  const parts = hostname.split('.');
  
  if (parts.length > 2) {
    let subdomain = parts[0].toLowerCase();
    // If the subdomain contains a hyphen (e.g. pmj-pmjhrms), extract the tenant prefix
    if (subdomain.includes('-')) {
      subdomain = subdomain.split('-')[0];
    }
    return `${subdomain}.com`;
  }

  // Fallback default
  return 'pmj.com';
};
