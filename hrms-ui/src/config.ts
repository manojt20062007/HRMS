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
  
  // If we have a subdomain prefix (e.g. sub.domain.com)
  if (parts.length > 2) {
    const subdomain = parts[0].toLowerCase();
    // Return standard domain suffix format to match database schema
    return `${subdomain}.com`;
  }

  // Fallback default
  return 'pmj.com';
};
