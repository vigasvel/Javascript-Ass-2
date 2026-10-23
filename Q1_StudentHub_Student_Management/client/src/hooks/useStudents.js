import { useCallback, useEffect, useState } from 'react';
import http from '../http';

// Custom hook: owns the student list, stats and all CRUD calls
export default function useStudents(filters) {
  const [students, setStudents] = useState([]);
  const [stats, setStats] = useState(null);
  const [busy, setBusy] = useState(false);

  const refresh = useCallback(async () => {
    setBusy(true);
    const params = Object.fromEntries(Object.entries(filters).filter(([, v]) => v));
    const [list, st] = await Promise.all([http.get('/students', { params }), http.get('/students/stats')]);
    setStudents(list.data);
    setStats(st.data);
    setBusy(false);
  }, [filters]);

  useEffect(() => {
    refresh().catch(() => setBusy(false));
  }, [refresh]);

  const addStudent = async (data) => {
    await http.post('/students', data);
    await refresh();
  };
  const updateStudent = async (id, data) => {
    await http.put(`/students/${id}`, data);
    await refresh();
  };
  const deleteStudent = async (id) => {
    const { data } = await http.delete(`/students/${id}`);
    await refresh();
    return data.message;
  };

  return { students, stats, busy, addStudent, updateStudent, deleteStudent };
}
