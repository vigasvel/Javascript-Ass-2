import { useCallback, useEffect, useMemo, useState } from 'react';
import { TaskAPI } from '../api';

/**
 * Custom hook (built from useState, useEffect, useCallback, useMemo)
 * Keeps tasks in sync with MongoDB and exposes CRUD helpers.
 */
export default function useTasks() {
  const [tasks, setTasks] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const reload = useCallback(async () => {
    try {
      const [list, subs] = await Promise.all([TaskAPI.all(), TaskAPI.subjects()]);
      setTasks(list);
      setSubjects(subs);
      setError('');
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  // derived numbers are recalculated only when tasks change
  const stats = useMemo(() => {
    const done = tasks.filter((t) => t.status === 'Completed').length;
    const today = new Date().setHours(0, 0, 0, 0);
    return {
      total: tasks.length,
      done,
      progress: tasks.length ? Math.round((done / tasks.length) * 100) : 0,
      overdue: tasks.filter((t) => t.status !== 'Completed' && t.dueDate && new Date(t.dueDate) < today).length,
      high: tasks.filter((t) => t.priority === 'High' && t.status !== 'Completed').length,
    };
  }, [tasks]);

  const act = (fn) => async (...args) => {
    const r = await fn(...args);
    await reload();
    return r;
  };

  return {
    tasks,
    subjects,
    stats,
    loading,
    error,
    addTask: act(TaskAPI.create),
    editTask: act(TaskAPI.update),
    moveTask: act(TaskAPI.setStatus),
    deleteTask: act(TaskAPI.remove),
    clearCompleted: act(TaskAPI.clearCompleted),
  };
}
