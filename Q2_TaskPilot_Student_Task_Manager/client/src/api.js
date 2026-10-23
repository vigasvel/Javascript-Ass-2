import axios from 'axios';

const api = axios.create({ baseURL: '/api/tasks' });

api.interceptors.response.use(
  (r) => r.data,
  (err) => {
    const d = err.response?.data;
    return Promise.reject(new Error(d?.errors ? Object.values(d.errors).join(', ') : d?.message || err.message));
  }
);

export const TaskAPI = {
  all: (params) => api.get('/', { params }),
  subjects: () => api.get('/subjects'),
  create: (task) => api.post('/', task),
  update: (id, task) => api.put(`/${id}`, task),
  setStatus: (id, status) => api.patch(`/${id}/status`, { status }),
  remove: (id) => api.delete(`/${id}`),
  clearCompleted: () => api.delete('/', { params: { status: 'Completed' } }),
};
