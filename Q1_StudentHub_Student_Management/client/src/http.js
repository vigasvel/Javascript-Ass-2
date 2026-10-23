import axios from 'axios';

// axios instance - every request goes to /api (proxied to port 5011 by Vite)
const http = axios.create({ baseURL: '/api' });

// convert server errors into a single readable message
http.interceptors.response.use(
  (res) => res,
  (err) => {
    const d = err.response?.data;
    const fieldErrors = d?.errors ? Object.values(d.errors).join(' • ') : '';
    return Promise.reject(new Error(fieldErrors || d?.message || err.message));
  }
);

export default http;
