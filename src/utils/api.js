let envUrl = import.meta.env.VITE_API_URL || '';
const isProd = import.meta.env.PROD || window.location.hostname !== 'localhost';
const PROD_URL = '/api';

// Protocol Hardening: Ensure https:// is always present in production if an explicit URL is provided
if (isProd && envUrl && !envUrl.startsWith('http') && !envUrl.startsWith('/')) {
  envUrl = `https://${envUrl}`;
}

const BASE_URL = envUrl || (isProd ? PROD_URL : 'http://localhost:5000/api');

if (isProd && !envUrl) {
  console.warn('[CORE] VITE_API_URL is missing. Using relative path /api.');
}

async function request(path, options = {}) {
  const token = localStorage.getItem('taskgh_token');
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const response = await fetch(`${BASE_URL}${path}`, { ...options, headers });
  
  let data;
  try {
    data = await response.json();
  } catch (err) {
    throw new Error('Server returned an invalid JSON response.');
  }
  
  if (!response.ok) {
    throw new Error(data.message || 'API request failed');
  }
  
  return data;
}

export const api = {
  get: (path) => request(path, { method: 'GET' }),
  post: (path, body) => request(path, { method: 'POST', body: JSON.stringify(body) }),
  patch: (path, body) => request(path, { method: 'PATCH', body: JSON.stringify(body) }),
  delete: (path) => request(path, { method: 'DELETE' }),
};
