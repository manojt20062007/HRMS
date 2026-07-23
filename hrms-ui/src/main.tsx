import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { API_BASE_URL, getTenantId } from './config.ts'

// Intercept window.fetch globally to inject production API base URL and dynamic x-tenant-id from subdomain
const originalFetch = window.fetch;
window.fetch = async function (input, init) {
  let url = '';
  let requestObj: Request | null = null;
  
  if (typeof input === 'string') {
    url = input;
  } else if (input instanceof URL) {
    url = input.toString();
  } else {
    requestObj = input as Request;
    url = requestObj.url;
  }
  
  // 1. Rewrite localhost backend URLs to the production API_BASE_URL
  if (url.startsWith('http://localhost:3001')) {
    url = url.replace('http://localhost:3001', API_BASE_URL);
  }

  // 2. Auto-inject tenant header
  const newInit = init ? { ...init } : {};
  
  // Handle headers safely
  const plainHeaders: Record<string, string> = {};
  
  // Copy existing headers from init
  if (newInit.headers) {
    if (newInit.headers instanceof Headers) {
      newInit.headers.forEach((value, key) => { plainHeaders[key] = value; });
    } else if (Array.isArray(newInit.headers)) {
      newInit.headers.forEach(([key, value]) => { plainHeaders[key] = value; });
    } else {
      Object.assign(plainHeaders, newInit.headers);
    }
  }

  // Also extract headers if input was a Request object and we don't have init headers
  if (requestObj && !init?.headers) {
    requestObj.headers.forEach((value, key) => { plainHeaders[key] = value; });
  }
  
  if (!plainHeaders['x-tenant-id'] && !plainHeaders['X-Tenant-Id']) {
    plainHeaders['x-tenant-id'] = getTenantId();
  }
  
  newInit.headers = plainHeaders;

  if (requestObj) {
    // If it was a Request object, we must reconstruct it to apply the new URL and headers
    // while preserving method, body, etc.
    return originalFetch.call(this || window, new Request(url, {
      method: requestObj.method,
      headers: plainHeaders,
      body: requestObj.body,
      mode: requestObj.mode,
      credentials: requestObj.credentials,
      cache: requestObj.cache,
      redirect: requestObj.redirect,
      referrer: requestObj.referrer,
      integrity: requestObj.integrity,
    }));
  }

  return originalFetch.call(this || window, url, newInit);
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
