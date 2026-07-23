import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { API_BASE_URL, getTenantId } from './config.ts'

// Intercept window.fetch globally to inject production API base URL and dynamic x-tenant-id from subdomain
const originalFetch = window.fetch;
window.fetch = async (input, init) => {
  let url = '';
  if (typeof input === 'string') {
    url = input;
  } else if (input instanceof URL) {
    url = input.toString();
  } else {
    url = input.url;
  }
  
  // 1. Rewrite localhost backend URLs to the production API_BASE_URL
  if (url.startsWith('http://localhost:3001')) {
    url = url.replace('http://localhost:3001', API_BASE_URL);
  }

  // 2. Auto-inject tenant header
  const newInit = { ...init };
  const headers = new Headers(newInit.headers || {});
  
  if (!headers.has('x-tenant-id')) {
    headers.set('x-tenant-id', getTenantId());
  }
  newInit.headers = headers;

  return originalFetch(url, newInit);
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
