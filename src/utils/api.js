// src/utils/api.js
const BASE_URL = 'http://localhost:5000/api';

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
