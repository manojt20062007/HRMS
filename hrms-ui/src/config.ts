// API configurations for Development and Production
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Resolves tenant name from subdomain (e.g., pmj.pmj.vercel.app -> pmj)
export const getTenantId = (): string => {
  const hostname = window.location.hostname; // e.g. pmj.localhost, pmj.pmj.vercel.app, or localhost
  
  // If running on naked localhost or IP address, look at localStorage or fallback
  if (hostname === 'localhost' || hostname === '127.0.0.1' || !hostname.includes('.')) {
    return localStorage.getItem('hrms_tenant_dev') || 'pmj';
  }

  // Split hostname parts
  const parts = hostname.split('.');
  
  // Handle subdomains like pmj.localhost or pmj.pmj.vercel.app
  if (parts.length >= 2) {
    let subdomain = parts[0].toLowerCase();
    
    // If the subdomain contains a hyphen (e.g. pmj-pmjhrms), extract the tenant prefix
    if (subdomain.includes('-')) {
      subdomain = subdomain.split('-')[0];
    }
    
    // Return just the prefix
    return subdomain;
  }

  // Fallback default
  return 'pmj';
};

export const getBaseDomain = (): string => {
  if (import.meta.env.VITE_BASE_DOMAIN) {
    return import.meta.env.VITE_BASE_DOMAIN;
  }
  
  const hostname = window.location.hostname;
  if (hostname === 'localhost' || hostname === '127.0.0.1') return 'localhost:5173';
  
  const parts = hostname.split('.');
  if (parts.length > 2) {
    // e.g. pmj.my-live-domain.com -> my-live-domain.com
    parts.shift();
    return parts.join('.');
  }
  return hostname;
};
